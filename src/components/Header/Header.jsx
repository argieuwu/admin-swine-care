import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.navContainer}>
        <div className={styles.logo}>
          <Link to="/overview">
            <img src="/finaladminIcon.png" alt="ASF Tracker Icon" className={styles.logoIcon} />
            <span className={styles.logoText}>
              Admin <span className={styles.highlight}>SwineCare</span>
            </span>
          </Link>
        </div>
        <div className={styles.userProfile}>
          <div className={styles.userAvatar}>A</div>
          <span className={styles.userName}>Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Header;