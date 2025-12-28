# Valt OmniAgent - Production Deployment Guide

## Server Information
- **IP Address**: 91.99.79.131
- **Domain**: omni.valtara.ai
- **SSH Key**: ubuntu-ky.pem
- **User**: root
- **Port**: 3000 (application), 80/443 (nginx)

## Prerequisites Checklist

### DNS Configuration
- [ ] Point A record for `omni.valtara.ai` to `91.99.79.131`
- [ ] Point A record for `www.omni.valtara.ai` to `91.99.79.131`
- [ ] Wait for DNS propagation (can take up to 24 hours, typically 5-15 minutes)

### Local Machine
- [ ] SSH key `ubuntu-ky.pem` is in project root
- [ ] SSH key has correct permissions: `chmod 600 ubuntu-ky.pem` (Unix/Mac)
- [ ] Node.js 18+ installed locally
- [ ] Git Bash or WSL installed (for Windows users)

## Deployment Steps

### Step 1: Initial Server Setup

1. **Copy files to server**:
```bash
# Make sure you're in the project root directory
scp -i ubuntu-ky.pem server-setup.sh nginx.conf root@91.99.79.131:/tmp/
```

2. **SSH into server**:
```bash
ssh -i ubuntu-ky.pem root@91.99.79.131
```

3. **Run server setup script**:
```bash
cd /tmp
chmod +x server-setup.sh
./server-setup.sh
```

This script will:
- Update system packages
- Install Node.js 20.x LTS
- Install PM2 process manager
- Install and configure Nginx
- Install Certbot for SSL
- Obtain SSL certificates
- Configure firewall (UFW)
- Set up PM2 to start on boot

**Note**: The SSL certificate step will prompt you to agree to terms. Press 'Y' when asked.

### Step 2: Deploy Application

From your local machine:

1. **Make deploy script executable**:
```bash
chmod +x deploy.sh
```

2. **Run deployment**:
```bash
bash deploy.sh
```

This will:
- Build the application locally
- Create a compressed archive
- Upload to server via SCP
- Extract files on server
- Install dependencies with `npm ci`
- Start/restart PM2 process

### Step 3: Verify Deployment

1. **Check PM2 status**:
```bash
ssh -i ubuntu-ky.pem root@91.99.79.131 "pm2 status"
```

Expected output:
```
┌─────┬────────────────────┬─────────────┬─────────┬─────────┬──────────┐
│ id  │ name               │ mode        │ ↺       │ status  │ cpu      │
├─────┼────────────────────┼─────────────┼─────────┼─────────┼──────────┤
│ 0   │ valt-omniagent     │ cluster     │ 0       │ online  │ 0%       │
└─────┴────────────────────┴─────────────┴─────────┴─────────┴──────────┘
```

2. **Check application logs**:
```bash
ssh -i ubuntu-ky.pem root@91.99.79.131 "pm2 logs valt-omniagent --lines 50"
```

3. **Test local connection**:
```bash
ssh -i ubuntu-ky.pem root@91.99.79.131 "curl http://localhost:3000"
```

4. **Test Nginx**:
```bash
curl http://91.99.79.131
curl https://omni.valtara.ai
```

5. **Browser test**:
   - Navigate to https://omni.valtara.ai
   - Check that SSL certificate is valid
   - Test key pages: `/`, `/dashboard`, `/about`, `/contact`

## Post-Deployment

### Monitor Application

```bash
# View real-time logs
ssh -i ubuntu-ky.pem root@91.99.79.131 "pm2 logs"

# View PM2 monitoring dashboard
ssh -i ubuntu-ky.pem root@91.99.79.131 "pm2 monit"

# Check memory/CPU usage
ssh -i ubuntu-ky.pem root@91.99.79.131 "pm2 status"
```

### Save PM2 Configuration

After verifying everything works:
```bash
ssh -i ubuntu-ky.pem root@91.99.79.131 "pm2 save"
```

This ensures PM2 will restart your app after server reboot.

