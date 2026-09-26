@echo off
echo ====================================================
echo 🚀 Launching AI ORCHESTRATOR Engine & Web Application
echo ====================================================
echo.

start "AI Orchestrator Backend API" cmd /c "cd server && npm run dev"
start "AI Orchestrator Frontend App" cmd /c "cd client && npm run dev"

echo.
echo Servers started in separate windows!
echo Backend API: http://localhost:5000/api
echo Frontend UI:  http://localhost:3000
echo.
pause
