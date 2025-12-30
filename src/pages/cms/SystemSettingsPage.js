import React, { useState, useEffect } from 'react';
import CMSLayout from '../../components/cms/CMSLayout.js';
import { checkActionPermission } from '../../services/permission.js';
import './SystemSettingsPage.css';

function SystemSettingsPage() {
  // 获取当前登录用户
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  
  // 系统设置状态
  const [settings, setSettings] = useState({
    siteName: '全球人文地理数据库',
    siteDescription: '提供全球人文地理相关的文章和数据',
    siteLogo: '',
    contactEmail: 'admin@example.com',
    copyrightInfo: '© 2025 全球人文地理数据库. All rights reserved.',
    seoTitle: '全球人文地理数据库',
    seoKeywords: '人文地理,全球地理,地理研究,文化遗产',
    seoDescription: '全球人文地理数据库提供丰富的人文地理相关文章和数据',
    maintenanceMode: false,
    maintenanceMessage: '网站正在维护中，请稍后访问',
    maxFileSize: 10,
    allowedFileTypes: 'image/*,video/*,.pdf,.doc,.docx'
  });
  
  const [activeTab, setActiveTab] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 模拟从API获取设置
  useEffect(() => {
    // 这里应该调用API获取真实数据
    // 暂时使用默认设置
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // 这里应该调用API保存设置
    // 暂时模拟保存
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      
      // 3秒后隐藏成功消息
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <CMSLayout>
      <div className="system-settings-page">
        <div className="page-header">
          <h1>系统设置</h1>
        </div>
        
        {saveSuccess && (
          <div className="save-success">
            设置保存成功！
          </div>
        )}

        {/* 标签页导航 */}
        <div className="settings-tabs">
          <button 
            className={`tab-button ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            基本设置
          </button>
          <button 
            className={`tab-button ${activeTab === 'website' ? 'active' : ''}`}
            onClick={() => setActiveTab('website')}
          >
            网站设置
          </button>
          <button 
            className={`tab-button ${activeTab === 'seo' ? 'active' : ''}`}
            onClick={() => setActiveTab('seo')}
          >
            SEO设置
          </button>
          <button 
            className={`tab-button ${activeTab === 'media' ? 'active' : ''}`}
            onClick={() => setActiveTab('media')}
          >
            媒体设置
          </button>
        </div>

        {/* 设置表单 */}
        <div className="settings-form-container">
          {activeTab === 'basic' && (
            <div className="settings-section">
              <h2>基本设置</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="siteName">网站名称</label>
                  <input
                    type="text"
                    id="siteName"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleInputChange}
                    disabled={!checkActionPermission(loggedInUser, 'setting', 'edit')}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="siteDescription">网站描述</label>
                  <textarea
                    id="siteDescription"
                    name="siteDescription"
                    value={settings.siteDescription}
                    onChange={handleInputChange}
                    rows={3}
                    disabled={!checkActionPermission(loggedInUser, 'setting', 'edit')}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="siteLogo">网站Logo</label>
                <div className="file-upload">
                  <input
                    type="file"
                    id="siteLogo"
                    name="siteLogo"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSettings(prev => ({
                          ...prev,
                          siteLogo: URL.createObjectURL(e.target.files[0])
                        }));
                      }
                    }}
                    disabled={!checkActionPermission(loggedInUser, 'setting', 'edit')}
                  />
                  {settings.siteLogo && (
                    <div className="logo-preview">
                      <img src={settings.siteLogo} alt="网站Logo" />
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="contactEmail">联系邮箱</label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleInputChange}
                  disabled={!checkActionPermission(loggedInUser, 'setting', 'edit')}
                />
              </div>
              <div className="form-group">
                <label htmlFor="copyrightInfo">版权信息</label>
                <input
                  type="text"
                  id="copyrightInfo"
                  name="copyrightInfo"
                  value={settings.copyrightInfo}
                  onChange={handleInputChange}
                  disabled={!checkActionPermission(loggedInUser, 'setting', 'edit')}
                />
              </div>
            </div>
          )}

          {activeTab === 'website' && (
            <div className="settings-section">
              <h2>网站设置</h2>
              <div className="form-group">
                <label htmlFor="maintenanceMode">维护模式</label>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="maintenanceMode"
                    name="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={handleInputChange}
                    disabled={!checkActionPermission(loggedInUser, 'setting', 'edit')}
                  />
                  <span>启用维护模式</span>
                </div>
              </div>
              {settings.maintenanceMode && (
                <div className="form-group">
                  <label htmlFor="maintenanceMessage">维护消息</label>
                  <textarea
                    id="maintenanceMessage"
                    name="maintenanceMessage"
                    value={settings.maintenanceMessage}
                    onChange={handleInputChange}
                    rows={3}
                    disabled={!checkActionPermission(loggedInUser, 'setting', 'edit')}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="settings-section">
              <h2>SEO设置</h2>
              <div className="form-group">
                <label htmlFor="seoTitle">SEO标题</label>
                <input
                  type="text"
                  id="seoTitle"
                  name="seoTitle"
                  value={settings.seoTitle}
                  onChange={handleInputChange}
                  disabled={!checkActionPermission(loggedInUser, 'setting', 'edit')}
                />
              </div>
              <div className="form-group">
                <label htmlFor="seoKeywords">SEO关键词</label>
                <input
                  type="text"
                  id="seoKeywords"
                  name="seoKeywords"
                  value={settings.seoKeywords}
                  onChange={handleInputChange}
                  disabled={!checkActionPermission(loggedInUser, 'setting', 'edit')}
                />
                <small className="help-text">使用逗号分隔多个关键词</small>
              </div>
              <div className="form-group">
                <label htmlFor="seoDescription">SEO描述</label>
                <textarea
                  id="seoDescription"
                  name="seoDescription"
                  value={settings.seoDescription}
                  onChange={handleInputChange}
                  rows={3}
                  disabled={!checkActionPermission(loggedInUser, 'setting', 'edit')}
                />
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="settings-section">
              <h2>媒体设置</h2>
              <div className="form-group">
                <label htmlFor="maxFileSize">最大文件大小 (MB)</label>
                <input
                  type="number"
                  id="maxFileSize"
                  name="maxFileSize"
                  value={settings.maxFileSize}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  disabled={!checkActionPermission(loggedInUser, 'setting', 'edit')}
                />
              </div>
              <div className="form-group">
                <label htmlFor="allowedFileTypes">允许的文件类型</label>
                <input
                  type="text"
                  id="allowedFileTypes"
                  name="allowedFileTypes"
                  value={settings.allowedFileTypes}
                  onChange={handleInputChange}
                  disabled={!checkActionPermission(loggedInUser, 'setting', 'edit')}
                />
                <small className="help-text">使用逗号分隔多个文件类型，例如：image/*,video/*,.pdf</small>
              </div>
            </div>
          )}

          {/* 保存按钮 */}
          {checkActionPermission(loggedInUser, 'setting', 'edit') && (
            <div className="form-actions">
              <button 
                className="save-button" 
                onClick={handleSaveSettings}
                disabled={isSaving}
              >
                {isSaving ? '保存中...' : '保存设置'}
              </button>
            </div>
          )}
        </div>
      </div>
    </CMSLayout>
  );
}

export default SystemSettingsPage;