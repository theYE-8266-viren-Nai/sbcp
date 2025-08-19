import React, { useState } from 'react';
import { 
  Heart, 
  Bookmark, 
  Share, 
  MoreHorizontal, 
  User,
  Eye
} from 'lucide-react';
import { apiService } from '../../services/apiService';

const PostCard = ({ post, onUpdate }) => {
  const [isLiked, setIsLiked] = useState(post.isLikedByCurrentUser);
  const [isSaved, setIsSaved] = useState(post.isSavedByCurrentUser);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [savesCount, setSavesCount] = useState(post.savesCount);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      const updatedPost = await apiService.posts.toggleLike(post.id);
      setIsLiked(updatedPost.isLikedByCurrentUser);
      setLikesCount(updatedPost.likesCount);
      onUpdate && onUpdate(updatedPost);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      const updatedPost = await apiService.posts.toggleSave(post.id);
      setIsSaved(updatedPost.isSavedByCurrentUser);
      setSavesCount(updatedPost.savesCount);
      onUpdate && onUpdate(updatedPost);
    } catch (error) {
      console.error('Error toggling save:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Mathematics': 'from-blue-400 to-blue-500',
      'Programming': 'from-green-400 to-green-500',
      'Biology': 'from-emerald-400 to-emerald-500',
      'Physics': 'from-purple-400 to-purple-500',
      'Writing': 'from-pink-400 to-pink-500',
      'Technology': 'from-indigo-400 to-indigo-500',
      default: 'from-brand-400 to-brand-500'
    };
    return colors[category] || colors.default;
  };

  return (
    <div className="break-inside-avoid bg-white/90 backdrop-blur-sm rounded-pinterest-lg shadow-pinterest hover:shadow-pinterest-hover transition-all duration-300 hover:scale-[1.02] border border-brand-200/30 group">
      
      {/* Post Image */}
      {post.imageUrl && (
        <div className="relative overflow-hidden rounded-t-pinterest-lg">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="object-cover w-full h-48 transition-transform duration-500 group-hover:scale-110"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${getCategoryColor(post.category)} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
          
          {/* Overlay Save Button */}
          <div className="absolute transition-opacity opacity-0 top-4 right-4 group-hover:opacity-100">
            <button 
              onClick={handleSave}
              disabled={loading}
              className={`p-2 transition-all bg-white/90 backdrop-blur-sm rounded-pinterest shadow-pinterest hover:scale-110 ${
                isSaved ? 'text-brand-500' : 'text-gray-600'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      )}

      {/* Post Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          {post.category && (
            <span className={`px-3 py-1 text-xs font-medium text-white rounded-pinterest bg-gradient-to-r ${getCategoryColor(post.category)}`}>
              {post.category}
            </span>
          )}
          <button className="p-1 transition-colors text-brand-500/50 hover:text-brand-500">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <h3 className="mb-2 text-lg font-semibold transition-colors text-brand-600 group-hover:text-brand-500">
          {post.title}
        </h3>
        
        {post.description && (
          <p className="mb-4 text-sm text-brand-500/70 line-clamp-2">
            {post.description}
          </p>
        )}

        {/* Author Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-brand-300 to-brand-400">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-brand-600">
              {post.authorName || 'Anonymous'}
            </span>
          </div>
          
          {/* Engagement Stats */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4 text-pinterest-red/60" />
              <span className="text-sm text-brand-500/70">{likesCount || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bookmark className="w-4 h-4 text-brand-500/60" />
              <span className="text-sm text-brand-500/70">{savesCount || 0}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-brand-200/30">
          <div className="flex items-center justify-between">
            <button 
              onClick={handleLike}
              disabled={loading}
              className={`flex items-center px-4 py-2 space-x-2 transition-colors rounded-pinterest ${
                isLiked 
                  ? 'text-pinterest-red bg-pinterest-red/10' 
                  : 'text-brand-500 hover:bg-brand-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">
                {isLiked ? 'Liked' : 'Like'}
              </span>
            </button>
            
            <button className="flex items-center px-4 py-2 space-x-2 transition-colors text-brand-500 hover:bg-brand-50 rounded-pinterest">
              <Share className="w-4 h-4" />
              <span className="text-sm font-medium">Share</span>
            </button>
            
            <button 
              onClick={handleSave}
              disabled={loading}
              className={`flex items-center px-4 py-2 space-x-2 transition-colors rounded-pinterest ${
                isSaved 
                  ? 'text-brand-500 bg-brand-50' 
                  : 'text-brand-500 hover:bg-brand-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">
                {isSaved ? 'Saved' : 'Save'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
