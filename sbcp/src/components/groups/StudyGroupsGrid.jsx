import React, { useState, useEffect } from 'react';
import { Search, Plus, Users, BookOpen } from 'lucide-react';
import StudyGroupCard from './StudyGroupCard';
import CreateGroupModal from './CreateGroupModal';
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

  const handleSearch = (e) => {
    e.preventDefault();
    loadGroups();
  };

  const handleGroupCreated = (newGroup) => {
    setGroups(prev => [newGroup, ...prev]);
  };

  const handleGroupUpdate = (updatedGroup) => {
    setGroups(prev => prev.map(group => 
      group.id === updatedGroup.id ? updatedGroup : group
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-brand-100 to-brand-200">
      
      {/* Header */}
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-brand-600">Study Groups</h1>
            <p className="text-brand-500/70">Join study groups and collaborate with peers</p>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center px-6 py-3 space-x-2 text-white transition-all bg-gradient-to-r from-brand-400 to-brand-500 rounded-pinterest shadow-pinterest hover:shadow-pinterest-hover hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Create Group</span>
          </button>
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

        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-4 top-1/2 text-brand-500/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for study groups by name, subject, or description..."
                className="w-full py-4 pl-12 pr-4 transition-all border bg-white/80 border-brand-200 rounded-pinterest-lg text-brand-600 placeholder-brand-500/50 focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
              />
            </div>
          </form>
        </div>

        {/* Subject Filters - Only show for "All Groups" tab */}
        {activeTab === 'all' && (
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
                    {activeTab === 'my-groups' ? 'No groups joined yet' : 'No groups found'}
                  </h3>
                  <p className="text-brand-500/70">
                    {activeTab === 'my-groups' 
                      ? 'Join some study groups to see them here!'
                      : searchQuery 
                        ? `No groups match "${searchQuery}". Try a different search term.`
                        : 'Be the first to create a study group in this category!'
                    }
                  </p>
                </div>
              </div>
            )}
          </>
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