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

/* ---------------- IMAGE SEARCH ---------------- */

export interface ImageSearchResult {
  query: string;
  source: "image";
  filename: string;
  results: Product[];
  count: number;
  error?: string;
}

export async function searchByImage(
  file: File,
  query?: string
): Promise<ImageSearchResult> {
  const formData = new FormData();
  formData.append("image", file);

  let url = `${API}/image`;
  if (query) {
    url += `?query=${encodeURIComponent(query)}`;
  }

  const res = await axios.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}
