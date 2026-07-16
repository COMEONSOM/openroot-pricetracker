import { useMemo, useState, useCallback, type CSSProperties } from 'react';
import "../../styles/PriceRangeBar.css";

interface PriceRangeBarProps {
  low: number;
  high: number;
  current: number;
  currency?: string;
  locale?: string;
  showLabels?: boolean;
  ariaLabel?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
}

type DealStatus = 'hot' | 'good' | 'fair' | 'high' | 'expensive';

interface DealConfig {
  color: string;
  gradient: string;
  label: string;
}

const DEAL_THRESHOLDS: Record<DealStatus, DealConfig> = {
  hot:       { color: '#199c66', gradient: 'linear-gradient(90deg, #199c66, #3cc282)', label: 'Great Deal' },
  good:      { color: '#0f7d8c', gradient: 'linear-gradient(90deg, #0f7d8c, #27a1b2)', label: 'Good Price' },
  fair:      { color: '#c0891b', gradient: 'linear-gradient(90deg, #c0891b, #e0aa38)', label: 'Fair Price' },
  high:      { color: '#d97706', gradient: 'linear-gradient(90deg, #d97706, #f59e0b)', label: 'Above Average' },
  expensive: { color: '#dc4a5b', gradient: 'linear-gradient(90deg, #dc4a5b, #f06d7b)', label: 'Expensive' },
};

function getDealStatus(percent: number): DealStatus {
  if (percent <= 15) return 'hot';
  if (percent <= 35) return 'good';
  if (percent <= 65) return 'fair';
  if (percent <= 85) return 'high';
  return 'expensive';
}

export default function PriceRangeBar({
  low,
  high,
  current,
  currency = '₹',
  locale = 'en-IN',
  showLabels = true,
  ariaLabel = 'Price range indicator',
  collapsible = false,
  defaultExpanded = true,
  onToggle,
}: PriceRangeBarProps) {

  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Toggle handler with useCallback for performance
  const handleToggle = useCallback(() => {
    setIsExpanded((prev) => {
      const newState = !prev;
      onToggle?.(newState);
      return newState;
    });
  }, [onToggle]);

  // Keyboard support for toggle
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  }, [handleToggle]);

  // Validation
  const isValidRange = useMemo(() => (
    Number.isFinite(low) &&
    Number.isFinite(high) &&
    Number.isFinite(current) &&
    high > low &&
    low >= 0
  ), [low, high, current]);

  // Memoized calculations
  const { clampedCurrent, percent, dealConfig, formattedPrices } = useMemo(() => {
    if (!isValidRange) {
      return { clampedCurrent: 0, percent: 0, dealConfig: DEAL_THRESHOLDS.fair, formattedPrices: { low: '', high: '', current: '' } };
    }

    const clamped = Math.min(Math.max(current, low), high);
    const pct = ((clamped - low) / (high - low)) * 100;
    const status = getDealStatus(pct);

    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency === '₹' ? 'INR' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    return {
      clampedCurrent: clamped,
      percent: pct,
      dealConfig: DEAL_THRESHOLDS[status],
      formattedPrices: {
        low: formatter.format(low),
        high: formatter.format(high),
        current: formatter.format(current),
      },
    };
  }, [low, high, current, currency, locale, isValidRange]);

  if (!isValidRange) return null;

  const indicatorStyle: CSSProperties = {
    left: `calc(${percent}% - 6px)`,
    '--indicator-color': dealConfig.color,
  } as CSSProperties;

  return (
    <section 
      className={`price-range-root ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}
      aria-label="Price Range Information"
    >
      {/* Toggle Header */}
      <div
        className="price-range-header"
        role={collapsible ? 'button' : undefined}
        tabIndex={collapsible ? 0 : undefined}
        aria-expanded={collapsible ? isExpanded : undefined}
        aria-controls={collapsible ? 'price-range-content' : undefined}
        onClick={collapsible ? handleToggle : undefined}
        onKeyDown={collapsible ? handleKeyDown : undefined}
      >
        {/* Status Badge */}
        <div 
          className="price-status-badge" 
          style={{ backgroundColor: `${dealConfig.color}20`, color: dealConfig.color }}
        >
          {dealConfig.label}
        </div>

        {/* Current Price & Toggle Icon */}
        <div className="price-header-right">
          <span className="price-current" style={{ color: dealConfig.color }}>
            {formattedPrices.current}
          </span>
          
          {collapsible && (
            <span className={`toggle-icon ${isExpanded ? 'expanded' : ''}`} aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path 
                  fillRule="evenodd" 
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" 
                  clipRule="evenodd" 
                />
              </svg>
            </span>
          )}
        </div>
      </div>

      {/* Collapsible Content */}
      <div 
        id="price-range-content"
        className="price-range-content"
        aria-hidden={collapsible ? !isExpanded : undefined}
      >
        {/* Progress Bar */}
        <div
          className="range-track-container"
          role="meter"
          aria-label={ariaLabel}
          aria-valuemin={low}
          aria-valuemax={high}
          aria-valuenow={clampedCurrent}
          aria-valuetext={`${formattedPrices.current} - ${dealConfig.label}`}
        >
          <div className="range-track">
            <div
              className="range-fill"
              style={{ width: `${percent}%`, background: dealConfig.gradient }}
            />
            <div className="range-indicator" style={indicatorStyle} />
          </div>
        </div>

        {/* Labels */}
        {showLabels && (
          <div className="range-labels">
            <span className="label-low">{formattedPrices.low}</span>
            <span className="label-high">{formattedPrices.high}</span>
          </div>
        )}
      </div>
    </section>
  );
}
