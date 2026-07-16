"use client";

import { memo, useState, useCallback } from "react";
import { Product } from "../../types/product";
import "../../styles/ProductCard.css";

/* =======================
   TYPES
   ======================= */

interface ProductCardProps {
  product: Product;
  onCompare?: (product: Product) => void;
  priority?: boolean;
}

/* =======================
   HELPERS
   ======================= */

const formatPrice = (price: number | null | undefined): string => {
  if (price === null || price === undefined) return "Price unavailable";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

const getPlatformInfo = (platform: string): { name: string; color: string } => {
  const platforms: Record<string, { name: string; color: string }> = {
    amazon: { name: "Amazon", color: "#ff9900" },
    flipkart: { name: "Flipkart", color: "#2874f0" },
    myntra: { name: "Myntra", color: "#ff3f6c" },
    ajio: { name: "AJIO", color: "#000000" },
    meesho: { name: "Meesho", color: "#570741" },
    snapdeal: { name: "Snapdeal", color: "#e40046" },
    croma: { name: "Croma", color: "#0f7c35" },
    reliance: { name: "Reliance Digital", color: "#003380" },
  };
  
  const key = platform.toLowerCase().trim();
  return platforms[key] || { name: platform, color: "var(--color-primary)" };
};

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
};

/* =======================
   SUB-COMPONENTS
   ======================= */

const PlatformBadge = memo(({ platform }: { platform: string }) => {
  const { name, color } = getPlatformInfo(platform);
  
  return (
    <span 
      className="product-card__badge"
      style={{ "--badge-color": color } as React.CSSProperties}
    >
      {name}
    </span>
  );
});
PlatformBadge.displayName = "PlatformBadge";

const ProductImage = memo(({ 
  src, 
  alt, 
  priority = false 
}: { 
  src?: string; 
  alt: string; 
  priority?: boolean;
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = useCallback(() => setLoaded(true), []);
  const handleError = useCallback(() => setError(true), []);

  if (!src || error) {
    return (
      <div className="product-card__image-placeholder">
        <svg 
          className="product-card__placeholder-icon" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
          <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1.5" />
          <path d="M21 15l-5-5L5 21" strokeWidth="1.5" />
        </svg>
        <span className="product-card__placeholder-text">No image</span>
      </div>
    );
  }

  return (
    <div className={`product-card__image-container ${loaded ? "loaded" : ""}`}>
      {!loaded && <div className="product-card__image-skeleton" />}
      <img
        src={src}
        alt={alt}
        className="product-card__image"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
});
ProductImage.displayName = "ProductImage";

/* =======================
   MAIN COMPONENT
   ======================= */

function ProductCard({ product, onCompare, priority = false }: ProductCardProps) {
  const { title, price, platform, url, image, rating, discount } = product;
  const platformInfo = getPlatformInfo(platform);

  const handleCompareClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCompare?.(product);
  }, [onCompare, product]);

  const handleCardClick = useCallback(() => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, [url]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  }, [handleCardClick]);

  return (
    <article
      className="product-card"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${title} - ${formatPrice(price)} on ${platformInfo.name}`}
    >
      {/* Image Section */}
      <div className="product-card__media">
        <ProductImage src={image} alt={title} priority={priority} />
        <PlatformBadge platform={platform} />
        
        {discount && discount > 0 && (
          <span className="product-card__discount">-{discount}%</span>
        )}
      </div>

      {/* Content Section */}
      <div className="product-card__content">
        <h3 className="product-card__title" title={title}>
          {truncateText(title, 60)}
        </h3>

        {rating && (
          <div className="product-card__rating">
            <span className="product-card__stars" aria-hidden="true">★</span>
            <span className="product-card__rating-value">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="product-card__footer">
        <div className="product-card__pricing">
          <span className="product-card__price">{formatPrice(price)}</span>
          {product.originalPrice && product.originalPrice > (price || 0) && (
            <span className="product-card__original-price">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="product-card__actions">
          {onCompare && (
            <button
              type="button"
              className="product-card__compare-btn"
              onClick={handleCompareClick}
              aria-label={`Add ${title} to comparison`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" strokeWidth="1.5" />
                <rect x="9" y="3" width="6" height="4" rx="1" strokeWidth="1.5" />
              </svg>
            </button>
          )}
          <span className="product-card__cta">
            View
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7V17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}

export default memo(ProductCard);
