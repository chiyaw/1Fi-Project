// Server Configuration
export const DEFAULT_PORT = 5000;
export const SERVER_NAME = '1Fi Backend API';
export const API_VERSION = '1.0.0';

// CORS Configuration
export const CORS_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000'
];

export const CORS_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
export const CORS_ALLOWED_HEADERS = ['Content-Type', 'Authorization'];

// API Endpoints
export const API_ENDPOINTS = {
  products: '/api/products'
};

// MongoDB Configuration
export const MONGODB_FALLBACK_URI = 'mongodb+srv://demo:demo123@cluster0.mongodb.net/1fi-project?retryWrites=true&w=majority';

// Database Messages
export const DB_MESSAGES = {
  CONNECTING: 'Attempting to connect to MongoDB...',
  CONNECTED: '✅ MongoDB Connected:',
  DATABASE_NAME: '📊 Database Name:',
  CONNECTION_ERROR: '❌ MongoDB Connection Error:',
  SOLUTIONS: [
    '💡 Possible solutions:',
    '   1. Check if MongoDB is running locally',
    '   2. Update MONGODB_URI in .env file',
    '   3. Use MongoDB Atlas for cloud database'
  ]
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// Response Messages
export const RESPONSE_MESSAGES = {
  PRODUCT_NOT_FOUND: 'Product not found',
  ERROR_FETCHING_PRODUCTS: 'Error fetching products',
  ERROR_FETCHING_PRODUCT: 'Error fetching product',
  ROUTE_NOT_FOUND: 'Route not found',
  INTERNAL_SERVER_ERROR: 'Internal server error'
};

// Product Schema Constants
export const PRODUCT_CATEGORIES = [
  'smartphone',
  'laptop',
  'tablet',
  'smartwatch',
  'earbuds',
  'accessories',
  'other'
];

// Validation Constants
export const VALIDATION = {
  PRODUCT: {
    NAME_MIN_LENGTH: 3,
    NAME_MAX_LENGTH: 200,
    DESCRIPTION_MIN_LENGTH: 10,
    DESCRIPTION_MAX_LENGTH: 2000,
    BRAND_MIN_LENGTH: 2,
    BRAND_MAX_LENGTH: 100,
  },
  VARIANT: {
    COLOR_MIN_LENGTH: 2,
    COLOR_MAX_LENGTH: 50,
    MIN_PRICE: 0,
    MIN_STOCK: 0,
  },
  RATING: {
    MIN: 0,
    MAX: 5,
  }
};

// Validation Messages
export const VALIDATION_MESSAGES = {
  PRODUCT: {
    NAME_REQUIRED: 'Product name is required',
    NAME_MIN_LENGTH: 'Product name must be at least 3 characters',
    NAME_MAX_LENGTH: 'Product name cannot exceed 200 characters',
    DESCRIPTION_REQUIRED: 'Product description is required',
    DESCRIPTION_MIN_LENGTH: 'Description must be at least 10 characters',
    DESCRIPTION_MAX_LENGTH: 'Description cannot exceed 2000 characters',
    CATEGORY_REQUIRED: 'Category is required',
    CATEGORY_INVALID: '{VALUE} is not a supported category',
    BRAND_REQUIRED: 'Brand is required',
    BRAND_MIN_LENGTH: 'Brand name must be at least 2 characters',
    BRAND_MAX_LENGTH: 'Brand name cannot exceed 100 characters',
    VARIANTS_REQUIRED: 'At least one variant is required',
    VARIANTS_MIN: 'Product must have at least one variant',
  },
  VARIANT: {
    STORAGE_REQUIRED: 'Storage configuration is required',
    STORAGE_MIN: 'Storage must have at least one value',
    COLOR_REQUIRED: 'Color is required',
    COLOR_MIN_LENGTH: 'Color name must be at least 2 characters',
    COLOR_MAX_LENGTH: 'Color name cannot exceed 50 characters',
    MRP_REQUIRED: 'MRP is required',
    MRP_MIN: 'MRP cannot be negative',
    MRP_VALID: 'MRP must be a valid number',
    PRICE_REQUIRED: 'Price is required',
    PRICE_MIN: 'Price cannot be negative',
    PRICE_VALID: 'Price must be a valid number',
    IMAGE_URL_REQUIRED: 'Image URL is required',
    IMAGE_URL_INVALID: 'Invalid image URL format',
    STOCK_MIN: 'Stock quantity cannot be negative',
  },
  RATING: {
    MIN: 'Rating cannot be less than 0',
    MAX: 'Rating cannot be more than 5',
    COUNT_MIN: 'Rating count cannot be negative',
  }
};

// Schema Configuration
export const SCHEMA_CONFIG = {
  COLLECTION_NAME: 'ProductInfo',
  VIRTUALS: true,
  TIMESTAMPS: true,
};

// Image URL Validation Pattern
export const IMAGE_URL_PATTERN = /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/i;

// Default Values
export const DEFAULTS = {
  IN_STOCK: true,
  STOCK_QUANTITY: 0,
  FEATURED: false,
  ACTIVE: true,
  RATING_AVERAGE: 0,
  RATING_COUNT: 0,
};

