#!/bin/bash
# ============================================================================
# DEPLOY SECURITY TO PRODUCTION
# Valt OmniAgent - omni.valtara.ai
# ============================================================================
# This script uploads and applies all security configurations to the server
# ============================================================================

set -e

# Configuration
SERVER="91.99.79.131"
USER="root"
KEY="ubuntu-ky.pem"
APP_DIR="/var/www/valt-omniagent"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date '+%H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Check SSH key
if [ ! -f "$KEY" ]; then
    error "SSH key not found: $KEY"
fi

echo "============================================================"
echo "  VALT OMNIAGENT - SECURITY DEPLOYMENT"
echo "============================================================"
echo ""

# Step 1: Upload security configurations
log "Uploading security configurations..."

scp -i $KEY \
    nginx-secure.conf \
    security-setup.sh \
    $USER@$SERVER:/tmp/

# Upload fail2ban configs
ssh -i $KEY $USER@$SERVER "mkdir -p /tmp/fail2ban/{filter.d,jail.d}"
scp -i $KEY security/fail2ban/filter.d/*.conf $USER@$SERVER:/tmp/fail2ban/filter.d/
scp -i $KEY security/fail2ban/jail.d/*.conf $USER@$SERVER:/tmp/fail2ban/jail.d/

log "Security files uploaded"

# Step 2: Run security setup on server
log "Running security setup on server..."

ssh -i $KEY $USER@$SERVER << 'ENDSSH'
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
ENDSSH

log "Security deployment complete!"

echo ""
echo "============================================================"
echo "  SECURITY DEPLOYMENT COMPLETE"
echo "============================================================"
echo ""
echo "Security features deployed:"
echo "  ✓ DDoS/DoS protection (rate limiting)"
echo "  ✓ Connection limiting per IP"
echo "  ✓ Bad bot/scanner blocking"
echo "  ✓ Fail2ban brute force protection"
echo "  ✓ SSH hardening"
echo "  ✓ Firewall configuration"
echo "  ✓ Security headers (HSTS, CSP, etc.)"
echo "  ✓ Automatic security updates"
echo "  ✓ Kernel hardening"
echo ""
echo "To verify security:"
echo "  curl -I https://omni.valtara.ai"
echo ""
echo "To check fail2ban:"
echo "  ssh -i $KEY $USER@$SERVER \"fail2ban-client status\""
echo ""
