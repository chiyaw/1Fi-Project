#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== 1Fi Frontend Setup ===${NC}\n"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  .env.local file not found. Creating default .env.local file...${NC}"
    cat > .env.local << EOF
VITE_API_URL=http://localhost:5001/api
EOF
    echo -e "${GREEN}✅ Created .env.local file${NC}\n"
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}\n"
fi

# Start the frontend
echo -e "${GREEN}🚀 Starting frontend server...${NC}\n"
echo -e "${YELLOW}📌 Make sure the backend is running on http://localhost:5001${NC}\n"
npm run dev

