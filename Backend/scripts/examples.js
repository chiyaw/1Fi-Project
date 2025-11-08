/**
 * Schema Usage Examples
 * This file demonstrates how to use the new schema features
 * 
 * Note: This is just for reference - don't run it directly
 */

import { Product, EMIPlan } from '../models/index.js';
import { validateProduct, sanitizeProduct, getPriceRange } from '../utils/validators.js';

// ============================================================================
// PRODUCT EXAMPLES
// ============================================================================

/**
 * Example 1: Create a new product with validation
 */
async function createProductExample() {
  const productData = {
    name: 'Samsung Galaxy S24',
    description: 'Latest Samsung flagship with advanced AI features and stunning display',
    category: 'smartphone',
    brand: 'Samsung',
    storageOptions: ['128GB', '256GB', '512GB'],
    colorOptions: ['Black', 'White', 'Purple'],
    variants: [
      {
        storage: ['128GB'],
        color: 'Black',
        mrp: 79999,
        price: 74999,
        imageUrl: 'https://example.com/galaxy-s24-black.jpg',
        inStock: true,
        stockQuantity: 25
      },
      {
        storage: ['256GB'],
        color: 'White',
        mrp: 89999,
        price: 84999,
        imageUrl: 'https://example.com/galaxy-s24-white.jpg',
        inStock: true,
        stockQuantity: 15
      }
    ],
    featured: true,
    active: true,
    rating: {
      average: 4.5,
      count: 150
    },
    specifications: {
      'Display': '6.2" Dynamic AMOLED',
      'Processor': 'Snapdragon 8 Gen 3',
      'Camera': '50MP + 12MP + 10MP',
      'Battery': '4000 mAh'
    },
    tags: ['5g', 'android', 'flagship', 'ai']
  };

  // Sanitize data
  const cleanData = sanitizeProduct(productData);

  // Validate before saving
  const { valid, errors } = validateProduct(cleanData);
  if (!valid) {
    console.error('Validation errors:', errors);
    return;
  }

  // Create and save
  const product = new Product(cleanData);
  await product.save();
  
  console.log('Product created:', product.name);
  console.log('Product ID:', product._id);
  console.log('Min Price:', product.minPrice);
  console.log('Max Price:', product.maxPrice);
}

/**
 * Example 2: Query products using static methods
 */
async function queryProductsExample() {
  // Get all featured products
  const featured = await Product.findFeatured();
  console.log(`Found ${featured.length} featured products`);

  // Get products by category
  const smartphones = await Product.findByCategory('smartphone');
  console.log(`Found ${smartphones.length} smartphones`);

  // Get products by brand
  const appleProducts = await Product.findByBrand('Apple');
  console.log(`Found ${appleProducts.length} Apple products`);

  // Text search
  const searchResults = await Product.find({
    $text: { $search: 'iPhone camera' },
    active: true
  }).limit(10);
  console.log(`Found ${searchResults.length} results for search`);

  // Complex query with pagination
  const page = 1;
  const limit = 20;
  const products = await Product.find({ 
    active: true,
    category: 'smartphone'
  })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean({ virtuals: true }); // Enable virtuals in lean queries

  console.log(`Page ${page}:`, products.length, 'products');
}

/**
 * Example 3: Work with product variants
 */
async function productVariantExample() {
  const product = await Product.findOne({ name: 'iPhone 15 Pro' });
  
  if (product) {
    // Get specific variant
    const variant = product.getVariant('Black', ['256GB']);
    if (variant) {
      console.log('Variant found:');
      console.log('- Color:', variant.color);
      console.log('- Storage:', variant.storage);
      console.log('- Price:', variant.price);
      console.log('- MRP:', variant.mrp);
      console.log('- Discount:', variant.discountPercentage + '%');
      console.log('- In Stock:', variant.inStock);
    }

    // Check if product has stock
    console.log('Has stock:', product.hasStock);

    // Get price range
    const priceRange = getPriceRange(product);
    console.log('Price range: ₹', priceRange.min, '-', priceRange.max);
  }
}

/**
 * Example 4: Update a product
 */
async function updateProductExample() {
  const product = await Product.findById('someProductId');
  
  if (product) {
    // Update product fields
    product.description = 'Updated description';
    product.featured = true;
    
    // Update a variant's stock
    const variant = product.variants.find(v => v.color === 'Black');
    if (variant) {
      variant.inStock = true;
      variant.stockQuantity = 50;
    }
    
    // Save changes
    await product.save(); // Pre-save hook will validate defaultVariant
    console.log('Product updated successfully');
  }
}

// ============================================================================
// EMI PLAN EXAMPLES
// ============================================================================

/**
 * Example 5: Create an EMI plan
 */
async function createEMIPlanExample() {
  const planData = {
    tenureMonths: 12,
    interestRate: 0,
    interestRateDisplay: 'No Cost EMI',
    cashback: 2000,
    cashbackDisplay: '₹2,000 instant cashback',
    processingFee: 299,
    processingFeeType: 'fixed',
    featured: true,
    description: '12-month no cost EMI with special cashback offer',
    active: true,
    bankName: 'HDFC Bank',
    cardType: 'credit',
    minAmount: 40000,
    maxAmount: 1000000,
    priority: 10
  };

  const emiPlan = new EMIPlan(planData);
  await emiPlan.save();
  
  console.log('EMI Plan created:', emiPlan.tenureMonths, 'months');
  console.log('Is Zero Cost:', emiPlan.isZeroCost);
  console.log('Display Priority:', emiPlan.displayPriority);
}

