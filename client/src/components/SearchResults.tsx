import { Product } from "../types/product";
import ProductCard from "./ProductCard";

interface Props {
  results: Product[];
}

export default function SearchResults({ results }: Props) {
  if (!results.length) return null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "1.2rem",
      }}
    >
      {results.map((product) => (
        <ProductCard
          key={product.product_id}
          product={product}
        />
      ))}
    </div>
  );
}
