import mongoose from 'mongoose';
import {
  PRODUCT_CATEGORIES,
  VALIDATION,
  VALIDATION_MESSAGES,
  SCHEMA_CONFIG,
  IMAGE_URL_PATTERN,
  DEFAULTS
} from '../constant.js';

/**
 * Variant Schema - Represents different product configurations (color + storage combinations)
 */
const variantSchema = new mongoose.Schema({
  storage: {
    type: [String],
    required: [true, VALIDATION_MESSAGES.VARIANT.STORAGE_REQUIRED],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: VALIDATION_MESSAGES.VARIANT.STORAGE_MIN
    }
  },
  color: {
    type: String,
    required: [true, VALIDATION_MESSAGES.VARIANT.COLOR_REQUIRED],
    trim: true,
    minlength: [VALIDATION.VARIANT.COLOR_MIN_LENGTH, VALIDATION_MESSAGES.VARIANT.COLOR_MIN_LENGTH],
    maxlength: [VALIDATION.VARIANT.COLOR_MAX_LENGTH, VALIDATION_MESSAGES.VARIANT.COLOR_MAX_LENGTH]
  },
  mrp: {
    type: Number,
    required: [true, VALIDATION_MESSAGES.VARIANT.MRP_REQUIRED],
    min: [VALIDATION.VARIANT.MIN_PRICE, VALIDATION_MESSAGES.VARIANT.MRP_MIN],
    validate: {
      validator: Number.isFinite,
      message: VALIDATION_MESSAGES.VARIANT.MRP_VALID
    }
  },
  price: {
    type: Number,
    required: [true, VALIDATION_MESSAGES.VARIANT.PRICE_REQUIRED],
    min: [VALIDATION.VARIANT.MIN_PRICE, VALIDATION_MESSAGES.VARIANT.PRICE_MIN],
    validate: {
      validator: Number.isFinite,
      message: VALIDATION_MESSAGES.VARIANT.PRICE_VALID
    }
  },
  imageUrl: {
    type: String,
    required: [true, VALIDATION_MESSAGES.VARIANT.IMAGE_URL_REQUIRED],
    trim: true,
    validate: {
      validator: function(v) {
        return IMAGE_URL_PATTERN.test(v) || v.startsWith('data:image');
      },
      message: VALIDATION_MESSAGES.VARIANT.IMAGE_URL_INVALID
    }
  },
  inStock: {
    type: Boolean,
    default: DEFAULTS.IN_STOCK,
    index: true
  },
  stockQuantity: {
    type: Number,
    default: DEFAULTS.STOCK_QUANTITY,
    min: [VALIDATION.VARIANT.MIN_STOCK, VALIDATION_MESSAGES.VARIANT.STOCK_MIN]
  }
}, {
  _id: true,
  timestamps: false
});

// Virtual for discount percentage
variantSchema.virtual('discountPercentage').get(function() {
  if (this.mrp && this.price && this.mrp > this.price) {
    return Math.round(((this.mrp - this.price) / this.mrp) * 100);
  }
  return 0;
});

