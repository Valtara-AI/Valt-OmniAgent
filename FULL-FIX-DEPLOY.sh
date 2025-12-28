#!/bin/bash
# ==============================================================================
# VALT OMNIAGENT - COMPLETE FIX & SECURE DEPLOYMENT SCRIPT
# ==============================================================================
# This script fixes 502/504 errors and deploys a secured application
# Server: 91.99.79.131
# Domain: omni.valtara.ai
# ==============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log() { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
error() { echo -e "${RED}[✗]${NC} $1"; }
info() { echo -e "${CYAN}[i]${NC} $1"; }
header() {
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}\n"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    error "Please run as root: sudo ./FULL-FIX-DEPLOY.sh"
    exit 1
fi

header "VALT OMNIAGENT - COMPLETE FIX & SECURE DEPLOYMENT"
echo "Date: $(date)"
echo "Server: $(hostname)"
echo ""

# ==============================================================================
# STEP 1: DIAGNOSE CURRENT STATE
# ==============================================================================
header "STEP 1: DIAGNOSING CURRENT STATE"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    log "Node.js installed: $NODE_VERSION"
else
    warn "Node.js not found - will install"
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
    log "Node.js installed: $(node -v)"
fi

# Check npm
if command -v npm &> /dev/null; then
    log "npm installed: $(npm -v)"
else
    error "npm not found"
    exit 1
fi

# Check PM2
if command -v pm2 &> /dev/null; then
    log "PM2 installed: $(pm2 -v)"
else
    warn "PM2 not found - installing"
    npm install -g pm2
    log "PM2 installed"
fi

# Check Nginx
if command -v nginx &> /dev/null; then
    log "Nginx installed: $(nginx -v 2>&1)"
else
    warn "Nginx not found - installing"
    apt-get update
    apt-get install -y nginx
    log "Nginx installed"
fi

# ==============================================================================
# STEP 2: STOP ALL EXISTING SERVICES
# ==============================================================================
header "STEP 2: STOPPING EXISTING SERVICES"

# Stop PM2 app if running
pm2 stop valt-omniagent 2>/dev/null || true
pm2 delete valt-omniagent 2>/dev/null || true
log "Stopped any existing PM2 processes"

# ==============================================================================
# STEP 3: FIX APPLICATION DIRECTORY
# ==============================================================================
header "STEP 3: SETTING UP APPLICATION DIRECTORY"

APP_DIR="/var/www/valt-omniagent"

# Create directory if not exists
mkdir -p $APP_DIR
mkdir -p $APP_DIR/logs

# Check if .next build exists
if [ ! -d "$APP_DIR/.next" ]; then
    warn ".next build directory not found - checking for source files"
    
    if [ -f "$APP_DIR/package.json" ]; then
        info "package.json found, rebuilding application..."
        cd $APP_DIR
        npm ci --production=false
        npm run build
        log "Application built successfully"
    else
        error "No source files found in $APP_DIR"
        error "Please upload the application files first"
        echo ""
        echo "Run this on your LOCAL machine:"
        echo "  scp -r .next public package.json package-lock.json next.config.js ecosystem.config.js root@91.99.79.131:$APP_DIR/"
        exit 1
    fi
else
    log ".next build directory exists"
fi

# Install production dependencies
cd $APP_DIR
if [ -f "package.json" ]; then
    info "Installing production dependencies..."
    npm ci --production 2>/dev/null || npm install --production
    log "Dependencies installed"
fi

# Fix permissions
chown -R www-data:www-data $APP_DIR
chmod -R 755 $APP_DIR
log "Permissions fixed"

# ==============================================================================
# STEP 4: CREATE/UPDATE ECOSYSTEM CONFIG
# ==============================================================================
header "STEP 4: CONFIGURING PM2"

cat > $APP_DIR/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'valt-omniagent',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/valt-omniagent',
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOST: '0.0.0.0'
    },
    error_file: '/var/www/valt-omniagent/logs/err.log',
    out_file: '/var/www/valt-omniagent/logs/out.log',
    log_file: '/var/www/valt-omniagent/logs/combined.log',
    time: true,
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    // Auto-restart settings
    autorestart: true,
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s',
    // Health monitoring
    listen_timeout: 10000,
    kill_timeout: 5000
  }]
};
EOF
log "PM2 ecosystem config updated"

