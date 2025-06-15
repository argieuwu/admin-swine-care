import React from 'react';
import styles from './AuthFooter.module.css';

const AuthFooter = () => (
  <footer className={styles.authFooter}>
    <span>© {new Date().getFullYear()} ASF Tracker. All rights reserved.</span>
  </footer>
);

export default AuthFooter; 