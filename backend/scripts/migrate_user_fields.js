const { executeQuery } = require('../services/dbConnection.js');
const fs = require('fs');
const path = require('path');

async function migrateUserFields() {
  try {
    console.log('开始扩展用户表字段...');
    
    const sqlPath = path.join(__dirname, '../migrations/add_user_fields.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await executeQuery(statement);
        } catch (error) {
          if (error.code === 'ER_DUP_FIELDNAME' || error.code === 'ER_DUP_KEYNAME' || error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
            console.log(`字段或索引已存在，跳过: ${statement.substring(0, 50)}...`);
          } else {
            throw error;
          }
        }
      }
    }
    
    console.log('✓ 用户表字段扩展成功');
    console.log('\n数据库迁移完成！');
  } catch (error) {
    console.error('数据库迁移失败:', error);
    process.exit(1);
  }
}

migrateUserFields();
