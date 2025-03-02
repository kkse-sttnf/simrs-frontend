import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/LoginForm/LoginForm";
import DataDokter from "./pages/DataDokter";
import DetailPasien from "./pages/DetailPasien";
import TambahPasien from "./pages/TambahPasien";
import RawatJalan from "./pages/RawatJalan";
import ProtectedRoute from "./components/ProtectJS/ProtectJs";
import TambahDokter from "./pages/TambahDokter";

const PageTitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      "/login": "Login - SIM RS",
      "/DataDokter": "Data Dokter - SIM RS",
      "/DetailPasien": "Detail Pasien - SIM RS",
      "/TambahPasien": "Tambah Pasien - SIM RS",
      "/RawatJalan": "Rawat Jalan - SIM RS",
    };

    document.title = titles[location.pathname] || "SIM RS";
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
          <Route path="/DataDokter" element={<DataDokter />} />
          <Route path="/DetailPasien" element={<DetailPasien />} />
          <Route path="/DetailPasien/TambahPasien" element={<TambahPasien />} />
          <Route path="/DataDokter/TambahDokter" element={<TambahDokter />} />
          <Route path="/RawatJalan" element={<RawatJalan />} />
        </Route>
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;