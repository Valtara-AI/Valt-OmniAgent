# ============================================================================
# FIX AND SECURE OMNIAGENT SERVER (PowerShell)
# This script diagnoses and fixes all server issues, then applies security
# ============================================================================

$ErrorActionPreference = "Stop"

$SERVER = "91.99.79.131"
$USER = "root"
$KEY = "ubuntu-ky.pem"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  VALT OMNIAGENT - DIAGNOSTIC & FIX" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Upload files first
Write-Host "[1/5] Uploading configurations..." -ForegroundColor Green
scp -i $KEY nginx-secure.conf security-setup.sh "${USER}@${SERVER}:/tmp/"

Write-Host "[2/5] Diagnosing server issues..." -ForegroundColor Green
ssh -i $KEY "$USER@$SERVER" @'
    echo "=== PM2 Status ==="
    pm2 list || echo "PM2 not running"
    
    echo ""
    echo "=== App Directory ==="
    ls -la /var/www/valt-omniagent/ 2>/dev/null || echo "App not found"
    
    echo ""
    echo "=== Port 3000 Status ==="
    netstat -tlpn | grep 3000 || echo "Port 3000 not listening"
    
    echo ""
    echo "=== PM2 Logs (last 20 lines) ==="
    pm2 logs valt-omniagent --lines 20 --nostream 2>/dev/null || echo "No logs"
    
    echo ""
    echo "=== Nginx Sites ==="
    ls -la /etc/nginx/sites-enabled/
'@

Write-Host ""
Write-Host "[3/5] Fixing application..." -ForegroundColor Green
ssh -i $KEY "$USER@$SERVER" @'
    set -e
    
    cd /var/www/valt-omniagent
    
    # Check if app exists
    if [ ! -f "package.json" ]; then
        echo "ERROR: Application not properly deployed!"
        echo "Please run deploy.sh first to deploy the application"
        exit 1
    fi
    
    # Stop PM2 if running
    pm2 stop valt-omniagent 2>/dev/null || true
    pm2 delete valt-omniagent 2>/dev/null || true
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies..."
        npm ci --production
    fi
    
    # Check if build exists
    if [ ! -d ".next" ]; then
        echo "Building application..."
        npm run build
    fi
    
    # Start with PM2
    echo "Starting application with PM2..."
    pm2 start npm --name "valt-omniagent" -- start
    pm2 save
    
    # Wait for app to start
    sleep 3
    
    echo "Application started!"
    pm2 list
'@

Write-Host ""
Write-Host "[4/5] Deploying secure Nginx configuration..." -ForegroundColor Green
ssh -i $KEY "$USER@$SERVER" @'
    set -e
    
    # Backup current config
    cp /etc/nginx/sites-available/omni.valtara.ai /etc/nginx/sites-available/omni.valtara.ai.backup
    
    # Deploy new secure config
    cp /tmp/nginx-secure.conf /etc/nginx/sites-available/omni.valtara.ai
    
    # Remove default site (causes conflict)
    rm -f /etc/nginx/sites-enabled/default
    
    # Ensure our site is enabled
    ln -sf /etc/nginx/sites-available/omni.valtara.ai /etc/nginx/sites-enabled/
    
    # Test configuration
    if nginx -t; then
        echo "Nginx configuration valid, reloading..."
        systemctl reload nginx
    else
        echo "ERROR: Nginx configuration test failed!"
        echo "Restoring backup..."
        cp /etc/nginx/sites-available/omni.valtara.ai.backup /etc/nginx/sites-available/omni.valtara.ai
        nginx -t && systemctl reload nginx
        exit 1
    fi
'@

Write-Host ""
Write-Host "[5/5] Running security setup..." -ForegroundColor Green
ssh -i $KEY "$USER@$SERVER" @'
    chmod +x /tmp/security-setup.sh
    /tmp/security-setup.sh
'@

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  ALL FIXES APPLIED & SECURED" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Testing server..." -ForegroundColor Yellow
curl -I http://91.99.79.131 2>&1 | Select-Object -First 10
Write-Host ""
curl -I https://omni.valtara.ai 2>&1 | Select-Object -First 10

Write-Host ""
Write-Host "To view status:" -ForegroundColor Yellow
Write-Host "  ssh -i $KEY $USER@$SERVER `"pm2 status`""
Write-Host "  ssh -i $KEY $USER@$SERVER `"fail2ban-client status`""
