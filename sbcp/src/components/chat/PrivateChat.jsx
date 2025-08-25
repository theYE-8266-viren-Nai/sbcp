
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { chatService } from '../../services/apiService';
import { authService } from '../../services/authService';

const PrivateChat = () => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(location.state?.userInfo || null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  
  const currentUser = authService.getCurrentUser();
  const { connected, sendPrivateMessage, sendTypingIndicator, onMessage, offMessage } = useWebSocket();

  useEffect(() => {
    loadChatHistory();
    setupMessageListeners();
    
    return () => {
      cleanupMessageListeners();
    };
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      setLoading(true);
      const response = await chatService.getPrivateChatHistory(userId);
      setMessages(response.content.reverse()); // Reverse to show oldest first
    } catch (error) {
      console.error('Failed to load chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupMessageListeners = () => {
    // Listen for new messages
    const handleNewMessage = (messageData) => {
      if (messageData.senderId == userId || messageData.recipientId == userId) {
        setMessages(prev => [...prev, messageData]);
        
        // Mark message as read if it's from the other user
        if (messageData.senderId == userId) {
          chatService.markMessagesAsRead(userId);
        }
      }
    };

    // Listen for typing indicators
    const handleTypingIndicator = (typingData) => {
      if (typingData.userId == userId) {
        setIsTyping(typingData.isTyping);
        if (typingData.isTyping) {
          setTimeout(() => setIsTyping(false), 3000); // Auto-clear after 3s
        }
      }
    };

    onMessage('NEW_MESSAGE', handleNewMessage);
    onMessage('TYPING_INDICATOR', handleTypingIndicator);
  };

  const cleanupMessageListeners = () => {
    offMessage('NEW_MESSAGE');
    offMessage('TYPING_INDICATOR');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    
    // Clear typing indicator
    sendTypingIndicator(userId, null, false);

    // Try WebSocket first, fallback to REST API
    const success = sendPrivateMessage(parseInt(userId), messageContent);
    
    if (!success) {
      // Fallback to REST API
      try {
        const response = await chatService.sendMessage({
          recipientId: parseInt(userId),
          content: messageContent,
          messageType: 'TEXT'
        });
        setMessages(prev => [...prev, response]);
      } catch (error) {
        console.error('Failed to send message:', error);
        setNewMessage(messageContent); // Restore message on failure
      }
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    // Send typing indicator
    if (connected) {
      sendTypingIndicator(parseInt(userId), null, true);
      
      // Clear previous timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      
      // Set new timeout to stop typing indicator
      const timeout = setTimeout(() => {
        sendTypingIndicator(parseInt(userId), null, false);
      }, 1000);
      
      setTypingTimeout(timeout);
    }
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-screen bg-brand-50">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm border-brand-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-brand-100 rounded-pinterest"
          >
            <ArrowLeft className="w-5 h-5 text-brand-600" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-300">
              <span className="font-medium text-white">
                {userInfo?.firstName?.[0] || 'U'}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-brand-700">
                {userInfo?.firstName} {userInfo?.lastName} 
              </h3>
              <p className="text-sm text-brand-500">
                {connected ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-brand-100 rounded-pinterest">
            <Phone className="w-5 h-5 text-brand-600" />
          </button>
          <button className="p-2 hover:bg-brand-100 rounded-pinterest">
            <Video className="w-5 h-5 text-brand-600" />
          </button>
          <button className="p-2 hover:bg-brand-100 rounded-pinterest">
            <MoreVertical className="w-5 h-5 text-brand-600" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 rounded-full border-brand-200 border-t-brand-500 animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="mt-8 text-center text-brand-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-brand-300" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.senderId === parseInt(currentUser.id);
            
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-pinterest ${
                    isOwnMessage
                      ? 'bg-brand-500 text-white'
                      : 'bg-white text-brand-700 border border-brand-200'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    isOwnMessage ? 'text-brand-100' : 'text-brand-400'
                  }`}>
                    {formatMessageTime(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="px-4 py-2 bg-white border text-brand-700 border-brand-200 rounded-pinterest">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-brand-200">
        <div className="flex items-center space-x-4">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border outline-none border-brand-200 rounded-pinterest-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
            disabled={!connected}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !connected}
            className="p-3 text-white transition-colors bg-brand-500 rounded-pinterest hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {!connected && (
          <p className="mt-2 text-sm text-red-500">
            Disconnected - messages will be sent via API
          </p>
        )}
      </form>
    </div>
  );
};

export default PrivateChat;