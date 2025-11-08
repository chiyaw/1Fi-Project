import mongoose from 'mongoose';

/**
 * EMI Plan Schema - Represents financing options for products
 */
const emiPlanSchema = new mongoose.Schema({
  tenureMonths: {
    type: Number,
    required: [true, 'Tenure in months is required'],
    min: [1, 'Tenure must be at least 1 month'],
    max: [60, 'Tenure cannot exceed 60 months'],
    validate: {
      validator: Number.isInteger,
      message: 'Tenure must be a whole number'
    },
    index: true
  },
  interestRate: {
    type: Number,
    required: [true, 'Interest rate is required'],
    default: 0,
    min: [0, 'Interest rate cannot be negative'],
    max: [100, 'Interest rate cannot exceed 100%'],
    validate: {
      validator: Number.isFinite,
      message: 'Interest rate must be a valid number'
    }
  },
  interestRateDisplay: {
    type: String,
    required: [true, 'Interest rate display text is required'],
    trim: true,
    maxlength: [50, 'Display text cannot exceed 50 characters']
  },
  cashback: {
    type: Number,
    default: 0,
    min: [0, 'Cashback cannot be negative'],
    validate: {
      validator: Number.isFinite,
      message: 'Cashback must be a valid number'
    }
  },
  cashbackDisplay: {
    type: String,
    default: null,
    trim: true,
    maxlength: [100, 'Cashback display text cannot exceed 100 characters']
  },
  processingFee: {
    type: Number,
    default: 0,
    min: [0, 'Processing fee cannot be negative'],
    validate: {
      validator: Number.isFinite,
      message: 'Processing fee must be a valid number'
    }
  },
  processingFeeType: {
    type: String,
    enum: {
      values: ['fixed', 'percentage'],
      message: '{VALUE} is not a valid processing fee type'
    },
    default: 'fixed'
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  description: {
    type: String,
    default: '',
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  active: {
    type: Boolean,
    default: true,
    index: true
  },
  bankName: {
    type: String,
    trim: true,
    default: null,
    maxlength: [100, 'Bank name cannot exceed 100 characters']
  },
  cardType: {
    type: String,
    enum: {
      values: ['credit', 'debit', 'any', null],
      message: '{VALUE} is not a valid card type'
    },
    default: null
  },
  minAmount: {
    type: Number,
    default: 0,
    min: [0, 'Minimum amount cannot be negative']
  },
  maxAmount: {
    type: Number,
    default: null,
    validate: {
      validator: function(value) {
        if (value === null) return true;
        return value >= this.minAmount;
      },
      message: 'Maximum amount must be greater than or equal to minimum amount'
    }
  },
  priority: {
    type: Number,
    default: 0,
    validate: {
      validator: Number.isInteger,
      message: 'Priority must be an integer'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
emiPlanSchema.index({ tenureMonths: 1, active: 1 });
emiPlanSchema.index({ featured: 1, active: 1 });
emiPlanSchema.index({ priority: -1 });

// Virtual for display priority (featured plans first)
emiPlanSchema.virtual('displayPriority').get(function() {
  return this.featured ? 1000 + this.priority : this.priority;
});

// Virtual for checking if plan is zero-cost (no interest and no processing fee)
emiPlanSchema.virtual('isZeroCost').get(function() {
  return this.interestRate === 0 && this.processingFee === 0;
});

/**
 * Calculate monthly EMI payment for a given product price
 * @param {Number} productPrice - The price of the product
 * @returns {Number} - Monthly payment amount (rounded up)
 */
emiPlanSchema.methods.calculateMonthlyPayment = function(productPrice) {
  if (!productPrice || productPrice <= 0) {
    throw new Error('Product price must be a positive number');
  }

  // Calculate principal after cashback
  const principal = Math.max(0, productPrice - this.cashback);
  
  // Calculate processing fee amount
  let processingFeeAmount = 0;
  if (this.processingFee > 0) {
    processingFeeAmount = this.processingFeeType === 'percentage' 
      ? (principal * this.processingFee / 100)
      : this.processingFee;
  }
  
  // Total amount to be financed
  const totalAmount = principal + processingFeeAmount;
  
  // For zero interest, simple division
  if (this.interestRate === 0) {
    return Math.ceil(totalAmount / this.tenureMonths);
  }
  
  // Calculate EMI using reducing balance method
  const monthlyInterestRate = this.interestRate / 100 / 12;
  const emi = (totalAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, this.tenureMonths)) / 
              (Math.pow(1 + monthlyInterestRate, this.tenureMonths) - 1);
  
  return Math.ceil(emi);
};

/**
 * Calculate total amount to be paid over the tenure
 * @param {Number} productPrice - The price of the product
 * @returns {Object} - Breakdown of total cost
 */
emiPlanSchema.methods.calculateTotalCost = function(productPrice) {
  if (!productPrice || productPrice <= 0) {
    throw new Error('Product price must be a positive number');
  }

  const monthlyPayment = this.calculateMonthlyPayment(productPrice);
  const totalPayment = monthlyPayment * this.tenureMonths;
  const principal = Math.max(0, productPrice - this.cashback);
  
  let processingFeeAmount = 0;
  if (this.processingFee > 0) {
    processingFeeAmount = this.processingFeeType === 'percentage' 
      ? (principal * this.processingFee / 100)
      : this.processingFee;
  }
  
  const totalInterest = totalPayment - principal - processingFeeAmount;
  
  return {
    monthlyPayment,
    totalPayment,
    principal,
    processingFee: Math.ceil(processingFeeAmount),
    totalInterest: Math.max(0, Math.ceil(totalInterest)),
    cashback: this.cashback,
    effectiveCost: totalPayment - this.cashback
  };
};

/**
 * Check if this EMI plan is applicable for a given amount
 * @param {Number} amount - The product amount to check
 * @returns {Boolean}
 */
emiPlanSchema.methods.isApplicableForAmount = function(amount) {
  if (!this.active) return false;
  if (amount < this.minAmount) return false;
  if (this.maxAmount !== null && amount > this.maxAmount) return false;
  return true;
};

// Static method to find plans by tenure
emiPlanSchema.statics.findByTenure = function(months) {
  return this.find({ tenureMonths: months, active: true }).sort({ priority: -1 });
};

// Static method to find featured plans
emiPlanSchema.statics.findFeatured = function() {
  return this.find({ featured: true, active: true }).sort({ priority: -1 });
};

// Static method to find zero-cost EMI plans
emiPlanSchema.statics.findZeroCost = function() {
  return this.find({ 
    interestRate: 0, 
    processingFee: 0, 
    active: true 
  }).sort({ tenureMonths: 1 });
};

// Static method to get applicable plans for a product price
emiPlanSchema.statics.findApplicablePlans = async function(productPrice) {
  const allPlans = await this.find({ active: true }).sort({ priority: -1 });
  return allPlans.filter(plan => plan.isApplicableForAmount(productPrice));
};

const EMIPlan = mongoose.model('EMIPlan', emiPlanSchema);

export default EMIPlan;

