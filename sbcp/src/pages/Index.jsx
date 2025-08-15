import React, { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { LogOut, User, Home, Settings } from 'lucide-react';

const Index = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get current user data
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/auth';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation Bar */}
      <nav className="border-b bg-white/10 backdrop-blur-xl border-white/20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Home className="w-8 h-8 text-purple-400" />
              <span className="ml-2 text-xl font-bold text-white">Student Community</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-white">
                <User className="w-5 h-5" />
                <span>Welcome, {user?.email}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 space-x-2 text-red-400 transition-colors rounded-lg bg-red-500/20 hover:bg-red-500/30"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
            Welcome to Student Community Platform! 🎓
          </h1>
          <p className="text-xl text-slate-300">
            You have successfully logged in. Start connecting with fellow students!
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 border bg-white/10 backdrop-blur-xl rounded-2xl border-white/20">
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
              <User className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">Profile Management</h3>
            <p className="text-slate-300">Manage your profile, academic information, and preferences.</p>
            <button className="px-4 py-2 mt-4 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700">
              View Profile
            </button>
          </div>

          <div className="p-6 border bg-white/10 backdrop-blur-xl rounded-2xl border-white/20">
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-gradient-to-r from-green-500 to-blue-500">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">Study Groups</h3>
            <p className="text-slate-300">Join or create study groups for your courses and subjects.</p>
            <button className="px-4 py-2 mt-4 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700">
              Browse Groups
            </button>
          </div>

          <div className="p-6 border bg-white/10 backdrop-blur-xl rounded-2xl border-white/20">
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
              <Home className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">Community Posts</h3>
            <p className="text-slate-300">Share knowledge, ask questions, and help fellow students.</p>
            <button className="px-4 py-2 mt-4 text-white transition-colors bg-orange-600 rounded-lg hover:bg-orange-700">
              View Posts
            </button>
          </div>
        </div>

        {/* User Info Card */}
        <div className="p-8 mt-12 border bg-white/10 backdrop-blur-xl rounded-2xl border-white/20">
          <h2 className="mb-4 text-2xl font-bold text-white">Your Account Information</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-slate-300">Email</label>
              <p className="px-3 py-2 text-white rounded-lg bg-white/5">{user?.email || 'Loading...'}</p>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-slate-300">Status</label>
              <p className="px-3 py-2 text-green-400 rounded-lg bg-white/5">Active Member</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;