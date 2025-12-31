// 数据库连接配置
// 使用环境变量或默认值
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'ybbuge.com',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'shijie',
  password: process.env.DB_PASSWORD || '12345@67890',
  database: process.env.DB_NAME || 'shijie',
  connectionLimit: 10, // 连接池大小
  waitForConnections: true,
  queueLimit: 0
};

module.exports = dbConfig;