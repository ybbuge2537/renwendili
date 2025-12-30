// 数据库连接配置
// 根据实际情况修改配置参数

const dbConfig = {
  host: 'ybbuge.com',
  port: 3306,
  user: 'shijie', // 用户提供的数据库用户名
  password: '12345@67890', // 用户提供的数据库密码
  database: 'shijie', // 用户提供的数据库名称
  connectionLimit: 10, // 连接池大小
  waitForConnections: true,
  queueLimit: 0
};

export default dbConfig;