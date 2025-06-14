import React from 'react';
import styles from './App.module.css';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Overview from './pages/Overview/Overview';
import Map from './pages/Map/Map';

function App() {
  return (
    <div className={styles.app}>
      <Header />
      <Sidebar />
      <Overview />
      <Map />
    </div>
  );
}

export default App;