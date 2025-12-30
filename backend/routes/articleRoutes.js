// 文章API路由
const express = require('express');
const ArticleModel = require('../models/ArticleModel.js');

const router = express.Router();

// 获取所有文章
router.get('/', async (req, res) => {
  try {
    const articles = await ArticleModel.getAllArticles();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: '获取文章列表失败', error: error.message });
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
    const updatedArticle = await ArticleModel.updateArticle(req.params.id, req.body);
    if (updatedArticle) {
      res.json(updatedArticle);
    } else {
      res.status(404).json({ message: '文章不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '更新文章失败', error: error.message });
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
