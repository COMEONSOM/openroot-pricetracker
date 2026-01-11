interface Props {
  low: number;
  high: number;
  current: number;
}

/* ======================================================
   PRICE RANGE BAR — VISUAL PRICE INTELLIGENCE
   - CLAMPS VALUES SAFELY
   - SHOWS LOW / HIGH LABELS
   - SMOOTH ANIMATION
   - ACCESSIBLE
====================================================== */

export default function PriceRangeBar({
  low,
  high,
  current,
}: Props) {

  /* ---------------- SAFETY GUARDS ---------------- */

  if (
    !Number.isFinite(low) ||
    !Number.isFinite(high) ||
    high <= low
  ) {
    return null;
  }

  const clampedCurrent = Math.min(
    Math.max(current, low),
    high
  );

  const percent =
    ((clampedCurrent - low) / (high - low)) * 100;

  /* ---------------- DEAL COLOR LOGIC ---------------- */

  let color = "#6366f1"; // default (fair)

  if (percent <= 20) color = "#22c55e";      // HOT (cheap)
  else if (percent >= 80) color = "#ef4444"; // EXPENSIVE

  return (
    <div
      className="price-range-root"
      role="progressbar"
      aria-valuemin={low}
      aria-valuemax={high}
      aria-valuenow={current}
    >

      {/* LABELS */}
      <div className="range-labels">
        <span>₹{low.toLocaleString()}</span>
        <span>₹{high.toLocaleString()}</span>
      </div>

      {/* TRACK */}
      <div className="range-track">

        {/* FILL */}
        <div
          className="range-fill"
          style={{
            width: `${percent}%`,
            background: color,
          }}
        />

        {/* INDICATOR */}
        <div
          className="range-indicator"
          style={{
            left: `${percent}%`,
            borderColor: color,
          }}
        />
      </div>

      {/* CURRENT VALUE */}
      <div className="range-current">
        Current: ₹{current.toLocaleString()}
      </div>
    </div>
  );
}
