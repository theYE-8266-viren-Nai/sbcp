
import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  onClick,
  loading = false,
  disabled = false,
  variant = 'primary',
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center
    px-6 py-3 
    rounded-pinterest 
    font-medium 
    transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-brand-400 to-brand-500 
      text-white 
      shadow-pinterest
      hover:from-brand-500 hover:to-brand-600 
      hover:shadow-pinterest-hover
      hover:scale-105
      focus:ring-brand-400
      active:scale-95
    `,
    secondary: `
      bg-white/80 
      text-brand-600 
      border border-brand-300
      shadow-sm
      hover:bg-white
      hover:shadow-pinterest
      focus:ring-brand-400
    `,
    outline: `
      bg-transparent 
      text-brand-500 
      border border-brand-300
      hover:bg-brand-50
      focus:ring-brand-400
    `
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 mr-2" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;