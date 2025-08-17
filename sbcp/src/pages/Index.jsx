
import React, { useEffect, useState } from 'react';
import { authService } from '../services/authService';
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
  Settings,
  Heart,
  Share,
  Bookmark,
  MoreHorizontal,
  TrendingUp
} from 'lucide-react';

const Index = () => {
  const [user, setUser] = useState(null);
  // Removed unused activeTab state

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/auth';
  };

  // Sample data for Pinterest-style cards
  const studyCards = [
    {
      id: 1,
      title: "Advanced Calculus Notes",
      description: "Complete study guide with examples and practice problems",
      author: "Sarah Chen",
      likes: 124,
      saves: 45,
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
      category: "Mathematics",
      color: "from-brand-400 to-brand-500"
    },
    {
      id: 2,
      title: "React Hooks Cheat Sheet",
      description: "Everything you need to know about React Hooks in one place",
      author: "Mike Johnson",
      likes: 89,
      saves: 67,
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop",
      category: "Programming",
      color: "from-brand-300 to-brand-400"
    },
    {
      id: 3,
      title: "Biology Lab Report Template",
      description: "Professional template for biology lab reports with examples",
      author: "Emma Davis",
      likes: 156,
      saves: 89,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      category: "Biology",
      color: "from-brand-500 to-brand-600"
    },
    {
      id: 4,
      title: "Study Group: Linear Algebra",
      description: "Weekly study sessions for Linear Algebra. Join our group!",
      author: "Alex Rodriguez",
      likes: 78,
      saves: 34,
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop",
      category: "Study Groups",
      color: "from-brand-200 to-brand-300"
    },
    {
      id: 5,
      title: "Physics Formula Reference",
      description: "Essential physics formulas for your exams",
      author: "David Kim",
      likes: 203,
      saves: 156,
      image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=300&fit=crop",
      category: "Physics",
      color: "from-brand-400 to-brand-600"
    },
    {
      id: 6,
      title: "Essay Writing Tips",
      description: "Improve your academic writing with these proven techniques",
      author: "Lisa Wang",
      likes: 167,
      saves: 234,
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop",
      category: "Writing",
      color: "from-brand-300 to-brand-500"
    }
  ];

  const categories = [
    { name: 'All', count: 1250, active: true },
    { name: 'Mathematics', count: 234 },
    { name: 'Programming', count: 189 },
    { name: 'Biology', count: 156 },
    { name: 'Physics', count: 145 },
    { name: 'Writing', count: 98 },
    { name: 'Study Groups', count: 87 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-brand-100 to-brand-200 font-pinterest">
      {/* Navigation Header - Pinterest Style */}
      <nav className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-xl border-brand-200/30 shadow-pinterest">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-brand-400 to-brand-500 rounded-pinterest">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-brand-600">StudyHub</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-4 top-1/2 text-brand-500/50" />
                <input
                  type="text"
                  placeholder="Search for study materials, notes, groups..."
                  className="w-full py-3 pl-12 pr-4 transition-all border bg-brand-100/50 border-brand-200 rounded-pinterest-lg text-brand-600 placeholder-brand-500/50 focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 transition-colors text-brand-500 hover:bg-brand-100 rounded-pinterest">
                <Bell className="w-6 h-6" />
              </button>
              <button className="p-2 transition-colors text-brand-500 hover:bg-brand-100 rounded-pinterest">
                <MessageCircle className="w-6 h-6" />
              </button>
              
              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-brand-300 to-brand-400">
                  <User className="w-5 h-5 text-white" />
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 space-x-2 transition-colors text-brand-500 hover:bg-brand-100 rounded-pinterest"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="p-8 border bg-white/80 backdrop-blur-sm rounded-pinterest-lg shadow-pinterest border-brand-200/30">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold text-brand-600">
                  Welcome back, {user?.email?.split('@')[0] || 'Student'}! 👋
                </h1>
                <p className="text-lg text-brand-500/70">
                  Discover amazing study materials and connect with fellow students
                </p>
              </div>
              <button className="flex items-center px-6 py-3 space-x-2 text-white transition-all bg-gradient-to-r from-brand-400 to-brand-500 rounded-pinterest shadow-pinterest hover:shadow-pinterest-hover hover:scale-105">
                <Plus className="w-5 h-5" />
                <span className="font-medium">Create Post</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Filters - Pinterest Style */}
        <div className="mb-8">
          <div className="flex items-center pb-4 space-x-4 overflow-x-auto">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`flex-shrink-0 px-6 py-3 rounded-pinterest-lg font-medium transition-all ${
                  category.active
                    ? 'bg-gradient-to-r from-brand-400 to-brand-500 text-white shadow-pinterest'
                    : 'bg-white/80 text-brand-600 hover:bg-white hover:shadow-pinterest border border-brand-200/30'
                }`}
              >
                {category.name}
                <span className={`ml-2 text-sm ${category.active ? 'text-white/80' : 'text-brand-500/60'}`}>
                  ({category.count})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Pinterest-Style Masonry Grid */}
        <div className="gap-6 space-y-6 columns-1 sm:columns-2 lg:columns-3 xl:columns-4">
          {studyCards.map((card) => (
            <div
              key={card.id}
              className="break-inside-avoid bg-white/90 backdrop-blur-sm rounded-pinterest-lg shadow-pinterest hover:shadow-pinterest-hover transition-all duration-300 hover:scale-[1.02] border border-brand-200/30 group"
            >
              {/* Card Image */}
              <div className="relative overflow-hidden rounded-t-pinterest-lg">
                <img
                  src={card.image}
                  alt={card.title}
                  className="object-cover w-full h-48 transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${card.color} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                
                {/* Overlay Actions */}
                <div className="absolute transition-opacity opacity-0 top-4 right-4 group-hover:opacity-100">
                  <button className="p-2 transition-transform bg-white/90 backdrop-blur-sm rounded-pinterest shadow-pinterest hover:scale-110">
                    <Bookmark className="w-4 h-4 text-brand-600" />
                  </button>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-3 py-1 text-xs font-medium text-white rounded-pinterest bg-gradient-to-r ${card.color}`}>
                    {card.category}
                  </span>
                  <button className="p-1 transition-colors text-brand-500/50 hover:text-brand-500">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="mb-2 text-lg font-semibold transition-colors text-brand-600 group-hover:text-brand-500">
                  {card.title}
                </h3>
                
                <p className="mb-4 text-sm text-brand-500/70 line-clamp-2">
                  {card.description}
                </p>

                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-brand-300 to-brand-400">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-brand-600">{card.author}</span>
                  </div>
                  
                  {/* Engagement Stats */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4 text-pinterest-red/60" />
                      <span className="text-sm text-brand-500/70">{card.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Bookmark className="w-4 h-4 text-brand-500/60" />
                      <span className="text-sm text-brand-500/70">{card.saves}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 mt-4 border-t border-brand-200/30">
                  <div className="flex items-center justify-between">
                    <button className="flex items-center px-4 py-2 space-x-2 transition-colors text-brand-500 hover:bg-brand-50 rounded-pinterest">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm font-medium">Like</span>
                    </button>
                    <button className="flex items-center px-4 py-2 space-x-2 transition-colors text-brand-500 hover:bg-brand-50 rounded-pinterest">
                      <Share className="w-4 h-4" />
                      <span className="text-sm font-medium">Share</span>
                    </button>
                    <button className="flex items-center px-4 py-2 space-x-2 transition-colors text-brand-500 hover:bg-brand-50 rounded-pinterest">
                      <Bookmark className="w-4 h-4" />
                      <span className="text-sm font-medium">Save</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-12 text-center">
          <button className="px-8 py-4 font-medium transition-all border bg-white/80 text-brand-600 border-brand-300 rounded-pinterest-lg hover:bg-white hover:shadow-pinterest">
            Load More Content
          </button>
        </div>
      </div>

      {/* Floating Action Button - Pinterest Style */}
      <button className="fixed z-50 flex items-center justify-center w-16 h-16 text-white transition-all rounded-full bottom-8 right-8 bg-gradient-to-r from-brand-400 to-brand-500 shadow-pinterest-lg hover:shadow-pinterest-hover hover:scale-110">
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
};

export default Index;