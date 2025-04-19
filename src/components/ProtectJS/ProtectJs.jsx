import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getProvider } from "../../utils/ethersProvider";

const ProtectedRoute = () => {
  const provider = getProvider();

  if (provider) return <Outlet />
  
  return <Navigate to={"/login"} />
};

export default ProtectedRoute;