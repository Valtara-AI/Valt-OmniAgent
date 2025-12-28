@echo off
setlocal enabledelayedexpansion

:: Valt OmniAgent - Windows Initial Deployment Script
:: This script handles deployment from Windows using Git Bash

echo ========================================
echo Valt OmniAgent - Initial Deployment
echo ========================================
echo.

:: Check if Git Bash is installed
where bash >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Git Bash is not installed or not in PATH
    echo.
    echo Please install Git for Windows from: https://git-scm.com/download/win
    echo Or run this script from Git Bash directly
    pause
    exit /b 1
)

echo Using Git Bash to run deployment...
echo.

:: Run the deployment script using Git Bash
bash initial-deploy.sh

pause
