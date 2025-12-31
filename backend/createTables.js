const mysql = require('mysql2/promise');
const dbConfig = require('./config/dbConfig');
const fs = require('fs');

async function createTables() {
  try {
    // 读取SQL文件内容
    const sqlContent = fs.readFileSync('./sql/article_table.sql', 'utf8');
    
    // 连接到数据库
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      multipleStatements: true // 允许执行多个SQL语句
    });
    console.log('成功连接到数据库');
    
    // 执行SQL语句
    await connection.query(sqlContent);
    console.log('成功创建文章表、文章标签表和文章封面表');
    
    // 关闭连接
    await connection.end();
    console.log('数据库连接已关闭');
  } catch (error) {
    console.error('创建表时出错:', error.message);
    console.error('错误位置:', error.sql);
    process.exit(1);
  }
}

createTables();