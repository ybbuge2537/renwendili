import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CoordinatePicker from './CoordinatePicker';
import TrackRecorder from './TrackRecorder';
import './ArticleEditor.css';

const ArticleEditor = ({ initialArticle = null, onSave, onCancel }) => {
  const [article, setArticle] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    region: '',
    status: 'draft',
    coverImage: '',
    coordinates: null,
    trackData: []
  });

  useEffect(() => {
    if (initialArticle) {
      setArticle(initialArticle);
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
      <form onSubmit={handleSubmit} className="editor-form">
        {/* 标题输入 */}
        <div className="form-group">
          <label htmlFor="title">文章标题</label>
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

        {/* 分类选择 */}
        <div className="form-group">
          <label htmlFor="category">文章分类</label>
          <select
            id="category"
            name="category"
            value={article.category}
            onChange={handleInputChange}
            required
          >
            <option value="">请选择分类</option>
            <option value="regional">区域地理</option>
            <option value="cultural">文化地理</option>
            <option value="economic">经济地理</option>
            <option value="history">历史地理</option>
            <option value="tourism">旅游地理</option>
            <option value="climate">气候地理</option>
            <option value="environmental">环境地理</option>
          </select>
        </div>

        {/* 地区选择 */}
        <div className="form-group">
          <label htmlFor="region">相关地区</label>
          <input
            type="text"
            id="region"
            name="region"
            value={article.region}
            onChange={handleInputChange}
            placeholder="请输入相关地区"
          />
        </div>

        {/* 标签输入 */}
        <div className="form-group">
          <label htmlFor="tags">标签</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={article.tags}
            onChange={handleInputChange}
            placeholder="请输入标签，用逗号分隔"
          />
        </div>

        {/* 封面图片 */}
        <div className="form-group">
          <label htmlFor="coverImage">封面图片</label>
          <input
            type="text"
            id="coverImage"
            name="coverImage"
            value={article.coverImage}
            onChange={handleInputChange}
            placeholder="请输入封面图片URL"
          />
        </div>

        {/* 地理信息 - 坐标选择 */}
        <div className="form-group">
          <CoordinatePicker
            initialCoordinates={article.coordinates ? [parseFloat(article.coordinates.lat), parseFloat(article.coordinates.lng)] : null}
            onCoordinatesChange={(coords) => setArticle(prev => ({ ...prev, coordinates: coords }))}
          />
        </div>

        {/* 地理信息 - 轨迹录制 */}
        <div className="form-group">
          <TrackRecorder
            initialTrack={article.trackData}
            onTrackChange={(track) => setArticle(prev => ({ ...prev, trackData: track }))}
          />
        </div>

        {/* 内容编辑 */}
        <div className="form-group">
          <label htmlFor="content">文章内容</label>
          <ReactQuill
            id="content"
            theme="snow"
            value={article.content}
            onChange={(value) => setArticle(prev => ({ ...prev, content: value }))}
            placeholder="请输入文章内容"
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

        {/* 状态选择 */}
        <div className="form-group">
          <label htmlFor="status">发布状态</label>
          <select
            id="status"
            name="status"
            value={article.status}
            onChange={handleInputChange}
          >
            <option value="draft">草稿</option>
            <option value="published">已发布</option>
            <option value="pending">待审核</option>
          </select>
        </div>

        {/* 操作按钮 */}
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onCancel}>
            取消
          </button>
          <button type="button" className="save-draft-button" onClick={() => onSave({ ...article, status: 'draft' })}>
            保存草稿
          </button>
          <button type="submit" className="publish-button">
            {article.status === 'published' ? '更新' : '发布'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleEditor;