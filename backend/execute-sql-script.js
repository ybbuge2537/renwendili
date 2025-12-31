// 使用Node.js执行SQL脚本
import fs from 'fs/promises';
import mysql from 'mysql2/promise';
import dbConfig from './config/dbConfig.js';

async function executeSqlScript() {
  try {
    console.log('开始执行SQL脚本...');
    
    // 创建连接
    const connection = await mysql.createConnection({
      ...dbConfig,
      multipleStatements: true // 允许执行多条SQL语句
    });
    
    console.log('数据库连接成功');
    
    // 读取SQL脚本文件
    const sqlScript = await fs.readFile('./create-tables.sql', 'utf8');
    console.log('SQL脚本读取成功');
    
    // 执行SQL脚本
    await connection.query(sqlScript);
    console.log('✅ SQL脚本执行成功！数据库表结构已创建');
    
    // 关闭连接
    await connection.end();
    
  } catch (error) {
    console.error('❌ SQL脚本执行失败:', error);
    process.exit(1);
  }
}

// 运行脚本
executeSqlScript();
