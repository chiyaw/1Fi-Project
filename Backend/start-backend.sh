#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== 1Fi Backend Setup ===${NC}\n"

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating default .env file...${NC}"
    cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/1fi-project
PORT=5000
NODE_ENV=development
EOF
    echo -e "${GREEN}✅ Created .env file${NC}"
    echo -e "${YELLOW}📝 Please update MONGODB_URI in .env if needed${NC}\n"
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}\n"
fi

# Check if MongoDB is accessible
echo -e "${YELLOW}🔍 Checking MongoDB connection...${NC}"
node -e "
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
mongoose.connect(process.env.MONGODB_URI)
  .then(() => { console.log('✅ MongoDB connected'); process.exit(0); })
  .catch((err) => { console.log('❌ MongoDB connection failed:', err.message); process.exit(1); });
" 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ MongoDB is accessible${NC}\n"
    
    # Ask if user wants to seed the database
    read -p "Do you want to seed the database? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}🌱 Seeding database...${NC}"
        npm run seed
        echo
    fi
else
    echo -e "${RED}❌ MongoDB is not accessible. Please check your MongoDB connection.${NC}\n"
fi

# Start the server
echo -e "${GREEN}🚀 Starting backend server...${NC}\n"
npm run dev

