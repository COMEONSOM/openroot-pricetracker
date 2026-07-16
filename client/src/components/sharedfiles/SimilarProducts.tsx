import { useEffect, useState, useRef, useCallback, memo } from 'react';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { Product } from '../../types/product';
import '../../styles/SimilarProducts.css';

interface Props {
  title: string;
  maxItems?: number;
  onProductClick?: (product: Product) => void;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
}

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

interface FetchState {
  status: LoadingState;
  items: Product[];
  error: string | null;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const SKELETON_COUNT = 6;
const DEFAULT_MAX_ITEMS = 12;
const REQUEST_TIMEOUT = 10000;

// Helper function to safely format price
function formatPrice(price: number | null | undefined): string {
  if (price == null) return '—';
  return `₹${price.toLocaleString('en-IN')}`;
}

// Helper to generate unique key for product
function getProductKey(product: Product, index: number): string {
  // Try multiple fallbacks for unique key
  if ('id' in product && product.id) return String(product.id);
  if ('_id' in product && product._id) return String(product._id);
  if ('sku' in product && product.sku) return String(product.sku);
  return `${product.title?.slice(0, 20) || 'product'}-${index}`;
}

// Memoized Product Card Component
const ProductCard = memo(function ProductCard({
  product,
  index,
  onClick,
}: {
  product: Product;
  index: number;
  onClick?: (product: Product) => void;
}) {
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder.png';
    e.currentTarget.onerror = null;
  }, []);

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(product);
    } else if (product.url) {
      window.open(product.url, '_blank', 'noopener,noreferrer');
    }
  }, [onClick, product]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onClick) {
        onClick(product);
      } else if (product.url) {
        window.open(product.url, '_blank', 'noopener,noreferrer');
      }
    }
  }, [onClick, product]);

  // Safely access price values with nullish coalescing
  const currentPrice = product.price ?? 0;
  const originalPrice = ('originalPrice' in product ? product.originalPrice : null) as number | null;

  // Calculate discount only if both prices exist and original is higher
  const hasDiscount = originalPrice != null && originalPrice > currentPrice;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  return (
    <article
      className="similar-card"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View ${product.title || 'product'}`}
      style={{ '--card-index': index } as React.CSSProperties}
    >
      <figure className="similar-image-wrapper">
        <img
          src={product.image || '/placeholder.png'}
          alt={product.title || 'Product image'}
          loading="lazy"
          decoding="async"
          onError={handleImageError}
        />
        <div className="similar-image-overlay">
          <span className="view-details-btn">View Details</span>
        </div>
      </figure>

      <div className="similar-info">
        <h3 className="similar-title" title={product.title || ''}>
          {product.title || 'Untitled Product'}
        </h3>
        <div className="similar-price-row">
          <span className="similar-price">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <>
              <span className="similar-original-price">
                {formatPrice(originalPrice)}
              </span>
              <span className="similar-discount">
                {discountPercent}% off
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  );
});

// Skeleton Card Component
function SkeletonCard() {
  return (
    <div className="similar-skeleton-card" aria-hidden="true">
      <div className="skeleton-image" />
      <div className="skeleton-content">
        <div className="skeleton-title" />
        <div className="skeleton-title skeleton-title-short" />
        <div className="skeleton-price" />
      </div>
    </div>
  );
}

// Toggle Icon Component
function ToggleIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`toggle-icon ${expanded ? 'expanded' : ''}`}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// Main Component
export default function SimilarProducts({
  title,
  maxItems = DEFAULT_MAX_ITEMS,
  onProductClick,
  collapsible = false,
  defaultExpanded = true,
  onToggle,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [retryKey, setRetryKey] = useState(0);
  const [state, setState] = useState<FetchState>({
    status: 'idle',
    items: [],
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);
  const contentId = useRef(`similar-content-${Math.random().toString(36).slice(2, 9)}`);

  // Toggle handler
  const handleToggle = useCallback(() => {
    setIsExpanded((prev) => {
      const newState = !prev;
      onToggle?.(newState);
      return newState;
    });
  }, [onToggle]);

  // Keyboard support for toggle
  const handleHeaderKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  }, [handleToggle]);

  // Fetch similar products
  useEffect(() => {
    if (!title?.trim()) {
      setState({ status: 'idle', items: [], error: null });
      return;
    }

    abortControllerRef.current?.abort();
    cancelTokenRef.current?.cancel('Request superseded');

    abortControllerRef.current = new AbortController();
    cancelTokenRef.current = axios.CancelToken.source();

    const fetchSimilarProducts = async () => {
      setState((prev) => ({ ...prev, status: 'loading', error: null }));

      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/search/similar`,
          { title: title.trim() },
          {
            signal: abortControllerRef.current?.signal,
            cancelToken: cancelTokenRef.current?.token,
            timeout: REQUEST_TIMEOUT,
            headers: { 'Content-Type': 'application/json' },
          }
        );

        const data: Product[] = response.data?.similar ?? [];
        const validItems = data
          .filter((item): item is Product =>
            item != null &&
            typeof item.title === 'string' &&
            item.title.length > 0
          )
          .slice(0, maxItems);

        setState({
          status: 'success',
          items: validItems,
          error: null,
        });
      } catch (err) {
        if (axios.isCancel(err) || (err as Error).name === 'AbortError') {
          return;
        }

        const axiosError = err as AxiosError<{ message?: string }>;
        const errorMessage =
          axiosError.response?.data?.message ||
          axiosError.message ||
          'Failed to load similar products';

        setState({
          status: 'error',
          items: [],
          error: errorMessage,
        });

        console.error('[SimilarProducts] Fetch error:', errorMessage);
      }
    };

    fetchSimilarProducts();

    return () => {
      abortControllerRef.current?.abort();
      cancelTokenRef.current?.cancel('Component unmounted');
    };
  }, [title, maxItems, retryKey]);

  // Retry handler
  const handleRetry = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'idle', error: null }));
    setRetryKey((prev) => prev + 1);
  }, []);

  const { status, items, error } = state;

  return (
    <section
      className={`similar-root ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}
      aria-labelledby="similar-products-heading"
    >
      {/* Header with Toggle */}
      <header
        className={`similar-header ${collapsible ? 'is-collapsible' : ''}`}
        role={collapsible ? 'button' : undefined}
        tabIndex={collapsible ? 0 : undefined}
        aria-expanded={collapsible ? isExpanded : undefined}
        aria-controls={collapsible ? contentId.current : undefined}
        onClick={collapsible ? handleToggle : undefined}
        onKeyDown={collapsible ? handleHeaderKeyDown : undefined}
      >
        <div className="similar-header-left">
          <h2 id="similar-products-heading" className="similar-heading">
            Similar Products
          </h2>
          {status === 'success' && items.length > 0 && (
            <span className="similar-count" aria-label={`${items.length} products found`}>
              {items.length}
            </span>
          )}
        </div>

        {collapsible && (
          <div className="similar-header-right">
            <ToggleIcon expanded={isExpanded} />
          </div>
        )}
      </header>

      {/* Collapsible Content Wrapper */}
      <div
        id={contentId.current}
        className="similar-content"
        aria-hidden={collapsible ? !isExpanded : undefined}
      >
        <div className="similar-content-inner">
          {/* Loading State */}
          {status === 'loading' && (
            <div className="similar-skeleton-grid" role="status" aria-label="Loading similar products">
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
              <span className="sr-only">Loading similar products...</span>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="similar-error" role="alert">
              <div className="error-icon" aria-hidden="true">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <p className="error-message">{error}</p>
              <button className="retry-btn" onClick={handleRetry} type="button">
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {status === 'success' && items.length === 0 && (
            <div className="similar-empty" role="status">
              <div className="empty-icon" aria-hidden="true">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="empty-title">No similar products found</p>
              <p className="empty-subtitle">Try searching with different keywords</p>
            </div>
          )}

          {/* Product Grid */}
          {status === 'success' && items.length > 0 && (
            <div className="similar-grid" role="list">
              {items.map((product, idx) => (
                <ProductCard
                  key={getProductKey(product, idx)}
                  product={product}
                  index={idx}
                  onClick={onProductClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
