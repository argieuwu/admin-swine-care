import React, { useState } from 'react';
import '../styles/pages/Overview.css';

const Overview = () => {
  const [dateRange, setDateRange] = useState('7days');

  return (
    <div className="overview-container">
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <div className="date-filter">
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
      </div>

      <div className="alerts-section">
        <div className="alert high-risk">
          <strong>High Risk Alert:</strong> 3 new suspected cases reported in the last 24 hours
        </div>
        <div className="alert suspected">
          <strong>Attention:</strong> 5 farms require immediate inspection
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Cases</h3>
          <div className="stat-value">127</div>
          <div className="stat-trend positive">+12% from last week</div>
        </div>
        <div className="stat-card">
          <h3>Active Outbreaks</h3>
          <div className="stat-value">23</div>
          <div className="stat-trend negative">-5% from last week</div>
        </div>
        <div className="stat-card">
          <h3>Affected Farms</h3>
          <div className="stat-value">45</div>
          <div className="stat-trend neutral">No change</div>
        </div>
        <div className="stat-card">
          <h3>Containment Rate</h3>
          <div className="stat-value">78%</div>
          <div className="stat-trend positive">+3% from last week</div>
        </div>
      </div>

      <div className="reports-section">
        <div className="reports-header">
          <h3>Recent Farmer Submissions</h3>
          <button className="view-all-button">View All Reports</button>
        </div>
        <div className="reports-table">
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
                <td><span className="status confirmed">Confirmed</span></td>
                <td>15</td>
                <td><button className="action-button">View Details</button></td>
              </tr>
              <tr>
                <td>2024-02-19</td>
                <td>Maria Garcia</td>
                <td>FARM-002</td>
                <td>Barangay 2, Tarlac</td>
                <td><span className="status suspected">Suspected</span></td>
                <td>8</td>
                <td><button className="action-button">View Details</button></td>
              </tr>
              <tr>
                <td>2024-02-18</td>
                <td>Robert Santos</td>
                <td>FARM-003</td>
                <td>Barangay 3, Tarlac</td>
                <td><span className="status resolved">Resolved</span></td>
                <td>0</td>
                <td><button className="action-button">View Details</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview; 