const mysql = require('mysql2/promise');
const dbConfig = require('./config/dbConfig');

async function createChinaRegion() {
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database
    });
    
    console.log('开始创建中国地区记录...');
    
    // 使用IGNORE关键字忽略外键约束
    const sql = 'INSERT IGNORE INTO region (region_id, region_name, parent_id, location, population, language, description) VALUES (1, "中国", NULL, POINT(116.397128, 39.916527), 1400000000, "中文", "中国地区")';
    
    const [results] = await connection.query(sql);
    console.log(`创建结果: ${results.affectedRows} 行受影响`);
    
    // 查询创建的记录
    const [rows] = await connection.query('SELECT * FROM region WHERE region_id = 1');
    console.log('创建的地区记录:');
    console.table(rows);
    
    await connection.end();
    console.log('操作完成');
  } catch (error) {
    console.error('创建地区时出错:', error.message);
    process.exit(1);
  }
}

createChinaRegion();