### Update Deployment

To deploy updates:
```bash
# Simply run the deploy script again
bash deploy.sh
```

This will:
- Build latest changes
- Upload to server
- Restart application with zero downtime

## Troubleshooting

### Application Won't Start

```bash
# Check PM2 logs for errors
ssh -i ubuntu-ky.pem root@91.99.79.131 "pm2 logs valt-omniagent --err --lines 100"

# Restart application
ssh -i ubuntu-ky.pem root@91.99.79.131 "pm2 restart valt-omniagent"

# Check if port 3000 is in use
ssh -i ubuntu-ky.pem root@91.99.79.131 "lsof -i :3000"
```

### Nginx Issues

```bash
# Check Nginx error logs
ssh -i ubuntu-ky.pem root@91.99.79.131 "sudo tail -f /var/log/nginx/error.log"

# Test Nginx configuration
ssh -i ubuntu-ky.pem root@91.99.79.131 "sudo nginx -t"

# Restart Nginx
ssh -i ubuntu-ky.pem root@91.99.79.131 "sudo systemctl restart nginx"

# Check Nginx status
ssh -i ubuntu-ky.pem root@91.99.79.131 "sudo systemctl status nginx"
```

### SSL Certificate Issues

```bash
# Check certificate status
ssh -i ubuntu-ky.pem root@91.99.79.131 "sudo certbot certificates"

# Renew certificates manually
ssh -i ubuntu-ky.pem root@91.99.79.131 "sudo certbot renew"

# Test auto-renewal
ssh -i ubuntu-ky.pem root@91.99.79.131 "sudo certbot renew --dry-run"
```

### DNS Not Resolving

```bash
# Check DNS propagation
nslookup omni.valtara.ai

# Or use online tools:
# - https://www.whatsmydns.net/
# - https://dnschecker.org/
```

### Port Issues

```bash
# Check if firewall is blocking ports
ssh -i ubuntu-ky.pem root@91.99.79.131 "sudo ufw status"

# Allow ports if needed
ssh -i ubuntu-ky.pem root@91.99.79.131 "sudo ufw allow 80/tcp && sudo ufw allow 443/tcp"
```

## Environment Variables

The `.env.local` file is automatically deployed with your application. To update environment variables:

1. Update `.env.local` locally
2. Run `bash deploy.sh` to redeploy
3. Environment variables are loaded automatically by Next.js

**Critical Environment Variables** (ensure these are set in .env.local):
- `NEXTAUTH_SECRET` - For authentication (if using NextAuth)
- `NEXTAUTH_URL` - Should be `https://omni.valtara.ai`
- Database credentials (if using a database)
- API keys for third-party services

## Security Checklist

- [x] Firewall configured (ports 22, 80, 443 only)
- [x] SSL certificates installed and auto-renewing
- [x] Nginx security headers configured (HSTS, CSP, etc.)
- [x] DDoS/DoS protection (rate limiting, connection limits)
- [x] Fail2ban brute force protection
- [x] SSH hardening (key-only auth, rate limiting)
- [x] Kernel hardening (SYN flood, IP spoofing protection)
- [x] Security auditing (auditd)
- [x] Automatic security updates
- [ ] Database credentials in environment variables (not hardcoded)
- [ ] API keys in environment variables (not in code)
- [ ] Backup strategy implemented
- [ ] Monitoring and alerting configured

**📚 See [SECURITY.md](SECURITY.md) for comprehensive security documentation.**

## Performance Optimization

### Enable Caching

The nginx configuration includes:
- Static file caching (1 year for immutable assets)
- Gzip compression
- Browser caching headers

### Monitor Performance

```bash
# Check response times
curl -w "@curl-format.txt" -o /dev/null -s https://omni.valtara.ai

# Where curl-format.txt contains:
# time_namelookup:  %{time_namelookup}\n
# time_connect:  %{time_connect}\n
# time_starttransfer:  %{time_starttransfer}\n
# time_total:  %{time_total}\n
```

