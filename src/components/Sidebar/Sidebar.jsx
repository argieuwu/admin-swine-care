import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { FaTachometerAlt, FaMapMarkedAlt } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <aside className={styles.sidebarContainer}>
      <div className={styles.sidebarContent}>
        <h2 className={styles.sidebarTitle}>Menu</h2>
        <ul className={styles.sidebarMenu}>
          <li className={styles.menuItem}>
            <Link to="/overview" className={styles.sidebarLink}>
              <FaTachometerAlt className={styles.menuIcon} /> Overview
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link to="/map" className={styles.sidebarLink}>
              <FaMapMarkedAlt className={styles.menuIcon} /> Map
            </Link>
          </li>
        </ul>
      </div>
      <div className={styles.sidebarFooter}>
        <button className={styles.logoutButton}>Logout</button>
      </div>
    </aside>
  );
};

export default Sidebar;