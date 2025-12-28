#!/bin/bash

###############################################################################
# Valt OmniAgent - Restore Script
# 
# This script restores backups created by backup.sh
#
# Usage: ./restore.sh <backup_file> [component]
#        ./restore.sh list  # List available backups
###############################################################################

set -e

BACKUP_DIR="/var/backups/valt-omniagent"
APP_DIR="/var/www/valt-omniagent"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=========================================="
echo "Valt OmniAgent Restore Utility"
echo -e "==========================================${NC}"

# Function to list available backups
list_backups() {
    echo -e "\n${YELLOW}Available backups:${NC}\n"
    
    if [ ! -d "$BACKUP_DIR" ] || [ -z "$(ls -A $BACKUP_DIR/*.tar.gz 2>/dev/null)" ]; then
        echo "No backups found in $BACKUP_DIR"
        exit 1
    fi
    
    ls -lht "$BACKUP_DIR"/*.tar.gz | awk '{print $9, "(" $5 ")", $6, $7, $8}'
    
    echo -e "\n${YELLOW}Usage examples:${NC}"
    echo "  ./restore.sh valt-omniagent_full_20241012_120000.tar.gz"
    echo "  ./restore.sh valt-omniagent_application_20241012_120000.tar.gz"
    echo "  ./restore.sh latest  # Restore most recent full backup"
}

# Function to verify backup before restore
verify_backup() {
    local backup_file=$1
    
    echo "Verifying backup integrity..."
    
    if [ ! -f "$backup_file" ]; then
        echo -e "${RED}Error: Backup file not found: $backup_file${NC}"
        exit 1
    fi
    
    # Check if tar file is valid
    if ! tar -tzf "$backup_file" >/dev/null 2>&1; then
        echo -e "${RED}Error: Backup file is corrupted!${NC}"
        exit 1
    fi
    
    # Verify checksum if available
    if [ -f "$backup_file.sha256" ]; then
        echo "Verifying checksum..."
        if (cd "$(dirname $backup_file)" && sha256sum -c "$(basename $backup_file).sha256" >/dev/null 2>&1); then
            echo -e "${GREEN}✓ Checksum verified${NC}"
        else
            echo -e "${RED}✗ Checksum verification failed!${NC}"
            read -p "Continue anyway? (yes/no): " confirm
            if [ "$confirm" != "yes" ]; then
                exit 1
            fi
        fi
    fi
    
    echo -e "${GREEN}✓ Backup file is valid${NC}"
}

# Function to create pre-restore backup
create_pre_restore_backup() {
    echo "Creating pre-restore backup..."
    timestamp=$(date +%Y%m%d_%H%M%S)
    
    cd "$APP_DIR"
    tar -czf "$BACKUP_DIR/pre-restore_$timestamp.tar.gz" \
        --exclude='node_modules' \
        --exclude='.git' \
        . 2>/dev/null || true
    
    echo -e "${GREEN}✓ Pre-restore backup created: pre-restore_$timestamp.tar.gz${NC}"
}

# Function to stop services
stop_services() {
    echo "Stopping services..."
    pm2 stop valt-omniagent || true
    echo -e "${GREEN}✓ Services stopped${NC}"
}

# Function to start services
start_services() {
    echo "Starting services..."
    cd "$APP_DIR"
    npm ci --production
    pm2 restart valt-omniagent || pm2 start ecosystem.config.js
    pm2 save
    echo -e "${GREEN}✓ Services started${NC}"
}

# Function to restore backup
restore_backup() {
    local backup_file=$1
    local backup_name=$(basename "$backup_file")
    
    echo -e "\n${YELLOW}Restoring backup: $backup_name${NC}\n"
    
    # Determine backup type from filename
    if [[ $backup_name == *"application"* ]]; then
        echo "Restoring application files..."
        cd "$APP_DIR"
        tar -xzf "$backup_file"
        
    elif [[ $backup_name == *"config"* ]]; then
        echo "Restoring configuration files..."
        cd /
        tar -xzf "$backup_file"
        
    elif [[ $backup_name == *"ssl"* ]]; then
        echo "Restoring SSL certificates..."
        cd /
        tar -xzf "$backup_file"
        systemctl reload nginx
        
    elif [[ $backup_name == *"pm2"* ]]; then
        echo "Restoring PM2 configuration..."
        cd /
        tar -xzf "$backup_file"
        
    elif [[ $backup_name == *"full"* ]]; then
        echo "Restoring full backup..."
        cd "$APP_DIR"
        tar -xzf "$backup_file"
        
    else
        echo -e "${YELLOW}Warning: Unknown backup type, attempting full restore...${NC}"
        cd "$APP_DIR"
        tar -xzf "$backup_file"
    fi
    
    echo -e "${GREEN}✓ Restore completed${NC}"
}

# Function to perform health check
health_check() {
    echo "Performing health check..."
    sleep 5
    
    # Check if PM2 process is running
    if pm2 list | grep -q "valt-omniagent.*online"; then
        echo -e "${GREEN}✓ PM2 process is running${NC}"
    else
        echo -e "${RED}✗ PM2 process is not running!${NC}"
        return 1
    fi
    
    # Check if application responds
    if curl -f http://localhost:3000 >/dev/null 2>&1; then
        echo -e "${GREEN}✓ Application is responding${NC}"
    else
        echo -e "${RED}✗ Application is not responding!${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✓ Health check passed${NC}"
}

# Main script

if [ "$1" == "list" ] || [ -z "$1" ]; then
    list_backups
    exit 0
fi

# Get backup file path
if [ "$1" == "latest" ]; then
    BACKUP_FILE=$(ls -t "$BACKUP_DIR"/*full*.tar.gz 2>/dev/null | head -1)
    if [ -z "$BACKUP_FILE" ]; then
        echo -e "${RED}Error: No full backups found${NC}"
        exit 1
    fi
    echo "Using latest backup: $(basename $BACKUP_FILE)"
else
    if [[ "$1" == /* ]]; then
        BACKUP_FILE="$1"
    else
        BACKUP_FILE="$BACKUP_DIR/$1"
    fi
fi

# Verify backup
verify_backup "$BACKUP_FILE"

# Warning and confirmation
echo -e "\n${RED}WARNING: This will restore the backup and may overwrite current data!${NC}"
echo "Backup file: $BACKUP_FILE"
echo -e "\nCurrent application will be backed up before restore."
read -p "Do you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Restore cancelled."
    exit 0
fi

# Perform restore
echo -e "\n${GREEN}Starting restore process...${NC}\n"

create_pre_restore_backup
stop_services
restore_backup "$BACKUP_FILE"
start_services
health_check

echo -e "\n${GREEN}=========================================="
echo "Restore completed successfully!"
echo -e "==========================================${NC}\n"

echo "Next steps:"
echo "1. Test the application: https://omni.valtara.ai"
echo "2. Check logs: pm2 logs valt-omniagent"
echo "3. Monitor: pm2 monit"

exit 0
