import React from 'react';

// Minimal shadcn-like Button using Tailwind
// Variants: default, secondary, outline, ghost, destructive
// Sizes: sm, md, lg

const variantClasses = {
  default: 'bg-black text-white hover:bg-black/90',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  outline: 'border border-gray-300 text-gray-900 hover:bg-gray-50',
  ghost: 'text-gray-900 hover:bg-gray-100',
  destructive: 'bg-red-600 text-white hover:bg-red-700',
};

const sizeClasses = {
  sm: 'h-9 px-3 text-sm rounded-md',
  md: 'h-11 px-4 text-sm rounded-lg',
  lg: 'h-12 px-6 text-base rounded-xl',
};

export function Button({
  className = '',
  variant = 'default',
  size = 'md',
  disabled = false,
  children,
  ...props
}) {
  const base = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:pointer-events-none';
  const variantCls = variantClasses[variant] || variantClasses.default;
  const sizeCls = sizeClasses[size] || sizeClasses.md;
  const all = `${base} ${variantCls} ${sizeCls} ${className}`.trim();
  return (
    <button className={all} disabled={disabled} {...props}>
      {children}
    </button>
  );
}

export default Button;


