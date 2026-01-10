import axios from "axios";
import { Product } from "../types/product";
import { LinkSearchResult } from "../types/linkSearch";

const API = "http://127.0.0.1:8000/api/search";

/* ---------------- TEXT SEARCH ---------------- */

export async function searchByText(
  query: string
): Promise<Product[]> {
  const res = await axios.post(`${API}/text`, { query });
  return res.data.results;
}

/* ---------------- LINK SEARCH ---------------- */

export async function searchByLink(
  url: string
): Promise<LinkSearchResult> {
  const res = await axios.post(`${API}/link`, { url });
  return res.data;   // <-- full object now
}
