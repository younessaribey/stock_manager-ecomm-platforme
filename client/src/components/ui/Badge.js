import React from 'react';

// Shadcn-like Badge component
const variantClasses = {
  default: 'bg-gray-900 text-gray-50 hover:bg-gray-900/80',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-100/80',
  destructive: 'bg-red-500 text-white hover:bg-red-500/80',
  outline: 'text-gray-900 border border-gray-200',
  success: 'bg-green-100 text-green-800 border border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  info: 'bg-blue-100 text-blue-800 border border-blue-200',
};

export const Badge = ({ 
  className = '', 
  variant = 'default',
  children,
  ...props 
}) => {
  const variantCls = variantClasses[variant] || variantClasses.default;
  
  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantCls} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Badge;


