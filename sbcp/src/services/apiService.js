import api from './api'; // Your existing axios configuration

export const apiService = {

  // Posts API
  posts: {
    // Get all posts
    getAll: async () => {
      const response = await api.get('/posts');
      return response.data;
    },
    
    // Create new post
    create: async (postData) => {
      const response = await api.post('/posts', postData);
      return response.data;
    },
    
    // Get posts by category
    getByCategory: async (category) => {
      const response = await api.get(`/posts/category/${category}`);
      return response.data;
    },
    
    // Get user posts
    getUserPosts: async (userId) => {
      const response = await api.get(`/posts/user/${userId}`);
      return response.data;
    },
    
    // Search posts
    search: async (query) => {
      const response = await api.get(`/posts/search?q=${encodeURIComponent(query)}`);
      return response.data;
    },
    
    // Toggle like
    toggleLike: async (postId) => {
      const response = await api.post(`/posts/${postId}/like`);
      return response.data;
    },
    
    // Toggle save
    toggleSave: async (postId) => {
      const response = await api.post(`/posts/${postId}/save`);
      return response.data;
    },
  },

  // Study Groups API
  groups: {
    // Get all groups
    getAll: async () => {
      const response = await api.get('/groups');
      return response.data;
    },
    
    // Create new group
    create: async (groupData) => {
      const response = await api.post('/groups', groupData);
      return response.data;
    },
    
    // Get groups by subject
    getBySubject: async (subject) => {
      const response = await api.get(`/groups/subject/${subject}`);
      return response.data;
    },
    
    // Get user's groups
    getUserGroups: async () => {
      const response = await api.get('/groups/my-groups');
      return response.data;
    },
    
    // Search groups
    search: async (query) => {
      const response = await api.get(`/groups/search?q=${encodeURIComponent(query)}`);
      return response.data;
    },
    
    // Get group by ID
    getById: async (groupId) => {
      const response = await api.get(`/groups/${groupId}`);
      return response.data;
    },
    
    // Join group
    join: async (groupId) => {
      const response = await api.post(`/groups/${groupId}/join`);
      return response.data;
    },
    
    // Leave group
    leave: async (groupId) => {
      const response = await api.post(`/groups/${groupId}/leave`);
      return response.data;
    },
    
    // Delete group
    delete: async (groupId) => {
      const response = await api.delete(`/groups/${groupId}`);
      return response.data;
    },
    
    // Get group members
    getMembers: async (groupId) => {
      const response = await api.get(`/groups/${groupId}/members`);
      return response.data;
    },
  },
};
