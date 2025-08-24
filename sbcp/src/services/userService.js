import api from './api';

export const userService = {
  // ==================== PROFILE MANAGEMENT ====================
  
  // Get current user profile
  getCurrentProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      console.error('Get current profile error:', error);
      throw error.response?.data || { message: 'Failed to fetch profile' };
    }
  },

  // Get user profile by ID
  getUserProfile: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error.response?.data || { message: 'Failed to fetch user profile' };
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },

  // Get user statistics
  getCurrentUserStats: async () => {
    try {
      const response = await api.get('/users/profile/stats');
      return response.data;
    } catch (error) {
      console.error('Get current user stats error:', error);
      throw error.response?.data || { message: 'Failed to fetch user stats' };
    }
  },

  // Get user statistics by ID
  getUserStats: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Get user stats error:', error);
      throw error.response?.data || { message: 'Failed to fetch user stats' };
    }
  },

  // ==================== MEDIA MANAGEMENT ====================
  
  // Upload avatar
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/users/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Upload avatar error:', error);
      throw error.response?.data || { message: 'Failed to upload avatar' };
    }
  },

  // Delete avatar
  deleteAvatar: async () => {
    try {
      const response = await api.delete('/users/profile/avatar');
      return response.data;
    } catch (error) {
      console.error('Delete avatar error:', error);
      throw error.response?.data || { message: 'Failed to delete avatar' };
    }
  },

  // Upload cover photo
  uploadCoverPhoto: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/users/profile/cover', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Upload cover photo error:', error);
      throw error.response?.data || { message: 'Failed to upload cover photo' };
    }
  },

  // Delete cover photo
  deleteCoverPhoto: async () => {
    try {
      const response = await api.delete('/users/profile/cover');
      return response.data;
    } catch (error) {
      console.error('Delete cover photo error:', error);
      throw error.response?.data || { message: 'Failed to delete cover photo' };
    }
  },

  // ==================== SECURITY ====================
  
  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/users/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error.response?.data || { message: 'Failed to change password' };
    }
  },

  // Send email verification
  sendEmailVerification: async () => {
    try {
      const response = await api.post('/users/verify-email');
      return response.data;
    } catch (error) {
      console.error('Send email verification error:', error);
      throw error.response?.data || { message: 'Failed to send verification email' };
    }
  },

  // Verify email
  verifyEmail: async (token) => {
    try {
      const response = await api.post(`/users/verify-email/${token}`);
      return response.data;
    } catch (error) {
      console.error('Verify email error:', error);
      throw error.response?.data || { message: 'Failed to verify email' };
    }
  },

  // ==================== PREFERENCES ====================
  
  // Update privacy settings
  updatePrivacySettings: async (privacyData) => {
    try {
      const response = await api.put('/users/preferences/privacy', privacyData);
      return response.data;
    } catch (error) {
      console.error('Update privacy settings error:', error);
      throw error.response?.data || { message: 'Failed to update privacy settings' };
    }
  },

  // Update notification settings
  updateNotificationSettings: async (notificationData) => {
    try {
      const response = await api.put('/users/preferences/notifications', notificationData);
      return response.data;
    } catch (error) {
      console.error('Update notification settings error:', error);
      throw error.response?.data || { message: 'Failed to update notification settings' };
    }
  },

  // ==================== SEARCH & DISCOVERY ====================
  
  // Basic user search
  searchUsers: async (query, page = 0, size = 20) => {
    try {
      const response = await api.get('/users/search', {
        params: { q: query, page, size }
      });
      return response.data;
    } catch (error) {
      console.error('Search users error:', error);
      throw error.response?.data || { message: 'Failed to search users' };
    }
  },

  // Advanced user search
  advancedSearchUsers: async (filters, page = 0, size = 20) => {
    try {
      const params = { page, size, ...filters };
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      
      const response = await api.get('/users/search/advanced', { params });
      return response.data;
    } catch (error) {
      console.error('Advanced search users error:', error);
      throw error.response?.data || { message: 'Failed to search users' };
    }
  },

  // Get user suggestions
  getUserSuggestions: async (limit = 10) => {
    try {
      const response = await api.get('/users/suggestions', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Get user suggestions error:', error);
      throw error.response?.data || { message: 'Failed to get user suggestions' };
    }
  },

  // ==================== ACTIVITY ====================
  
  // Get user activity
  getUserActivity: async (page = 0, size = 20) => {
    try {
      const response = await api.get('/users/activity', {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error('Get user activity error:', error);
      throw error.response?.data || { message: 'Failed to fetch user activity' };
    }
  },

  // Get public user activity
  getPublicUserActivity: async (userId, page = 0, size = 20) => {
    try {
      const response = await api.get(`/users/${userId}/activity/public`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error('Get public user activity error:', error);
      throw error.response?.data || { message: 'Failed to fetch public user activity' };
    }
  },

  // ==================== ACCOUNT MANAGEMENT ====================
  
  // Deactivate account
  deactivateAccount: async (reason) => {
    try {
      const response = await api.post('/users/account/deactivate', { reason });
      return response.data;
    } catch (error) {
      console.error('Deactivate account error:', error);
      throw error.response?.data || { message: 'Failed to deactivate account' };
    }
  },

  // Reactivate account
  reactivateAccount: async () => {
    try {
      const response = await api.post('/users/account/reactivate');
      return response.data;
    } catch (error) {
      console.error('Reactivate account error:', error);
      throw error.response?.data || { message: 'Failed to reactivate account' };
    }
  },

  // Delete account
  deleteAccount: async (confirmation) => {
    try {
      const response = await api.delete('/users/account', {
        data: { confirmation }
      });
      return response.data;
    } catch (error) {
      console.error('Delete account error:', error);
      throw error.response?.data || { message: 'Failed to delete account' };
    }
  }
};