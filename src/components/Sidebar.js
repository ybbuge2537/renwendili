import React from 'react';

const Sidebar = ({ selectedLocation, activeLayer, onLayerChange }) => {
  const layers = [
    { id: 'culture', name: '文化层' },
    { id: 'history', name: '历史层' },
    { id: 'lifestyle', name: '生活层' },
    { id: 'base', name: '基础层' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <h3>图层控制</h3>
        <div className="layer-controls">
          {layers.map(layer => (
            <button
              key={layer.id}
              className={`layer-btn ${activeLayer === layer.id ? 'active' : ''}`}
              onClick={() => onLayerChange(layer.id)}
            >
              {layer.name}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h3>位置信息</h3>
        {selectedLocation ? (
          <div className="location-info">
            <h4>{selectedLocation.name.zh}</h4>
            <p>{selectedLocation.description.zh}</p>
            <div className="location-details">
              <p><strong>坐标:</strong> {selectedLocation.coordinates.lat}, {selectedLocation.coordinates.lng}</p>
              <p><strong>类型:</strong> {selectedLocation.type}</p>
              {selectedLocation.details && (
                <div className="location-details">
                  {selectedLocation.details.map((detail, index) => (
                    <p key={index}>{detail}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p>请点击地图上的标记查看详情</p>
        )}
      </div>

      <div className="sidebar-section">
        <h3>快速搜索</h3>
        <div className="search-box">
          <input type="text" placeholder="搜索地点或文化..." />
          <button className="search-btn">搜索</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;