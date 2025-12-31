import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import dataManager from '../data/dataManager';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const articles = await dataManager.getAllArticles();
        const foundArticle = articles.find(article => article.id == id);
        
        if (foundArticle) {
          setArticle(foundArticle);
        } else {
          setError('文章不存在');
        }
      } catch (err) {
        setError('获取文章失败');
        console.error('获取文章失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return <div className="article-detail-loading">加载中...</div>;
  }

  if (error || !article) {
    return <div className="article-detail-error">{error || '文章不存在'}</div>;
  }

  return (
    <div className="article-detail-page">
      <div className="article-detail-content">
        <h1>{article.title}</h1>
        
        {article.cover_image && (
          <div className="article-detail-cover">
            <img src={article.cover_image} alt={article.title} />
          </div>
        )}
        
        <div className="article-detail-meta">
          <span className="article-detail-date">
            {new Date(article.created_at).toLocaleDateString('zh-CN')}
          </span>
          {article.tags && (
            <div className="article-detail-tags">
              {article.tags.split(',').map((tag, index) => (
                <span key={index} className="article-detail-tag">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="article-detail-body">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
        
        {article.coordinates_lat && article.coordinates_lng && (
          <div className="article-detail-location">
            <h3>游玩地点</h3>
            <p>纬度: {article.coordinates_lat}</p>
            <p>经度: {article.coordinates_lng}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDetailPage;