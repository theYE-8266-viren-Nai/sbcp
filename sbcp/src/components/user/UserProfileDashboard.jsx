import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  Edit, 
  MapPin, 
  GraduationCap, 
  Calendar,
  Globe,
  Phone,
  Mail,
  Eye,
  Heart,
  Users,
  BookOpen,
  Camera
} from 'lucide-react';
import Button from '../ui/Button';
import PhotoUploadComponent from './PhotoUploadComponent';
import api from '../../services/api';

const UserProfileDashboard = ({ userId, isCurrentUser = false }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Helper function to get correct image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    return imageUrl.startsWith('http') ? imageUrl : `http://localhost:8080${imageUrl}`;
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [userResponse, statsResponse] = await Promise.all([
        isCurrentUser 
          ? api.get('/users/profile')
          : api.get(`/users/${userId}`),
        isCurrentUser 
          ? api.get('/users/profile/stats')
          : api.get(`/users/${userId}/stats`)
      ]);

      console.log('User Response:', userResponse.data);
      console.log('Stats Response:', statsResponse.data);

      if (!userResponse.data || !userResponse.data.id) {
        throw new Error('Invalid user data received');
      }

      setUser(userResponse.data);
      setStats(statsResponse.data);

      // Only increment profile views for OTHER users (not current user)
      if (!isCurrentUser && userId) {
        const viewedKey = `viewed_user_${userId}`;
        const hasViewed = sessionStorage.getItem(viewedKey);
        
        if (!hasViewed) {
          console.log('👁️ Incrementing profile view for user:', userId);
          sessionStorage.setItem(viewedKey, 'true');
          
          try {
            await api.post(`/users/${userId}/view`);
            setStats(prev => prev ? {
              ...prev,
              profileViews: (prev.profileViews || 0) + 1
            } : prev);
          } catch (viewError) {
            console.error('Failed to increment profile view:', viewError);
            sessionStorage.removeItem(viewedKey);
          }
        }
      }
    } catch (err) {
      setError(`Failed to load profile data: ${err.message || 'Unknown error'}`);
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  const handleSettings = () => {
    navigate('/profile/settings');
  };

  const handleAvatarUpdate = (newAvatarUrl) => {
    setUser(prev => ({
      ...prev,
      avatarUrl: newAvatarUrl
    }));
  };

  const handleCoverPhotoUpdate = (newCoverPhotoUrl) => {
    setUser(prev => ({
      ...prev,
      coverPhotoUrl: newCoverPhotoUrl
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 rounded-full border-brand-200 border-t-brand-500 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="p-4 mb-4 border bg-pinterest-red/10 border-pinterest-red/20 rounded-pinterest">
          <p className="text-pinterest-red">{error}</p>
          <button
            onClick={fetchUserData}
            className="mt-2 text-blue-500 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">No user data available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl p-6 mx-auto space-y-6">
      {/* Cover Photo & Avatar Section */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-brand-400 to-brand-600 rounded-pinterest-lg">
          {user.coverPhotoUrl ? (
            <img 
              src={getImageUrl(user.coverPhotoUrl)}
              alt="Cover" 
              className="object-cover w-full h-full"
              onError={(e) => {
                console.error('Cover photo load error:', e);
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-400 to-brand-600"></div>
          )}
          
          {/* Cover Photo Upload Button */}
          {isCurrentUser && (
            <div className="absolute top-4 right-4">
              <PhotoUploadComponent
                currentPhotoUrl={user.coverPhotoUrl}
                uploadType="cover"
                onPhotoUpdate={handleCoverPhotoUpdate}
                buttonClassName="p-3 bg-white/80 backdrop-blur rounded-pinterest hover:bg-white/90 text-brand-600"
                showDeleteOption={true}
              />
            </div>
          )}
        </div>

        {/* Profile Info Card */}
        <div className="relative mx-6 -mt-16">
          <div className="p-6 border bg-white/90 backdrop-blur-xl rounded-pinterest-lg shadow-pinterest-lg border-brand-200/30">
            <div className="flex flex-col items-start space-y-4 md:flex-row md:items-end md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 overflow-hidden rounded-pinterest shadow-pinterest bg-brand-100">
                  {user.avatarUrl ? (
                    <img 
                      src={getImageUrl(user.avatarUrl)}
                      alt={`${user.firstName || ''} ${user.lastName || ''}`}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        console.error('Avatar load error:', e);
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-brand-400 to-brand-500">
                      <User className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>
                
                {/* Avatar Upload Button */}
                {isCurrentUser && (
                  <div className="absolute -bottom-2 -right-2">
                    <PhotoUploadComponent
                      currentPhotoUrl={user.avatarUrl}
                      uploadType="avatar"
                      onPhotoUpdate={handleAvatarUpdate}
                      buttonClassName="p-2 bg-brand-500 text-white rounded-pinterest hover:bg-brand-600 shadow-pinterest"
                      showDeleteOption={true}
                    />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="mb-2 text-3xl font-bold text-brand-600">
                      {user.firstName || 'Unknown'} {user.lastName || 'User'}
                    </h1>
                    <div className="flex items-center mb-3 space-x-4 text-brand-500/70">
                      {user.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{user.location}</span>
                        </div>
                      )}
                      {user.university && (
                        <div className="flex items-center space-x-1">
                          <GraduationCap className="w-4 h-4" />
                          <span className="text-sm">{user.university}</span>
                        </div>
                      )}
                    </div>
                    {user.bio && (
                      <p className="max-w-md text-brand-500">{user.bio}</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex mt-4 space-x-3 md:mt-0">
                    {isCurrentUser ? (
                      <>
                        <Button 
                          onClick={handleEditProfile}
                          className="flex items-center space-x-2"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit Profile</span>
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={handleSettings}
                          className="flex items-center space-x-2"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>Connect</span>
                        </Button>
                        <Button variant="outline">
                          <Mail className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Stats Cards */}
        <div className="space-y-6 lg:col-span-2">
          {/* Statistics */}
          <div className="p-6 border bg-white/90 backdrop-blur-xl rounded-pinterest-lg shadow-pinterest-lg border-brand-200/30">
            <h2 className="flex items-center mb-4 text-xl font-semibold text-brand-600">
              <BookOpen className="w-5 h-5 mr-2" />
              Activity Statistics
            </h2>
            
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="p-4 text-center bg-brand-50 rounded-pinterest">
                <div className="text-2xl font-bold text-brand-600">{stats?.totalPosts || 0}</div>
                <div className="text-sm text-brand-500/70">Posts</div>
              </div>
              <div className="p-4 text-center bg-brand-50 rounded-pinterest">
                <div className="text-2xl font-bold text-brand-600">{stats?.totalStudyGroups || 0}</div>
                <div className="text-sm text-brand-500/70">Study Groups</div>
              </div>
              <div className="p-4 text-center bg-brand-50 rounded-pinterest">
                <div className="text-2xl font-bold text-brand-600">{stats?.totalConnections || 0}</div>
                <div className="text-sm text-brand-500/70">Connections</div>
              </div>
              <div className="p-4 text-center bg-brand-50 rounded-pinterest">
                <div className="text-2xl font-bold text-brand-600">{stats?.profileViews || 0}</div>
                <div className="text-sm text-brand-500/70">Profile Views</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-6 border bg-white/90 backdrop-blur-xl rounded-pinterest-lg shadow-pinterest-lg border-brand-200/30">
            <h2 className="mb-4 text-xl font-semibold text-brand-600">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center p-3 space-x-3 bg-brand-50 rounded-pinterest">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-500">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-brand-600">Joined a new study group</p>
                  <p className="text-xs text-brand-500/70">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center p-3 space-x-3 bg-brand-50 rounded-pinterest">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-500">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-brand-600">Created a new post</p>
                  <p className="text-xs text-brand-500/70">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="p-6 border bg-white/90 backdrop-blur-xl rounded-pinterest-lg shadow-pinterest-lg border-brand-200/30">
            <h3 className="mb-4 text-lg font-semibold text-brand-600">About</h3>
            <div className="space-y-3">
              {user.major && (
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-4 h-4 text-brand-500" />
                  <span className="text-sm text-brand-600">{user.major}</span>
                </div>
              )}
              {user.graduationYear && (
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-brand-500" />
                  <span className="text-sm text-brand-600">Class of {user.graduationYear}</span>
                </div>
              )}
              {user.email && (isCurrentUser || user.isProfilePublic) && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-brand-500" />
                  <span className="text-sm text-brand-600">{user.email}</span>
                </div>
              )}
              {user.phoneNumber && (isCurrentUser || user.isProfilePublic) && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-brand-500" />
                  <span className="text-sm text-brand-600">{user.phoneNumber}</span>
                </div>
              )}
              {user.website && (
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-brand-500" />
                  <a 
                    href={user.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm underline text-brand-600 hover:text-brand-500"
                  >
                    {user.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Member Since */}
          <div className="p-6 border bg-white/90 backdrop-blur-xl rounded-pinterest-lg shadow-pinterest-lg border-brand-200/30">
            <h3 className="mb-4 text-lg font-semibold text-brand-600">Member Since</h3>
            <div className="text-center">
              <div className="mb-1 text-2xl font-bold text-brand-600">
                {stats?.memberSince ? new Date(stats.memberSince).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                }) : 'Recently'}
              </div>
              <div className="text-sm text-brand-500/70">
                {stats?.loginStreak || 0} total logins
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileDashboard;