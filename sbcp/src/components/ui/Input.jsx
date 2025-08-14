import React from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick
}) => {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-slate-300">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full ${Icon ? 'pl-12' : 'pl-4'} ${RightIcon ? 'pr-12' : 'pr-4'} py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300`}
          placeholder={placeholder}
          required={required}
        />
        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute transition-colors transform -translate-y-1/2 right-3 top-1/2 text-slate-400 hover:text-white"
          >
            <RightIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;