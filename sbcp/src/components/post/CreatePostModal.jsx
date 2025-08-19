import React, { useState } from 'react';
import { X, Image, BookOpen, Tag } from 'lucide-react';
import { apiService } from '../../services/apiService';

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    tags: '',
    imageUrl: '',
    isPublic: true
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    'Mathematics', 'Programming', 'Biology', 'Physics', 
    'Writing', 'Technology', 'Chemistry', 'History', 'Literature'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const newPost = await apiService.posts.create(formData);
      onPostCreated && onPostCreated(newPost);
      onClose();
      setFormData({
        title: '',
        description: '',
        content: '',
        category: '',
        tags: '',
        imageUrl: '',
        isPublic: true
      });
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-pinterest-lg shadow-pinterest-lg border border-brand-200/30 m-4">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-200/30">
          <h2 className="text-2xl font-bold text-brand-600">Create New Post</h2>
          <button 
            onClick={onClose}
            className="p-2 transition-colors text-brand-500 hover:bg-brand-100 rounded-pinterest"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Title */}
          <div>
            <label className="block mb-2 text-sm font-medium text-brand-600">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-brand-200 rounded-pinterest-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
              placeholder="Enter post title..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-sm font-medium text-brand-600">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-3 border border-brand-200 rounded-pinterest-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
              placeholder="Brief description of your post..."
            />
          </div>

          {/* Content */}
          <div>
            <label className="block mb-2 text-sm font-medium text-brand-600">
              Content *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 border border-brand-200 rounded-pinterest-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
              placeholder="Write your full content here..."
            />
          </div>

          {/* Category and Tags Row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            
            {/* Category */}
            <div>
              <label className="block mb-2 text-sm font-medium text-brand-600">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-brand-200 rounded-pinterest-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
              >
                <option value="">Select category...</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block mb-2 text-sm font-medium text-brand-600">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-brand-200 rounded-pinterest-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
                placeholder="e.g., react,javascript,tutorial"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block mb-2 text-sm font-medium text-brand-600">
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-brand-200 rounded-pinterest-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Public/Private Toggle */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="isPublic"
              id="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
              className="w-4 h-4 rounded text-brand-500 border-brand-300 focus:ring-brand-400"
            />
            <label htmlFor="isPublic" className="text-sm font-medium text-brand-600">
              Make this post public
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end pt-6 space-x-4 border-t border-brand-200/30">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 font-medium transition-colors border text-brand-600 border-brand-300 rounded-pinterest-lg hover:bg-brand-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title || !formData.content}
              className="px-6 py-3 font-medium text-white transition-all bg-gradient-to-r from-brand-400 to-brand-500 rounded-pinterest-lg hover:shadow-pinterest disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;