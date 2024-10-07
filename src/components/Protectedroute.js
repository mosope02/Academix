import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Retrieve the token from sessionStorage

  if (!token) {
    // Redirect to login if no token is found
    return <Navigate to="/login" />;
  }

  return children; // Render the component if token exists
};

export default ProtectedRoute;
