// src/services/websocketService.js

import { Client } from '@stomp/stompjs';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscriptions = new Map();
    this.messageHandlers = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000;
  }

  connect() {
    const token = localStorage.getItem('token');
    if (!token || this.connected) {
      console.log('No token or already connected');
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        // Use native WebSocket instead of SockJS to avoid import issues
        this.client = new Client({
          brokerURL: 'ws://localhost:8080/ws-native', // Use native WebSocket endpoint
          connectHeaders: {
            Authorization: `Bearer ${token}`
          },
          debug: (str) => {
            console.log('🔌 WebSocket:', str);
          },
          reconnectDelay: this.reconnectInterval,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          
          onConnect: (frame) => {
            console.log('✅ WebSocket Connected:', frame);
            this.connected = true;
            this.reconnectAttempts = 0;
            this.setupDefaultSubscriptions();
            resolve(frame);
          },
          
          onStompError: (frame) => {
            console.error('❌ WebSocket STOMP Error:', frame);
            this.connected = false;
            reject(new Error(frame.body || 'STOMP connection error'));
          },
          
          onWebSocketError: (error) => {
            console.error('❌ WebSocket Error:', error);
            this.connected = false;
            reject(error);
          },
          
          onDisconnect: () => {
            console.log('🔌 WebSocket Disconnected');
            this.connected = false;
            this.attemptReconnect();
          }
        });

        // Activate the client
        this.client.activate();
      } catch (error) {
        console.error('WebSocket connection failed:', error);
        reject(error);
      }
    });
  }

  setupDefaultSubscriptions() {
    try {
      // Subscribe to private messages
      this.subscribe('/user/queue/messages', (message) => {
        const data = JSON.parse(message.body);
        this.handleMessage('NEW_MESSAGE', data);
      });

      // Subscribe to notifications
      this.subscribe('/user/queue/notifications', (message) => {
        const data = JSON.parse(message.body);
        this.handleMessage('NEW_NOTIFICATION', data);
      });

      // Subscribe to user status updates
      this.subscribe('/topic/user-status', (message) => {
        const data = JSON.parse(message.body);
        this.handleMessage('USER_STATUS', data);
      });

      // Subscribe to typing indicators
      this.subscribe('/user/queue/typing', (message) => {
        const data = JSON.parse(message.body);
        this.handleMessage('TYPING_INDICATOR', data);
      });
    } catch (error) {
      console.error('Failed to setup subscriptions:', error);
    }
  }

  subscribe(destination, callback) {
    if (!this.client || !this.connected) {
      console.warn('Cannot subscribe: WebSocket not connected');
      return null;
    }

    try {
      const subscription = this.client.subscribe(destination, callback);
      this.subscriptions.set(destination, subscription);
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to', destination, error);
      return null;
    }
  }

  unsubscribe(destination) {
    const subscription = this.subscriptions.get(destination);
    if (subscription) {
      try {
        subscription.unsubscribe();
        this.subscriptions.delete(destination);
      } catch (error) {
        console.error('Failed to unsubscribe from', destination, error);
      }
    }
  }

  // Subscribe to group chat
  subscribeToGroup(groupId, callback) {
    const destination = `/topic/group/${groupId}`;
    return this.subscribe(destination, callback);
  }

  // Send private message
  sendPrivateMessage(recipientId, content, messageType = 'TEXT') {
    if (!this.client || !this.connected) {
      console.warn('Cannot send message: WebSocket not connected');
      return false;
    }

    try {
      this.client.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify({
          recipientId,
          content,
          messageType
        })
      });
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  }

  // Send group message
  sendGroupMessage(studyGroupId, content, messageType = 'TEXT') {
    if (!this.client || !this.connected) {
      console.warn('Cannot send group message: WebSocket not connected');
      return false;
    }

    try {
      this.client.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify({
          studyGroupId,
          content,
          messageType
        })
      });
      return true;
    } catch (error) {
      console.error('Failed to send group message:', error);
      return false;
    }
  }

  // Send typing indicator
  sendTypingIndicator(recipientId, studyGroupId, isTyping) {
    if (!this.client || !this.connected) return;

    try {
      this.client.publish({
        destination: '/app/chat.typing',
        body: JSON.stringify({
          recipientId,
          studyGroupId,
          isTyping
        })
      });
    } catch (error) {
      console.error('Failed to send typing indicator:', error);
    }
  }

  // Register message handler
  onMessage(type, handler) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    this.messageHandlers.get(type).push(handler);
  }

  // Remove message handler
  offMessage(type, handler) {
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  // Handle incoming messages
  handleMessage(type, data) {
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in message handler for ${type}:`, error);
        }
      });
    }
  }

  // Attempt reconnection
  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      if (!this.connected && localStorage.getItem('token')) {
        this.connect().catch(() => {
          console.log('Reconnection failed');
        });
      }
    }, this.reconnectInterval);
  }

  disconnect() {
    if (this.client) {
      try {
        this.client.deactivate();
      } catch (error) {
        console.error('Error disconnecting WebSocket:', error);
      }
      this.client = null;
    }
    this.connected = false;
    this.subscriptions.clear();
    this.messageHandlers.clear();
    this.reconnectAttempts = 0;
  }

  isConnected() {
    return this.connected;
  }
}

// Create singleton instance and export as default
const websocketServiceInstance = new WebSocketService();
export default websocketServiceInstance;