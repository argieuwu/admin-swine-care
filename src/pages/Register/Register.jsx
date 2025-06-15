import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Register.module.css';
import AuthHeader from '../../components/AuthHeader/AuthHeader';
import AuthFooter from '../../components/AuthFooter/AuthFooter';
import swineBg from '../../assets/swinebackgorundimage.jpg';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!name || !email || !password || !confirmPassword) {
      return;
    }
    if (password !== confirmPassword) {
      return;
    }
    // Add register logic here
  };

  return (
    <>
      <div
        className={styles.registerBgImage}
        style={{
          background: `linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${swineBg}) center center/cover no-repeat`
        }}
      ></div>
      <AuthHeader />
      <div className={styles.centerWrapper}>
        <form onSubmit={handleSubmit} className={styles.registerCard}>
          <div className={styles.authHeader}>
            <h2>Request Access</h2>
            <p>Join the ASF Tracker Management System</p>
          </div>
          <h2 className={styles.registerTitle}>Register</h2>
          <div className={styles.inputGroup}>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            {submitted && !name && <div className={styles.inputError}>Name is required.</div>}
          </div>
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
          <div className={styles.inputGroup}>
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            {submitted && !confirmPassword && <div className={styles.inputError}>Please confirm your password.</div>}
            {submitted && confirmPassword && password !== confirmPassword && <div className={styles.inputError}>Passwords do not match.</div>}
          </div>
          <button type="submit" className={styles.registerBtn}>Register</button>
          <div className={styles.switchText}>
            <span>Already have an account? </span>
            <Link to="/login" className={styles.link}>Login</Link>
          </div>
        </form>
      </div>
      <AuthFooter />
    </>
  );
};

export default Register;