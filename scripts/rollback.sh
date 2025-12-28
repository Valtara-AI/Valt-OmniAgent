#!/bin/bash

###############################################################################
# Valt OmniAgent - Rollback Script
# 
# This script performs a quick rollback to the previous deployment
#
# Usage: ./rollback.sh [version]
###############################################################################

set -e

APP_DIR="/var/www/valt-omniagent"
BACKUP_DIR="$APP_DIR/backups"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}=========================================="
echo "Valt OmniAgent Rollback Utility"
echo -e "==========================================${NC}"

# List available versions
list_versions() {
    echo -e "\n${GREEN}Available versions to rollback to:${NC}\n"
    
    if [ ! -d "$BACKUP_DIR" ] || [ -z "$(ls -A $BACKUP_DIR/*.tar.gz 2>/dev/null)" ]; then
        echo "No previous versions found in $BACKUP_DIR"
        exit 1
    fi
    
    ls -lt "$BACKUP_DIR"/backup_*.tar.gz | nl | awk '{print $1 ". " $10 " (" $6, $7, $8 ")"}'
}

# Get version to rollback to
if [ -z "$1" ]; then
    list_versions
    echo ""
    read -p "Enter version number to rollback to (or 'latest' for most recent): " version_input
else
    version_input="$1"
fi

# Determine backup file
if [ "$version_input" == "latest" ] || [ "$version_input" == "1" ]; then
    BACKUP_FILE=$(ls -t "$BACKUP_DIR"/backup_*.tar.gz 2>/dev/null | head -1)
else
    BACKUP_FILE=$(ls -t "$BACKUP_DIR"/backup_*.tar.gz 2>/dev/null | sed -n "${version_input}p")
fi

if [ -z "$BACKUP_FILE" ] || [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}Error: Backup file not found${NC}"
    exit 1
fi

echo -e "\n${YELLOW}Rolling back to: $(basename $BACKUP_FILE)${NC}"

# Confirmation
read -p "Are you sure you want to rollback? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "Rollback cancelled."
    exit 0
fi

echo -e "\n${GREEN}Starting rollback process...${NC}\n"

# Backup current state before rollback
echo "Creating backup of current state..."
timestamp=$(date +%Y%m%d_%H%M%S)
cd "$APP_DIR"
tar -czf "$BACKUP_DIR/before-rollback_$timestamp.tar.gz" \
    .next package.json 2>/dev/null || true

# Stop PM2
echo "Stopping application..."
pm2 stop valt-omniagent || true

# Extract backup
echo "Restoring previous version..."
cd "$APP_DIR"
tar -xzf "$BACKUP_FILE"

# Install dependencies (in case package.json changed)
echo "Installing dependencies..."
npm ci --production

# Restart PM2
echo "Restarting application..."
pm2 restart valt-omniagent || pm2 start ecosystem.config.js
pm2 save

# Health check
echo "Performing health check..."
sleep 5

if pm2 list | grep -q "valt-omniagent.*online"; then
    echo -e "${GREEN}✓ Application is running${NC}"
else
    echo -e "${RED}✗ Application failed to start!${NC}"
    echo "Check logs with: pm2 logs valt-omniagent"
    exit 1
fi

if curl -f http://localhost:3000 >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Application is responding${NC}"
else
    echo -e "${RED}✗ Application is not responding!${NC}"
    exit 1
fi

echo -e "\n${GREEN}=========================================="
echo "Rollback completed successfully!"
echo -e "==========================================${NC}\n"

echo "Current version restored from: $(basename $BACKUP_FILE)"
echo "Previous state backed up as: before-rollback_$timestamp.tar.gz"
echo ""
echo "Next steps:"
echo "1. Verify application: https://omni.valtara.ai"
echo "2. Check logs: pm2 logs valt-omniagent"
echo "3. Monitor: pm2 monit"

exit 0
