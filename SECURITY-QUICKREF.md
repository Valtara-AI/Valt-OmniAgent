# 🛡️ VALT OMNIAGENT - SECURITY QUICK REFERENCE

## Deployment Commands

### Windows (PowerShell)
```powershell
# Fix everything and apply security
.\fix-and-secure.ps1

# Security only
.\deploy-security.ps1
```

### Linux/Mac (Bash)
```bash
# Fix everything and apply security
chmod +x fix-and-secure.sh
./fix-and-secure.sh

# Security only
chmod +x deploy-security.sh
./deploy-security.sh
```

## Security Features Active

### ✅ DDoS/DoS Protection
- **Rate Limiting**: 10 req/s general, 5 req/s login, 1 req/s signup
- **Connection Limits**: 30/IP, 1000 total
- **Timeouts**: 10s body/header (Slowloris protection)
- **SYN Flood**: Kernel-level protection

### ✅ Fail2ban Protection
| Service | Ban After | Ban Duration |
|---------|-----------|--------------|
| SSH | 3 attempts | 24 hours |
| Nginx DDoS | 30/min | 1 hour |
| Login Abuse | 5 attempts | 1 hour |
| Bad Bots | 2 attempts | 24 hours |
| Repeat Offender | 3 bans | 1 week |

### ✅ Web Application Firewall
- Blocks: WordPress probes, PHPMyAdmin, Git files
- Blocks: nikto, sqlmap, nmap, masscan, scanners
- Empty user-agent blocking
- SQL injection pattern detection

### ✅ SSL/TLS (A+ Grade)
- TLS 1.2/1.3 only
- Modern cipher suites
- HSTS (2 years + preload)
- OCSP Stapling

### ✅ Security Headers
```
Strict-Transport-Security: max-age=63072000
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Content-Security-Policy: [restrictive]
Permissions-Policy: camera=(), mic=(), geo=()
```

### ✅ SSH Hardening
- Key-only authentication
- No password login
- Rate limited (6 attempts/30s = ban)
- No X11/TCP forwarding

### ✅ Firewall (UFW)
- SSH: Rate-limited
- HTTP/HTTPS: Allowed
- All other ports: DENIED

## Monitoring Commands

```bash
# Fail2ban status
ssh -i ubuntu-ky.pem root@91.99.79.131 "fail2ban-client status"

# View banned IPs
ssh -i ubuntu-ky.pem root@91.99.79.131 "fail2ban-client status nginx-ddos"

# Check firewall
ssh -i ubuntu-ky.pem root@91.99.79.131 "ufw status numbered"

# View security logs
ssh -i ubuntu-ky.pem root@91.99.79.131 "tail -f /var/log/fail2ban.log"

# Check for attacks
ssh -i ubuntu-ky.pem root@91.99.79.131 "grep 'Ban' /var/log/fail2ban.log | tail -20"

# Connection count by IP
ssh -i ubuntu-ky.pem root@91.99.79.131 "netstat -ntu | awk '{print \$5}' | cut -d: -f1 | sort | uniq -c | sort -n"
```

## Emergency Response

### Unban an IP
```bash
ssh -i ubuntu-ky.pem root@91.99.79.131 "fail2ban-client unban 1.2.3.4"
```

### Block an IP manually
```bash
ssh -i ubuntu-ky.pem root@91.99.79.131 "ufw deny from 1.2.3.4"
```

### View live attack attempts
```bash
ssh -i ubuntu-ky.pem root@91.99.79.131 "tail -f /var/log/nginx/omni.valtara.ai.access.log"
```

### Check application health
```bash
ssh -i ubuntu-ky.pem root@91.99.79.131 "pm2 status && pm2 logs --lines 50"
```

## Testing Security

### Test Rate Limiting
```bash
# Should get HTTP 429 after 10+ rapid requests
for i in {1..20}; do curl -s -o /dev/null -w "%{http_code}\n" https://omni.valtara.ai; done
```

### Test SSL Grade
Visit: https://www.ssllabs.com/ssltest/analyze.html?d=omni.valtara.ai

### Test Security Headers
```bash
curl -I https://omni.valtara.ai
```

### Security Audit
```bash
ssh -i ubuntu-ky.pem root@91.99.79.131 "lynis audit system --quick"
```

## Rate Limits by Endpoint

| Endpoint | Rate | Burst | Purpose |
|----------|------|-------|---------|
| `/` (general) | 10/s | 20 | Normal browsing |
| `/api/*` | 5/s | 20 | API calls |
| `/signin`, `/login` | 5/s | 10 | Auth pages |
| `/api/auth/signup` | 1/s | 3 | Account creation |
| Static files | 50/s | 100 | Assets |

## Files & Locations

| File | Location |
|------|----------|
| Nginx Config | `/etc/nginx/sites-available/omni.valtara.ai` |
| Fail2ban Jails | `/etc/fail2ban/jail.d/nginx.conf` |
| Fail2ban Filters | `/etc/fail2ban/filter.d/nginx-*.conf` |
| SSH Config | `/etc/ssh/sshd_config.d/hardening.conf` |
| Firewall | `ufw status` |
| Security Logs | `/var/log/fail2ban.log` |
| Nginx Logs | `/var/log/nginx/omni.valtara.ai.*.log` |

## Support

📖 Full Documentation: [SECURITY.md](SECURITY.md)  
📝 Deployment Guide: [DEPLOYMENT.md](DEPLOYMENT.md)  
🚨 Incident Response: See SECURITY.md → "Incident Response"

## Status Check

```bash
# One-line status check
ssh -i ubuntu-ky.pem root@91.99.79.131 "echo '=== APP ===' && pm2 list && echo '=== FIREWALL ===' && ufw status && echo '=== FAIL2BAN ===' && fail2ban-client status"
```

---
**Last Updated**: December 14, 2025  
**Security Level**: Enterprise Grade  
**Threat Protection**: DDoS, Brute Force, Scanners, Exploits
