// src/contexts/NotificationContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
// ✅ FIXED: Use default import instead of named import
import websocketService from '../services/websocketService';
import { chatService } from '../services/apiService';
import { toast } from 'react-toastify';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load initial notifications and unread count
    loadNotifications();
    loadUnreadCount();

    // Listen for new notifications via WebSocket
    const handleNewNotification = (notificationData) => {
      console.log('🔔 New notification received:', notificationData);
      
      // Add to notifications list
      setNotifications(prev => [notificationData.data || notificationData, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show toast notification
      const notification = notificationData.data || notificationData;
      toast.info(notification.title || notification.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true
      });
    };

    websocketService.onMessage('NEW_NOTIFICATION', handleNewNotification);

    return () => {
      websocketService.offMessage('NEW_NOTIFICATION', handleNewNotification);
    };
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await chatService.getNotifications(0, 20);
      setNotifications(response.content || response || []);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await chatService.getUnreadCount();
      setUnreadCount(response.count || 0);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await chatService.markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await chatService.markAllNotificationsAsRead();
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      loadNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};