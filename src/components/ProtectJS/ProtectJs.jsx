import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();
  const isAuthenticated = !!sessionStorage.getItem("walletAddress") && 
                         !!sessionStorage.getItem("isLoggedIn");

  console.log('ProtectedRoute check:', {
    isAuthenticated,
    walletAddress: sessionStorage.getItem("walletAddress"),
    isLoggedIn: sessionStorage.getItem("isLoggedIn"),
    currentPath: location.pathname
  });

  if (!isAuthenticated) {
    console.log('Storing redirect path:', location.pathname);
    sessionStorage.setItem('redirectPath', location.pathname);
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;