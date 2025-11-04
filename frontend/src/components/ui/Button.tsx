import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-[var(--duration-fast)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
      primary:
        'bg-pinterest-red text-white hover:bg-dark-red active:scale-95 shadow-md hover:shadow-lg focus-visible:ring-pinterest-red',
      secondary:
        'bg-charcoal text-white hover:bg-charcoal/90 active:scale-95 shadow-md hover:shadow-lg focus-visible:ring-charcoal',
      ghost:
        'bg-transparent text-charcoal hover:bg-light-gray active:scale-95 focus-visible:ring-pinterest-red',
      danger:
        'bg-red-600 text-white hover:bg-red-700 active:scale-95 shadow-md hover:shadow-lg focus-visible:ring-red-600',
      outline:
        'border-2 border-pinterest-red text-pinterest-red hover:bg-pinterest-red hover:text-white active:scale-95 focus-visible:ring-pinterest-red',
    };

    const sizeStyles = {
      sm: 'text-sm px-3 py-1.5 gap-1.5',
      md: 'text-base px-4 py-2.5 gap-2',
      lg: 'text-lg px-6 py-3 gap-2.5',
    };

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
