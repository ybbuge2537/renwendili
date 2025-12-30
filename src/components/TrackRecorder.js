import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, ZoomControl } from 'react-leaflet';
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

const TrackRecorder = ({ initialTrack, onTrackChange }) => {
  const [trackPoints, setTrackPoints] = useState(initialTrack || []);
  const [isRecording, setIsRecording] = useState(false);
  const [currentPosition, setCurrentPosition] = useState([39.9042, 116.4074]); // 默认北京
  const mapRef = useRef(null);
  const watchIdRef = useRef(null);

  const startRecording = () => {
    setIsRecording(true);
    setTrackPoints([]);

    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const newPoint = [position.coords.latitude, position.coords.longitude];
          setTrackPoints((prev) => [...prev, newPoint]);
          setCurrentPosition(newPoint);
          
          // 更新地图视图以显示最新位置
          if (mapRef.current) {
            mapRef.current.flyTo(newPoint, 15);
          }
        },
        (error) => {
          console.error('定位错误:', error);
          alert('无法获取位置信息，请检查定位权限');
          stopRecording();
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      alert('您的浏览器不支持地理定位');
      stopRecording();
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    onTrackChange(trackPoints);
  };

  const clearTrack = () => {
    setTrackPoints([]);
    onTrackChange([]);
  };

  const handleMapClick = (e) => {
    if (!isRecording) {
      const newPoint = [e.latlng.lat, e.latlng.lng];
      setTrackPoints((prev) => [...prev, newPoint]);
      onTrackChange([...trackPoints, newPoint]);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        // 尝试解析JSON格式的轨迹文件
        const parsedTrack = JSON.parse(content);
        
        // 支持两种格式：直接是点数组 [[lat1, lng1], [lat2, lng2]] 或者包含points字段
        let points = [];
        if (Array.isArray(parsedTrack)) {
          points = parsedTrack;
        } else if (parsedTrack.points && Array.isArray(parsedTrack.points)) {
          points = parsedTrack.points;
        } else if (parsedTrack.coordinates && Array.isArray(parsedTrack.coordinates)) {
          points = parsedTrack.coordinates;
        }

        // 验证轨迹点格式
        if (points.length > 0 && Array.isArray(points[0]) && points[0].length === 2) {
          setTrackPoints(points);
          onTrackChange(points);
          alert('轨迹文件上传成功！');
        } else {
          alert('轨迹文件格式不正确，请确保是有效的坐标点数组');
        }
      } catch (error) {
        alert('解析轨迹文件失败：' + error.message);
        console.error('解析轨迹文件失败:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="track-recorder">
      <h3>记录旅游轨迹</h3>
      
      <div className="track-controls">
        <button
          className={`control-btn ${isRecording ? 'recording' : ''}`}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? '停止录制' : '开始录制'}
        </button>
        
        <button
          className="control-btn clear"
          onClick={clearTrack}
          disabled={trackPoints.length === 0}
        >
          清除轨迹
        </button>
        
        <div className="file-upload-control">
          <label htmlFor="track-file" className="upload-btn">
            上传轨迹
          </label>
          <input
            type="file"
            id="track-file"
            accept=".json"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      <div className="map-wrapper">
        <MapContainer
          ref={mapRef}
          center={currentPosition}
          zoom={13}
          style={{ height: '300px', width: '100%' }}
          zoomControl={false}
          eventHandlers={{ click: handleMapClick }}
        >
          <ZoomControl position="topright" />
          <TileLayer
            url="https://wprd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7"
            attribution='&copy; <a href="https://ditu.amap.com/">高德地图</a>'
          />

          {/* 显示轨迹线 */}
          {trackPoints.length > 1 && (
            <Polyline
              positions={trackPoints}
              color="#3498db"
              weight={3}
              opacity={0.7}
              smoothFactor={1}
            />
          )}

          {/* 显示轨迹点 */}
          {trackPoints.map((point, index) => (
            <Marker key={index} position={point}>
              <Popup>
                <p>点 {index + 1}</p>
                <p>纬度: {point[0].toFixed(6)}</p>
                <p>经度: {point[1].toFixed(6)}</p>
              </Popup>
            </Marker>
          ))}

          {/* 显示当前位置 */}
          <Marker position={currentPosition}>
            <Popup>
              <p>当前位置</p>
              <p>纬度: {currentPosition[0].toFixed(6)}</p>
              <p>经度: {currentPosition[1].toFixed(6)}</p>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <div className="track-info">
        <p><strong>轨迹点数量:</strong> {trackPoints.length}</p>
        {trackPoints.length > 0 && (
          <p><strong>提示:</strong> {isRecording ? '正在录制轨迹...' : '点击地图可手动添加轨迹点'}</p>
        )}
      </div>

      <style jsx>{`
        .track-recorder {
          margin-bottom: 20px;
        }

        .track-recorder h3 {
          margin-bottom: 10px;
          color: #333;
        }

        .track-controls {
          margin-bottom: 15px;
          display: flex;
          gap: 10px;
        }

        .control-btn {
          padding: 8px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.3s;
        }

        .control-btn:not(:disabled) {
          background-color: #3498db;
          color: white;
        }

        .control-btn:not(:disabled):hover {
          background-color: #2980b9;
        }

        .control-btn.recording {
          background-color: #e74c3c;
          animation: pulse 1s infinite;
        }

        .control-btn.recording:hover {
          background-color: #c0392b;
        }

        .control-btn.clear:not(:disabled) {
          background-color: #95a5a6;
        }

        .control-btn.clear:not(:disabled):hover {
          background-color: #7f8c8d;
        }

        .control-btn:disabled {
          background-color: #bdc3c7;
          color: #ecf0f1;
          cursor: not-allowed;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }

        .map-wrapper {
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 15px;
        }

        .file-upload-control {
          display: inline-block;
        }

        .upload-btn {
          padding: 8px 15px;
          background-color: #2ecc71;
          color: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.3s;
        }

        .upload-btn:hover {
          background-color: #27ae60;
        }

        .track-info {
          background-color: #f5f5f5;
          padding: 10px;
          border-radius: 4px;
        }

        .track-info p {
          margin: 5px 0;
          color: #666;
        }

        @media (max-width: 768px) {
          .track-controls {
            flex-direction: column;
          }
          
          .map-wrapper {
            height: 250px;
          }
        }
      `}</style>
    </div>
  );
};

export default TrackRecorder;
