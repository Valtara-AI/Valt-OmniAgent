# Valt OmniAgent - Enterprise Security Guide

## Overview

This document describes the enterprise-grade security implementation for the Valt OmniAgent platform deployed at `omni.valtara.ai`.

## Security Features Implemented

### 1. DDoS/DoS Protection

#### Rate Limiting Zones (Nginx)
| Zone | Rate | Purpose |
|------|------|---------|
| `req_limit` | 10 req/s | General requests |
| `login_limit` | 5 req/s | Authentication endpoints |
| `strict_limit` | 1 req/s | Signup, password reset |
| `static_limit` | 50 req/s | Static assets |

#### Connection Limits
- **Per IP**: 30 concurrent connections
- **Per Server**: 1000 total connections
- **HTTP/HTTPS**: 50 connections per IP (iptables)

#### Timeouts (Slowloris Mitigation)
- Client body timeout: 10s
- Client header timeout: 10s
- Keepalive timeout: 30s
- Send timeout: 10s

### 2. Fail2ban Protection

#### Jails Configured
| Jail | Max Retry | Find Time | Ban Time | Purpose |
|------|-----------|-----------|----------|---------|
| `sshd` | 3 | 10 min | 24 hours | SSH brute force |
| `nginx-ddos` | 30 | 60s | 1 hour | DDoS attacks |
| `nginx-limit-req` | 10 | 2 min | 2 hours | Rate limit violations |
| `nginx-badbots` | 2 | 5 min | 24 hours | Scanners/bots |
| `nginx-auth` | 5 | 5 min | 1 hour | Login abuse |
| `recidive` | 3 | 1 day | 1 week | Repeat offenders |

### 3. Web Application Firewall (WAF)

#### Blocked Patterns
- WordPress probes (`wp-admin`, `wp-login`)
- PHPMyAdmin access attempts
- Git/config file access
- SQL injection patterns
- Known vulnerability scanners

#### Blocked User Agents
- `nikto`, `sqlmap`, `nmap`, `masscan`
- `dirbuster`, `gobuster`, `wfuzz`
- `hydra`, `medusa`, `acunetix`
- `nessus`, `openvas`, `burp`, `zaproxy`

### 4. SSL/TLS Security (A+ Grade)

#### Configuration
- **Protocols**: TLS 1.2, TLS 1.3 only
- **Ciphers**: Modern Mozilla configuration
- **HSTS**: 2 years with preload
- **OCSP Stapling**: Enabled
- **DH Parameters**: 2048-bit minimum

#### Security Headers
```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: [full policy in nginx config]
```

### 5. Network Security

#### Firewall Rules (UFW)
- **SSH**: Rate-limited (auto-block after 6 attempts in 30s)
- **HTTP/HTTPS**: Allowed
- **All other ports**: Denied
- **Outbound**: Allowed

#### Kernel Hardening
- SYN flood protection
- IP spoofing protection
- ICMP broadcast protection
- Source routing disabled
- Redirect handling disabled
- Memory randomization (ASLR)

### 6. SSH Hardening

- **Authentication**: Key-only (no password)
- **Root login**: Key-only
- **Max attempts**: 3
- **Grace time**: 30 seconds
- **X11 forwarding**: Disabled
- **TCP forwarding**: Disabled

## Deployment

### Quick Deploy (Windows)
```powershell
.\deploy-security.ps1
```

### Quick Deploy (Linux/Mac)
```bash
chmod +x deploy-security.sh
./deploy-security.sh
```

### Manual Deployment

1. **Upload files to server**:
```bash
scp -i ubuntu-ky.pem nginx-secure.conf security-setup.sh root@91.99.79.131:/tmp/
```

2. **Run security setup**:
```bash
ssh -i ubuntu-ky.pem root@91.99.79.131
chmod +x /tmp/security-setup.sh
/tmp/security-setup.sh
```

3. **Deploy Nginx config**:
```bash
cp /tmp/nginx-secure.conf /etc/nginx/sites-available/omni.valtara.ai
ln -sf /etc/nginx/sites-available/omni.valtara.ai /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

## Monitoring

### Check Fail2ban Status
```bash
# All jails
fail2ban-client status

# Specific jail
fail2ban-client status nginx-ddos

# Banned IPs
fail2ban-client status nginx-ddos | grep "Banned IP"
```

### View Security Logs
```bash
# Fail2ban logs
tail -f /var/log/fail2ban.log

