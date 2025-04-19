import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getProvider, getSigner } from "../../utils/ethersProvider";

const ProtectedRoute = () => {
  const provider = getProvider();
  const signer = getSigner();

  if (provider && signer) return <Outlet />
  
  return <Navigate to={"/login"} />
};

export default ProtectedRoute;