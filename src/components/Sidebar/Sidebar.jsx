import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/components/Sidebar.css';

const Sidebar = () => {
  const handleLogout = () => {
    // Implement logout functionality
    console.log('Logout clicked');
  };

  return (
    <aside className="sidebar-container">
      <div className="sidebar-content">
        <h3 className="sidebar-title">Admin Navigation</h3>
        <p className="menu-title">Monitoring</p>
        <ul className="sidebar-menu">
          <li className="menu-item">
            <NavLink to="/" end className={({ isActive }) => 
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }>
              Overview
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/map" className={({ isActive }) => 
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }>
              ASF Map
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar; 