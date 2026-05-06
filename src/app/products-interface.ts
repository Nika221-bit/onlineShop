export interface Price {
  [key: string]: unknown;
}

export interface Category {
  [key: string]: unknown;
}

export interface Product {
  title: string;
  brand: string;
  price: Price;
  stock: number;
  images: string[];
  category: Category;
  warranty: number;
  issueDate: string;
  thumbnail: string;
  description: string;
}

export interface ProductsInterface {
  total: number;
  limit: number;
  page: number;
  skip: number;
  products: Product[];
}
