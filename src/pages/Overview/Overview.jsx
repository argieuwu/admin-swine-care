import React, { useState } from 'react';
import styles from './Overview.module.css'; // Use the module CSS in the same directory

const Overview = () => {
  const [dateRange, setDateRange] = useState('7days');

  return (
    <div className={styles.overviewContainer}>
      <div className={styles.dashboardHeader}>
        <h2>Dashboard Overview</h2>
        <div className={styles.dateFilter}>
          <label>Date Range:</label>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>
      </div>

      <div className={styles.alertsSection}>
        <div className={styles.alert + ' ' + styles.highRisk}>
          <strong>High Risk Alert:</strong> 3 new suspected cases reported in the last 24 hours
        </div>
        <div className={styles.alert + ' ' + styles.suspected}>
          <strong>Attention:</strong> 5 farms require immediate inspection
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Cases</h3>
          <div className={styles.statValue}>127</div>
          <div className={styles.statTrend + ' ' + styles.positive}>+12% from last week</div>
        </div>
        <div className={styles.statCard}>
          <h3>Active Outbreaks</h3>
          <div className={styles.statValue}>23</div>
          <div className={styles.statTrend + ' ' + styles.negative}>-5% from last week</div>
        </div>
        <div className={styles.statCard}>
          <h3>Affected Farms</h3>
          <div className={styles.statValue}>45</div>
          <div className={styles.statTrend + ' ' + styles.neutral}>No change</div>
        </div>
        <div className={styles.statCard}>
          <h3>Containment Rate</h3>
          <div className={styles.statValue}>78%</div>
          <div className={styles.statTrend + ' ' + styles.positive}>+3% from last week</div>
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
              <tr>
                <td>2024-02-20</td>
                <td>John Smith</td>
                <td>FARM-001</td>
                <td>Barangay 1, Tarlac</td>
                <td><span className={styles.status + ' ' + styles.confirmed}>Confirmed</span></td>
                <td>15</td>
                <td><button className={styles.actionButton}>View Details</button></td>
              </tr>
              <tr>
                <td>2024-02-19</td>
                <td>Maria Garcia</td>
                <td>FARM-002</td>
                <td>Barangay 2, Tarlac</td>
                <td><span className={styles.status + ' ' + styles.suspected}>Suspected</span></td>
                <td>8</td>
                <td><button className={styles.actionButton}>View Details</button></td>
              </tr>
              <tr>
                <td>2024-02-18</td>
                <td>Robert Santos</td>
                <td>FARM-003</td>
                <td>Barangay 3, Tarlac</td>
                <td><span className={styles.status + ' ' + styles.resolved}>Resolved</span></td>
                <td>0</td>
                <td><button className={styles.actionButton}>View Details</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;