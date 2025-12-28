@echo off
REM ==============================================================================
REM VALT OMNIAGENT - ONE-CLICK DEPLOYMENT
REM ==============================================================================
REM This batch file runs the PowerShell deployment script
REM ==============================================================================

echo.
echo ================================================================
echo   VALT OMNIAGENT - DEPLOYMENT LAUNCHER
echo ================================================================
echo.

REM Check if PowerShell is available
where powershell >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] PowerShell not found!
    pause
    exit /b 1
)

REM Run the deployment script
powershell -ExecutionPolicy Bypass -File "deploy-full.ps1"

echo.
echo ================================================================
echo   Deployment script completed
echo ================================================================
echo.
pause
