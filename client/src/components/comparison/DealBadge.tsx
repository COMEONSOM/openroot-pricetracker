interface Props {
  deal: "HOT" | "FAIR" | "EXPENSIVE";
}

/* ======================================================
   DEAL BADGE — VISUAL PRICE SIGNAL
   - ACCESSIBLE
   - ICON DRIVEN
   - COLOR SAFE
   - FUTURE EXTENSIBLE
====================================================== */

const DEAL_META = {
  HOT: {
    label: "Hot Deal",
    icon: "🔥",
    description: "Great price compared to recent trend",
  },
  FAIR: {
    label: "Fair Price",
    icon: "👍",
    description: "Reasonably priced compared to market",
  },
  EXPENSIVE: {
    label: "Expensive",
    icon: "⚠️",
    description: "Priced higher than recent trend",
  },
} as const;

export default function DealBadge({ deal }: Props) {
  const meta = DEAL_META[deal];

  return (
    <span
      className={`deal-badge deal-${deal.toLowerCase()}`}
      role="status"
      aria-label={meta.description}
      title={meta.description}
    >
      <span className="deal-icon" aria-hidden>
        {meta.icon}
      </span>

      <span className="deal-text">
        {meta.label}
      </span>
    </span>
  );
}
