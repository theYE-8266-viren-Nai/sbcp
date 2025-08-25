// src/hooks/useWebSocket.js

import { useEffect, useRef } from 'react';
import websocketService from '../services/websocketService';

export const useWebSocket = () => {
  const isInitialized = useRef(false);

  useEffect(() => {
    // Only connect if we have a token and haven't initialized yet
    if (!isInitialized.current && localStorage.getItem('token')) {
      isInitialized.current = true;
      
      console.log('🔌 Initializing WebSocket connection...');
      
      websocketService.connect()
        .then(() => {
          console.log('✅ WebSocket connected successfully');
        })
        .catch((error) => {
          console.error('❌ WebSocket connection failed:', error);
          // Reset so it can try again
          isInitialized.current = false;
        });
    }

    // Cleanup function
    return () => {
      // Don't disconnect on unmount - maintain connection
      // Only disconnect on logout
    };
  }, []);

  // Return WebSocket utilities
  return {
    connected: websocketService.isConnected(),
    sendPrivateMessage: (recipientId, content, messageType) => 
      websocketService.sendPrivateMessage(recipientId, content, messageType),
    sendGroupMessage: (studyGroupId, content, messageType) => 
      websocketService.sendGroupMessage(studyGroupId, content, messageType),
    sendTypingIndicator: (recipientId, studyGroupId, isTyping) => 
      websocketService.sendTypingIndicator(recipientId, studyGroupId, isTyping),
    subscribeToGroup: (groupId, callback) => 
      websocketService.subscribeToGroup(groupId, callback),
    onMessage: (type, handler) => 
      websocketService.onMessage(type, handler),
    offMessage: (type, handler) => 
      websocketService.offMessage(type, handler)
  };
};