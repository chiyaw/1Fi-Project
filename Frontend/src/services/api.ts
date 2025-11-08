import axios from 'axios';
import type { Product, EMIPlan, EMICalculation } from '../types/index';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get('/products');
  return response.data.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get(`/products/${id}`);
  return response.data.data;
};

export const getProductVariant = async (
  id: string,
  storage: string,
  color: string
) => {
  const response = await api.get(`/products/${id}/variant`, {
    params: { storage, color },
  });
  return response.data.data;
};

export const getProductVariantByColor = async (
  id: string,
  color: string
) => {
  // Encode the color to handle spaces and special characters
  const encodedColor = encodeURIComponent(color);
  const response = await api.get(`/products/${id}/color/${encodedColor}`);
  return response.data.data;
};

// EMI Plans API
export const getEMIPlans = async (): Promise<EMIPlan[]> => {
  const response = await api.get('/emi');
  return response.data.data;
};

export const getEMIPlanById = async (id: string): Promise<EMIPlan> => {
  const response = await api.get(`/emi/${id}`);
  return response.data.data;
};

export const calculateEMI = async (
  productPrice: number,
  planId: string
): Promise<EMICalculation> => {
  const response = await api.post('/emi/calculate', {
    productPrice,
    planId,
  });
  return response.data.data;
};

export default api;

