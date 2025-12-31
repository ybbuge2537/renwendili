const mysql = require('mysql2/promise');
const dbConfig = require('./config/dbConfig');

async function fixRegionTable() {
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database
    });
    
    console.log('开始修改region表结构...');
    
    // 1. 删除现有的外键约束
    await connection.query('ALTER TABLE region DROP FOREIGN KEY region_ibfk_1');
    console.log('已删除现有外键约束');
    
    // 2. 修改parent_id字段，允许为null
    await connection.query('ALTER TABLE region MODIFY parent_id INT(11) NULL DEFAULT NULL');
    console.log('已修改parent_id字段');
    
    // 3. 添加新的外键约束，允许父地域被删除时设置为null
    await connection.query('ALTER TABLE region ADD CONSTRAINT region_ibfk_1 FOREIGN KEY (parent_id) REFERENCES region(region_id) ON DELETE SET NULL');
    console.log('已添加新的外键约束');
    
    await connection.end();
    console.log('region表结构修改完成');
  } catch (error) {
    console.error('修改表结构时出错:', error.message);
    process.exit(1);
  }
}

fixRegionTable();