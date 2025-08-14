import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button',
  disabled = false,
  loading = false,
  variant = 'primary',
  className = '',
  icon: Icon
}) => {
  const baseClasses = "w-full py-3 px-4 font-semibold rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-purple-500/25",
    secondary: "bg-white/10 hover:bg-white/20 border border-white/20 text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
      ) : (
        <>
          <span>{children}</span>
          {Icon && <Icon className="w-5 h-5" />}
        </>
      )}
    </button>
  );
};

export default Button;