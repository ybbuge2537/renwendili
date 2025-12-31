// API主路由
const express = require('express');
const regionRoutes = require('./regionRoutes.js');
const topicRoutes = require('./topicRoutes.js');
const userRoutes = require('./userRoutes.js');
const articleRoutes = require('./articleRoutes.js');

const router = express.Router();

// 注册各模块路由
router.use('/regions', regionRoutes);
router.use('/topics', topicRoutes);
router.use('/users', userRoutes);
router.use('/articles', articleRoutes);

// 测试路由
router.get('/ping', (req, res) => {
  res.json({ message: 'API服务器运行正常' });
});

module.exports = router;