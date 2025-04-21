
import React from 'react';
import { Navigate } from 'react-router-dom';

// Redirect Index to Dashboard
const Index = () => {
  return <Navigate to="/dashboard" replace />;
};

export default Index;
