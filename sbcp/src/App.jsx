import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/route/ProtectedRoute';
import PublicRoute from './components/route/PublicRoute';

// Pages
import Index from './pages/Index';
import AuthPage from './pages/AuthPage';
import PostsGrid from './components/post/PostsGrid';
import StudyGroupsGrid from './components/groups/StudyGroupsGrid';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/auth" 
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/posts" 
            element={
              <ProtectedRoute>
                <PostsGrid />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/groups" 
            element={
              <ProtectedRoute>
                <StudyGroupsGrid />
              </ProtectedRoute>
            } 
          />

          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Index />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;