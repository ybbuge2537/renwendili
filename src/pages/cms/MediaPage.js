import React, { useState, useEffect } from 'react';
import CMSLayout from '../../components/cms/CMSLayout.js';
import { checkActionPermission } from '../../services/permission.js';
import './MediaPage.css';

function MediaPage() {
  // 获取当前登录用户
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  
  const [mediaFiles, setMediaFiles] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // 模拟从API获取媒体文件列表
  useEffect(() => {
    // 这里应该调用API获取真实数据
    // 暂时使用模拟数据
    const mockMediaFiles = [
      { id: 1, name: '全球地图.jpg', type: 'image', size: '2.5 MB', uploadedBy: 'admin', uploadedAt: '2025-12-27', url: 'https://via.placeholder.com/150' },
      { id: 2, name: '城市景观.png', type: 'image', size: '1.8 MB', uploadedBy: 'admin', uploadedAt: '2025-12-26', url: 'https://via.placeholder.com/150' },
      { id: 3, name: '文化遗产视频.mp4', type: 'video', size: '15.2 MB', uploadedBy: 'admin', uploadedAt: '2025-12-25', url: '' },
      { id: 4, name: '人口分布图表.png', type: 'image', size: '3.1 MB', uploadedBy: 'admin', uploadedAt: '2025-12-24', url: 'https://via.placeholder.com/150' },
      { id: 5, name: '气候变化报告.pdf', type: 'document', size: '4.7 MB', uploadedBy: 'admin', uploadedAt: '2025-12-23', url: '' }
    ];
    setMediaFiles(mockMediaFiles);
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);

    // 模拟文件上传过程
    setTimeout(() => {
      // 创建新的媒体文件对象
      const newMediaFile = {
        id: mediaFiles.length + 1,
        name: selectedFile.name,
        type: getFileType(selectedFile.type),
        size: formatFileSize(selectedFile.size),
        uploadedBy: 'admin',
        uploadedAt: new Date().toISOString().split('T')[0],
        url: selectedFile.type.startsWith('image/') ? URL.createObjectURL(selectedFile) : ''
      };

      // 添加到媒体文件列表
      setMediaFiles([...mediaFiles, newMediaFile]);
      setSelectedFile(null);
      setUploading(false);
      setShowUploadModal(false);
    }, 1500);
  };

  const handleDeleteMedia = (id) => {
    // 这里应该调用API删除媒体文件
    // 暂时模拟删除
    setMediaFiles(mediaFiles.filter(file => file.id !== id));
  };

  // 获取文件类型
  const getFileType = (type) => {
    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'video';
    if (type === 'application/pdf') return 'document';
    return 'other';
  };

  // 格式化文件大小
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // 获取文件类型图标
  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return '🖼️';
      case 'video': return '🎥';
      case 'document': return '📄';
      default: return '📁';
    }
  };

  return (
    <CMSLayout>
      <div className="media-page">
        <div className="page-header">
          <h1>媒体管理</h1>
          {checkActionPermission(loggedInUser, 'media', 'upload') && (
            <button className="upload-button" onClick={() => setShowUploadModal(true)}>
              + 上传文件
            </button>
          )}
        </div>

        {/* 媒体文件网格 */}
        <div className="media-grid">
          {mediaFiles.map(file => (
            <div key={file.id} className="media-item">
              <div className="media-preview">
                {file.type === 'image' ? (
                  <img src={file.url} alt={file.name} />
                ) : (
                  <div className="file-icon">{getFileIcon(file.type)}</div>
                )}
              </div>
              <div className="media-info">
                <div className="media-name">{file.name}</div>
                <div className="media-meta">
                  <span className="media-size">{file.size}</span>
                  <span className="media-date">{file.uploadedAt}</span>
                </div>
                <div className="media-actions">
                  <button className="view-button">查看</button>
                  {checkActionPermission(loggedInUser, 'media', 'delete') && (
                    <button className="delete-button" onClick={() => handleDeleteMedia(file.id)}>
                      删除
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 上传文件模态框 */}
        {showUploadModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>上传媒体文件</h2>
                <button className="close-button" onClick={() => setShowUploadModal(false)}>
                  ×
                </button>
              </div>
              <form onSubmit={handleUpload} className="upload-form">
                <div className="form-group">
                  <label htmlFor="file">选择文件</label>
                  <input
                    type="file"
                    id="file"
                    accept="image/*,video/*,.pdf"
                    onChange={handleFileChange}
                    required
                  />
                </div>
                {selectedFile && (
                  <div className="file-info">
                    <div className="file-name">{selectedFile.name}</div>
                    <div className="file-size">{formatFileSize(selectedFile.size)}</div>
                  </div>
                )}
                <div className="form-actions">
                  <button type="button" className="cancel-button" onClick={() => setShowUploadModal(false)}>
                    取消
                  </button>
                  <button type="submit" className="upload-submit-button" disabled={uploading || !selectedFile}>
                    {uploading ? '上传中...' : '上传'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </CMSLayout>
  );
}

export default MediaPage;