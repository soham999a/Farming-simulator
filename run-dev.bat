@echo off
cd /d "%~dp0"
echo Setting up Node.js environment...
set "PATH=%CD%\node-v20.11.0-win-x64;%PATH%"
echo Node.js version:
node --version
echo Starting farming app development server...
echo The app will be available at: http://localhost:5173
npm run dev
pause
