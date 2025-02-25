import './App.css';
import React from 'react';
import LoginForm from './LoginForm/LoginForm';
import DataPasien from './pages/TambahPasien';
import DataDokter from './pages/DataDokter';
import DetailDataPasien from './pages/DetailPasien';
import TambahPasien from './pages/TambahPasien';




function App() {
  return (
    <div className="App">
      <TambahPasien />
    </div>
  );
}

export default App;
