# ============================================================================
# DEPLOY SECURITY TO PRODUCTION (Windows PowerShell)
# Valt OmniAgent - omni.valtara.ai
# ============================================================================

$ErrorActionPreference = "Stop"

# Configuration
$SERVER = "91.99.79.131"
$USER = "root"
$KEY = "ubuntu-ky.pem"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  VALT OMNIAGENT - SECURITY DEPLOYMENT" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Check SSH key
if (-not (Test-Path $KEY)) {
    Write-Host "ERROR: SSH key not found: $KEY" -ForegroundColor Red
    exit 1
}

# Step 1: Upload security configurations
Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Uploading security configurations..." -ForegroundColor Green

# Upload main security files
scp -i $KEY nginx-secure.conf security-setup.sh "${USER}@${SERVER}:/tmp/"

# Create directories on server and upload fail2ban configs
ssh -i $KEY "$USER@$SERVER" "mkdir -p /tmp/fail2ban/{filter.d,jail.d}"

# Upload fail2ban filter configs
Get-ChildItem "security\fail2ban\filter.d\*.conf" | ForEach-Object {
    scp -i $KEY $_.FullName "${USER}@${SERVER}:/tmp/fail2ban/filter.d/"
}

# Upload fail2ban jail configs
Get-ChildItem "security\fail2ban\jail.d\*.conf" | ForEach-Object {
    scp -i $KEY $_.FullName "${USER}@${SERVER}:/tmp/fail2ban/jail.d/"
}

Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Security files uploaded" -ForegroundColor Green

# Step 2: Run security setup on server
Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Running security setup on server..." -ForegroundColor Green

$remoteScript = @'
set -e

echo "[INFO] Setting permissions..."
chmod +x /tmp/security-setup.sh

echo "[INFO] Running security setup..."
cd /tmp
./security-setup.sh

echo "[INFO] Copying fail2ban configs..."
cp /tmp/fail2ban/filter.d/*.conf /etc/fail2ban/filter.d/ 2>/dev/null || true
cp /tmp/fail2ban/jail.d/*.conf /etc/fail2ban/jail.d/ 2>/dev/null || true

echo "[INFO] Restarting fail2ban..."
systemctl restart fail2ban

echo "[INFO] Deploying nginx secure config..."
cp /tmp/nginx-secure.conf /etc/nginx/sites-available/omni.valtara.ai

# Enable the site
ln -sf /etc/nginx/sites-available/omni.valtara.ai /etc/nginx/sites-enabled/

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Test and reload nginx
if nginx -t; then
    systemctl reload nginx
    echo "[SUCCESS] Nginx configuration deployed"
else
    echo "[ERROR] Nginx configuration test failed!"
    exit 1
fi

echo ""
echo "[INFO] Checking application status..."
pm2 status || echo "PM2 not running - need to deploy app first"

echo ""
echo "[INFO] Final status check..."
ufw status
fail2ban-client status
'@

ssh -i $KEY "$USER@$SERVER" $remoteScript

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  SECURITY DEPLOYMENT COMPLETE" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Security features deployed:" -ForegroundColor Green
Write-Host "  √ DDoS/DoS protection (rate limiting)"
Write-Host "  √ Connection limiting per IP"
Write-Host "  √ Bad bot/scanner blocking"
Write-Host "  √ Fail2ban brute force protection"
Write-Host "  √ SSH hardening"
Write-Host "  √ Firewall configuration"
Write-Host "  √ Security headers (HSTS, CSP, etc.)"
Write-Host "  √ Automatic security updates"
Write-Host "  √ Kernel hardening"
Write-Host ""
Write-Host "To verify security:" -ForegroundColor Yellow
Write-Host "  curl -I https://omni.valtara.ai"
Write-Host ""
Write-Host "To check fail2ban:" -ForegroundColor Yellow
Write-Host "  ssh -i $KEY $USER@$SERVER `"fail2ban-client status`""
Write-Host ""
