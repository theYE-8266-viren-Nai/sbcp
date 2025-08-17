import React from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick,
  required = false,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-brand-600">
          {label}
          {required && <span className="ml-1 text-pinterest-red">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Icon className="w-5 h-5 text-brand-500/50" />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            w-full px-4 py-3 
            ${Icon ? 'pl-12' : 'pl-4'} 
            ${RightIcon ? 'pr-12' : 'pr-4'}
            bg-white/80 backdrop-blur-sm
            border border-brand-300 
            rounded-pinterest 
            text-brand-600 
            placeholder-brand-500/50
            focus:ring-2 focus:ring-brand-400 focus:border-brand-400 
            transition-all duration-200
            hover:bg-white/90
          `}
        />
        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute inset-y-0 right-0 flex items-center pr-4 transition-colors text-brand-500/50 hover:text-brand-500"
          >
            <RightIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
