import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';
import { 
  LogOut, 
  User, 
  Home, 
  Search, 
  Plus, 
  BookOpen,
  Users,
  MessageCircle,
  Bell,
  Menu,
  X,
  Settings,
  Edit,
  ChevronDown
} from 'lucide-react';

const Navigation = ({ onCreatePost, onSearch, searchQuery, setSearchQuery }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/auth';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery && searchQuery.trim()) {
      navigate(`/posts?search=${encodeURIComponent(searchQuery.trim())}`);
      if (onSearch) onSearch(searchQuery.trim());
    }
  };

  const handleCreatePost = () => {
    if (onCreatePost) {
      onCreatePost();
    } else {
      // If no create post handler, navigate to posts page
      navigate('/posts');
    }
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/posts', label: 'Posts', icon: BookOpen },
    { path: '/groups', label: 'Groups', icon: Users },
    { path: '/users/search', label: 'Discover', icon: Search }, // Added user discovery
  ];

  // Profile menu items
  const profileMenuItems = [
    { path: '/profile', label: 'My Profile', icon: User },
    { path: '/profile/edit', label: 'Edit Profile', icon: Edit },
    { path: '/profile/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-xl border-brand-200/30 shadow-pinterest">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-3 transition-colors hover:opacity-80"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-brand-400 to-brand-500 rounded-pinterest">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-brand-600">StudyHub</span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="items-center hidden space-x-2 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center px-4 py-2 space-x-2 transition-all rounded-pinterest ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-brand-400 to-brand-500 text-white shadow-pinterest'
                      : 'text-brand-600 hover:bg-brand-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4 lg:max-w-lg">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-brand-500/50" />
                <input
                  type="text"
                  value={searchQuery || ''}
                  onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                  placeholder="Search posts, groups, users..."
                  className="w-full py-2 pl-10 pr-4 text-sm transition-all border bg-brand-100/50 border-brand-200 rounded-pinterest-lg text-brand-600 placeholder-brand-500/50 focus:ring-2 focus:ring-brand-400 focus:border-brand-400 focus:bg-white"
                />
              </div>
            </form>
          </div>

          {/* Desktop User Actions */}
          <div className="items-center hidden space-x-3 md:flex">
            {/* Create Button */}
            <button 
              onClick={handleCreatePost}
              className="flex items-center px-4 py-2 space-x-2 text-white transition-all bg-gradient-to-r from-brand-400 to-brand-500 rounded-pinterest shadow-pinterest hover:shadow-pinterest-hover hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">Create</span>
            </button>

            {/* Notifications */}
            <button className="p-2 transition-colors text-brand-500 hover:bg-brand-100 rounded-pinterest">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 transition-colors text-brand-500 hover:bg-brand-100 rounded-pinterest">
              <MessageCircle className="w-5 h-5" />
            </button>
            
            {/* Profile Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center px-3 py-2 space-x-2 transition-colors hover:bg-brand-100 rounded-pinterest"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-brand-300 to-brand-400">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-brand-600">
                  {user?.email?.split('@')[0] || 'User'}
                </span>
                <ChevronDown className="w-3 h-3 text-brand-500" />
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 z-50 w-56 py-2 mt-2 border bg-white/95 backdrop-blur-xl rounded-pinterest-lg shadow-pinterest-lg border-brand-200/30">
                  {profileMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          setIsProfileMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-3 space-x-3 text-left transition-colors text-brand-600 hover:bg-brand-50"
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                  <hr className="my-2 border-brand-200" />
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsProfileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 space-x-3 text-left transition-colors text-pinterest-red hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 transition-colors text-brand-500 hover:bg-brand-100 rounded-pinterest"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="pb-4 md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-3 py-2 space-x-3 text-left transition-all rounded-pinterest ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-brand-400 to-brand-500 text-white shadow-pinterest'
                        : 'text-brand-600 hover:bg-brand-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
              
              {/* Mobile Create Button */}
              <button 
                onClick={() => {
                  handleCreatePost();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 space-x-3 text-white transition-all bg-gradient-to-r from-brand-400 to-brand-500 rounded-pinterest shadow-pinterest"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Create Post</span>
              </button>

              {/* Mobile User Profile Section */}
              <div className="pt-3 mt-3 border-t border-brand-200/30">
                <div className="flex items-center px-3 py-2 mb-2 space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-brand-300 to-brand-400">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-brand-600">
                    {user?.email?.split('@')[0] || 'User'}
                  </span>
                </div>

                {/* Mobile Profile Menu Items */}
                {profileMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 space-x-3 text-left transition-colors text-brand-600 hover:bg-brand-100 rounded-pinterest"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 space-x-3 text-left transition-colors text-pinterest-red hover:bg-red-50 rounded-pinterest"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop to close dropdowns */}
      {(isProfileMenuOpen || isMobileMenuOpen) && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileMenuOpen(false);
            setIsMobileMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navigation;