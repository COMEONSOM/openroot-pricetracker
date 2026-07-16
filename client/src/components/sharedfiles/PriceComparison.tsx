"use client";

import { memo, useMemo, useState, useCallback } from "react";
import { Product } from "../../types/product";
import "../../styles/PriceComparison.css";

/* =======================
   TYPES
   ======================= */

interface PriceComparisonProps {
  products: Product[];
}

interface PriceStats {
  best: number | null;
  worst: number | null;
  average: number | null;
  savings: number | null;
  savingsPercent: number | null;
}

interface ProcessedProduct extends Product {
  isBest: boolean;
  isWorst: boolean;
  priceDiff: number | null;
  priceDiffPercent: number | null;
}

type SortKey = "price" | "platform" | "savings";
type SortOrder = "asc" | "desc";

/* =======================
   HELPERS
   ======================= */

const formatPrice = (price: number | null | undefined): string => {
  if (price === null || price === undefined) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

const getPlatformInfo = (platform: string): { name: string; color: string; logo: string } => {
  const platforms: Record<string, { name: string; color: string; logo: string }> = {
    amazon: { name: "Amazon", color: "#ff9900", logo: "🛒" },
    flipkart: { name: "Flipkart", color: "#2874f0", logo: "🛍️" },
    myntra: { name: "Myntra", color: "#ff3f6c", logo: "👗" },
    ajio: { name: "AJIO", color: "#000000", logo: "👔" },
    meesho: { name: "Meesho", color: "#570741", logo: "🎁" },
    snapdeal: { name: "Snapdeal", color: "#e40046", logo: "📦" },
    croma: { name: "Croma", color: "#0f7c35", logo: "📱" },
    reliance: { name: "Reliance Digital", color: "#003380", logo: "🔌" },
  };
  
  const key = platform.toLowerCase().trim();
  return platforms[key] || { name: platform, color: "var(--color-primary)", logo: "🏷️" };
};

const calculateStats = (products: Product[]): PriceStats => {
  const validPrices = products
    .map(p => p.price)
    .filter((p): p is number => typeof p === "number" && p > 0);

  if (validPrices.length === 0) {
    return { best: null, worst: null, average: null, savings: null, savingsPercent: null };
  }

  const best = Math.min(...validPrices);
  const worst = Math.max(...validPrices);
  const average = Math.round(validPrices.reduce((a, b) => a + b, 0) / validPrices.length);
  const savings = worst - best;
  const savingsPercent = Math.round((savings / worst) * 100);

  return { best, worst, average, savings, savingsPercent };
};

const processProducts = (products: Product[], stats: PriceStats): ProcessedProduct[] => {
  return products.map(product => {
    const isBest = product.price === stats.best && product.price !== null;
    const isWorst = product.price === stats.worst && product.price !== null && stats.best !== stats.worst;
    
    let priceDiff: number | null = null;
    let priceDiffPercent: number | null = null;
    
    if (product.price !== null && stats.best !== null && product.price !== stats.best) {
      priceDiff = product.price - stats.best;
      priceDiffPercent = Math.round((priceDiff / stats.best) * 100);
    }

    return { ...product, isBest, isWorst, priceDiff, priceDiffPercent };
  });
};

/* =======================
   SUB-COMPONENTS
   ======================= */

const StatsCard = memo(({ stats }: { stats: PriceStats }) => (
  <div className="price-comparison__stats">
    <div className="price-comparison__stat price-comparison__stat--best">
      <span className="price-comparison__stat-label">Best Price</span>
      <span className="price-comparison__stat-value">{formatPrice(stats.best)}</span>
    </div>
    
    <div className="price-comparison__stat">
      <span className="price-comparison__stat-label">Average</span>
      <span className="price-comparison__stat-value">{formatPrice(stats.average)}</span>
    </div>
    
    <div className="price-comparison__stat">
      <span className="price-comparison__stat-label">Highest</span>
      <span className="price-comparison__stat-value">{formatPrice(stats.worst)}</span>
    </div>
    
    {stats.savings !== null && stats.savings > 0 && (
      <div className="price-comparison__stat price-comparison__stat--savings">
        <span className="price-comparison__stat-label">You Save</span>
        <span className="price-comparison__stat-value">
          {formatPrice(stats.savings)}
          <span className="price-comparison__stat-percent">({stats.savingsPercent}%)</span>
        </span>
      </div>
    )}
  </div>
));
StatsCard.displayName = "StatsCard";

const PlatformBadge = memo(({ platform }: { platform: string }) => {
  const { name, color, logo } = getPlatformInfo(platform);
  
  return (
    <div className="price-comparison__platform">
      <span 
        className="price-comparison__platform-logo"
        style={{ "--platform-color": color } as React.CSSProperties}
      >
        {logo}
      </span>
      <span className="price-comparison__platform-name">{name}</span>
    </div>
  );
});
PlatformBadge.displayName = "PlatformBadge";

const PriceCell = memo(({ product }: { product: ProcessedProduct }) => {
  const { price, isBest, priceDiff, priceDiffPercent } = product;

  return (
    <div className={`price-comparison__price ${isBest ? "price-comparison__price--best" : ""}`}>
      <span className="price-comparison__price-value">
        {formatPrice(price)}
        {isBest && <span className="price-comparison__best-badge">Best</span>}
      </span>
      
      {priceDiff !== null && priceDiffPercent !== null && (
        <span className="price-comparison__price-diff">
          +{formatPrice(priceDiff)} ({priceDiffPercent}% more)
        </span>
      )}
    </div>
  );
});
PriceCell.displayName = "PriceCell";

const ActionButton = memo(({ url, isBest }: { url: string; isBest: boolean }) => {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  }, [url]);

  return (
    <button
      type="button"
      className={`price-comparison__action ${isBest ? "price-comparison__action--best" : ""}`}
      onClick={handleClick}
    >
      {isBest ? "Buy Now" : "View"}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path d="M7 17L17 7M17 7H7M17 7V17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
});
ActionButton.displayName = "ActionButton";

