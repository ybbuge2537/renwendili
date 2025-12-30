// 用户模型
import { executeQuery } from '../services/dbConnection.js';

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

  // 创建用户
  static async createUser(userData) {
    const { username, password_hash, email, phone, role } = userData;
    const sql = 
      'INSERT INTO user (username, password_hash, email, phone, role, create_time, update_time) VALUES (?, ?, ?, ?, ?, NOW(), NOW())';
    
    const results = await executeQuery(sql, [username, password_hash, email, phone, role]);
    return await this.getUserById(results.insertId);
  }

  // 更新用户
  static async updateUser(userId, userData) {
    const { username, password_hash, email, phone, role } = userData;
    const sql = 
      'UPDATE user SET username = ?, password_hash = ?, email = ?, phone = ?, role = ?, update_time = NOW() WHERE user_id = ?';
    
    await executeQuery(sql, [username, password_hash, email, phone, role, userId]);
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
}

export default UserModel;