// src/components/PriceCard.tsx
// Example of correctly consuming design tokens instead of hardcoded colors.
import { ThemeToggle } from "./ThemeToggle";

interface PriceCardProps {
  productName: string;
  currentPrice: number;
  previousPrice: number;
}

export function PriceCard({ productName, currentPrice, previousPrice }: PriceCardProps) {
  const dropped = currentPrice < previousPrice;

  return (
    <article className="card card--interactive" style={{ padding: "var(--space-5)" }}>
      <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-3)" }}>
        <h3 style={{ fontSize: "var(--text-lg)" }}>{productName}</h3>
        <ThemeToggle />
      </div>

      <p className="text-secondary" style={{ marginBottom: "var(--space-2)" }}>
        Tracked price history
      </p>

      <div className="flex items-center gap-3">
        <span
          className="gradient-text"
          style={{ fontSize: "var(--text-2xl)", fontWeight: 700 }}
        >
          ${currentPrice.toFixed(2)}
        </span>

        <span
          className={dropped ? "badge badge--success" : "badge badge--gray"}
          style={{ borderColor: "var(--border-default)" }}
        >
          {dropped ? "Price dropped" : "No change"}
        </span>
      </div>

      <hr className="divider" style={{ margin: "var(--space-4) 0" }} />

      <button className="button button--primary w-full">
        View details
      </button>
    </article>
  );
}