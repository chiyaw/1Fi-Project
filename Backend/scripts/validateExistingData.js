/**
 * Data Validation Script
 * Validates existing database data against the updated schema
 * Run with: node scripts/validateExistingData.js
 * 
 * This script ONLY reads and validates - it does NOT modify or delete any data
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Product, EMIPlan } from '../models/index.js';

// Load environment variables
dotenv.config();

/**
 * Validate all products in the database
 */
const validateProducts = async () => {
  console.log('\n📦 Validating Products...');
  console.log('─'.repeat(60));

  try {
    const products = await Product.find({});
    console.log(`Found ${products.length} products to validate\n`);

    const issues = [];
    let validCount = 0;

    for (const product of products) {
      const productIssues = [];

      // Check required fields
      if (!product.name || product.name.length < 3) {
        productIssues.push('Name is missing or too short');
      }
      if (!product.description || product.description.length < 10) {
        productIssues.push('Description is missing or too short');
      }
      if (!product.category) {
        productIssues.push('Category is missing');
      }
      if (!product.brand) {
        productIssues.push('Brand is missing');
      }

      // Check variants
      if (!product.variants || product.variants.length === 0) {
        productIssues.push('No variants found');
      } else {
        product.variants.forEach((variant, idx) => {
          if (!variant.storage || variant.storage.length === 0) {
            productIssues.push(`Variant ${idx + 1}: Missing storage`);
          }
          if (!variant.color) {
            productIssues.push(`Variant ${idx + 1}: Missing color`);
          }
          if (variant.price < 0) {
            productIssues.push(`Variant ${idx + 1}: Negative price`);
          }
          if (variant.mrp < 0) {
            productIssues.push(`Variant ${idx + 1}: Negative MRP`);
          }
          if (variant.price > variant.mrp) {
            productIssues.push(`Variant ${idx + 1}: Price exceeds MRP`);
          }
          if (!variant.imageUrl) {
            productIssues.push(`Variant ${idx + 1}: Missing image URL`);
          }
        });
      }

      // Report results
      if (productIssues.length > 0) {
        issues.push({
          id: product._id,
          name: product.name,
          issues: productIssues
        });
        console.log(`❌ ${product.name} (${product._id})`);
        productIssues.forEach(issue => console.log(`   - ${issue}`));
      } else {
        validCount++;
        console.log(`✅ ${product.name}`);
      }
    }

    console.log('\n' + '─'.repeat(60));
    console.log(`Valid: ${validCount}/${products.length}`);
    console.log(`Issues found: ${issues.length}`);

    return { total: products.length, valid: validCount, issues };
  } catch (error) {
    console.error('Error validating products:', error);
    throw error;
  }
};

/**
 * Validate all EMI plans in the database
 */
const validateEMIPlans = async () => {
  console.log('\n💳 Validating EMI Plans...');
  console.log('─'.repeat(60));

  try {
    const plans = await EMIPlan.find({});
    console.log(`Found ${plans.length} EMI plans to validate\n`);

    const issues = [];
    let validCount = 0;

    for (const plan of plans) {
      const planIssues = [];

      // Check required fields
      if (!plan.tenureMonths || plan.tenureMonths < 1 || plan.tenureMonths > 60) {
        planIssues.push('Invalid tenure (must be 1-60 months)');
      }
      if (!Number.isInteger(plan.tenureMonths)) {
        planIssues.push('Tenure must be a whole number');
      }
      if (plan.interestRate === undefined || plan.interestRate === null) {
        planIssues.push('Interest rate is missing');
      }
      if (plan.interestRate < 0 || plan.interestRate > 100) {
        planIssues.push('Interest rate out of range (0-100)');
      }
      if (!plan.interestRateDisplay) {
        planIssues.push('Interest rate display text missing');
      }

      // Check amounts
      if (plan.cashback && plan.cashback < 0) {
        planIssues.push('Negative cashback');
      }
      if (plan.processingFee && plan.processingFee < 0) {
        planIssues.push('Negative processing fee');
      }
      if (plan.minAmount && plan.minAmount < 0) {
        planIssues.push('Negative minimum amount');
      }
      if (plan.maxAmount && plan.minAmount && plan.maxAmount < plan.minAmount) {
        planIssues.push('Max amount less than min amount');
      }

      // Report results
      if (planIssues.length > 0) {
        issues.push({
          id: plan._id,
          tenure: plan.tenureMonths,
          issues: planIssues
        });
        console.log(`❌ ${plan.tenureMonths} months @ ${plan.interestRateDisplay} (${plan._id})`);
        planIssues.forEach(issue => console.log(`   - ${issue}`));
      } else {
        validCount++;
        console.log(`✅ ${plan.tenureMonths} months @ ${plan.interestRateDisplay}`);
      }
    }

    console.log('\n' + '─'.repeat(60));
    console.log(`Valid: ${validCount}/${plans.length}`);
    console.log(`Issues found: ${issues.length}`);

    return { total: plans.length, valid: validCount, issues };
  } catch (error) {
    console.error('Error validating EMI plans:', error);
    throw error;
  }
};

/**
 * Generate statistics about the database
 */
