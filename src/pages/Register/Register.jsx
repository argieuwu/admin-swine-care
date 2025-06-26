import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Register.module.css';
import AuthHeader from '../../components/AuthHeader/AuthHeader';
import AuthFooter from '../../components/AuthFooter/AuthFooter';
import swineBg from '../../assets/swinebackgorundimage.jpg';

import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from '../../config/firebase';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const auth = getAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!name || !email || !password || !confirmPassword) return;
    if (password !== confirmPassword) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Confirm the user is authenticated before writing to Firestore
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            await setDoc(doc(db, "admins", firebaseUser.uid), {
              name: name,
              email: email,
              createdAt: new Date()
            });
            toast.success("Account created successfully!");
           // console.log("User registered and saved to Firestore:", firebaseUser);
          } catch (firestoreError) {
            toast.error(`${firestoreError.message}`);
          }
        }
      });
    } catch (error) {
      toast.error(`Registration error: ${error.message}`);
      console.error("Registration error:", error.message);
    }
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
      <ToastContainer position="top-center" />
    </>
  );
};

export default Register;
