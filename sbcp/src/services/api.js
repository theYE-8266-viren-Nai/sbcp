import axios from 'axios';

// Base URL for your Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Add timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ⭐ THIS IS THE KEY FIX - Required for CORS
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debug logging (remove in production)
    console.log('🚀 API Request:', {
      url: config.baseURL + config.url,
      method: config.method?.toUpperCase(),
      headers: config.headers
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Handle responses and errors
api.interceptors.response.use(
  (response) => {
    // Debug logging (remove in production)
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Use React Router instead of direct navigation
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;