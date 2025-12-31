const { executeQuery } = require('../services/dbConnection.js');

class RoleModel {
  static async getAllRoles() {
    const sql = `
      SELECT 
        r.*,
        (SELECT COUNT(*) FROM user WHERE user.role = 
          CASE r.role_name
            WHEN '超级管理员' THEN 'admin'
            WHEN '管理员' THEN 'admin'
            WHEN '编辑' THEN 'editor'
            WHEN '作者' THEN 'writer'
            WHEN '查看者' THEN 'viewer'
            ELSE r.role_name
          END
        ) as user_count
      FROM role r
      ORDER BY r.role_id ASC
    `;
    return await executeQuery(sql);
  }

  static async getRoleById(roleId) {
    const sql = 'SELECT * FROM role WHERE role_id = ?';
    const results = await executeQuery(sql, [roleId]);
    return results[0] || null;
  }

  static async getRoleByName(roleName) {
    const sql = 'SELECT * FROM role WHERE role_name = ?';
    const results = await executeQuery(sql, [roleName]);
    return results[0] || null;
  }

  static async createRole(roleData) {
    const { role_name, role_description, permissions } = roleData;
    
    const sql = `
      INSERT INTO role (role_name, role_description, permissions, create_time, update_time)
      VALUES (?, ?, ?, NOW(), NOW())
    `;
    
    const results = await executeQuery(sql, [
      role_name,
      role_description,
      permissions ? JSON.stringify(permissions) : null
    ]);
    
    return await this.getRoleById(results.insertId);
  }

  static async updateRole(roleId, roleData) {
    const { role_name, role_description, permissions } = roleData;
    
    let updateFields = [];
    let updateValues = [];
    
    if (role_name !== undefined) {
      updateFields.push('role_name = ?');
      updateValues.push(role_name);
    }
    
    if (role_description !== undefined) {
      updateFields.push('role_description = ?');
      updateValues.push(role_description);
    }
    
    if (permissions !== undefined) {
      updateFields.push('permissions = ?');
      updateValues.push(permissions ? JSON.stringify(permissions) : null);
    }
    
    if (updateFields.length === 0) {
      return await this.getRoleById(roleId);
    }
    
    updateFields.push('update_time = NOW()');
    updateValues.push(roleId);
    
    const sql = `UPDATE role SET ${updateFields.join(', ')} WHERE role_id = ?`;
    
    await executeQuery(sql, updateValues);
    return await this.getRoleById(roleId);
  }

  static async deleteRole(roleId) {
    const sql = 'DELETE FROM role WHERE role_id = ?';
    const results = await executeQuery(sql, [roleId]);
    return results.affectedRows > 0;
  }

  static async hasPermission(roleId, permission) {
    const role = await this.getRoleById(roleId);
    
    if (!role) {
      return false;
    }
    
    if (!role.permissions) {
      return false;
    }
    
    const permissions = JSON.parse(role.permissions);
    
    if (permissions.includes('*')) {
      return true;
    }
    
    return permissions.includes(permission);
  }
}

module.exports = RoleModel;
