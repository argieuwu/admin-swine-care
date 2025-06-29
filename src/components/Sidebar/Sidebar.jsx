import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { FaTachometerAlt, FaMapMarkedAlt } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    navigate('/login');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <aside className={styles.sidebarContainer}>
      <div className={styles.sidebarContent}>
        <h2 className={styles.sidebarTitle}>Menu</h2>
        <ul className={styles.sidebarMenu}>
          <li className={styles.menuItem}>
            <Link
              to="/overview"
              className={`${styles.sidebarLink} ${location.pathname === '/overview' ? styles.active : ''}`}
            >
              <FaTachometerAlt className={styles.menuIcon} /> Overview
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link
              to="/map"
              className={`${styles.sidebarLink} ${location.pathname === '/map' ? styles.active : ''}`}
            >
              <FaMapMarkedAlt className={styles.menuIcon} /> ASF Map
            </Link>
          </li>
        </ul>
      </div>
      <div className={styles.sidebarFooter}>
        <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
      </div>
      {showLogoutModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalDialog}>
            <div className={styles.modalTitle}>Are you sure you want to logout?</div>
            <div className={styles.modalActions}>
              <button className={`${styles.modalButton} ${styles.modalCancelButton}`} onClick={cancelLogout}>
                Cancel
              </button>
              <button className={`${styles.modalButton} ${styles.modalConfirmButton}`} onClick={confirmLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
