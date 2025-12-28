#!/bin/bash

###############################################################################
# Valt OmniAgent - Automated Backup Script
# 
# This script creates comprehensive backups of:
# - Application code and builds
# - Configuration files
# - Environment variables
# - PM2 configurations
# - Nginx configurations
# - SSL certificates
# - Logs
#
# Usage: ./backup.sh [full|quick]
###############################################################################

set -e

# Configuration
BACKUP_DIR="/var/backups/valt-omniagent"
APP_DIR="/var/www/valt-omniagent"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30
S3_BUCKET="${S3_BACKUP_BUCKET:-}"  # Optional: set for S3 backups

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Logging
LOG_FILE="$BACKUP_DIR/backup_$TIMESTAMP.log"
exec 1> >(tee -a "$LOG_FILE")
exec 2>&1

echo "=========================================="
echo "Valt OmniAgent Backup"
echo "Started at: $(date)"
echo "=========================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to create backup
create_backup() {
    local backup_type=$1
    local backup_name="valt-omniagent_${backup_type}_${TIMESTAMP}.tar.gz"
    local backup_path="$BACKUP_DIR/$backup_name"
    
    echo "Creating $backup_type backup: $backup_name"
    
    case $backup_type in
        "application")
            cd "$APP_DIR"
            tar -czf "$backup_path" \
                --exclude='node_modules' \
                --exclude='*.log' \
                --exclude='.git' \
                .next \
                public \
                package.json \
                package-lock.json \
                next.config.js \
                ecosystem.config.js \
                2>/dev/null || true
            ;;
            
        "config")
            tar -czf "$backup_path" \
                /etc/nginx/sites-available/omni.valtara.ai \
                /etc/nginx/nginx.conf \
                "$APP_DIR"/.env.local \
                "$APP_DIR"/.env.production \
                2>/dev/null || true
            ;;
            
        "ssl")
            if [ -d "/etc/letsencrypt" ]; then
                tar -czf "$backup_path" \
                    /etc/letsencrypt \
                    2>/dev/null || true
            else
                echo "No SSL certificates found, skipping..."
                return 0
            fi
            ;;
            
        "logs")
            tar -czf "$backup_path" \
                "$APP_DIR"/logs \
                /var/log/nginx/access.log \
                /var/log/nginx/error.log \
                2>/dev/null || true
            ;;
            
        "pm2")
            tar -czf "$backup_path" \
                ~/.pm2 \
                2>/dev/null || true
            ;;
            
        "full")
            cd "$APP_DIR"
            tar -czf "$backup_path" \
                --exclude='node_modules' \
                --exclude='.git' \
                . \
                /etc/nginx/sites-available/omni.valtara.ai \
                /etc/letsencrypt \
                2>/dev/null || true
            ;;
    esac
    
    if [ -f "$backup_path" ]; then
        local size=$(du -h "$backup_path" | cut -f1)
        echo "✓ Backup created: $backup_name (Size: $size)"
        
        # Generate checksum
        cd "$BACKUP_DIR"
        sha256sum "$backup_name" > "$backup_name.sha256"
        echo "✓ Checksum created: $backup_name.sha256"
    else
        echo "✗ Failed to create backup: $backup_name"
        return 1
    fi
}

# Function to upload to S3 (if configured)
upload_to_s3() {
    if [ -n "$S3_BUCKET" ] && command_exists aws; then
        echo "Uploading backups to S3: $S3_BUCKET"
        aws s3 sync "$BACKUP_DIR" "s3://$S3_BUCKET/valt-omniagent/" \
            --exclude "*" \
            --include "*_${TIMESTAMP}.tar.gz*" \
            --storage-class STANDARD_IA
        echo "✓ Uploaded to S3"
    fi
}

# Function to cleanup old backups
cleanup_old_backups() {
    echo "Cleaning up backups older than $RETENTION_DAYS days..."
    find "$BACKUP_DIR" -name "*.tar.gz" -type f -mtime +$RETENTION_DAYS -delete
    find "$BACKUP_DIR" -name "*.sha256" -type f -mtime +$RETENTION_DAYS -delete
    find "$BACKUP_DIR" -name "*.log" -type f -mtime +$RETENTION_DAYS -delete
    echo "✓ Cleanup completed"
}

# Function to verify backup integrity
verify_backup() {
    local backup_file=$1
    if [ -f "$backup_file" ]; then
        echo "Verifying backup integrity: $(basename $backup_file)"
        if tar -tzf "$backup_file" >/dev/null 2>&1; then
            echo "✓ Backup is valid"
            return 0
        else
            echo "✗ Backup is corrupted!"
            return 1
        fi
    fi
}

# Main backup process
BACKUP_TYPE="${1:-full}"

case $BACKUP_TYPE in
    "full")
        echo "Running FULL backup..."
        create_backup "application"
        create_backup "config"
        create_backup "ssl"
        create_backup "logs"
        create_backup "pm2"
        ;;
        
    "quick")
        echo "Running QUICK backup..."
        create_backup "application"
        create_backup "config"
        ;;
        
    "application"|"config"|"ssl"|"logs"|"pm2")
        echo "Running $BACKUP_TYPE backup..."
        create_backup "$BACKUP_TYPE"
        ;;
        
    *)
        echo "Usage: $0 [full|quick|application|config|ssl|logs|pm2]"
        exit 1
        ;;
esac

# Upload to S3 if configured
upload_to_s3

# Cleanup old backups
cleanup_old_backups

# Summary
echo ""
echo "=========================================="
echo "Backup Summary"
echo "=========================================="
echo "Backup location: $BACKUP_DIR"
echo "Timestamp: $TIMESTAMP"
echo "Disk usage:"
du -sh "$BACKUP_DIR"
echo ""
echo "Recent backups:"
ls -lht "$BACKUP_DIR"/*.tar.gz 2>/dev/null | head -10 || echo "No backups found"
echo ""
echo "Backup completed at: $(date)"
echo "=========================================="

# Send notification (optional)
if command_exists curl && [ -n "${WEBHOOK_URL:-}" ]; then
    curl -X POST "$WEBHOOK_URL" \
        -H "Content-Type: application/json" \
        -d "{\"text\":\"✅ Backup completed successfully for Valt OmniAgent\",\"timestamp\":\"$TIMESTAMP\"}" \
        >/dev/null 2>&1 || true
fi

exit 0
