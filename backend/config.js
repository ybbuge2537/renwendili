// 项目统一配置文件
// 支持环境变量覆盖，便于不同环境部署

// 加载环境变量
require('dotenv').config();

// 服务器配置
const serverConfig = {
  port: process.env.SERVER_PORT || 5001,
  env: process.env.NODE_ENV || 'development'
};

// 数据库配置
const databaseConfig = {
  host: process.env.DB_HOST || 'ybbuge.com',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'shijie',
  password: process.env.DB_PASSWORD || '12345@67890',
  database: process.env.DB_NAME || 'shijie',
  connectionLimit: 10, // 连接池大小
  waitForConnections: true,
  queueLimit: 0
};

// API配置
const apiConfig = {
  // API基础URL（前端使用）
  baseUrl: process.env.REACT_APP_API_URL || `http://localhost:${serverConfig.port}/api`,
  // API版本
  version: '1.0.0'
};

// 安全配置
const securityConfig = {
  // JWT密钥（如果使用JWT）
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  // 密码哈希轮数
  bcryptSaltRounds: 10
};

// 导出所有配置
module.exports = {
  server: serverConfig,
  database: databaseConfig,
  api: apiConfig,
  security: securityConfig
};
