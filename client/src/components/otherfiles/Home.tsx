"use client";

import "../../styles/Home.css";
import { useEffect, useRef, useCallback, memo } from "react";
import { ErrorBoundary } from "react-error-boundary";

/* =======================
   COMPONENT IMPORTS
   ======================= */

import Header from "./Header";
import Footer from "./Footer";
import SkeletonLoader from "./SkeletonLoader";
import TextSearch from "../TextSearch";
import SearchResults from "../sharedfiles/SearchResults";
import ComparisonDashboard from "../sharedfiles/ComparisonDashboard";
import { useSearch } from "../../hooks/useSearch";
import { Product } from "../../types/product";
import { LinkSearchResult } from "../../types/linkSearch";

/* =======================
   TYPES
   ======================= */

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

/* =======================
   ERROR FALLBACK COMPONENT
   ======================= */

const ErrorFallback = memo(({ error, resetErrorBoundary }: ErrorFallbackProps) => (
  <div className="home-error-boundary" role="alert">
    <div className="home-error-boundary__content">
      <span className="home-error-boundary__icon" aria-hidden="true">⚠️</span>
      <h2 className="home-error-boundary__title">Something went wrong</h2>
      <p className="home-error-boundary__message">{error.message}</p>
      <button
        type="button"
        className="home-error-boundary__retry"
        onClick={resetErrorBoundary}
      >
        Try Again
      </button>
    </div>
  </div>
));
ErrorFallback.displayName = "ErrorFallback";

/* =======================
   SEARCH ERROR COMPONENT
   ======================= */

const SearchError = memo(({ message }: { message: string }) => (
  <div className="home-error" role="alert" aria-live="polite">
    <span className="home-error__icon" aria-hidden="true">!</span>
    <p className="home-error__message">{message}</p>
  </div>
));
SearchError.displayName = "SearchError";

/* =======================
   SEARCH HINTS COMPONENT
   ======================= */

const SearchHints = memo(() => (
  <div className="home__search-hints">
    <div className="home__hint">
      <span className="home__hint-icon" aria-hidden="true">🔍</span>
      <span className="home__hint-text">
        <strong>Text search:</strong> Find similar products
      </span>
    </div>
    <div className="home__hint">
      <span className="home__hint-icon" aria-hidden="true">🔗</span>
      <span className="home__hint-text">
        <strong>Link search:</strong> Compare exact product prices
      </span>
    </div>
  </div>
));
SearchHints.displayName = "SearchHints";

/* =======================
   TEXT SEARCH RESULTS
   Shows similar products grid — NO price comparison
   (Products are similar, not identical)
   ======================= */

interface TextResultsProps {
  results: Product[];
}

const TextSearchResults = memo(({ results }: TextResultsProps) => {
  if (results.length === 0) return null;

  const platformCount = new Set(results.map(p => p.platform.toLowerCase())).size;

  return (
    <section className="home-results" aria-label="Search results">
      <div className="home-results__header">
        <h2 className="home-results__title">
          <span className="home-results__icon" aria-hidden="true">🔍</span>
          Similar Products Found
          <span className="home-results__count">{results.length} items</span>
        </h2>
        <p className="home-results__description">
          Showing similar products from {platformCount} platform{platformCount !== 1 ? "s" : ""}.
          {" "}For exact price comparison of a specific product, paste its direct link.
        </p>
      </div>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <SearchResults results={results} />
      </ErrorBoundary>
    </section>
  );
});
TextSearchResults.displayName = "TextSearchResults";

/* =======================
   LINK SEARCH RESULTS
   Shows exact product comparison WITH price table
   (Products are identical across platforms)
   ======================= */

interface LinkResultsProps {
  data: LinkSearchResult;
}

const LinkSearchResults = memo(({ data }: LinkResultsProps) => {
  if (!data) return null;

  return (
    <section className="home-results" aria-label="Price comparison results">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ComparisonDashboard data={data} />
      </ErrorBoundary>
    </section>
  );
});
LinkSearchResults.displayName = "LinkSearchResults";

/* =======================
   LOADING STATE COMPONENT
   ======================= */

