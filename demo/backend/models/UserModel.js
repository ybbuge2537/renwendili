// 用户模型
const { executeQuery } = require('../services/dbConnection.js');
const bcrypt = require('bcrypt');



class UserModel {
  // 获取所有用户
  static async getAllUsers() {
    const sql = 'SELECT * FROM user ORDER BY create_time DESC';
    return await executeQuery(sql);
  }

  // 根据ID获取用户
  static async getUserById(userId) {
    const sql = 'SELECT * FROM user WHERE user_id = ?';
    const results = await executeQuery(sql, [userId]);
    return results[0] || null;
  }

  // 根据用户名获取用户
  static async getUserByUsername(username) {
    const sql = 'SELECT * FROM user WHERE username = ?';
    const results = await executeQuery(sql, [username]);
    return results[0] || null;
  }

  // 根据邮箱获取用户
  static async getUserByEmail(email) {
    const sql = 'SELECT * FROM user WHERE email = ?';
    const results = await executeQuery(sql, [email]);
    return results[0] || null;
  }

  // 根据电话获取用户
  static async getUserByPhone(phone) {
    const sql = 'SELECT * FROM user WHERE phone = ?';
    const results = await executeQuery(sql, [phone]);
    return results[0] || null;
  }

  // 创建用户
  static async createUser(userData) {
    const { username, password_hash, email, phone, role } = userData;
    // 将空字符串的phone转换为NULL，避免唯一索引冲突
    const actualPhone = phone === '' ? null : phone;
    
    // 确保自主注册用户ID从10000开始
    // 检查当前最大ID
    const maxIdResult = await executeQuery('SELECT MAX(user_id) as max_id FROM user');
    const maxId = maxIdResult[0].max_id || 0;
    
    if (maxId < 10000) {
      // 如果当前最大ID小于10000，先插入一条临时记录将ID增加到10000
      await executeQuery('INSERT INTO user (username, password_hash, email, role, create_time, update_time) VALUES (?, ?, ?, ?, NOW(), NOW())', 
        ['temp_user_for_id', 'temp_hash', 'temp@example.com', '普通用户']);
      
      // 然后删除该临时记录
      await executeQuery('DELETE FROM user WHERE username = ?', ['temp_user_for_id']);
    }
    
    const sql = 
      'INSERT INTO user (username, password_hash, email, phone, role, create_time, update_time) VALUES (?, ?, ?, ?, ?, NOW(), NOW())';
    
    const results = await executeQuery(sql, [username, password_hash, email, actualPhone, role]);
    return await this.getUserById(results.insertId);
  }

  // 更新用户
  static async updateUser(userId, userData) {
    const { username, password_hash, email, phone, role } = userData;
    
    // 只更新非undefined的字段
    let updateFields = [];
    let updateValues = [];
    
    if (username !== undefined) {
      updateFields.push('username = ?');
      updateValues.push(username);
    }
    
    if (password_hash !== undefined) {
      updateFields.push('password_hash = ?');
      updateValues.push(password_hash);
    }
    
    if (email !== undefined) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    
    if (phone !== undefined) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
    }
    
    if (role !== undefined) {
      updateFields.push('role = ?');
      updateValues.push(role);
    }
    
    if (updateFields.length === 0) {
      // 如果没有需要更新的字段，直接返回当前用户
      return await this.getUserById(userId);
    }
    
    // 添加更新时间和用户ID
    updateFields.push('update_time = NOW()');
    updateValues.push(userId);
    
    const sql = `UPDATE user SET ${updateFields.join(', ')} WHERE user_id = ?`;
    
    await executeQuery(sql, updateValues);
    return await this.getUserById(userId);
  }

  // 删除用户
  static async deleteUser(userId) {
    const sql = 'DELETE FROM user WHERE user_id = ?';
    const results = await executeQuery(sql, [userId]);
    return results.affectedRows > 0;
  }

  // 根据角色获取用户
  static async getUsersByRole(role) {
    const sql = 'SELECT * FROM user WHERE role = ? ORDER BY create_time DESC';
    return await executeQuery(sql, [role]);
  }

  // 验证用户密码
  static async verifyUserCredentials(identifier, password) {
    // 尝试通过用户名查找用户
    let user = await this.getUserByUsername(identifier);
    
    // 如果没找到，再尝试通过邮箱查找
    if (!user) {
      user = await this.getUserByEmail(identifier);
    }
    
    // 如果没找到，再尝试通过电话查找
    if (!user) {
      user = await this.getUserByPhone(identifier);
    }
    
    // 如果找到用户，验证密码
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (isPasswordValid) {
        // 返回用户信息，但不包含密码哈希
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
    }
    
    // 用户不存在或密码错误
    return null;
  }
}

module.exports = UserModel;