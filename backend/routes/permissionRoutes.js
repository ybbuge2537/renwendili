const express = require('express');
const RoleModel = require('../models/RoleModel.js');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const roles = await RoleModel.getAllRoles();
    
    const allPermissions = new Set();
    
    roles.forEach(role => {
      if (role.permissions) {
        let permissions;
        
        if (Array.isArray(role.permissions)) {
          permissions = role.permissions;
        } else if (role.permissions === '*') {
          permissions = ['*'];
        } else if (typeof role.permissions === 'string') {
          try {
            permissions = JSON.parse(role.permissions);
          } catch (e) {
            permissions = [];
          }
        } else {
          permissions = [];
        }
        
        permissions.forEach(permission => {
          if (permission !== '*') {
            allPermissions.add(permission);
          }
        });
      }
    });
    
    const permissionsList = Array.from(allPermissions).map((permission, index) => ({
      permission_id: index + 1,
      permission_name: permission,
      description: getPermissionDescription(permission)
    }));
    
    res.json(permissionsList);
  } catch (error) {
    res.status(500).json({ message: '获取权限列表失败', error: error.message });
  }
});

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