# ==============================================================================
# STEP 5: START APPLICATION WITH PM2
# ==============================================================================
header "STEP 5: STARTING APPLICATION"

cd $APP_DIR

# Start the application
pm2 start ecosystem.config.js
sleep 5

# Check if running
if pm2 list | grep -q "valt-omniagent.*online"; then
    log "Application started successfully!"
else
    error "Application failed to start"
    echo ""
    echo "Checking logs..."
    pm2 logs valt-omniagent --lines 50
    exit 1
fi

# Verify local response
info "Testing local application response..."
sleep 3
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")

if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "301" ] || [ "$RESPONSE" = "302" ]; then
    log "Application responding on port 3000 (HTTP $RESPONSE)"
else
    warn "Application returned HTTP $RESPONSE"
    echo "Checking PM2 logs..."
    pm2 logs valt-omniagent --lines 20 --nostream
fi

# Save PM2 config and set startup
pm2 save
pm2 startup systemd -u root --hp /root 2>/dev/null || true
log "PM2 startup configured"

# ==============================================================================
# STEP 6: CONFIGURE NGINX WITH SECURITY
# ==============================================================================
header "STEP 6: DEPLOYING SECURE NGINX CONFIGURATION"

# Backup existing config
if [ -f "/etc/nginx/sites-available/omni.valtara.ai" ]; then
    cp /etc/nginx/sites-available/omni.valtara.ai /etc/nginx/sites-available/omni.valtara.ai.backup.$(date +%Y%m%d_%H%M%S)
fi

# Create rate limiting config in nginx.conf if not present
if ! grep -q "limit_req_zone" /etc/nginx/nginx.conf; then
    info "Adding rate limiting zones to nginx.conf..."
    
    # Insert rate limiting zones after http {
    sed -i '/^http {/a \
    # Rate Limiting Zones for DDoS Protection\
    limit_req_zone $binary_remote_addr zone=req_limit:10m rate=10r/s;\
    limit_req_zone $binary_remote_addr zone=login_limit:10m rate=5r/s;\
    limit_req_zone $binary_remote_addr zone=strict_limit:10m rate=1r/s;\
    limit_req_zone $binary_remote_addr zone=static_limit:10m rate=50r/s;\
    limit_conn_zone $binary_remote_addr zone=conn_limit:10m;\
    limit_conn_zone $server_name zone=server_conn_limit:10m;\
    \
    # Bad Bot Detection\
    map $http_user_agent $bad_bot {\
        default 0;\
        ~*malicious 1;\
        ~*scanner 1;\
        ~*nikto 1;\
        ~*sqlmap 1;\
        ~*nmap 1;\
        ~*masscan 1;\
    }\
' /etc/nginx/nginx.conf
    log "Rate limiting zones added"
fi

# Create the secure site configuration
cat > /etc/nginx/sites-available/omni.valtara.ai << 'NGINXCONF'
# =============================================================================
# VALT OMNIAGENT - SECURE NGINX CONFIGURATION
# Domain: omni.valtara.ai
# =============================================================================

upstream valt_omniagent {
    server 127.0.0.1:3000 max_fails=3 fail_timeout=30s;
    keepalive 64;
    keepalive_requests 1000;
    keepalive_timeout 60s;
}

