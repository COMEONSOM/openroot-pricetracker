"use client";

import "./../../styles/ComparisonDashboard.css";
import { useEffect, useMemo, useState, useCallback, memo } from "react";
import axios from "axios";
import { LinkSearchResult } from "../../types/linkSearch";
import { Product } from "../../types/product";
import DealBadge from "./DealBadge";
import SimilarProducts from "./SimilarProducts";
import PriceRangeBar from "./PriceRangeBar";
import PriceHistoryChart from "../otherfiles/PriceHistoryChart";

/* =======================
   TYPES
   ======================= */

interface Props {
  data: LinkSearchResult;
}

interface PlatformConfig {
  key: string;
  name: string;
  color: string;
  icon: string;
}

interface PriceAnalysis {
  lowestPrice: number;
  highestPrice: number;
  lowestPlatform: string;
  savings: number;
  savingsPercent: number;
  availableCount: number;
}

interface PriceHistoryPoint {
  date: string;
  price: number;
  platform?: string;
}

/* =======================
   CONSTANTS
   ======================= */

const PLATFORM_CONFIG: Record<string, PlatformConfig> = {
  amazon: { key: "amazon", name: "Amazon", color: "#ff9900", icon: "🛒" },
  flipkart: { key: "flipkart", name: "Flipkart", color: "#2874f0", icon: "🛍️" },
  meesho: { key: "meesho", name: "Meesho", color: "#570741", icon: "📦" },
};

const PLATFORMS_ORDER = ["amazon", "flipkart", "meesho"] as const;
type Platform = (typeof PLATFORMS_ORDER)[number];

const MAX_GALLERY_IMAGES = 12;
const PLACEHOLDER_IMAGE = "/placeholder.png";

/* =======================
   HELPER FUNCTIONS
   ======================= */

const formatPrice = (price: number | null | undefined): string => {
  if (price === null || price === undefined || isNaN(price)) {
    return "Price unavailable";
  }
  return `₹${price.toLocaleString("en-IN")}`;
};

const getPlatformConfig = (platform: string): PlatformConfig => {
  const key = platform.toLowerCase().trim();
  return PLATFORM_CONFIG[key] || {
    key,
    name: platform.charAt(0).toUpperCase() + platform.slice(1),
    color: "#6b7280",
    icon: "🏪",
  };
};

const buildImageGallery = (
  images: string[] = [],
  products: (Product | null | undefined)[]
): string[] => {
  const unique = new Set<string>();
  images.forEach((img) => {
    if (img && typeof img === "string" && img.trim()) {
      unique.add(img.trim());
    }
  });
  products.forEach((product) => {
    if (product?.image && typeof product.image === "string") {
      unique.add(product.image.trim());
    }
  });
  return Array.from(unique).slice(0, MAX_GALLERY_IMAGES);
};

const selectPrimaryProduct = (
  matches: Partial<Record<Platform, Product | null>>,
  unavailable: string[] = []
): Product | null => {
  const availableProducts = PLATFORMS_ORDER
    .filter((platform) => {
      const product = matches[platform];
      return product && !unavailable.includes(platform) && product.price;
    })
    .map((platform) => ({ platform, product: matches[platform]! }));

  if (availableProducts.length > 0) {
    availableProducts.sort((a, b) => (a.product.price || 0) - (b.product.price || 0));
    return availableProducts[0].product;
  }

  for (const platform of PLATFORMS_ORDER) {
    if (matches[platform]) return matches[platform]!;
  }
  return null;
};

const analyzePrices = (
  matches: Partial<Record<Platform, Product | null>>,
  unavailable: string[] = []
): PriceAnalysis | null => {
  const validPrices: { platform: string; price: number }[] = [];

  PLATFORMS_ORDER.forEach((platform) => {
    const product = matches[platform];
    if (product?.price && !unavailable.includes(platform)) {
      validPrices.push({ platform, price: product.price });
    }
  });

  if (validPrices.length === 0) return null;

  const sorted = [...validPrices].sort((a, b) => a.price - b.price);
  const lowest = sorted[0];
  const highest = sorted[sorted.length - 1];
  const savings = highest.price - lowest.price;

  return {
    lowestPrice: lowest.price,
    highestPrice: highest.price,
    lowestPlatform: lowest.platform,
    savings,
    savingsPercent: highest.price > 0 ? Math.round((savings / highest.price) * 100) : 0,
    availableCount: validPrices.length,
  };
};

/* =======================
   SUB-COMPONENTS
   ======================= */

interface ImageGalleryProps {
  images: string[];
  activeImage: string;
  productTitle: string;
  onImageSelect: (img: string) => void;
}

