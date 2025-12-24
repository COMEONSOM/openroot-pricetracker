import api from "./api";

export interface Product {
  platform: string;
  title: string;
  price: number | null;
  image?: string;
  url: string;
}

export async function textSearch(query: string) {
  const res = await api.post("/search/text", { query });
  return res.data as { query: string; results: Product[] };
}
