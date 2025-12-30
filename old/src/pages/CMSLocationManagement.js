import React, { useState, useEffect } from 'react';
import CMSNavbar from '../components/CMSNavbar.js';
import dataManager from '../data/dataManager.js';

const CMSLocationManagement = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: { zh: '', en: '' },
    description: { zh: '', en: '' },
    coordinates: { lat: '', lng: '' },
    layer: 'culture',
    type: '',
    tags: [],
    details: []
  });

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = () => {
    setLocations(dataManager.getAllLocations());
  };

  const handleAddLocation = () => {
    setSelectedLocation(null);
    setFormData({
      name: { zh: '', en: '' },
      description: { zh: '', en: '' },
      coordinates: { lat: '', lng: '' },
      layer: 'culture',
      type: '',
      tags: [],
      details: []
    });
    setShowAddForm(true);
  };

  const handleEditLocation = (location) => {
    setSelectedLocation(location);
    setFormData(location);
    setShowAddForm(true);
  };

  const handleDeleteLocation = (id) => {
    if (window.confirm('确定要删除这个地点吗？')) {
      dataManager.deleteLocation(id);
      loadLocations();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedLocation) {
      dataManager.updateLocation(selectedLocation.id, formData);
    } else {
      dataManager.addLocation(formData);
    }
    
    setShowAddForm(false);
    loadLocations();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      // Handle nested fields like name.zh
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTagChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleDetailChange = (index, value) => {
    const newDetails = [...formData.details];
    newDetails[index] = value;
    setFormData(prev => ({ ...prev, details: newDetails }));
  };

  const addDetailField = () => {
    setFormData(prev => ({ ...prev, details: [...prev.details, ''] }));
  };

  return (
    <div className="cms-container">
      <CMSNavbar />
      <div className="cms-content">
        <div className="cms-sidebar">
          <h3>管理菜单</h3>
          <div className="cms-sidebar-nav">
            <a href="/cms/dashboard" className="cms-nav-link">仪表板</a>
            <a href="/cms/locations" className="cms-nav-link active">位置管理</a>
            <a href="#layers" className="cms-nav-link">图层管理</a>
            <a href="#settings" className="cms-nav-link">系统设置</a>
            <a href="/" className="cms-nav-link">退出登录</a>
          </div>
        </div>
        <div className="cms-main-content">
          <div className="cms-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>位置管理</h2>
              <button onClick={handleAddLocation} className="btn btn-primary">添加新地点</button>
            </div>
          </div>
          
          {showAddForm && (
            <div className="cms-card">
              <h3>{selectedLocation ? '编辑地点' : '添加新地点'}</h3>
              <form onSubmit={handleSubmit} className="cms-form">
                <div>
                  <h4>基本信息</h4>
                  <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>中文名称:</label>
                      <input 
                        type="text" 
                        name="name.zh" 
                        value={formData.name.zh} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>英文名称:</label>
                      <input 
                        type="text" 
                        name="name.en" 
                        value={formData.name.en} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>中文描述:</label>
                      <textarea 
                        name="description.zh" 
                        value={formData.description.zh} 
                        onChange={handleInputChange} 
                        rows="3"
                        required 
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>英文描述:</label>
                      <textarea 
                        name="description.en" 
                        value={formData.description.en} 
                        onChange={handleInputChange} 
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4>位置信息</h4>
                  <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>纬度:</label>
                      <input 
                        type="number" 
                        name="coordinates.lat" 
                        value={formData.coordinates.lat} 
                        onChange={handleInputChange} 
                        step="0.0001"
                        required 
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>经度:</label>
                      <input 
                        type="number" 
                        name="coordinates.lng" 
                        value={formData.coordinates.lng} 
                        onChange={handleInputChange} 
                        step="0.0001"
                        required 
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>图层:</label>
                      <select 
                        name="layer" 
                        value={formData.layer} 
                        onChange={handleInputChange} 
                      >
                        <option value="culture">文化层</option>
                        <option value="history">历史层</option>
                        <option value="lifestyle">生活层</option>
                        <option value="base">基础层</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>类型:</label>
                      <input 
                        type="text" 
                        name="type" 
                        value={formData.type} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4>标签和详情</h4>
                  <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label>标签 (用逗号分隔):</label>
                    <input 
                      type="text" 
                      value={formData.tags.join(', ')} 
                      onChange={handleTagChange} 
                      placeholder="例如: 文化, 历史, 旅游"
                    />
                  </div>
                  <div className="form-group">
                    <label>详情:</label>
                    {formData.details.map((detail, index) => (
                      <div key={index} style={{ marginBottom: '8px' }}>
                        <input 
                          type="text" 
                          value={detail} 
                          onChange={(e) => handleDetailChange(index, e.target.value)} 
                          placeholder={`详情 ${index + 1}`}
                          style={{ width: '100%' }}
                        />
                      </div>
                    ))}
                    <button type="button" onClick={addDetailField} className="btn btn-secondary" style={{ marginTop: '8px' }}>添加详情</button>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary">取消</button>
                  <button type="submit" className="btn btn-primary">保存</button>
                </div>
              </form>
            </div>
          )}
          
          <div className="cms-card">
            <table className="cms-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>中文名称</th>
                  <th>英文名称</th>
                  <th>图层</th>
                  <th>类型</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {locations.map(location => (
                  <tr key={location.id}>
                    <td>{location.id}</td>
                    <td>{location.name.zh}</td>
                    <td>{location.name.en}</td>
                    <td>{location.layer}</td>
                    <td>{location.type}</td>
                    <td>
                      <button onClick={() => handleEditLocation(location)} className="btn btn-secondary" style={{ marginRight: '5px' }}>编辑</button>
                      <button onClick={() => handleDeleteLocation(location.id)} className="btn btn-danger">删除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSLocationManagement;