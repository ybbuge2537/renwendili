// API主路由
const express = require('express');
const regionRoutes = require('./regionRoutes.js');
const topicRoutes = require('./topicRoutes.js');
const userRoutes = require('./userRoutes.js');
const articleRoutes = require('./articleRoutes.js');
const roleRoutes = require('./roleRoutes.js');
const permissionRoutes = require('./permissionRoutes.js');
const authRoutes = require('./authRoutes.js');

const router = express.Router();

router.use('/regions', regionRoutes);
router.use('/topics', topicRoutes);
router.use('/users', userRoutes);
router.use('/articles', articleRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);
router.use('/auth', authRoutes);

// 测试路由
router.get('/ping', (req, res) => {
  res.json({ message: 'API服务器运行正常' });
});

module.exports = router;