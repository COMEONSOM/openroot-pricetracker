import { useState } from "react";
import api from "../services/api";
import { Product } from "../types/product";

export function useSearch() {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchByText = async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/search/text", { query });
      setResults(res.data.results || []);
    } catch {
      setError("Text search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const searchByLink = async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/search/link", { url });
      setResults(res.data.results || []);
    } catch {
      setError("Link search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    results,
    loading,
    error,
    searchByText,
    searchByLink,
  };
}
