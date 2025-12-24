import { useEffect, useState } from "react";
import api from "../services/api";

/**
 * Shape returned by backend /api/history
 * Adjust only if backend schema changes
 */
export interface PriceHistoryPoint {
  date: string;     // ISO string or YYYY-MM-DD
  price: number;
  platform: string;
}

interface UsePriceHistoryResult {
  data: PriceHistoryPoint[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch price history for a product
 * @param productId string | null
 */
export function usePriceHistory(
  productId: string | null
): UsePriceHistoryResult {
  const [data, setData] = useState<PriceHistoryPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setData([]);
      return;
    }

    let isMounted = true;

    async function fetchHistory() {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/history/${productId}`);

        if (isMounted) {
          setData(response.data ?? []);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load price history");
          setData([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  return { data, loading, error };
}
