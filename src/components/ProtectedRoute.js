import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage

    // If the token doesn't exist, redirect to the login page
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If authenticated, render the children
    return children;
};

export default ProtectedRoute;
