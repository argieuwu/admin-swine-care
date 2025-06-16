import React, { useState } from 'react';
import styles from './Overview.module.css';

const Overview = () => {
  const [dateRange, setDateRange] = useState('7days');
  const [selectedReport, setSelectedReport] = useState(null);

  const reports = [
    { date: '2024-02-20', farmer: 'John Smith', farmId: 'FARM-001', location: 'Barangay 1, Tagum', result: 'Confirmed', affectedPigs: 15 },
    { date: '2024-02-19', farmer: 'Maria Garcia', farmId: 'FARM-002', location: 'Barangay 2, Tagum', result: 'Suspected', affectedPigs: 8 },
    { date: '2024-02-18', farmer: 'Robert Santos', farmId: 'FARM-003', location: 'Barangay 3, Tagum', result: 'Resolved', affectedPigs: 0 },
  ];

  const handleViewDetails = (report) => {
    setSelectedReport(report);
  };

  const closeDialog = () => {
    setSelectedReport(null);
  };

  return (
    <div className={styles.overviewContainer}>
      <div className={styles.dashboardHeader}>
        <h2>Dashboard Overview</h2>
        <div className={styles.dateFilter}>
          <label>Date Range:</label>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className={styles.selectInput}>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>
      </div>

      <div className={styles.alertsSection}>
        <div className={styles.alertCard + ' ' + styles.highRisk}>
          <strong>High Risk Alert:</strong> 3 new suspected cases reported in the last 24 hours
        </div>
        <div className={styles.alertCard + ' ' + styles.suspected}>
          <strong>Attention:</strong> 5 farms require immediate inspection
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Cases</h3>
          <div className={styles.statValue}>127</div>
      
        </div>
        <div className={styles.statCard}>
          <h3>Active Outbreaks</h3>
          <div className={styles.statValue}>23</div>
    
        </div>
        <div className={styles.statCard}>
          <h3>Affected Farms</h3>
          <div className={styles.statValue}>45</div>
     
        </div>
        <div className={styles.statCard}>
          <h3>Containment Rate</h3>
          <div className={styles.statValue}>78%</div>
    
        </div>
      </div>

      <div className={styles.reportsSection}>
        <div className={styles.reportsHeader}>
          <h3>Recent Farmer Submissions</h3>
          <button className={styles.viewAllButton}>View All Reports</button>
        </div>
        <div className={styles.reportsTable}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Farmer Name</th>
                <th>Farm ID</th>
                <th>Location</th>
                <th>Result</th>
                <th>Affected Pigs</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={index}>
                  <td>{report.date}</td>
                  <td>{report.farmer}</td>
                  <td>{report.farmId}</td>
                  <td>{report.location}</td>
                  <td><span className={styles.status + ' ' + styles[report.result.toLowerCase()]}>{report.result}</span></td>
                  <td>{report.affectedPigs}</td>
                  <td><button className={styles.actionButton} onClick={() => handleViewDetails(report)}>View Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedReport && (
        <div className={styles.dialogOverlay} onClick={closeDialog}>
          <div className={styles.dialog} onClick={e => e.stopPropagation()}>
            <h3>Report Details</h3>
            <p><strong>Farmer:</strong> {selectedReport.farmer}</p>
            <p><strong>Date:</strong> {selectedReport.date}</p>
            <p><strong>Farm ID:</strong> {selectedReport.farmId}</p>
            <p><strong>Location:</strong> {selectedReport.location}</p>
            <p><strong>Result:</strong> <span className={styles.status + ' ' + styles[selectedReport.result.toLowerCase()]}>{selectedReport.result}</span></p>
            <p><strong>Affected Pigs:</strong> {selectedReport.affectedPigs}</p>
            <button className={styles.closeButton} onClick={closeDialog}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;