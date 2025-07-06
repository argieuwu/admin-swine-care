import React from 'react';
import styles from './AuthHeader.module.css';

const AuthHeader = () => (
  <header className={styles.authHeader}>
    <div className={styles.navContainer}>
      <div className={styles.logo}>
        <img src="/public/SwineCareFinal.png" alt="ASF Tracker Logo" className={styles.logoIcon} />
        <span className={styles.logoText}>
          ASF <span className={styles.highlight}>Tracker</span>
        </span>
      </div>
    </div>
  </header>
);

export default AuthHeader; 