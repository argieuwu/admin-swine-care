import React from 'react';
import styles from './styles/App.module.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import Map from './pages/Map';

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