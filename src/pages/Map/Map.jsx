import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/pages/Map.css';

// Fix for default marker icons in Leaflet with React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Sample data for markers
const sampleMarkers = [
  {
    id: 1,
    position: [15.5, 120.5],
    title: 'Farm A',
    description: 'Suspected case reported',
    riskLevel: 'high'
  },
  {
    id: 2,
    position: [15.6, 120.6],
    title: 'Farm B',
    description: 'Under observation',
    riskLevel: 'medium'
  },
  {
    id: 3,
    position: [15.4, 120.4],
    title: 'Farm C',
    description: 'No cases reported',
    riskLevel: 'low'
  }
];

const Map = () => {
  const [dateRange, setDateRange] = useState('7days');
  const [riskLevel, setRiskLevel] = useState('all');
  const [filteredMarkers, setFilteredMarkers] = useState(sampleMarkers);

  useEffect(() => {
    if (riskLevel === 'all') {
      setFilteredMarkers(sampleMarkers);
    } else {
      setFilteredMarkers(sampleMarkers.filter(marker => marker.riskLevel === riskLevel));
    }
  }, [riskLevel]);

  return (
    <div className="map-page-container">
      <div className="map-header">
        <h2>ASF Map</h2>
        <div className="map-controls">
          <div className="filter-group">
            <label>Date Range:</label>
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Risk Level:</label>
            <select 
              value={riskLevel} 
              onChange={(e) => setRiskLevel(e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>
        </div>
      </div>

      <div className="map-container-styled">
        <MapContainer 
          center={[15.5, 120.5]} 
          zoom={10} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {filteredMarkers.map(marker => (
            <Marker key={marker.id} position={marker.position}>
              <Popup>
                <h3>{marker.title}</h3>
                <p>{marker.description}</p>
                <p>Risk Level: {marker.riskLevel}</p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="map-summary">
        <h3>Map Summary</h3>
        <p>Total Farms Mapped: {filteredMarkers.length}</p>
        <div className="risk-stats">
          <span className="risk-stat high">High Risk: {filteredMarkers.filter(m => m.riskLevel === 'high').length}</span>
          <span className="risk-stat medium">Medium Risk: {filteredMarkers.filter(m => m.riskLevel === 'medium').length}</span>
          <span className="risk-stat low">Low Risk: {filteredMarkers.filter(m => m.riskLevel === 'low').length}</span>
        </div>
      </div>
    </div>
  );
};

export default Map; 