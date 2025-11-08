import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Product, Variant } from '../types/index';
import { getProductById } from '../services/api';
import EMIPlanSelector from './EMIPlanSelector';

interface EMIPlan {
  id: string;
  tenureMonths: number;
  interestRate: number;
  cashback: number;
}

function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [currentVariant, setCurrentVariant] = useState<Variant | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<EMIPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError('No product ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getProductById(productId);
        
        // Check if product has variants
        if (!data.variants || data.variants.length === 0) {
          console.error('Product has no variants!');
          setError('Product has no variants available');
          setLoading(false);
          return;
        }
        
        setProduct(data);

        // Set default variant with better defensive checks
        // Handle both string and array formats for defaultVariant.storage
        const defaultStorage = Array.isArray(data.defaultVariant?.storage)
          ? data.defaultVariant.storage[0]
          : data.defaultVariant?.storage || data.storageOptions?.[0];
        // Get default color from defaultVariant or first variant's color
        const defaultColor = data.defaultVariant?.color || data.variants?.[0]?.color;
        
        setSelectedStorage(defaultStorage);
        setSelectedColor(defaultColor);

        // Find and set the default variant
        const variant = data.variants?.find(
          (v) => v.storage && Array.isArray(v.storage) && v.storage.includes(defaultStorage) && v.color === defaultColor
        );
        
        // Always use a fallback variant if primary match fails
        const finalVariant = variant || data.variants?.[0] || null;
        
        if (!variant && data.variants?.[0]) {
          // Update the selected values to match the fallback variant
          if (data.variants[0].storage?.[0]) {
            setSelectedStorage(data.variants[0].storage[0]);
          }
          if (data.variants[0].color) {
            setSelectedColor(data.variants[0].color);
          }
        }
        
        setCurrentVariant(finalVariant);
        setError(null);
        setIsInitialLoad(false); // Mark initial load as complete
      } catch (err) {
        setError('Failed to load product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Update variant when color changes (using locally loaded data)
  // Note: All variant data is already loaded, no need for additional API calls

  // Find matching variant locally when storage OR color changes
  useEffect(() => {
    if (!product || !selectedStorage || !selectedColor || isInitialLoad) {
      return;
    }
    
    // Find the variant that matches both storage and color from already-loaded data
    const matchingVariant = product.variants?.find(
      (v) => v.color === selectedColor && 
             v.storage && 
             Array.isArray(v.storage) && 
             v.storage.includes(selectedStorage)
    );
    
    if (matchingVariant) {
      setCurrentVariant(matchingVariant);
    } else {
      // Fallback to any variant with the selected color
      const colorVariant = product.variants?.find(v => v.color === selectedColor);
      if (colorVariant) {
        setCurrentVariant(colorVariant);
      }
    }
  }, [product, selectedStorage, selectedColor, isInitialLoad]);

  const handleProceed = () => {
    if (!selectedPlan || !currentVariant) {
      alert('Please select an EMI plan to proceed');
      return;
    }

    // Calculate EMI details
    const principal = currentVariant.price - selectedPlan.cashback;
    const monthlyInterestRate = selectedPlan.interestRate / 100 / 12;

    let monthlyPayment: number;
    if (selectedPlan.interestRate === 0) {
      monthlyPayment = Math.ceil(principal / selectedPlan.tenureMonths);
    } else {
      monthlyPayment = Math.ceil(
        (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, selectedPlan.tenureMonths)) /
        (Math.pow(1 + monthlyInterestRate, selectedPlan.tenureMonths) - 1)
      );
    }

    const interestDisplay = selectedPlan.interestRate === 0 
      ? '0% Interest' 
      : `${selectedPlan.interestRate}% Interest`;

    alert(
      `Proceeding with:\n\n` +
      `Product: ${product?.name}\n` +
      `Variant: ${selectedStorage} - ${selectedColor}\n` +
      `Price: ₹${currentVariant.price.toLocaleString('en-IN')}\n\n` +
      `EMI Plan: ${selectedPlan.tenureMonths} months @ ${interestDisplay}\n` +
      `Monthly Payment: ₹${monthlyPayment.toLocaleString('en-IN')}\n` +
      `Total Amount: ₹${(monthlyPayment * selectedPlan.tenureMonths).toLocaleString('en-IN')}\n` +
      (selectedPlan.cashback > 0 ? `Cashback: ₹${selectedPlan.cashback.toLocaleString('en-IN')}\n\n` : '\n') +
      `This would proceed to checkout in a real application.`
    );
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || 'Product not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!currentVariant) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg">No variants available for this product</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const discountPercent = Math.round(((currentVariant.mrp - currentVariant.price) / currentVariant.mrp) * 100);

  // Extract unique colors directly from variants in the database (now as hex codes)
  const availableColors = Array.from(new Set(product.variants.map(v => v.color)));

  // Function to determine if a color is light (for checkmark color)
  const isLightColor = (hexColor: string): boolean => {
    // Remove # if present
    const hex = hexColor.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Calculate luminance (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return true if luminance is greater than 0.5 (light color)
    return luminance > 0.5;
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col lg:flex-row p-4 sm:p-6 md:p-8 gap-4 sm:gap-5 md:gap-6 w-full max-w-screen-2xl mx-auto min-h-screen">
        {/* Product Display Section */}
        <div className="flex flex-col justify-between rounded-lg border-2 border-gray-100 p-4 sm:p-6 text-black w-full lg:w-2/3 bg-white shadow-lg">
          <div className="flex flex-row justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{product.name}</h1>
              <p className="text-sm text-gray-600 mt-1">{product.description}</p>
            </div>
            <select
              value={selectedStorage}
              onChange={(e) => setSelectedStorage(e.target.value)}
              className="px-3 py-2 bg-gray-300 rounded-md text-sm sm:text-base font-medium whitespace-nowrap cursor-pointer border-2 border-gray-400 hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {product.storageOptions.map((storage) => (
                <option key={storage} value={storage} className="bg-white text-black">
                  {storage}
                </option>
              ))}
            </select>
          </div>

          {/* Product Image */}
          <div className="mb-4 flex items-center justify-center rounded-lg p-4 overflow-hidden bg-gray-50 relative">
            <img
              src={currentVariant.imageUrl}
              alt={`${product.name} - ${selectedColor}`}
              className="w-full max-w-2xl h-[400px] sm:h-[450px] md:h-[500px] object-contain hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/vite.svg';
              }}
            />
          </div>

          {/* Variant Selectors */}
          <div className="space-y-4">
            {/* Color Selection */}
            <div>
              <p className="text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                Select Color: 
                
              </p>
              <div className="flex flex-wrap gap-3">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`relative flex items-center justify-center p-0 border-2 transition-all transform hover:scale-110 overflow-hidden ${
                      selectedColor === color
                        ? 'shadow-lg ring-2 '
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    title={color}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      minWidth: '48px',
                      minHeight: '48px',
                      maxWidth: '48px',
                      maxHeight: '48px',
                      backgroundColor: color,
                      boxShadow: isLightColor(color)
                        ? 'inset 0 0 0 1px rgba(0,0,0,0.1)' 
                        : undefined
                    }}
                  >
                    {selectedColor === color && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg 
                          className={`w-6 h-6 ${
                            isLightColor(color)
                              ? 'text-gray-700'
                              : 'text-white'
                          }`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={3} 
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* EMI Plans Section */}
        <div className="flex flex-col p-4 sm:p-6 text-black w-full lg:w-1/3">
          <div className="flex flex-col mb-4">
            <div className="mb-3">
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-3xl sm:text-4xl font-bold text-green-700">
                  ₹{currentVariant.price.toLocaleString('en-IN')}
                </p>
                {discountPercent > 0 && (
                  <span className="text-sm text-green-600 font-semibold">
                    {discountPercent}% off
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500 line-through">
                  MRP: ₹{currentVariant.mrp.toLocaleString('en-IN')}
                </p>
                {!currentVariant.inStock && (
                  <span className="text-xs text-red-600 font-semibold">Out of Stock</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-700">EMI Plans backed by Mutual Funds</p>
              <p className="text-xs text-gray-500 mt-1">
                Select a plan to proceed with easy monthly payments
              </p>
            </div>
          </div>

          {/* EMI Plan Selector */}
          <div className="mb-4">
            <EMIPlanSelector
              productPrice={currentVariant.price}
              onSelectPlan={setSelectedPlan}
              selectedPlan={selectedPlan}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={handleProceed}
              disabled={!selectedPlan || !currentVariant.inStock}
              className={`w-full px-4 py-3 rounded-md font-semibold transition-all ${
                selectedPlan && currentVariant.inStock
                  ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {!currentVariant.inStock
                ? 'Out of Stock'
                : !selectedPlan
                ? 'Select EMI Plan to Proceed'
                : 'Proceed with Selected Plan'}
            </button>
            {selectedPlan && currentVariant.inStock && (() => {
              const principal = currentVariant.price - selectedPlan.cashback;
              let monthlyPayment: number;
              
              if (selectedPlan.interestRate === 0) {
                monthlyPayment = Math.ceil(principal / selectedPlan.tenureMonths);
              } else {
                const monthlyInterestRate = selectedPlan.interestRate / 100 / 12;
                monthlyPayment = Math.ceil(
                  (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, selectedPlan.tenureMonths)) /
                  (Math.pow(1 + monthlyInterestRate, selectedPlan.tenureMonths) - 1)
                );
              }
              
              return (
                <p className="text-xs text-center text-gray-600">
                  You'll pay ₹{monthlyPayment.toLocaleString('en-IN')}/month for {selectedPlan.tenureMonths} months
                </p>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;

