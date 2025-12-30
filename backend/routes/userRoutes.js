// 用户API路由
const express = require('express');
const UserModel = require('../models/UserModel.js');

const router = express.Router();

// 获取所有用户
router.get('/', async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: '获取用户列表失败', error: error.message });
  }
});

// 根据ID获取用户
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

// 根据用户名获取用户
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

// 根据邮箱获取用户
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

// 根据电话获取用户
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

// 创建用户
router.post('/', async (req, res) => {
  try {
    const newUser = await UserModel.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: '创建用户失败', error: error.message });
  }
});

// 更新用户
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

// 删除用户
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

// 根据角色获取用户
router.get('/role/:role', async (req, res) => {
  try {
    const users = await UserModel.getUsersByRole(req.params.role);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: '获取角色用户失败', error: error.message });
  }
});

// 用户登录
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    
    // 验证必填字段
    if (!identifier || !password) {
      return res.status(400).json({ message: '用户名/邮箱/电话和密码不能为空' });
    }
    
    // 验证用户凭证
    const user = await UserModel.verifyUserCredentials(identifier, password);
    
    if (user) {
      res.json({ 
        message: '登录成功', 
        user: user 
      });
    } else {
      res.status(401).json({ message: '用户名/邮箱/电话或密码错误' });
    }
  } catch (error) {
    res.status(500).json({ message: '登录失败', error: error.message });
  }
});

module.exports = router;