import Navbar from "./Navbar";
import TextSearch from "./TextSearch";
import SearchResults from "./SearchResults";
import PriceComparison from "./PriceComparison";
import Loader from "./Loader";
import { useSearch } from "../hooks/useSearch";

export default function Home() {
  const { results, loading, error, search } = useSearch();

  function handleImage(file: File) {
    console.log("Image search placeholder", file);
    // Will call imageSearch.service.ts later
  }

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6">
        {/* Subtle 3D glow */}
        <div className="absolute -top-40 right-0 h-[400px] w-[400px] rounded-full bg-accent/30 blur-[120px]" />

        <h1 className="mb-4 text-center text-4xl font-semibold">
          Smart Price Comparison
        </h1>

        <p className="mb-10 max-w-xl text-center text-gray-400">
          Compare prices across multiple platforms using product name,
          direct link, or image-based search.
        </p>

        <TextSearch
          onSearch={search}
          onImage={handleImage}
          loading={loading}
        />

        {loading && <Loader />}
        {error && <p className="mt-4 text-red-400">{error}</p>}
      </section>

      {/* RESULTS */}
      {results.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <SearchResults results={results} />
          <PriceComparison products={results} />
        </section>
      )}
    </>
  );
}
