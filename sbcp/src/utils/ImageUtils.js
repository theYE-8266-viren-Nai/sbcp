// utils/imageUtils.js
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // If the URL already contains the correct backend port, return as is
  if (imageUrl.includes('localhost:8080')) {
    return imageUrl;
  }
  
  // If it's a relative path, prepend the backend URL
  if (imageUrl.startsWith('/uploads/')) {
    return `http://localhost:8080${imageUrl}`;
  }
  
  return imageUrl;
};