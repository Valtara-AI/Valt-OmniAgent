#!/bin/bash

###############################################################################
# Valt OmniAgent - Initial Production Deployment
# 
# This script handles the complete first-time deployment including:
# - SSH key setup and acceptance
# - Server initialization
# - Application deployment
# - CI/CD infrastructure setup
#
# Usage: bash initial-deploy.sh
###############################################################################

set -e

# Configuration
SERVER_IP="91.99.79.131"
SERVER_USER="root"
SSH_KEY="ubuntu-ky.pem"
DOMAIN="omni.valtara.ai"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✓${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Header
clear
echo -e "${GREEN}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║        Valt OmniAgent - Initial Production Deployment     ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

echo "Target Server: $SERVER_USER@$SERVER_IP"
echo "Domain: $DOMAIN"
echo "SSH Key: $SSH_KEY"
echo ""

read -p "Press Enter to continue or Ctrl+C to cancel..."
echo ""

# Step 1: Verify prerequisites
log "Step 1/7: Verifying prerequisites..."

if [ ! -f "$SSH_KEY" ]; then
    error "SSH key not found: $SSH_KEY"
    exit 1
fi

chmod 600 "$SSH_KEY" 2>/dev/null || true
success "SSH key found and permissions set"

if ! command -v node >/dev/null 2>&1; then
    error "Node.js is not installed locally"
    exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
    error "npm is not installed locally"
    exit 1
fi

success "Prerequisites verified"
echo ""

# Step 2: Test server connectivity
log "Step 2/7: Testing server connectivity..."

if ping -c 1 -W 2 "$SERVER_IP" >/dev/null 2>&1; then
    success "Server is reachable"
else
    warning "Cannot ping server (this may be normal if ICMP is blocked)"
fi

# Add SSH key to known_hosts
ssh-keyscan -H "$SERVER_IP" >> ~/.ssh/known_hosts 2>/dev/null || true

if ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no -o ConnectTimeout=10 "$SERVER_USER@$SERVER_IP" "echo 'SSH connection successful'" >/dev/null 2>&1; then
    success "SSH connection established"
else
    error "Cannot connect via SSH"
    echo "Please check:"
    echo "  - SSH key has correct permissions (chmod 600 $SSH_KEY)"
    echo "  - Server allows SSH connections on port 22"
    echo "  - SSH key is authorized on the server"
    exit 1
fi
echo ""

# Step 3: Build application locally
log "Step 3/7: Building application locally..."

if npm ci; then
    success "Dependencies installed"
else
    error "Failed to install dependencies"
    exit 1
fi

if npm run build; then
    success "Application built successfully"
else
    error "Build failed"
    exit 1
fi
echo ""

# Step 4: Upload server setup files
log "Step 4/7: Uploading server setup files..."

# Create temporary directory with all needed files
TEMP_DIR=$(mktemp -d)
cp server-setup.sh "$TEMP_DIR/"
cp nginx.conf "$TEMP_DIR/"
cp -r scripts "$TEMP_DIR/" 2>/dev/null || true

# Upload setup files
if scp -i "$SSH_KEY" -r "$TEMP_DIR"/* "$SERVER_USER@$SERVER_IP:/tmp/" >/dev/null 2>&1; then
    success "Setup files uploaded"
else
    error "Failed to upload setup files"
    rm -rf "$TEMP_DIR"
    exit 1
fi

rm -rf "$TEMP_DIR"
echo ""

# Step 5: Run server setup
log "Step 5/7: Running server setup (this may take 5-10 minutes)..."

ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" << 'ENDSSH'
    set -e
    cd /tmp
    
    # Make scripts executable
    chmod +x server-setup.sh
    chmod +x scripts/*.sh 2>/dev/null || true
    
    # Run server setup
    if ./server-setup.sh; then
        echo "Server setup completed"
    else
        echo "Server setup failed"
        exit 1
    fi
ENDSSH

if [ $? -eq 0 ]; then
    success "Server setup completed"
else
    error "Server setup failed"
    exit 1
fi
echo ""

# Step 6: Deploy application
log "Step 6/7: Deploying application..."

# Create deployment archive
tar -czf deploy.tar.gz \
    .next \
    public \
    package.json \
    package-lock.json \
    next.config.js \
    ecosystem.config.js \
    .env.local \
    .env.production \
    2>/dev/null || true

success "Deployment archive created"

# Upload deployment archive
if scp -i "$SSH_KEY" deploy.tar.gz "$SERVER_USER@$SERVER_IP:/var/www/valt-omniagent/" >/dev/null 2>&1; then
    success "Application uploaded"
else
    error "Failed to upload application"
    rm -f deploy.tar.gz
    exit 1
fi

# Deploy on server
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" << 'ENDSSH'
    set -e
    cd /var/www/valt-omniagent
    
    echo "Extracting application..."
    tar -xzf deploy.tar.gz
    
    echo "Installing dependencies..."
    npm ci --production --silent
    
    echo "Starting application with PM2..."
    pm2 start ecosystem.config.js
    pm2 save
    
    # Clean up
    rm -f deploy.tar.gz
    
    echo "Application deployed"
ENDSSH

if [ $? -eq 0 ]; then
    success "Application deployed"
else
    error "Deployment failed"
    rm -f deploy.tar.gz
    exit 1
fi

rm -f deploy.tar.gz
echo ""

# Step 7: Setup CI/CD infrastructure
log "Step 7/7: Setting up CI/CD infrastructure..."

ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" << 'ENDSSH'
    set -e
    
    if [ -f "/tmp/scripts/setup-cicd.sh" ]; then
        cp /tmp/scripts/*.sh /root/scripts/ 2>/dev/null || mkdir -p /root/scripts && cp /tmp/scripts/*.sh /root/scripts/
        chmod +x /root/scripts/*.sh
        
        cd /root/scripts
        ./setup-cicd.sh
        
        echo "CI/CD infrastructure configured"
    else
        echo "CI/CD setup script not found, skipping..."
    fi
ENDSSH

if [ $? -eq 0 ]; then
    success "CI/CD infrastructure configured"
else
    warning "CI/CD setup had issues (non-fatal)"
fi
echo ""

# Health check
log "Running health check..."
sleep 10

# Check PM2 status
if ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "pm2 list | grep -q 'valt-omniagent.*online'"; then
    success "PM2 process is running"
else
    error "PM2 process is not running"
    exit 1
fi

# Check local response
RESPONSE=$(ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "curl -s -o /dev/null -w '%{http_code}' http://localhost:3000" 2>/dev/null || echo "000")

if [ "$RESPONSE" == "200" ] || [ "$RESPONSE" == "301" ] || [ "$RESPONSE" == "302" ]; then
    success "Application is responding (HTTP $RESPONSE)"
else
    error "Application is not responding (HTTP $RESPONSE)"
    echo "Check logs with: ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 logs valt-omniagent'"
    exit 1
fi

# Summary
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║              Deployment Successful! 🎉                    ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Important Next Steps:${NC}"
echo ""
echo "1. ${GREEN}Configure DNS:${NC}"
echo "   - Point A record for omni.valtara.ai to $SERVER_IP"
echo "   - Point A record for www.omni.valtara.ai to $SERVER_IP"
echo ""
echo "2. ${GREEN}Verify SSL Certificate:${NC}"
echo "   - Wait for DNS propagation (5-15 minutes)"
echo "   - SSH to server and run: certbot certificates"
echo ""
echo "3. ${GREEN}Set up GitHub Actions (Optional):${NC}"
echo "   - Add SSH_PRIVATE_KEY secret to GitHub repository"
echo "   - Add SERVER_IP secret: $SERVER_IP"
echo "   - Push .github/workflows/deploy.yml to enable CI/CD"
echo ""
echo "4. ${GREEN}Configure Monitoring (Optional):${NC}"
echo "   - Set WEBHOOK_URL environment variable for alerts"
echo "   - Set ALERT_EMAIL for email notifications"
echo ""
echo -e "${YELLOW}Quick Commands:${NC}"
echo ""
echo "  View logs:    ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 logs valt-omniagent'"
echo "  Check status: ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 status'"
echo "  Restart app:  ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 restart valt-omniagent'"
echo "  Run backup:   ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP '/root/scripts/backup.sh full'"
echo ""
echo -e "${YELLOW}Access Points:${NC}"
echo ""
echo "  Application: http://$SERVER_IP (working now)"
echo "  Domain:      https://$DOMAIN (after DNS + SSL setup)"
echo ""
echo -e "${YELLOW}Documentation:${NC}"
echo ""
echo "  Deployment:  DEPLOYMENT.md"
echo "  CI/CD:       CICD-DOCUMENTATION.md"
echo "  Operations:  SSH to server and view /root/OPERATIONS-README.md"
echo ""
echo -e "${GREEN}Deployment completed at: $(date)${NC}"
echo ""

exit 0
