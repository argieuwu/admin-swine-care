import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css'; // Use the module CSS in the same directory

const Sidebar = () => {
  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <aside className={styles.sidebarContainer}>
      <div className={styles.sidebarContent}>
        <h3 className={styles.sidebarTitle}>Admin Navigation</h3>
        <p className={styles.menuTitle}>Monitoring</p>
        <ul className={styles.sidebarMenu}>
          <li className={styles.menuItem}>
            <NavLink to="/" end className={({ isActive }) => 
              isActive ? `${styles.sidebarLink} ${styles.active}` : styles.sidebarLink
            }>
              Overview
            </NavLink>
          </li>
          <li className={styles.menuItem}>
            <NavLink to="/map" className={({ isActive }) => 
              isActive ? `${styles.sidebarLink} ${styles.active}` : styles.sidebarLink
            }>
              ASF Map
            </NavLink>
          </li>
        </ul>
      </div>
      <div className={styles.sidebarFooter}>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;