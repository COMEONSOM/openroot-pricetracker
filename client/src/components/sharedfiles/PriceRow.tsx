interface Props {
  platform: string;
  price: number | null;
  url: string;
  isBest: boolean;
}

export default function PriceRow({ platform, price, url, isBest }: Props) {
  return (
    <tr
      style={{
        background: isBest
          ? "var(--success-soft)"
          : "transparent",
        borderRadius: "8px"
      }}
    >
      <td style={{ padding: "0.9rem", textTransform: "capitalize" }}>
        {platform}
      </td>

      <td
        style={{
          padding: "0.9rem",
          fontWeight: isBest ? 600 : 400,
          color: isBest ? "var(--success)" : "var(--text)"
        }}
      >
        ₹{price ?? "N/A"}
        {isBest && (
          <span
            style={{
              marginLeft: "0.5rem",
              fontSize: "0.75rem",
              color: "var(--success)"
            }}
          >
            BEST
          </span>
        )}
      </td>

      <td style={{ padding: "0.9rem" }}>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          style={{
            color: "var(--accent)",
            fontSize: "0.85rem"
          }}
        >
          Buy →
        </a>
      </td>
    </tr>
  );
}
