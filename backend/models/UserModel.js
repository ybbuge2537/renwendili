const { executeQuery } = require('../services/dbConnection.js');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

class UserModel {
  static async getAllUsers(filters = {}) {
    let sql = 'SELECT * FROM user WHERE is_deleted = FALSE';
    let params = [];
    
    if (filters.role_id !== undefined) {
      sql += ' AND role_id = ?';
      params.push(filters.role_id);
    }
    
    if (filters.certification_status !== undefined) {
      sql += ' AND certification_status = ?';
      params.push(filters.certification_status);
    }
    
    if (filters.is_enabled !== undefined) {
      sql += ' AND is_enabled = ?';
      params.push(filters.is_enabled);
    }
    
    if (filters.keyword !== undefined) {
      sql += ' AND (username LIKE ? OR nickname LIKE ? OR email LIKE ? OR phone LIKE ?)';
      const keyword = `%${filters.keyword}%`;
      params.push(keyword, keyword, keyword, keyword);
    }
    
    sql += ' ORDER BY create_time DESC';
    
    if (filters.page !== undefined && filters.pageSize !== undefined) {
      const offset = (filters.page - 1) * filters.pageSize;
      sql += ' LIMIT ? OFFSET ?';
      params.push(filters.pageSize, offset);
    }
    
    const users = await executeQuery(sql, params);
    
    const countSql = 'SELECT COUNT(*) as total FROM user WHERE is_deleted = FALSE' + 
      (filters.role_id !== undefined ? ' AND role_id = ?' : '') +
      (filters.certification_status !== undefined ? ' AND certification_status = ?' : '') +
      (filters.is_enabled !== undefined ? ' AND is_enabled = ?' : '') +
      (filters.keyword !== undefined ? ' AND (username LIKE ? OR nickname LIKE ? OR email LIKE ? OR phone LIKE ?)' : '');
    
    const countParams = params.slice(0, filters.page !== undefined && filters.pageSize !== undefined ? -2 : undefined);
    const countResult = await executeQuery(countSql, countParams);
    const total = countResult[0].total;
    
    return {
      users,
      pagination: filters.page !== undefined && filters.pageSize !== undefined ? {
        page: filters.page,
        pageSize: filters.pageSize,
        total,
        totalPages: Math.ceil(total / filters.pageSize)
      } : null
    };
  }

  static async getUserById(userId) {
    const sql = 'SELECT * FROM user WHERE user_id = ? AND is_deleted = FALSE';
    const results = await executeQuery(sql, [userId]);
    return results[0] || null;
  }

  static async getUserByUsername(username) {
    const sql = 'SELECT * FROM user WHERE username = ? AND is_deleted = FALSE';
    const results = await executeQuery(sql, [username]);
    return results[0] || null;
  }

  static async getUserByEmail(email) {
    const sql = 'SELECT * FROM user WHERE email = ? AND is_deleted = FALSE';
    const results = await executeQuery(sql, [email]);
    return results[0] || null;
  }

  static async getUserByPhone(phone) {
    const sql = 'SELECT * FROM user WHERE phone = ? AND is_deleted = FALSE';
    const results = await executeQuery(sql, [phone]);
    return results[0] || null;
  }

