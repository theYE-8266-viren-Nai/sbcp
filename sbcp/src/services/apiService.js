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

// ========================= ✨ NEW: Chat Service =========================
export const chatService = {
  // Get chat rooms
  getChatRooms: async () => {
    const response = await api.get('/chat/rooms');
    return response.data;
  },

  // Send message via REST (fallback)
  sendMessage: async (messageData) => {
    const response = await api.post('/chat/send', messageData);
    return response.data;
  },

  // Get private chat history
  getPrivateChatHistory: async (otherUserId, page = 0, size = 20) => {
    const response = await api.get(`/chat/private/${otherUserId}?page=${page}&size=${size}`);
    return response.data;
  },

  // Get group chat history
  getGroupChatHistory: async (studyGroupId, page = 0, size = 20) => {
    const response = await api.get(`/chat/group/${studyGroupId}?page=${page}&size=${size}`);
    return response.data;
  },

  // Mark messages as read
  markMessagesAsRead: async (senderId, studyGroupId) => {
    const response = await api.post('/chat/mark-read', { senderId, studyGroupId });
    return response.data;
  },

  // Get notifications
  getNotifications: async (page = 0, size = 20) => {
    const response = await api.get(`/notifications?page=${page}&size=${size}`);
    return response.data;
  },

  // Get unread notification count
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId) => {
    const response = await api.post(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllNotificationsAsRead: async () => {
    const response = await api.post('/notifications/mark-all-read');
    return response.data;
  },

  // Check online status
  isUserOnline: async (userId) => {
    const response = await api.get(`/online-status/${userId}`);
    return response.data;
  },

  // Check multiple users online status
  checkUsersOnlineStatus: async (userIds) => {
    const response = await api.post('/online-status/check', userIds);
    return response.data;
  }
};
