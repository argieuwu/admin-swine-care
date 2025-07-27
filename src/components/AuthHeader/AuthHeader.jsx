import React from 'react';
import styles from './AuthHeader.module.css';

const AuthHeader = () => (
  <header className={styles.authHeader}>
    <div className={styles.navContainer}>
      <div className={styles.logo}>
        <img src="/finaladminIcon.png" alt="ASF Tracker Logo" className={styles.logoIcon} />
        <span className={styles.logoText}>
          Admin <span className={styles.highlight}>SwineCare</span>
        </span>
      </div>
    </div>
  </header>
);

export default AuthHeader; 