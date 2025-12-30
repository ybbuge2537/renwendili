import React, { useState, useEffect } from 'react';
import CMSNavbar from '../components/CMSNavbar.js';
import dataManager from '../data/dataManager.js';

const CMSArticleManagement = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  // 表单状态
  const [formData, setFormData] = useState({
    title: { zh: '', en: '' },
    content: { zh: '', en: '' },
    category_id: '',
    tag_ids: [],
    author_id: 'user_admin',
    summary: { zh: '', en: '' },
    featured_image: '',
    location_id: '',
    keywords: { zh: '', en: '' }
  });

  useEffect(() => {
    const allArticles = dataManager.getAllArticles();
    setArticles(allArticles);
    setFilteredArticles(allArticles);
    
    const allCategories = dataManager.getAllCategories();
    setCategories(allCategories);
    
    const allTags = dataManager.getAllTags();
    setTags(allTags);
  }, []);

  // 处理表单输入变化
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // 处理标签选择
  const handleTagChange = (tagId) => {
    setFormData(prev => {
      if (prev.tag_ids.includes(tagId)) {
        return {
          ...prev,
          tag_ids: prev.tag_ids.filter(id => id !== tagId)
        };
      } else {
        return {
          ...prev,
          tag_ids: [...prev.tag_ids, tagId]
        };
      }
    });
  };

  // 打开文章表单
  const openArticleForm = (article = null) => {
    setCurrentArticle(article);
    if (article) {
      setFormData({
        title: article.title || { zh: '', en: '' },
        content: article.content || { zh: '', en: '' },
        category_id: article.category_id || '',
        tag_ids: article.tags || [],
        author_id: article.author_id || 'user_admin',
        summary: article.summary || { zh: '', en: '' },
        featured_image: article.featured_image || '',
        location_id: article.location_id || '',
        keywords: article.keywords || { zh: '', en: '' }
      });
    } else {
      setFormData({
        title: { zh: '', en: '' },
        content: { zh: '', en: '' },
        category_id: '',
        tag_ids: [],
        author_id: 'user_admin',
        summary: { zh: '', en: '' },
        featured_image: '',
        location_id: '',
        keywords: { zh: '', en: '' }
      });
    }
    setShowArticleForm(true);
  };

  // 关闭文章表单
  const closeArticleForm = () => {
    setShowArticleForm(false);
    setCurrentArticle(null);
  };

  // 保存文章
  const handleSaveArticle = () => {
    if (!formData.title.zh.trim() || !formData.content.zh.trim()) {
      alert('请填写中文标题和内容');
      return;
    }

    if (currentArticle) {
      // 更新现有文章
      dataManager.updateArticle(currentArticle.id, {
        ...formData,
        updated_at: new Date().toISOString()
      });
    } else {
      // 添加新文章
      dataManager.addArticle(formData);
    }

    // 更新文章列表
    const updatedArticles = dataManager.getAllArticles();
    setArticles(updatedArticles);
    setFilteredArticles(updatedArticles);
    
    // 关闭表单
    closeArticleForm();
  };

  useEffect(() => {
    let result = articles;
    if (searchQuery) {
      result = dataManager.searchArticles(searchQuery);
    }
    if (statusFilter) {
      result = result.filter(article => article.status === statusFilter);
    }
    setFilteredArticles(result);
  }, [searchQuery, statusFilter, articles]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleArticleSelect = (id) => {
    if (selectedArticles.includes(id)) {
      setSelectedArticles(selectedArticles.filter(articleId => articleId !== id));
    } else {
      setSelectedArticles([...selectedArticles, id]);
    }
  };

  const handleBulkDelete = () => {
    selectedArticles.forEach(id => {
      dataManager.deleteArticle(id);
    });
    setArticles(dataManager.getAllArticles());
    setSelectedArticles([]);
  };

  const handleBulkMoveToTrash = () => {
    selectedArticles.forEach(id => {
      dataManager.updateArticle(id, { status: 'trash' });
    });
    setArticles(dataManager.getAllArticles());
    setSelectedArticles([]);
  };

  const handlePublish = (id) => {
    dataManager.updateArticle(id, { status: 'published' });
    setArticles(dataManager.getAllArticles());
  };

  const handleDraft = (id) => {
    dataManager.updateArticle(id, { status: 'draft' });
    setArticles(dataManager.getAllArticles());
  };

  const handleTrash = (id) => {
    dataManager.updateArticle(id, { status: 'trash' });
    setArticles(dataManager.getAllArticles());
  };

  return (
    <div className="cms-container">
      <CMSNavbar />
      <div className="cms-content">
        <div className="cms-sidebar">
          <h3>管理菜单</h3>
          <div className="cms-sidebar-nav">
            <a href="/cms/dashboard" className="cms-nav-link">仪表板</a>
            <a href="/cms/articles" className="cms-nav-link active">文章管理</a>
            <a href="/cms/media" className="cms-nav-link">媒体管理</a>
            <a href="/cms/categories" className="cms-nav-link">分类管理</a>
            <a href="/cms/tags" className="cms-nav-link">标签管理</a>
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
              <h2>文章管理</h2>
              <button className="btn btn-primary" onClick={() => openArticleForm()}>撰写新文章</button>
            </div>
            <div className="card-body">
              <div className="article-filters">
                <div className="filter-group">
                  <input 
                    type="text" 
                    placeholder="搜索文章..." 
                    value={searchQuery}
                    onChange={handleSearch}
                    className="search-input"
                  />
                </div>
                <div className="filter-group">
                  <select 
                    value={statusFilter}
                    onChange={handleStatusFilter}
                    className="status-filter"
                  >
                    <option value="">全部状态</option>
                    <option value="draft">草稿</option>
                    <option value="pending">待审核</option>
                    <option value="published">已发布</option>
                    <option value="trash">回收站</option>
                  </select>
                </div>
              </div>
              
              <div className="bulk-actions">
                <button 
                  className="btn btn-danger" 
                  onClick={handleBulkDelete}
                  disabled={selectedArticles.length === 0}
                >
                  批量删除
                </button>
                <button 
                  className="btn btn-warning" 
                  onClick={handleBulkMoveToTrash}
                  disabled={selectedArticles.length === 0}
                >
                  移至回收站
                </button>
              </div>
              
              <div className="article-table-container">
                <table className="article-table">
                  <thead>
                    <tr>
                      <th><input 
                        type="checkbox" 
                        checked={selectedArticles.length === filteredArticles.length && filteredArticles.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedArticles(filteredArticles.map(article => article.id));
                          } else {
                            setSelectedArticles([]);
                          }
                        }}
                      /></th>
                      <th>标题</th>
                      <th>作者</th>
                      <th>分类</th>
                      <th>状态</th>
                      <th>发布时间</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredArticles.map(article => (
                      <tr key={article.id}>
                        <td>
                          <input 
                            type="checkbox" 
                            checked={selectedArticles.includes(article.id)}
                            onChange={() => handleArticleSelect(article.id)}
                          />
                        </td>
                        <td>{article.title.zh}</td>
                        <td>{article.author_id}</td>
                        <td>{article.category_id}</td>
                        <td>
                          <span className={`status-badge status-${article.status}`}>
                            {article.status === 'draft' && '草稿'}
                            {article.status === 'pending' && '待审核'}
                            {article.status === 'published' && '已发布'}
                            {article.status === 'trash' && '回收站'}
                          </span>
                        </td>
                        <td>{new Date(article.created_at).toLocaleString()}</td>
                        <td className="article-actions">
                          <button className="action-btn edit-btn" onClick={() => openArticleForm(article)}>编辑</button>
                          {article.status !== 'published' && (
                            <button className="action-btn publish-btn" onClick={() => handlePublish(article.id)}>发布</button>
                          )}
                          {article.status === 'published' && (
                            <button className="action-btn draft-btn" onClick={() => handleDraft(article.id)}>转为草稿</button>
                          )}
                          {article.status !== 'trash' && (
                            <button className="action-btn trash-btn" onClick={() => handleTrash(article.id)}>删除</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 文章表单模态框 */}
      {showArticleForm && (
        <div className="modal-overlay">
          <div className="modal article-form-modal">
            <div className="modal-header">
              <h3>{currentArticle ? '编辑文章' : '撰写新文章'}</h3>
              <button className="modal-close-btn" onClick={closeArticleForm}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>中文标题</label>
                <input 
                  type="text" 
                  name="title.zh" 
                  value={formData.title.zh}
                  onChange={handleFormChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>英文标题</label>
                <input 
                  type="text" 
                  name="title.en" 
                  value={formData.title.en}
                  onChange={handleFormChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>分类</label>
                <select 
                  name="category_id" 
                  value={formData.category_id}
                  onChange={handleFormChange}
                  className="form-control"
                >
                  <option value="">选择分类</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name.zh}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>标签</label>
                <div className="tags-selector">
                  {tags.map(tag => (
                    <label key={tag.id} className="tag-checkbox">
                      <input 
                        type="checkbox" 
                        checked={formData.tag_ids.includes(tag.id)}
                        onChange={() => handleTagChange(tag.id)}
                      />
                      {tag.name.zh}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>中文摘要</label>
                <textarea 
                  name="summary.zh" 
                  value={formData.summary.zh}
                  onChange={handleFormChange}
                  className="form-control"
                  rows="3"
                ></textarea>
              </div>
              <div className="form-group">
                <label>英文摘要</label>
                <textarea 
                  name="summary.en" 
                  value={formData.summary.en}
                  onChange={handleFormChange}
                  className="form-control"
                  rows="3"
                ></textarea>
              </div>
              <div className="form-group">
                <label>中文内容</label>
                <textarea 
                  name="content.zh" 
                  value={formData.content.zh}
                  onChange={handleFormChange}
                  className="form-control"
                  rows="8"
                ></textarea>
              </div>
              <div className="form-group">
                <label>英文内容</label>
                <textarea 
                  name="content.en" 
                  value={formData.content.en}
                  onChange={handleFormChange}
                  className="form-control"
                  rows="8"
                ></textarea>
              </div>
              <div className="form-group">
                <label>特色图片URL</label>
                <input 
                  type="text" 
                  name="featured_image" 
                  value={formData.featured_image}
                  onChange={handleFormChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>中文关键词</label>
                <input 
                  type="text" 
                  name="keywords.zh" 
                  value={formData.keywords.zh}
                  onChange={handleFormChange}
                  className="form-control"
                  placeholder="用逗号分隔"
                />
              </div>
              <div className="form-group">
                <label>英文关键词</label>
                <input 
                  type="text" 
                  name="keywords.en" 
                  value={formData.keywords.en}
                  onChange={handleFormChange}
                  className="form-control"
                  placeholder="用逗号分隔"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeArticleForm}>取消</button>
              <button className="btn btn-primary" onClick={handleSaveArticle}>保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CMSArticleManagement;
