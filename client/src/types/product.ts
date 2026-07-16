export interface Product {
  product_id: string; 
  title: string;
  price: number | null;
  platform: string;
  url: string;
  image?: string;
  rating?: number;
  discount?: number;
  originalPrice?: number;
}
