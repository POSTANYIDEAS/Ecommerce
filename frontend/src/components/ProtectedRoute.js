import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('adminToken'); // check token

  return isAuthenticated ? children : <Navigate to="/admin/login" />;
}

export default ProtectedRoute;
