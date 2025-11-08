import mongoose from 'mongoose';

/**
 * Variant Schema - Represents different product configurations (color + storage combinations)
 */
const variantSchema = new mongoose.Schema({
  storage: {
    type: [String],
    required: [true, 'Storage configuration is required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Storage must have at least one value'
    }
  },
  color: {
    type: String,
    required: [true, 'Color is required'],
    trim: true,
    minlength: [2, 'Color name must be at least 2 characters'],
    maxlength: [50, 'Color name cannot exceed 50 characters']
  },
  mrp: {
    type: Number,
    required: [true, 'MRP is required'],
    min: [0, 'MRP cannot be negative'],
    validate: {
      validator: Number.isFinite,
      message: 'MRP must be a valid number'
    }
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: Number.isFinite,
      message: 'Price must be a valid number'
    }
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(v) || v.startsWith('data:image');
      },
      message: 'Invalid image URL format'
    }
  },
  inStock: {
    type: Boolean,
    default: true,
    index: true
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Stock quantity cannot be negative']
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
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [3, 'Product name must be at least 3 characters'],
    maxlength: [200, 'Product name cannot exceed 200 characters'],
    index: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    lowercase: true,
    enum: {
      values: ['smartphone', 'laptop', 'tablet', 'smartwatch', 'earbuds', 'accessories', 'other'],
      message: '{VALUE} is not a supported category'
    },
    index: true
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
    minlength: [2, 'Brand name must be at least 2 characters'],
    maxlength: [100, 'Brand name cannot exceed 100 characters'],
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
    required: [true, 'At least one variant is required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Product must have at least one variant'
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
    default: false,
    index: true
  },
  active: {
    type: Boolean,
    default: true,
    index: true
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5']
    },
    count: {
      type: Number,
      default: 0,
      min: [0, 'Rating count cannot be negative']
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
  timestamps: true,
  collection: 'ProductInfo',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
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