const generateStats = async () => {
  console.log('\n📊 Database Statistics...');
  console.log('─'.repeat(60));

  try {
    // Product stats
    const totalProducts = await Product.countDocuments({});
    const activeProducts = await Product.countDocuments({ active: true });
    const featuredProducts = await Product.countDocuments({ featured: true });
    const productsWithStock = await Product.countDocuments({ 
      'variants.inStock': true 
    });

    // Category breakdown
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Brand breakdown
    const brands = await Product.aggregate([
      { $group: { _id: '$brand', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // EMI Plan stats
    const totalPlans = await EMIPlan.countDocuments({});
    const activePlans = await EMIPlan.countDocuments({ active: true });
    const featuredPlans = await EMIPlan.countDocuments({ featured: true });
    const zeroCostPlans = await EMIPlan.countDocuments({ 
      interestRate: 0, 
      processingFee: 0,
      active: true 
    });

    console.log('\nProducts:');
    console.log(`  Total: ${totalProducts}`);
    console.log(`  Active: ${activeProducts}`);
    console.log(`  Featured: ${featuredProducts}`);
    console.log(`  With Stock: ${productsWithStock}`);

    console.log('\nProducts by Category:');
    categories.forEach(cat => {
      console.log(`  ${cat._id}: ${cat.count}`);
    });

    console.log('\nProducts by Brand:');
    brands.forEach(brand => {
      console.log(`  ${brand._id}: ${brand.count}`);
    });

    console.log('\nEMI Plans:');
    console.log(`  Total: ${totalPlans}`);
    console.log(`  Active: ${activePlans}`);
    console.log(`  Featured: ${featuredPlans}`);
    console.log(`  Zero-Cost: ${zeroCostPlans}`);

    return {
      products: { totalProducts, activeProducts, featuredProducts, productsWithStock },
      categories,
      brands,
      emiPlans: { totalPlans, activePlans, featuredPlans, zeroCostPlans }
    };
  } catch (error) {
    console.error('Error generating stats:', error);
    throw error;
  }
};

/**
 * Test schema features
 */
const testSchemaFeatures = async () => {
  console.log('\n🧪 Testing Schema Features...');
  console.log('─'.repeat(60));

  try {
    // Test product queries
    console.log('\nTesting Product Methods:');
    
    const featuredProducts = await Product.findFeatured();
    console.log(`✓ findFeatured(): ${featuredProducts.length} products`);

    const categories = await Product.distinct('category');
    if (categories.length > 0) {
      const categoryProducts = await Product.findByCategory(categories[0]);
      console.log(`✓ findByCategory('${categories[0]}'): ${categoryProducts.length} products`);
    }

    const brands = await Product.distinct('brand');
    if (brands.length > 0) {
      const brandProducts = await Product.findByBrand(brands[0]);
      console.log(`✓ findByBrand('${brands[0]}'): ${brandProducts.length} products`);
    }

    // Test product virtuals
    const sampleProduct = await Product.findOne({ 'variants.0': { $exists: true } });
    if (sampleProduct) {
      console.log(`✓ Product virtuals working (minPrice: ₹${sampleProduct.minPrice})`);
    }

    // Test EMI plan queries
    console.log('\nTesting EMI Plan Methods:');
    
    const featuredPlans = await EMIPlan.findFeatured();
    console.log(`✓ findFeatured(): ${featuredPlans.length} plans`);

    const zeroCostPlans = await EMIPlan.findZeroCost();
    console.log(`✓ findZeroCost(): ${zeroCostPlans.length} plans`);

    const applicablePlans = await EMIPlan.findApplicablePlans(50000);
    console.log(`✓ findApplicablePlans(50000): ${applicablePlans.length} plans`);

    // Test EMI calculations
    const samplePlan = await EMIPlan.findOne({ active: true });
    if (samplePlan) {
      const monthlyEMI = samplePlan.calculateMonthlyPayment(50000);
      const totalCost = samplePlan.calculateTotalCost(50000);
      console.log(`✓ EMI calculations working (Monthly: ₹${monthlyEMI})`);
    }

    console.log('\n✅ All schema features are working correctly!');
  } catch (error) {
    console.error('Error testing schema features:', error);
    throw error;
  }
};

/**
 * Main validation function
 */
const validateDatabase = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 
      'mongodb+srv://demo:demo123@cluster0.mongodb.net/1fi-project?retryWrites=true&w=majority';
    
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    console.log('\n' + '='.repeat(60));
    console.log('  DATABASE VALIDATION REPORT');
    console.log('='.repeat(60));

    // Run validations
    const productResults = await validateProducts();
    const planResults = await validateEMIPlans();
    
    // Generate statistics
    await generateStats();

    // Test schema features
    await testSchemaFeatures();

    // Final summary
    console.log('\n' + '='.repeat(60));
    console.log('  SUMMARY');
    console.log('='.repeat(60));
    console.log(`Products: ${productResults.valid}/${productResults.total} valid`);
    console.log(`EMI Plans: ${planResults.valid}/${planResults.total} valid`);
    
    if (productResults.issues.length === 0 && planResults.issues.length === 0) {
      console.log('\n🎉 All data is valid! No issues found.');
    } else {
      console.log(`\n⚠️  Found ${productResults.issues.length + planResults.issues.length} items with issues`);
      console.log('Review the details above to fix any problems.');
    }
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Validation failed:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  }
};

// Run the validation script
validateDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

