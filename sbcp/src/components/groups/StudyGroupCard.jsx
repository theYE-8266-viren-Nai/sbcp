import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Lock, 
  Globe, 
  UserPlus, 
  UserMinus,
  Crown,
  MoreHorizontal,
  Settings
} from 'lucide-react';
import { apiService } from '../../services/apiService';

const StudyGroupCard = ({ group, onUpdate, currentUser }) => {
  const [isJoined, setIsJoined] = useState(group.isCurrentUserMember);
  const [currentMembers, setCurrentMembers] = useState(group.currentMembers);
  const [loading, setLoading] = useState(false);

  const handleJoinLeave = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      let updatedGroup;
      if (isJoined) {
        updatedGroup = await apiService.groups.leave(group.id);
      } else {
        updatedGroup = await apiService.groups.join(group.id);
      }
      
      setIsJoined(updatedGroup.isCurrentUserMember);
      setCurrentMembers(updatedGroup.currentMembers);
      onUpdate && onUpdate(updatedGroup);
    } catch (error) {
      console.error('Error joining/leaving group:', error);
      alert('Failed to update group membership. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSubjectColor = (subject) => {
    const colors = {
      'Computer Science': 'from-blue-400 to-blue-500',
      'Mathematics': 'from-purple-400 to-purple-500',
      'Biology': 'from-green-400 to-green-500',
      'Physics': 'from-indigo-400 to-indigo-500',
      'Chemistry': 'from-red-400 to-red-500',
      'Literature': 'from-pink-400 to-pink-500',
      'History': 'from-yellow-400 to-yellow-500',
      default: 'from-brand-400 to-brand-500'
    };
    return colors[subject] || colors.default;
  };

  const canJoin = currentMembers < group.maxMembers && !isJoined;
  const isFull = currentMembers >= group.maxMembers;

  return (
    <div className="break-inside-avoid bg-white/90 backdrop-blur-sm rounded-pinterest-lg shadow-pinterest hover:shadow-pinterest-hover transition-all duration-300 hover:scale-[1.02] border border-brand-200/30 group">
      
      {/* Group Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {group.groupImageUrl ? (
              <img 
                src={group.groupImageUrl} 
                alt={group.name}
                className="object-cover w-12 h-12 rounded-full"
              />
            ) : (
              <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${getSubjectColor(group.subject)}`}>
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-brand-600 group-hover:text-brand-500">
                  {group.name}
                </h3>
                {group.isPrivate ? (
                  <Lock className="w-4 h-4 text-gray-500" />
                ) : (
                  <Globe className="w-4 h-4 text-green-500" />
                )}
              </div>
              <span className={`px-2 py-1 text-xs font-medium text-white rounded-pinterest bg-gradient-to-r ${getSubjectColor(group.subject)}`}>
                {group.subject}
              </span>
            </div>
          </div>
          
          <button className="p-1 transition-colors text-brand-500/50 hover:text-brand-500">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        {group.description && (
          <p className="mb-4 text-sm text-brand-500/70 line-clamp-2">
            {group.description}
          </p>
        )}

        {/* Group Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-brand-500/60" />
            <span className="text-sm text-brand-600">
              {currentMembers}/{group.maxMembers} members
            </span>
          </div>
          {group.meetingSchedule && (
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-brand-500/60" />
              <span className="text-sm truncate text-brand-600">
                {group.meetingSchedule}
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full h-2 rounded-full bg-brand-100">
            <div 
              className={`h-2 rounded-full bg-gradient-to-r ${getSubjectColor(group.subject)} transition-all duration-300`}
              style={{ width: `${(currentMembers / group.maxMembers) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-brand-500/60">
            <span>{currentMembers} joined</span>
            <span>{group.maxMembers - currentMembers} spots left</span>
          </div>
        </div>

        {/* Creator Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500">
              <Crown className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-medium text-brand-600">
              {group.creatorName || 'Group Admin'}
            </span>
          </div>
          {group.isCurrentUserCreator && (
            <button className="p-1 transition-colors text-brand-500/60 hover:text-brand-500">
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {group.isCurrentUserCreator ? (
            <button className="w-full px-4 py-2 font-medium text-white transition-all bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-pinterest shadow-pinterest hover:shadow-pinterest-hover">
              Manage Group
            </button>
          ) : (
            <>
              {isJoined ? (
                <button 
                  onClick={handleJoinLeave}
                  disabled={loading}
                  className="w-full px-4 py-2 font-medium transition-colors border text-brand-600 border-brand-300 rounded-pinterest hover:bg-brand-50 disabled:opacity-50"
                >
                  {loading ? 'Leaving...' : 'Leave Group'}
                </button>
              ) : (
                <button 
                  onClick={handleJoinLeave}
                  disabled={loading || !canJoin}
                  className={`w-full px-4 py-2 font-medium transition-all rounded-pinterest ${
                    canJoin 
                      ? 'text-white bg-gradient-to-r from-brand-400 to-brand-500 shadow-pinterest hover:shadow-pinterest-hover'
                      : 'text-brand-400 bg-brand-100 cursor-not-allowed'
                  }`}
                >
                  {loading ? 'Joining...' : isFull ? 'Group Full' : 'Join Group'}
                </button>
              )}
            </>
          )}
          
          {isJoined && (
            <button className="w-full px-4 py-2 text-sm font-medium transition-colors border text-brand-500 border-brand-200 rounded-pinterest hover:bg-brand-50">
              View Members
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyGroupCard;
