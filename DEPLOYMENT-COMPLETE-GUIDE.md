# Deployment & CI/CD Complete Setup Summary

## ✅ What Has Been Created

### 1. CI/CD Pipeline (GitHub Actions)
**File**: `.github/workflows/deploy.yml`

**Features**:
- Automated testing on every push
- TypeScript type checking
- Linting
- Production build
- Automatic deployment to server
- Health checks after deployment
- Automatic rollback on failure
- Scheduled daily backups

### 2. Automated Deployment Scripts

#### `scripts/auto-deploy.sh`
- **Purpose**: One-command deployment with safety checks
- **Features**: Pre-checks, testing, build, upload, deploy, health check, auto-rollback
- **Usage**: `bash scripts/auto-deploy.sh`

#### `scripts/backup.sh`
- **Purpose**: Comprehensive backup system
- **Types**: Full, Quick, Application, Config, SSL, Logs, PM2
- **Retention**: 30 days
- **Schedule**: Daily at 2:00 AM (full), Every 6 hours (quick)
- **Usage**: `/root/scripts/backup.sh full`

#### `scripts/restore.sh`
- **Purpose**: Restore from any backup
- **Features**: Integrity verification, pre-restore backup, health checks
- **Usage**: `/root/scripts/restore.sh list`

#### `scripts/rollback.sh`
- **Purpose**: Quick rollback to previous version
- **Features**: Fast recovery, maintains last 10 versions
- **Usage**: `/root/scripts/rollback.sh latest`

#### `scripts/health-check.sh`
- **Purpose**: Continuous health monitoring
- **Checks**: PM2, app response, SSL, disk, memory, CPU, logs
- **Schedule**: Every 5 minutes
- **Features**: Auto-restart, alerts, metrics generation
- **Usage**: `/root/scripts/health-check.sh`

#### `scripts/setup-cicd.sh`
- **Purpose**: One-time CI/CD infrastructure setup
- **Installs**: All scripts, cron jobs, log rotation, fail2ban, security
- **Usage**: `bash /var/www/valt-omniagent/scripts/setup-cicd.sh`

### 3. Documentation

- `DEPLOYMENT.md` - Complete deployment guide
- `DEPLOYMENT-WINDOWS.md` - Windows-specific instructions
- `CICD-DOCUMENTATION.md` - Full CI/CD documentation  
- `PRE-DEPLOYMENT-CHECKLIST.md` - Pre-deployment checklist
- `BUILD-SUMMARY.md` - Build process summary

### 4. Automated Tasks (Cron Jobs)

```
*/5 * * * *   Health checks every 5 minutes
0 2 * * *     Full backup daily at 2:00 AM
0 */6 * * *   Quick backup every 6 hours
0 3 * * 0     SSL renewal check weekly
0 4 * * *     Log cleanup daily
0 3 * * 0     PM2 restart weekly
```

### 5. Security Hardening

- fail2ban for SSH protection
- UFW firewall (ports 22, 80, 443 only)
- Automatic security updates
- SSH key-only authentication
- SSL/TLS with Let's Encrypt

### 6. Monitoring & Alerting

- Automated health checks
- PM2 process monitoring
- Disk space alerts
- Memory usage alerts
- SSL certificate expiration warnings
- Webhook notifications (optional)
- Email alerts (optional)

## 🚀 How to Deploy Now

### Option 1: Using Git Bash (Recommended for Windows)

1. **Open Git Bash** in project directory:
   ```bash
   # Right-click in folder → "Git Bash Here"
   ```

2. **Set SSH key permissions**:
   ```bash
   chmod 600 ubuntu-ky.pem
   ```

3. **Run initial deployment**:
   ```bash
   bash initial-deploy.sh
   ```

   The script will:
   - ✓ Verify prerequisites
   - ✓ Test SSH connection
   - ✓ Build application
   - ✓ Upload to server
   - ✓ Run server setup (Node.js, PM2, Nginx, SSL)
   - ✓ Deploy application
   - ✓ Setup CI/CD infrastructure
   - ✓ Run health check

