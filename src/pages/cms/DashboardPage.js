import React, { useState, useEffect } from 'react';
import CMSLayout from '../../components/cms/CMSLayout.js';
import './DashboardPage.css';

function DashboardPage() {
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalMedia: 0
  });

  // 模拟从API获取统计数据
  useEffect(() => {
    // 这里应该调用API获取真实数据
    // 暂时使用模拟数据
    const mockStats = {
      totalArticles: 128,
      totalUsers: 45,
      totalCategories: 23,
      totalMedia: 512
    };
    setStats(mockStats);
  }, []);

  // 模拟最近文章数据
  const recentArticles = [
    { id: 1, title: '全球气候变化对人文地理的影响', author: 'admin', date: '2025-12-27', status: 'published' },
    { id: 2, title: '亚洲城市化进程分析', author: 'admin', date: '2025-12-26', status: 'draft' },
    { id: 3, title: '欧洲文化遗产保护现状', author: 'admin', date: '2025-12-25', status: 'published' },
    { id: 4, title: '非洲人口增长趋势预测', author: 'admin', date: '2025-12-24', status: 'published' },
    { id: 5, title: '南美洲自然资源分布研究', author: 'admin', date: '2025-12-23', status: 'draft' }
  ];

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
                  {recentArticles.map(article => (
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
                  ))}
                </tbody>
              </table>
            </div>
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