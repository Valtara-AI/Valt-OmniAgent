# Deployment script for Valt OmniAgent (PowerShell)
# Server: 91.99.79.131
# Domain: omni.valtara.ai

$ErrorActionPreference = "Stop"

Write-Host "Starting deployment to omni.valtara.ai..." -ForegroundColor Cyan

# Configuration
$SERVER_USER = "root"
$SERVER_IP = "91.99.79.131"
$SERVER_PATH = "/var/www/valt-omniagent"
$DOMAIN = "omni.valtara.ai"
$KEY = "ubuntu-ky.pem"

# Build locally
Write-Host "Building production bundle..." -ForegroundColor Yellow
npm ci
npm run build

# Create deployment package with tar
Write-Host "Creating deployment package..." -ForegroundColor Yellow
tar -czf deploy.tar.gz .next public package.json package-lock.json next.config.js ecosystem.config.js

# Upload to server
Write-Host "Uploading to server..." -ForegroundColor Yellow
scp -i $KEY deploy.tar.gz "${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/"

# Deploy on server
Write-Host "Deploying on server..." -ForegroundColor Yellow
ssh -i $KEY "$SERVER_USER@$SERVER_IP" "cd /var/www/valt-omniagent && tar -xzf deploy.tar.gz && rm deploy.tar.gz && npm ci --production && pm2 delete valt-omniagent 2>/dev/null; pm2 start ecosystem.config.js && pm2 save"

# Cleanup
Remove-Item "deploy.tar.gz" -Force

Write-Host ""
Write-Host "Deployment to $DOMAIN successful!" -ForegroundColor Green
Write-Host "Visit: https://$DOMAIN" -ForegroundColor Cyan
Write-Host ""

# Test the deployment
Write-Host "Testing deployment..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
curl -I "https://$DOMAIN" --max-time 10

# Cleanup
if (Test-Path "deploy.tar.gz") { Remove-Item "deploy.tar.gz" }
if (Test-Path "deploy.zip") { Remove-Item "deploy.zip" }

Write-Host ""
Write-Host "🎉 Deployment to $DOMAIN successful!" -ForegroundColor Green
Write-Host "🌐 Visit: https://$DOMAIN" -ForegroundColor Cyan
Write-Host ""

# Test the deployment
Write-Host "Testing deployment..." -ForegroundColor Yellow
curl -I https://$DOMAIN --max-time 10 2>&1 | Select-Object -First 5
