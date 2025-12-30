import React, { useState, useEffect } from 'react';
import CMSNavbar from '../components/CMSNavbar.js';
import dataManager from '../data/dataManager.js';

const CMSMediaManagement = () => {
  const [media, setMedia] = useState([]);
  const [filteredMedia, setFilteredMedia] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [selectedMediaType, setSelectedMediaType] = useState('');
  const [selectedMedia, setSelectedMedia] = useState([]);

  useEffect(() => {
    const allMedia = dataManager.getAllMedia();
    const allFolders = dataManager.getAllMediaFolders();
    setMedia(allMedia);
    setFilteredMedia(allMedia);
    setFolders(allFolders);
  }, []);

  useEffect(() => {
    let result = media;
    if (selectedFolder) {
      result = dataManager.getMediaByFolder(selectedFolder);
    }
    if (selectedMediaType) {
      result = dataManager.getMediaByType(selectedMediaType);
    }
    setFilteredMedia(result);
  }, [selectedFolder, selectedMediaType, media]);

  const handleFolderSelect = (e) => {
    setSelectedFolder(e.target.value);
  };

  const handleMediaTypeSelect = (e) => {
    setSelectedMediaType(e.target.value);
  };

  const handleMediaSelect = (id) => {
    if (selectedMedia.includes(id)) {
      setSelectedMedia(selectedMedia.filter(mediaId => mediaId !== id));
    } else {
      setSelectedMedia([...selectedMedia, id]);
    }
  };

  const handleBulkDelete = () => {
    selectedMedia.forEach(id => {
      dataManager.deleteMedia(id);
    });
    setMedia(dataManager.getAllMedia());
    setSelectedMedia([]);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`文件 ${file.name} 超过5MB限制，无法上传`);
        return;
      }
      
      const fileType = file.type.split('/')[0];
      const date = new Date();
      const formattedDate = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
      const randomString = Math.random().toString(36).substring(2, 8);
      const newFileName = `${formattedDate}_${randomString}${file.name.substring(file.name.lastIndexOf('.'))}`;
      
      const newMedia = {
        name: newFileName,
        original_name: file.name,
        type: fileType,
        size: file.size,
        url: URL.createObjectURL(file),
        folder_id: selectedFolder || null
      };
      
      dataManager.addMedia(newMedia);
    });
    setMedia(dataManager.getAllMedia());
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const fileInput = document.getElementById('file-upload');
    fileInput.files = e.dataTransfer.files;
    handleFileUpload({ target: { files } });
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
            <a href="/cms/media" className="cms-nav-link active">媒体管理</a>
            <a href="/cms/categories" className="cms-nav-link">分类管理</a>
            <a href="/cms/tags" className="cms-nav-link">标签管理</a>
            <a href="/cms/locations" className="cms-nav-link">位置管理</a>
            <a href="/cms/users" className="cms-nav-link">用户管理</a>
            <a href="/cms/roles" className="cms-nav-link">角色管理</a>
            <a href="/cms/settings" className="cms-nav-link">系统设置</a>
            <a href="/" className="cms-nav-link">退出登录</a>
          </div>
        </div>
        <div className="cms-main-content">
          <div className="cms-card">
            <div className="card-header">
              <h2>媒体管理</h2>
              <div className="upload-actions">
                <input 
                  type="file" 
                  id="file-upload" 
                  multiple 
                  onChange={handleFileUpload} 
                  className="file-input"
                />
                <label htmlFor="file-upload" className="btn btn-primary">上传文件</label>
              </div>
            </div>
            <div className="card-body">
              <div className="media-filters">
                <div className="filter-group">
                  <select 
                    value={selectedFolder} 
                    onChange={handleFolderSelect}
                    className="folder-select"
                  >
                    <option value="">所有文件夹</option>
                    {folders.map(folder => (
                      <option key={folder.id} value={folder.id}>{folder.name}</option>
                    ))}
                  </select>
                </div>
                <div className="filter-group">
                  <select 
                    value={selectedMediaType} 
                    onChange={handleMediaTypeSelect}
                    className="media-type-select"
                  >
                    <option value="">所有类型</option>
                    <option value="image">图片</option>
                    <option value="video">视频</option>
                    <option value="document">文档</option>
                  </select>
                </div>
              </div>
              
              <div className="bulk-actions">
                <button 
                  className="btn btn-danger" 
                  onClick={handleBulkDelete}
                  disabled={selectedMedia.length === 0}
                >
                  批量删除
                </button>
              </div>
              
              <div 
                className="media-upload-area"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <p>拖拽文件到此处上传</p>
                <p className="upload-hint">支持图片、视频、文档，单文件最大5MB</p>
              </div>
              
              <div className="media-grid">
                {filteredMedia.map(item => (
                  <div 
                    key={item.id} 
                    className={`media-item ${selectedMedia.includes(item.id) ? 'selected' : ''}`}
                    onClick={() => handleMediaSelect(item.id)}
                  >
                    <div className="media-preview">
                      {item.type === 'image' ? (
                        <img src={item.url} alt={item.name} />
                      ) : item.type === 'video' ? (
                        <video controls src={item.url}></video>
                      ) : (
                        <div className="document-icon">📄</div>
                      )}
                    </div>
                    <div className="media-info">
                      <p className="media-name">{item.original_name}</p>
                      <p className="media-size">{(item.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <div className="media-select-checkbox">
                      <input 
                        type="checkbox" 
                        checked={selectedMedia.includes(item.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleMediaSelect(item.id);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSMediaManagement;