/**
 * Product Schema - Main product entity
 */
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, VALIDATION_MESSAGES.PRODUCT.NAME_REQUIRED],
    trim: true,
    minlength: [VALIDATION.PRODUCT.NAME_MIN_LENGTH, VALIDATION_MESSAGES.PRODUCT.NAME_MIN_LENGTH],
    maxlength: [VALIDATION.PRODUCT.NAME_MAX_LENGTH, VALIDATION_MESSAGES.PRODUCT.NAME_MAX_LENGTH],
    index: true
  },
  description: {
    type: String,
    required: [true, VALIDATION_MESSAGES.PRODUCT.DESCRIPTION_REQUIRED],
    trim: true,
    minlength: [VALIDATION.PRODUCT.DESCRIPTION_MIN_LENGTH, VALIDATION_MESSAGES.PRODUCT.DESCRIPTION_MIN_LENGTH],
    maxlength: [VALIDATION.PRODUCT.DESCRIPTION_MAX_LENGTH, VALIDATION_MESSAGES.PRODUCT.DESCRIPTION_MAX_LENGTH]
  },
  category: {
    type: String,
    required: [true, VALIDATION_MESSAGES.PRODUCT.CATEGORY_REQUIRED],
    trim: true,
    lowercase: true,
    enum: {
      values: PRODUCT_CATEGORIES,
      message: VALIDATION_MESSAGES.PRODUCT.CATEGORY_INVALID
    },
    index: true
  },
  brand: {
    type: String,
    required: [true, VALIDATION_MESSAGES.PRODUCT.BRAND_REQUIRED],
    trim: true,
    minlength: [VALIDATION.PRODUCT.BRAND_MIN_LENGTH, VALIDATION_MESSAGES.PRODUCT.BRAND_MIN_LENGTH],
    maxlength: [VALIDATION.PRODUCT.BRAND_MAX_LENGTH, VALIDATION_MESSAGES.PRODUCT.BRAND_MAX_LENGTH],
    index: true
  },
  storageOptions: [{
    type: String,
    required: true,
    trim: true
  }],
  colorOptions: [{
    type: String,
    required: true,
    trim: true
  }],
  variants: {
    type: [variantSchema],
    required: [true, VALIDATION_MESSAGES.PRODUCT.VARIANTS_REQUIRED],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: VALIDATION_MESSAGES.PRODUCT.VARIANTS_MIN
    }
  },
  defaultVariant: {
    storage: {
      type: [String],
      required: false
    },
    color: {
      type: String,
      required: false,
      trim: true
    }
  },
  featured: {
    type: Boolean,
    default: DEFAULTS.FEATURED,
    index: true
  },
  active: {
    type: Boolean,
    default: DEFAULTS.ACTIVE,
    index: true
  },
  rating: {
    average: {
      type: Number,
      default: DEFAULTS.RATING_AVERAGE,
      min: [VALIDATION.RATING.MIN, VALIDATION_MESSAGES.RATING.MIN],
      max: [VALIDATION.RATING.MAX, VALIDATION_MESSAGES.RATING.MAX]
    },
    count: {
      type: Number,
      default: DEFAULTS.RATING_COUNT,
      min: [VALIDATION.VARIANT.MIN_STOCK, VALIDATION_MESSAGES.RATING.COUNT_MIN]
    }
  },
  specifications: {
    type: Map,
    of: String,
    default: {}
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }]
}, {
  timestamps: SCHEMA_CONFIG.TIMESTAMPS,
  collection: SCHEMA_CONFIG.COLLECTION_NAME,
  toJSON: { virtuals: SCHEMA_CONFIG.VIRTUALS },
  toObject: { virtuals: SCHEMA_CONFIG.VIRTUALS }
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, brand: 1 });
productSchema.index({ featured: 1, active: 1 });
productSchema.index({ createdAt: -1 });

// Virtual for minimum price across all variants
productSchema.virtual('minPrice').get(function() {
  if (this.variants && this.variants.length > 0) {
    return Math.min(...this.variants.map(v => v.price));
  }
  return 0;
});

// Virtual for maximum price across all variants
productSchema.virtual('maxPrice').get(function() {
  if (this.variants && this.variants.length > 0) {
    return Math.max(...this.variants.map(v => v.price));
  }
  return 0;
});

// Virtual for checking if any variant is in stock
productSchema.virtual('hasStock').get(function() {
  if (this.variants && this.variants.length > 0) {
    return this.variants.some(v => v.inStock);
  }
  return false;
});

// Pre-save middleware to validate and set defaults
productSchema.pre('save', function(next) {
  // Ensure default variant is valid if provided
  if (this.defaultVariant && this.defaultVariant.color && this.defaultVariant.storage) {
    const hasMatchingVariant = this.variants.some(v => 
      v.color === this.defaultVariant.color && 
      JSON.stringify(v.storage) === JSON.stringify(this.defaultVariant.storage)
    );
    
    if (!hasMatchingVariant) {
      // Set first variant as default if specified default doesn't exist
      this.defaultVariant = {
        storage: this.variants[0].storage,
        color: this.variants[0].color
      };
    }
  } else if (this.variants && this.variants.length > 0) {
    // Set first variant as default if no default is specified
    this.defaultVariant = {
      storage: this.variants[0].storage,
      color: this.variants[0].color
    };
  }
  
  next();
});

// Static method to find products by category
productSchema.statics.findByCategory = function(category) {
  return this.find({ category: category.toLowerCase(), active: true });
};

// Static method to find featured products
productSchema.statics.findFeatured = function() {
  return this.find({ featured: true, active: true });
};

// Static method to find products by brand
productSchema.statics.findByBrand = function(brand) {
  return this.find({ brand: new RegExp(brand, 'i'), active: true });
};

// Instance method to get variant by color and storage
productSchema.methods.getVariant = function(color, storage) {
  return this.variants.find(v => 
    v.color === color && 
    JSON.stringify(v.storage) === JSON.stringify(storage)
  );
};

const Product = mongoose.model('Product', productSchema);

export default Product;