### Option 2: Manual Step-by-Step

If automated script doesn't work, follow these manual steps:

#### Step 1: Build Locally
```bash
npm ci
npm run build
```

#### Step 2: Connect to Server
```bash
ssh -i ubuntu-ky.pem root@91.99.79.131
```

#### Step 3: On Server - Initial Setup
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Install Nginx
apt-get install -y nginx

# Install Certbot
apt-get install -y certbot python3-certbot-nginx

# Create directories
mkdir -p /var/www/valt-omniagent
mkdir -p /root/scripts
mkdir -p /var/backups/valt-omniagent
```

#### Step 4: Upload Files (from local machine)
```bash
# Create archive
tar -czf deploy.tar.gz .next public package.json package-lock.json next.config.js ecosystem.config.js .env.local

# Upload
scp -i ubuntu-ky.pem deploy.tar.gz root@91.99.79.131:/var/www/valt-omniagent/
scp -i ubuntu-ky.pem nginx.conf root@91.99.79.131:/etc/nginx/sites-available/omni.valtara.ai
scp -i ubuntu-ky.pem -r scripts root@91.99.79.131:/root/
```

#### Step 5: On Server - Deploy
```bash
cd /var/www/valt-omniagent

# Extract
tar -xzf deploy.tar.gz

# Install dependencies
npm ci --production

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure Nginx
ln -s /etc/nginx/sites-available/omni.valtara.ai /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# Get SSL certificate (after DNS is configured)
certbot --nginx -d omni.valtara.ai -d www.omni.valtara.ai

# Setup CI/CD
cd /root/scripts
chmod +x *.sh
bash setup-cicd.sh
```

## 🔐 GitHub Actions Setup (Optional but Recommended)

### 1. Add Secrets to GitHub Repository

Go to: **GitHub Repository → Settings → Secrets and variables → Actions**

Add these secrets:

1. **SSH_PRIVATE_KEY**:
   ```
   # Copy content of ubuntu-ky.pem file
   cat ubuntu-ky.pem  # Copy the entire output
   ```

2. **SERVER_IP**:
   ```
   91.99.79.131
   ```

### 2. Push Workflow File
```bash
git add .github/workflows/deploy.yml
git commit -m "Add CI/CD workflow"
git push origin main
```

### 3. Test Workflow
- Go to **Actions** tab in GitHub
- Click on latest workflow run
- Verify all steps complete ✅

## 📋 Post-Deployment Checklist

### Immediately After Deployment

- [ ] Verify application is running:
  ```bash
  ssh -i ubuntu-ky.pem root@91.99.79.131 "pm2 status"
  ```

- [ ] Check application responds:
  ```bash
  curl http://91.99.79.131
  ```

- [ ] View logs:
  ```bash
  ssh -i ubuntu-ky.pem root@91.99.79.131 "pm2 logs valt-omniagent --lines 50"
  ```

### DNS Configuration

- [ ] Point A record for `omni.valtara.ai` to `91.99.79.131`
- [ ] Point A record for `www.omni.valtara.ai` to `91.99.79.131`
- [ ] Wait for DNS propagation (5-15 minutes)
- [ ] Verify: `nslookup omni.valtara.ai`

### SSL Certificate (After DNS)

- [ ] SSH to server
- [ ] Run: `certbot certificates`
- [ ] Verify certificate is valid
- [ ] Test: `https://omni.valtara.ai`

### Setup Monitoring (Optional)

- [ ] Configure webhook URL for alerts
- [ ] Set up email notifications
- [ ] Test health check: `/root/scripts/health-check.sh`

### Test Backups

- [ ] Create manual backup: `/root/scripts/backup.sh full`
- [ ] List backups: `ls -lh /var/backups/valt-omniagent/`
- [ ] Verify backup integrity

## 🎯 Daily Operations

### View Status
```bash
ssh -i ubuntu-ky.pem root@91.99.79.131 "pm2 status"
```

