// 专题API路由
const express = require('express');
const TopicModel = require('../models/TopicModel.js');

const router = express.Router();

// 获取所有专题
router.get('/', async (req, res) => {
  try {
    const topics = await TopicModel.getAllTopics();
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: '获取专题列表失败', error: error.message });
  }
});

// 根据ID获取专题
router.get('/:id', async (req, res) => {
  try {
    const topic = await TopicModel.getTopicById(req.params.id);
    if (topic) {
      res.json(topic);
    } else {
      res.status(404).json({ message: '专题不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '获取专题失败', error: error.message });
  }
});

// 创建专题
router.post('/', async (req, res) => {
  try {
    const newTopic = await TopicModel.createTopic(req.body);
    res.status(201).json(newTopic);
  } catch (error) {
    res.status(500).json({ message: '创建专题失败', error: error.message });
  }
});

// 更新专题
router.put('/:id', async (req, res) => {
  try {
    const updatedTopic = await TopicModel.updateTopic(req.params.id, req.body);
    if (updatedTopic) {
      res.json(updatedTopic);
    } else {
      res.status(404).json({ message: '专题不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '更新专题失败', error: error.message });
  }
});

// 删除专题
router.delete('/:id', async (req, res) => {
  try {
    const result = await TopicModel.deleteTopic(req.params.id);
    if (result) {
      res.json({ message: '专题删除成功' });
    } else {
      res.status(404).json({ message: '专题不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '删除专题失败', error: error.message });
  }
});

// 根据作者ID获取专题
router.get('/author/:authorId', async (req, res) => {
  try {
    const topics = await TopicModel.getTopicsByAuthor(req.params.authorId);
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: '获取作者专题失败', error: error.message });
  }
});

// 根据地域ID获取专题
router.get('/region/:regionId', async (req, res) => {
  try {
    const topics = await TopicModel.getTopicsByRegion(req.params.regionId);
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: '获取地域专题失败', error: error.message });
  }
});

// 搜索专题
router.get('/search/:keyword', async (req, res) => {
  try {
    const topics = await TopicModel.searchTopics(req.params.keyword);
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: '搜索专题失败', error: error.message });
  }
});

module.exports = router;