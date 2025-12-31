import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, AttributionControl } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
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
  }),
  // 文章标记图标
  article: L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'marker-article'
  })
};

// 为不同图层的标记添加CSS颜色样式
const style = document.createElement('style');
style.textContent = `
  .marker-culture img { filter: hue-rotate(200deg); }
  .marker-history img { filter: hue-rotate(300deg); }
  .marker-lifestyle img { filter: hue-rotate(100deg); }
  .marker-article img { filter: hue-rotate(50deg); }
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
    url: 'https://wprd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7',
    attribution: '&copy; <a href="https://ditu.amap.com/">高德地图</a>'
  },
  cartodb: {
    name: 'CartoDB地图',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }
};

const MapComponent = ({ onLocationSelect, activeLayer, currentMapProvider, onMapProviderChange }) => {
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState([]);
  const [articles, setArticles] = useState([]);
  const [clickedCoord, setClickedCoord] = useState(null);

  useEffect(() => {
    // 根据当前激活的图层过滤数据
    const fetchData = async () => {
      const data = await dataManager.getLocationsByLayer(activeLayer);
      setFilteredData(data);
    };
    fetchData();
  }, [activeLayer]);

  useEffect(() => {
    // 获取所有已发布的文章数据
    const fetchArticles = async () => {
      const articlesData = await dataManager.getAllArticles();
      // 过滤出有坐标信息的已发布文章
      const articlesWithCoords = articlesData.filter(article => 
        article.coordinates_lat && article.coordinates_lng && 
        article.status === 'published'
      );
      setArticles(articlesWithCoords);
    };
    fetchArticles();
  }, [activeLayer]);

  const handleMarkerClick = (location) => {
    onLocationSelect(location);
    setClickedCoord(null); // 点击标记时清除点击坐标
  };

  const handleArticleClick = (article) => {
    navigate(`/article/${article.id}`);
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
        zoom={3} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={true}
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

        {/* 显示文章标记 */}
        {articles.map((article) => (
          <Marker
            key={`article-${article.id}`}
            position={[parseFloat(article.coordinates_lat), parseFloat(article.coordinates_lng)]}
            icon={layerIcons[article.category] || layerIcons.article}
            eventHandlers={{ click: () => handleArticleClick(article) }}
          >
            <Popup>
              <div>
                <h3>{article.title}</h3>
                <p>{article.content.substring(0, 100)}...</p>
                <p><small>分类: {article.category}</small></p>
                <button onClick={() => handleArticleClick(article)}>
                  查看文章
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