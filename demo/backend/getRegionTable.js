const mysql = require('mysql2/promise');
const dbConfig = require('./config/dbConfig');

async function getRegionTableStructure() {
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database
    });
    
    const [rows] = await connection.query('DESCRIBE region');
    console.log('Region表结构:');
    console.table(rows);
    
    const [constraints] = await connection.query('SHOW CREATE TABLE region');
    console.log('\nRegion表创建语句:');
    console.log(constraints[0]['Create Table']);
    
    await connection.end();
  } catch (error) {
    console.error('获取表结构时出错:', error.message);
    process.exit(1);
  }
}

getRegionTableStructure();