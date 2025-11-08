// API Configuration

export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:5001/api');

// EMI Plans Configuration
export interface EMIPlan {
  id: string;
  tenureMonths: number;
  interestRate: number;
  cashback: number;
}

export const EMI_PLANS: EMIPlan[] = [
  { id: '1', tenureMonths: 3, interestRate: 0, cashback: 0 },
  { id: '2', tenureMonths: 6, interestRate: 0, cashback: 0 },
  { id: '3', tenureMonths: 12, interestRate: 0, cashback: 0 },
  { id: '4', tenureMonths: 24, interestRate: 0, cashback: 0 },
  { id: '5', tenureMonths: 36, interestRate: 10.5, cashback: 0 },
  { id: '6', tenureMonths: 48, interestRate: 10.5, cashback: 0 },
  { id: '7', tenureMonths: 60, interestRate: 10.5, cashback: 0 },
];

// UI Messages
export const UI_MESSAGES = {
  LOADING: {
    PRODUCT: 'Loading product...',
    PRODUCTS: 'Loading products...',
  },
  ERROR: {
    NO_PRODUCT_ID: 'No product ID provided',
    NO_VARIANTS: 'Product has no variants available',
    FAILED_LOAD_PRODUCT: 'Failed to load product',
    FAILED_LOAD_PRODUCTS: 'Failed to load products',
    PRODUCT_NOT_FOUND: 'Product not found',
    NO_VARIANTS_AVAILABLE: 'No variants available for this product',
  },
  PRODUCT: {
    SELECT_EMI_PLAN: 'Please select an EMI plan to proceed',
    OUT_OF_STOCK: 'Out of Stock',
    SELECT_EMI_TO_PROCEED: 'Select EMI Plan to Proceed',
    PROCEED_WITH_PLAN: 'Proceed with Selected Plan',
    GO_BACK: 'Go Back',
    NO_PRODUCTS: 'No products available',
    NO_PRODUCTS_MOMENT: 'No products available at the moment.',
    SELECT_COLOR: 'Select Color:',
    EMI_BACKED_BY_MF: 'EMI Plans backed by Mutual Funds',
    SELECT_PLAN_TEXT: 'Select a plan to proceed with easy monthly payments',
  },
  HOME: {
    WELCOME_TITLE: 'Welcome to 1Fi',
  },
};

// Color Utility Constants
export const COLOR_LUMINANCE_THRESHOLD = 0.5;
export const COLOR_LUMINANCE_WEIGHTS = {
  RED: 0.299,
  GREEN: 0.587,
  BLUE: 0.114,
};

// Locale Configuration
export const LOCALE = 'en-IN';

// Interest Rate Display
export const INTEREST_RATE_DISPLAY = {
  ZERO_INTEREST: '0% Interest',
  WITH_INTEREST: (rate: number) => `${rate}% Interest`,
};

// Router Configuration
export const ROUTER_CONFIG = {
  FUTURE: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
};

// Image Configuration
export const IMAGE_FALLBACK = '/vite.svg';

// Monthly Payment Calculation Constants
export const MONTHS_PER_YEAR = 12;
export const PERCENTAGE_DIVISOR = 100;

