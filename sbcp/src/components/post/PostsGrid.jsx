import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import PostCard from './PostCard';
import CreatePostModal from './CreatePostModal';
import Navigation from '../common/Navigation';
import { apiService } from '../../services/apiService';

const PostsGrid = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const categories = [
    { name: 'All', count: 0 },
    { name: 'Mathematics', count: 0 },
    { name: 'Programming', count: 0 },
    { name: 'Biology', count: 0 },
    { name: 'Physics', count: 0 },
    { name: 'Writing', count: 0 },
    { name: 'Technology', count: 0 }
  ];

  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
    loadPosts();
  }, [searchParams]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      let postsData;
      const searchFromUrl = searchParams.get('search');
      
      if (searchFromUrl || searchQuery) {
        postsData = await apiService.posts.search(searchFromUrl || searchQuery);
      } else if (selectedCategory !== 'All') {
        postsData = await apiService.posts.getByCategory(selectedCategory);
      } else {
        postsData = await apiService.posts.getAll();
      }
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchParams.get('search')) {
      loadPosts();
    }
  }, [selectedCategory]);

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(prev => prev.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  const currentSearch = searchParams.get('search');

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-brand-100 to-brand-200">
      
      {/* Navigation */}
      <Navigation 
        onCreatePost={() => setIsCreateModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={(query) => setSearchParams({ search: query })}
      />

      {/* Content */}
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-brand-600">Study Posts</h1>
          <p className="text-brand-500/70">Explore and share study materials</p>
        </div>

        {/* Category Filters - Only show if not searching */}
        {!currentSearch && (
          <div className="mb-8">
            <div className="flex items-center pb-4 space-x-4 overflow-x-auto">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex-shrink-0 px-6 py-3 rounded-pinterest-lg font-medium transition-all ${
                    selectedCategory === category.name
                      ? 'bg-gradient-to-r from-brand-400 to-brand-500 text-white shadow-pinterest'
                      : 'bg-white/80 text-brand-600 hover:bg-white hover:shadow-pinterest border border-brand-200/30'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results Header */}
        {currentSearch && (
          <div className="mb-8 text-center">
            <p className="text-brand-600">
              Showing results for: <span className="font-semibold">"{currentSearch}"</span>
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 rounded-full border-brand-200 border-t-brand-500 animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Posts Grid */}
            {posts.length > 0 ? (
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
                    <Search className="w-8 h-8 text-brand-500" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-brand-600">
                    No posts found
                  </h3>
                  <p className="text-brand-500/70">
                    {currentSearch 
                      ? `No posts match "${currentSearch}". Try a different search term.`
                      : 'Be the first to share study materials in this category!'
                    }
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Post Modal */}
      <CreatePostModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
};

export default PostsGrid;