### View Logs
```bash
ssh -i ubuntu-ky.pem root@91.99.79.131 "pm2 logs valt-omniagent"
```

### Restart Application
```bash
ssh -i ubuntu-ky.pem root@91.99.79.131 "pm2 restart valt-omniagent"
```

### Deploy Updates
```bash
# Automated (recommended)
bash scripts/auto-deploy.sh

# Or just push to GitHub (if CI/CD is setup)
git push origin main
```

### Check Health
```bash
ssh -i ubuntu-ky.pem root@91.99.79.131 "/root/scripts/health-check.sh"
```

### Run Backup
```bash
ssh -i ubuntu-ky.pem root@91.99.79.131 "/root/scripts/backup.sh full"
```

### Rollback if Needed
```bash
ssh -i ubuntu-ky.pem root@91.99.79.131 "/root/scripts/rollback.sh latest"
```

## 🆘 Troubleshooting

### Application Not Starting
```bash
# Check PM2 logs
ssh -i ubuntu-ky.pem root@91.99.79.131 "pm2 logs valt-omniagent --err"

# Restart
ssh -i ubuntu-ky.pem root@91.99.79.131 "pm2 restart valt-omniagent"

# If still failing, rollback
ssh -i ubuntu-ky.pem root@91.99.79.131 "/root/scripts/rollback.sh"
```

### Cannot Connect to Server
```bash
# Test SSH
ssh -i ubuntu-ky.pem root@91.99.79.131 "echo 'test'"

# Check key permissions (Windows)
icacls ubuntu-ky.pem /inheritance:r
icacls ubuntu-ky.pem /grant:r "%USERNAME%:R"

# Check key permissions (Git Bash/Linux)
chmod 600 ubuntu-ky.pem
```

### DNS Not Resolving
```bash
# Check DNS propagation
nslookup omni.valtara.ai

# Or use online tool: https://www.whatsmydns.net/
```

### SSL Certificate Issues
```bash
# Check certificate
ssh -i ubuntu-ky.pem root@91.99.79.131 "certbot certificates"

# Renew certificate
ssh -i ubuntu-ky.pem root@91.99.79.131 "certbot renew --force-renewal"

# Reload nginx
ssh -i ubuntu-ky.pem root@91.99.79.131 "systemctl reload nginx"
```

## 📊 Monitoring Dashboards

### PM2 Monitoring
```bash
ssh -i ubuntu-ky.pem root@91.99.79.131 "pm2 monit"
```

### Health Status
```bash
ssh -i ubuntu-ky.pem root@91.99.79.131 "cat /tmp/valt-health-status"
ssh -i ubuntu-ky.pem root@91.99.79.131 "cat /tmp/valt-metrics.txt"
```

### Recent Backups
```bash
ssh -i ubuntu-ky.pem root@91.99.79.131 "ls -lht /var/backups/valt-omniagent/ | head -10"
```

### Cron Jobs
```bash
ssh -i ubuntu-ky.pem root@91.99.79.131 "crontab -l"
```

## 🎉 Success Indicators

Your deployment is successful when:

- ✅ `pm2 status` shows valt-omniagent as "online"
- ✅ `curl http://localhost:3000` returns 200 OK
- ✅ `https://omni.valtara.ai` loads in browser
- ✅ SSL certificate shows green padlock
- ✅ Health checks pass every 5 minutes
- ✅ Backups created daily
- ✅ GitHub Actions deploy successfully (if configured)

## 📞 Need Help?

- Review: `DEPLOYMENT.md` for detailed deployment guide
- Review: `CICD-DOCUMENTATION.md` for CI/CD details  
- Review: `DEPLOYMENT-WINDOWS.md` for Windows-specific help
- On server: `cat /root/OPERATIONS-README.md` for operations guide

---

**Server**: 91.99.79.131  
**Domain**: omni.valtara.ai  
**Application**: Valt OmniAgent  
**Status**: Ready for deployment 🚀
