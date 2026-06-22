@echo off
REM install-dependencies.bat
REM Quick installation script for Art Pictionary Game (Windows)

echo 🎨 Art Pictionary Game - Installation Script
echo =============================================

echo 📦 Installing backend dependencies...
call npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    (
        echo PORT=3000
        echo CLIENT_URL=http://localhost:5173
    ) > .env
    echo ✅ .env file created
) else (
    echo ✅ .env file already exists
)

echo 📦 Installing frontend dependencies...
cd client
call npm install
cd ..

echo.
echo ✅ Installation complete!
echo.
echo 📚 Next steps:
echo 1. Start backend: npm run dev:server
echo 2. Start frontend (new terminal): cd client ^&^& npm run dev
echo 3. Or run both: npm run dev:all
echo.
echo 🎮 Open http://localhost:5173 in your browser to start playing!
pause
