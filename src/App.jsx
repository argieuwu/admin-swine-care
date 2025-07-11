import React from 'react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styles from './App.module.css';
import Header from './components/Header/Header.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import Overview from './pages/Overview/Overview.jsx';
import Map from './pages/Map/Map.jsx';
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import Settings from './pages/Setting/Settings.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="*"
          element={
            <>
              <ToastContainer position="bottom-right" autoClose={3000} />
              <div className={styles.app}>
                <Header />
                <div className={styles.mainContainer}>
                  <Sidebar />
                  <div className={styles.contentWrapper}>
                    <div className={styles.pageContent}>
                      <Routes>
                        <Route path="/overview" element={<Overview />} />
                        <Route path="/map" element={<Map />} />
                        <Route path="/settings" element={<Settings />} />
                      </Routes>
                    </div>
                  </div>
                </div>
              </div>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
