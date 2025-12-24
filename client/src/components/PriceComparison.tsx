import { Product } from "../types/product";
import PriceRow from "./PriceRow";

interface Props {
  products: Product[];
}

export default function PriceComparison({ products }: Props) {
  if (!products.length) return null;

  const validPrices = products
    .map(p => p.price)
    .filter((p): p is number => typeof p === "number");

  const bestPrice =
    validPrices.length > 0 ? Math.min(...validPrices) : null;

  return (
    <div
      style={{
        marginTop: "3rem",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "1.4rem"
      }}
    >
      <h3 style={{ marginBottom: "1rem" }}>
        Best Price Comparison
      </h3>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
            <th style={{ padding: "0.8rem" }}>Platform</th>
            <th style={{ padding: "0.8rem" }}>Price</th>
            <th style={{ padding: "0.8rem" }}>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p, i) => (
            <PriceRow
              key={i}
              platform={p.platform}
              price={p.price}
              url={p.url}
              isBest={p.price !== null && p.price === bestPrice}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
