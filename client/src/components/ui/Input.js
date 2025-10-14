import React from 'react';

// Shadcn-like Input component
export const Input = React.forwardRef(({ 
  className = '', 
  type = 'text',
  error = false,
  ...props 
}, ref) => {
  const errorClasses = error 
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
    : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500';
    
  return (
    <input
      type={type}
      className={`flex h-11 w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 ${errorClasses} ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;


