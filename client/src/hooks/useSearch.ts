import { useState, useCallback, useRef } from "react";
import { searchByText, searchByLink, searchByImage, ImageSearchResult } from "../services/search.service";
import { Product } from "../types/product";
import { LinkSearchResult } from "../types/linkSearch";

/* =======================
   TYPES
   ======================= */

type SearchMode = "idle" | "text" | "link" | "image";

interface SearchState {
  textResults: Product[];
  linkResult: LinkSearchResult | null;
  imageResult: ImageSearchResult | null;
  loading: boolean;
  error: string | null;
  searchMode: SearchMode;
}

interface UseSearchReturn extends SearchState {
  searchByText: (query: string) => Promise<void>;
  searchByLink: (url: string) => Promise<void>;
  searchByImage: (file: File, query?: string) => Promise<void>;
  clearError: () => void;
  clearResults: () => void;
  reset: () => void;
  isIdle: boolean;
  isTextSearch: boolean;
  isLinkSearch: boolean;
  isImageSearch: boolean;
}

type SearchType = "text" | "link" | "image";

/* =======================
   ERROR MESSAGES
   ======================= */

const ERROR_MESSAGES: Record<string, string> = {
  NETWORK: "Unable to connect. Please check your internet connection.",
  TIMEOUT: "Request timed out. Please try again.",
  NOT_FOUND: "No results found for your search.",
  INVALID_URL: "Please enter a valid product URL.",
  INVALID_QUERY: "Please enter at least 2 characters.",
  INVALID_IMAGE: "Could not process the image. Please try another.",
  RATE_LIMIT: "Too many requests. Please wait a moment.",
  SERVER_ERROR: "Server error. Please try again later.",
  DEFAULT_TEXT: "Search failed. Please try again.",
  DEFAULT_LINK: "Link search failed. Please try again.",
  DEFAULT_IMAGE: "Image search failed. Please try again.",
};

/* =======================
   HELPERS
   ======================= */

function getErrorMessage(err: unknown, type: SearchType): string {
  if (err instanceof Error) {
    const message = err.message.toLowerCase();

    if (message.includes("network") || message.includes("fetch") || message.includes("failed to fetch")) {
      return ERROR_MESSAGES.NETWORK;
    }
    if (message.includes("timeout") || message.includes("aborted")) {
      return ERROR_MESSAGES.TIMEOUT;
    }
    if (message.includes("404") || message.includes("not found")) {
      return ERROR_MESSAGES.NOT_FOUND;
    }
    if (message.includes("invalid") && type === "link") {
      return ERROR_MESSAGES.INVALID_URL;
    }
    if (message.includes("429") || message.includes("rate")) {
      return ERROR_MESSAGES.RATE_LIMIT;
    }
    if (message.includes("500") || message.includes("server")) {
      return ERROR_MESSAGES.SERVER_ERROR;
    }

    // Return original message if it's user-friendly (not a raw error)
    if (err.message.length < 100 && !message.includes("error")) {
      return err.message;
    }
  }

  if (type === "image") return ERROR_MESSAGES.DEFAULT_IMAGE;
  if (type === "link") return ERROR_MESSAGES.DEFAULT_LINK;
  return ERROR_MESSAGES.DEFAULT_TEXT;
}

function validateQuery(query: string): { valid: boolean; error?: string } {
  const trimmed = query.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: "Please enter a search term." };
  }
  if (trimmed.length < 2) {
    return { valid: false, error: ERROR_MESSAGES.INVALID_QUERY };
  }
  if (trimmed.length > 200) {
    return { valid: false, error: "Search query is too long." };
  }

  return { valid: true };
}

function validateUrl(url: string): { valid: boolean; error?: string } {
  const trimmed = url.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: "Please enter a product URL." };
  }

  try {
    const parsed = new URL(trimmed);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { valid: false, error: "URL must start with http:// or https://" };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: ERROR_MESSAGES.INVALID_URL };
  }
}

/* =======================
   INITIAL STATE
   ======================= */

const INITIAL_STATE: SearchState = {
  textResults: [],
  linkResult: null,
  imageResult: null,
  loading: false,
  error: null,
  searchMode: "idle",
};

/* =======================
   HOOK
   ======================= */

