import React, { useState, useEffect } from 'react';
import CMSLayout from '../../components/cms/CMSLayout.js';
import { userApi, articleApi } from '../../services/api.js';
import apiService from '../../services/apiService.js';
import './DashboardPage.css';

function DashboardPage() {
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalMedia: 0
  });

  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [usersResponse, articlesResponse, regionsResponse, topicsResponse] = await Promise.all([
          userApi.getAllUsers(),
          articleApi.getAllArticles(),
          apiService.region.getAllRegions(),
          apiService.topic.getAllTopics()
        ]);

        const users = usersResponse.users || [];
        const articles = Array.isArray(articlesResponse) ? articlesResponse : (articlesResponse.articles || []);
        const regions = Array.isArray(regionsResponse) ? regionsResponse : (regionsResponse.regions || []);
        const topics = Array.isArray(topicsResponse) ? topicsResponse : (topicsResponse.topics || []);

        setStats({
          totalArticles: articles.length,
          totalUsers: users.length,
          totalCategories: regions.length + topics.length,
          totalMedia: 0
        });

        const formattedArticles = articles.slice(0, 5).map(article => ({
          id: article.article_id || article.id,
          title: article.title,
          author: article.author_name || article.author || '未知',
          date: article.create_time ? new Date(article.create_time).toISOString().split('T')[0] : '',
          status: article.status || 'draft'
        }));

        setRecentArticles(formattedArticles);
      } catch (error) {
        console.error('获取仪表盘数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <CMSLayout>
      <div className="dashboard">
        <h1>仪表盘</h1>
        <p className="dashboard-description">欢迎回来！这是您的CMS后台概览。</p>

        {/* 统计卡片 */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon articles-icon">📝</div>
            <div className="stat-content">
              <h3 className="stat-title">文章总数</h3>
              <p className="stat-value">{stats.totalArticles}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon users-icon">👥</div>
            <div className="stat-content">
              <h3 className="stat-title">用户总数</h3>
              <p className="stat-value">{stats.totalUsers}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon categories-icon">🏷️</div>
            <div className="stat-content">
              <h3 className="stat-title">分类总数</h3>
              <p className="stat-value">{stats.totalCategories}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon media-icon">🖼️</div>
            <div className="stat-content">
              <h3 className="stat-title">媒体文件</h3>
              <p className="stat-value">{stats.totalMedia}</p>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="dashboard-content">
          {/* 最近文章 */}
          <div className="recent-articles">
            <div className="section-header">
              <h2>最近文章</h2>
            </div>
            {loading ? (
              <div className="loading">加载中...</div>
            ) : (
              <div className="articles-table-container">
                <table className="articles-table">
                  <thead>
                    <tr>
                      <th>标题</th>
                      <th>作者</th>
                      <th>日期</th>
                      <th>状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentArticles.length > 0 ? (
                      recentArticles.map(article => (
                        <tr key={article.id}>
                          <td className="article-title">{article.title}</td>
                          <td>{article.author}</td>
                          <td>{article.date}</td>
                          <td>
                            <span className={`status-badge ${article.status}`}>
                              {article.status === 'published' ? '已发布' : '草稿'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="no-data">暂无文章</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 快捷操作 */}
          <div className="quick-actions">
            <div className="section-header">
              <h2>快捷操作</h2>
            </div>
            <div className="actions-grid">
              <div className="action-card">
                <div className="action-icon">📝</div>
                <h3>发布新文章</h3>
                <p>创建并发布新的人文地理文章</p>
                <button className="action-button">开始创作</button>
              </div>

              <div className="action-card">
                <div className="action-icon">🖼️</div>
                <h3>上传媒体</h3>
                <p>上传图片、视频等媒体文件</p>
                <button className="action-button">上传文件</button>
              </div>

              <div className="action-card">
                <div className="action-icon">🏷️</div>
                <h3>管理分类</h3>
                <p>创建和管理文章分类</p>
                <button className="action-button">管理分类</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CMSLayout>
  );
}

export default DashboardPage;