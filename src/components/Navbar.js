import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  // 检查用户是否已登录
  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    if (user) {
      setLoggedInUser(JSON.parse(user));
    }
  }, []);

  // 处理退出登录
  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setLoggedInUser(null);
    window.location.href = '/';
  };

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <h1>文舆世界</h1>
        <p className="navbar-subtitle">齐赏华夏文明</p>
      </div>
      <div className="navbar-links">
        <a href="/" className="nav-link active">首页</a>
        <a href="#" className="nav-link">世界人文地图</a>
        <a href="#" className="nav-link">主题专题</a>
        <a href="#" className="nav-link">数据工具库</a>
      </div>
      <div className="navbar-actions">
        <div className="search-box">
          <input type="text" placeholder="搜索地点、文化、历史..." />
          <button className="search-btn">搜索</button>
        </div>
        {loggedInUser ? (
          <div className="user-info">
            <span>欢迎, </span>
            <a href="/user/profile" className="username-link">{loggedInUser.username}</a>
            <button className="logout-btn" onClick={handleLogout}>退出登录</button>
          </div>
        ) : (
          <>
            <a href="/user/login" className="login-btn">登录</a>
            <a href="/user/register" className="btn btn-primary" style={{ padding: '6px 12px' }}>注册</a>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;