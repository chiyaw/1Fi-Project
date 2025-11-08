import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import emiRoutes from './routes/emiRoutes.js';
import detect from "detect-port";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT) || 5000;
const PORT = await detect(DEFAULT_PORT);

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Allow frontend origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '1Fi Backend API',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      emiPlans: '/api/emi'
    }
  });
});

app.use('/api/products', productRoutes);
app.use('/api/emi', emiRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
});

export default app;

