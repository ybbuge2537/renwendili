import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { checkPagePermission } from '../../services/permission.js';
import './CMSLayout.css';

function CMSLayout({ children }) {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  // 检查用户是否已登录
  React.useEffect(() => {
    if (!loggedInUser) {
      navigate('/cms/login');
    }
  }, [loggedInUser, navigate]);

  const handleLogout = () => {
    // 清除用户信息
    localStorage.removeItem('loggedInUser');
    // 重定向到登录页面
    navigate('/cms/login');
  };

  if (!loggedInUser) {
    return null;
  }

  return (
    <div className="cms-layout">
      {/* 侧边栏 */}
      <aside className="cms-sidebar">
        <div className="sidebar-header">
          <h2>全球人文地理CMS</h2>
        </div>
        <div className="sidebar-nav">
          <ul>
            {checkPagePermission(loggedInUser, 'dashboard') && (
              <li>
                <Link to="/cms/dashboard" className="nav-link">
                  <span className="nav-icon">📊</span>
                  <span className="nav-text">仪表盘</span>
                </Link>
              </li>
            )}
            {checkPagePermission(loggedInUser, 'articles') && (
              <li>
                <Link to="/cms/articles" className="nav-link">
                  <span className="nav-icon">📝</span>
                  <span className="nav-text">文章管理</span>
                </Link>
              </li>
            )}
            {checkPagePermission(loggedInUser, 'media') && (
              <li>
                <Link to="/cms/media" className="nav-link">
                  <span className="nav-icon">🖼️</span>
                  <span className="nav-text">媒体管理</span>
                </Link>
              </li>
            )}
            {checkPagePermission(loggedInUser, 'categories') && (
              <li>
                <Link to="/cms/categories" className="nav-link">
                  <span className="nav-icon">🏷️</span>
                  <span className="nav-text">分类与标签</span>
                </Link>
              </li>
            )}
            {checkPagePermission(loggedInUser, 'users') && (
              <li>
                <Link to="/cms/users" className="nav-link">
                  <span className="nav-icon">👥</span>
                  <span className="nav-text">用户管理</span>
                </Link>
              </li>
            )}
            {checkPagePermission(loggedInUser, 'settings') && (
              <li>
                <Link to="/cms/settings" className="nav-link">
                  <span className="nav-icon">⚙️</span>
                  <span className="nav-text">系统设置</span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </aside>

      {/* 主内容区域 */}
      <main className="cms-main">
        {/* 顶部导航栏 */}
        <header className="cms-header">
          <div className="header-left">
            <h1>Dashboard</h1>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="username">{loggedInUser.username}</span>
              <span className="role">({loggedInUser.role})</span>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              退出登录
            </button>
          </div>
        </header>

        {/* 内容区域 */}
        <div className="cms-content">
          {children}
        </div>
      </main>
    </div>
  );
}

export default CMSLayout;