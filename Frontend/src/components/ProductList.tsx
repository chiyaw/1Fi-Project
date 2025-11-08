import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Product } from '../types/index';
import { getProducts } from '../services/api';

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { productId } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="w-full lg:w-64 bg-white border-r border-gray-200 p-4">
        <h2 className="text-xl font-bold mb-4">Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full lg:w-64 bg-white border-r border-gray-200 p-4">
        <h2 className="text-xl font-bold mb-4 text-red-600">Error</h2>
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto max-h-screen">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Products</h2>
      <div className="space-y-2">
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className={`block p-3 rounded-lg transition-all ${
              productId === product._id
                ? 'bg-blue-500 text-white shadow-md hover:bg-blue-600'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
            }`}
          >
            <h3 className={`font-semibold text-sm ${
              productId === product._id ? 'text-white' : 'text-gray-800 hover:text-blue-600'
            }`}>{product.name}</h3>
            <p className={`text-xs mt-1 ${
              productId === product._id ? 'text-blue-100' : 'text-gray-600'
            }`}>
              {product.brand}
            </p>
            <p className={`text-xs ${
              productId === product._id ? 'text-blue-50' : 'text-gray-500'
            }`}>
              From ₹{product.variants[0]?.price.toLocaleString('en-IN')}
            </p>
          </Link>
        ))}
      </div>
      {products.length === 0 && (
        <p className="text-sm text-gray-500 mt-4">No products available</p>
      )}
    </div>
  );
}

export default ProductList;

