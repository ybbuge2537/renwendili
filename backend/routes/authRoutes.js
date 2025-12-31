const express = require('express');
const svgCaptcha = require('svg-captcha');

const router = express.Router();

const captchaStore = new Map();

router.get('/captcha', async (req, res) => {
  try {
    const captcha = svgCaptcha.create({
      size: 4,
      ignoreChars: '0o1iIl',
      noise: 2,
      color: true,
      background: '#f0f0f0'
    });

    const captchaId = Date.now().toString() + Math.random().toString(36).substring(2);
    const expiresAt = Date.now() + 5 * 60 * 1000;

    captchaStore.set(captchaId, {
      text: captcha.text.toLowerCase(),
      expiresAt
    });

    console.log(`验证码已生成 - ID: ${captchaId}, 文本: ${captcha.text}`);

    res.json({
      captchaId,
      captchaImage: captcha.data
    });
  } catch (error) {
    console.error('生成验证码失败:', error);
    res.status(500).json({ message: '生成验证码失败', error: error.message });
  }
});

router.post('/verify-captcha', async (req, res) => {
  try {
    const { captchaId, captchaCode } = req.body;

    if (!captchaId || !captchaCode) {
      return res.status(400).json({ message: '请提供验证码ID和验证码' });
    }

    const storedData = captchaStore.get(captchaId);

    if (!storedData) {
      return res.status(400).json({ message: '验证码不存在或已过期' });
    }

    if (Date.now() > storedData.expiresAt) {
      captchaStore.delete(captchaId);
      return res.status(400).json({ message: '验证码已过期' });
    }

    if (storedData.text !== captchaCode.toLowerCase()) {
      captchaStore.delete(captchaId);
      return res.status(400).json({ message: '验证码错误' });
    }

    captchaStore.delete(captchaId);

    res.json({ message: '验证码验证成功' });
  } catch (error) {
    console.error('验证验证码失败:', error);
    res.status(500).json({ message: '验证验证码失败', error: error.message });
  }
});

module.exports = router;