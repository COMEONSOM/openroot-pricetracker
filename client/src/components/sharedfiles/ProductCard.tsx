import { Product } from "../../types/product";
import "./ProductCard.css";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="product-card">
      {product.image && (
        <div className="product-image-wrapper">
          <img
            src={product.image}
            alt={product.title}
            className="product-image"
          />
        </div>
      )}

      <div className="product-details">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-platform">{product.platform}</p>

        <div className="product-bottom">
          <span className="product-price">
            ₹{product.price ?? "N/A"}
          </span>

          <a
            href={product.url}
            target="_blank"
            rel="noreferrer"
            className="product-link"
          >
            View Product
          </a>
        </div>
      </div>
    </div>
  );
}
