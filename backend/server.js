// 后端服务器
const express = require('express');
const cors = require('cors');
const path = require('path');

// 加载配置文件
const config = require('./config.js');

// 创建Express应用
const app = express();

// 配置端口
const PORT = config.server.port;

// 配置中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务 - 生产环境使用build目录
app.use(express.static(path.join(__dirname, 'build')));

// API路由
const apiRoutes = require('./routes/index.js');
app.use('/api', apiRoutes);

// 处理前端路由 - 所有非API请求返回index.html
app.get(/^\/*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// 404处理（通常不会到达这里，因为上面的*路由会处理所有请求）
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