# Nginx access logs
tail -f /var/log/nginx/omni.valtara.ai.access.log

# Nginx error logs
tail -f /var/log/nginx/omni.valtara.ai.error.log

# Auth logs
tail -f /var/log/auth.log

# Audit logs
ausearch -i -ts today
```

### Check Firewall
```bash
# UFW status
ufw status verbose

# Active connections
ss -tuln

# Connection count per IP
netstat -ntu | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -n
```

## Managing Banned IPs

### Unban an IP
```bash
# From specific jail
fail2ban-client set nginx-ddos unbanip 1.2.3.4

# From all jails
fail2ban-client unban 1.2.3.4
```

### Whitelist an IP
Edit `/etc/fail2ban/jail.local`:
```ini
[DEFAULT]
ignoreip = 127.0.0.1/8 ::1 YOUR.IP.HERE
```
Then restart: `systemctl restart fail2ban`

### View Ban History
```bash
grep "Ban" /var/log/fail2ban.log | tail -50
```

## Testing Security

### Test Rate Limiting
```bash
# Should get 429 after ~10 rapid requests
for i in {1..20}; do curl -s -o /dev/null -w "%{http_code}\n" https://omni.valtara.ai; done
```

### Test SSL Configuration
```bash
# Using SSL Labs
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=omni.valtara.ai

# Using testssl.sh
docker run --rm -ti drwetter/testssl.sh https://omni.valtara.ai
```

### Test Security Headers
```bash
curl -I https://omni.valtara.ai
```

### Security Audit
```bash
# Run Lynis audit
lynis audit system --quick

# Run rootkit check
rkhunter --check --skip-keypress
```

## Incident Response

### Under DDoS Attack

1. **Check attack pattern**:
```bash
# Top IPs by connection count
netstat -ntu | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn | head -20

# Request rate in logs
tail -1000 /var/log/nginx/omni.valtara.ai.access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -20
```

2. **Manually block attacker**:
```bash
# Using fail2ban
fail2ban-client set nginx-ddos banip 1.2.3.4

# Using UFW
ufw deny from 1.2.3.4

# Block entire subnet
ufw deny from 1.2.3.0/24
```

3. **Increase rate limits temporarily**:
Edit nginx config, reduce limits, reload nginx.

4. **Enable Cloudflare** (recommended for large attacks):
- Point DNS to Cloudflare
- Enable "Under Attack Mode"

### Brute Force Attack on SSH

1. **Check auth logs**:
```bash
grep "Failed password" /var/log/auth.log | tail -50
```

2. **View banned IPs**:
```bash
fail2ban-client status sshd
```

3. **Consider changing SSH port** (add to `/etc/ssh/sshd_config`):
```
Port 2222
```
Update firewall: `ufw allow 2222/tcp`

## Maintenance

### Weekly Tasks
- Review fail2ban logs for patterns
- Check disk space for logs
- Review unusual access patterns

### Monthly Tasks
- Run full security audit: `lynis audit system`
- Update system packages: `apt update && apt upgrade`
- Review and rotate SSH keys if needed
- Check SSL certificate expiry

### Quarterly Tasks
- Review and update firewall rules
- Update fail2ban patterns
- Penetration testing
- Review security incidents

## Emergency Contacts

- **Server Provider**: [Your VPS provider support]
- **Domain/DNS**: [Your registrar support]
- **SSL Issues**: Let's Encrypt community forums
- **DDoS Mitigation**: Consider Cloudflare Enterprise

## File Locations

| File | Purpose |
|------|---------|
| `/etc/nginx/sites-available/omni.valtara.ai` | Nginx secure config |
| `/etc/fail2ban/jail.local` | Fail2ban main config |
| `/etc/fail2ban/jail.d/nginx.conf` | Nginx jails |
| `/etc/fail2ban/filter.d/nginx-*.conf` | Nginx filters |
| `/etc/ssh/sshd_config.d/hardening.conf` | SSH hardening |
| `/etc/sysctl.d/99-security.conf` | Kernel hardening |
| `/etc/audit/rules.d/valt-security.rules` | Audit rules |
| `/var/log/fail2ban.log` | Fail2ban logs |
| `/var/log/nginx/omni.valtara.ai.*.log` | Nginx logs |

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-14 | Initial enterprise security implementation |
