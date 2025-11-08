/**
 * Custom validation utilities for database schemas
 */

/**
 * Validate product data before saving
 * @param {Object} productData - Product data to validate
 * @returns {Object} - { valid: boolean, errors: Array }
 */
export const validateProduct = (productData) => {
  const errors = [];

  // Check required fields
  if (!productData.name || productData.name.trim().length < 3) {
    errors.push('Product name must be at least 3 characters');
  }

  if (!productData.description || productData.description.trim().length < 10) {
    errors.push('Product description must be at least 10 characters');
  }

  if (!productData.category) {
    errors.push('Product category is required');
  }

  if (!productData.brand) {
    errors.push('Product brand is required');
  }

  // Validate variants
  if (!productData.variants || productData.variants.length === 0) {
    errors.push('Product must have at least one variant');
  } else {
    productData.variants.forEach((variant, index) => {
      if (!variant.storage || variant.storage.length === 0) {
        errors.push(`Variant ${index + 1}: Storage is required`);
      }
      if (!variant.color) {
        errors.push(`Variant ${index + 1}: Color is required`);
      }
      if (variant.price < 0) {
        errors.push(`Variant ${index + 1}: Price cannot be negative`);
      }
      if (variant.mrp < 0) {
        errors.push(`Variant ${index + 1}: MRP cannot be negative`);
      }
      if (variant.price > variant.mrp) {
        errors.push(`Variant ${index + 1}: Price cannot exceed MRP`);
      }
      if (!variant.imageUrl) {
        errors.push(`Variant ${index + 1}: Image URL is required`);
      }
    });
  }

  // Validate storage and color options match variants
  if (productData.storageOptions && productData.variants) {
    const variantStorages = new Set();
    productData.variants.forEach(v => {
      v.storage.forEach(s => variantStorages.add(s));
    });
    
    const missingOptions = productData.storageOptions.filter(
      opt => !variantStorages.has(opt)
    );
    
    if (missingOptions.length > 0) {
      errors.push(`Storage options [${missingOptions.join(', ')}] don't exist in variants`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validate EMI plan data before saving
 * @param {Object} planData - EMI plan data to validate
 * @returns {Object} - { valid: boolean, errors: Array }
 */
export const validateEMIPlan = (planData) => {
  const errors = [];

  // Check required fields
  if (!planData.tenureMonths || planData.tenureMonths < 1 || planData.tenureMonths > 60) {
    errors.push('Tenure must be between 1 and 60 months');
  }

  if (planData.tenureMonths && !Number.isInteger(planData.tenureMonths)) {
    errors.push('Tenure must be a whole number');
  }

  if (planData.interestRate === undefined || planData.interestRate === null) {
    errors.push('Interest rate is required');
  } else if (planData.interestRate < 0 || planData.interestRate > 100) {
    errors.push('Interest rate must be between 0 and 100');
  }

  if (!planData.interestRateDisplay) {
    errors.push('Interest rate display text is required');
  }

  // Validate amounts
  if (planData.cashback && planData.cashback < 0) {
    errors.push('Cashback cannot be negative');
  }

  if (planData.processingFee && planData.processingFee < 0) {
    errors.push('Processing fee cannot be negative');
  }

  if (planData.minAmount && planData.minAmount < 0) {
    errors.push('Minimum amount cannot be negative');
  }

  if (planData.maxAmount && planData.minAmount && planData.maxAmount < planData.minAmount) {
    errors.push('Maximum amount must be greater than or equal to minimum amount');
  }

  // Validate enums
  if (planData.processingFeeType && !['fixed', 'percentage'].includes(planData.processingFeeType)) {
    errors.push('Processing fee type must be either "fixed" or "percentage"');
  }

  if (planData.cardType && !['credit', 'debit', 'any', null].includes(planData.cardType)) {
    errors.push('Card type must be "credit", "debit", "any", or null');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize product data (trim strings, normalize values)
 * @param {Object} productData - Product data to sanitize
 * @returns {Object} - Sanitized product data
 */
export const sanitizeProduct = (productData) => {
  const sanitized = { ...productData };

  if (sanitized.name) sanitized.name = sanitized.name.trim();
  if (sanitized.description) sanitized.description = sanitized.description.trim();
  if (sanitized.category) sanitized.category = sanitized.category.toLowerCase().trim();
  if (sanitized.brand) sanitized.brand = sanitized.brand.trim();

  if (sanitized.storageOptions) {
    sanitized.storageOptions = sanitized.storageOptions.map(opt => opt.trim());
  }

  if (sanitized.colorOptions) {
    sanitized.colorOptions = sanitized.colorOptions.map(opt => opt.trim());
  }

  if (sanitized.variants) {
    sanitized.variants = sanitized.variants.map(variant => ({
      ...variant,
      color: variant.color?.trim(),
      storage: variant.storage?.map(s => s.trim()),
      imageUrl: variant.imageUrl?.trim()
    }));
  }

  if (sanitized.tags) {
    sanitized.tags = sanitized.tags.map(tag => tag.toLowerCase().trim());
  }

  return sanitized;
};

/**
 * Sanitize EMI plan data
 * @param {Object} planData - EMI plan data to sanitize
 * @returns {Object} - Sanitized EMI plan data
 */
export const sanitizeEMIPlan = (planData) => {
  const sanitized = { ...planData };

  if (sanitized.interestRateDisplay) {
    sanitized.interestRateDisplay = sanitized.interestRateDisplay.trim();
  }

  if (sanitized.cashbackDisplay) {
    sanitized.cashbackDisplay = sanitized.cashbackDisplay.trim();
  }

  if (sanitized.description) {
    sanitized.description = sanitized.description.trim();
  }

  if (sanitized.bankName) {
    sanitized.bankName = sanitized.bankName.trim();
  }

  // Ensure numeric values are numbers
  if (sanitized.tenureMonths) {
    sanitized.tenureMonths = parseInt(sanitized.tenureMonths);
  }

  if (sanitized.interestRate !== undefined) {
    sanitized.interestRate = parseFloat(sanitized.interestRate);
  }

  if (sanitized.cashback !== undefined) {
    sanitized.cashback = parseFloat(sanitized.cashback);
  }

  if (sanitized.processingFee !== undefined) {
    sanitized.processingFee = parseFloat(sanitized.processingFee);
  }

  return sanitized;
};

/**
 * Check if a product has valid stock
 * @param {Object} product - Product object
 * @returns {boolean}
 */
export const hasValidStock = (product) => {
  if (!product.variants || product.variants.length === 0) {
    return false;
  }
  return product.variants.some(v => v.inStock && (!v.stockQuantity || v.stockQuantity > 0));
};

/**
 * Get price range for a product
 * @param {Object} product - Product object
 * @returns {Object} - { min: number, max: number }
 */
export const getPriceRange = (product) => {
  if (!product.variants || product.variants.length === 0) {
    return { min: 0, max: 0 };
  }

  const prices = product.variants.map(v => v.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
};

export default {
  validateProduct,
  validateEMIPlan,
  sanitizeProduct,
  sanitizeEMIPlan,
  hasValidStock,
  getPriceRange
};

