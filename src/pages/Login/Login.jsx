import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import AuthHeader from '../../components/AuthHeader/AuthHeader';
import AuthFooter from '../../components/AuthFooter/AuthFooter';
import swineBg from '../../assets/swinebackgorundimage.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!email || !password) {
      return;
    }
    navigate('/overview');
  };

  return (
    <>
      <div
        className={styles.loginBgImage}
        style={{
          background: `linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${swineBg}) center center/cover no-repeat`
        }}
      ></div>
      <AuthHeader />
      <div className={styles.centerWrapper}>
        <form onSubmit={handleSubmit} className={styles.loginCard}>
          <h2 className={styles.loginWelcome}>Welcome Back</h2>
          <p className={styles.loginSubtext}>Enter your credentials to access the ASF Tracker Management System</p>
          <h2 className={styles.loginTitle}>Login</h2>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            {submitted && !email && <div className={styles.inputError}>Email is required.</div>}
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {submitted && !password && <div className={styles.inputError}>Password is required.</div>}
          </div>
          <button type="submit" className={styles.loginBtn}>Login</button>
          <div className={styles.switchText}>
            <span>Don't have an account? </span>
            <Link to="/register" className={styles.link}>Register</Link>
          </div>
        </form>
      </div>
      <AuthFooter />
    </>
  );
};

export default Login;