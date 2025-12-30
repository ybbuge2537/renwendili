import React, { useState } from 'react';
import Sidebar from '../components/Sidebar.js';
import MapComponent from '../components/MapComponent.js';

const HomePage = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeLayer, setActiveLayer] = useState('culture');
  const [currentMapProvider, setCurrentMapProvider] = useState('gaode');

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleLayerChange = (layer) => {
    setActiveLayer(layer);
  };

  const handleMapProviderChange = (provider) => {
    setCurrentMapProvider(provider);
  };

  return (
    <div className="app">
      <div className="main-content">
        <Sidebar 
          selectedLocation={selectedLocation} 
          activeLayer={activeLayer}
          onLayerChange={handleLayerChange}
        />
        <MapComponent 
          onLocationSelect={handleLocationSelect}
          activeLayer={activeLayer}
          currentMapProvider={currentMapProvider}
          onMapProviderChange={handleMapProviderChange}
        />
      </div>
    </div>
  );
};

export default HomePage;