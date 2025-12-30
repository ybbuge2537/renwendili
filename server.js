// 后端服务器
const express = require('express');
const cors = require('cors');
const path = require('path');

// 创建Express应用
const app = express();

// 配置端口
const PORT = process.env.PORT || 5001;

// 配置中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// API路由
const apiRoutes = require('./backend/routes/index.js');
app.use('/api', apiRoutes);

// 404处理
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