export function useSearch(): UseSearchReturn {
  const [state, setState] = useState<SearchState>(INITIAL_STATE);

  // Abort controller for canceling in-flight requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cancel any pending request
  const cancelPendingRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Clear all results (keeps searchMode for skeleton)
  const clearResults = useCallback(() => {
    setState(prev => ({
      ...prev,
      textResults: [],
      linkResult: null,
      imageResult: null,
      error: null,
    }));
  }, []);

  // Full reset to initial state
  const reset = useCallback(() => {
    cancelPendingRequest();
    setState(INITIAL_STATE);
  }, [cancelPendingRequest]);

  // Text search — returns similar products (NO price comparison)
  const searchByTextQuery = useCallback(async (query: string) => {
    // Validate input
    const validation = validateQuery(query);
    if (!validation.valid) {
      setState(prev => ({
        ...prev,
        error: validation.error || ERROR_MESSAGES.INVALID_QUERY,
        searchMode: "text",
      }));
      return;
    }

    // Cancel any pending request
    cancelPendingRequest();
    abortControllerRef.current = new AbortController();

    // Set loading state with search mode
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      linkResult: null,
      imageResult: null,
      searchMode: "text",
    }));

    try {
      const results = await searchByText(query);

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) return;

      if (results.length === 0) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: ERROR_MESSAGES.NOT_FOUND,
          textResults: [],
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          textResults: results,
          error: null,
        }));
      }
    } catch (err) {
      // Ignore if aborted
      if (abortControllerRef.current?.signal.aborted) return;

      setState(prev => ({
        ...prev,
        loading: false,
        error: getErrorMessage(err, "text"),
        textResults: [],
      }));
    }
  }, [cancelPendingRequest]);

  // Link search — returns exact product comparison (WITH price comparison)
  const searchByLinkQuery = useCallback(async (url: string) => {
    // Validate URL
    const validation = validateUrl(url);
    if (!validation.valid) {
      setState(prev => ({
        ...prev,
        error: validation.error || ERROR_MESSAGES.INVALID_URL,
        searchMode: "link",
      }));
      return;
    }

    // Cancel any pending request
    cancelPendingRequest();
    abortControllerRef.current = new AbortController();

    // Set loading state with search mode
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      textResults: [],
      imageResult: null,
      searchMode: "link",
    }));

    try {
      const result = await searchByLink(url);

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) return;

      setState(prev => ({
        ...prev,
        loading: false,
        linkResult: result,
        error: null,
      }));
    } catch (err) {
      // Ignore if aborted
      if (abortControllerRef.current?.signal.aborted) return;

      setState(prev => ({
        ...prev,
        loading: false,
        error: getErrorMessage(err, "link"),
        linkResult: null,
      }));
    }
  }, [cancelPendingRequest]);

  // Image search — returns products based on uploaded image
  const searchByImageQuery = useCallback(async (file: File, query?: string) => {
    // Cancel any pending request
    cancelPendingRequest();
    abortControllerRef.current = new AbortController();

    // Set loading state with search mode
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      textResults: [],
      linkResult: null,
      searchMode: "image",
    }));

    try {
      const result = await searchByImage(file, query);

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) return;

      // Check for error in response
      if (result.error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: result.error || ERROR_MESSAGES.DEFAULT_IMAGE,
          imageResult: null,
        }));
        return;
      }

      if (result.count === 0) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: ERROR_MESSAGES.NOT_FOUND,
          imageResult: null,
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          imageResult: result,
          error: null,
        }));
      }
    } catch (err) {
      // Ignore if aborted
      if (abortControllerRef.current?.signal.aborted) return;

      setState(prev => ({
        ...prev,
        loading: false,
        error: getErrorMessage(err, "image"),
        imageResult: null,
      }));
    }
  }, [cancelPendingRequest]);

  // Derived states for convenience
  const isIdle = state.searchMode === "idle" && !state.loading && !state.error;
  const isTextSearch = state.searchMode === "text";
  const isLinkSearch = state.searchMode === "link";
  const isImageSearch = state.searchMode === "image";

  return {
    // State
    textResults: state.textResults,
    linkResult: state.linkResult,
    imageResult: state.imageResult,
    loading: state.loading,
    error: state.error,
    searchMode: state.searchMode,

    // Actions
    searchByText: searchByTextQuery,
    searchByLink: searchByLinkQuery,
    searchByImage: searchByImageQuery,
    clearError,
    clearResults,
    reset,

    // Derived
    isIdle,
    isTextSearch,
    isLinkSearch,
    isImageSearch,
  };
}
