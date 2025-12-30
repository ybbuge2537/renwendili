import React, { useState, useEffect } from 'react';
import CMSNavbar from '../components/CMSNavbar.js';
import dataManager from '../data/dataManager.js';

const CMSSettings = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [basicSettings, setBasicSettings] = useState({
    site_name: '',
    site_domain: '',
    site_logo: '',
    site_favicon: '',
    site_copyright: '',
    nav_menus: []
  });
  const [globalSettings, setGlobalSettings] = useState({
    email_host: '',
    email_port: '',
    email_username: '',
    email_password: '',
    email_from: '',
    seo_keywords: '',
    seo_description: '',
    seo_title: '',
    login_timeout: 30,
    password_complexity: true,
    ip_whitelist: []
  });
  const [logs, setLogs] = useState({
    operation_logs: [],
    error_logs: []
  });
  const [isNavModalOpen, setIsNavModalOpen] = useState(false);
  const [editingNav, setEditingNav] = useState(null);
  const [navForm, setNavForm] = useState({
    name: '',
    url: '',
    order: 0,
    enabled: true
  });

  useEffect(() => {
    // 加载设置数据
    const websiteSettings = dataManager.getWebsiteSettings();
    const emailSettings = dataManager.getEmailSettings();
    const seoSettings = dataManager.getSEOSettings();
    const securitySettings = dataManager.getSecuritySettings();
    
    // 合并基础设置
    setBasicSettings({
      site_name: websiteSettings.site_name || '',
      site_domain: websiteSettings.site_domain || '',
      site_logo: websiteSettings.site_logo || '',
      site_favicon: websiteSettings.site_favicon || '',
      site_copyright: websiteSettings.site_copyright || '',
      nav_menus: websiteSettings.nav_menus || []
    });
    
    // 合并全局设置
    setGlobalSettings({
      email_host: emailSettings.host || '',
      email_port: emailSettings.port || '',
      email_username: emailSettings.username || '',
      email_password: emailSettings.password || '',
      email_from: emailSettings.from || '',
      seo_keywords: seoSettings.keywords || '',
      seo_description: seoSettings.description || '',
      seo_title: seoSettings.title || '',
      login_timeout: securitySettings.login_timeout || 30,
      password_complexity: securitySettings.password_complexity !== false,
      ip_whitelist: securitySettings.ip_whitelist || []
    });
    
    // 加载日志数据
    const operationLogs = dataManager.getAllOperationLogs();
    const errorLogs = dataManager.getAllErrorLogs();
    
    setLogs({
      operation_logs: operationLogs,
      error_logs: errorLogs
    });
  }, []);

  const handleBasicSettingChange = (e) => {
    const { name, value } = e.target;
    setBasicSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleGlobalSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGlobalSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveBasicSettings = () => {
    // 保存网站基础设置
    dataManager.updateWebsiteSettings({
      site_name: basicSettings.site_name,
      site_domain: basicSettings.site_domain,
      site_logo: basicSettings.site_logo,
      site_favicon: basicSettings.site_favicon,
      site_copyright: basicSettings.site_copyright,
      nav_menus: basicSettings.nav_menus
    });
    alert('网站基础配置已保存');
  };

  const handleSaveGlobalSettings = () => {
    // 验证密码复杂度设置
    if (globalSettings.password_complexity) {
      // 这里可以添加更复杂的验证逻辑
    }
    
    // 保存邮件设置
    dataManager.updateEmailSettings({
      host: globalSettings.email_host,
      port: globalSettings.email_port,
      username: globalSettings.email_username,
      password: globalSettings.email_password,
      from: globalSettings.email_from
    });
    
    // 保存SEO设置
    dataManager.updateSEOSettings({
      keywords: globalSettings.seo_keywords,
      description: globalSettings.seo_description,
      title: globalSettings.seo_title
    });
    
    // 保存安全设置
    dataManager.updateSecuritySettings({
      login_timeout: globalSettings.login_timeout,
      password_complexity: globalSettings.password_complexity,
      ip_whitelist: globalSettings.ip_whitelist
    });
    
    alert('全局配置已保存');
  };

  const handleTestEmail = () => {
    // 模拟发送测试邮件
    alert('测试邮件发送功能已触发');
  };

  const handleOpenNavModal = (navItem = null) => {
    if (navItem) {
      setEditingNav(navItem);
      setNavForm(navItem);
    } else {
      setEditingNav(null);
      setNavForm({
        name: '',
        url: '',
        order: 0,
        enabled: true
      });
    }
    setIsNavModalOpen(true);
  };

  const handleCloseNavModal = () => {
    setIsNavModalOpen(false);
    setEditingNav(null);
  };

  const handleNavFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNavForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNavFormSubmit = (e) => {
    e.preventDefault();
    
    let updatedMenus = [...basicSettings.nav_menus];
    
    if (editingNav) {
      // 编辑现有导航项
      const index = updatedMenus.findIndex(item => item.id === editingNav.id);
      if (index !== -1) {
        updatedMenus[index] = {...navForm, id: editingNav.id};
      }
    } else {
      // 添加新导航项
      const newNav = {
        ...navForm,
        id: `nav_${Date.now()}`
      };
      updatedMenus.push(newNav);
    }
    
    // 按order排序
    updatedMenus.sort((a, b) => a.order - b.order);
    
    setBasicSettings(prev => ({
      ...prev,
      nav_menus: updatedMenus
    }));
    
    handleCloseNavModal();
  };

  const handleDeleteNav = (navId) => {
    const updatedMenus = basicSettings.nav_menus.filter(item => item.id !== navId);
    setBasicSettings(prev => ({
      ...prev,
      nav_menus: updatedMenus
    }));
  };

  const handleExportLogs = (type) => {
    const logsToExport = type === 'operation' ? logs.operation_logs : logs.error_logs;
    const dataStr = JSON.stringify(logsToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${type}_logs_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClearLogs = (type) => {
    if (window.confirm(`确定要清空${type === 'operation' ? '操作' : '错误'}日志吗？`)) {
      if (type === 'operation') {
        dataManager.clearOperationLogs();
        setLogs(prev => ({
          ...prev,
          operation_logs: []
        }));
      } else {
        dataManager.clearErrorLogs();
        setLogs(prev => ({
          ...prev,
          error_logs: []
        }));
      }
      alert('日志已清空');
    }
  };

  return (
    <div className="cms-container">
      <CMSNavbar />
      <div className="cms-content">
        <div className="cms-sidebar">
          <h3>管理菜单</h3>
          <div className="cms-sidebar-nav">
            <a href="/cms/dashboard" className="cms-nav-link">仪表板</a>
            <a href="/cms/articles" className="cms-nav-link">文章管理</a>
            <a href="/cms/media" className="cms-nav-link">媒体管理</a>
            <a href="/cms/categories" className="cms-nav-link">分类管理</a>
            <a href="/cms/tags" className="cms-nav-link">标签管理</a>
            <a href="/cms/locations" className="cms-nav-link">位置管理</a>
            <a href="/cms/users" className="cms-nav-link">用户管理</a>
            <a href="/cms/roles" className="cms-nav-link">角色管理</a>
            <a href="/cms/settings" className="cms-nav-link active">系统设置</a>
            <a href="/" className="cms-nav-link">退出登录</a>
          </div>
        </div>
        <div className="cms-main-content">
          <div className="cms-card">
            <div className="card-header">
              <h2>系统设置</h2>
            </div>
            <div className="card-body">
              {/* 设置标签页 */}
              <div className="settings-tabs">
                <button 
                  className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
                  onClick={() => setActiveTab('basic')}
                >
                  网站基础配置
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'global' ? 'active' : ''}`}
                  onClick={() => setActiveTab('global')}
                >
                  全局配置
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
                  onClick={() => setActiveTab('logs')}
                >
                  日志管理
                </button>
              </div>
              
              {/* 网站基础配置 */}
              {activeTab === 'basic' && (
                <div className="settings-tab-content">
                  <div className="form-section">
                    <h3>站点信息</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="site_name">网站名称</label>
                        <input 
                          type="text" 
                          id="site_name" 
                          name="site_name"
                          value={basicSettings.site_name}
                          onChange={handleBasicSettingChange}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="site_domain">网站域名</label>
                        <input 
                          type="text" 
                          id="site_domain" 
                          name="site_domain"
                          value={basicSettings.site_domain}
                          onChange={handleBasicSettingChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="site_logo">网站Logo</label>
                        <input 
                          type="text" 
                          id="site_logo" 
                          name="site_logo"
                          value={basicSettings.site_logo}
                          onChange={handleBasicSettingChange}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="site_favicon">网站图标</label>
                        <input 
                          type="text" 
                          id="site_favicon" 
                          name="site_favicon"
                          value={basicSettings.site_favicon}
                          onChange={handleBasicSettingChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="site_copyright">版权信息</label>
                      <textarea 
                        id="site_copyright" 
                        name="site_copyright"
                        value={basicSettings.site_copyright}
                        onChange={handleBasicSettingChange}
                        className="form-control"
                        rows="3"
                      />
                    </div>
                  </div>
                  
                  <div className="form-section">
                    <div className="section-header">
                      <h3>导航菜单</h3>
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleOpenNavModal()}
                      >
                        添加导航项
                      </button>
                    </div>
                    
                    <div className="nav-menus-list">
                      {basicSettings.nav_menus.length === 0 ? (
                        <p className="no-data">暂无导航菜单</p>
                      ) : (
                        <table className="nav-menus-table">
                          <thead>
                            <tr>
                              <th>名称</th>
                              <th>URL</th>
                              <th>排序</th>
                              <th>状态</th>
                              <th>操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            {basicSettings.nav_menus.map(nav => (
                              <tr key={nav.id}>
                                <td>{nav.name}</td>
                                <td>{nav.url}</td>
                                <td>{nav.order}</td>
                                <td>
                                  <span className={`status-badge status-${nav.enabled ? 'active' : 'inactive'}`}>
                                    {nav.enabled ? '启用' : '禁用'}
                                  </span>
                                </td>
                                <td>
                                  <button 
                                    className="action-btn edit-btn"
                                    onClick={() => handleOpenNavModal(nav)}
                                  >
                                    编辑
                                  </button>
                                  <button 
                                    className="action-btn delete-btn"
                                    onClick={() => handleDeleteNav(nav.id)}
                                  >
                                    删除
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={handleSaveBasicSettings}
                    >
                      保存设置
                    </button>
                  </div>
                </div>
              )}
              
              {/* 全局配置 */}
              {activeTab === 'global' && (
                <div className="settings-tab-content">
                  <div className="form-section">
                    <h3>邮件设置</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="email_host">SMTP服务器</label>
                        <input 
                          type="text" 
                          id="email_host" 
                          name="email_host"
                          value={globalSettings.email_host}
                          onChange={handleGlobalSettingChange}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email_port">SMTP端口</label>
                        <input 
                          type="number" 
                          id="email_port" 
                          name="email_port"
                          value={globalSettings.email_port}
                          onChange={handleGlobalSettingChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="email_username">用户名</label>
                        <input 
                          type="text" 
                          id="email_username" 
                          name="email_username"
                          value={globalSettings.email_username}
                          onChange={handleGlobalSettingChange}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email_password">密码</label>
                        <input 
                          type="password" 
                          id="email_password" 
                          name="email_password"
                          value={globalSettings.email_password}
                          onChange={handleGlobalSettingChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email_from">发件人邮箱</label>
                      <input 
                        type="email" 
                        id="email_from" 
                        name="email_from"
                        value={globalSettings.email_from}
                        onChange={handleGlobalSettingChange}
                        className="form-control"
                      />
                    </div>
                    
                    <div className="form-actions">
                      <button 
                        className="btn btn-secondary"
                        onClick={handleTestEmail}
                      >
                        测试邮件
                      </button>
                    </div>
                  </div>
                  
                  <div className="form-section">
                    <h3>SEO设置</h3>
                    <div className="form-group">
                      <label htmlFor="seo_title">首页标题</label>
                      <input 
                        type="text" 
                        id="seo_title" 
                        name="seo_title"
                        value={globalSettings.seo_title}
                        onChange={handleGlobalSettingChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="seo_keywords">关键词</label>
                      <input 
                        type="text" 
                        id="seo_keywords" 
                        name="seo_keywords"
                        value={globalSettings.seo_keywords}
                        onChange={handleGlobalSettingChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="seo_description">描述</label>
                      <textarea 
                        id="seo_description" 
                        name="seo_description"
                        value={globalSettings.seo_description}
                        onChange={handleGlobalSettingChange}
                        className="form-control"
                        rows="3"
                      />
                    </div>
                  </div>
                  
                  <div className="form-section">
                    <h3>安全设置</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="login_timeout">登录超时（分钟）</label>
                        <input 
                          type="number" 
                          id="login_timeout" 
                          name="login_timeout"
                          value={globalSettings.login_timeout}
                          onChange={handleGlobalSettingChange}
                          className="form-control"
                          min="1"
                        />
                      </div>
                      <div className="form-group">
                        <label>
                          <input 
                            type="checkbox" 
                            id="password_complexity" 
                            name="password_complexity"
                            checked={globalSettings.password_complexity}
                            onChange={handleGlobalSettingChange}
                          />
                          启用密码复杂度要求（8位+字母+数字）
                        </label>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="ip_whitelist">IP白名单（每行一个IP）</label>
                      <textarea 
                        id="ip_whitelist" 
                        name="ip_whitelist"
                        value={globalSettings.ip_whitelist.join('\n')}
                        onChange={(e) => setGlobalSettings(prev => ({
                          ...prev,
                          ip_whitelist: e.target.value.split('\n').filter(ip => ip.trim())
                        }))}
                        className="form-control"
                        rows="5"
                      />
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={handleSaveGlobalSettings}
                    >
                      保存设置
                    </button>
                  </div>
                </div>
              )}
              
              {/* 日志管理 */}
              {activeTab === 'logs' && (
                <div className="settings-tab-content">
                  <div className="settings-tabs">
                    <button 
                      className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
                      onClick={() => setActiveTab('logs')}
                    >
                      操作日志
                    </button>
                    <button 
                      className={`tab-btn ${activeTab === 'error_logs' ? 'active' : ''}`}
                      onClick={() => setActiveTab('error_logs')}
                    >
                      错误日志
                    </button>
                  </div>
                  
                  {activeTab === 'logs' && (
                    <div className="logs-section">
                      <div className="logs-header">
                        <h3>操作日志</h3>
                        <div className="logs-actions">
                          <button 
                            className="btn btn-secondary"
                            onClick={() => handleExportLogs('operation')}
                          >
                            导出日志
                          </button>
                          <button 
                            className="btn btn-warning"
                            onClick={() => handleClearLogs('operation')}
                          >
                            清空日志
                          </button>
                        </div>
                      </div>
                      
                      <div className="logs-list">
                        {logs.operation_logs.length === 0 ? (
                          <p className="no-data">暂无操作日志</p>
                        ) : (
                          <table className="logs-table">
                            <thead>
                              <tr>
                                <th>操作人</th>
                                <th>操作时间</th>
                                <th>操作内容</th>
                                <th>结果</th>
                              </tr>
                            </thead>
                            <tbody>
                              {logs.operation_logs.map((log, index) => (
                                <tr key={index}>
                                  <td>{log.user}</td>
                                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                                  <td>{log.content}</td>
                                  <td>
                                    <span className={`status-badge status-${log.result ? 'success' : 'error'}`}>
                                      {log.result ? '成功' : '失败'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'error_logs' && (
                    <div className="logs-section">
                      <div className="logs-header">
                        <h3>错误日志</h3>
                        <div className="logs-actions">
                          <button 
                            className="btn btn-secondary"
                            onClick={() => handleExportLogs('error')}
                          >
                            导出日志
                          </button>
                          <button 
                            className="btn btn-warning"
                            onClick={() => handleClearLogs('error')}
                          >
                            清空日志
                          </button>
                        </div>
                      </div>
                      
                      <div className="logs-list">
                        {logs.error_logs.length === 0 ? (
                          <p className="no-data">暂无错误日志</p>
                        ) : (
                          <table className="logs-table">
                            <thead>
                              <tr>
                                <th>错误时间</th>
                                <th>错误类型</th>
                                <th>错误信息</th>
                                <th>影响范围</th>
                              </tr>
                            </thead>
                            <tbody>
                              {logs.error_logs.map((log, index) => (
                                <tr key={index}>
                                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                                  <td>{log.type}</td>
                                  <td>{log.message}</td>
                                  <td>{log.scope}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* 导航菜单编辑模态框 */}
      {isNavModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingNav ? '编辑导航项' : '添加导航项'}</h3>
              <button className="modal-close" onClick={handleCloseNavModal}>×</button>
            </div>
            <form onSubmit={handleNavFormSubmit} className="modal-body">
              <div className="form-group">
                <label htmlFor="nav_name">名称</label>
                <input 
                  type="text" 
                  id="nav_name" 
                  name="name"
                  value={navForm.name}
                  onChange={handleNavFormChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="nav_url">URL</label>
                <input 
                  type="text" 
                  id="nav_url" 
                  name="url"
                  value={navForm.url}
                  onChange={handleNavFormChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="nav_order">排序</label>
                <input 
                  type="number" 
                  id="nav_order" 
                  name="order"
                  value={navForm.order}
                  onChange={handleNavFormChange}
                  className="form-control"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    id="nav_enabled" 
                    name="enabled"
                    checked={navForm.enabled}
                    onChange={handleNavFormChange}
                  />
                  启用
                </label>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseNavModal}>取消</button>
                <button type="submit" className="btn btn-primary">保存</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CMSSettings;
