const express = require('express');
const RoleModel = require('../models/RoleModel.js');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const roles = await RoleModel.getAllRoles();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: '获取角色列表失败', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const role = await RoleModel.getRoleById(req.params.id);
    if (role) {
      res.json(role);
    } else {
      res.status(404).json({ message: '角色不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '获取角色失败', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newRole = await RoleModel.createRole(req.body);
    res.status(201).json(newRole);
  } catch (error) {
    res.status(500).json({ message: '创建角色失败', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedRole = await RoleModel.updateRole(req.params.id, req.body);
    if (updatedRole) {
      res.json(updatedRole);
    } else {
      res.status(404).json({ message: '角色不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '更新角色失败', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await RoleModel.deleteRole(req.params.id);
    if (result) {
      res.json({ message: '角色删除成功' });
    } else {
      res.status(404).json({ message: '角色不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '删除角色失败', error: error.message });
  }
});

router.get('/:id/permission/:permission', async (req, res) => {
  try {
    const hasPermission = await RoleModel.hasPermission(req.params.id, req.params.permission);
    res.json({ hasPermission });
  } catch (error) {
    res.status(500).json({ message: '检查权限失败', error: error.message });
  }
});

router.get('/:id/permissions', async (req, res) => {
  try {
    const role = await RoleModel.getRoleById(req.params.id);
    if (role) {
      let permissions = [];
      
      if (role.permissions) {
        if (Array.isArray(role.permissions)) {
          permissions = role.permissions;
        } else if (typeof role.permissions === 'string') {
          try {
            permissions = JSON.parse(role.permissions);
          } catch (e) {
            console.error('解析权限失败:', e);
            permissions = [];
          }
        }
      }
      
      const permissionList = permissions.map((permission, index) => ({
        permission_id: index + 1,
        permission_name: permission,
        description: getPermissionDescription(permission)
      }));
      res.json(permissionList);
    } else {
      res.status(404).json({ message: '角色不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '获取角色权限失败', error: error.message });
  }
});

router.post('/:id/permissions', async (req, res) => {
  try {
    const { permissionIds } = req.body;
    const role = await RoleModel.getRoleById(req.params.id);
    
    if (!role) {
      return res.status(404).json({ message: '角色不存在' });
    }
    
    const allPermissions = await getAllPermissions();
    const selectedPermissions = allPermissions
      .filter(p => permissionIds.includes(p.permission_id))
      .map(p => p.permission_name);
    
    await RoleModel.updateRole(req.params.id, { permissions: selectedPermissions });
    res.json({ message: '权限分配成功' });
  } catch (error) {
    res.status(500).json({ message: '分配权限失败', error: error.message });
  }
});

async function getAllPermissions() {
  const express = require('express');
  const app = express();
  const response = await fetch('http://localhost:5001/api/permissions');
  return await response.json();
}

function getPermissionDescription(permission) {
  const descriptions = {
    'user.view': '查看用户',
    'user.edit': '编辑用户',
    'user.delete': '删除用户',
    'article.view': '查看文章',
    'article.edit': '编辑文章',
    'article.delete': '删除文章',
    'article.create': '创建文章',
    'article.audit': '审核文章',
    'article.edit_own': '编辑自己的文章',
    'region.view': '查看地域',
    'region.edit': '编辑地域',
    'topic.view': '查看专题',
    'topic.edit': '编辑专题',
    'topic.delete': '删除专题',
    'topic.create': '创建专题',
    'topic.edit_own': '编辑自己的专题'
  };
  
  return descriptions[permission] || '';
}

module.exports = router;
