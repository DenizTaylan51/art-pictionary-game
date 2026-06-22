#!/bin/bash
# install-dependencies.sh
# Quick installation script for Art Pictionary Game

echo "🎨 Art Pictionary Game - Installation Script"
echo "============================================="

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    echo "PORT=3000" > .env
    echo "CLIENT_URL=http://localhost:5173" >> .env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client
npm install
cd ..

echo ""
echo "✅ Installation complete!"
echo ""
echo "📚 Next steps:"
echo "1. Start backend: npm run dev:server"
echo "2. Start frontend (new terminal): cd client && npm run dev"
echo "3. Or run both: npm run dev:all"
echo ""
echo "🎮 Open http://localhost:5173 in your browser to start playing!"
