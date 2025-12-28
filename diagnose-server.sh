#!/bin/bash
# ==============================================================================
# VALT OMNIAGENT - QUICK DIAGNOSTIC SCRIPT
# ==============================================================================
# Run this FIRST to diagnose the 502/504 issues before deploying fixes
# ==============================================================================

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  VALT OMNIAGENT - SERVER DIAGNOSTIC"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Date: $(date)"
echo "Hostname: $(hostname)"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

check() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}[OK]${NC} $2"
    else
        echo -e "${RED}[FAIL]${NC} $2"
    fi
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# System Info
echo "─────────────────────────────────────────────────────────────"
echo "SYSTEM INFO"
echo "─────────────────────────────────────────────────────────────"
echo "OS: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)"
echo "Kernel: $(uname -r)"
echo "Uptime: $(uptime -p)"
echo "Memory: $(free -h | awk '/^Mem:/ {print $3 "/" $2}')"
echo "Disk: $(df -h / | awk 'NR==2 {print $3 "/" $2 " (" $5 " used)"}')"
echo ""

# Check Services
echo "─────────────────────────────────────────────────────────────"
echo "SERVICE STATUS"
echo "─────────────────────────────────────────────────────────────"

# Nginx
echo -n "Nginx: "
if systemctl is-active --quiet nginx 2>/dev/null; then
    echo -e "${GREEN}Running${NC}"
else
    echo -e "${RED}Stopped${NC}"
fi

# Node.js
echo -n "Node.js: "
if command -v node &> /dev/null; then
    echo -e "${GREEN}$(node -v)${NC}"
else
    echo -e "${RED}Not installed${NC}"
fi

# PM2
echo -n "PM2: "
if command -v pm2 &> /dev/null; then
    echo -e "${GREEN}$(pm2 -v)${NC}"
else
    echo -e "${RED}Not installed${NC}"
fi

# PM2 App Status
echo -n "PM2 App (valt-omniagent): "
if pm2 list 2>/dev/null | grep -q "valt-omniagent.*online"; then
    echo -e "${GREEN}Online${NC}"
elif pm2 list 2>/dev/null | grep -q "valt-omniagent"; then
    echo -e "${YELLOW}$(pm2 list 2>/dev/null | grep valt-omniagent | awk '{print $10}')${NC}"
else
    echo -e "${RED}Not running${NC}"
fi

# Fail2ban
echo -n "Fail2ban: "
if systemctl is-active --quiet fail2ban 2>/dev/null; then
    echo -e "${GREEN}Running${NC}"
else
    echo -e "${YELLOW}Not running${NC}"
fi

# UFW
echo -n "Firewall (UFW): "
if ufw status 2>/dev/null | grep -q "active"; then
    echo -e "${GREEN}Active${NC}"
else
    echo -e "${YELLOW}Inactive${NC}"
fi

echo ""

# Port Check
echo "─────────────────────────────────────────────────────────────"
echo "PORT STATUS"
echo "─────────────────────────────────────────────────────────────"

check_port() {
    if netstat -tlnp 2>/dev/null | grep -q ":$1 " || ss -tlnp 2>/dev/null | grep -q ":$1 "; then
        echo -e "Port $1: ${GREEN}LISTENING${NC} ($(netstat -tlnp 2>/dev/null | grep ":$1 " | awk '{print $7}' | head -1 || ss -tlnp 2>/dev/null | grep ":$1 " | awk -F'"' '{print $2}' | head -1))"
    else
        echo -e "Port $1: ${RED}NOT LISTENING${NC}"
    fi
}

check_port 22
check_port 80
check_port 443
check_port 3000

echo ""

# Application Directory
echo "─────────────────────────────────────────────────────────────"
echo "APPLICATION DIRECTORY"
echo "─────────────────────────────────────────────────────────────"
APP_DIR="/var/www/valt-omniagent"

if [ -d "$APP_DIR" ]; then
    echo -e "Directory: ${GREEN}Exists${NC}"
    echo "Contents:"
    ls -la $APP_DIR 2>/dev/null | head -15
    
    echo ""
    echo -n ".next directory: "
    if [ -d "$APP_DIR/.next" ]; then
        echo -e "${GREEN}Exists${NC}"
    else
        echo -e "${RED}Missing - needs build${NC}"
    fi
    
    echo -n "package.json: "
    if [ -f "$APP_DIR/package.json" ]; then
        echo -e "${GREEN}Exists${NC}"
    else
        echo -e "${RED}Missing${NC}"
    fi
    
    echo -n "node_modules: "
    if [ -d "$APP_DIR/node_modules" ]; then
        echo -e "${GREEN}Exists${NC}"
    else
        echo -e "${YELLOW}Missing - needs npm install${NC}"
    fi
