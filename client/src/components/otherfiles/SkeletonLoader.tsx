"use client";

import { memo, useMemo } from "react";
import "../../styles/SkeletonLoader.css";

/* =======================
   TYPES
   ======================= */

type SkeletonVariant = "text" | "link" | "grid";

interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
  count?: number;
  className?: string;
}

interface SkeletonCardProps {
  index: number;
}

/* =======================
   SKELETON ELEMENTS
   ======================= */

const SkeletonPulse = memo(({ className = "" }: { className?: string }) => (
  <div className={`skeleton__pulse ${className}`} />
));
SkeletonPulse.displayName = "SkeletonPulse";

/* =======================
   TEXT SEARCH SKELETON
   Product cards grid layout
   ======================= */

const TextSearchCard = memo(({ index }: SkeletonCardProps) => (
  <article 
    className="skeleton__card skeleton__card--product" 
    aria-hidden="true"
    style={{ animationDelay: `${index * 0.1}s` }}
  >
    {/* Product Image */}
    <div className="skeleton__image-wrapper">
      <SkeletonPulse className="skeleton__image" />
      <SkeletonPulse className="skeleton__badge" />
    </div>

    {/* Product Info */}
    <div className="skeleton__body">
      <SkeletonPulse className="skeleton__title" />
      <SkeletonPulse className="skeleton__subtitle" />
      
      <div className="skeleton__meta">
        <SkeletonPulse className="skeleton__price" />
        <SkeletonPulse className="skeleton__rating" />
      </div>

      <div className="skeleton__tags">
        <SkeletonPulse className="skeleton__tag" />
        <SkeletonPulse className="skeleton__tag" />
      </div>
    </div>

    {/* Action Button */}
    <SkeletonPulse className="skeleton__button" />
  </article>
));
TextSearchCard.displayName = "TextSearchCard";

/* =======================
   LINK SEARCH SKELETON
   Comparison dashboard layout
   ======================= */

const LinkSearchSkeleton = memo(() => (
  <div className="skeleton__dashboard" aria-hidden="true">
    {/* Main Product Hero */}
    <div className="skeleton__hero">
      <div className="skeleton__hero-image">
        <SkeletonPulse className="skeleton__image skeleton__image--large" />
      </div>
      <div className="skeleton__hero-info">
        <SkeletonPulse className="skeleton__title skeleton__title--large" />
        <SkeletonPulse className="skeleton__subtitle" />
        <SkeletonPulse className="skeleton__price skeleton__price--large" />
        <div className="skeleton__hero-meta">
          <SkeletonPulse className="skeleton__chip" />
          <SkeletonPulse className="skeleton__chip" />
          <SkeletonPulse className="skeleton__chip" />
        </div>
      </div>
    </div>

    {/* Price Comparison Table */}
    <div className="skeleton__section">
      <SkeletonPulse className="skeleton__section-title" />
      <div className="skeleton__table">
        {[0, 1, 2, 3].map((i) => (
          <div 
            key={i} 
            className="skeleton__table-row"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <SkeletonPulse className="skeleton__table-cell skeleton__table-cell--logo" />
            <SkeletonPulse className="skeleton__table-cell skeleton__table-cell--name" />
            <SkeletonPulse className="skeleton__table-cell skeleton__table-cell--price" />
            <SkeletonPulse className="skeleton__table-cell skeleton__table-cell--action" />
          </div>
        ))}
      </div>
    </div>

    {/* Price History Chart Placeholder */}
    <div className="skeleton__section">
      <SkeletonPulse className="skeleton__section-title" />
      <SkeletonPulse className="skeleton__chart" />
    </div>
  </div>
));
LinkSearchSkeleton.displayName = "LinkSearchSkeleton";

/* =======================
   GRID SKELETON (Generic)
   ======================= */

const GridCard = memo(({ index }: SkeletonCardProps) => (
  <div 
    className="skeleton__card skeleton__card--simple"
    style={{ animationDelay: `${index * 0.08}s` }}
  >
    <SkeletonPulse className="skeleton__image" />
    <div className="skeleton__body">
      <SkeletonPulse className="skeleton__title" />
      <SkeletonPulse className="skeleton__subtitle" />
    </div>
  </div>
));
GridCard.displayName = "GridCard";

/* =======================
   MAIN COMPONENT
   ======================= */

function SkeletonLoader({ 
  variant = "text", 
  count = 6, 
  className = "" 
}: SkeletonLoaderProps) {
  
  const items = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);

  if (variant === "link") {
    return (
      <div className={`skeleton skeleton--link ${className}`} role="status" aria-label="Loading comparison data">
        <span className="skeleton__sr-only">Loading product comparison...</span>
        <LinkSearchSkeleton />
      </div>
    );
  }

  if (variant === "text") {
    return (
      <div className={`skeleton skeleton--text ${className}`} role="status" aria-label="Loading search results">
        <span className="skeleton__sr-only">Loading search results...</span>
        <div className="skeleton__grid skeleton__grid--products">
          {items.map((i) => (
            <TextSearchCard key={i} index={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`skeleton skeleton--grid ${className}`} role="status" aria-label="Loading">
      <span className="skeleton__sr-only">Loading...</span>
      <div className="skeleton__grid">
        {items.map((i) => (
          <GridCard key={i} index={i} />
        ))}
      </div>
    </div>
  );
}

export default memo(SkeletonLoader);