# HTTP -> HTTPS Redirect
server {
    listen 80;
    listen [::]:80;
    server_name omni.valtara.ai www.omni.valtara.ai;

    # Allow ACME challenge for SSL
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
        allow all;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name omni.valtara.ai www.omni.valtara.ai;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/omni.valtara.ai/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/omni.valtara.ai/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;
    
    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 1.1.1.1 8.8.8.8 valid=300s;
    resolver_timeout 5s;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()" always;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    server_tokens off;

    # DDoS Protection
    limit_req zone=req_limit burst=20 nodelay;
    limit_conn conn_limit 30;
    limit_req_status 429;
    limit_conn_status 429;

    # Request limits
    client_max_body_size 10M;
    client_body_timeout 30s;
    client_header_timeout 30s;
    keepalive_timeout 65s;
    send_timeout 30s;

    # Buffer limits
    client_body_buffer_size 16K;
    client_header_buffer_size 1k;
    large_client_header_buffers 4 16k;

    # Logging
    access_log /var/log/nginx/omni.valtara.ai.access.log;
    error_log /var/log/nginx/omni.valtara.ai.error.log warn;

    # Root
    root /var/www/valt-omniagent;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml application/xml+rss image/svg+xml;

    # Static files with long cache
    location /_next/static {
        alias /var/www/valt-omniagent/.next/static;
        expires 365d;
        access_log off;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /static {
        alias /var/www/valt-omniagent/public;
        expires 365d;
        access_log off;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg|eot|webp|avif)$ {
        expires 30d;
        access_log off;
        add_header Cache-Control "public, max-age=2592000";
    }

    # Auth endpoints - strict rate limiting
    location ~ ^/api/auth/(signin|signup|register|login|forgot-password|reset-password) {
        limit_req zone=strict_limit burst=3 nodelay;
        limit_conn conn_limit 5;

        proxy_pass http://valt_omniagent;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API endpoints - moderate rate limiting
    location /api {
        limit_req zone=login_limit burst=20 nodelay;

        proxy_pass http://valt_omniagent;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 10s;
    }

    # Health check - no rate limiting
    location /health {
        access_log off;
        proxy_pass http://valt_omniagent;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Block sensitive files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    location ~ \.(env|git|sql|bak|log|ini|conf)$ {
        deny all;
    }

    # Block WordPress probes
    location ~* (wp-admin|wp-login|wp-content|phpmyadmin) {
        return 444;
    }

    # Main proxy
    location / {
        proxy_pass http://valt_omniagent;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increased timeouts to prevent 504
        proxy_read_timeout 120s;
        proxy_connect_timeout 30s;
        proxy_send_timeout 60s;

        # Buffering
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 16k;
        proxy_busy_buffers_size 24k;
    }

    # Custom error pages
    error_page 429 @ratelimit;
    location @ratelimit {
        default_type text/html;
        return 429 '<html><head><title>Rate Limited</title></head><body><h1>Too Many Requests</h1><p>Please slow down and try again.</p></body></html>';
    }

    error_page 502 503 504 @maintenance;
    location @maintenance {
        default_type text/html;
        return 503 '<html><head><title>Maintenance</title></head><body><h1>Service Temporarily Unavailable</h1><p>We are performing maintenance. Please try again shortly.</p></body></html>';
    }
}
NGINXCONF

log "Nginx site configuration created"

# Enable the site
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true
ln -sf /etc/nginx/sites-available/omni.valtara.ai /etc/nginx/sites-enabled/

# Test nginx config
if nginx -t; then
    systemctl reload nginx
    log "Nginx configuration deployed successfully"
else
    error "Nginx configuration test failed!"
    nginx -t
    exit 1
fi

# ==============================================================================
# STEP 7: SSL CERTIFICATE CHECK/SETUP
# ==============================================================================
header "STEP 7: SSL CERTIFICATE CHECK"

if [ ! -f "/etc/letsencrypt/live/omni.valtara.ai/fullchain.pem" ]; then
    warn "SSL certificate not found - setting up Let's Encrypt..."
    
    # Install certbot if needed
    if ! command -v certbot &> /dev/null; then
        apt-get install -y certbot python3-certbot-nginx
    fi
    
    # Create certbot webroot
    mkdir -p /var/www/certbot
    
    # Get certificate
    certbot certonly --nginx -d omni.valtara.ai -d www.omni.valtara.ai --non-interactive --agree-tos --email admin@valtara.ai || {
        warn "Certbot failed - you may need to run manually:"
        echo "  certbot --nginx -d omni.valtara.ai"
    }
else
    log "SSL certificate exists"
    
    # Check expiry
    EXPIRY=$(openssl x509 -enddate -noout -in /etc/letsencrypt/live/omni.valtara.ai/fullchain.pem | cut -d= -f2)
    log "Certificate expires: $EXPIRY"
    
    # Setup auto-renewal
    if ! crontab -l 2>/dev/null | grep -q "certbot renew"; then
        (crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet --post-hook 'systemctl reload nginx'") | crontab -
        log "Certbot auto-renewal cron added"
    fi
fi

# ==============================================================================
# STEP 8: FIREWALL CONFIGURATION
# ==============================================================================
header "STEP 8: CONFIGURING FIREWALL"

# Install UFW if needed
if ! command -v ufw &> /dev/null; then
    apt-get install -y ufw
fi

# Configure UFW
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw limit ssh comment 'SSH - rate limited'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw logging on
ufw --force enable

log "Firewall configured"
ufw status

# ==============================================================================
# STEP 9: FAIL2BAN SETUP
# ==============================================================================
header "STEP 9: CONFIGURING FAIL2BAN"

# Install Fail2ban if needed
if ! command -v fail2ban-client &> /dev/null; then
    apt-get install -y fail2ban
fi

# Create jail configuration
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5
ignoreip = 127.0.0.1/8 ::1
banaction = iptables-multiport
backend = systemd

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 86400

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 3
bantime = 3600

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
findtime = 120
bantime = 7200
EOF

# Create nginx-limit-req filter
cat > /etc/fail2ban/filter.d/nginx-limit-req.conf << 'EOF'
[Definition]
failregex = limiting requests, excess:.* by zone.*client: <HOST>
ignoreregex =
EOF

# Enable and start fail2ban
systemctl enable fail2ban
systemctl restart fail2ban

log "Fail2ban configured"
fail2ban-client status

# ==============================================================================
# STEP 10: FINAL VERIFICATION
# ==============================================================================
header "STEP 10: FINAL VERIFICATION"

echo ""
info "Checking all services..."
echo ""

# Check PM2
echo -n "PM2 Application: "
if pm2 list | grep -q "valt-omniagent.*online"; then
    echo -e "${GREEN}ONLINE${NC}"
else
    echo -e "${RED}OFFLINE${NC}"
fi

# Check Nginx
echo -n "Nginx Service: "
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}RUNNING${NC}"
else
    echo -e "${RED}STOPPED${NC}"
fi

# Check local response
echo -n "Local Response (3000): "
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")
if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "301" ] || [ "$RESPONSE" = "302" ]; then
    echo -e "${GREEN}HTTP $RESPONSE${NC}"
else
    echo -e "${RED}HTTP $RESPONSE${NC}"
fi

# Check HTTPS
echo -n "HTTPS Response: "
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -k https://localhost 2>/dev/null || echo "000")
if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "301" ] || [ "$RESPONSE" = "302" ]; then
    echo -e "${GREEN}HTTP $RESPONSE${NC}"
