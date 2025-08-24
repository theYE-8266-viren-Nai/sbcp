import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  ArrowLeft,
  MapPin, 
  GraduationCap, 
  Calendar,
  Globe,
  Phone,
  Mail,
  Users,
  BookOpen,
  MessageCircle,
  Shield,
  Flag,
  Eye,
  Heart,
  Clock,
  Award
} from 'lucide-react';
import Button from '../ui/Button';
import api from '../../services/api';

const OtherUserProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserData();
      recordProfileView();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [userResponse, statsResponse] = await Promise.all([
        api.get(`/users/${userId}`),
        api.get(`/users/${userId}/stats`)
      ]);
      
      setUser(userResponse.data);
      setStats(statsResponse.data);
    } catch (err) {
      setError('Failed to load user profile');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const recordProfileView = async () => {
    try {
      // Only record view once per session
      const viewedKey = `viewed_user_${userId}`;
      const hasViewed = sessionStorage.getItem(viewedKey);
      
      if (!hasViewed) {
        await api.post(`/users/${userId}/view`);
        sessionStorage.setItem(viewedKey, 'true');
      }
    } catch (error) {
      console.error('Failed to record profile view:', error);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // TODO: Implement connection logic when backend is ready
      console.log('Connecting to user:', userId);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Connection request sent!');
    } catch (error) {
      console.error('Connection error:', error);
      alert('Failed to send connection request');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSendMessage = () => {
    // TODO: Implement messaging when backend is ready
    alert('Messaging feature coming soon!');
  };

  const handleReport = () => {
    if (window.confirm('Are you sure you want to report this user?')) {
      // TODO: Implement report functionality
      alert('User reported. Thank you for helping keep our community safe.');
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-brand-50 to-brand-100">
        <div className="w-8 h-8 border-4 rounded-full border-brand-200 border-t-brand-500 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-brand-50 to-brand-100">
        <div className="w-full max-w-md p-8">
          <div className="p-6 text-center border bg-white/90 backdrop-blur-xl rounded-pinterest-lg shadow-pinterest-lg border-brand-200/30">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-pinterest-red/10 rounded-pinterest">
              <User className="w-8 h-8 text-pinterest-red" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-brand-600">Profile Not Found</h3>
            <p className="mb-6 text-brand-500/70">{error}</p>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Check if user profile is private and handle accordingly
  if (!user?.isProfilePublic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100">
        <div className="max-w-4xl p-6 mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center mb-6 space-x-2 transition-colors text-brand-500 hover:text-brand-600"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <div className="p-8 text-center border bg-white/90 backdrop-blur-xl rounded-pinterest-lg shadow-pinterest-lg border-brand-200/30">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-brand-100 rounded-pinterest">
              <Shield className="w-10 h-10 text-brand-500" />
            </div>
            <h2 className="mb-4 text-2xl font-bold text-brand-600">Private Profile</h2>
            <p className="mb-6 text-brand-500/70">This user has set their profile to private.</p>
            <div className="space-x-4">
              <Button onClick={handleConnect} loading={isConnecting}>
                <Users className="w-4 h-4 mr-2" />
                Send Connection Request
              </Button>
              <Button variant="outline" onClick={handleBack}>
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100">
      <div className="max-w-6xl p-6 mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 transition-colors text-brand-500 hover:text-brand-600"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Search</span>
        </button>

        {/* Cover Photo & Avatar Section */}
        <div className="relative">
          {/* Cover Photo */}
          <div className="relative h-64 overflow-hidden bg-gradient-to-br from-brand-400 to-brand-600 rounded-pinterest-lg">
            {user.coverPhotoUrl ? (
              <img 
                src={user.coverPhotoUrl} 
                alt="Cover" 
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-brand-400 to-brand-600"></div>
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
                        src={user.avatarUrl} 
                        alt={`${user.firstName} ${user.lastName}`}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-brand-400 to-brand-500">
                        <User className="w-16 h-16 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h1 className="mb-2 text-3xl font-bold text-brand-600">
                        {user.firstName} {user.lastName}
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
                        {stats?.memberSince && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">
                              Member since {new Date(stats.memberSince).getFullYear()}
                            </span>
                          </div>
                        )}
                      </div>
                      {user.bio && (
                        <p className="max-w-md text-brand-500">{user.bio}</p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                      <Button 
                        onClick={handleConnect}
                        loading={isConnecting}
                        className="flex items-center space-x-2"
                      >
                        <Users className="w-4 h-4" />
                        <span>Connect</span>
                      </Button>
                      
                      {user.allowMessagesFromStrangers && (
                        <Button 
                          variant="outline"
                          onClick={handleSendMessage}
                          className="flex items-center space-x-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Message</span>
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline"
                        onClick={handleReport}
                        className="flex items-center space-x-2 text-pinterest-red border-pinterest-red/30 hover:bg-pinterest-red/10"
                      >
                        <Flag className="w-4 h-4" />
                        <span>Report</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Statistics */}
            <div className="p-6 border bg-white/90 backdrop-blur-xl rounded-pinterest-lg shadow-pinterest-lg border-brand-200/30">
              <h2 className="flex items-center mb-4 text-xl font-semibold text-brand-600">
                <Award className="w-5 h-5 mr-2" />
                Profile Statistics
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
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-brand-600">Joined the platform</p>
                    <p className="text-xs text-brand-500/70">
                      {stats?.memberSince ? new Date(stats.memberSince).toLocaleDateString() : 'Recently'}
                    </p>
                  </div>
                </div>
                
                {stats?.lastActive && (
                  <div className="flex items-center p-3 space-x-3 bg-brand-50 rounded-pinterest">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-brand-600">Last active</p>
                      <p className="text-xs text-brand-500/70">
                        {new Date(stats.lastActive).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* About Information */}
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
                
                {user.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4 text-brand-500" />
                    <a 
                      href={user.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm underline break-all text-brand-600 hover:text-brand-500"
                    >
                      {user.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Connection Actions */}
            <div className="p-6 border bg-white/90 backdrop-blur-xl rounded-pinterest-lg shadow-pinterest-lg border-brand-200/30">
              <h3 className="mb-4 text-lg font-semibold text-brand-600">Connect</h3>
              <div className="space-y-3">
                <Button 
                  onClick={handleConnect}
                  loading={isConnecting}
                  className="flex items-center justify-center w-full space-x-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Send Connection Request</span>
                </Button>
                
                {user.allowMessagesFromStrangers && (
                  <Button 
                    variant="outline"
                    onClick={handleSendMessage}
                    className="flex items-center justify-center w-full space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Message</span>
                  </Button>
                )}
              </div>
              
              <div className="pt-4 mt-4 border-t border-brand-200/30">
                <button
                  onClick={handleReport}
                  className="w-full py-2 text-sm transition-colors text-pinterest-red hover:bg-pinterest-red/10 rounded-pinterest"
                >
                  <Flag className="inline w-4 h-4 mr-2" />
                  Report User
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfilePage;