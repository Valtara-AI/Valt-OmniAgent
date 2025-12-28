#!/bin/bash

###############################################################################
# Valt OmniAgent - CI/CD Setup Script
# 
# This script sets up the complete CI/CD infrastructure on the server
# Including: scripts, cron jobs, monitoring, backups, and security
#
# Usage: Run this once on the server after initial setup
###############################################################################

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=========================================="
echo "Valt OmniAgent - CI/CD Infrastructure Setup"
echo -e "==========================================${NC}\n"

# Create necessary directories
echo "Creating directories..."
mkdir -p /root/scripts
mkdir -p /var/backups/valt-omniagent
mkdir -p /var/log
mkdir -p /var/www/valt-omniagent/backups
mkdir -p /var/www/valt-omniagent/logs

# Set proper permissions
chmod 700 /root/scripts
chmod 755 /var/backups/valt-omniagent
chmod 755 /var/www/valt-omniagent/backups

echo -e "${GREEN}✓${NC} Directories created\n"

# Copy scripts to /root/scripts
echo "Setting up scripts..."
if [ -d "/var/www/valt-omniagent/scripts" ]; then
    cp /var/www/valt-omniagent/scripts/*.sh /root/scripts/ 2>/dev/null || true
    chmod +x /root/scripts/*.sh
    echo -e "${GREEN}✓${NC} Scripts installed\n"
fi

# Setup log rotation
echo "Configuring log rotation..."
cat > /etc/logrotate.d/valt-omniagent << 'EOF'
/var/www/valt-omniagent/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    missingok
    create 0640 root root
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}

/var/log/valt-health-check.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    missingok
    create 0640 root root
}
EOF

echo -e "${GREEN}✓${NC} Log rotation configured\n"

# Setup cron jobs
echo "Setting up cron jobs..."

# Backup crontab if it exists
crontab -l > /tmp/crontab.backup 2>/dev/null || true

# Create new crontab
cat > /tmp/crontab.new << 'EOF'
# Valt OmniAgent - Automated Tasks

# Health check every 5 minutes
*/5 * * * * /root/scripts/health-check.sh >/dev/null 2>&1

# Full backup daily at 2 AM
0 2 * * * /root/scripts/backup.sh full >/dev/null 2>&1

# Quick backup every 6 hours
0 */6 * * * /root/scripts/backup.sh quick >/dev/null 2>&1

# SSL certificate renewal check (Let's Encrypt auto-renews)
0 3 * * 0 certbot renew --quiet --post-hook "systemctl reload nginx"

# Clean old logs and temporary files
0 4 * * * find /var/www/valt-omniagent/logs -name "*.log" -mtime +30 -delete
0 4 * * * find /tmp -name "valt-*" -mtime +7 -delete

# Restart PM2 weekly (Sunday at 3 AM) to clear memory leaks
0 3 * * 0 pm2 restart valt-omniagent

# Update system security patches monthly
0 5 1 * * apt-get update && apt-get upgrade -y --security-only

EOF

# Install new crontab
crontab /tmp/crontab.new
rm /tmp/crontab.new

echo -e "${GREEN}✓${NC} Cron jobs configured\n"

# Setup fail2ban for SSH protection
echo "Setting up fail2ban..."
if ! command -v fail2ban-client >/dev/null 2>&1; then
    apt-get update -qq
    apt-get install -y fail2ban >/dev/null 2>&1
fi

cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3
bantime = 7200

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
logpath = /var/log/nginx/error.log
maxretry = 3

[nginx-noscript]
enabled = true
filter = nginx-noscript
logpath = /var/log/nginx/access.log
maxretry = 6
EOF

systemctl enable fail2ban >/dev/null 2>&1
systemctl restart fail2ban

echo -e "${GREEN}✓${NC} fail2ban configured\n"

# Setup unattended-upgrades for security updates
echo "Setting up automatic security updates..."
if ! dpkg -l | grep -q unattended-upgrades; then
    apt-get install -y unattended-upgrades >/dev/null 2>&1
fi

cat > /etc/apt/apt.conf.d/50unattended-upgrades << 'EOF'
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}-security";
};
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::MinimalSteps "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
EOF

echo -e "${GREEN}✓${NC} Automatic security updates configured\n"

# Setup monitoring with PM2
echo "Configuring PM2 monitoring..."
pm2 install pm2-logrotate 2>/dev/null || true
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true

echo -e "${GREEN}✓${NC} PM2 monitoring configured\n"

# Setup firewall rules (if not already configured)
echo "Verifying firewall configuration..."
if command -v ufw >/dev/null 2>&1; then
    ufw --force enable
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    echo -e "${GREEN}✓${NC} Firewall configured\n"
fi

# Create deployment status page
echo "Creating deployment info..."
cat > /var/www/valt-omniagent/DEPLOYMENT-INFO.txt << EOF
Valt OmniAgent - Deployment Information
========================================

Deployed: $(date)
Version: $(cd /var/www/valt-omniagent && git rev-parse --short HEAD 2>/dev/null || echo "N/A")
Node Version: $(node --version)
PM2 Version: $(pm2 --version)

Server Configuration:
- Application Directory: /var/www/valt-omniagent
- Backup Directory: /var/backups/valt-omniagent
- Scripts Directory: /root/scripts
- Log Directory: /var/www/valt-omniagent/logs

Automated Tasks:
- Health checks: Every 5 minutes
- Full backups: Daily at 2:00 AM
- Quick backups: Every 6 hours
- SSL renewal: Weekly check
- PM2 restart: Weekly (Sunday 3:00 AM)
- Security updates: Monthly

Scripts Available:
- /root/scripts/backup.sh - Create backups
- /root/scripts/restore.sh - Restore from backup
- /root/scripts/rollback.sh - Rollback deployment
- /root/scripts/health-check.sh - Manual health check

Quick Commands:
- Deploy: bash auto-deploy.sh
- Status: pm2 status
- Logs: pm2 logs valt-omniagent
- Restart: pm2 restart valt-omniagent
- Backup: /root/scripts/backup.sh full
- Restore: /root/scripts/restore.sh list
- Rollback: /root/scripts/rollback.sh

Monitoring:
- Health status: cat /tmp/valt-health-status
- Metrics: cat /tmp/valt-metrics.txt
- Recent backups: ls -lht /var/backups/valt-omniagent/

EOF

echo -e "${GREEN}✓${NC} Deployment info created\n"

# Test all scripts
echo "Testing scripts..."
if [ -f "/root/scripts/health-check.sh" ]; then
    /root/scripts/health-check.sh >/dev/null 2>&1 && echo -e "${GREEN}✓${NC} Health check script works" || echo -e "${YELLOW}⚠${NC} Health check script needs attention"
fi

# Create README for operators
cat > /root/OPERATIONS-README.md << 'EOF'
# Valt OmniAgent - Operations Guide

## Daily Operations

### Check Application Status
```bash
pm2 status
pm2 logs valt-omniagent --lines 50
```

### Manual Health Check
```bash
/root/scripts/health-check.sh
```

### View Metrics
```bash
cat /tmp/valt-metrics.txt
```

## Deployment

### Automated Deployment (from local machine)
```bash
bash scripts/auto-deploy.sh
```

### Manual Deployment Steps
1. Upload new build to server
2. SSH to server
3. cd /var/www/valt-omniagent
4. Extract files
5. npm ci --production
6. pm2 restart valt-omniagent

## Backup & Restore

### Create Backup
```bash
/root/scripts/backup.sh full       # Full backup
/root/scripts/backup.sh quick      # Quick backup
/root/scripts/backup.sh application # Application only
```

### List Backups
```bash
/root/scripts/restore.sh list
```

### Restore from Backup
```bash
/root/scripts/restore.sh <backup-filename>
/root/scripts/restore.sh latest    # Restore most recent
```

### Rollback Deployment
```bash
/root/scripts/rollback.sh
/root/scripts/rollback.sh latest   # Rollback to previous version
```

## Troubleshooting

### Application Not Responding
1. Check PM2 status: `pm2 status`
2. Check logs: `pm2 logs valt-omniagent --err`
3. Restart: `pm2 restart valt-omniagent`
4. If still failing: `/root/scripts/rollback.sh`

### High Memory Usage
```bash
pm2 restart valt-omniagent
```

### Disk Space Issues
```bash
# Clean old backups
find /var/backups/valt-omniagent -name "*.tar.gz" -mtime +30 -delete

# Clean old logs
pm2 flush
find /var/www/valt-omniagent/logs -name "*.log" -mtime +30 -delete
```

### SSL Certificate Issues
```bash
certbot renew --force-renewal
systemctl reload nginx
```

## Monitoring

### View Health Status
```bash
cat /tmp/valt-health-status
tail -f /var/log/valt-health-check.log
```

### View Recent Backups
```bash
ls -lht /var/backups/valt-omniagent/ | head -10
```

### Check Cron Jobs
```bash
crontab -l
```

## Security

### View Failed Login Attempts
```bash
fail2ban-client status sshd
```

### Check Firewall Status
```bash
ufw status
```

## Useful Locations

- Application: `/var/www/valt-omniagent`
- Backups: `/var/backups/valt-omniagent`
- Scripts: `/root/scripts`
- Logs: `/var/www/valt-omniagent/logs`
- Nginx Config: `/etc/nginx/sites-available/omni.valtara.ai`
- SSL Certs: `/etc/letsencrypt/live/omni.valtara.ai`

## Emergency Contacts

- Development Team: [Add contact info]
- System Administrator: [Add contact info]
- Hosting Provider: [Add contact info]
EOF

echo -e "${GREEN}✓${NC} Operations guide created: /root/OPERATIONS-README.md\n"

# Summary
echo -e "${GREEN}=========================================="
echo "CI/CD Infrastructure Setup Complete!"
echo -e "==========================================${NC}\n"

echo "What's been configured:"
echo "  ✓ Automated health checks (every 5 minutes)"
echo "  ✓ Daily backups at 2:00 AM"
echo "  ✓ Log rotation (14 days retention)"
echo "  ✓ fail2ban for SSH protection"
echo "  ✓ Automatic security updates"
echo "  ✓ PM2 log rotation"
echo "  ✓ Weekly SSL certificate renewal check"
echo "  ✓ Firewall rules"
echo ""
echo "Available scripts in /root/scripts/:"
echo "  - backup.sh - Create backups"
echo "  - restore.sh - Restore from backups"
echo "  - rollback.sh - Rollback deployments"
echo "  - health-check.sh - Health monitoring"
echo "  - auto-deploy.sh - Automated deployment"
echo ""
echo "Documentation:"
echo "  - Operations guide: /root/OPERATIONS-README.md"
echo "  - Deployment info: /var/www/valt-omniagent/DEPLOYMENT-INFO.txt"
echo ""
echo "Next steps:"
echo "  1. Test health check: /root/scripts/health-check.sh"
echo "  2. Create first backup: /root/scripts/backup.sh full"
echo "  3. Review cron jobs: crontab -l"
echo "  4. Read operations guide: cat /root/OPERATIONS-README.md"
echo ""

exit 0
