import React from 'react';

// Shadcn-like Separator component
export const Separator = ({ 
  className = '', 
  orientation = 'horizontal',
  ...props 
}) => {
  return (
    <div
      className={`${
        orientation === 'horizontal'
          ? 'h-px w-full'
          : 'h-full w-px'
      } bg-gray-200 ${className}`}
      {...props}
    />
  );
};

export default Separator;


