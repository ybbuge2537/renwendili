// 地域API路由
const express = require('express');
const RegionModel = require('../models/RegionModel.js');

const router = express.Router();

// 获取所有地域
router.get('/', async (req, res) => {
  try {
    const regions = await RegionModel.getAllRegions();
    res.json(regions);
  } catch (error) {
    res.status(500).json({ message: '获取地域列表失败', error: error.message });
  }
});

// 根据ID获取地域
router.get('/:id', async (req, res) => {
  try {
    const region = await RegionModel.getRegionById(req.params.id);
    if (region) {
      res.json(region);
    } else {
      res.status(404).json({ message: '地域不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '获取地域失败', error: error.message });
  }
});

// 创建地域
router.post('/', async (req, res) => {
  try {
    const newRegion = await RegionModel.createRegion(req.body);
    res.status(201).json(newRegion);
  } catch (error) {
    res.status(500).json({ message: '创建地域失败', error: error.message });
  }
});

// 更新地域
router.put('/:id', async (req, res) => {
  try {
    const updatedRegion = await RegionModel.updateRegion(req.params.id, req.body);
    if (updatedRegion) {
      res.json(updatedRegion);
    } else {
      res.status(404).json({ message: '地域不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '更新地域失败', error: error.message });
  }
});

// 删除地域
router.delete('/:id', async (req, res) => {
  try {
    const result = await RegionModel.deleteRegion(req.params.id);
    if (result) {
      res.json({ message: '地域删除成功' });
    } else {
      res.status(404).json({ message: '地域不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '删除地域失败', error: error.message });
  }
});

// 获取子地域
router.get('/parent/:parentId', async (req, res) => {
  try {
    const childRegions = await RegionModel.getChildRegions(req.params.parentId);
    res.json(childRegions);
  } catch (error) {
    res.status(500).json({ message: '获取子地域失败', error: error.message });
  }
});

module.exports = router;