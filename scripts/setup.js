const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Profile Management Application...\n');

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  const envContent = `REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file');
} else {
  console.log('✅ .env file already exists');
}

// Create backend .env file if it doesn't exist
const backendEnvPath = path.join(__dirname, '..', 'backend', '.env');
if (!fs.existsSync(backendEnvPath)) {
  const backendEnvContent = `MONGO_URI=mongodb+srv://n210438_db_user:venky@cluster0.atapvui.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
NODE_ENV=development`;
  
  fs.writeFileSync(backendEnvPath, backendEnvContent);
  console.log('✅ Created backend .env file');
} else {
  console.log('✅ Backend .env file already exists');
}

console.log('\n📋 Next steps:');
console.log('1. Install dependencies: npm install');
console.log('2. Install backend dependencies: cd backend && npm install');
console.log('3. Start backend: cd backend && npm run dev');
console.log('4. Start frontend: npm start');
console.log('\n🎉 Setup complete!');
