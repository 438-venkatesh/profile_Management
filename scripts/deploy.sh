#!/bin/bash

# Profile Management System - Deployment Script
# This script automates the deployment process for both frontend and backend

set -e  # Exit on any error

echo "🚀 Profile Management System - Deployment Script"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    print_success "All dependencies are installed"
}

# Install project dependencies
install_dependencies() {
    print_status "Installing frontend dependencies..."
    npm install
    
    print_status "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    
    print_success "Dependencies installed successfully"
}

# Build frontend for production
build_frontend() {
    print_status "Building frontend for production..."
    
    # Check if .env.production exists
    if [ ! -f ".env.production" ]; then
        print_warning ".env.production not found. Creating template..."
        cat > .env.production << EOF
# Production Environment Variables
REACT_APP_API_URL=https://your-heroku-app.herokuapp.com
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0
EOF
        print_warning "Please update .env.production with your actual API URL"
    fi
    
    npm run build
    print_success "Frontend built successfully"
}

# Deploy frontend to Vercel
deploy_frontend_vercel() {
    print_status "Deploying frontend to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_status "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    print_status "Logging in to Vercel..."
    vercel login
    
    print_status "Deploying to Vercel..."
    vercel --prod
    
    print_success "Frontend deployed to Vercel successfully"
}

# Deploy backend to Heroku
deploy_backend_heroku() {
    print_status "Deploying backend to Heroku..."
    
    if ! command -v heroku &> /dev/null; then
        print_error "Heroku CLI is not installed. Please install it from https://devcenter.heroku.com/articles/heroku-cli"
        exit 1
    fi
    
    print_status "Logging in to Heroku..."
    heroku login
    
    # Check if we're in the backend directory
    if [ ! -d "backend" ]; then
        print_error "Backend directory not found. Please run this script from the project root."
        exit 1
    fi
    
    cd backend
    
    # Check if Heroku app is already configured
    if ! git remote | grep -q heroku; then
        print_status "Creating Heroku app..."
        read -p "Enter your Heroku app name: " app_name
        heroku create $app_name
    fi
    
    print_status "Deploying to Heroku..."
    git add .
    git commit -m "Deploy to Heroku" || true
    git push heroku main
    
    cd ..
    print_success "Backend deployed to Heroku successfully"
}

# Setup environment variables
setup_environment() {
    print_status "Setting up environment variables..."
    
    echo ""
    echo "Please provide the following information:"
    echo ""
    
    read -p "Enter your Heroku app URL (e.g., https://your-app.herokuapp.com): " heroku_url
    read -p "Enter your MongoDB Atlas connection string: " mongodb_uri
    read -p "Enter your Vercel app URL (e.g., https://your-app.vercel.app): " vercel_url
    
    # Update frontend environment
    cat > .env.production << EOF
REACT_APP_API_URL=$heroku_url
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0
EOF
    
    # Update backend environment in Heroku
    if command -v heroku &> /dev/null; then
        cd backend
        heroku config:set NODE_ENV=production
        heroku config:set CORS_ORIGIN=$vercel_url
        heroku config:set MONGODB_URI="$mongodb_uri"
        cd ..
    fi
    
    print_success "Environment variables configured"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    # Frontend tests
    npm test -- --watchAll=false --passWithNoTests
    
    # Backend tests
    cd backend
    npm test || true
    cd ..
    
    print_success "Tests completed"
}

# Main deployment function
main() {
    echo ""
    print_status "Starting deployment process..."
    echo ""
    
    # Check dependencies
    check_dependencies
    
    # Install dependencies
    install_dependencies
    
    # Run tests
    run_tests
    
    # Setup environment
    setup_environment
    
    # Build frontend
    build_frontend
    
    # Deploy backend
    deploy_backend_heroku
    
    # Deploy frontend
    deploy_frontend_vercel
    
    echo ""
    print_success "🎉 Deployment completed successfully!"
    echo ""
    echo "Your application is now live at:"
    echo "Frontend: $vercel_url"
    echo "Backend: $heroku_url"
    echo ""
    echo "Next steps:"
    echo "1. Test your deployed application"
    echo "2. Set up monitoring and logging"
    echo "3. Configure custom domain (optional)"
    echo "4. Set up automated backups"
    echo ""
}

# Handle script arguments
case "${1:-}" in
    "frontend")
        check_dependencies
        install_dependencies
        build_frontend
        deploy_frontend_vercel
        ;;
    "backend")
        check_dependencies
        install_dependencies
        deploy_backend_heroku
        ;;
    "env")
        setup_environment
        ;;
    "build")
        check_dependencies
        install_dependencies
        build_frontend
        ;;
    "test")
        check_dependencies
        install_dependencies
        run_tests
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [option]"
        echo ""
        echo "Options:"
        echo "  frontend    Deploy only frontend to Vercel"
        echo "  backend     Deploy only backend to Heroku"
        echo "  env         Setup environment variables"
        echo "  build       Build frontend for production"
        echo "  test        Run all tests"
        echo "  help        Show this help message"
        echo ""
        echo "If no option is provided, full deployment will be performed."
        ;;
    "")
        main
        ;;
    *)
        print_error "Unknown option: $1"
        echo "Use '$0 help' to see available options."
        exit 1
        ;;
esac