### Scale PM2 Instances

```bash
# Scale to use all CPU cores
ssh -i ubuntu-ky.pem root@91.99.79.131 "pm2 scale valt-omniagent max"

# Or specify number of instances
ssh -i ubuntu-ky.pem root@91.99.79.131 "pm2 scale valt-omniagent 4"
```

## Backup Strategy

### Application Code
- Code is backed up in your Git repository
- Ensure you push all changes before deploying

### Logs
PM2 logs are stored in:
- `/var/www/valt-omniagent/logs/out.log`
- `/var/www/valt-omniagent/logs/error.log`

Set up log rotation:
```bash
ssh -i ubuntu-ky.pem root@91.99.79.131 "pm2 install pm2-logrotate"
ssh -i ubuntu-ky.pem root@91.99.79.131 "pm2 set pm2-logrotate:max_size 10M"
ssh -i ubuntu-ky.pem root@91.99.79.131 "pm2 set pm2-logrotate:retain 30"
```

## Maintenance

### Update Dependencies

```bash
# SSH to server
ssh -i ubuntu-ky.pem root@91.99.79.131

# Navigate to app directory
cd /var/www/valt-omniagent

# Update packages
npm update

# Restart app
pm2 restart valt-omniagent
```

### System Updates

```bash
ssh -i ubuntu-ky.pem root@91.99.79.131 "sudo apt-get update && sudo apt-get upgrade -y"
```

Run monthly or when security updates are available.

## Support Contacts

- **Domain Registrar**: Check your domain provider for DNS management
- **Server Provider**: Contact your VPS/cloud provider for server issues
- **SSL Support**: Let's Encrypt community forums

## Quick Reference Commands

```bash
# Deploy updates
bash deploy.sh

# Fix and secure server (comprehensive)
bash fix-and-secure.sh
# or on Windows:
powershell -ExecutionPolicy Bypass -File fix-and-secure.ps1

# Deploy security only
bash deploy-security.sh

# View logs
ssh -i ubuntu-ky.pem root@91.99.79.131 "pm2 logs"

# Restart app
ssh -i ubuntu-ky.pem root@91.99.79.131 "pm2 restart valt-omniagent"

# Check status
ssh -i ubuntu-ky.pem root@91.99.79.131 "pm2 status"

# Check security status
ssh -i ubuntu-ky.pem root@91.99.79.131 "fail2ban-client status"
ssh -i ubuntu-ky.pem root@91.99.79.131 "ufw status"

# SSH to server
ssh -i ubuntu-ky.pem root@91.99.79.131

# Test site
curl https://omni.valtara.ai
curl -I https://omni.valtara.ai  # Check headers
```

## Production Checklist

Before going live:

- [ ] DNS configured and propagated
- [ ] SSL certificates installed and valid
- [ ] All environment variables set correctly
- [ ] Authentication system fully implemented (currently placeholder)
- [ ] Database backups configured (if applicable)
- [ ] Monitoring and alerting set up
- [ ] Error tracking configured (e.g., Sentry)
- [ ] Load testing completed
- [ ] Security audit performed
- [ ] Documentation updated
- [ ] Team trained on deployment process

## Known Limitations

⚠️ **IMPORTANT**: The following features are currently placeholders and need implementation before production use:

1. **Authentication System** (`src/app/api/auth/[...nextauth]/route.ts`)
   - Currently returns 404
   - Need to implement actual NextAuth handlers
   - Configure authentication providers

2. **Signup Endpoint** (`src/app/api/auth/signup/route.ts`)
   - Currently returns 501 (Not Implemented)
   - Need to implement user registration logic
   - Add validation and database integration

3. **Auth Pages** (`src/app/auth/signin/page.tsx`, `src/app/auth/signup/page.tsx`)
   - Currently show "not implemented" messages
   - Need to create full authentication forms
   - Integrate with API endpoints

**Do not enable user registration/authentication features until these are properly implemented.**
