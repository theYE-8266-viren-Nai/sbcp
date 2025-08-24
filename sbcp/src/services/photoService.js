// services/photoService.js
import api from './api';

export const photoService = {
  // Upload avatar
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/users/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // Upload cover photo
  uploadCoverPhoto: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/users/profile/cover', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // Delete avatar
  deleteAvatar: async () => {
    const response = await api.delete('/users/profile/avatar');
    return response.data;
  },

  // Delete cover photo
  deleteCoverPhoto: async () => {
    const response = await api.delete('/users/profile/cover');
    return response.data;
  },

  // Validate file before upload
  validateFile: (file, maxSizeMB = 5) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes

    if (!file) {
      return { isValid: false, error: 'No file selected' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { 
        isValid: false, 
        error: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)' 
      };
    }

    if (file.size > maxSize) {
      return { 
        isValid: false, 
        error: `File size must be less than ${maxSizeMB}MB` 
      };
    }

    return { isValid: true };
  },

  // Create preview URL for file
  createPreviewUrl: (file) => {
    return URL.createObjectURL(file);
  },

  // Clean up preview URL
  revokePreviewUrl: (url) => {
    URL.revokeObjectURL(url);
  }
};