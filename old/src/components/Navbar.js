import React from 'react';

const Navbar = ({ isUserLoggedIn }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>文舆世界</h1>
        <p className="navbar-subtitle">齐赏华夏文明</p>
      </div>
      <div className="navbar-links">
        <a href="/" className="nav-link active">首页</a>
        <a href="#" className="nav-link">世界人文地图</a>
        <a href="#" className="nav-link">主题专题</a>
        <a href="#" className="nav-link">用户贡献</a>
        <a href="#" className="nav-link">数据工具库</a>
        <a href="#" className="nav-link">社区</a>
        <a href="/cms/login" className="nav-link">后台管理</a>
      </div>
      <div className="navbar-actions">
        <div className="search-box">
          <input type="text" placeholder="搜索地点、文化、历史..." />
          <button className="search-btn">搜索</button>
        </div>
        
        {isUserLoggedIn ? (
          <>
            <button className="upload-btn">上传内容</button>
            <button className="login-btn">个人中心</button>
          </>
        ) : (
          <>
            <button className="login-btn" onClick={() => window.location.href='/user/register'}>注册</button>
            <button className="login-btn" onClick={() => window.location.href='/user/login'}>登录</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;