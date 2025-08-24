import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Users, 
  MapPin, 
  GraduationCap,
  Calendar,
  User,
  Mail,
  X,
  Eye,
  ArrowLeft
} from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import api from '../../services/api';

const UserCard = ({ user, onConnect }) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/users/${user.id}`);
  };

  return (
    <div className="p-6 transition-shadow border bg-white/90 backdrop-blur-xl rounded-pinterest-lg shadow-pinterest border-brand-200/30 hover:shadow-pinterest-lg">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <button 
          onClick={handleViewProfile}
          className="flex-shrink-0 w-16 h-16 overflow-hidden transition-opacity rounded-pinterest bg-brand-100 hover:opacity-80"
        >
          {user.avatarUrl ? (
            <img 
              src={user.avatarUrl} 
              alt={`${user.firstName} ${user.lastName}`}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-brand-400 to-brand-500">
              <User className="w-8 h-8 text-white" />
            </div>
          )}
        </button>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <button 
            onClick={handleViewProfile}
            className="w-full text-left transition-opacity hover:opacity-80"
          >
            <h3 className="mb-1 text-lg font-semibold text-brand-600 hover:text-brand-500">
              {user.firstName} {user.lastName}
            </h3>
          </button>
          
          {user.bio && (
            <p className="mb-3 text-sm text-brand-500 line-clamp-2">{user.bio}</p>
          )}
          
          <div className="space-y-1">
            {user.university && (
              <div className="flex items-center space-x-2 text-sm text-brand-500/70">
                <GraduationCap className="w-4 h-4" />
                <span>{user.university}</span>
                {user.major && <span> • {user.major}</span>}
              </div>
            )}
            
            {user.location && (
              <div className="flex items-center space-x-2 text-sm text-brand-500/70">
                <MapPin className="w-4 h-4" />
                <span>{user.location}</span>
              </div>
            )}
            
            {user.graduationYear && (
              <div className="flex items-center space-x-2 text-sm text-brand-500/70">
                <Calendar className="w-4 h-4" />
                <span>Class of {user.graduationYear}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-2">
          <Button 
            size="sm"
            onClick={handleViewProfile}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>View</span>
          </Button>
          <Button 
            size="sm"
            onClick={() => onConnect(user.id)}
            className="flex items-center space-x-2"
          >
            <Users className="w-4 h-4" />
            <span>Connect</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

const UserSearchPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    university: '',
    major: '',
    graduationYear: '',
    location: ''
  });
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() || Object.values(filters).some(v => v.trim())) {
      handleSearch();
    } else {
      setUsers([]);
      setPage(0);
    }
  }, [searchQuery, filters]);

  const fetchSuggestions = async () => {
    try {
      const response = await api.get('/users/suggestions?limit=6');
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSearch = async (isLoadMore = false) => {
    try {
      setLoading(true);
      const currentPage = isLoadMore ? page : 0;
      
      let endpoint = '';
      let params = new URLSearchParams({
        page: currentPage.toString(),
        size: '12'
      });

      // Determine which search to use
      const hasAdvancedFilters = Object.values(filters).some(v => v.trim());
      
      if (hasAdvancedFilters) {
        endpoint = '/users/search/advanced';
        Object.entries(filters).forEach(([key, value]) => {
          if (value.trim()) {
            params.append(key, value);
          }
        });
      } else if (searchQuery.trim()) {
        endpoint = '/users/search';
        params.append('q', searchQuery);
      } else {
        setUsers([]);
        return;
      }

      const response = await api.get(`${endpoint}?${params}`);
      const newUsers = response.data;

      if (isLoadMore) {
        setUsers(prev => [...prev, ...newUsers]);
      } else {
        setUsers(newUsers);
        setPage(0);
      }

      setHasMore(newUsers.length === 12);
      if (isLoadMore) {
        setPage(prev => prev + 1);
      }

    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(0);
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      university: '',
      major: '',
      graduationYear: '',
      location: ''
    });
    setSearchQuery('');
  };

  const handleConnect = async (userId) => {
    try {
      // TODO: Implement connection logic when backend is ready
      console.log('Connect with user:', userId);
    } catch (error) {
      console.error('Connect error:', error);
    }
  };

  const loadMore = () => {
    handleSearch(true);
  };

  return (
    <div className="p-6 mx-auto max-w-7xl">
      {/* Go Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleGoBack}
          className="flex items-center space-x-2 text-brand-600 hover:text-brand-500 hover:bg-brand-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </Button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-brand-600">Discover Students</h1>
        <p className="text-brand-500/70">Connect with fellow students and expand your network</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search by name, email, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
              className="w-full"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="p-6 mt-4 border bg-white/90 backdrop-blur-xl rounded-pinterest-lg shadow-pinterest border-brand-200/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-brand-600">Advanced Search</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 text-brand-500 hover:text-brand-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-3">
              <Input
                label="Name"
                type="text"
                placeholder="First or last name"
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
              />
              <Input
                label="University"
                type="text"
                placeholder="University name"
                value={filters.university}
                onChange={(e) => handleFilterChange('university', e.target.value)}
              />
              <Input
                label="Major"
                type="text"
                placeholder="Field of study"
                value={filters.major}
                onChange={(e) => handleFilterChange('major', e.target.value)}
              />
              <Input
                label="Graduation Year"
                type="number"
                placeholder="2025"
                value={filters.graduationYear}
                onChange={(e) => handleFilterChange('graduationYear', e.target.value)}
                min="1950"
                max="2050"
              />
              <Input
                label="Location"
                type="text"
                placeholder="City, Country"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {users.length > 0 ? (
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-brand-600">
              Search Results ({users.length} found)
            </h2>
          </div>
          
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
            {users.map(user => (
              <UserCard 
                key={user.id} 
                user={user} 
                onConnect={handleConnect}
              />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="text-center">
              <Button
                onClick={loadMore}
                loading={loading}
                disabled={loading}
                variant="outline"
              >
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </div>
      ) : searchQuery || Object.values(filters).some(v => v.trim()) ? (
        <div className="py-12 text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-brand-300" />
          <h3 className="mb-2 text-xl font-semibold text-brand-600">No users found</h3>
          <p className="text-brand-500/70">Try adjusting your search criteria</p>
        </div>
      ) : (
        /* Suggestions */
        suggestions.length > 0 && (
          <div>
            <div className="mb-6">
              <h2 className="mb-2 text-xl font-semibold text-brand-600">
                Suggested for You
              </h2>
              <p className="text-brand-500/70">Students with similar interests and background</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {suggestions.map(user => (
                <UserCard 
                  key={user.id} 
                  user={user} 
                  onConnect={handleConnect}
                />
              ))}
            </div>
          </div>
        )
      )}

      {/* Loading */}
      {loading && users.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 rounded-full border-brand-200 border-t-brand-500 animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default UserSearchPage;