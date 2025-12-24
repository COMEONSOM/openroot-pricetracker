import api from "./api";
import { Product } from "../types/product";

export async function searchText(query: string): Promise<Product[]> {
  const res = await api.post("/search/text", { query });
  return res.data.results;
}
