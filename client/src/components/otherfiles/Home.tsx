import "../../styles/Home.css";

import { useEffect, useRef } from "react";

/* =======================
   COMPONENT IMPORTS
   ======================= */

import Header from "./Header";
import Footer from "./Footer";
import SkeletonLoader from "./SkeletonLoader";

import TextSearch from "../TextSearch";
import SearchResults from "../sharedfiles/SearchResults";
import PriceComparison from "../sharedfiles/PriceComparison";
import ComparisonDashboard from "../sharedfiles/ComparisonDashboard";

import { useSearch } from "../../hooks/useSearch";

/* =======================
   COMPONENT
   ======================= */

export default function Home() {
  const {
    textResults,
    linkResult,
    loading,
    error,
    searchByText,
    searchByLink,
  } = useSearch();

  // 🎯 Scroll target for loading + results
  const resultsRef = useRef<HTMLDivElement | null>(null);

  function handleImage(file: File) {
    console.log("Image search placeholder", file);
    // TODO: integrate image search later
  }

  // 🚀 Auto scroll when loading starts or results appear
  useEffect(() => {
    if (loading || textResults.length > 0 || linkResult) {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [loading, textResults.length, linkResult]);

  return (
    <div className="home-root">
      <Header />

      {/* HERO / SEARCH SECTION */}
      <section className="home-hero">
        <h1 className="home-title">
          Smart Price Comparison
        </h1>

        <p className="home-subtitle">
          Compare prices across multiple platforms using product name,
          direct link, or image-based search.
        </p>

        <TextSearch
          onSearch={searchByText}
          onLink={searchByLink}
          onImage={handleImage}
          loading={loading}
        />
      </section>

      {/* 👇 AUTO SCROLL TARGET */}
      <div ref={resultsRef} />

      {/* LOADING PLACEHOLDERS */}
      {loading && <SkeletonLoader />}

      {/* ERROR */}
      {error && (
        <p className="home-error">
          {error}
        </p>
      )}

      {/* TEXT SEARCH RESULTS */}
      {textResults.length > 0 && (
        <section className="home-results">
          <SearchResults results={textResults} />
          <PriceComparison products={textResults} />
        </section>
      )}

      {/* LINK SEARCH RESULTS */}
      {linkResult && (
        <section className="home-results">
          <ComparisonDashboard data={linkResult} />
        </section>
      )}

      <Footer />
    </div>
  );
}
