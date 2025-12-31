import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dataManager from '../../data/dataManager';
import './TourismTemplatePage.css';

const TourismTemplatePage = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const articlesData = await dataManager.getAllArticles();
        const publishedArticles = articlesData.filter(article => 
          article.status === 'published' && 
          (article.category === 'culture' || article.category === 'history' || article.category === 'nature')
        );
        setArticles(publishedArticles);
      } catch (err) {
        setError('获取文章失败');
        console.error('获取文章失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleCardClick = (articleId) => {
    navigate(`/article/${articleId}`);
  };

  if (loading) {
    return (
      <div className="tourism-template-page">
        <div className="loading-message">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tourism-template-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="tourism-template-page">
      <div className="page-header">
        <h1>旅游地理</h1>
        <p>探索世界各地的旅游胜地和自然奇观</p>
      </div>
      
      {articles.length === 0 ? (
        <div className="empty-message">暂无旅游文章</div>
      ) : (
        <div className="tourism-card-grid">
          {articles.map((article) => (
            <div 
              key={article.id} 
              className="tourism-card"
              onClick={() => handleCardClick(article.id)}
            >
              <div className="card-image">
                {article.cover_image ? (
                  <img src={article.cover_image} alt={article.title} />
                ) : (
                  <div className="card-placeholder">暂无封面</div>
                )}
                <div className="card-category">
                  {article.category === 'culture' ? '文化' : 
                   article.category === 'history' ? '历史' : 
                   article.category === 'nature' ? '自然' : article.category}
                </div>
              </div>
              
              <div className="card-content">
                <h3 className="card-title">{article.title}</h3>
                <p className="card-description">
                  {article.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                </p>
                
                <div className="card-meta">
                  <span className="meta-date">
                    {new Date(article.created_at).toLocaleDateString('zh-CN')}
                  </span>
                  {article.tags && (
                    <div className="meta-tags">
                      {article.tags.split(',').slice(0, 3).map((tag, index) => (
                        <span key={index} className="meta-tag">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TourismTemplatePage;
