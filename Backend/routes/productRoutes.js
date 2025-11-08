import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// GET single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

// GET product variant details
router.get('/:id/variant', async (req, res) => {
  try {
    const { storage, color } = req.query;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const variant = product.variants.find(
      v => v.storage && Array.isArray(v.storage) && v.storage.includes(storage) && v.color === color
    );
    
    if (!variant) {
      return res.status(404).json({
        success: false,
        message: 'Variant not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        product: {
          id: product._id,
          name: product.name,
          description: product.description,
          category: product.category,
          brand: product.brand
        },
        variant
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching variant',
      error: error.message
    });
  }
});

// GET product variant by color only
router.get('/:id/color/:color', async (req, res) => {
  try {
    // Express automatically decodes URL parameters, but let's be explicit
    const color = decodeURIComponent(req.params.color);
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    console.log('Looking for color variant:', color);
    console.log('Available colors:', product.colorOptions);
    
    // Find variant that matches the color
    const variant = product.variants.find(v => v.color === color);
    
    if (!variant) {
      return res.status(404).json({
        success: false,
        message: `Variant not found for color: ${color}`,
        availableColors: product.colorOptions
      });
    }
    
    res.json({
      success: true,
      data: {
        color: variant.color,
        imageUrl: variant.imageUrl,
        variant
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching color variant',
      error: error.message
    });
  }
});

// POST create new product (for admin use)
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
});

export default router;