else
    echo -e "Directory: ${RED}Does not exist${NC}"
fi

echo ""

# HTTP Response Check
echo "─────────────────────────────────────────────────────────────"
echo "HTTP RESPONSE CHECK"
echo "─────────────────────────────────────────────────────────────"

echo -n "localhost:3000: "
RESP=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://localhost:3000 2>/dev/null || echo "000")
if [ "$RESP" = "200" ] || [ "$RESP" = "301" ] || [ "$RESP" = "302" ]; then
    echo -e "${GREEN}HTTP $RESP${NC}"
else
    echo -e "${RED}HTTP $RESP${NC}"
fi

echo -n "localhost:80: "
RESP=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://localhost 2>/dev/null || echo "000")
if [ "$RESP" = "200" ] || [ "$RESP" = "301" ] || [ "$RESP" = "302" ]; then
    echo -e "${GREEN}HTTP $RESP${NC}"
else
    echo -e "${RED}HTTP $RESP${NC}"
fi

echo -n "localhost:443 (HTTPS): "
RESP=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 -k https://localhost 2>/dev/null || echo "000")
if [ "$RESP" = "200" ] || [ "$RESP" = "301" ] || [ "$RESP" = "302" ]; then
    echo -e "${GREEN}HTTP $RESP${NC}"
else
    echo -e "${YELLOW}HTTP $RESP${NC}"
fi

echo ""

# SSL Certificate
echo "─────────────────────────────────────────────────────────────"
echo "SSL CERTIFICATE"
echo "─────────────────────────────────────────────────────────────"

CERT_PATH="/etc/letsencrypt/live/omni.valtara.ai/fullchain.pem"
if [ -f "$CERT_PATH" ]; then
    echo -e "Certificate: ${GREEN}Exists${NC}"
    EXPIRY=$(openssl x509 -enddate -noout -in $CERT_PATH 2>/dev/null | cut -d= -f2)
    echo "Expires: $EXPIRY"
    
    # Check if expired
    EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s 2>/dev/null || echo "0")
    NOW_EPOCH=$(date +%s)
    DAYS_LEFT=$(( ($EXPIRY_EPOCH - $NOW_EPOCH) / 86400 ))
    
    if [ $DAYS_LEFT -lt 0 ]; then
        echo -e "${RED}CERTIFICATE EXPIRED!${NC}"
    elif [ $DAYS_LEFT -lt 30 ]; then
        echo -e "${YELLOW}Expires in $DAYS_LEFT days - consider renewal${NC}"
    else
        echo -e "${GREEN}Valid for $DAYS_LEFT more days${NC}"
    fi
else
    echo -e "Certificate: ${RED}Not found${NC}"
fi

echo ""

# Recent Errors
echo "─────────────────────────────────────────────────────────────"
echo "RECENT NGINX ERRORS (last 20)"
echo "─────────────────────────────────────────────────────────────"

if [ -f "/var/log/nginx/error.log" ]; then
    tail -20 /var/log/nginx/error.log 2>/dev/null || echo "Cannot read error log"
elif [ -f "/var/log/nginx/omni.valtara.ai.error.log" ]; then
    tail -20 /var/log/nginx/omni.valtara.ai.error.log 2>/dev/null || echo "Cannot read error log"
else
    echo "No nginx error log found"
fi

echo ""

# PM2 Logs
echo "─────────────────────────────────────────────────────────────"
echo "RECENT PM2 LOGS (last 20)"
echo "─────────────────────────────────────────────────────────────"

if command -v pm2 &> /dev/null; then
    pm2 logs valt-omniagent --lines 20 --nostream 2>/dev/null || echo "No PM2 logs available"
else
    echo "PM2 not installed"
fi

echo ""

# Recommendations
echo "═══════════════════════════════════════════════════════════════"
echo "  RECOMMENDATIONS"
echo "═══════════════════════════════════════════════════════════════"
echo ""

if ! pm2 list 2>/dev/null | grep -q "valt-omniagent.*online"; then
    echo "• Application is NOT running - start with PM2"
fi

if ! netstat -tlnp 2>/dev/null | grep -q ":3000 " && ! ss -tlnp 2>/dev/null | grep -q ":3000 "; then
    echo "• Port 3000 not listening - application may have crashed"
fi

if [ ! -d "/var/www/valt-omniagent/.next" ]; then
    echo "• .next directory missing - need to build the application"
fi

if [ ! -d "/var/www/valt-omniagent/node_modules" ]; then
    echo "• node_modules missing - run 'npm install'"
fi

if [ ! -f "$CERT_PATH" ]; then
    echo "• SSL certificate missing - run certbot"
fi

echo ""
echo "Run FULL-FIX-DEPLOY.sh to fix all issues automatically"
echo ""
