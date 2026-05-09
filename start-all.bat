@echo off
title QuickCard Launcher
echo.
echo  ==========================================
echo   QuickCard - Starting All Services
echo  ==========================================
echo.
cd /d "%~dp0"

echo  [1/2] Starting Backend (port 3001)...
start "QuickCard Backend" cmd /k "title QuickCard Backend && node bootstrap.js"

echo  Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo  [2/2] Starting Frontend (port 3000)...
start "QuickCard Frontend" cmd /k "title QuickCard Frontend && cd frontend && npm run dev"

echo.
echo  ==========================================
echo   Both services starting in new windows.
echo.
echo   Frontend  -> http://localhost:3000
echo   Backend   -> http://localhost:3001/api/v1
echo   Login     -> demo@quickcard.app / Demo@1234
echo  ==========================================
echo.
echo  Keep both windows open while using the app.
echo  Close this window when done.
echo.
pause
