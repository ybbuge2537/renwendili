const { executeQuery } = require('./backend/services/dbConnection.js');
const bcrypt = require('bcrypt');

async function checkUser() {
  try {
    // 查询电话号码为13800138000的用户
    const sql = 'SELECT user_id, username, email, phone, password_hash FROM user WHERE phone = ?';
    const results = await executeQuery(sql, ['13800138000']);
    
    if (results.length > 0) {
      const user = results[0];
      console.log('用户信息:', user);
      
      // 验证密码
      const password = 'testpassword';
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      console.log('密码验证结果:', isPasswordValid);
      
      // 如果密码不正确，生成新的哈希并更新
      if (!isPasswordValid) {
        const newHash = await bcrypt.hash(password, 10);
        console.log('新的密码哈希:', newHash);
        
        // 更新用户密码哈希
        const updateSql = 'UPDATE user SET password_hash = ? WHERE phone = ?';
        await executeQuery(updateSql, [newHash, '13800138000']);
        console.log('密码哈希已更新');
      }
    } else {
      console.log('未找到该用户');
    }
  } catch (error) {
    console.error('查询失败:', error);
  }
}

checkUser();