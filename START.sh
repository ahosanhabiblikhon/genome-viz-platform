#!/bin/bash

echo "🧬 GenomeViz - Genome Visualization Platform"
echo "==========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js is not installed. Please install Node.js 18+ first.${NC}"
    echo "Download from: https://nodejs.org/"
    exit 1
fi

echo -e "${BLUE}Current directory: $(pwd)${NC}"
echo ""

# Ask user for setup mode
echo "Choose setup mode:"
echo "1) Quick Demo (Frontend only - works immediately)"
echo "2) Full Setup (Frontend + Backend - all features)"
echo ""
read -p "Enter choice [1-2]: " choice

case $choice in
    1)
        echo ""
        echo -e "${GREEN}Setting up Quick Demo Mode...${NC}"
        echo ""

        # Install frontend dependencies
        echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
        npm install

        echo ""
        echo -e "${GREEN}✅ Setup complete!${NC}"
        echo ""
        echo "Starting GenomeViz in Demo Mode..."
        echo ""
        echo -e "${BLUE}Frontend will be available at: http://localhost:3000${NC}"
        echo ""
        echo "Press Ctrl+C to stop the server"
        echo ""

        npm run dev
        ;;

    2)
        echo ""
        echo -e "${GREEN}Setting up Full Mode (Frontend + Backend)...${NC}"
        echo ""

        # Check if Python is installed
        if ! command -v python3 &> /dev/null; then
            echo -e "${YELLOW}⚠️  Python 3 is not installed. Please install Python 3.9+ first.${NC}"
            exit 1
        fi

        # Install frontend dependencies
        echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
        npm install

        # Setup backend
        echo ""
        echo -e "${BLUE}📦 Setting up Python backend...${NC}"
        cd backend

        # Create virtual environment if it doesn't exist
        if [ ! -d "venv" ]; then
            echo "Creating Python virtual environment..."
            python3 -m venv venv
        fi

        # Activate virtual environment and install dependencies
        echo "Installing Python packages..."
        source venv/bin/activate
        pip install -q --upgrade pip
        pip install -q -r requirements.txt

        cd ..

        echo ""
        echo -e "${GREEN}✅ Setup complete!${NC}"
        echo ""
        echo "To start the application:"
        echo ""
        echo -e "${BLUE}Terminal 1 - Backend:${NC}"
        echo "  cd backend"
        echo "  source venv/bin/activate"
        echo "  python main.py"
        echo ""
        echo -e "${BLUE}Terminal 2 - Frontend:${NC}"
        echo "  npm run dev"
        echo ""
        echo -e "${BLUE}Then open:${NC}"
        echo "  Frontend: http://localhost:3000"
        echo "  Backend API: http://localhost:8000"
        echo "  API Docs: http://localhost:8000/docs"
        echo ""
        echo "Would you like to start both servers now? (y/n)"
        read -p "> " start_now

        if [ "$start_now" = "y" ] || [ "$start_now" = "Y" ]; then
            echo ""
            echo "Starting backend server..."
            cd backend
            source venv/bin/activate
            python main.py &
            BACKEND_PID=$!
            cd ..

            sleep 3

            echo "Starting frontend..."
            npm run dev &
            FRONTEND_PID=$!

            echo ""
            echo -e "${GREEN}✅ Both servers are running!${NC}"
            echo ""
            echo "Press Ctrl+C to stop both servers"

            # Wait for Ctrl+C
            trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
            wait
        fi
        ;;

    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac
