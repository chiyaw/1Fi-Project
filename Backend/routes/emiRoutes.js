import express from 'express';
import EMIPlan from '../models/EMIPlan.js';

const router = express.Router();

// GET all EMI plans
router.get('/', async (req, res) => {
  try {
    const emiPlans = await EMIPlan.find({ active: true }).sort({ tenureMonths: 1 });
    res.json({
      success: true,
      count: emiPlans.length,
      data: emiPlans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching EMI plans',
      error: error.message
    });
  }
});

// GET EMI plan by ID
router.get('/:id', async (req, res) => {
  try {
    const emiPlan = await EMIPlan.findById(req.params.id);
    
    if (!emiPlan) {
      return res.status(404).json({
        success: false,
        message: 'EMI plan not found'
      });
    }
    
    res.json({
      success: true,
      data: emiPlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching EMI plan',
      error: error.message
    });
  }
});

// POST calculate EMI for a product price
router.post('/calculate', async (req, res) => {
  try {
    const { productPrice, planId } = req.body;
    
    if (!productPrice || !planId) {
      return res.status(400).json({
        success: false,
        message: 'Product price and plan ID are required'
      });
    }
    
    const emiPlan = await EMIPlan.findById(planId);
    
    if (!emiPlan) {
      return res.status(404).json({
        success: false,
        message: 'EMI plan not found'
      });
    }
    
    const monthlyPayment = emiPlan.calculateMonthlyPayment(productPrice);
    
    res.json({
      success: true,
      data: {
        plan: emiPlan,
        monthlyPayment,
        totalAmount: monthlyPayment * emiPlan.tenureMonths,
        savings: emiPlan.cashback
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error calculating EMI',
      error: error.message
    });
  }
});

// POST create new EMI plan (for admin use)
router.post('/', async (req, res) => {
  try {
    const emiPlan = await EMIPlan.create(req.body);
    res.status(201).json({
      success: true,
      data: emiPlan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating EMI plan',
      error: error.message
    });
  }
});

export default router;

