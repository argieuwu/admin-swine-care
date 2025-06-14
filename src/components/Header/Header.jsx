import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css'; // Use the module CSS in the same directory

const Header = () => {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.navContainer}>
        <div className={styles.logo}>
          <Link to="/">
            <img src="/images/SwineCareFinal.png" alt="Pig Icon" className={styles.logoIcon} />
            <span className={styles.logoText}>ASF <span className={styles.highlight}>Tracker</span></span>
          </Link>
        </div>
        <div className={styles.userProfile}>
          <div className={styles.userAvatar}>A</div>
          <span>Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Header;