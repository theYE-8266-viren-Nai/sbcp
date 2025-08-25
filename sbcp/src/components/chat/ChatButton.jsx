
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatButton = ({ userId, userInfo, className = "" }) => {
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate(`/chat/private/${userId}`, { 
      state: { userInfo } 
    });
  };

  return (
    <button
      onClick={handleChatClick}
      className={`flex items-center space-x-2 px-4 py-2 bg-brand-500 text-white rounded-pinterest hover:bg-brand-600 transition-colors ${className}`}
    >
      <MessageCircle className="w-4 h-4" />
      <span>Message</span>
    </button>
  );
};

export default ChatButton;
