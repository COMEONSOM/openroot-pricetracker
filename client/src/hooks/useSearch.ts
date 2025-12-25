import { useState } from "react";
import { searchByText, searchByLink } from "../services/search.service";
import { Product } from "../types/product";

export function useSearch() {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function searchByTextQuery(query: string) {
    try {
      setLoading(true);
      setError(null);
      setResults(await searchByText(query));
    } catch {
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  }

  async function searchByLinkQuery(url: string) {
    try {
      setLoading(true);
      setError(null);
      setResults(await searchByLink(url));
    } catch {
      setError("Link search failed");
    } finally {
      setLoading(false);
    }
  }

  return {
    results,
    loading,
    error,
    searchByText: searchByTextQuery,
    searchByLink: searchByLinkQuery
  };
}
