import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { apiService } from '../services/apiService';
import PostCard from '../components/post/PostCard';
import CreatePostModal from '../components/post/CreatePostModal';
import Navigation from '../components/common/Navigation';
import { 
  Plus, 
  BookOpen,
  Users
} from 'lucide-react';

const Index = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [postsData, groupsData] = await Promise.all([
        apiService.posts.getAll(),
        apiService.groups.getAll()
      ]);
      
      setPosts(postsData.slice(0, 6));
      setGroups(groupsData.slice(0, 4));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev.slice(0, 5)]);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(prev => prev.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-brand-100 to-brand-200 font-pinterest">
      {/* Navigation */}
      <Navigation 
        onCreatePost={() => setIsCreatePostModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

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
              <button 
                onClick={() => setIsCreatePostModalOpen(true)}
                className="items-center hidden px-6 py-3 space-x-2 text-white transition-all sm:flex bg-gradient-to-r from-brand-400 to-brand-500 rounded-pinterest shadow-pinterest hover:shadow-pinterest-hover hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Create Post</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <button 
            onClick={() => navigate('/posts')}
            className="p-6 transition-all border bg-white/80 rounded-pinterest-lg shadow-pinterest hover:shadow-pinterest-hover hover:scale-105 border-brand-200/30"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-pinterest">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-brand-600">Browse Posts</h3>
                <p className="text-sm text-brand-500/70">Explore study materials</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => navigate('/groups')}
            className="p-6 transition-all border bg-white/80 rounded-pinterest-lg shadow-pinterest hover:shadow-pinterest-hover hover:scale-105 border-brand-200/30"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-pinterest">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-brand-600">Study Groups</h3>
                <p className="text-sm text-brand-500/70">Join or create groups</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => setIsCreatePostModalOpen(true)}
            className="p-6 transition-all border bg-white/80 rounded-pinterest-lg shadow-pinterest hover:shadow-pinterest-hover hover:scale-105 border-brand-200/30"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-pinterest">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-brand-600">Create Content</h3>
                <p className="text-sm text-brand-500/70">Share your knowledge</p>
              </div>
            </div>
          </button>
        </div>

        {/* Recent Posts Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-brand-600">Recent Posts</h2>
            <button 
              onClick={() => navigate('/posts')}
              className="font-medium text-brand-500 hover:text-brand-600"
            >
              View All →
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 rounded-full border-brand-200 border-t-brand-500 animate-spin"></div>
            </div>
          ) : posts.length > 0 ? (
            <div className="gap-6 space-y-6 columns-1 sm:columns-2 lg:columns-3 xl:columns-4">
              {posts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onUpdate={handlePostUpdate}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-brand-100">
                  <BookOpen className="w-8 h-8 text-brand-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-brand-600">No posts yet</h3>
                <p className="text-brand-500/70">Be the first to share study materials!</p>
              </div>
            </div>
          )}
        </div>

        {/* Recent Groups Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-brand-600">Popular Study Groups</h2>
            <button 
              onClick={() => navigate('/groups')}
              className="font-medium text-brand-500 hover:text-brand-600"
            >
              View All →
            </button>
          </div>

          {groups.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {groups.map((group) => (
                <div key={group.id} className="p-6 transition-all border bg-white/80 rounded-pinterest-lg shadow-pinterest hover:shadow-pinterest-hover border-brand-200/30">
                  <div className="flex items-center mb-4 space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-brand-400 to-brand-500 rounded-pinterest">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-brand-600">{group.name}</h3>
                      <p className="text-sm text-brand-500/70">{group.subject}</p>
                    </div>
                  </div>
                  <p className="mb-3 text-sm text-brand-500/70 line-clamp-2">{group.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-brand-600">{group.currentMembers}/{group.maxMembers} members</span>
                    <button 
                      onClick={() => navigate('/groups')}
                      className="text-sm font-medium text-brand-500 hover:text-brand-600"
                    >
                      View →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="max-w-md mx-auto">
                <Users className="w-12 h-12 mx-auto mb-4 text-brand-400" />
                <h3 className="mb-2 text-lg font-semibold text-brand-600">No groups yet</h3>
                <p className="text-brand-500/70">Create the first study group!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal 
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
};

export default Index;