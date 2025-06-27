import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './Map.module.css';
import { db } from '../../config/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const riskColors = {
  high: '#e63946',   // RED
  medium: '#ffb347', // YELLOW
  low: '#2ecc40',    // GREEN
};

const Map = () => {
  const [dateRange, setDateRange] = useState('7days');
  const [riskLevel, setRiskLevel] = useState('all');
  const [allMarkers, setAllMarkers] = useState([]);
  const [filteredMarkers, setFilteredMarkers] = useState([]);

  useEffect(() => {
    const userUnsubscribes = [];

    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (usersSnapshot) => {
      const newUnsubscribes = [];

      usersSnapshot.forEach((userDoc) => {
        const userId = userDoc.id;
        const resultsRef = collection(db, `users/${userId}/results`);

        const unsubscribeResults = onSnapshot(resultsRef, (resultsSnapshot) => {
          const updatedResults = [];

          resultsSnapshot.forEach((resultDoc) => {
            const result = resultDoc.data();

            if (result.lat && result.long) {
              updatedResults.push({
                id: `${userId}_${resultDoc.id}`,
                position: [result.lat, result.long],
                title: result.title || `Farm (${userId})`,
                description: result.description || 'No description',
                riskLevel: (result.riskLevel || 'low').toLowerCase(),
                skin: result.skin || null,
                ears: result.ears || null,
              });
            }
          });

          // Merge user-specific updates into all markers
          setAllMarkers((prev) => {
            const filteredOutOld = prev.filter((m) => !m.id.startsWith(`${userId}_`));
            return [...filteredOutOld, ...updatedResults];
          });
        });

        newUnsubscribes.push(unsubscribeResults);
      });

      // Replace old unsubscribes
      userUnsubscribes.forEach(unsub => unsub());
      userUnsubscribes.length = 0;
      newUnsubscribes.forEach(unsub => userUnsubscribes.push(unsub));
    });

    return () => {
      unsubscribeUsers();
      userUnsubscribes.forEach(unsub => unsub());
    };
  }, []);

  useEffect(() => {
    if (riskLevel === 'all') {
      setFilteredMarkers(allMarkers);
    } else {
      setFilteredMarkers(allMarkers.filter(marker => marker.riskLevel === riskLevel));
    }
  }, [riskLevel, allMarkers]);

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
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {filteredMarkers.map(marker => (
            <CircleMarker
              key={marker.id}
              center={marker.position}
              radius={18}
              pathOptions={{
                color: riskColors[marker.riskLevel],
                fillColor: riskColors[marker.riskLevel],
                fillOpacity: 0.5
              }}
            >
              <Popup>
                <div style={{ maxWidth: "220px" }}>
                  <h3>{marker.title}</h3>
                  <p>{marker.description}</p>
                  <p>Risk Level: <span className={styles[marker.riskLevel]}>{marker.riskLevel}</span></p>

                  {marker.skin && (
                    <div style={{ marginTop: 10 }}>
                      <strong>Skin:</strong>
                      <img
                        src={`data:image/jpeg;base64,${marker.skin}`}
                        alt="Skin"
                        style={{
                          width: "100%",
                          maxHeight: "150px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          marginTop: "5px",
                        }}
                      />
                    </div>
                  )}

                  {marker.ears && (
                    <div style={{ marginTop: 10 }}>
                      <strong>Ears:</strong>
                      <img
                        src={`data:image/jpeg;base64,${marker.ears}`}
                        alt="Ears"
                        style={{
                          width: "100%",
                          maxHeight: "150px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          marginTop: "5px",
                        }}
                      />
                    </div>
                  )}
                </div>
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
