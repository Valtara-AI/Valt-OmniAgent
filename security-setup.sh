#!/bin/bash
# ============================================================================
# ENTERPRISE SECURITY SETUP SCRIPT
# Valt OmniAgent - omni.valtara.ai
# ============================================================================
# This script implements enterprise-grade security including:
# - DDoS/DoS protection
# - Brute force protection with Fail2ban
# - Hardened firewall rules
# - SSH hardening
# - Nginx security configuration
# - Automatic security updates
# - Intrusion detection
# ============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Log function
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

header() {
    echo -e "\n${BLUE}============================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================================${NC}\n"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    error "Please run as root (sudo ./security-setup.sh)"
    exit 1
fi

header "VALT OMNIAGENT - ENTERPRISE SECURITY SETUP"

# ============================================================================
# 1. SYSTEM UPDATES
# ============================================================================
header "1. Updating System Packages"

apt-get update -y
apt-get upgrade -y
apt-get dist-upgrade -y
apt-get autoremove -y

log "System packages updated"

# ============================================================================
# 2. INSTALL SECURITY TOOLS
# ============================================================================
header "2. Installing Security Tools"

apt-get install -y \
    fail2ban \
    ufw \
    unattended-upgrades \
    apt-listchanges \
    logwatch \
    rkhunter \
    chkrootkit \
    clamav \
    clamav-daemon \
    lynis \
    auditd \
    aide \
    libpam-google-authenticator \
    apparmor \
    apparmor-utils \
    iptables-persistent \
    netfilter-persistent

log "Security tools installed"

# ============================================================================
# 3. CONFIGURE UFW FIREWALL
# ============================================================================
header "3. Configuring UFW Firewall"

# Reset UFW to defaults
ufw --force reset

# Default policies
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (limit connection attempts)
ufw limit ssh comment 'SSH - rate limited'

# Allow HTTP/HTTPS
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'

# Allow Node.js app only from localhost (nginx proxy)
# ufw allow from 127.0.0.1 to any port 3000 comment 'Node.js App Local'

# Enable logging
ufw logging high

# Enable UFW
ufw --force enable

log "UFW firewall configured"
ufw status verbose

# ============================================================================
# 4. IPTABLES ADVANCED RULES (DDoS Protection)
# ============================================================================
header "4. Configuring IPTables DDoS Protection"

# Create iptables rules script
cat > /etc/iptables-ddos.sh << 'EOF'
#!/bin/bash
# Advanced IPTables DDoS Protection Rules

# Clear existing rules
iptables -F
iptables -X
iptables -Z

# Default policies
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Allow loopback
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# Allow established and related connections
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Drop invalid packets
iptables -A INPUT -m conntrack --ctstate INVALID -j DROP

# Drop packets with suspicious TCP flags
iptables -A INPUT -p tcp --tcp-flags ALL NONE -j DROP
iptables -A INPUT -p tcp --tcp-flags ALL ALL -j DROP
iptables -A INPUT -p tcp --tcp-flags ALL FIN,PSH,URG -j DROP
iptables -A INPUT -p tcp --tcp-flags ALL SYN,FIN,PSH,URG -j DROP
iptables -A INPUT -p tcp --tcp-flags ALL SYN,RST,ACK,FIN,URG -j DROP
iptables -A INPUT -p tcp --tcp-flags SYN,RST SYN,RST -j DROP
iptables -A INPUT -p tcp --tcp-flags SYN,FIN SYN,FIN -j DROP

# Drop fragments
iptables -A INPUT -f -j DROP

# Drop XMAS packets
iptables -A INPUT -p tcp --tcp-flags ALL ALL -j DROP

# Drop NULL packets
iptables -A INPUT -p tcp --tcp-flags ALL NONE -j DROP

# Limit ICMP (ping)
iptables -A INPUT -p icmp --icmp-type echo-request -m limit --limit 1/s --limit-burst 4 -j ACCEPT
iptables -A INPUT -p icmp --icmp-type echo-request -j DROP

# SYN flood protection
iptables -A INPUT -p tcp --syn -m limit --limit 10/s --limit-burst 20 -j ACCEPT
iptables -A INPUT -p tcp --syn -j DROP

# Port scan protection
iptables -A INPUT -p tcp --tcp-flags SYN,ACK,FIN,RST RST -m limit --limit 1/s --limit-burst 4 -j ACCEPT
iptables -A INPUT -p tcp --tcp-flags SYN,ACK,FIN,RST RST -j DROP

# SSH (rate limited)
iptables -A INPUT -p tcp --dport 22 -m conntrack --ctstate NEW -m recent --set --name SSH
iptables -A INPUT -p tcp --dport 22 -m conntrack --ctstate NEW -m recent --update --seconds 60 --hitcount 4 --name SSH -j DROP
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# HTTP/HTTPS with connection limits
iptables -A INPUT -p tcp --dport 80 -m connlimit --connlimit-above 50 --connlimit-mask 32 -j DROP
iptables -A INPUT -p tcp --dport 443 -m connlimit --connlimit-above 50 --connlimit-mask 32 -j DROP
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Log dropped packets (limited to prevent log flooding)
iptables -A INPUT -m limit --limit 5/min -j LOG --log-prefix "IPTables-Dropped: " --log-level 4

# Save rules
netfilter-persistent save
EOF

chmod +x /etc/iptables-ddos.sh
# Note: UFW manages iptables, so we won't run this script directly
# It's here for reference and manual hardening if needed

log "IPTables DDoS protection rules created (managed by UFW)"

# ============================================================================
# 5. CONFIGURE FAIL2BAN
# ============================================================================
header "5. Configuring Fail2ban"

# Backup default config
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.conf.backup

# Create main jail.local
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
# Ban duration
bantime = 1h

# Find time window
findtime = 10m

# Max retries
maxretry = 5

# Ignore local IPs
ignoreip = 127.0.0.1/8 ::1

# Action
banaction = iptables-multiport
banaction_allports = iptables-allports

# Backend
backend = systemd

# Email alerts (configure if needed)
# destemail = admin@valtara.ai
# sender = fail2ban@omni.valtara.ai
# action = %(action_mwl)s

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
findtime = 600
bantime = 86400
EOF

# Create nginx-limit-req filter
cat > /etc/fail2ban/filter.d/nginx-limit-req.conf << 'EOF'
[Definition]
failregex = limiting requests, excess:.* by zone.*client: <HOST>
ignoreregex =
EOF

# Create nginx-ddos filter
cat > /etc/fail2ban/filter.d/nginx-ddos.conf << 'EOF'
[Definition]
failregex = ^<HOST>.*"(GET|POST|HEAD|PUT|DELETE|PATCH).*HTTP.*" (429|444|403) .*$
            limiting requests, excess: .* by zone .*, client: <HOST>
ignoreregex =
EOF

# Create nginx-badbots filter
cat > /etc/fail2ban/filter.d/nginx-badbots.conf << 'EOF'
[Definition]
failregex = ^<HOST> .* "(GET|POST|HEAD).*HTTP.*" .* "(python-requests|nikto|nmap|sqlmap|masscan|dirbuster|gobuster|wfuzz|hydra|medusa|acunetix|nessus|openvas|burp|zaproxy|owasp|nuclei).*"$
            ^<HOST> .* "(GET|POST|HEAD).*(wp-admin|wp-login|phpmyadmin|admin\.php|administrator|\.env|\.git|config\.php|setup\.php).*HTTP.*"
ignoreregex =
EOF

# Create nginx jails
cat > /etc/fail2ban/jail.d/nginx.conf << 'EOF'
[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 3
bantime = 3600

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
findtime = 120
bantime = 7200

[nginx-ddos]
enabled = true
filter = nginx-ddos
port = http,https
logpath = /var/log/nginx/*.log
maxretry = 30
findtime = 60
bantime = 3600

[nginx-badbots]
enabled = true
filter = nginx-badbots
port = http,https
logpath = /var/log/nginx/*.log
maxretry = 2
findtime = 300
bantime = 86400

[recidive]
enabled = true
filter = recidive
logpath = /var/log/fail2ban.log
bantime = 1w
findtime = 1d
maxretry = 3
EOF

# Enable and restart fail2ban
systemctl enable fail2ban
systemctl restart fail2ban

log "Fail2ban configured and started"
fail2ban-client status

# ============================================================================
# 6. SSH HARDENING
# ============================================================================
header "6. Hardening SSH Configuration"

# Backup SSH config
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Apply SSH hardening
cat > /etc/ssh/sshd_config.d/hardening.conf << 'EOF'
# SSH Hardening Configuration

# Protocol version
Protocol 2

# Authentication
PermitRootLogin prohibit-password
PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no
ChallengeResponseAuthentication no

# Max authentication attempts
MaxAuthTries 3
MaxSessions 3

# Login grace time
LoginGraceTime 30

# Strict mode
StrictModes yes

# Disable X11 forwarding
X11Forwarding no

# Disable TCP forwarding (if not needed)
AllowTcpForwarding no
AllowAgentForwarding no

# Disable tunnels
PermitTunnel no

# Logging
LogLevel VERBOSE

# Idle timeout
ClientAliveInterval 300
ClientAliveCountMax 2

# Banner
Banner /etc/ssh/banner

# Allowed users (uncomment and modify as needed)
# AllowUsers root ubuntu

# Disable unused authentication methods
KerberosAuthentication no
GSSAPIAuthentication no
HostbasedAuthentication no
EOF

# Create SSH banner
cat > /etc/ssh/banner << 'EOF'
***************************************************************************
                            AUTHORIZED ACCESS ONLY
                            
This system is for authorized users only. All activities are monitored 
and logged. Unauthorized access attempts will be prosecuted to the 
fullest extent of the law.

By continuing, you consent to monitoring and accept all responsibility
for your actions on this system.
***************************************************************************
EOF

# Test and restart SSH
sshd -t && systemctl restart sshd

log "SSH hardening applied"

# ============================================================================
# 7. DEPLOY NGINX SECURITY CONFIGURATION
# ============================================================================
header "7. Deploying Secure Nginx Configuration"

# Check if secure config exists in /tmp
if [ -f "/tmp/nginx-secure.conf" ]; then
    # Backup existing config
    if [ -f "/etc/nginx/sites-available/omni.valtara.ai" ]; then
        cp /etc/nginx/sites-available/omni.valtara.ai /etc/nginx/sites-available/omni.valtara.ai.backup
    fi
    
    # Copy new secure config
    cp /tmp/nginx-secure.conf /etc/nginx/sites-available/omni.valtara.ai
    
    # Enable the site
    ln -sf /etc/nginx/sites-available/omni.valtara.ai /etc/nginx/sites-enabled/
    
    # Remove default site
    rm -f /etc/nginx/sites-enabled/default
    
    # Test nginx configuration
    if nginx -t; then
        systemctl reload nginx
        log "Nginx secure configuration deployed"
    else
        error "Nginx configuration test failed!"
        # Restore backup if exists
        if [ -f "/etc/nginx/sites-available/omni.valtara.ai.backup" ]; then
            cp /etc/nginx/sites-available/omni.valtara.ai.backup /etc/nginx/sites-available/omni.valtara.ai
            nginx -t && systemctl reload nginx
        fi
    fi
else
    warn "Nginx secure config not found at /tmp/nginx-secure.conf"
    warn "Please upload nginx-secure.conf manually"
fi

# Generate DH parameters for stronger encryption (takes a few minutes)
if [ ! -f "/etc/nginx/dhparam.pem" ]; then
    log "Generating DH parameters (this may take a few minutes)..."
    openssl dhparam -out /etc/nginx/dhparam.pem 2048
    log "DH parameters generated"
fi

# ============================================================================
# 8. ENABLE AUTOMATIC SECURITY UPDATES
# ============================================================================
header "8. Configuring Automatic Security Updates"

cat > /etc/apt/apt.conf.d/50unattended-upgrades << 'EOF'
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}";
    "${distro_id}:${distro_codename}-security";
    "${distro_id}ESMApps:${distro_codename}-apps-security";
    "${distro_id}ESM:${distro_codename}-infra-security";
};

Unattended-Upgrade::Package-Blacklist {
};

Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::MinimalSteps "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
Unattended-Upgrade::Automatic-Reboot-Time "03:00";
EOF

cat > /etc/apt/apt.conf.d/20auto-upgrades << 'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
EOF

systemctl enable unattended-upgrades
systemctl start unattended-upgrades

log "Automatic security updates configured"

# ============================================================================
# 9. CONFIGURE AUDITD (Security Auditing)
# ============================================================================
header "9. Configuring Security Auditing"

cat > /etc/audit/rules.d/valt-security.rules << 'EOF'
# Delete all existing rules
-D

# Buffer size
-b 8192

# Failure mode (silent)
-f 1

# Monitor authentication events
-w /etc/passwd -p wa -k identity
-w /etc/group -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/security/opasswd -p wa -k identity

# Monitor SSH config
-w /etc/ssh/sshd_config -p wa -k sshd
-w /etc/ssh/sshd_config.d -p wa -k sshd

# Monitor sudo usage
-w /etc/sudoers -p wa -k sudo
-w /etc/sudoers.d -p wa -k sudo

# Monitor network config
-w /etc/nginx -p wa -k nginx
-w /etc/hosts -p wa -k hosts

# Monitor fail2ban
-w /etc/fail2ban -p wa -k fail2ban

# Monitor cron
-w /etc/cron.d -p wa -k cron
-w /etc/crontab -p wa -k cron

# Monitor login events
-w /var/log/lastlog -p wa -k login
-w /var/log/faillog -p wa -k login

# Privileged commands
-a always,exit -F path=/usr/bin/sudo -F perm=x -F auid>=1000 -F auid!=4294967295 -k priv_cmd
-a always,exit -F path=/usr/bin/su -F perm=x -F auid>=1000 -F auid!=4294967295 -k priv_cmd

# Make config immutable (must be last rule)
-e 2
EOF

systemctl enable auditd
systemctl restart auditd

log "Security auditing configured"

# ============================================================================
# 10. CONFIGURE LOG ROTATION
# ============================================================================
header "10. Configuring Log Rotation"

cat > /etc/logrotate.d/nginx-valt << 'EOF'
/var/log/nginx/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    prerotate
        if [ -d /etc/logrotate.d/httpd-prerotate ]; then
            run-parts /etc/logrotate.d/httpd-prerotate
        fi
    endscript
    postrotate
        invoke-rc.d nginx rotate >/dev/null 2>&1
    endscript
}
EOF

log "Log rotation configured"

# ============================================================================
# 11. KERNEL HARDENING
# ============================================================================
header "11. Applying Kernel Hardening"

cat > /etc/sysctl.d/99-security.conf << 'EOF'
# Network security
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 4096
net.ipv4.tcp_synack_retries = 2
net.ipv4.tcp_syn_retries = 5

# IP spoofing protection
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# Disable source routing
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0

# Ignore ICMP broadcast requests
net.ipv4.icmp_echo_ignore_broadcasts = 1

# Ignore bogus ICMP errors
net.ipv4.icmp_ignore_bogus_error_responses = 1

# Log Martians
net.ipv4.conf.all.log_martians = 1
net.ipv4.conf.default.log_martians = 1

# Disable redirects
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0
net.ipv4.conf.all.secure_redirects = 0
net.ipv4.conf.default.secure_redirects = 0

# IPv6 hardening
net.ipv6.conf.all.accept_redirects = 0
net.ipv6.conf.default.accept_redirects = 0
net.ipv6.conf.all.accept_source_route = 0
net.ipv6.conf.default.accept_source_route = 0

# Memory protection
kernel.randomize_va_space = 2
kernel.kptr_restrict = 2

# Process hardening
kernel.dmesg_restrict = 1
kernel.sysrq = 0

# File system hardening
fs.suid_dumpable = 0
fs.protected_hardlinks = 1
fs.protected_symlinks = 1

# Connection limits
net.core.somaxconn = 65535
net.core.netdev_max_backlog = 65535
net.ipv4.tcp_max_tw_buckets = 1440000
net.ipv4.ip_local_port_range = 1024 65535

# Performance tuning
net.ipv4.tcp_fin_timeout = 30
net.ipv4.tcp_keepalive_time = 600
net.ipv4.tcp_keepalive_probes = 5
net.ipv4.tcp_keepalive_intvl = 15
EOF

sysctl -p /etc/sysctl.d/99-security.conf

log "Kernel hardening applied"

# ============================================================================
# 12. FINAL STATUS CHECK
# ============================================================================
header "12. Security Setup Complete - Status Check"

echo ""
echo "=== FIREWALL STATUS ==="
ufw status numbered

echo ""
echo "=== FAIL2BAN STATUS ==="
fail2ban-client status

echo ""
echo "=== SSH STATUS ==="
systemctl status sshd --no-pager | head -5

echo ""
echo "=== NGINX STATUS ==="
systemctl status nginx --no-pager | head -5

echo ""
echo "=== PM2 STATUS (if running) ==="
su - root -c "pm2 status" 2>/dev/null || echo "PM2 not running"

# ============================================================================
# SUMMARY
# ============================================================================
header "SECURITY SETUP SUMMARY"

echo -e "${GREEN}✓${NC} System packages updated"
echo -e "${GREEN}✓${NC} Security tools installed (fail2ban, ufw, auditd, etc.)"
echo -e "${GREEN}✓${NC} UFW firewall configured (SSH rate-limited, HTTP/HTTPS allowed)"
echo -e "${GREEN}✓${NC} Fail2ban configured (SSH, Nginx DDoS, bad bots)"
echo -e "${GREEN}✓${NC} SSH hardened (key-only auth, limited retries)"
echo -e "${GREEN}✓${NC} Automatic security updates enabled"
echo -e "${GREEN}✓${NC} Security auditing configured"
echo -e "${GREEN}✓${NC} Kernel hardening applied"
echo -e "${GREEN}✓${NC} Log rotation configured"

echo ""
echo -e "${YELLOW}IMPORTANT NEXT STEPS:${NC}"
echo "1. Upload nginx-secure.conf to server and restart nginx"
echo "2. Verify application is running: pm2 status"
echo "3. Test website: curl https://omni.valtara.ai"
echo "4. Run security audit: lynis audit system"
echo "5. Review fail2ban status: fail2ban-client status"
echo ""
echo -e "${GREEN}Security setup completed successfully!${NC}"