interface LoadingStateProps {
  variant: "text" | "link";
}

const LoadingState = memo(({ variant }: LoadingStateProps) => (
  <div className="home__loading" aria-busy="true" aria-live="polite">
    <SkeletonLoader variant={variant} />
  </div>
));
LoadingState.displayName = "LoadingState";

/* =======================
   MAIN COMPONENT
   ======================= */

export default function Home() {
  /* ---- State & Hooks ---- */
  const {
    textResults,
    linkResult,
    imageResult,
    loading,
    error,
    searchMode,
    searchByText,
    searchByLink,
    searchByImage,
    clearError,
    isIdle,
    isTextSearch,
    isLinkSearch,
    isImageSearch,
  } = useSearch();

  const resultsRef = useRef<HTMLDivElement>(null);

  /* ---- Derived State ---- */
  const hasTextResults = textResults.length > 0;
  const hasLinkResult = linkResult !== null;
  const hasImageResult = imageResult !== null && imageResult.count > 0;
  const hasResults = hasTextResults || hasLinkResult || hasImageResult;
  const showResults = !loading && !error && hasResults;

  // Skeleton variant based on current search mode
  const skeletonVariant = isLinkSearch ? "link" : isImageSearch ? "text" : "text";

  /* ---- Effects ---- */

  // Scroll to results section when search starts or completes
  useEffect(() => {
    if (!loading && !hasResults) return;

    const scrollTimeout = setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);

    return () => clearTimeout(scrollTimeout);
  }, [loading, hasResults]);

  /* ---- Handlers ---- */

  // Image search handler - now integrated with useSearch hook
  const handleImageSearch = useCallback(async (file: File) => {
    await searchByImage(file);
  }, [searchByImage]);

  /* ---- Render ---- */
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={clearError}
    >
      <div className="home">
        <Header />

        <main className="home__main">
          {/* ============ HERO SECTION ============ */}
          <section className="home__hero">
            <h1 className="home__title">Smart Price Comparison</h1>
            <p className="home__subtitle">
              Compare prices across multiple platforms using product name,
              direct link, or image-based search.
            </p>

            {/* Search Input Component */}
            <TextSearch
              onSearch={searchByText}
              onLink={searchByLink}
              onImage={handleImageSearch}
              loading={loading}
            />

            {/* Search Mode Hints */}
            <SearchHints />
          </section>

          {/* ============ RESULTS ANCHOR ============ */}
          <div ref={resultsRef} className="home__scroll-anchor" />

          {/* ============ LOADING STATE ============ */}
          {loading && <LoadingState variant={skeletonVariant} />}

          {/* ============ ERROR STATE ============ */}
          {error && !loading && <SearchError message={error} />}

          {/* ============ TEXT SEARCH RESULTS ============ */}
          {/* 
            Text search returns SIMILAR products across platforms.
            Price comparison is NOT shown because products may differ
            (e.g., different variants, colors, storage sizes).
          */}
          {showResults && isTextSearch && hasTextResults && (
            <TextSearchResults results={textResults} />
          )}

          {/* ============ LINK SEARCH RESULTS ============ */}
          {/* 
            Link search returns the EXACT SAME product from different platforms.
            Price comparison IS shown because we're comparing identical products.
            This is the only scenario where price comparison makes logical sense.
          */}
          {showResults && isLinkSearch && hasLinkResult && (
            <LinkSearchResults data={linkResult} />
          )}

          {/* ============ IMAGE SEARCH RESULTS ============ */}
          {/* 
            Image search returns SIMILAR products based on uploaded image.
            Display as a grid similar to text search.
          */}
          {showResults && isImageSearch && hasImageResult && (
            <section className="home-results" aria-label="Image search results">
              <div className="home-results__header">
                <h2 className="home-results__title">
                  <span className="home-results__icon" aria-hidden="true">🖼️</span>
                  Products Found
                  <span className="home-results__count">{imageResult.count} items</span>
                </h2>
                <p className="home-results__description">
                  Showing products matching your image search for "{imageResult.query}".
                </p>
              </div>

              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <SearchResults results={imageResult.results} />
              </ErrorBoundary>
            </section>
          )}
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}
