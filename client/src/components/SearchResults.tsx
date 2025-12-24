import { Product } from "../services/serpApi.service";
import ProductCard from "./ProductCard";

export default function SearchResults({ results }: { results: Product[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "1.2rem"
      }}
    >
      {results.map((p, i) => (
        <ProductCard key={i} {...p} />
      ))}
    </div>
  );
}
