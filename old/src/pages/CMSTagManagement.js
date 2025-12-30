import React, { useState, useEffect } from 'react';
import CMSNavbar from '../components/CMSNavbar.js';
import dataManager from '../data/dataManager.js';

const CMSTagManagement = () => {
  const [tags, setTags] = useState([]);
  const [articles, setArticles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [tagForm, setTagForm] = useState({
    name: '',
    slug: ''
  });
  const [selectedArticles, setSelectedArticles] = useState([]);

  useEffect(() => {
    const allTags = dataManager.getAllTags();
    const allArticles = dataManager.getAllArticles();
    setTags(allTags);
    setArticles(allArticles);
  }, []);

  const handleOpenModal = (tag = null) => {
    if (tag) {
      setEditingTag(tag);
      setTagForm({
        name: tag.name,
        slug: tag.slug
      });
    } else {
      setEditingTag(null);
      setTagForm({
        name: '',
        slug: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTag(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTagForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingTag) {
      dataManager.updateTag(editingTag.id, tagForm);
    } else {
      dataManager.addTag(tagForm);
    }
    
    setTags(dataManager.getAllTags());
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('确定要删除该标签吗？相关文章将移除该标签关联。')) {
      dataManager.deleteTag(id);
      setTags(dataManager.getAllTags());
    }
  };

  const handleArticlesModalOpen = (tag) => {
    setSelectedTag(tag);
    // 获取已关联该标签的文章
    const taggedArticles = dataManager.getArticlesByTag(tag.id);
    const taggedArticleIds = taggedArticles.map(article => article.id);
    setSelectedArticles(taggedArticleIds);
    setIsArticleModalOpen(true);
  };

  const handleArticlesModalClose = () => {
    setIsArticleModalOpen(false);
    setSelectedTag(null);
  };

  const handleArticleToggle = (articleId) => {
    let newSelectedArticles;
    if (selectedArticles.includes(articleId)) {
      newSelectedArticles = selectedArticles.filter(id => id !== articleId);
    } else {
      newSelectedArticles = [...selectedArticles, articleId];
    }
    setSelectedArticles(newSelectedArticles);
  };

  const handleSaveArticleTags = () => {
    // 更新所有文章的标签
    articles.forEach(article => {
      let updatedTags = article.tags || [];
      
      if (selectedArticles.includes(article.id)) {
        // 添加标签
        if (!updatedTags.includes(selectedTag.id)) {
          updatedTags.push(selectedTag.id);
        }
      } else {
        // 移除标签
        updatedTags = updatedTags.filter(tagId => tagId !== selectedTag.id);
      }
      
      dataManager.updateArticle(article.id, { tags: updatedTags });
    });
    
    handleArticlesModalClose();
  };

  // 计算每个标签关联的文章数量
  const getArticleCount = (tagId) => {
    return dataManager.getArticlesByTag(tagId).length;
  };

  return (
    <div className="cms-container">
      <CMSNavbar />
      <div className="cms-content">
        <div className="cms-sidebar">
          <h3>管理菜单</h3>
          <div className="cms-sidebar-nav">
            <a href="/cms/dashboard" className="cms-nav-link">仪表板</a>
            <a href="/cms/articles" className="cms-nav-link">文章管理</a>
            <a href="/cms/media" className="cms-nav-link">媒体管理</a>
            <a href="/cms/categories" className="cms-nav-link">分类管理</a>
            <a href="/cms/tags" className="cms-nav-link active">标签管理</a>
            <a href="/cms/locations" className="cms-nav-link">位置管理</a>
            <a href="/cms/users" className="cms-nav-link">用户管理</a>
            <a href="/cms/roles" className="cms-nav-link">角色管理</a>
            <a href="/cms/settings" className="cms-nav-link">系统设置</a>
            <a href="/" className="cms-nav-link">退出登录</a>
          </div>
        </div>
        <div className="cms-main-content">
          <div className="cms-card">
            <div className="card-header">
              <h2>标签管理</h2>
              <button className="btn btn-primary" onClick={() => handleOpenModal()}>添加标签</button>
            </div>
            <div className="card-body">
              <table className="tags-table">
                <thead>
                  <tr>
                    <th>标签名称</th>
                    <th>别名</th>
                    <th>文章数量</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {tags.map(tag => (
                    <tr key={tag.id}>
                      <td>{tag.name}</td>
                      <td>{tag.slug}</td>
                      <td>{getArticleCount(tag.id)}</td>
                      <td className="tag-actions">
                        <button className="action-btn edit-btn" onClick={() => handleOpenModal(tag)}>编辑</button>
                        <button className="action-btn articles-btn" onClick={() => handleArticlesModalOpen(tag)}>关联文章</button>
                        <button className="action-btn delete-btn" onClick={() => handleDelete(tag.id)}>删除</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingTag ? '编辑标签' : '添加标签'}</h3>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label htmlFor="name">标签名称</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={tagForm.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="slug">标签别名</label>
                <input 
                  type="text" 
                  id="slug" 
                  name="slug" 
                  value={tagForm.slug}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>取消</button>
                <button type="submit" className="btn btn-primary">保存</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {isArticleModalOpen && selectedTag && (
        <div className="modal-overlay">
          <div className="modal articles-modal">
            <div className="modal-header">
              <h3>关联文章 - {selectedTag.name}</h3>
              <button className="modal-close" onClick={handleArticlesModalClose}>×</button>
            </div>
            <div className="modal-body">
              <h4>选择文章:</h4>
              <div className="articles-list">
                {articles.map(article => (
                  <div key={article.id} className="article-item">
                    <input 
                      type="checkbox" 
                      id={`article-${article.id}`}
                      checked={selectedArticles.includes(article.id)}
                      onChange={() => handleArticleToggle(article.id)}
                    />
                    <label htmlFor={`article-${article.id}`}>{article.title.zh}</label>
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleArticlesModalClose}>取消</button>
                <button type="button" className="btn btn-primary" onClick={handleSaveArticleTags}>保存</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CMSTagManagement;
