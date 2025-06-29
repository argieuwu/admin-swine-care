import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './Map.module.css';
import { db } from '../../config/firebase';
import { collection, onSnapshot, getDoc, doc } from 'firebase/firestore';
import axios from 'axios';

const riskColors = {
  high: '#e63946',
  medium: '#ffb347',
  low: '#2ecc40',
};

const Map = () => {
  const [dateRange, setDateRange] = useState('today');
  const [riskLevel, setRiskLevel] = useState('all');
  const [allMarkers, setAllMarkers] = useState([]);
  const [filteredMarkers, setFilteredMarkers] = useState([]);

  const getLocationName = async (lat, lng) => {
    const apiKey = 'adad10551cc24a04b3e71d3a8ac33bb4';
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      return response.data.results[0]?.formatted || 'Unknown location';
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return 'Unknown location';
    }
  };

  useEffect(() => {
    const userUnsubscribes = [];

    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (usersSnapshot) => {
      const newUnsubscribes = [];

      usersSnapshot.forEach((userDoc) => {
        const userId = userDoc.id;
        const userData = userDoc.data();
        const username = userData.username || `Farm (${userId})`;
        const resultsRef = collection(db, `users/${userId}/results`);

        const unsubscribeResults = onSnapshot(resultsRef, async (resultsSnapshot) => {
          const updatedResults = [];

          for (const resultDoc of resultsSnapshot.docs) {
            const result = resultDoc.data();

            if (result.lat && result.long) {
              const location = await getLocationName(result.lat, result.long);
              updatedResults.push({
                id: `${userId}_${resultDoc.id}`,
                position: [result.lat, result.long],
                title: username,
                description: result.description || 'No description',
                riskLevel: (result.riskLevel || 'low').toLowerCase(),
                skin: result.skin || null,
                ears: result.ears || null,
                timestamp: result.timestamp || null,
                location,
              });
            }
          }

          setAllMarkers((prev) => {
            const filteredOutOld = prev.filter((m) => !m.id.startsWith(`${userId}_`));
            return [...filteredOutOld, ...updatedResults];
          });
        });

        newUnsubscribes.push(unsubscribeResults);
      });

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
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);

    setFilteredMarkers(
      allMarkers.filter(marker => {
        const markerDate = marker.timestamp?.toDate?.() ?? new Date(0);
        const matchRisk = riskLevel === 'all' || marker.riskLevel === riskLevel;

        let matchDate = false;
        if (dateRange === 'today') matchDate = markerDate >= startOfToday;
        else if (dateRange === 'week') matchDate = markerDate >= startOfWeek;
        else if (dateRange === 'month') matchDate = markerDate >= startOfMonth;
        else if (dateRange === 'quarter') matchDate = markerDate >= startOfQuarter;

        return matchRisk && matchDate;
      })
    );
  }, [riskLevel, dateRange, allMarkers]);

  return (
    <div className={styles.mapPageContainer}>
      <div className={styles.mapHeader}>
        <h2 className={styles.mapTitle}>ASF Map</h2>
        <div className={styles.mapControls}>
          <div className={styles.filterGroup}>
            <label>Date Range:</label>
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className={styles.selectInput}>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
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
                  <p><strong>Location:</strong> {marker.location}</p>
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
