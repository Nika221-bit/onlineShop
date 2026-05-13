export interface Product {
  id: number;
  title: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  thumbnail: string;
  warranty?: string;
}

export interface ProductsInterface {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}