else
    echo -e "${YELLOW}HTTP $RESPONSE${NC}"
fi

# Check external
echo -n "External URL: "
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://omni.valtara.ai 2>/dev/null || echo "000")
if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "301" ] || [ "$RESPONSE" = "302" ]; then
    echo -e "${GREEN}HTTP $RESPONSE${NC}"
else
    echo -e "${YELLOW}HTTP $RESPONSE (may take a moment to propagate)${NC}"
fi

# Check Fail2ban
echo -n "Fail2ban: "
if systemctl is-active --quiet fail2ban; then
    echo -e "${GREEN}RUNNING${NC}"
else
    echo -e "${RED}STOPPED${NC}"
fi

# Check UFW
echo -n "Firewall (UFW): "
if ufw status | grep -q "active"; then
    echo -e "${GREEN}ACTIVE${NC}"
else
    echo -e "${RED}INACTIVE${NC}"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo -e "${GREEN}  DEPLOYMENT COMPLETE${NC}"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "  Domain:     https://omni.valtara.ai"
echo "  Server:     91.99.79.131"
echo "  App Port:   3000"
echo ""
echo "  Useful Commands:"
echo "    pm2 logs valt-omniagent    - View application logs"
echo "    pm2 restart valt-omniagent - Restart application"
echo "    pm2 status                 - Check PM2 status"
echo "    nginx -t                   - Test nginx config"
echo "    fail2ban-client status     - Check banned IPs"
echo ""
echo "═══════════════════════════════════════════════════════════════"
