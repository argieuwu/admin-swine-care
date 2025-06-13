import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Header.css';

const Header = () => {
  return (
    <header className="header-container">
      <div className="nav-container">
        <div className="logo">
          <Link to="/">
            <img src="/images/SwineCareFinal.png" alt="Pig Icon" className="logo-icon" />
            <span className="logo-text">ASF <span className="highlight">Tracker</span></span>
          </Link>
        </div>
        <div className="user-profile">
          <div className="user-avatar">A</div>
          <span>Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Header; 