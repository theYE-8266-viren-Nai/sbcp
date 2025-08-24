import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Upload, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import api from '../../services/api';

const PhotoUploadComponent = ({ 
  currentPhotoUrl, 
  uploadType, // 'avatar' or 'cover'
  onPhotoUpdate,
  className = "",
  buttonClassName = "",
  showDeleteOption = true
}) => {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (e.g., 5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Upload the file
    uploadPhoto(file);
  };

  const uploadPhoto = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const endpoint = uploadType === 'avatar' 
        ? '/users/profile/avatar' 
        : '/users/profile/cover';

      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update the parent component with new photo URL
      const newPhotoUrl = uploadType === 'avatar' 
        ? response.data.avatarUrl 
        : response.data.coverPhotoUrl;
      
      onPhotoUpdate(newPhotoUrl);
      
      // Clean up preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      console.log(`${uploadType} uploaded successfully:`, newPhotoUrl);
      
      // Force page refresh to show new image
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error(`${uploadType} upload error:`, error);
      alert(`Failed to upload ${uploadType}. Please try again.`);
      
      // Clean up preview URL on error
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const deletePhoto = async () => {
    if (!window.confirm(`Are you sure you want to remove your ${uploadType}?`)) {
      return;
    }

    setDeleting(true);
    try {
      const endpoint = uploadType === 'avatar' 
        ? '/users/profile/avatar' 
        : '/users/profile/cover';

      const response = await api.delete(endpoint);

      // Update the parent component
      const newPhotoUrl = uploadType === 'avatar' 
        ? response.data.avatarUrl 
        : response.data.coverPhotoUrl;
      
      onPhotoUpdate(newPhotoUrl);
      
      console.log(`${uploadType} deleted successfully`);
      
      // Force page refresh
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error(`${uploadType} delete error:`, error);
      alert(`Failed to delete ${uploadType}. Please try again.`);
    } finally {
      setDeleting(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading || deleting}
      />
      
      <div className="relative group">
        {/* Upload Button */}
        <button
          onClick={triggerFileInput}
          disabled={uploading || deleting}
          className={`
            ${buttonClassName}
            flex items-center justify-center
            transition-all duration-200
            ${uploading || deleting 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:opacity-90 hover:scale-105'
            }
          `}
        >
          {uploading ? (
            <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
          ) : (
            <Camera className="w-5 h-5" />
          )}
        </button>

        {/* Delete Button (appears on hover if photo exists) */}
        {showDeleteOption && currentPhotoUrl && !uploading && (
          <button
            onClick={deletePhoto}
            disabled={deleting}
            className="absolute top-0 right-0 p-1 transition-all duration-200 transform translate-x-2 -translate-y-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:scale-110"
          >
            {deleting ? (
              <div className="w-3 h-3 border border-white rounded-full border-t-transparent animate-spin" />
            ) : (
              <Trash2 className="w-3 h-3 text-white" />
            )}
          </button>
        )}
      </div>

      {/* Upload Status */}
      {uploading && (
        <div className="flex items-center mt-2 space-x-2 text-sm text-brand-600">
          <Upload className="w-4 h-4 animate-pulse" />
          <span>Uploading {uploadType}...</span>
        </div>
      )}

      {deleting && (
        <div className="flex items-center mt-2 space-x-2 text-sm text-red-600">
          <Trash2 className="w-4 h-4 animate-pulse" />
          <span>Removing {uploadType}...</span>
        </div>
      )}
    </div>
  );
};

export default PhotoUploadComponent;