// [IMPORTS]
import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc } from 'firebase/firestore';
import styles from './Overview.module.css';
import { db } from '../../config/firebase';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// [CONSTANTS]
const ITEMS_PER_PAGE = 6;

// [MAIN COMPONENT]
const Overview = () => {
  const [dateRange, setDateRange] = useState('thisWeek');
  const [selectedReport, setSelectedReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [imageLabel, setImageLabel] = useState('');

  const isDateInRange = (dateStr, range) => {
    const date = new Date(dateStr);
    const now = new Date();

    switch (range) {
      case 'today':
        return date.toDateString() === now.toDateString();
      case 'thisWeek': {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        return date >= startOfWeek && date <= endOfWeek;
      }
      case 'thisMonth':
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      case 'thisQuarter': {
        const currentQuarter = Math.floor(now.getMonth() / 3);
        const startMonth = currentQuarter * 3;
        const startOfQuarter = new Date(now.getFullYear(), startMonth, 1);
        const endOfQuarter = new Date(now.getFullYear(), startMonth + 3, 0);
        return date >= startOfQuarter && date <= endOfQuarter;
      }
      default:
        return true;
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const allReports = [];

        for (const userDoc of usersSnapshot.docs) {
          const userId = userDoc.id;
          const username = userDoc.data().username || 'Unknown';
          const resultsSnapshot = await getDocs(collection(db, `users/${userId}/results`));

          for (const resultDoc of resultsSnapshot.docs) {
            const result = resultDoc.data();
            if (!result.lat || !result.long) continue;

            const location = await getLocationName(result.lat, result.long);
            const timestamp = result.timestamp?.toDate();
            const formattedDate = timestamp?.toISOString().split('T')[0] || 'Unknown';
            const pigId = result.pigId;

            if (!timestamp || !isDateInRange(formattedDate, dateRange)) continue;

            let status = 'Unknown';
            const historySnapshot = await getDocs(collection(db, `users/${userId}/history`));
            for (const doc of historySnapshot.docs) {
              const data = doc.data();
              if (data.pigId === pigId) {
                status = data.status || 'Unknown';
                break;
              }
            }

            allReports.push({
              userId,
              resultId: resultDoc.id,
              pigId,
              date: formattedDate,
              farmer: username,
              farmId: pigId || 'N/A',
              location,
              result: result.riskLevel || 'Unknown',
              status,
              ears: result.ears || null,
              skin: result.skin || null,
              map: result.map || null,
            });
          }
        }

        setReports(allReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, [dateRange]);

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

  const updateStatus = async (userId, pigId, newStatus) => {
    const historySnapshot = await getDocs(collection(db, `users/${userId}/history`));
    for (const doc of historySnapshot.docs) {
      const data = doc.data();
      if (data.pigId === pigId) {
        try {
          await updateDoc(doc.ref, { status: newStatus });
          toast.success(`Status updated to "${newStatus}" for pig ID ${pigId}`, { position: 'bottom-right' });
        } catch (err) {
          toast.error("Failed to update status", { position: 'bottom-right' });
          console.error("Failed to update status:", err);
        }
        break;
      }
    }
  };

  const handleStatusChangeInDialog = async (e) => {
    const newStatus = e.target.value;
    if (!selectedReport) return;

    await updateStatus(selectedReport.userId, selectedReport.pigId, newStatus);
    setReports(prev =>
      prev.map(r =>
        r.pigId === selectedReport.pigId && r.userId === selectedReport.userId
          ? { ...r, status: newStatus }
          : r
      )
    );

    setSelectedReport(prev => ({ ...prev, status: newStatus }));
  };

  const handleViewDetails = (report) => setSelectedReport(report);
  const closeDialog = () => setSelectedReport(null);

  const totalPages = Math.ceil(reports.length / ITEMS_PER_PAGE);
  const paginatedReports = reports.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Under Observation': return styles.observation;
      case 'Confirmed Case': return styles.confirmed;
      case 'Resolved': return styles.resolved;
      default: return styles.unknown;
    }
  };

  const summary = {
    total: reports.length,
    observation: reports.filter(r => r.status === 'Under Observation').length,
    confirmed: reports.filter(r => r.status === 'Confirmed Case').length,
    resolved: reports.filter(r => r.status === 'Resolved').length,
  };

  return (
    <div className={styles.overviewContainer}>
      <div className={styles.dashboardHeader}>
        <h2>Dashboard Overview</h2>
        <div className={styles.dateFilter}>
          <label>Date Range:</label>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className={styles.selectInput}>
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
            <option value="thisQuarter">This Quarter</option>
          </select>
        </div>
      </div>

      <div className={styles.summaryCards}>
        <div className={styles.card}>
          <h4>Total Reports</h4>
          <p>{summary.total}</p>
        </div>
        <div className={styles.card}>
          <h4>Under Observation</h4>
          <p>{summary.observation}</p>
        </div>
        <div className={styles.card}>
          <h4>Confirmed Cases</h4>
          <p>{summary.confirmed}</p>
        </div>
        <div className={styles.card}>
          <h4>Resolved</h4>
          <p>{summary.resolved}</p>
        </div>
      </div>

      <div className={styles.reportsSection}>
        <div className={styles.reportsHeader}>
          <h3>Recent Farmer Submissions</h3>
        </div>
        <div className={styles.reportsTable}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Farmer Name</th>
                <th>Pig ID</th>
                <th>Location</th>
                <th>Result</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReports.map((report, index) => (
                <tr key={index}>
                  <td>{report.date}</td>
                  <td>{report.farmer}</td>
                  <td>{report.farmId}</td>
                  <td>{report.location}</td>
                  <td>
                    <span className={`${styles.status} ${styles[report.result?.toLowerCase() || 'unknown']}`}>{report.result || 'Unknown'}</span>
                  </td>
                  <td>
                    <span className={`${styles.status} ${getStatusClass(report.status)}`}>{report.status}</span>
                  </td>
                  <td>
                    <button className={styles.actionButton} onClick={() => handleViewDetails(report)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.paginationControls}>
          <button className={styles['button-4']} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</button>
          <span className={styles.pageIndicator}>Page {currentPage} of {totalPages}</span>
          <button className={styles['button-4']} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>

      {selectedReport && (
        <div className={styles.dialogOverlay} onClick={closeDialog}>
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <h3>Report Details</h3>
            <p><strong>Farmer:</strong> {selectedReport.farmer}</p>
            <p><strong>Date:</strong> {selectedReport.date}</p>
            <p><strong>Farm ID:</strong> {selectedReport.farmId}</p>
            <p><strong>Location:</strong> {selectedReport.location}</p>
            <p>
              <strong>Result:</strong>{' '}
              <span className={`${styles.status} ${styles[selectedReport.result?.toLowerCase() || 'unknown']}`}>
                {selectedReport.result || 'Unknown'}
              </span>
            </p>
            <p><strong>Status:</strong></p>
            <select
              className={styles.statusSelect}
              value={selectedReport.status}
              onChange={handleStatusChangeInDialog}
            >
              <option value="Under Observation">Under Observation</option>
              <option value="Confirmed Case">Confirmed Case</option>
              <option value="Resolved">Resolved</option>
              <option value="Under Surveillance"></option>
            </select>

            {(selectedReport.ears || selectedReport.skin) && (
              <div>
                <p><strong>Ears & Skin Images:</strong></p>
                <div className={styles.imageRow}>
                  {selectedReport.ears && (
                    <div className={styles.imageBox}>
                      <img
                        src={`data:image/jpeg;base64,${selectedReport.ears}`}
                        alt="Ears"
                        className={styles.imagePreview}
                        onClick={() => {
                          setEnlargedImage(`data:image/jpeg;base64,${selectedReport.ears}`);
                          setImageLabel('Ears');
                        }}
                      />
                      <p className={styles.imageLabel}>Ears</p>
                    </div>
                  )}
                  {selectedReport.skin && (
                    <div className={styles.imageBox}>
                      <img
                        src={`data:image/jpeg;base64,${selectedReport.skin}`}
                        alt="Skin"
                        className={styles.imagePreview}
                        onClick={() => {
                          setEnlargedImage(`data:image/jpeg;base64,${selectedReport.skin}`);
                          setImageLabel('Skin');
                        }}
                      />
                      <p className={styles.imageLabel}>Skin</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedReport.map && (
              <div>
                <p><strong>Map Snapshot:</strong></p>
                <img
                  src={`data:image/jpeg;base64,${selectedReport.map}`}
                  alt="Map"
                  className={styles.imagePreview}
                  onClick={() => {
                    setEnlargedImage(`data:image/jpeg;base64,${selectedReport.map}`);
                    setImageLabel('Map');
                  }}
                />
              </div>
            )}

            <br />
            <button className={styles.closeButton} onClick={closeDialog}>Close</button>
          </div>
        </div>
      )}

      {enlargedImage && (
        <div className={styles.modalOverlay} onClick={() => setEnlargedImage(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModalButton} onClick={() => setEnlargedImage(null)}>×</button>
            <img src={enlargedImage} alt={imageLabel} className={styles.enlargedImage} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
