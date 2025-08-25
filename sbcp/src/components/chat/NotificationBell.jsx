import React, { useState } from 'react';
import { Bell, X, Check, CheckCheck } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    
    // Navigate to the related content
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    
    setIsOpen(false);
  };

  const formatNotificationTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInHours = Math.floor((now - notificationTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return notificationTime.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 transition-colors text-brand-500 hover:bg-brand-100 rounded-pinterest"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute right-0 z-50 mt-2 overflow-hidden bg-white border w-80 border-brand-200 rounded-pinterest-lg shadow-pinterest-lg max-h-96">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-brand-200">
              <h3 className="font-semibold text-brand-700">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-brand-500 hover:text-brand-600"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-brand-500 hover:text-brand-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-64">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-brand-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-brand-300" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border-b border-brand-100 cursor-pointer hover:bg-brand-50 transition-colors ${
                      !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-400' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        !notification.isRead ? 'bg-blue-500' : 'bg-gray-300'
                      }`} />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-brand-700">
                          {notification.title}
                        </h4>
                        <p className="mt-1 text-sm text-brand-500">
                          {notification.message}
                        </p>
                        <p className="mt-2 text-xs text-brand-400">
                          {formatNotificationTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;