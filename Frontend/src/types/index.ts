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

export interface EMIPlan {
  _id: string;
  tenureMonths: number;
  interestRate: number;
  interestRateDisplay: string;
  cashback: number;
  cashbackDisplay: string | null;
  processingFee: number;
  featured: boolean;
  description: string;
  active: boolean;
  createdAt: string;
}

export interface EMICalculation {
  plan: EMIPlan;
  monthlyPayment: number;
  totalAmount: number;
  savings: number;
}
