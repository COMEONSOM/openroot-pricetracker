import { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "../../types/product";

interface Props {
  title: string;
}

export default function SimilarProducts({ title }: Props) {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const res = await axios.post(
          "http://127.0.0.1:8000/api/search/similar",
          { title }
        );

        if (!mounted) return;

        const data: Product[] = res.data?.similar || [];
        setItems(data.slice(0, 12)); // HARD LIMIT FOR UI STABILITY
      } catch (err) {
        console.error("Failed loading similar products", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [title]);

  return (
    <section className="similar-root">

      {/* HEADER */}
      <header className="similar-header">
        {!loading && items.length > 0 && (
          <span className="similar-count">
            {items.length}
          </span>
        )}
      </header>

      {/* LOADING STATE */}
      {loading && (
        <div className="similar-skeleton-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="similar-skeleton-card" />
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && items.length === 0 && (
        <div className="similar-empty">
          No similar products found.
        </div>
      )}

      {/* GRID */}
      {!loading && items.length > 0 && (
        <div className="similar-grid">
          {items.map((p, idx) => (
            <article key={idx} className="similar-card">

              {/* IMAGE */}
              <div className="similar-image-wrapper">
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/placeholder.png";
                  }}
                />
              </div>

              {/* INFO */}
              <div className="similar-info">
                <p className="similar-title" title={p.title}>
                  {p.title}
                </p>

                <strong className="similar-price">
                  ₹{p.price?.toLocaleString()}
                </strong>
              </div>
            </article>
          ))}
        </div>
      )}

    </section>
  );
}
