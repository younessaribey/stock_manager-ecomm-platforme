import React from 'react';

// Shadcn-like Label component
export const Label = ({ className = '', children, htmlFor, ...props }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

export default Label;


