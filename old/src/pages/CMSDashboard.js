import React from 'react';
import CMSNavbar from '../components/CMSNavbar.js';
import CMSContent from '../components/CMSContent.js';
import dataManager from '../data/dataManager.js';

const CMSDashboard = () => {
  // Get dashboard statistics
  const totalLocations = dataManager.getAllLocations().length;
  const layers = dataManager.getLayers();
  const types = dataManager.getTypes();
  const totalTags = dataManager.getAllTags().length;

  return (
    <div className="cms-container">
      <CMSNavbar />
      <div className="cms-content">
        <div className="cms-sidebar">
          <h3>管理菜单</h3>
          <div className="cms-sidebar-nav">
            <a href="/cms/dashboard" className="cms-nav-link active">仪表板</a>
            <a href="/cms/locations" className="cms-nav-link">位置管理</a>
            <a href="#layers" className="cms-nav-link">图层管理</a>
            <a href="#settings" className="cms-nav-link">系统设置</a>
            <a href="/" className="cms-nav-link">退出登录</a>
          </div>
        </div>
        <div className="cms-main-content">
          <div className="cms-card">
            <h2>欢迎使用CMS后台管理系统</h2>
          </div>
          <div className="cms-stats">
            <div className="stat-card">
              <p>{totalLocations}</p>
              <h3>总地点数量</h3>
            </div>
            <div className="stat-card">
              <p>{layers.length}</p>
              <h3>图层数量</h3>
            </div>
            <div className="stat-card">
              <p>{types.length}</p>
              <h3>地点类型</h3>
            </div>
            <div className="stat-card">
              <p>{totalTags}</p>
              <h3>标签数量</h3>
            </div>
          </div>
          <div className="cms-card">
            <h3>系统信息</h3>
            <p>版本: 1.0.0</p>
            <p>最后更新: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSDashboard;