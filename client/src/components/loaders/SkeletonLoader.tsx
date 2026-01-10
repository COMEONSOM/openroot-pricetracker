import "../../styles/SkeletonLoader.css";

interface Props {
  count?: number;
}

export default function SkeletonLoader({ count = 6 }: Props) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-image shimmer" />

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
