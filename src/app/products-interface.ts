export interface Product {
  id: number;
  title: string;
  description: string;
  brand: string;
  stock: number;
  warranty: number;
  rating: number;
  thumbnail: string; // ფოტოს ბმული
}

export interface ProductsInterface {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}
