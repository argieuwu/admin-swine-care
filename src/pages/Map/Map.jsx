import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './Map.module.css';

const sampleMarkers = [
  { id: 1, position: [7.4438, 125.8057], title: 'Farm A', description: 'Suspected case reported', riskLevel: 'high' }, 
  { id: 2, position: [7.4589, 125.8112], title: 'Farm B', description: 'Under observation', riskLevel: 'medium' },
  { id: 3, position: [7.4291, 125.7993], title: 'Farm C', description: 'No cases reported', riskLevel: 'low' },
];

const riskColors = {
  high: '#e63946',
  medium: '#ffb347',
  low: '#2ecc40',
};

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
    <div className={styles.mapPageContainer}>
      <div className={styles.mapHeader}>
        <h2 className={styles.mapTitle}>ASF Map</h2>
        <div className={styles.mapControls}>
          <div className={styles.filterGroup}>
            <label>Date Range:</label>
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className={styles.selectInput}>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Risk Level:</label>
            <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value)} className={styles.selectInput}>
              <option value="all">All Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.mapContainerStyled}>
        <MapContainer center={[7.4438, 125.8057]} zoom={12} className={styles.mapLeaflet}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {filteredMarkers.map(marker => (
            <CircleMarker
              key={marker.id}
              center={marker.position}
              radius={18}
              pathOptions={{ color: riskColors[marker.riskLevel], fillColor: riskColors[marker.riskLevel], fillOpacity: 0.5 }}
            >
              <Popup>
                <h3>{marker.title}</h3>
                <p>{marker.description}</p>
                <p>Risk Level: <span className={styles[marker.riskLevel]}>{marker.riskLevel}</span></p>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <div className={styles.mapSummary}>
        <h3>Map Summary</h3>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <span>Total Farms Mapped</span>
            <strong>{filteredMarkers.length}</strong>
          </div>
          <div className={styles.summaryCard}>
            <span>High Risk</span>
            <strong>{filteredMarkers.filter(m => m.riskLevel === 'high').length}</strong>
          </div>
          <div className={styles.summaryCard}>
            <span>Medium Risk</span>
            <strong>{filteredMarkers.filter(m => m.riskLevel === 'medium').length}</strong>
          </div>
          <div className={styles.summaryCard}>
            <span>Low Risk</span>
            <strong>{filteredMarkers.filter(m => m.riskLevel === 'low').length}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;