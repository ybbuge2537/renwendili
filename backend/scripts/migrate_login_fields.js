const { executeQuery } = require('../services/dbConnection.js');

async function migrateLoginFields() {
  try {
    console.log('开始添加登录相关字段...');

    const fields = [
      {
        name: 'last_login_time',
        sql: 'ALTER TABLE `user` ADD COLUMN `last_login_time` DATETIME DEFAULT NULL COMMENT "最后登录时间" AFTER `last_login_ip`'
      },
      {
        name: 'login_count',
        sql: 'ALTER TABLE `user` ADD COLUMN `login_count` INT DEFAULT 0 COMMENT "登录次数" AFTER `last_login_time`'
      }
    ];

    for (const field of fields) {
      try {
        await executeQuery(field.sql);
        console.log(`✓ 成功添加字段: ${field.name}`);
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log(`- 字段已存在，跳过: ${field.name}`);
        } else {
          throw error;
        }
      }
    }

    console.log('登录相关字段添加完成！');
  } catch (error) {
    console.error('迁移失败:', error);
    process.exit(1);
  }
}

migrateLoginFields();
