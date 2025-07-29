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
      "/login": "Login - EmulChain",
      "/DataDokter": "Data Dokter - EmulChain",
      "/DetailPasien": "Detail Pasien - EmulChain",
      "/TambahPasien": "Tambah Pasien - EmulChain",
      "/RawatJalan": "Rawat Jalan - EmulChain",
      "/DataDokter/TambahDokter": "Tambah Dokter - EmulChain",
      "/DataDokter/DetailDokter/:id": "Detail Dokter - EmulChain"
    };

    if (location.pathname.startsWith("/DataDokter/DetailDokter/")) {
      document.title = "Detail Dokter - EmulChain";
    } else {
      document.title = titles[location.pathname] || "EmulChain";
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
          <Route path="/DetailPasien/TambahPasien" element={<TambahPasien />} />
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