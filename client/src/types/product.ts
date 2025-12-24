export interface Product {
  product_id: string;
  title: string;
  platform: string;
  price: number | null;
  url: string;
  image?: string;
}
