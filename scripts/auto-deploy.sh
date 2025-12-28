#!/bin/bash

###############################################################################
# Valt OmniAgent - Automated Deployment Script with CI/CD
# 
# This is an enhanced deployment script with pre-deployment checks,
# automated testing, backup, and rollback capabilities
#
# Usage: ./auto-deploy.sh [--skip-tests] [--force]
###############################################################################

set -e

# Configuration
SERVER_IP="91.99.79.131"
SERVER_USER="root"
SSH_KEY="ubuntu-ky.pem"
APP_DIR="/var/www/valt-omniagent"
APP_NAME="valt-omniagent"
DEPLOY_ARCHIVE="deploy.tar.gz"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Flags
SKIP_TESTS=false
FORCE_DEPLOY=false

# Parse arguments
for arg in "$@"; do
    case $arg in
        --skip-tests)
            SKIP_TESTS=true
            ;;
        --force)
            FORCE_DEPLOY=true
            ;;
    esac
done

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

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    if [ ! -f "$SSH_KEY" ]; then
        error "SSH key not found: $SSH_KEY"
        exit 1
    fi
    
    if ! command -v node >/dev/null 2>&1; then
        error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm >/dev/null 2>&1; then
        error "npm is not installed"
        exit 1
    fi
    
    success "Prerequisites check passed"
}

# Test SSH connection
test_ssh() {
    log "Testing SSH connection..."
    
    if ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no -o ConnectTimeout=10 "$SERVER_USER@$SERVER_IP" "echo 'Connected'" >/dev/null 2>&1; then
        success "SSH connection successful"
        return 0
    else
        error "Cannot connect to server"
        return 1
    fi
}

# Run local tests
run_tests() {
    if [ "$SKIP_TESTS" = true ]; then
        warning "Skipping tests (--skip-tests flag used)"
        return 0
    fi
    
    log "Running tests..."
    
    # TypeScript check
    log "Running TypeScript check..."
    if npx tsc --noEmit; then
        success "TypeScript check passed"
    else
        error "TypeScript check failed"
        return 1
    fi
    
    # Linting
    log "Running linter..."
    npm run lint || warning "Linting completed with warnings"
    
    # Build test
    log "Running build test..."
    if npm run build; then
        success "Build test passed"
    else
        error "Build failed"
        return 1
    fi
    
    success "All tests passed"
}

# Create deployment archive
create_archive() {
    log "Creating deployment archive..."
    
    # Ensure .env.production exists
    if [ ! -f ".env.local" ]; then
        warning ".env.local not found, deployment may fail"
    fi
    
    tar -czf "$DEPLOY_ARCHIVE" \
        .next \
        public \
        package.json \
        package-lock.json \
        next.config.js \
        ecosystem.config.js \
        .env.local \
        .env.production \
        scripts \
        2>/dev/null || true
    
    if [ -f "$DEPLOY_ARCHIVE" ]; then
        local size=$(du -h "$DEPLOY_ARCHIVE" | cut -f1)
        success "Archive created: $DEPLOY_ARCHIVE ($size)"
    else
        error "Failed to create archive"
        return 1
    fi
}

# Upload to server
upload_archive() {
    log "Uploading to server..."
    
    if scp -i "$SSH_KEY" -o StrictHostKeyChecking=no "$DEPLOY_ARCHIVE" "$SERVER_USER@$SERVER_IP:$APP_DIR/"; then
        success "Upload completed"
    else
        error "Upload failed"
        return 1
    fi
}

# Deploy on server
deploy_on_server() {
    log "Deploying on server..."
    
    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" << 'ENDSSH'
        set -e
        
        APP_DIR="/var/www/valt-omniagent"
        APP_NAME="valt-omniagent"
        
        cd "$APP_DIR"
        
        echo "Creating backup before deployment..."
        timestamp=$(date +%Y%m%d_%H%M%S)
        mkdir -p backups
        
        if [ -d ".next" ]; then
            tar -czf "backups/backup_$timestamp.tar.gz" .next package.json 2>/dev/null || true
            
            # Keep only last 10 backups
            cd backups
            ls -t backup_*.tar.gz 2>/dev/null | tail -n +11 | xargs -r rm -f
            cd ..
            
            echo "✓ Backup created: backup_$timestamp.tar.gz"
        fi
        
        echo "Extracting new version..."
        tar -xzf deploy.tar.gz
        
        echo "Installing dependencies..."
        npm ci --production --silent
        
        echo "Restarting application..."
        pm2 restart "$APP_NAME" || pm2 start ecosystem.config.js
        pm2 save
        
        # Clean up
        rm -f deploy.tar.gz
        
        echo "✓ Deployment completed"
ENDSSH
    
    if [ $? -eq 0 ]; then
        success "Deployment successful"
    else
        error "Deployment failed"
        return 1
    fi
}

