import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import dataManager from '../data/dataManager';
import './ArticleBrowsePage.css';

const ArticleBrowsePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wantToGo, setWantToGo] = useState(false);
  const [beenThere, setBeenThere] = useState(false);
  const [liked, setLiked] = useState(false);
  const [recommendedArticles, setRecommendedArticles] = useState([]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const articles = await dataManager.getAllArticles();
        const foundArticle = articles.find(art => art.id == id);
        
        if (foundArticle) {
          setArticle(foundArticle);
          fetchRecommendedArticles(foundArticle);
          
          // 增加阅读量
          try {
            await fetch(`http://localhost:5001/api/articles/${id}/views`, {
              method: 'POST'
            });
          } catch (err) {
            console.error('增加阅读量失败:', err);
          }
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

  const fetchRecommendedArticles = async (currentArticle) => {
    try {
      const allArticles = await dataManager.getAllArticles();
      const publishedArticles = allArticles.filter(art => 
        art.status === 'published' && 
        art.id != currentArticle.id
      );
      setRecommendedArticles(publishedArticles.slice(0, 6));
    } catch (err) {
      console.error('获取推荐文章失败:', err);
    }
  };

  const handleWantToGo = () => {
    setWantToGo(!wantToGo);
  };

  const handleBeenThere = () => {
    setBeenThere(!beenThere);
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleShare = (platform) => {
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <div className="article-browse-loading">加载中...</div>;
  }

  if (error || !article) {
    return <div className="article-browse-error">{error || '文章不存在'}</div>;
  }

  return (
    <div className="article-browse-page">
      {/* 头部沉浸区 */}
      <section className="hero-section">
        <div className="hero-background">
          {article.cover_image && (
            <img 
              src={article.cover_image} 
              alt={article.title} 
              className="hero-image"
            />
          )}
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-location-tag">
            {article.category === 'culture' && '文化探索'}
            {article.category === 'history' && '历史之旅'}
            {article.category === 'lifestyle' && '生活体验'}
          </div>
          <h1 className="hero-title">{article.title}</h1>
          <div className="hero-meta">
            <div className="meta-author">
              <div className="author-avatar">
                <img src="/images/default-avatar.png" alt="作者" />
              </div>
              <div className="author-info">
                <span className="author-name">{article.author_name || '文旅达人'}</span>
                <span className="author-badge">认证</span>
              </div>
            </div>
            <div className="meta-stats">
              <span className="meta-time">
                {new Date(article.created_at).toLocaleDateString('zh-CN')}
              </span>
              <span className="meta-views">
                {article.views !== undefined && article.views !== null 
                  ? `${article.views}阅读` 
                  : '0阅读'}
              </span>
            </div>
            {article.tags && (
              <div className="meta-tags">
                {article.tags.split(',').map((tag, index) => (
                  <span key={index} className="meta-tag">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 正文内容区 */}
      <section className="content-section">
        {/* 文化背景小节 */}
        <div className="content-block culture-block">
          <h2 className="block-title">
            <span className="title-icon">📜</span>
            文化溯源：{article.category === 'culture' ? '江南水乡' : '历史遗迹'}
          </h2>
          <div className="block-content">
            <p className="culture-text">
              {article.culture_background || (
                article.category === 'culture' 
                  ? '这里曾是江南水乡的重要商贸中心，承载着千年的文化积淀。古镇的青石板路、古桥、流水，每一处都诉说着历史的沧桑与变迁。'
                  : '这片土地见证了无数历史事件的发生，每一处遗迹都承载着深厚的文化底蕴。'
              )}
            </p>
            <div className="culture-tip">
              <span className="tip-icon">💡</span>
              <span className="tip-text">
                {article.category === 'culture' 
                  ? '沈厅是明代巨富沈万三的故居，其"富可敌国"的传说流传至今。'
                  : '这里曾是古代重要的军事要塞，见证了多次历史战役。'}
              </span>
            </div>
          </div>
        </div>

        {/* 游览攻略小节 */}
        <div className="content-block guide-block">
          <h2 className="block-title">
            <span className="title-icon">🗺️</span>
            游览攻略
          </h2>
          <div className="guide-cards">
            <div className="guide-card">
              <div className="guide-icon">
                <span>🕐</span>
              </div>
              <div className="guide-info">
                <h4>开放时间</h4>
                <p>{article.opening_hours || '8:00-17:00'}</p>
              </div>
            </div>
            <div className="guide-card">
              <div className="guide-icon">
                <span>🎫</span>
              </div>
              <div className="guide-info">
                <h4>门票价格</h4>
                <p>{article.ticket_price || '100元/人'}</p>
              </div>
            </div>
            <div className="guide-card">
              <div className="guide-icon">
                <span>🚌</span>
              </div>
              <div className="guide-info">
                <h4>交通方式</h4>
                <p>{article.transportation || '苏州汽车北站乘大巴直达'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 视频嵌入 */}
        {article.video_url && (
          <div className="content-block video-block">
            <h2 className="block-title">
              <span className="title-icon">🎬</span>
              游览视频
            </h2>
            <div className="video-container">
              <video controls className="article-video">
                <source src={article.video_url} type="video/mp4" />
                您的浏览器不支持视频播放
              </video>
            </div>
          </div>
        )}

        {/* 正文内容 */}
        <div className="content-block article-body">
          <div 
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.content }} 
          />
        </div>

        {/* 文化小贴士 */}
        {article.culture_tips && (
          <div className="culture-tips">
            {article.culture_tips.split('\n').filter(tip => tip.trim()).map((tip, index) => (
              <div key={index} className="tip-item">
                <span className="tip-icon">🎏</span>
                <span className="tip-text">{tip.trim()}</span>
              </div>
            ))}
          </div>
        )}

        {/* 坐标信息 */}
        {article.coordinates_lat && article.coordinates_lng && (
          <div className="content-block location-block">
            <h2 className="block-title">
              <span className="title-icon">📍</span>
              游玩地点
            </h2>
            <div className="location-info">
              <p>纬度: {article.coordinates_lat}</p>
              <p>经度: {article.coordinates_lng}</p>
            </div>
          </div>
        )}
      </section>

      {/* 互动功能区 */}
      <section className="interaction-section">
        <div className="interaction-buttons">
          <button 
            className={`interaction-btn want-btn ${wantToGo ? 'active' : ''}`}
            onClick={handleWantToGo}
          >
            <span className="btn-icon">{wantToGo ? '❤' : '☆'}</span>
            <span className="btn-text">想去</span>
          </button>
          <button 
            className={`interaction-btn been-btn ${beenThere ? 'active' : ''}`}
            onClick={handleBeenThere}
          >
            <span className="btn-icon">{beenThere ? '👣' : '👣'}</span>
            <span className="btn-text">去过</span>
          </button>
          <button 
            className={`interaction-btn like-btn ${liked ? 'active' : ''}`}
            onClick={handleLike}
          >
            <span className="btn-icon">{liked ? '👍' : '👍'}</span>
            <span className="btn-text">点赞</span>
          </button>
        </div>

        <div className="share-buttons">
          <button className="share-btn wechat-btn" onClick={() => handleShare('wechat')}>
            <span className="share-icon">💬</span>
          </button>
          <button className="share-btn weibo-btn" onClick={() => handleShare('weibo')}>
            <span className="share-icon">🔗</span>
          </button>
          <button className="share-btn copy-btn" onClick={() => handleShare('copy')}>
            <span className="share-icon">📋</span>
            <span className="share-text">复制链接</span>
          </button>
        </div>

        <div className="comment-section">
          <div className="comment-header">
            <h3>评论区</h3>
            <div className="comment-input-wrapper">
              <input 
                type="text" 
                placeholder="写下你的游览感受..." 
                className="comment-input"
              />
              <button className="comment-submit-btn">发布</button>
            </div>
          </div>
          <div className="comment-list">
            <div className="comment-item">
              <div className="comment-avatar">
                <img src="/images/default-avatar.png" alt="用户" />
              </div>
              <div className="comment-content">
                <div className="comment-user">
                  <span className="user-name">小明</span>
                  <span className="user-badge">普通用户</span>
                </div>
                <p className="comment-text">上周刚去过，沈厅的木雕太精美了！</p>
                <div className="comment-actions">
                  <span className="comment-time">3天前</span>
                  <button className="reply-btn">回复</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 推荐文章区 */}
      <section className="recommendation-section">
        <h2 className="section-title">推荐阅读</h2>
        <div className="recommendation-grid">
          {recommendedArticles.map(rec => (
            <div key={rec.id} className="recommendation-card" onClick={() => navigate(`/article/${rec.id}`)}>
              <div className="rec-image-wrapper">
                {rec.cover_image && (
                  <img src={rec.cover_image} alt={rec.title} className="rec-image" />
                )}
                <div className="rec-badge hot">热门</div>
              </div>
              <div className="rec-content">
                <h3 className="rec-title">{rec.title}</h3>
                <p className="rec-description">
                  {rec.category === 'culture' && '江南六大古镇之一，以"小桥流水人家"著称'}
                  {rec.category === 'history' && '夜游西塘，感受桨声灯影里的江南'}
                  {rec.category === 'lifestyle' && '体验传统手工艺，感受非遗魅力'}
                </p>
                <div className="rec-meta">
                  <span className="rec-views">1.2万阅读</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 底部信息区 */}
      <footer className="article-browse-footer">
        <div className="copyright-info">
          <p>© 2024 人文地理平台 | 文章版权所有</p>
        </div>
        <button className="back-to-top-btn" onClick={handleBackToTop}>
          <span className="back-icon">⬆</span>
        </button>
      </footer>
    </div>
  );
};

export default ArticleBrowsePage;
