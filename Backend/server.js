import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import detect from "detect-port";
import {
  DEFAULT_PORT,
  CORS_ORIGINS,
  CORS_METHODS,
  CORS_ALLOWED_HEADERS,
  SERVER_NAME,
  API_VERSION,
  API_ENDPOINTS,
  RESPONSE_MESSAGES,
  HTTP_STATUS
} from './constant.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = await detect(parseInt(process.env.PORT) || DEFAULT_PORT);

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: CORS_ORIGINS, // Allow frontend origins
  credentials: true,
  methods: CORS_METHODS,
  allowedHeaders: CORS_ALLOWED_HEADERS
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
    message: SERVER_NAME,
    version: API_VERSION,
    endpoints: API_ENDPOINTS
  });
});

app.use('/api/products', productRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: RESPONSE_MESSAGES.ROUTE_NOT_FOUND
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR,
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
});

export default app;

