import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");

  // Jika pengguna belum login, redirect ke halaman login
  if (isLoggedIn !== "true") {
    return <Navigate to="/login" replace />;
  }

  // Jika pengguna sudah login, tampilkan rute yang diminta
  return <Outlet />;
};

export default ProtectedRoute;