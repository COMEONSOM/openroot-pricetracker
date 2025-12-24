import { Product } from "../services/serpApi.service";

export default function ProductCard(product: Product) {
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "1.2rem",
        display: "flex",
        gap: "1rem",
        transition: "transform 0.15s ease, box-shadow 0.15s ease"
      }}
      onMouseEnter={e =>
        (e.currentTarget.style.transform = "translateY(-3px)")
      }
      onMouseLeave={e =>
        (e.currentTarget.style.transform = "translateY(0)")
      }
    >
      {product.image && (
        <img
          src={product.image}
          alt={product.title}
          style={{
            width: 90,
            height: 90,
            objectFit: "contain",
            background: "#fff",
            borderRadius: "10px",
            padding: "0.4rem"
          }}
        />
      )}

      <div style={{ flex: 1 }}>
        <h4 style={{ marginBottom: "0.3rem" }}>
          {product.title}
        </h4>

        <p style={{ fontSize: "0.85rem", textTransform: "capitalize" }}>
          {product.platform}
        </p>

        <div
          style={{
            marginTop: "0.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.8rem"
          }}
        >
          <strong
            style={{
              fontSize: "1.05rem",
              color: "var(--success)"
            }}
          >
            ₹{product.price ?? "N/A"}
          </strong>

          <a
            href={product.url}
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: "0.85rem",
              color: "var(--accent)"
            }}
          >
            View →
          </a>
        </div>
      </div>
    </div>
  );
}
