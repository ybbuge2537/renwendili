import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, ZoomControl, AttributionControl } from 'react-leaflet';
import L from 'leaflet';
import dataManager from '../data/dataManager';

// 自定义标记图标 - 不同颜色表示不同图层
const layerIcons = {
  culture: L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'marker-culture'
  }),
  history: L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'marker-history'
  }),
  lifestyle: L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'marker-lifestyle'
  }),
  base: L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
};

// 为不同图层的标记添加CSS颜色样式
const style = document.createElement('style');
style.textContent = `
  .marker-culture img { filter: hue-rotate(200deg); }
  .marker-history img { filter: hue-rotate(300deg); }
  .marker-lifestyle img { filter: hue-rotate(100deg); }
`;
document.head.appendChild(style);

// 地图提供商配置
const mapProviders = {
  openstreetmap: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  gaode: {
    name: '高德地图',
    url: 'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
    attribution: '&copy; <a href="https://ditu.amap.com/">高德地图</a>'
  },
  baidu: {
    name: '百度地图',
    url: 'https://maponline{s}.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&p=1',
    attribution: '&copy; <a href="https://map.baidu.com/">百度地图</a>'
  }
};

const MapComponent = ({ onLocationSelect, activeLayer, currentMapProvider, onMapProviderChange }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [clickedCoord, setClickedCoord] = useState(null);

  useEffect(() => {
    // 根据当前激活的图层过滤数据
    const data = dataManager.getLocationsByLayer(activeLayer);
    setFilteredData(data);
  }, [activeLayer]);

  const handleMarkerClick = (location) => {
    onLocationSelect(location);
    setClickedCoord(null); // 点击标记时清除点击坐标
  };

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setClickedCoord({ lat: lat.toFixed(4), lng: lng.toFixed(4) });
    onLocationSelect(null); // 点击地图空白处时清除选中位置
  };

  return (
    <div className="map-container">
      {/* 地图提供商切换控件 */}
      <div className="map-provider-controls">
        {Object.keys(mapProviders).map(provider => (
          <button
            key={provider}
            className={`provider-btn ${currentMapProvider === provider ? 'active' : ''}`}
            onClick={() => onMapProviderChange(provider)}
          >
            {mapProviders[provider].name}
          </button>
        ))}
      </div>
      
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        dragging={true}
        eventHandlers={{ click: handleMapClick }}
      >
        <ZoomControl position="topright" />
        <AttributionControl position="bottomright" />
        
        {/* 选择当前地图提供商的瓦片图层 */}
        <TileLayer
          url={mapProviders[currentMapProvider].url}
          attribution={mapProviders[currentMapProvider].attribution}
        />

        {filteredData.map(location => (
          <Marker
            key={location.id}
            position={[location.coordinates.lat, location.coordinates.lng]}
            icon={layerIcons[location.layer] || layerIcons.base}
            eventHandlers={{ click: () => handleMarkerClick(location) }}
          >
            <Popup>
              <div>
                <h3>{location.name.zh}</h3>
                <p>{location.description.zh}</p>
                {location.details && location.details.length > 0 && (
                  <ul>
                    {location.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                )}
                <button onClick={() => handleMarkerClick(location)}>
                  查看详情
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 显示点击位置的坐标 */}
        {clickedCoord && (
          <Popup
            position={[parseFloat(clickedCoord.lat), parseFloat(clickedCoord.lng)]}
            closeButton={false}
            autoClose={false}
          >
            <div>
              <p><strong>坐标:</strong></p>
              <p>纬度: {clickedCoord.lat}</p>
              <p>经度: {clickedCoord.lng}</p>
              <button onClick={() => setClickedCoord(null)}>关闭</button>
            </div>
          </Popup>
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;