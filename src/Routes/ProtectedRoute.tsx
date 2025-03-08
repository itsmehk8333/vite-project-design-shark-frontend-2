import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute: React.FC<{ allowedRoles?: string[] }> = ({ allowedRoles }) => {
  const token = localStorage.getItem('token'); // Check if token exists in localStorage
  const userRole = localStorage.getItem('role') || 'User'; // Get the user's role from localStorage
  const location = useLocation(); // Use React Router's useLocation to get the current path

  // If no token and trying to access a protected route, redirect to login
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If token exists and trying to access login or register, redirect based on role
  if (token && (location.pathname === '/login' || location.pathname === '/register')) {
    const redirectTo = userRole === 'Admin' ? '/admin' : '/allfolders';
    return <Navigate to={redirectTo} replace />;
  }

  // Check roles if provided (for admin-specific protection)
  if (allowedRoles) {
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/allfolders" replace />;
    }
  }

  return <Outlet />; // Render the child route if authenticated
};

export default ProtectedRoute;