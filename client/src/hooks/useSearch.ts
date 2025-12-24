import { useState } from "react";
import { textSearch, Product } from "../services/serpApi.service";

export function useSearch() {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search(query: string) {
    if (!query) return;

    setLoading(true);
    setError(null);

    try {
      const data = await textSearch(query);
      setResults(data.results);
    } catch {
      setError("Failed to fetch search results");
    } finally {
      setLoading(false);
    }
  }

  return { results, loading, error, search };
}
