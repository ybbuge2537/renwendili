const express = require('express');
const UserModel = require('../models/UserModel.js');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      pageSize: parseInt(req.query.pageSize) || 20,
      role_id: req.query.role_id ? parseInt(req.query.role_id) : undefined,
      certification_status: req.query.certification_status,
      is_enabled: req.query.is_enabled !== undefined ? req.query.is_enabled === 'true' : undefined,
      keyword: req.query.keyword
    };
    
    const result = await UserModel.getAllUsers(filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: '获取用户列表失败', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await UserModel.getUserById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: '用户不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '获取用户失败', error: error.message });
  }
});

router.get('/username/:username', async (req, res) => {
  try {
    const user = await UserModel.getUserByUsername(req.params.username);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: '用户不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '获取用户失败', error: error.message });
  }
});

router.get('/email/:email', async (req, res) => {
  try {
    const user = await UserModel.getUserByEmail(req.params.email);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: '用户不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '获取用户失败', error: error.message });
  }
});

router.get('/phone/:phone', async (req, res) => {
  try {
    const user = await UserModel.getUserByPhone(req.params.phone);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: '用户不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '获取用户失败', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newUser = await UserModel.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: '创建用户失败', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await UserModel.updateUser(req.params.id, req.body);
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: '用户不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '更新用户失败', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await UserModel.deleteUser(req.params.id);
    if (result) {
      res.json({ message: '用户删除成功' });
    } else {
      res.status(404).json({ message: '用户不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '删除用户失败', error: error.message });
  }
});

router.post('/:id/restore', async (req, res) => {
  try {
    const result = await UserModel.restoreUser(req.params.id);
    if (result) {
      res.json({ message: '用户恢复成功' });
    } else {
      res.status(404).json({ message: '用户不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '恢复用户失败', error: error.message });
  }
});

router.get('/role/:roleId', async (req, res) => {
  try {
    const users = await UserModel.getUsersByRole(req.params.roleId);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: '获取角色用户失败', error: error.message });
  }
});

router.get('/certification/:status', async (req, res) => {
  try {
    const users = await UserModel.getUsersByCertificationStatus(req.params.status);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: '获取认证用户失败', error: error.message });
  }
});

router.get('/:id/stats', async (req, res) => {
  try {
    const stats = await UserModel.getUserStats(req.params.id);
    if (stats) {
      res.json(stats);
    } else {
      res.status(404).json({ message: '用户不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '获取用户统计失败', error: error.message });
  }
});

router.post('/:id/stats', async (req, res) => {
  try {
    await UserModel.updateStats(req.params.id, req.body);
    res.json({ message: '用户统计更新成功' });
  } catch (error) {
    res.status(500).json({ message: '更新用户统计失败', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    
    if (!identifier || !password) {
      return res.status(400).json({ message: '用户名/邮箱/电话和密码不能为空' });
    }
    
    const ipAddress = req.ip || req.connection.remoteAddress;
    const result = await UserModel.verifyUserCredentials(identifier, password, ipAddress);
    
    if (result.success) {
      res.json({ 
        message: '登录成功', 
        user: result.user 
      });
    } else {
      res.status(401).json({ message: result.reason });
    }
  } catch (error) {
    res.status(500).json({ message: '登录失败', error: error.message });
  }
});

router.post('/:id/operation-log', async (req, res) => {
  try {
    const { operationType, operationTarget, operationDetail } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    await UserModel.recordOperationLog(
      req.params.id,
      operationType,
      operationTarget,
      operationDetail,
      ipAddress
    );
    
    res.json({ message: '操作日志记录成功' });
  } catch (error) {
    res.status(500).json({ message: '记录操作日志失败', error: error.message });
  }
});

router.delete('/batch-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: '请提供要删除的用户ID列表' });
    }
    
    const result = await UserModel.batchDeleteUsers(ids);
    res.json({ message: '批量删除成功', affectedRows: result });
  } catch (error) {
    res.status(500).json({ message: '批量删除失败', error: error.message });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({ message: '无效的状态值' });
    }
    
    const result = await UserModel.updateUserStatus(req.params.id, status);
    if (result) {
      res.json({ message: '用户状态更新成功' });
    } else {
      res.status(404).json({ message: '用户不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '更新用户状态失败', error: error.message });
  }
});

router.put('/batch-status', async (req, res) => {
  try {
    const { ids, status } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: '请提供要更新的用户ID列表' });
    }
    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({ message: '无效的状态值' });
    }
    
    const result = await UserModel.batchUpdateUserStatus(ids, status);
    res.json({ message: '批量更新状态成功', affectedRows: result });
  } catch (error) {
    res.status(500).json({ message: '批量更新状态失败', error: error.message });
  }
});

router.put('/:id/reset-password', async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: '密码长度至少为6位' });
    }
    
    const result = await UserModel.resetPassword(req.params.id, newPassword);
    if (result) {
      res.json({ message: '密码重置成功' });
    } else {
      res.status(404).json({ message: '用户不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '重置密码失败', error: error.message });
  }
});

router.put('/:id/lock', async (req, res) => {
  try {
    const lockDurationMinutes = req.body.lockDurationMinutes || 30;
    const result = await UserModel.lockUser(req.params.id, lockDurationMinutes);
    if (result) {
      res.json({ message: '用户锁定成功' });
    } else {
      res.status(404).json({ message: '用户不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '锁定用户失败', error: error.message });
  }
});

router.put('/:id/unlock', async (req, res) => {
  try {
    const result = await UserModel.unlockUser(req.params.id);
    if (result) {
      res.json({ message: '用户解锁成功' });
    } else {
      res.status(404).json({ message: '用户不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '解锁用户失败', error: error.message });
  }
});

module.exports = router;
