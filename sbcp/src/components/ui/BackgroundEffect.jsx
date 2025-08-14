import React from 'react';

const BackgroundEffects = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute bg-purple-500 rounded-full -top-40 -right-40 w-80 h-80 mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute bg-blue-500 rounded-full -bottom-40 -left-40 w-80 h-80 mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-pink-500 rounded-full top-1/2 left-1/2 w-60 h-60 mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
    </div>
  );
};

export default BackgroundEffects;