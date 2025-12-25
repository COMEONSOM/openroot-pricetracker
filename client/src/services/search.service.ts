import axios from "axios";
import { Product } from "../types/product";

const API = "http://127.0.0.1:8000/api/search";

export async function searchByText(query: string): Promise<Product[]> {
  const res = await axios.post(`${API}/text`, { query });
  return res.data.results;
}

export async function searchByLink(url: string): Promise<Product[]> {
  const res = await axios.post(`${API}/link`, { url });
  return res.data.results;
}
