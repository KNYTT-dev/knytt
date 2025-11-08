import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'shimmer' | 'none';
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = 'rectangular',
      width,
      height,
      animation = 'shimmer',
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      text: 'rounded',
      circular: 'rounded-full',
      rectangular: 'rounded-none',
      rounded: 'rounded-lg',
    };

    const animationStyles = {
      pulse: 'animate-pulse',
      shimmer: 'animate-shimmer',
      none: '',
    };

    const combinedClassName = `
      ${variantStyles[variant]}
      ${animationStyles[animation]}
      bg-light-gray
      ${className}
    `.trim().replace(/\s+/g, ' ');

    const combinedStyle = {
      width: width || '100%',
      height: height || (variant === 'text' ? '1em' : '100%'),
      ...style,
    };

    return (
      <div
        ref={ref}
        className={combinedClassName}
        style={combinedStyle}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export default Skeleton;

// Product Card Skeleton Component
export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      {/* Image skeleton */}
      <Skeleton variant="rectangular" height="300px" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton variant="text" height="20px" width="80%" />

        {/* Price and merchant */}
        <div className="flex items-center justify-between">
          <Skeleton variant="text" height="24px" width="60px" />
          <Skeleton variant="text" height="16px" width="100px" />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <Skeleton variant="rectangular" height="16px" width="80px" />
          <Skeleton variant="text" height="14px" width="40px" />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Skeleton variant="rounded" height="40px" className="flex-1" />
          <Skeleton variant="circular" height="40px" width="40px" />
        </div>
      </div>
    </div>
  );
};

// Carousel Skeleton Component
export const CarouselSkeleton = ({ count = 4 }: { count?: number }) => {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="min-w-[280px]">
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <Skeleton variant="rectangular" height="200px" />
            <div className="p-3 space-y-2">
              <Skeleton variant="text" height="16px" width="90%" />
              <Skeleton variant="text" height="20px" width="50px" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Text Skeleton Component
export const TextSkeleton = ({
  lines = 3,
  className = '',
}: {
  lines?: number;
  className?: string;
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          height="16px"
          width={i === lines - 1 ? '70%' : '100%'}
        />
      ))}
    </div>
  );
};
