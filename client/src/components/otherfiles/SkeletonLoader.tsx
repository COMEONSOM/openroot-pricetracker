// SkeletonLoader.tsx — Theme-aware Skeleton Loading Component

import "../../styles/SkeletonLoader.css";

interface Props {
  count?: number;
  className?: string;
}

/**
 * SkeletonLoader Component
 * 
 * Features:
 * ✅ Fully theme-aware (uses CSS variables from global.css)
 * ✅ Responsive grid (4 cols desktop, 2 cols mobile)
 * ✅ Smooth shimmer animation
 * ✅ Adapts to light/dark mode automatically
 * ✅ Smooth transitions when theme changes
 * 
 * @param count - Number of skeleton cards to render (default: 6)
 * @param className - Optional CSS class to add to grid container
 * 
 * @example
 * // Basic usage
 * <SkeletonLoader count={8} />
 * 
 * // With custom class
 * <SkeletonLoader count={4} className="my-custom-class" />
 */
export default function SkeletonLoader({ count = 6, className = "" }: Props) {
  return (
    <div className={`skeleton-grid ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          {/* Image Placeholder with shimmer */}
          <div className="skeleton-image shimmer" />

          {/* Text Placeholders with shimmer */}
          <div className="skeleton-content">
            <div className="skeleton-line shimmer w-80" />
            <div className="skeleton-line shimmer w-60" />
            <div className="skeleton-line shimmer w-40" />
          </div>
        </div>
      ))}
    </div>
  );
}