# 1Fi - Product & EMI Management Platform

A modern e-commerce platform with integrated EMI (Equated Monthly Installment) plans backed by mutual funds. The platform enables customers to purchase products with flexible payment options.

## 🌐 Live Demo

- **Frontend Application**: [http://13.204.211.209:3000](http://13.204.211.209:3000)
- **Backend API**: [http://13.204.211.209:5000](http://13.204.211.209:5000)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)

## ✨ Features

### Core Functionality
- **Product Catalog**: Browse products with detailed information including brand, category, and specifications
- **Product Variants**: Multiple variants for each product based on color and storage options
- **EMI Plans**: Flexible payment plans with multiple tenure options (3, 6, 12, 24, 36, 48, 60 months)
- **Real-time EMI Calculator**: Automatic calculation of monthly payments based on selected plan
- **Dynamic Pricing**: Display of MRP, selling price, and discount percentage
- **Stock Management**: Real-time stock availability tracking
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices

### User Experience
- **Color Selection**: Visual color picker with hex code support
- **Storage Selection**: Dropdown selector for storage configurations
- **URL State Management**: Shareable URLs with variant information
- **Image Gallery**: High-quality product images hosted on Cloudinary
- **Product Search**: Text-based search across product names, descriptions, and brands

### EMI Features
- **Zero Interest Plans**: 3, 6, 12, and 24-month plans without interest
- **Interest-based Plans**: 36, 48, and 60-month plans with competitive interest rates
- **Cashback Options**: Special promotional cashback on select plans
- **Transparent Calculations**: Clear display of total amount and monthly payments

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite (Rolldown)
- **Styling**: TailwindCSS 4.1.17
- **Routing**: React Router DOM 6.21.0
- **HTTP Client**: Axios 1.6.2
- **Type Safety**: TypeScript 5.9.3

### Backend
- **Runtime**: Node.js
- **Framework**: Express 4.18.2
- **Database**: MongoDB with Mongoose 8.0.3
- **Environment Management**: dotenv 16.3.1
- **Development**: nodemon 3.0.2

### Infrastructure
- **Hosting**: AWS EC2
- **Database**: MongoDB Atlas
- **Image Storage**: Cloudinary CDN
- **Protocol**: HTTP support with SSL configuration

## 🏗 Architecture

### System Architecture

The application follows a client-server architecture:

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  React Frontend │◄────────►  Express API   │◄────────►  MongoDB Atlas  │
│   (Port 3000)   │   HTTP  │  (Port 5000)    │         │                 │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
        │                           │
        │                           │
        ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│   Cloudinary    │         │   AWS EC2       │
│   (Images CDN)  │         │   (Hosting)     │
└─────────────────┘         └─────────────────┘
```

### Data Flow

1. **Product Listing**: Frontend fetches all products from `/api/products`
2. **Product Details**: User selects a product, frontend fetches details from `/api/products/:id`
3. **Variant Selection**: Client-side filtering of variants based on color and storage
4. **EMI Calculation**: Real-time calculation using configured plans
5. **Image Loading**: Product images served via Cloudinary CDN

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB instance (local or Atlas)
- Git

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/chiyaw/1Fi-Project
cd 1Fi-Project
```

#### 2. Backend Setup

```bash
cd Backend
npm install

# Create .env file
cp .env
# Edit .env with your MongoDB URI and other configurations

# Start the backend server
npm start

# For development with auto-reload
npm run dev
```

#### 3. Frontend Setup

```bash
cd Frontend
npm install

# Create .env file
cp .env
# Edit .env with your API URL

# Start the development server
npm run dev

# For production build
npm run build
```

### Quick Start Scripts

Both frontend and backend include convenience scripts:

```bash
# Backend (from Backend directory)
chmod +x start-backend.sh
./start-backend.sh

# Frontend (from Frontend directory)
chmod +x start-frontend.sh
./start-frontend.sh
```

## 📚 API Documentation

### Base URL
```
Production: http://13.204.211.209:5000/api
Development: http://localhost:5000/api
```

### Endpoints

#### 1. Get All Products
```http
GET /api/products
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "690df6ad9c1d3c3d58ef3509",
      "name": "Samsung Galaxy S23",
      "description": "Flagship Android smartphone...",
      "category": "smartphones",
      "brand": "Samsung",
      "storageOptions": ["128GB", "256GB", "512GB"],
      "colorOptions": ["#ddeade", "#f5f5dc"],
      "variants": [...],
      "defaultVariant": {...},
      "featured": false,
      "active": true
    }
  ]
}
```

#### 2. Get Product by ID
```http
GET /api/products/:id
```

**Parameters:**
- `id` (string): Product ObjectId

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "690df6ad9c1d3c3d58ef3509",
    "name": "Samsung Galaxy S23",
    "variants": [
      {
        "_id": "variant-id",
        "storage": ["128GB"],
        "color": "#ddeade",
        "mrp": 89999,
        "price": 45999,
        "imageUrl": "https://res.cloudinary.com/...",
        "inStock": true,
        "stockQuantity": 50
      }
    ]
  }
}
```

#### 3. API Health Check
```http
GET /
```

### Error Responses

All endpoints follow a consistent error format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

**Status Codes:**
- `200` - Success
- `404` - Resource not found
- `500` - Internal server error

## 🗄 Database Schema

### Product Collection (`ProductInfo`)

```javascript
{
  _id: ObjectId,
  name: String,                    // Product name (3-200 chars)
  description: String,             // Product description (10-2000 chars)
  category: String,                // Enum: smartphone, laptop, tablet, etc.
  brand: String,                   // Brand name (2-100 chars)
  storageOptions: [String],        // Available storage options
  colorOptions: [String],          // Available color options (hex codes)
  variants: [
    {
      _id: ObjectId,
      storage: [String],           // Storage configurations for this variant
      color: String,               // Hex color code
      mrp: Number,                 // Maximum Retail Price
      price: Number,               // Selling price
      imageUrl: String,            // Cloudinary URL
      inStock: Boolean,            // Stock availability
      stockQuantity: Number        // Available quantity
    }
  ],
  defaultVariant: {
    storage: String | [String],
    color: String
  },
  featured: Boolean,               // Featured product flag
  active: Boolean,                 // Product visibility
  rating: {
    average: Number,               // 0-5
    count: Number                  // Number of ratings
  },
  specifications: Map<String, String>,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes
- Text index on `name`, `description`, and `brand`
- Compound index on `category` and `brand`
- Compound index on `featured` and `active`
- Descending index on `createdAt`

### Virtual Fields
- `discountPercentage`: Calculated from MRP and price
- `minPrice`: Minimum price across all variants
- `maxPrice`: Maximum price across all variants
- `hasStock`: Whether any variant is in stock

## 📁 Project Structure

```
1Fi-Project/
├── Backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection configuration
│   ├── models/
│   │   ├── index.js              # Model exports
│   │   └── Product.js            # Product schema and model
│   ├── routes/
│   │   └── productRoutes.js      # Product API routes
│   ├── scripts/
│   │   └── validateExistingData.js
│   ├── utils/                    # Utility functions
│   ├── constant.js               # Server constants
│   ├── server.js                 # Express server entry point
│   ├── package.json
│   └── .env                      # Environment variables
│
└── Frontend/
    ├── public/
    │   └── smartphone.png        # Website Icon
    ├── src/
    │   ├── assets/               # Static assets
    │   ├── components/
    │   │   ├── Home.tsx          # Home page component
    │   │   ├── ProductList.tsx   # Sidebar product list
    │   │   ├── ProductDetail.tsx # Main product view
    │   │   └── EMIPlanSelector.tsx # EMI plan selector
    │   ├── services/
    │   │   └── api.ts            # Axios API client
    │   ├── types/
    │   │   └── index.ts          # TypeScript interfaces
    │   ├── constant.tsx          # Frontend constants
    │   ├── App.tsx               # Main app component
    │   ├── main.tsx              # Entry point
    │   └── index.css             # Global styles
    ├── package.json
    ├── tsconfig.json             # TypeScript configuration
    ├── vite.config.ts            # Vite configuration
    └── .env                      # Environment variables
```

## 🚀 Deployment

### AWS EC2 Deployment

The application is deployed on AWS EC2 with the following configuration:

**Backend:**
- Port: 5000
- Public URL: http://13.204.211.209:5000
- Process Manager: PM2 (recommended)

**Frontend:**
- Port: 3000
- Public URL: http://13.204.211.209:3000
- Build: Production optimized Vite build

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Configure network access (whitelist EC2 IP)
4. Create database user
5. Get connection string and add to `.env`

### Cloudinary Setup

1. Create a Cloudinary account
2. Upload product images to media library
3. Use generated URLs in product variants
4. Configure upload presets for dynamic uploads

## ⚙️ Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/1fi-project

# CORS Configuration
ALLOWED_ORIGINS=http://13.204.211.209:3000,http://localhost:3000

# SSL Configuration (Optional)
USE_HTTPS=false
SSL_KEY_PATH=/path/to/private-key.pem
SSL_CERT_PATH=/path/to/certificate.pem
```

### Frontend (.env)

```env
# API Configuration
VITE_API_URL=http://13.204.211.209:5000/api

# Environment
VITE_MODE=production
```

## 📊 EMI Calculation Logic

The platform uses the standard EMI formula for interest-based plans:

```
EMI = [P × r × (1+r)^n] / [(1+r)^n-1]

Where:
P = Principal amount (price - cashback)
r = Monthly interest rate (annual rate / 12 / 100)
n = Tenure in months
```

For zero-interest plans:
```
EMI = Principal / Tenure
```

### Available Plans

| Tenure | Interest Rate | Type |
|--------|--------------|------|
| 3 months | 0% | No Cost EMI |
| 6 months | 0% | No Cost EMI |
| 12 months | 0% | No Cost EMI |
| 24 months | 0% | No Cost EMI |
| 36 months | 10.5% | Standard EMI |
| 48 months | 10.5% | Standard EMI |
| 60 months | 10.5% | Standard EMI |

## 🔧 Development

### Running Tests

```bash
# Backend validation
cd Backend
npm run validate

# Frontend linting
cd Frontend
npm run lint
```

### Available Scripts

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run validate` - Validate database records

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Design Features

- **Color-coded EMI badges**: Green for 0% interest, Orange for standard interest
- **Responsive grid layout**: Adapts from mobile to desktop seamlessly
- **Real-time variant switching**: Instant updates without page reload
- **Image optimization**: Cloudinary CDN for fast loading
- **Accessible UI**: WCAG compliant color contrast
- **Loading states**: Skeleton screens and spinners for better UX
- **Error handling**: User-friendly error messages

## 📝 License

This project is part of a job assignment for 1Fi.

## 👥 Support

For questions or support, please contact shhreyasrivastava@gmail.com.

---

**Version**: 1.0.0  
**Last Updated**: 9th November 2025  
**Maintained by**: Shreya Srivastava

