import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/route/ProtectedRoute';
import PublicRoute from './components/route/PublicRoute';

// Pages
import Index from './pages/Index';
import AuthPage from './pages/AuthPage';
import PostsGrid from './components/post/PostsGrid';
import StudyGroupsGrid from './components/groups/StudyGroupsGrid';

// User Management Components
import UserMainPage from './components/user/UserMainPage';
import UserSearchPage from './components/user/UserSearchPage';
import OtherUserProfilePage from './components/user/OtherUserProfilePage';

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

          {/* ==================== USER MANAGEMENT ROUTES ==================== */}
          
          {/* Current User Profile Dashboard */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserMainPage />
              </ProtectedRoute>
            }
          />

          {/* Profile Edit Form */}
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <UserMainPage />
              </ProtectedRoute>
            }
          />

          {/* Profile Settings */}
          <Route
            path="/profile/settings"
            element={
              <ProtectedRoute>
                <UserMainPage />
              </ProtectedRoute>
            }
          />

          {/* View Another User's Profile - Uses OtherUserProfilePage */}
          <Route
            path="/users/:userId"
            element={
              <ProtectedRoute>
                <OtherUserProfilePage />
              </ProtectedRoute>
            }
          />

          {/* User Search & Discovery */}
          <Route
            path="/users/search"
            element={
              <ProtectedRoute>
                <UserSearchPage />
              </ProtectedRoute>
            }
          />

          {/* Alternative route for user discovery */}
          <Route
            path="/discover"
            element={
              <ProtectedRoute>
                <UserSearchPage />
              </ProtectedRoute>
            }
          />

          {/* ==================== END USER MANAGEMENT ROUTES ==================== */}

          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Index />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;