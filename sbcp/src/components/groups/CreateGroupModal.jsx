import React, { useState } from 'react';
import { X, Users, BookOpen, Calendar, Lock, Globe } from 'lucide-react';
import { apiService } from '../../services/apiService';

const CreateGroupModal = ({ isOpen, onClose, onGroupCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subject: '',
    maxMembers: 20,
    isPrivate: false,
    meetingSchedule: '',
    groupImageUrl: ''
  });
  const [loading, setLoading] = useState(false);

  const subjects = [
    'Computer Science', 'Mathematics', 'Biology', 'Physics', 
    'Chemistry', 'Literature', 'History', 'Psychology', 
    'Economics', 'Engineering', 'Art', 'Music'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const newGroup = await apiService.groups.create(formData);
      onGroupCreated && onGroupCreated(newGroup);
      onClose();
      setFormData({
        name: '',
        description: '',
        subject: '',
        maxMembers: 20,
        isPrivate: false,
        meetingSchedule: '',
        groupImageUrl: ''
      });
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group. Please try again.');
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
          <h2 className="text-2xl font-bold text-brand-600">Create Study Group</h2>
          <button 
            onClick={onClose}
            className="p-2 transition-colors text-brand-500 hover:bg-brand-100 rounded-pinterest"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Group Name */}
          <div>
            <label className="block mb-2 text-sm font-medium text-brand-600">
              Group Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-brand-200 rounded-pinterest-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
              placeholder="e.g., Advanced Calculus Study Group"
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
              rows={3}
              className="w-full px-4 py-3 border border-brand-200 rounded-pinterest-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
              placeholder="Describe what your study group is about..."
            />
          </div>

          {/* Subject and Max Members Row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            
            {/* Subject */}
            <div>
              <label className="block mb-2 text-sm font-medium text-brand-600">
                Subject *
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-brand-200 rounded-pinterest-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
              >
                <option value="">Select subject...</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {/* Max Members */}
            <div>
              <label className="block mb-2 text-sm font-medium text-brand-600">
                Max Members
              </label>
              <input
                type="number"
                name="maxMembers"
                value={formData.maxMembers}
                onChange={handleChange}
                min="2"
                max="100"
                className="w-full px-4 py-3 border border-brand-200 rounded-pinterest-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
              />
            </div>
          </div>

          {/* Meeting Schedule */}
          <div>
            <label className="block mb-2 text-sm font-medium text-brand-600">
              Meeting Schedule
            </label>
            <input
              type="text"
              name="meetingSchedule"
              value={formData.meetingSchedule}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-brand-200 rounded-pinterest-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
              placeholder="e.g., Every Tuesday 7PM, Weekends, Flexible"
            />
          </div>

          {/* Group Image URL */}
          <div>
            <label className="block mb-2 text-sm font-medium text-brand-600">
              Group Image URL
            </label>
            <input
              type="url"
              name="groupImageUrl"
              value={formData.groupImageUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-brand-200 rounded-pinterest-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
              placeholder="https://example.com/group-image.jpg"
            />
          </div>

          {/* Privacy Toggle */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="isPrivate"
              id="isPrivate"
              checked={formData.isPrivate}
              onChange={handleChange}
              className="w-4 h-4 text-brand-500 border-brand-300 rounded focus:ring-brand-400"
            />
            <label htmlFor="isPrivate" className="flex items-center space-x-2 text-sm font-medium text-brand-600">
              {formData.isPrivate ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Private group (invite only)</span>
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4" />
                  <span>Public group (anyone can join)</span>
                </>
              )}
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
              disabled={loading || !formData.name || !formData.subject}
              className="px-6 py-3 font-medium text-white transition-all bg-gradient-to-r from-brand-400 to-brand-500 rounded-pinterest-lg hover:shadow-pinterest disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;