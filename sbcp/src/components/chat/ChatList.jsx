import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Search, Users } from 'lucide-react';
import { chatService } from '../../services/apiService';
import websocketService from '../../services/websocketService';

const ChatList = () => {
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadChatRooms();
    setupMessageListeners();

    return () => {
      websocketService.offMessage('NEW_MESSAGE');
    };
  }, []);

  const loadChatRooms = async () => {
    try {
      setLoading(true);
      const response = await chatService.getChatRooms();
      setChatRooms(response);
    } catch (error) {
      console.error('Failed to load chat rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupMessageListeners = () => {
    const handleNewMessage = (messageData) => {
      // Update chat rooms with new message
      setChatRooms(prev => 
        prev.map(room => {
          if (
            (messageData.senderId === room.otherUserId || 
             messageData.recipientId === room.otherUserId)
          ) {
            return {
              ...room,
              lastMessage: messageData,
              lastMessageAt: messageData.createdAt,
              unreadCount: messageData.senderId === room.otherUserId 
                ? (room.unreadCount || 0) + 1 
                : room.unreadCount
            };
          }
          return room;
        })
      );
    };

    websocketService.onMessage('NEW_MESSAGE', handleNewMessage);
  };

  const handleChatRoomClick = (chatRoom) => {
    navigate(`/chat/private/${chatRoom.otherUserId}`, {
      state: {
        userInfo: {
          firstName: chatRoom.otherUserName?.split(' ')[0],
          lastName: chatRoom.otherUserName?.split(' ')[1],
          avatarUrl: chatRoom.otherUserAvatarUrl
        }
      }
    });
  };

  const formatLastMessageTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = Math.floor((now - messageTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    return messageTime.toLocaleDateString();
  };

  const filteredChatRooms = chatRooms.filter(room =>
    room.otherUserName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl p-6 mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-4 text-3xl font-bold text-brand-600">Messages</h1>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-brand-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full py-3 pl-10 pr-4 border border-brand-200 rounded-pinterest-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
          />
        </div>
      </div>

      {/* Chat Rooms List */}
      <div className="space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 rounded-full border-brand-200 border-t-brand-500 animate-spin"></div>
          </div>
        ) : filteredChatRooms.length === 0 ? (
          <div className="py-12 text-center">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-brand-300" />
            <h3 className="mb-2 text-lg font-medium text-brand-600">No conversations yet</h3>
            <p className="text-brand-500">Start chatting with other users to see your conversations here.</p>
          </div>
        ) : (
          filteredChatRooms.map((chatRoom) => (
            <div
              key={chatRoom.id}
              onClick={() => handleChatRoomClick(chatRoom)}
              className="flex items-center p-4 transition-all bg-white border cursor-pointer border-brand-200 rounded-pinterest-lg hover:border-brand-300 hover:shadow-pinterest"
            >
              {/* Avatar */}
              <div className="relative">
                <div className="flex items-center justify-center w-12 h-12 overflow-hidden rounded-full bg-brand-300">
                  {chatRoom.otherUserAvatarUrl ? (
                    <img 
                      src={chatRoom.otherUserAvatarUrl} 
                      alt={chatRoom.otherUserName}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="font-medium text-white">
                      {chatRoom.otherUserName?.[0] || 'U'}
                    </span>
                  )}
                </div>
                {chatRoom.otherUserOnline && (
                  <div className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full -bottom-1 -right-1"></div>
                )}
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0 ml-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold truncate text-brand-700">
                    {chatRoom.otherUserName || 'Unknown User'}
                  </h3>
                  <span className="flex-shrink-0 text-xs text-brand-400">
                    {chatRoom.lastMessageAt && formatLastMessageTime(chatRoom.lastMessageAt)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm truncate text-brand-500">
                    {chatRoom.lastMessage?.content || 'No messages yet'}
                  </p>
                  {chatRoom.unreadCount > 0 && (
                    <span className="flex-shrink-0 px-2 py-1 ml-2 text-xs text-white rounded-full bg-brand-500">
                      {chatRoom.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;