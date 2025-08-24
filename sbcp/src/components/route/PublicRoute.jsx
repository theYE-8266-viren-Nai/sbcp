
import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../../services/authservice'; // 🎯 Fixed import (authService not authservice)

const PublicRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated) {
    // Redirect to dashboard if already authenticated
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;