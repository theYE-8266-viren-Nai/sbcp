// ========================= Add these imports to your existing App.jsx =========================

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/route/ProtectedRoute';
import PublicRoute from './components/route/PublicRoute';

// Your existing imports...
import Index from './pages/Index';
import AuthPage from './pages/AuthPage';
import PostsGrid from './components/post/PostsGrid';
import StudyGroupsGrid from './components/groups/StudyGroupsGrid';
import UserMainPage from './components/user/UserMainPage';
import UserSearchPage from './components/user/UserSearchPage';
import OtherUserProfilePage from './components/user/OtherUserProfilePage';

// ✨ NEW IMPORTS FOR WEBSOCKET
import PrivateChat from './components/chat/PrivateChat';
import ChatList from './components/chat/ChatList';
import { NotificationProvider } from './contexts/NotificationContext';
import { useWebSocket } from './hooks/useWebSocket';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ✨ NEW: WebSocket Initializer Component
const WebSocketInitializer = () => {
  useWebSocket();
  return null;
};

function App() {
  return (
    <Router>
      {/* ✨ NEW: Wrap your entire app in NotificationProvider */}
      <NotificationProvider>
        {/* ✨ NEW: Initialize WebSocket connection */}
        <WebSocketInitializer />
        
        <div className="App">
          <Routes>
            {/* Your existing routes */}
            <Route
              path="/auth"
              element={
                <PublicRoute>
                  <AuthPage />
                </PublicRoute>
              }
            />

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

            {/* Your existing user management routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserMainPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute>
                  <UserMainPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile/settings"
              element={
                <ProtectedRoute>
                  <UserMainPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/users/:userId"
              element={
                <ProtectedRoute>
                  <OtherUserProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/users/search"
              element={
                <ProtectedRoute>
                  <UserSearchPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/discover"
              element={
                <ProtectedRoute>
                  <UserSearchPage />
                </ProtectedRoute>
              }
            />

            {/* ✨ NEW CHAT ROUTES */}
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/chat/private/:userId"
              element={
                <ProtectedRoute>
                  <PrivateChat />
                </ProtectedRoute>
              }
            />

            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Index />} />
          </Routes>
          
          {/* ✨ NEW: Toast Notifications */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </NotificationProvider>
    </Router>
  );
}

export default App;