const TableRow = memo(({ product, index }: { product: ProcessedProduct; index: number }) => (
  <tr 
    className={`price-comparison__row ${product.isBest ? "price-comparison__row--best" : ""}`}
    style={{ "--row-index": index } as React.CSSProperties}
  >
    <td className="price-comparison__cell">
      <PlatformBadge platform={product.platform} />
    </td>
    <td className="price-comparison__cell">
      <PriceCell product={product} />
    </td>
    <td className="price-comparison__cell price-comparison__cell--action">
      <ActionButton url={product.url} isBest={product.isBest} />
    </td>
  </tr>
));
TableRow.displayName = "TableRow";

const MobileCard = memo(({ product, index }: { product: ProcessedProduct; index: number }) => {
  const { name, color, logo } = getPlatformInfo(product.platform);

  const handleClick = useCallback(() => {
    window.open(product.url, "_blank", "noopener,noreferrer");
  }, [product.url]);

  return (
    <div 
      className={`price-comparison__card ${product.isBest ? "price-comparison__card--best" : ""}`}
      style={{ "--card-index": index, "--platform-color": color } as React.CSSProperties}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      {product.isBest && <div className="price-comparison__card-ribbon">Best Deal</div>}
      
      <div className="price-comparison__card-header">
        <span className="price-comparison__card-logo">{logo}</span>
        <span className="price-comparison__card-platform">{name}</span>
      </div>
      
      <div className="price-comparison__card-price">{formatPrice(product.price)}</div>
      
      {product.priceDiff !== null && (
        <div className="price-comparison__card-diff">+{formatPrice(product.priceDiff)} more</div>
      )}
      
      <div className="price-comparison__card-action">
        {product.isBest ? "Buy Now →" : "View Deal →"}
      </div>
    </div>
  );
});
MobileCard.displayName = "MobileCard";

/* =======================
   MAIN COMPONENT
   ======================= */

function PriceComparison({ products }: PriceComparisonProps) {
  const [sortKey, setSortKey] = useState<SortKey>("price");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const stats = useMemo(() => calculateStats(products), [products]);

  const processedProducts = useMemo(() => {
    const processed = processProducts(products, stats);
    
    return [...processed].sort((a, b) => {
      let comparison = 0;
      
      switch (sortKey) {
        case "price":
          comparison = (a.price ?? Infinity) - (b.price ?? Infinity);
          break;
        case "platform":
          comparison = a.platform.localeCompare(b.platform);
          break;
        case "savings":
          comparison = (a.priceDiff ?? Infinity) - (b.priceDiff ?? Infinity);
          break;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [products, stats, sortKey, sortOrder]);

  const handleSort = useCallback((key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  }, [sortKey]);

  if (!products.length) return null;

  return (
    <section className="price-comparison" aria-label="Price comparison">
      <div className="price-comparison__header">
        <div className="price-comparison__title-group">
          <h2 className="price-comparison__title">
            Price Comparison
          </h2>
          <p className="price-comparison__subtitle">
            Comparing {products.length} {products.length === 1 ? "store" : "stores"}
          </p>
        </div>
      </div>

      <StatsCard stats={stats} />

      {/* Desktop Table */}
      <div className="price-comparison__table-wrapper">
        <table className="price-comparison__table">
          <thead className="price-comparison__thead">
            <tr>
              <th className="price-comparison__th" onClick={() => handleSort("platform")}>
                <span>Store</span>
              </th>
              <th className="price-comparison__th" onClick={() => handleSort("price")}>
                <span>Price</span>
              </th>
              <th className="price-comparison__th price-comparison__th--action">Action</th>
            </tr>
          </thead>
          <tbody className="price-comparison__tbody">
            {processedProducts.map((product, index) => (
              <TableRow key={`${product.platform}-${index}`} product={product} index={index} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="price-comparison__cards">
        {processedProducts.map((product, index) => (
          <MobileCard key={`${product.platform}-${index}`} product={product} index={index} />
        ))}
      </div>

      {stats.savings !== null && stats.savings > 0 && (
        <div className="price-comparison__tip">
          <span className="price-comparison__tip-icon" aria-hidden="true">💡</span>
          <span>
            Shop smart! You could save up to <strong>{formatPrice(stats.savings)}</strong> by choosing the best deal.
          </span>
        </div>
      )}
    </section>
  );
}

export default memo(PriceComparison);
