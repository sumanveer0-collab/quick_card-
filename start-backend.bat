@echo off
title QuickCard Backend
echo.
echo  ==========================================
echo   QuickCard Backend Starting...
echo   API: http://localhost:3001/api/v1
echo  ==========================================
echo.
cd /d "%~dp0"
node bootstrap.js
echo.
echo  Backend stopped. Press any key to restart...
pause
node bootstrap.js