const ImageGallery = memo(function ImageGallery({
  images, activeImage, productTitle, onImageSelect,
}: ImageGalleryProps) {
  return (
    <div className="product-media">
      <div className="product-main-image-wrapper">
        {activeImage ? (
          <img
            src={activeImage}
            alt={productTitle}
            className="product-main-image"
            loading="eager"
            onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
          />
        ) : (
          <div className="image-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
              <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1.5" />
              <path d="M21 15l-5-5L5 21" strokeWidth="1.5" />
            </svg>
            <span>Image unavailable</span>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="product-thumbs" role="list" aria-label="Product images">
          {images.map((img, idx) => (
            <button
              key={`thumb-${idx}`}
              type="button"
              className={`thumb ${img === activeImage ? "active" : ""}`}
              onClick={() => onImageSelect(img)}
              aria-label={`View image ${idx + 1}`}
              aria-pressed={img === activeImage}
            >
              <img
                src={img}
                alt=""
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

interface PriceCardProps {
  label: string;
  price: number | null | undefined;
  highlight?: boolean;
  sublabel?: string;
}

const PriceCard = memo(function PriceCard({ label, price, highlight, sublabel }: PriceCardProps) {
  return (
    <div className={`price-card ${highlight ? "price-card--highlight" : ""}`}>
      <span className="price-card__label">{label}</span>
      <strong className="price-card__value">{formatPrice(price)}</strong>
      {sublabel && <span className="price-card__sublabel">{sublabel}</span>}
    </div>
  );
});

interface PlatformCardProps {
  platform: Platform;
  product: Product | null | undefined;
  isUnavailable: boolean;
  isLowest: boolean;
  onBuy: (url: string) => void;
}

const PlatformCard = memo(function PlatformCard({
  platform, product, isUnavailable, isLowest, onBuy,
}: PlatformCardProps) {
  const config = getPlatformConfig(platform);
  const hasPrice = product?.price && !isUnavailable;

  return (
    <div
      className={`compare-card ${isLowest ? "compare-card--best" : ""} ${isUnavailable ? "compare-card--unavailable" : ""}`}
      style={{ "--platform-color": config.color } as React.CSSProperties}
    >
      {isLowest && hasPrice && <div className="compare-card__badge">Best Price</div>}

      <div className="compare-card__header">
        <span className="compare-card__icon" aria-hidden="true">{config.icon}</span>
        <span className="compare-card__platform">{config.name}</span>
      </div>

      <div className="compare-card__price">{hasPrice ? formatPrice(product!.price) : "--"}</div>

      <div className={`compare-card__status ${isUnavailable ? "status--out" : "status--in"}`}>
        <span className="status__dot" />
        {isUnavailable ? "Out of Stock" : "In Stock"}
      </div>

      {product?.url && !isUnavailable && (
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`compare-card__btn ${isLowest ? "compare-card__btn--primary" : ""}`}
          onClick={() => onBuy(product.url)}
        >
          {isLowest ? "Buy Now" : "View"}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path d="M7 17L17 7M17 7H7M17 7V17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      )}
    </div>
  );
});

interface SavingsBannerProps {
  analysis: PriceAnalysis;
}

const SavingsBanner = memo(function SavingsBanner({ analysis }: SavingsBannerProps) {
  if (analysis.savings <= 0) return null;
  const config = getPlatformConfig(analysis.lowestPlatform);

  return (
    <div className="savings-banner">
      <div className="savings-banner__icon" aria-hidden="true">💰</div>
      <div className="savings-banner__content">
        <strong className="savings-banner__amount">Save {formatPrice(analysis.savings)}</strong>
        <span className="savings-banner__details">
          ({analysis.savingsPercent}% cheaper on <span style={{ color: config.color }}>{config.name}</span>)
        </span>
      </div>
    </div>
  );
});

const EmptyState = memo(function EmptyState() {
  return (
    <div className="comparison-empty">
      <div className="comparison-empty__icon" aria-hidden="true">📦</div>
      <h2 className="comparison-empty__title">No Product Data Available</h2>
      <p className="comparison-empty__text">We couldn't find this product on any platform. Please try a different link.</p>
    </div>
  );
});

/* =======================
   MAIN COMPONENT
   ======================= */

function ComparisonDashboard({ data }: Props) {
  const [activeImage, setActiveImage] = useState<string>("");
  const [showSimilar, setShowSimilar] = useState(false);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryPoint[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const { matches = {}, intelligence, unavailable = [], images = [], query = "" } = data || {};

  const primaryProduct = useMemo(() => selectPrimaryProduct(matches, unavailable), [matches, unavailable]);
  const galleryImages = useMemo(() => buildImageGallery(images, [matches.amazon, matches.flipkart, matches.meesho]), [images, matches]);
  const priceAnalysis = useMemo(() => analyzePrices(matches, unavailable), [matches, unavailable]);

  const platformsData = useMemo(() => {
    return PLATFORMS_ORDER.map((platform) => ({
      platform,
      product: matches[platform] || null,
      isUnavailable: unavailable.includes(platform),
      isLowest: priceAnalysis?.lowestPlatform === platform && !!matches[platform]?.price,
    }));
  }, [matches, unavailable, priceAnalysis]);

  useEffect(() => {
    if (galleryImages.length > 0 && !activeImage) {
      setActiveImage(galleryImages[0]);
    }
  }, [galleryImages, activeImage]);

  useEffect(() => {
    setActiveImage(galleryImages[0] || "");
    setShowSimilar(false);
    setPriceHistory([]);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch price history when primary product changes
  useEffect(() => {
    if (!primaryProduct?.product_id) return;

    const fetchHistory = async () => {
      setHistoryLoading(true);
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/history/${primaryProduct.product_id}`);
        if (Array.isArray(res.data)) {
          setPriceHistory(res.data);
        }
      } catch (err) {
        console.log("No price history available");
        setPriceHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchHistory();
  }, [primaryProduct?.product_id]);

  const handleImageSelect = useCallback((img: string) => setActiveImage(img), []);
  const handleToggleSimilar = useCallback(() => setShowSimilar((prev) => !prev), []);
  const handleBuyClick = useCallback((url: string) => console.log("Buy clicked:", url), []);

  if (!primaryProduct) {
    return <div className="comparison-root"><EmptyState /></div>;
  }

  return (
    <div className="comparison-root">
      <section className="product-panel" aria-label="Product details">
        <ImageGallery
          images={galleryImages}
          activeImage={activeImage}
          productTitle={primaryProduct.title}
          onImageSelect={handleImageSelect}
        />

        <div className="product-info">
          <header className="product-header">
            <h1 className="product-title">{primaryProduct.title}</h1>
            {intelligence?.deal && <DealBadge deal={intelligence.deal} />}
          </header>

          <div className="price-cards">
            <PriceCard
              label="Best Price"
              price={priceAnalysis?.lowestPrice || primaryProduct.price}
              highlight
              sublabel={priceAnalysis ? `on ${getPlatformConfig(priceAnalysis.lowestPlatform).name}` : undefined}
            />
            {intelligence && (
              <>
                <PriceCard label="52W Low" price={intelligence.low_52w} />
                <PriceCard label="52W High" price={intelligence.high_52w} />
              </>
            )}
          </div>

          {intelligence && primaryProduct.price && (
            <PriceRangeBar
              low={intelligence.low_52w}
              high={intelligence.high_52w}
              current={priceAnalysis?.lowestPrice || primaryProduct.price}
            />
          )}

          <div className="product-actions">
            {priceAnalysis && (
              <a
                href={matches[priceAnalysis.lowestPlatform as Platform]?.url || primaryProduct.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Buy at Best Price
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <path d="M7 17L17 7M17 7H7M17 7V17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}
            <button type="button" className="btn-secondary" disabled title="Price tracking coming soon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path d="M12 8v4l3 3" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="9" strokeWidth="2" />
              </svg>
              Track Price
            </button>
          </div>
        </div>
      </section>

      {priceAnalysis && <SavingsBanner analysis={priceAnalysis} />}

      {/* Price History Chart */}
      {priceHistory.length > 0 && (
        <section className="price-history-section" aria-label="Price history">
          <PriceHistoryChart data={priceHistory} />
        </section>
      )}
      {historyLoading && (
        <div className="price-history-loading">
          <span>Loading price history...</span>
        </div>
      )}

      <section className="comparison-section" aria-label="Price comparison">
        <div className="comparison-section__header">
          <h2 className="comparison-section__title">
            <span aria-hidden="true">📊</span> Compare Prices
          </h2>
          <p className="comparison-section__subtitle">
            {priceAnalysis
              ? `Available on ${priceAnalysis.availableCount} of ${PLATFORMS_ORDER.length} platforms`
              : "Checking availability..."}
          </p>
        </div>

        <div className="compare-grid">
          {platformsData.map(({ platform, product, isUnavailable, isLowest }) => (
            <PlatformCard
              key={platform}
              platform={platform}
              product={product}
              isUnavailable={isUnavailable}
              isLowest={isLowest}
              onBuy={handleBuyClick}
            />
          ))}
        </div>
      </section>

      <section className="similar-section">
        <button
          type="button"
          className="similar-toggle"
          onClick={handleToggleSimilar}
          aria-expanded={showSimilar}
          aria-controls="similar-products"
        >
          <span className="similar-toggle__icon" aria-hidden="true">{showSimilar ? "▼" : "▶"}</span>
          {showSimilar ? "Hide Similar Products" : "Show Similar Products"}
        </button>

        {showSimilar && (
          <div id="similar-products" className="similar-panel">
            <SimilarProducts title={query || primaryProduct.title} />
          </div>
        )}
      </section>
    </div>
  );
}

export default memo(ComparisonDashboard);
