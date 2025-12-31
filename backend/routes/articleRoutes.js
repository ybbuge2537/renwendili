// 文章API路由
const express = require('express');
const ArticleModel = require('../models/ArticleModel.js');

const router = express.Router();

// 获取文章列表（支持分页、筛选、排序）
router.get('/', async (req, res) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      pageSize: parseInt(req.query.pageSize) || 10,
      status: req.query.status,
      authorId: req.query.authorId,
      regionId: req.query.regionId,
      keyword: req.query.keyword,
      sortBy: req.query.sortBy || 'create_time',
      sortOrder: req.query.sortOrder || 'DESC'
    };
    
    const result = await ArticleModel.getArticles(options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: '获取文章列表失败', error: error.message });
  }
});

// 获取所有文章（兼容旧接口）
router.get('/all', async (req, res) => {
  try {
    const articles = await ArticleModel.getAllArticles();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: '获取文章列表失败', error: error.message });
  }
});

// 增加文章阅读量（必须在 /:id 之前）
router.post('/:id/views', async (req, res) => {
  try {
    const userIdentifier = req.body.userIdentifier || req.ip || 'anonymous';
    const article = await ArticleModel.incrementViews(req.params.id, userIdentifier);
    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ message: '文章不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '增加阅读量失败', error: error.message });
  }
});

// 根据ID获取文章
router.get('/:id', async (req, res) => {
  try {
    const article = await ArticleModel.getArticleById(req.params.id);
    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ message: '文章不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '获取文章失败', error: error.message });
  }
});

// 创建文章
router.post('/', async (req, res) => {
  try {
    const newArticle = await ArticleModel.createArticle(req.body);
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ message: '创建文章失败', error: error.message });
  }
});

// 更新文章
router.put('/:id', async (req, res) => {
  try {
    const { authorId, ...articleData } = req.body;
    const updatedArticle = await ArticleModel.updateArticle(req.params.id, articleData, authorId);
    if (updatedArticle) {
      res.json(updatedArticle);
    } else {
      res.status(404).json({ message: '文章不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '更新文章失败', error: error.message });
  }
});

// 变更文章状态
router.put('/:id/status', async (req, res) => {
  try {
    const { newStatus, authorId } = req.body;
    const updatedArticle = await ArticleModel.changeArticleStatus(req.params.id, newStatus, authorId);
    if (updatedArticle) {
      res.json(updatedArticle);
    } else {
      res.status(404).json({ message: '文章不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '变更文章状态失败', error: error.message });
  }
});

// 获取文章版本历史
router.get('/:id/versions', async (req, res) => {
  try {
    const versions = await ArticleModel.getArticleVersions(req.params.id);
    res.json(versions);
  } catch (error) {
    res.status(500).json({ message: '获取文章版本历史失败', error: error.message });
  }
});

// 获取作者文章统计
router.get('/author/:authorId/stats', async (req, res) => {
  try {
    const stats = await ArticleModel.getAuthorArticleStats(req.params.authorId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: '获取作者文章统计失败', error: error.message });
  }
});

// 删除文章
router.delete('/:id', async (req, res) => {
  try {
    const result = await ArticleModel.deleteArticle(req.params.id);
    if (result) {
      res.json({ message: '文章删除成功' });
    } else {
      res.status(404).json({ message: '文章不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '删除文章失败', error: error.message });
  }
});

// 根据作者ID获取文章
router.get('/author/:authorId', async (req, res) => {
  try {
    const articles = await ArticleModel.getArticlesByAuthor(req.params.authorId);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: '获取作者文章失败', error: error.message });
  }
});

// 根据地域ID获取文章
router.get('/region/:regionId', async (req, res) => {
  try {
    const articles = await ArticleModel.getArticlesByRegion(req.params.regionId);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: '获取地域文章失败', error: error.message });
  }
});

// 搜索文章
router.get('/search/:keyword', async (req, res) => {
  try {
    const articles = await ArticleModel.searchArticles(req.params.keyword);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: '搜索文章失败', error: error.message });
  }
});

module.exports = router;
