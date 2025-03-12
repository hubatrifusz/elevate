@echo off

REM --- Configuration ---
set FRONTEND_PATH="web-frontend"

REM --- Start Backend ---
echo Starting backend...
echo Current directory: %CD%
echo Current directory after cd: %CD%
start "Backend" cmd /c "docker compose up"

REM --- Wait for Backend (Optional, but recommended) ---
echo Waiting for backend to start...
ping 127.0.0.1 -n 5 > nul

REM --- Install Dependencies (Wait for completion) ---
echo Installing dependencies...
echo Current directory: %CD%
echo Attempting to navigate to: %~dp0%FRONTEND_PATH%
cd /d %~dp0%FRONTEND_PATH%
echo Current directory after cd: %CD%
cmd /c "npm install"

REM --- Start Cypress ---
echo Starting Cypress...
echo Current directory: %CD%
echo Attempting to navigate to: %~dp0%FRONTEND_PATH%
cd /d %~dp0%FRONTEND_PATH%
echo Current directory after cd: %CD%
start "Cypress" cmd /c "npx cypress open"

echo Batch script completed.
pause