import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './components/auth/AuthLayout';
import Index from './pages/Index';
import ProtectedRoute from './components/route/ProtectedRoute';
import PublicRoute from './components/route/PublicRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes - Only accessible when NOT logged in */}
          <Route 
            path="/auth" 
            element={
              <PublicRoute>
                <AuthLayout />
              </PublicRoute>
            } 
          />
          
          {/* Protected Routes - Only accessible when logged in */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;