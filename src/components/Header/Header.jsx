import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.navContainer}>
        <div className={styles.logo}>
          <Link to="/">
            <img src="/src/assets/SwineCareFinal.png" alt="Pig Icon" className={styles.logoIcon} />
            <span className={styles.logoText}>
              ASF <span className={styles.highlight}>Tracker</span>
            </span>
          </Link>
        </div>
        <div className={styles.userProfile}>
          <div className={styles.userAvatar}>A</div>
          <span className={styles.userName}>Admin</span>
          <button className={styles.dropdownToggle}>▼</button>
          <div className={styles.dropdownMenu}>
            <a href="/profile">Profile</a>
            <a href="/logout">Logout</a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;