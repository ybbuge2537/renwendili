import React, { useState, useEffect } from 'react';
import CMSLayout from '../../components/cms/CMSLayout.js';
import ArticleEditor from '../../components/ArticleEditor';
import { checkActionPermission, canEditArticle, canDeleteArticle } from '../../services/permission.js';
import { articleApi } from '../../services/api.js';
import './ArticlesPage.css';

function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [selectedArticles, setSelectedArticles] = useState([]);
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  // 从API获取文章列表
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articlesData = await articleApi.getAllArticles();
        // 转换API返回的数据格式，确保前端组件可以正确使用
        const formattedArticles = articlesData.map(article => ({
          id: article.article_id,
          title: article.title,
          content: article.content,
          authorId: article.author_id,
          author: article.author_name || '未知作者', // 如果API返回了作者名称，使用作者名称
          category: article.category || '未分类',
          region_id: article.region_id,
          status: article.status,
          date: article.create_time ? new Date(article.create_time).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          update_time: article.update_time
        }));
        setArticles(formattedArticles);
      } catch (error) {
        console.error('获取文章列表失败:', error);
        // 如果API调用失败，可以使用模拟数据作为备选
        const mockArticles = [
          { id: 1, title: '全球气候变化对人文地理的影响', author: 'admin', authorId: 1, category: '气候变化', date: '2025-12-27', status: 'published' },
          { id: 2, title: '亚洲城市化进程分析', author: 'admin', authorId: 1, category: '城市化', date: '2025-12-26', status: 'draft' },
          { id: 3, title: '欧洲文化遗产保护现状', author: 'writer', authorId: 3, category: '文化遗产', date: '2025-12-25', status: 'published' },
          { id: 4, title: '非洲人口增长趋势预测', author: 'writer', authorId: 3, category: '人口', date: '2025-12-24', status: 'published' },
          { id: 5, title: '南美洲自然资源分布研究', author: 'admin', authorId: 1, category: '自然资源', date: '2025-12-23', status: 'draft' }
        ];
        setArticles(mockArticles);
      }
    };

    fetchArticles();
  }, []);

  // 文章筛选逻辑
  useEffect(() => {
    let result = [...articles];
    
    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(article => 
        article.title.toLowerCase().includes(query) || 
        article.author.toLowerCase().includes(query)
      );
    }
    
    // 分类筛选
    if (filterCategory) {
      result = result.filter(article => article.category === filterCategory);
    }
    
    setFilteredArticles(result);
  }, [articles, searchQuery, filterCategory]);

  // 获取所有唯一分类
  const categories = [...new Set(articles.map(article => article.category))];

  const handleAddArticle = () => {
    // 显示分栏编辑器
    setEditingArticle({
      title: '',
      content: '',
      category: '',
      tags: '',
      region: '',
      status: 'draft',
      coverImage: ''
    });
    setIsEditing(false);
    setShowEditor(true);
  };

  const handleEditArticle = (article) => {
    // 显示分栏编辑器
    setEditingArticle(article);
    setIsEditing(true);
    setShowEditor(true);
  };

  const handleDeleteArticle = async (id) => {
    try {
      await articleApi.deleteArticle(id);
      // 删除成功后更新本地状态
      setArticles(articles.filter(article => article.id !== id));
    } catch (error) {
      console.error('删除文章失败:', error);
      alert('删除文章失败，请稍后重试');
    }
  };

  const handleSaveArticle = async (article) => {
    try {
      // 准备发送到API的数据，确保与后端模型匹配
      const articleData = {
        title: article.title,
        content: article.content,
        author_id: loggedInUser?.id || 1, // 使用当前登录用户ID或默认ID
        region_id: article.region_id || null,
        status: article.status || 'draft'
        // 如果需要其他字段，可以在这里添加
      };

      if (isEditing) {
        // 更新现有文章
        const updatedArticle = await articleApi.updateArticle(article.id, articleData);
        // 更新本地状态，保持前端数据一致性
        setArticles(articles.map(art => {
          if (art.id === updatedArticle.article_id) {
            return {
              ...art,
              id: updatedArticle.article_id,
              title: updatedArticle.title,
              content: updatedArticle.content,
              authorId: updatedArticle.author_id,
              region_id: updatedArticle.region_id,
              status: updatedArticle.status,
              update_time: updatedArticle.update_time,
              date: new Date(updatedArticle.update_time).toISOString().split('T')[0]
            };
          }
          return art;
        }));
      } else {
        // 添加新文章
        const newArticle = await articleApi.createArticle(articleData);
        // 添加到本地状态，保持前端数据一致性
        const formattedNewArticle = {
          id: newArticle.article_id,
          title: newArticle.title,
          content: newArticle.content,
          authorId: newArticle.author_id,
          author: loggedInUser?.username || '未知作者',
          region_id: newArticle.region_id,
          status: newArticle.status,
          date: new Date(newArticle.create_time).toISOString().split('T')[0],
          update_time: newArticle.update_time
        };
        setArticles([...articles, formattedNewArticle]);
      }
      setShowEditor(false);
      setEditingArticle(null);
    } catch (error) {
      console.error('保存文章失败:', error);
      alert('保存文章失败，请稍后重试');
    }
  };

  const handleCancelEdit = () => {
    setShowEditor(false);
    setEditingArticle(null);
  };

  // 处理文章选择
  const handleSelectArticle = (id) => {
    setSelectedArticles(prev => {
      if (prev.includes(id)) {
        return prev.filter(articleId => articleId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // 处理全选
  const handleSelectAll = () => {
    if (selectedArticles.length === filteredArticles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(filteredArticles.map(article => article.id));
    }
  };

  // 处理批量删除
  const handleBatchDelete = async () => {
    if (selectedArticles.length === 0) return;
    
    try {
      for (const id of selectedArticles) {
        await articleApi.deleteArticle(id);
      }
      // 删除成功后更新本地状态
      setArticles(articles.filter(article => !selectedArticles.includes(article.id)));
      setSelectedArticles([]);
    } catch (error) {
      console.error('批量删除文章失败:', error);
      alert('批量删除文章失败，请稍后重试');
    }
  };

  return (
    <CMSLayout>
      <div className={`articles-page ${showEditor ? 'with-editor' : ''}`}>
        {/* 第一行：标题和搜索框 */}
        <div className="main-header">
          <h1>文章管理</h1>
          <div className="header-search">
            <input
              type="text"
              placeholder="搜索文章标题或作者"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* 第二行：操作按钮和筛选器 */}
        <div className="action-bar">
          {checkActionPermission(loggedInUser, 'article', 'add') && (
            <button className="add-article-button" onClick={handleAddArticle}>
              + 添加文章
            </button>
          )}
          
          {checkActionPermission(loggedInUser, 'article', 'delete') && selectedArticles.length > 0 && (
            <button className="batch-delete-button" onClick={handleBatchDelete}>
              批量删除 ({selectedArticles.length})
            </button>
          )}
          
          <div className="filter-section">
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="category-filter"
            >
              <option value="">所有分类</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="articles-content-wrapper">
          {/* 左侧文章列表 */}
          <div className="articles-list-container">
            <div className="articles-table-container">
              <table className="articles-table">
                <thead>
                  <tr>
                    <th>
                      <input 
                        type="checkbox" 
                        checked={selectedArticles.length === filteredArticles.length && filteredArticles.length > 0} 
                        onChange={handleSelectAll} 
                      />
                    </th>
                    <th>标题</th>
                    <th>作者</th>
                    <th>分类</th>
                    <th>日期</th>
                    <th>状态</th>
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
                          onChange={() => handleSelectArticle(article.id)} 
                        />
                      </td>
                      <td className="article-title">{article.title}</td>
                      <td>{article.author}</td>
                      <td>{article.category}</td>
                      <td>{article.date}</td>
                      <td>
                        <span className={`status-badge ${article.status}`}>
                          {article.status === 'published' ? '已发布' : '草稿'}
                        </span>
                      </td>
                      <td className="actions">
                        {canEditArticle(loggedInUser, article) && (
                          <button className="edit-button" onClick={() => handleEditArticle(article)}>编辑</button>
                        )}
                        {canDeleteArticle(loggedInUser, article) && (
                          <button className="delete-button" onClick={() => handleDeleteArticle(article.id)}>
                            删除
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 右侧文章编辑器 */}
          {showEditor && (
            <div className="articles-editor-container">
              <div className="editor-header">
                <h2>{isEditing ? '编辑文章' : '添加新文章'}</h2>
                <button className="close-button" onClick={handleCancelEdit}>
                  ×
                </button>
              </div>
              <div className="editor-content">
                <ArticleEditor
                  initialArticle={editingArticle}
                  onSave={handleSaveArticle}
                  onCancel={handleCancelEdit}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </CMSLayout>
  );
}

export default ArticlesPage;