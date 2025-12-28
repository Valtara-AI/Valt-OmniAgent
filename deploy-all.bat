@echo off
REM Quick Deploy and Secure Script for Windows
echo ============================================================
echo   VALT OMNIAGENT - DEPLOY AND SECURE
echo ============================================================
echo.

echo [1/6] Building application...
call npm ci
if %errorlevel% neq 0 exit /b %errorlevel%

call npm run build
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo [2/6] Creating deployment package...
tar -czf deploy.tar.gz .next public src package.json package-lock.json next.config.js ecosystem.config.js
if %errorlevel% neq 0 (
    echo ERROR: tar failed. Please install tar or use Git Bash
    exit /b 1
)

echo.
echo [3/6] Uploading to server...
scp -i ubuntu-ky.pem deploy.tar.gz root@91.99.79.131:/var/www/valt-omniagent/
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo [4/6] Deploying on server...
ssh -i ubuntu-ky.pem root@91.99.79.131 "cd /var/www/valt-omniagent && tar -xzf deploy.tar.gz && rm deploy.tar.gz && npm ci --production && pm2 delete valt-omniagent 2>/dev/null; pm2 start ecosystem.config.js && pm2 save"
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo [5/6] Deploying security configuration...
scp -i ubuntu-ky.pem nginx-secure.conf security-setup.sh root@91.99.79.131:/tmp/
ssh -i ubuntu-ky.pem root@91.99.79.131 "chmod +x /tmp/security-setup.sh && /tmp/security-setup.sh"

echo.
echo [6/6] Final verification...
ssh -i ubuntu-ky.pem root@91.99.79.131 "pm2 list && echo --- && ufw status"

echo.
del deploy.tar.gz 2>nul

echo ============================================================
echo   DEPLOYMENT COMPLETE
echo ============================================================
echo.
echo Testing site...
curl -I https://omni.valtara.ai
echo.
echo Done! Visit: https://omni.valtara.ai
