import Navbar from "./Navbar";
import SearchResults from "./SearchResults";
import PriceComparison from "./PriceComparison";
import Loader from "./Loader";
import Hero3D from "./Hero3D";
import { useSearch } from "../hooks/useSearch";

export default function Home() {
  const {
    results,
    loading,
    error,
    searchByText,
    searchByLink,
  } = useSearch();

  function handleImage(file: File) {
    console.log("Image search placeholder", file);
  }

  return (
    <>
      <Navbar />

      <Hero3D
        onSearch={searchByText}
        onLink={searchByLink}
        onImage={handleImage}
        loading={loading}
      />

      {loading && <Loader />}
      {error && (
        <p className="mt-4 text-center text-red-400">{error}</p>
      )}

      {results.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <SearchResults results={results} />
          <PriceComparison products={results} />
        </section>
      )}
    </>
  );
}
