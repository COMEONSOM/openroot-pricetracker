import { Product } from "./product";

export interface PlatformMatches {
  amazon: Product | null;
  flipkart: Product | null;
  meesho: Product | null;
}

export interface PriceIntelligence {
  current: number;
  low_52w: number;
  high_52w: number;
  deal: "HOT" | "FAIR" | "EXPENSIVE";
}

export interface LinkSearchResult {
  source_platform: string;
  query: string;
  matches: Record<string, any>;
  unavailable: string[];
  intelligence: any;
  images: string[];   // ✅ ADD THIS
}
