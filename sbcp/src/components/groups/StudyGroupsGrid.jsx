// Updated StudyGroupsGrid.jsx - Using Navigation Component
import React, { useState, useEffect } from 'react';
import { Users, BookOpen } from 'lucide-react';
import StudyGroupCard from './StudyGroupCard';
import CreateGroupModal from './CreateGroupModal';
import Navigation from '../common/Navigation';
import { apiService } from '../../services/apiService';
import { authService } from '../../services/authService';

const StudyGroupsGrid = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'my-groups'

  const currentUser = authService.getCurrentUser();

  const subjects = [
    { name: 'All', count: 0 },
    { name: 'Computer Science', count: 0 },
    { name: 'Mathematics', count: 0 },
    { name: 'Biology', count: 0 },
    { name: 'Physics', count: 0 },
    { name: 'Chemistry', count: 0 },
    { name: 'Literature', count: 0 }
  ];

  // Load groups
  const loadGroups = async () => {
    setLoading(true);
    try {
      let groupsData;
      
      if (activeTab === 'my-groups') {
        groupsData = await apiService.groups.getUserGroups();
      } else if (searchQuery) {
        groupsData = await apiService.groups.search(searchQuery);
      } else if (selectedSubject !== 'All') {
        groupsData = await apiService.groups.getBySubject(selectedSubject);
      } else {
        groupsData = await apiService.groups.getAll();
      }
      
      setGroups(groupsData);
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, [selectedSubject, searchQuery, activeTab]);

  const handleGroupCreated = (newGroup) => {
    setGroups(prev => [newGroup, ...prev]);
  };

  const handleGroupUpdate = (updatedGroup) => {
    setGroups(prev => prev.map(group => 
      group.id === updatedGroup.id ? updatedGroup : group
    ));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setActiveTab('all'); // Switch to all groups when searching
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-brand-100 to-brand-200">
      
      {/* Navigation */}
      <Navigation 
        onCreatePost={() => setIsCreateModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />

      {/* Content */}
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-brand-600">Study Groups</h1>
          <p className="text-brand-500/70">Join study groups and collaborate with peers</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 rounded-pinterest-lg font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-brand-400 to-brand-500 text-white shadow-pinterest'
                  : 'bg-white/80 text-brand-600 hover:bg-white hover:shadow-pinterest border border-brand-200/30'
              }`}
            >
              All Groups
            </button>
            <button
              onClick={() => setActiveTab('my-groups')}
              className={`px-6 py-3 rounded-pinterest-lg font-medium transition-all ${
                activeTab === 'my-groups'
                  ? 'bg-gradient-to-r from-brand-400 to-brand-500 text-white shadow-pinterest'
                  : 'bg-white/80 text-brand-600 hover:bg-white hover:shadow-pinterest border border-brand-200/30'
              }`}
            >
              My Groups
            </button>
          </div>
        </div>

        {/* Create Group Button - Mobile Friendly */}
        <div className="mb-8 md:hidden">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center w-full px-6 py-3 space-x-2 text-white transition-all bg-gradient-to-r from-brand-400 to-brand-500 rounded-pinterest shadow-pinterest hover:shadow-pinterest-hover"
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">Create Study Group</span>
          </button>
        </div>

        {/* Desktop Create Group Button */}
        <div className="hidden mb-8 md:flex md:justify-end">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center px-6 py-3 space-x-2 text-white transition-all bg-gradient-to-r from-brand-400 to-brand-500 rounded-pinterest shadow-pinterest hover:shadow-pinterest-hover hover:scale-105"
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">Create Study Group</span>
          </button>
        </div>

        {/* Subject Filters - Only show for "All Groups" tab and no search */}
        {activeTab === 'all' && !searchQuery && (
          <div className="mb-8">
            <div className="flex items-center pb-4 space-x-4 overflow-x-auto">
              {subjects.map((subject, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSubject(subject.name)}
                  className={`flex-shrink-0 px-6 py-3 rounded-pinterest-lg font-medium transition-all ${
                    selectedSubject === subject.name
                      ? 'bg-gradient-to-r from-brand-400 to-brand-500 text-white shadow-pinterest'
                      : 'bg-white/80 text-brand-600 hover:bg-white hover:shadow-pinterest border border-brand-200/30'
                  }`}
                >
                  {subject.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results Header */}
        {searchQuery && (
          <div className="mb-8 text-center">
            <p className="text-brand-600">
              Showing groups for: <span className="font-semibold">"{searchQuery}"</span>
            </p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-2 text-sm underline text-brand-500 hover:text-brand-600"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Current Tab Indicator */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-brand-600">
            {activeTab === 'my-groups' ? 'My Study Groups' : 
             searchQuery ? `Search Results` :
             selectedSubject !== 'All' ? `${selectedSubject} Groups` : 'All Study Groups'}
          </h2>
          {groups.length > 0 && (
            <p className="mt-1 text-sm text-brand-500/70">
              {groups.length} group{groups.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 rounded-full border-brand-200 border-t-brand-500 animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Groups Grid */}
            {groups.length > 0 ? (
              <div className="gap-6 space-y-6 columns-1 sm:columns-2 lg:columns-3 xl:columns-4">
                {groups.map((group) => (
                  <StudyGroupCard 
                    key={group.id} 
                    group={group} 
                    onUpdate={handleGroupUpdate}
                    currentUser={currentUser}
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-brand-100">
                    <Users className="w-8 h-8 text-brand-500" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-brand-600">
                    {activeTab === 'my-groups' ? 'No groups joined yet' : 
                     searchQuery ? 'No groups found' : 'No groups available'}
                  </h3>
                  <p className="mb-4 text-brand-500/70">
                    {activeTab === 'my-groups' 
                      ? 'Join some study groups to see them here!'
                      : searchQuery 
                        ? `No groups match "${searchQuery}". Try a different search term.`
                        : 'Be the first to create a study group in this category!'
                    }
                  </p>
                  
                  {/* Call to Action */}
                  {activeTab === 'my-groups' ? (
                    <button 
                      onClick={() => setActiveTab('all')}
                      className="px-6 py-3 font-medium text-white transition-all bg-gradient-to-r from-brand-400 to-brand-500 rounded-pinterest shadow-pinterest hover:shadow-pinterest-hover"
                    >
                      Browse All Groups
                    </button>
                  ) : (
                    <button 
                      onClick={() => setIsCreateModalOpen(true)}
                      className="px-6 py-3 font-medium text-white transition-all bg-gradient-to-r from-brand-400 to-brand-500 rounded-pinterest shadow-pinterest hover:shadow-pinterest-hover"
                    >
                      Create Study Group
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Quick Stats - Show only when there are groups */}
        {groups.length > 0 && (
          <div className="p-6 mt-12 border bg-white/80 rounded-pinterest-lg shadow-pinterest border-brand-200/30">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-600">{groups.length}</div>
                <div className="text-sm text-brand-500/70">
                  {activeTab === 'my-groups' ? 'Groups Joined' : 'Total Groups'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-600">
                  {groups.reduce((sum, group) => sum + group.currentMembers, 0)}
                </div>
                <div className="text-sm text-brand-500/70">Total Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-600">
                  {new Set(groups.map(group => group.subject)).size}
                </div>
                <div className="text-sm text-brand-500/70">Subjects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-600">
                  {groups.filter(group => group.isCurrentUserMember).length}
                </div>
                <div className="text-sm text-brand-500/70">Your Groups</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onGroupCreated={handleGroupCreated}
      />
    </div>
  );
};

export default StudyGroupsGrid;