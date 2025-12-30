import React from 'react';
import Navbar from '../components/Navbar.js';
import Sidebar from '../components/Sidebar.js';
import MapComponent from '../components/MapComponent.js';
import { useState } from 'react';

const HomePage = ({ isUserLoggedIn }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeLayer, setActiveLayer] = useState('culture');
  const [currentMapProvider, setCurrentMapProvider] = useState('openstreetmap');

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
      <Navbar isUserLoggedIn={isUserLoggedIn} />
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