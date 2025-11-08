export interface Variant {
  _id: string;
  storage: string[];
  color: string;
  mrp: number;
  price: number;
  imageUrl: string;
  inStock: boolean;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  storageOptions: string[];
  colorOptions: string[];
  variants: Variant[];
  defaultVariant: {
    storage: string | string[]; // Support both string and array formats
    color: string;
  };
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}
