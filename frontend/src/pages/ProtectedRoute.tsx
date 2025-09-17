// src/pages/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('auth_token');
  const location = useLocation();

  console.log('ProtectedRoute token check:', { token, pathname: location.pathname }); // Debug

  if (!token || token.trim() === '') {
    console.warn('Token yo‘q yoki bo‘sh, redirecting to login from:', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;