/**
 * Example 6: Query EMI plans
 */
async function queryEMIPlansExample() {
  // Get all featured plans
  const featured = await EMIPlan.findFeatured();
  console.log(`Found ${featured.length} featured plans`);

  // Get plans by tenure
  const sixMonthPlans = await EMIPlan.findByTenure(6);
  console.log(`Found ${sixMonthPlans.length} 6-month plans`);

  // Get zero-cost plans
  const zeroCost = await EMIPlan.findZeroCost();
  console.log(`Found ${zeroCost.length} zero-cost plans`);

  // Get applicable plans for a specific amount
  const productPrice = 75000;
  const applicablePlans = await EMIPlan.findApplicablePlans(productPrice);
  console.log(`Found ${applicablePlans.length} plans for ₹${productPrice}`);
}

/**
 * Example 7: Calculate EMI
 */
async function calculateEMIExample() {
  const plan = await EMIPlan.findOne({ tenureMonths: 6, active: true });
  const productPrice = 50000;

  if (plan) {
    // Calculate monthly payment
    const monthlyEMI = plan.calculateMonthlyPayment(productPrice);
    console.log(`Monthly EMI: ₹${monthlyEMI}`);

    // Get complete breakdown
    const breakdown = plan.calculateTotalCost(productPrice);
    console.log('EMI Breakdown:');
    console.log('- Monthly Payment: ₹', breakdown.monthlyPayment);
    console.log('- Total Payment: ₹', breakdown.totalPayment);
    console.log('- Principal: ₹', breakdown.principal);
    console.log('- Processing Fee: ₹', breakdown.processingFee);
    console.log('- Total Interest: ₹', breakdown.totalInterest);
    console.log('- Cashback: ₹', breakdown.cashback);
    console.log('- Effective Cost: ₹', breakdown.effectiveCost);

    // Check if plan applies to amount
    const isApplicable = plan.isApplicableForAmount(productPrice);
    console.log('Plan applicable:', isApplicable);
  }
}

/**
 * Example 8: Get best EMI options for a product
 */
async function getBestEMIOptionsExample() {
  const productPrice = 84999;
  
  // Get all applicable plans
  const plans = await EMIPlan.findApplicablePlans(productPrice);
  
  // Calculate EMI for each plan and sort by monthly payment
  const emiOptions = plans.map(plan => {
    const breakdown = plan.calculateTotalCost(productPrice);
    return {
      tenure: plan.tenureMonths,
      monthlyPayment: breakdown.monthlyPayment,
      totalCost: breakdown.effectiveCost,
      interestRate: plan.interestRateDisplay,
      cashback: plan.cashback,
      featured: plan.featured,
      bankName: plan.bankName
    };
  }).sort((a, b) => a.monthlyPayment - b.monthlyPayment);
  
  console.log('Available EMI Options:');
  emiOptions.forEach(option => {
    console.log(`${option.tenure} months: ₹${option.monthlyPayment}/mo (Total: ₹${option.totalCost})`);
  });
}

// ============================================================================
// COMBINED EXAMPLES
// ============================================================================

/**
 * Example 9: Complete product page data
 */
async function getProductPageDataExample(productId) {
  // Get product with all details
  const product = await Product.findById(productId)
    .lean({ virtuals: true });

  if (!product) {
    throw new Error('Product not found');
  }

  // Get applicable EMI plans
  const minPrice = product.minPrice;
  const emiPlans = await EMIPlan.findApplicablePlans(minPrice);

  // Calculate EMI options
  const emiOptions = emiPlans.map(plan => ({
    id: plan._id,
    tenure: plan.tenureMonths,
    interestRate: plan.interestRateDisplay,
    cashback: plan.cashback,
    cashbackDisplay: plan.cashbackDisplay,
    monthlyPayment: plan.calculateMonthlyPayment(minPrice),
    featured: plan.featured
  }));

  // Return complete data
  return {
    product: {
      id: product._id,
      name: product.name,
      description: product.description,
      brand: product.brand,
      category: product.category,
      variants: product.variants,
      storageOptions: product.storageOptions,
      colorOptions: product.colorOptions,
      priceRange: {
        min: product.minPrice,
        max: product.maxPrice
      },
      rating: product.rating,
      specifications: product.specifications,
      hasStock: product.hasStock
    },
    emiOptions
  };
}

/**
 * Example 10: Bulk operations
 */
async function bulkOperationsExample() {
  // Mark all out-of-stock products as inactive
  const result = await Product.updateMany(
    { 
      'variants.inStock': { $ne: true },
      active: true
    },
    { 
      $set: { active: false } 
    }
  );
  console.log(`Deactivated ${result.modifiedCount} out-of-stock products`);

  // Update all plans with tenure > 12 months to non-featured
  const planResult = await EMIPlan.updateMany(
    { 
      tenureMonths: { $gt: 12 },
      featured: true
    },
    { 
      $set: { featured: false } 
    }
  );
  console.log(`Updated ${planResult.modifiedCount} EMI plans`);
}

// Export examples for reference
export {
  createProductExample,
  queryProductsExample,
  productVariantExample,
  updateProductExample,
  createEMIPlanExample,
  queryEMIPlansExample,
  calculateEMIExample,
  getBestEMIOptionsExample,
  getProductPageDataExample,
  bulkOperationsExample
};

