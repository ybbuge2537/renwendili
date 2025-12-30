import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 修复Leaflet标记图标问题
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Marker.prototype.options.icon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// 自定义坐标选择器组件，用于处理地图事件
const MapClickHandler = ({ onCoordinateSelect }) => {
  // 使用Leaflet的useMapEvents钩子监听地图事件
  useMapEvents({
    contextmenu: (e) => {
      // 调用父组件传递的回调函数
      onCoordinateSelect(e.latlng);
    }
  });

  // 这个组件不需要渲染任何内容
  return null;
};

const CoordinatePicker = ({ initialCoordinates, onCoordinatesChange }) => {
  const [position, setPosition] = useState(
    initialCoordinates || [39.9042, 116.4074] // 默认北京坐标
  );

  // 处理坐标选择
  const handleCoordinateSelect = (latlng) => {
    const newPosition = [latlng.lat, latlng.lng];
    setPosition(newPosition);
    // 通知父组件坐标已更新
    onCoordinatesChange({
      lat: latlng.lat.toFixed(6),
      lng: latlng.lng.toFixed(6)
    });
  };

  return (
    <div className="coordinate-picker">
      <h3>选择游玩坐标</h3>
      <div className="map-wrapper" onContextMenu={(e) => e.preventDefault()}>
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '300px', width: '100%' }}
          zoomControl={false}
        >
          <ZoomControl position="topright" />
          <TileLayer
            url="https://wprd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7"
            attribution='&copy; <a href="https://ditu.amap.com/">高德地图</a>'
          />
          <Marker position={position}>
            <Popup>
              <p>当前坐标：{position[0].toFixed(6)}, {position[1].toFixed(6)}</p>
              <p>使用右键点击地图可以选择新的坐标位置</p>
            </Popup>
          </Marker>
          {/* 添加自定义的地图点击处理器 */}
          <MapClickHandler onCoordinateSelect={handleCoordinateSelect} />
        </MapContainer>
      </div>
      <div className="coordinates-display">
        <h4>当前坐标：</h4>
        <p>纬度：{position[0].toFixed(6)}</p>
        <p>经度：{position[1].toFixed(6)}</p>
      </div>

      <style jsx>{`
        .coordinate-picker {
          margin-bottom: 20px;
        }

        .coordinate-picker h3 {
          margin-bottom: 10px;
          color: #333;
        }

        .map-wrapper {
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 15px;
        }

        .coordinates-display {
          background-color: #f5f5f5;
          padding: 10px;
          border-radius: 4px;
        }

        .coordinates-display h4 {
          margin-bottom: 5px;
          color: #555;
        }

        .coordinates-display p {
          margin: 2px 0;
          font-family: monospace;
          color: #666;
        }

        @media (max-width: 768px) {
          .map-wrapper {
            height: 250px;
          }
        }
      `}</style>
    </div>
  );
};

export default CoordinatePicker;
