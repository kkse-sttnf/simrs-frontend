import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Login from "./pages/LoginForm/LoginForm";
import DataDokter from "./pages/DataDokter";
import DetailPasien from "./pages/DetailPasien";
import TambahPasien from "./pages/TambahPasien";
import RawatJalan from "./pages/RawatJalan";
import ProtectedRoute from "./components/ProtectJS/ProtectJs";
import TambahDokter from "./pages/TambahDokter";
import DetailDokter from "./pages/DetailDokter";

const PageTitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      "/login": "Login - SIM RS",
      "/DataDokter": "Data Dokter - SIM RS",
      "/DetailPasien": "Detail Pasien - SIM RS",
      "/TambahPasien": "Tambah Pasien - SIM RS",
      "/RawatJalan": "Rawat Jalan - SIM RS",
      "/DataDokter/TambahDokter": "Tambah Dokter - SIM RS",
      "/DataDokter/DetailDokter/:id": "Detail Dokter - SIM RS"
    };

    if (location.pathname.startsWith("/DataDokter/DetailDokter/")) {
      document.title = "Detail Dokter - SIM RS";
    } else {
      document.title = titles[location.pathname] || "SIM RS";
    }
  }, [location]);

  return null;
};

function App() {
  return (
    <Router>
      <PageTitleUpdater />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/DetailPasien" element={<DetailPasien />} />
          <Route path="/DataDokter" element={<DataDokter />} />
          <Route path="/TambahPasien" element={<TambahPasien />} />
          <Route path="/RawatJalan" element={<RawatJalan />} />
          <Route path="/DataDokter/TambahDokter" element={<TambahDokter />} />
          <Route path="/DataDokter/DetailDokter/:id" element={<DetailDokter />} />
          <Route path="/" element={<Navigate to="/DetailPasien" replace />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;