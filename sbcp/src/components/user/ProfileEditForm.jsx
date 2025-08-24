import React, { useState, useEffect } from 'react';
import { 
  User, 
  Save, 
  ArrowLeft,
  MapPin, 
  GraduationCap, 
  Calendar,
  Globe,
  Phone,
  FileText,
  Building
} from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import api from '../../services/api';

const ProfileEditForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    location: '',
    university: '',
    major: '',
    graduationYear: '',
    phoneNumber: '',
    website: '',
    isProfilePublic: true,
    allowMessagesFromStrangers: true,
    emailNotificationsEnabled: true,
    pushNotificationsEnabled: true
  });
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchCurrentProfile();
  }, []);

  const fetchCurrentProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      const userData = response.data;
      
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        bio: userData.bio || '',
        location: userData.location || '',
        university: userData.university || '',
        major: userData.major || '',
        graduationYear: userData.graduationYear || '',
        phoneNumber: userData.phoneNumber || '',
        website: userData.website || '',
        isProfilePublic: userData.isProfilePublic ?? true,
        allowMessagesFromStrangers: userData.allowMessagesFromStrangers ?? true,
        emailNotificationsEnabled: userData.emailNotificationsEnabled ?? true,
        pushNotificationsEnabled: userData.pushNotificationsEnabled ?? true
      });
    } catch (err) {
      setError('Failed to load profile data');
      console.error('Profile fetch error:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (error) setError('');
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convert graduation year to number if provided
      const submitData = {
        ...formData,
        graduationYear: formData.graduationYear ? parseInt(formData.graduationYear) : null
      };

      await api.put('/users/profile', submitData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 rounded-full border-brand-200 border-t-brand-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl p-6 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4 space-x-4">
          <button
            onClick={onBack}
            className="p-2 transition-colors text-brand-500 hover:text-brand-600 hover:bg-brand-50 rounded-pinterest"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-brand-600">Edit Profile</h1>
            <p className="text-brand-500/70">Update your personal information and preferences</p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="p-4 mb-6 border border-green-200 bg-green-50 rounded-pinterest">
            <p className="text-sm font-medium text-green-600">Profile updated successfully!</p>
          </div>
        )}

        {error && (
          <div className="p-4 mb-6 border bg-pinterest-red/10 border-pinterest-red/20 rounded-pinterest">
            <p className="text-sm font-medium text-pinterest-red">{error}</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="p-6 border bg-white/90 backdrop-blur-xl rounded-pinterest-lg shadow-pinterest-lg border-brand-200/30">
          <h2 className="flex items-center mb-6 text-xl font-semibold text-brand-600">
            <User className="w-5 h-5 mr-2" />
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="First Name"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter your first name"
              required
            />

            <Input
              label="Last Name"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Enter your last name"
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              icon={User}
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              icon={Phone}
            />
          </div>

          <div className="mt-6">
            <label className="block mb-2 text-sm font-medium text-brand-600">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself..."
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 transition-colors border outline-none resize-none border-brand-300 rounded-pinterest focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
            />
            <p className="mt-1 text-xs text-brand-500/70">
              {formData.bio.length}/500 characters
            </p>
          </div>
        </div>

        {/* Academic Information */}
        <div className="p-6 border bg-white/90 backdrop-blur-xl rounded-pinterest-lg shadow-pinterest-lg border-brand-200/30">
          <h2 className="flex items-center mb-6 text-xl font-semibold text-brand-600">
            <GraduationCap className="w-5 h-5 mr-2" />
            Academic Information
          </h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="University"
              type="text"
              name="university"
              value={formData.university}
              onChange={handleInputChange}
              placeholder="Enter your university"
              icon={Building}
            />

            <Input
              label="Major"
              type="text"
              name="major"
              value={formData.major}
              onChange={handleInputChange}
              placeholder="Enter your major"
              icon={FileText}
            />

            <Input
              label="Graduation Year"
              type="number"
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleInputChange}
              placeholder="2025"
              min="1950"
              max="2050"
              icon={Calendar}
            />

            <Input
              label="Location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="City, Country"
              icon={MapPin}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-6 border bg-white/90 backdrop-blur-xl rounded-pinterest-lg shadow-pinterest-lg border-brand-200/30">
          <h2 className="flex items-center mb-6 text-xl font-semibold text-brand-600">
            <Globe className="w-5 h-5 mr-2" />
            Contact & Links
          </h2>
          
          <div className="grid grid-cols-1 gap-6">
            <Input
              label="Website"
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://your-website.com"
              icon={Globe}
            />
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="p-6 border bg-white/90 backdrop-blur-xl rounded-pinterest-lg shadow-pinterest-lg border-brand-200/30">
          <h2 className="mb-6 text-xl font-semibold text-brand-600">Privacy & Preferences</h2>
          
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="isProfilePublic"
                checked={formData.isProfilePublic}
                onChange={handleInputChange}
                className="w-4 h-4 bg-white rounded text-brand-500 border-brand-300 focus:ring-brand-400 focus:ring-2"
              />
              <div>
                <span className="font-medium text-brand-600">Public Profile</span>
                <p className="text-sm text-brand-500/70">Allow other users to view your profile</p>
              </div>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="allowMessagesFromStrangers"
                checked={formData.allowMessagesFromStrangers}
                onChange={handleInputChange}
                className="w-4 h-4 bg-white rounded text-brand-500 border-brand-300 focus:ring-brand-400 focus:ring-2"
              />
              <div>
                <span className="font-medium text-brand-600">Allow Messages from Anyone</span>
                <p className="text-sm text-brand-500/70">Receive messages from users you're not connected with</p>
              </div>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="emailNotificationsEnabled"
                checked={formData.emailNotificationsEnabled}
                onChange={handleInputChange}
                className="w-4 h-4 bg-white rounded text-brand-500 border-brand-300 focus:ring-brand-400 focus:ring-2"
              />
              <div>
                <span className="font-medium text-brand-600">Email Notifications</span>
                <p className="text-sm text-brand-500/70">Receive important updates via email</p>
              </div>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="pushNotificationsEnabled"
                checked={formData.pushNotificationsEnabled}
                onChange={handleInputChange}
                className="w-4 h-4 bg-white rounded text-brand-500 border-brand-300 focus:ring-brand-400 focus:ring-2"
              />
              <div>
                <span className="font-medium text-brand-600">Push Notifications</span>
                <p className="text-sm text-brand-500/70">Receive real-time notifications</p>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;