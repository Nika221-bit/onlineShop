export interface Product {
  _id: string;
  title: string;
  description: string;
  category: {
    name: string;
  };
  price: {
    current: number;
    currency: string;
    beforeDiscount?: number;
    discountPercentage?: number;
  };
  thumbnail: string;
  rating: number;
  brand?: string;
  stock?: number;
  warranty?: string;
  [key: string]: unknown;
}

export interface ProductsInterface {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}