# Health check
health_check() {
    log "Running health check..."
    
    sleep 10  # Wait for application to start
    
    # Check PM2 status
    if ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "pm2 list | grep -q '$APP_NAME.*online'"; then
        success "PM2 process is running"
    else
        error "PM2 process is not running"
        return 1
    fi
    
    # Check HTTP response
    local response_code=$(ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "curl -s -o /dev/null -w '%{http_code}' http://localhost:3000" 2>/dev/null)
    
    if [ "$response_code" == "200" ] || [ "$response_code" == "301" ] || [ "$response_code" == "302" ]; then
        success "Application is responding (HTTP $response_code)"
    else
        error "Application is not responding (HTTP $response_code)"
        return 1
    fi
    
    success "Health check passed"
}

# Rollback on failure
rollback() {
    error "Deployment failed! Initiating rollback..."
    
    ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" << 'ENDSSH'
        cd /var/www/valt-omniagent
        
        # Get latest backup
        LATEST_BACKUP=$(ls -t backups/backup_*.tar.gz 2>/dev/null | head -1)
        
        if [ -n "$LATEST_BACKUP" ]; then
            echo "Rolling back to: $LATEST_BACKUP"
            tar -xzf "$LATEST_BACKUP"
            pm2 restart valt-omniagent
            echo "✓ Rollback completed"
        else
            echo "✗ No backup found for rollback!"
            exit 1
        fi
ENDSSH
    
    if [ $? -eq 0 ]; then
        warning "Rolled back to previous version"
    else
        error "Rollback failed! Manual intervention required!"
        exit 1
    fi
}

# Cleanup
cleanup() {
    log "Cleaning up..."
    rm -f "$DEPLOY_ARCHIVE"
    success "Cleanup completed"
}

# Main deployment flow
main() {
    echo -e "${GREEN}╔════════════════════════════════════════╗"
    echo -e "║   Valt OmniAgent Deployment Script    ║"
    echo -e "╚════════════════════════════════════════╝${NC}\n"
    
    echo "Target: $SERVER_USER@$SERVER_IP"
    echo "Application: $APP_NAME"
    echo ""
    
    if [ "$FORCE_DEPLOY" = false ]; then
        read -p "Continue with deployment? (yes/no): " confirm
        if [ "$confirm" != "yes" ]; then
            echo "Deployment cancelled."
            exit 0
        fi
    fi
    
    echo ""
    
    # Pre-deployment checks
    check_prerequisites || exit 1
    test_ssh || exit 1
    
    # Run tests
    if ! run_tests; then
        error "Tests failed!"
        if [ "$FORCE_DEPLOY" = false ]; then
            read -p "Deploy anyway? (yes/no): " force_confirm
            if [ "$force_confirm" != "yes" ]; then
                exit 1
            fi
        fi
    fi
    
    # Build and deploy
    create_archive || exit 1
    upload_archive || exit 1
    
    # Deploy with automatic rollback on failure
    if ! deploy_on_server; then
        rollback
        cleanup
        exit 1
    fi
    
    # Verify deployment
    if ! health_check; then
        error "Health check failed after deployment!"
        rollback
        cleanup
        exit 1
    fi
    
    # Success!
    cleanup
    
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════╗"
    echo -e "║     Deployment Successful! 🎉          ║"
    echo -e "╚════════════════════════════════════════╝${NC}\n"
    
    echo "Application: https://omni.valtara.ai"
    echo "Monitor logs: ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 logs $APP_NAME'"
    echo "Check status: ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 status'"
    echo ""
}

# Run main function
main "$@"
