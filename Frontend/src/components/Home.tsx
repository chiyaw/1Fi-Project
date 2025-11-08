import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProducts } from '../services/api';
import type { Product } from '../types/index';
import { UI_MESSAGES } from '../constant';

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        // Redirect to first product if available
        if (data.length > 0) {
          navigate(`/product/${data[0]._id}`);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{UI_MESSAGES.LOADING.PRODUCTS}</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{UI_MESSAGES.HOME.WELCOME_TITLE}</h1>
          <p className="text-gray-600 mb-6">{UI_MESSAGES.PRODUCT.NO_PRODUCTS_MOMENT}</p>
        </div>
      </div>
    );
  }

  return null; // Will redirect automatically
}

export default Home;

