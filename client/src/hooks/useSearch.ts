import { useState } from "react";
import { searchByText, searchByLink } from "../services/search.service";
import { Product } from "../types/product";
import { LinkSearchResult } from "../types/linkSearch";

export function useSearch() {
  const [textResults, setTextResults] = useState<Product[]>([]);
  const [linkResult, setLinkResult] = useState<LinkSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function searchByTextQuery(query: string) {
    try {
      setLoading(true);
      setError(null);
      setLinkResult(null);               // clear link result
      const results = await searchByText(query);
      setTextResults(results);
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
      setTextResults([]);                // clear text results
      const result = await searchByLink(url);
      setLinkResult(result);
    } catch {
      setError("Link search failed");
    } finally {
      setLoading(false);
    }
  }

  return {
    textResults,
    linkResult,
    loading,
    error,
    searchByText: searchByTextQuery,
    searchByLink: searchByLinkQuery,
  };
}
