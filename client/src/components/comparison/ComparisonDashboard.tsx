import "./../../styles/Comparison.css";
import { useEffect, useMemo, useState } from "react";
import { LinkSearchResult } from "../../types/linkSearch";
import { Product } from "../../types/product";
import DealBadge from "./DealBadge";
import SimilarProducts from "./SimilarProducts";
import PriceRangeBar from "./PriceRangeBar";

interface Props {
  data: LinkSearchResult;
}

type Platform = "amazon" | "flipkart" | "meesho";

export default function ComparisonDashboard({ data }: Props) {
  const [showSimilar, setShowSimilar] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const { matches, intelligence, unavailable, images = [] } = data;

  /* ======================================================
     PRIMARY PRODUCT SELECTION
  ====================================================== */

  const primaryProduct: Product | null = useMemo(() => {
    return (
      matches.amazon ||
      matches.flipkart ||
      matches.meesho ||
      null
    );
  }, [matches]);

  /* ======================================================
     IMAGE GALLERY BUILD
  ====================================================== */

  const galleryImages: string[] = useMemo(() => {
    const unique = new Set<string>();

    images.forEach((img) => img && unique.add(img));
    if (primaryProduct?.image) unique.add(primaryProduct.image);

    return Array.from(unique).slice(0, 12); // hard cap for perf
  }, [images, primaryProduct]);

  const displayImage =
    activeImage || galleryImages[0] || "";

  /* Auto select first image when gallery updates */
  useEffect(() => {
    if (galleryImages.length > 0) {
      setActiveImage(galleryImages[0]);
    }
  }, [galleryImages]);

  /* ======================================================
     GUARD STATE
  ====================================================== */

  if (!primaryProduct) {
    return (
      <div className="comparison-root">
        <h2>No product data available yet.</h2>
        <p>Waiting for SERP results…</p>
      </div>
    );
  }

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <div className="comparison-root">

      {/* ================= PRODUCT PANEL ================= */}
      <section className="product-panel">

        {/* IMAGE ZONE */}
        <div className="product-media">

          {displayImage ? (
            <img
              src={displayImage}
              alt={primaryProduct.title}
              className="product-main-image"
              loading="eager"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/placeholder.png";
              }}
            />
          ) : (
            <div className="image-placeholder">
              Image unavailable
            </div>
          )}

          {/* THUMB STRIP */}
          {galleryImages.length > 1 && (
            <div
              className="product-thumbs"
              role="list"
              aria-label="Product images"
            >
              {galleryImages.map((img, idx) => (
                <button
                  key={img + idx}
                  type="button"
                  className={`thumb ${
                    img === displayImage ? "active" : ""
                  }`}
                  onClick={() => setActiveImage(img)}
                  aria-label={`Preview image ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt={`Preview ${idx + 1}`}
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INFO ZONE */}
        <div className="product-info">

          <header className="product-header">
            <h1 className="product-title">
              {primaryProduct.title}
            </h1>

            {intelligence && (
              <DealBadge deal={intelligence.deal} />
            )}
          </header>

          {/* PRICE SUMMARY */}
          <div className="price-cards">
            <div className="price-card">
              <span>Current Price</span>
              <strong>
                ₹{primaryProduct.price?.toLocaleString()}
              </strong>
            </div>

            {intelligence && (
              <>
                <div className="price-card">
                  <span>52W Low</span>
                  <strong>
                    ₹{intelligence.low_52w.toLocaleString()}
                  </strong>
                </div>

                <div className="price-card">
                  <span>52W High</span>
                  <strong>
                    ₹{intelligence.high_52w.toLocaleString()}
                  </strong>
                </div>
              </>
            )}
          </div>

          {/* PRICE RANGE BAR */}
          {intelligence && primaryProduct.price && (
            <PriceRangeBar
              low={intelligence.low_52w}
              high={intelligence.high_52w}
              current={primaryProduct.price}
            />
          )}

          {/* ACTIONS */}
          <div className="product-actions">
            <a
              href={primaryProduct.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Buy Now
            </a>

            <button
              type="button"
              className="btn-secondary"
              disabled
              title="Tracking coming soon"
            >
              Track Price
            </button>
          </div>
        </div>
      </section>

      {/* ================= COMPARE PRICES ================= */}
      <section className="comparison-table">
        <h3>Compare Prices</h3>

        <div className="compare-grid">
          {(Object.keys(matches) as Platform[]).map(
            (platform) => {
              const product = matches[platform];
              const isUnavailable =
                unavailable.includes(platform);

              return (
                <div
                  key={platform}
                  className="compare-card"
                >
                  <div className="compare-platform">
                    {platform.toUpperCase()}
                  </div>

                  <div className="compare-price">
                    {product?.price
                      ? `₹${product.price.toLocaleString()}`
                      : "--"}
                  </div>

                  <div
                    className={`compare-status ${
                      isUnavailable
                        ? "status-out"
                        : "status-in"
                    }`}
                  >
                    {isUnavailable
                      ? "Out of Stock"
                      : "Available"}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </section>

      {/* ================= SIMILAR CTA ================= */}
      <section className="similar-cta">
        <button
          className="similar-btn"
          type="button"
          onClick={() => setShowSimilar(prev => !prev)}
        >
          {showSimilar
            ? "Hide Similar Products"
            : "Show Similar Products"}
        </button>
      </section>

      {/* ================= SIMILAR GRID ================= */}
      {showSimilar && (
        <div className="similar-root">
          <SimilarProducts title={data.query} />
        </div>
      )}

    </div>
  );
}
