import React from 'react';

const CMSNavbar = () => {
  return (
    <nav className="cms-navbar">
      <div className="cms-navbar-brand">
        <h1>文舆世界 - CMS管理系统</h1>
      </div>
      <div className="cms-navbar-actions">
        <span className="admin-info">管理员: admin</span>
        <button className="logout-btn">退出登录</button>
      </div>
    </nav>
  );
};

export default CMSNavbar;