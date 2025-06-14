import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import styles from './App.module.css';
import Header from './components/Header/Header.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import Overview from './pages/Overview/Overview.jsx';
import Map from './pages/Map/Map.jsx';

function App() {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <Header />
        <div className={styles.mainContainer}>
          <Sidebar />
          <div className={styles.contentWrapper}>
            <div className={styles.pageContent}>
              <Routes>
                <Route path="/overview" element={<Overview />} />
                <Route path="/map" element={<Map />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;