  static async createUser(userData) {
    const {
      username,
      password,
      email,
      phone,
      nickname,
      role_id,
      certification_status = '未认证',
      bio,
      residence,
      travel_preferences
    } = userData;
    
    const salt = crypto.randomBytes(16).toString('hex');
    const password_hash = await bcrypt.hash(password + salt, 10);
    
    const actualPhone = phone === '' ? null : phone;
    
    const sql = `
      INSERT INTO user (
        username, password_hash, salt, email, phone, nickname, 
        role_id, certification_status, bio, residence, 
        travel_preferences, create_time, update_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const results = await executeQuery(sql, [
      username, password_hash, salt, email, actualPhone, nickname,
      role_id, certification_status, bio, residence,
      travel_preferences ? JSON.stringify(travel_preferences) : null
    ]);
    
    return await this.getUserById(results.insertId);
  }

  static async updateUser(userId, userData) {
    const {
      username,
      password,
      email,
      phone,
      nickname,
      avatar_url,
      role_id,
      is_enabled,
      custom_permissions,
      certification_status,
      bio,
      residence,
      travel_preferences
    } = userData;
    
    let updateFields = [];
    let updateValues = [];
    
    if (username !== undefined) {
      updateFields.push('username = ?');
      updateValues.push(username);
    }
    
    if (password !== undefined) {
      const salt = crypto.randomBytes(16).toString('hex');
      const password_hash = await bcrypt.hash(password + salt, 10);
      updateFields.push('password_hash = ?, salt = ?, password_update_time = NOW()');
      updateValues.push(password_hash, salt);
    }
    
    if (email !== undefined) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    
    if (phone !== undefined) {
      updateFields.push('phone = ?');
      updateValues.push(phone === '' ? null : phone);
    }
    
    if (nickname !== undefined) {
      updateFields.push('nickname = ?');
      updateValues.push(nickname);
    }
    
    if (avatar_url !== undefined) {
      updateFields.push('avatar_url = ?');
      updateValues.push(avatar_url);
    }
    
    if (role_id !== undefined) {
      updateFields.push('role_id = ?');
      updateValues.push(role_id);
    }
    
    if (is_enabled !== undefined) {
      updateFields.push('is_enabled = ?');
      updateValues.push(is_enabled);
    }
    
    if (custom_permissions !== undefined) {
      updateFields.push('custom_permissions = ?');
      updateValues.push(custom_permissions ? JSON.stringify(custom_permissions) : null);
    }
    
    if (certification_status !== undefined) {
      updateFields.push('certification_status = ?');
      updateValues.push(certification_status);
    }
    
    if (bio !== undefined) {
      updateFields.push('bio = ?');
      updateValues.push(bio);
    }
    
    if (residence !== undefined) {
      updateFields.push('residence = ?');
      updateValues.push(residence);
    }
    
    if (travel_preferences !== undefined) {
      updateFields.push('travel_preferences = ?');
      updateValues.push(travel_preferences ? JSON.stringify(travel_preferences) : null);
    }
    
    if (updateFields.length === 0) {
      return await this.getUserById(userId);
    }
    
    updateFields.push('update_time = NOW()');
    updateValues.push(userId);
    
    const sql = `UPDATE user SET ${updateFields.join(', ')} WHERE user_id = ?`;
    
    await executeQuery(sql, updateValues);
    return await this.getUserById(userId);
  }

  static async deleteUser(userId) {
    const sql = 'UPDATE user SET is_deleted = TRUE, update_time = NOW() WHERE user_id = ?';
    const results = await executeQuery(sql, [userId]);
    return results.affectedRows > 0;
  }

  static async restoreUser(userId) {
    const sql = 'UPDATE user SET is_deleted = FALSE, update_time = NOW() WHERE user_id = ?';
    const results = await executeQuery(sql, [userId]);
    return results.affectedRows > 0;
  }

  static async verifyUserCredentials(identifier, password, ipAddress) {
    let user = await this.getUserByUsername(identifier);
    
    if (!user) {
      user = await this.getUserByEmail(identifier);
    }
    
    if (!user) {
      user = await this.getUserByPhone(identifier);
    }
    
    if (user) {
      if (!user.is_enabled) {
        await this.recordLoginLog(user.user_id, ipAddress, '失败', '账户已禁用');
        return { success: false, reason: '账户已禁用' };
      }
      
      const passwordToCheck = user.salt ? password + user.salt : password;
      const isPasswordValid = await bcrypt.compare(passwordToCheck, user.password_hash);
      
      if (isPasswordValid) {
        await this.recordLoginLog(user.user_id, ipAddress, '成功');
        await this.updateLoginInfo(user.user_id, ipAddress);
        await this.resetLoginErrorCount(user.user_id);
        
        const { password_hash, salt, ...userWithoutPassword } = user;
        return { success: true, user: userWithoutPassword };
      } else {
        await this.recordLoginLog(user.user_id, ipAddress, '失败', '密码错误');
        await this.incrementLoginErrorCount(user.user_id);
        return { success: false, reason: '密码错误' };
      }
    }
    
    await this.recordLoginLog(null, ipAddress, '失败', '用户不存在');
    return { success: false, reason: '用户不存在' };
  }

  static async recordLoginLog(userId, ipAddress, status, failureReason = null) {
    const sql = `
      INSERT INTO user_login_log (user_id, login_ip, login_status, failure_reason)
      VALUES (?, ?, ?, ?)
    `;
    await executeQuery(sql, [userId, ipAddress, status, failureReason]);
  }

  static async updateLoginInfo(userId, ipAddress) {
    const sql = `
      UPDATE user 
      SET last_login_ip = ?, 
          last_login_time = NOW(), 
          last_active_time = NOW(),
          login_count = login_count + 1
      WHERE user_id = ?
    `;
    await executeQuery(sql, [ipAddress, userId]);
  }

  static async incrementLoginErrorCount(userId) {
    const sql = `
      UPDATE user 
      SET login_error_count = login_error_count + 1 
      WHERE user_id = ?
    `;
    await executeQuery(sql, [userId]);
    
    const user = await this.getUserById(userId);
    if (user.login_error_count >= 5) {
      await this.updateUser(userId, { is_enabled: false });
    }
  }

  static async resetLoginErrorCount(userId) {
    const sql = 'UPDATE user SET login_error_count = 0 WHERE user_id = ?';
    await executeQuery(sql, [userId]);
  }

  static async updateStats(userId, stats) {
    const { article_count, video_count, like_count, collection_count } = stats;
    
    let updateFields = [];
    let updateValues = [];
    
    if (article_count !== undefined) {
      updateFields.push('article_count = article_count + ?');
      updateValues.push(article_count);
    }
    
    if (video_count !== undefined) {
      updateFields.push('video_count = video_count + ?');
      updateValues.push(video_count);
    }
    
    if (like_count !== undefined) {
      updateFields.push('like_count = like_count + ?');
      updateValues.push(like_count);
    }
    
    if (collection_count !== undefined) {
      updateFields.push('collection_count = collection_count + ?');
      updateValues.push(collection_count);
    }
    
    if (updateFields.length > 0) {
      updateFields.push('last_active_time = NOW()');
      updateValues.push(userId);
      
      const sql = `UPDATE user SET ${updateFields.join(', ')} WHERE user_id = ?`;
      await executeQuery(sql, updateValues);
    }
  }

  static async recordOperationLog(userId, operationType, operationTarget = null, operationDetail = null, ipAddress = null) {
    const sql = `
      INSERT INTO user_operation_log (user_id, operation_type, operation_target, operation_detail, ip_address)
      VALUES (?, ?, ?, ?, ?)
    `;
    await executeQuery(sql, [userId, operationType, operationTarget, operationDetail, ipAddress]);
  }

  static async getUsersByRole(roleId) {
    const sql = 'SELECT * FROM user WHERE role_id = ? AND is_deleted = FALSE ORDER BY create_time DESC';
    return await executeQuery(sql, [roleId]);
  }

  static async getUsersByCertificationStatus(certificationStatus) {
    const sql = 'SELECT * FROM user WHERE certification_status = ? AND is_deleted = FALSE ORDER BY create_time DESC';
    return await executeQuery(sql, [certificationStatus]);
  }

  static async getUserStats(userId) {
    const sql = 'SELECT article_count, video_count, like_count, collection_count, last_active_time FROM user WHERE user_id = ?';
    const results = await executeQuery(sql, [userId]);
    return results[0] || null;
  }

  static async batchDeleteUsers(userIds) {
    const placeholders = userIds.map(() => '?').join(',');
    const sql = `UPDATE user SET is_deleted = TRUE, update_time = NOW() WHERE user_id IN (${placeholders})`;
    const results = await executeQuery(sql, userIds);
    return results.affectedRows > 0;
  }

  static async updateUserStatus(userId, status) {
    const isEnabled = status === 'active' ? 1 : 0;
    const sql = 'UPDATE user SET is_enabled = ?, update_time = NOW() WHERE user_id = ?';
    const results = await executeQuery(sql, [isEnabled, userId]);
    return results.affectedRows > 0;
  }

  static async batchUpdateUserStatus(userIds, status) {
    const isEnabled = status === 'active' ? 1 : 0;
    const placeholders = userIds.map(() => '?').join(',');
    const sql = `UPDATE user SET is_enabled = ?, update_time = NOW() WHERE user_id IN (${placeholders})`;
    const results = await executeQuery(sql, [isEnabled, ...userIds]);
    return results.affectedRows > 0;
  }

  static async resetPassword(userId, newPassword) {
    const salt = crypto.randomBytes(16).toString('hex');
    const password_hash = await bcrypt.hash(newPassword + salt, 10);
    const sql = 'UPDATE user SET password_hash = ?, salt = ?, password_update_time = NOW(), update_time = NOW() WHERE user_id = ?';
    const results = await executeQuery(sql, [password_hash, salt, userId]);
    return results.affectedRows > 0;
  }

  static async lockUser(userId, lockDurationMinutes = 30) {
    const lockedUntil = new Date(Date.now() + lockDurationMinutes * 60 * 1000);
    const sql = 'UPDATE user SET locked_until = ?, update_time = NOW() WHERE user_id = ?';
    const results = await executeQuery(sql, [lockedUntil, userId]);
    return results.affectedRows > 0;
  }

  static async unlockUser(userId) {
    const sql = 'UPDATE user SET locked_until = NULL, login_error_count = 0, update_time = NOW() WHERE user_id = ?';
    const results = await executeQuery(sql, [userId]);
    return results.affectedRows > 0;
  }
}

module.exports = UserModel;
