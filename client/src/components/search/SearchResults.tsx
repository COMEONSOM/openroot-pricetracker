import { Product } from "../../types/product";
import ProductCard from "../product/ProductCard";
import "../../styles/SearchResults.css";

interface Props {
  results: Product[];
}

export default function SearchResults({ results }: Props) {
  if (!results.length) return null;

  return (
    <div className="search-results-grid">
      {results.map((product) => (
        <ProductCard
          key={product.product_id}
          product={product}
        />
      ))}
    </div>
  );
}
