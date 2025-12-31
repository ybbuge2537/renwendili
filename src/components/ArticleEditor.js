import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CoordinatePicker from './CoordinatePicker';
import './ArticleEditor.css';

const ArticleEditor = ({ initialArticle = null, onSave, onCancel }) => {
  const [article, setArticle] = useState({
    title: '',
    content: '',
    category: 'culture',
    tags: '',
    region_id: '',
    status: 'draft',
    cover_image: '',
    coordinates_lat: '',
    coordinates_lng: '',
    author_name: '文旅达人',
    culture_background: '',
    opening_hours: '',
    ticket_price: '',
    transportation: '',
    video_url: '',
    culture_tips: ''
  });

  useEffect(() => {
    if (initialArticle) {
      setArticle(prev => ({
        ...prev,
        ...initialArticle,
        id: initialArticle.id || initialArticle.article_id
      }));
    }
  }, [initialArticle]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArticle(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(article);
  };

  return (
    <div className="article-editor">
      {/* 头部区域 */}
      <div className="editor-header">
        <h1 className="editor-title">
          <span className="title-icon">✏️</span>
          {initialArticle ? '编辑文章' : '创建新文章'}
        </h1>
        <p className="editor-subtitle">
          {initialArticle ? '修改文章内容和信息' : '分享你的文化探索之旅'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="editor-form">
        {/* 基本信息卡片 */}
        <div className="editor-card">
          <h2 className="card-title">
            <span className="card-icon">📝</span>
            基本信息
          </h2>
          
          {/* 标题输入 */}
          <div className="form-group">
            <label htmlFor="title">
              <span className="label-icon">📰</span>
              文章标题
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={article.title}
              onChange={handleInputChange}
              placeholder="请输入文章标题"
              required
              className="title-input"
            />
          </div>

          {/* 分类和状态 */}
          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="category">
                <span className="label-icon">🏷️</span>
                文章分类
              </label>
              <select
                id="category"
                name="category"
                value={article.category}
                onChange={handleInputChange}
                required
              >
                <option value="culture">🏛️ 文化</option>
                <option value="history">📜 历史</option>
                <option value="lifestyle">🌿 生活</option>
                <option value="base">📍 基础</option>
              </select>
            </div>

            <div className="form-group half-width">
              <label htmlFor="status">
                <span className="label-icon">📊</span>
                发布状态
              </label>
              <select
                id="status"
                name="status"
                value={article.status}
                onChange={handleInputChange}
              >
                <option value="draft">📝 草稿</option>
                <option value="published">✅ 已发布</option>
                <option value="pending">⏳ 待审核</option>
              </select>
            </div>
          </div>

          {/* 地区选择 */}
          <div className="form-group">
            <label htmlFor="region_id">
              <span className="label-icon">🗺️</span>
              相关地区ID
            </label>
            <input
              type="number"
              id="region_id"
              name="region_id"
              value={article.region_id}
              onChange={handleInputChange}
              placeholder="请输入相关地区ID"
            />
          </div>

          {/* 标签输入 */}
          <div className="form-group">
            <label htmlFor="tags">
              <span className="label-icon">🏷️</span>
              标签
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={article.tags}
              onChange={handleInputChange}
              placeholder="请输入标签，用逗号分隔（如：古镇, 文化, 旅游）"
            />
          </div>

          {/* 封面图片 */}
          <div className="form-group">
            <label htmlFor="cover_image">
              <span className="label-icon">🖼️</span>
              封面图片
            </label>
            <input
              type="text"
              id="cover_image"
              name="cover_image"
              value={article.cover_image}
              onChange={handleInputChange}
              placeholder="请输入封面图片URL"
            />
            {article.cover_image && (
              <div className="cover-preview">
                <img src={article.cover_image} alt="封面预览" />
              </div>
            )}
          </div>

          {/* 作者名称 */}
          <div className="form-group">
            <label htmlFor="author_name">
              <span className="label-icon">👤</span>
              作者名称
            </label>
            <input
              type="text"
              id="author_name"
              name="author_name"
              value={article.author_name}
              onChange={handleInputChange}
              placeholder="请输入作者名称"
            />
          </div>
        </div>

        {/* 文化溯源卡片 */}
        <div className="editor-card">
          <h2 className="card-title">
            <span className="card-icon">📜</span>
            文化溯源
          </h2>
          <div className="form-group">
            <label htmlFor="culture_background">
              <span className="label-icon">📖</span>
              文化背景介绍
            </label>
            <textarea
              id="culture_background"
              name="culture_background"
              value={article.culture_background}
              onChange={handleInputChange}
              placeholder="请输入文化背景介绍，描述该地的历史渊源和文化特色..."
              rows="4"
              className="textarea-input"
            />
          </div>
        </div>

        {/* 游览攻略卡片 */}
        <div className="editor-card">
          <h2 className="card-title">
            <span className="card-icon">🗺️</span>
            游览攻略
          </h2>
          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="opening_hours">
                <span className="label-icon">🕐</span>
                开放时间
              </label>
              <input
                type="text"
                id="opening_hours"
                name="opening_hours"
                value={article.opening_hours}
                onChange={handleInputChange}
                placeholder="如：8:00-17:00"
              />
            </div>

            <div className="form-group half-width">
              <label htmlFor="ticket_price">
                <span className="label-icon">🎫</span>
                门票价格
              </label>
              <input
                type="text"
                id="ticket_price"
                name="ticket_price"
                value={article.ticket_price}
                onChange={handleInputChange}
                placeholder="如：100元/人"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="transportation">
              <span className="label-icon">🚌</span>
              交通方式
            </label>
            <textarea
              id="transportation"
              name="transportation"
              value={article.transportation}
              onChange={handleInputChange}
              placeholder="请输入交通方式，如：苏州汽车北站乘大巴直达..."
              rows="3"
              className="textarea-input"
            />
          </div>
        </div>

        {/* 游览视频卡片 */}
        <div className="editor-card">
          <h2 className="card-title">
            <span className="card-icon">🎬</span>
            游览视频
          </h2>
          <div className="form-group">
            <label htmlFor="video_url">
              <span className="label-icon">🎥</span>
              视频URL
            </label>
            <input
              type="text"
              id="video_url"
              name="video_url"
              value={article.video_url}
              onChange={handleInputChange}
              placeholder="请输入视频URL（支持 mp4 格式）"
            />
            {article.video_url && (
              <div className="video-preview">
                <video controls className="preview-video">
                  <source src={article.video_url} type="video/mp4" />
                  您的浏览器不支持视频播放
                </video>
              </div>
            )}
          </div>
        </div>

        {/* 地理信息卡片 */}
        <div className="editor-card">
          <h2 className="card-title">
            <span className="card-icon">📍</span>
            地理位置信息
          </h2>
          <div className="form-group">
            <CoordinatePicker
              initialCoordinates={article.coordinates_lat && article.coordinates_lng ? [parseFloat(article.coordinates_lat), parseFloat(article.coordinates_lng)] : null}
              onCoordinatesChange={(coords) => setArticle(prev => ({ ...prev, coordinates_lat: coords.lat, coordinates_lng: coords.lng }))}
            />
          </div>
        </div>

        {/* 内容编辑卡片 */}
        <div className="editor-card">
          <h2 className="card-title">
            <span className="card-icon">📄</span>
            文章内容
          </h2>
          <div className="form-group">
            <ReactQuill
              id="content"
              theme="snow"
              value={article.content}
              onChange={(value) => setArticle(prev => ({ ...prev, content: value }))}
              placeholder="请输入文章内容，分享你的文化探索经历..."
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                  [{ 'font': [] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  [{ 'indent': '-1'}, { 'indent': '+1' }],
                  [{ 'align': [] }],
                  ['link', 'image', 'video'],
                  ['clean']
                ]
              }}
              className="content-editor"
            />
          </div>
        </div>

        {/* 文化小贴士卡片 */}
        <div className="editor-card">
          <h2 className="card-title">
            <span className="card-icon">💡</span>
            文化小贴士
          </h2>
          <div className="form-group">
            <label htmlFor="culture_tips">
              <span className="label-icon">📝</span>
              小贴士内容
            </label>
            <textarea
              id="culture_tips"
              name="culture_tips"
              value={article.culture_tips}
              onChange={handleInputChange}
              placeholder="请输入文化小贴士，每条提示用换行分隔。例如：&#10;周庄的摇快船习俗起源于明代，是当地重要的民俗活动，每年农历三月三举行。&#10;当地特色小吃包括：万三蹄、青团、桂花糖藕，建议游客品尝。"
              rows="6"
              className="textarea-input"
            />
            <p className="input-hint">每条提示用换行分隔，会自动生成卡片式展示</p>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="form-actions">
          <button type="button" className="action-button cancel-button" onClick={onCancel}>
            <span className="btn-icon">❌</span>
            取消
          </button>
          <button type="button" className="action-button save-button" onClick={() => onSave(article)}>
            <span className="btn-icon">💾</span>
            保存
          </button>
          <button type="submit" className="action-button publish-button">
            <span className="btn-icon">{article.status === 'published' ? '🔄' : '🚀'}</span>
            {article.status === 'published' ? '更新' : '发布'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleEditor;