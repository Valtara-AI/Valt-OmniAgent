# CI/CD Pipeline & Automation Documentation

## Overview

This document describes the complete CI/CD pipeline and automation infrastructure for Valt OmniAgent.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Development Workflow                     │
├─────────────────────────────────────────────────────────────┤
│  Local Dev → Git Push → GitHub Actions → Build → Deploy    │
│                           ↓                        ↓         │
│                      Run Tests              Upload to Server │
│                           ↓                        ↓         │
│                    TypeScript Check         Extract & Install│
│                           ↓                        ↓         │
│                      Build Check            PM2 Restart      │
│                           ↓                        ↓         │
│                    ✓ Pass / ✗ Fail         Health Check     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   Server Infrastructure                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Health     │  │    Backup    │  │  Security    │     │
│  │   Checks     │  │   System     │  │  Hardening   │     │
│  │  (5 mins)    │  │  (Daily)     │  │  (fail2ban)  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │     PM2      │  │    Nginx     │  │     SSL      │     │
│  │  Process     │  │   Reverse    │  │  Let's       │     │
│  │  Manager     │  │    Proxy     │  │  Encrypt     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Components

### 1. GitHub Actions Workflow

**File**: `.github/workflows/deploy.yml`

**Triggers**:
- Push to `main` or `master` branch
- Manual workflow dispatch

**Jobs**:

#### Job 1: Test
- Checkout code
- Install dependencies
- Run TypeScript check
- Run linter
- Build application
- Upload build artifact

#### Job 2: Deploy
- Download build artifact
- Setup SSH connection
- Create deployment archive
- Upload to server
- Extract and install on server
- Restart PM2
- Run health check
- Rollback on failure

#### Job 3: Backup (Scheduled)
- Runs daily
- Creates server backups
- Verifies backup integrity

### 2. Deployment Scripts

#### `auto-deploy.sh`
**Purpose**: Automated deployment with safety checks

**Features**:
- Pre-deployment checks
- Automated testing
- Build verification
- Archive creation
- Upload to server
- Server-side deployment
- Health checks
- Automatic rollback on failure

**Usage**:
```bash
# Standard deployment
bash scripts/auto-deploy.sh

# Skip tests (faster, but risky)
bash scripts/auto-deploy.sh --skip-tests

# Force deploy without prompts
bash scripts/auto-deploy.sh --force
```

**Flow**:
1. Check prerequisites (SSH key, Node.js, npm)
2. Test SSH connection
3. Run TypeScript check
4. Run linter
5. Build application
6. Create deployment archive
7. Upload to server
8. Deploy on server (with backup)
9. Health check
10. Rollback if health check fails

#### `backup.sh`
**Purpose**: Create comprehensive backups

**Backup Types**:
- `full` - Complete backup (application, config, SSL, logs, PM2)
- `quick` - Essential backup (application, config)
- `application` - Application files only
- `config` - Configuration files only
- `ssl` - SSL certificates only
- `logs` - Log files only
- `pm2` - PM2 configuration only

**Features**:
- Checksums for integrity verification
- Automatic cleanup of old backups (30-day retention)
- Optional S3 upload
- Webhook notifications

**Usage**:
```bash
# Full backup (recommended)
/root/scripts/backup.sh full

# Quick backup
/root/scripts/backup.sh quick

# Specific component
/root/scripts/backup.sh application
```

**Scheduled Backups**:
- Full backup: Daily at 2:00 AM
- Quick backup: Every 6 hours

#### `restore.sh`
**Purpose**: Restore from backup

**Features**:
- List available backups
- Verify backup integrity
- Checksum verification
- Pre-restore backup creation
- Service management (stop/start)
- Post-restore health check

**Usage**:
```bash
# List available backups
/root/scripts/restore.sh list

# Restore latest full backup
/root/scripts/restore.sh latest

# Restore specific backup
/root/scripts/restore.sh valt-omniagent_full_20241012_120000.tar.gz
```

**Safety Features**:
- Creates backup before restoring
- Confirmation prompt
- Automatic health check after restore
- Clear rollback instructions if restore fails

#### `rollback.sh`
**Purpose**: Quick rollback to previous deployment

**Features**:
- List available versions
- Quick rollback mechanism
- Pre-rollback backup
- Automatic service restart
- Health verification

**Usage**:
```bash
# Interactive rollback
/root/scripts/rollback.sh

# Rollback to latest version
/root/scripts/rollback.sh latest

# Rollback to specific version
/root/scripts/rollback.sh 2
```

**When to Use**:
- Deployment caused issues
- Application not responding after update
- Need to quickly revert changes
- Testing previous versions

#### `health-check.sh`
**Purpose**: Monitor application health and auto-recover

**Checks**:
- PM2 process status
- Application response (localhost:3000)
- External URL accessibility (https://omni.valtara.ai)
- SSL certificate expiration
- Disk space usage
- Memory usage
- CPU usage
- Log file sizes
- Error rate in logs

**Features**:
- Automatic restart on failure
- Alert notifications (webhook/email)
- Status tracking
- Metrics generation
- Auto-recovery

**Usage**:
```bash
# Manual health check
/root/scripts/health-check.sh

# View current status
cat /tmp/valt-health-status

# View metrics
cat /tmp/valt-metrics.txt
```

**Scheduled Checks**:
- Every 5 minutes via cron

**Auto-Recovery**:
- Attempts PM2 restart if issues detected
- Sends alerts on failure
- Tracks state changes (healthy ↔ unhealthy)
- Logs all actions

### 3. Server Setup

#### `setup-cicd.sh`
**Purpose**: One-time CI/CD infrastructure setup

**Installs**:
- Script files in `/root/scripts/`
- Cron jobs for automation
- Log rotation configuration
- fail2ban for SSH protection
- Unattended security updates
- PM2 log rotation
- Firewall rules

**Configurations**:

**Cron Jobs**:
```
*/5 * * * * /root/scripts/health-check.sh        # Health checks
0 2 * * * /root/scripts/backup.sh full           # Daily full backup
0 */6 * * * /root/scripts/backup.sh quick        # 6-hourly quick backup
0 3 * * 0 certbot renew --quiet                  # Weekly SSL renewal
0 4 * * * find /var/www/valt-omniagent/logs -name "*.log" -mtime +30 -delete  # Log cleanup
0 3 * * 0 pm2 restart valt-omniagent            # Weekly PM2 restart
```

**Usage**:
```bash
# Run once on server
bash /var/www/valt-omniagent/scripts/setup-cicd.sh
```

## Deployment Workflow

### Manual Deployment

1. **From Local Machine**:
```bash
cd /path/to/valt-omniagent
bash scripts/auto-deploy.sh
```

2. **Process**:
- Script runs tests locally
- Builds application
- Creates archive
- Uploads to server
- Deploys on server
- Verifies health
- Reports status

### Automated Deployment (GitHub Actions)

1. **Trigger**:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

2. **Process**:
- GitHub Actions workflow starts
- Runs tests in CI environment
- Builds application
- Uploads build artifact
- Deploys to server
- Runs health check
- Sends notification

### Emergency Rollback

If deployment fails:

```bash
# Option 1: From local machine
ssh -i ubuntu-ky.pem root@91.99.79.131 "/root/scripts/rollback.sh latest"

# Option 2: On server
/root/scripts/rollback.sh latest
```

## Backup & Recovery

### Backup Strategy

**Full Backup** (Daily at 2:00 AM):
- Application code (.next, public)
- Configuration files (nginx, env)
- SSL certificates
- PM2 configuration
- Logs

**Quick Backup** (Every 6 hours):
- Application code
- Configuration files

**Deployment Backup** (Before each deploy):
- Current application state
- Retained for quick rollback

**Retention Policy**:
- Daily backups: 30 days
- Deployment backups: Last 10 versions
- Logs: 14 days (compressed after 1 day)

### Recovery Scenarios

#### Scenario 1: Bad Deployment
```bash
# Automatic: Health check fails → auto-rollback
# Manual: 
/root/scripts/rollback.sh latest
```

#### Scenario 2: Data Corruption
```bash
# List backups
/root/scripts/restore.sh list

# Restore from specific backup
/root/scripts/restore.sh valt-omniagent_full_20241012_020000.tar.gz
```

#### Scenario 3: Server Failure
```bash
# On new server:
1. Run server-setup.sh
2. Run setup-cicd.sh
3. Copy backups from /var/backups/valt-omniagent (or S3)
4. Run restore.sh
```

## Monitoring

### Health Monitoring

**Automated Checks** (Every 5 minutes):
- PM2 process running
- Application responding
- External URL accessible
- SSL certificate validity
- Disk space < 90%
- Memory usage < 90%
- CPU usage < 90%
- Error rates in logs

**Alerts**:
- Webhook notifications (if configured)
- Email alerts (if configured)
- Log entries

**Auto-Recovery**:
- Restart PM2 on failure
- Alert on persistent issues

### Manual Monitoring

```bash
# Check application status
pm2 status
pm2 monit

# View logs
pm2 logs valt-omniagent
pm2 logs valt-omniagent --err

# Check health status
cat /tmp/valt-health-status
cat /tmp/valt-metrics.txt
tail -f /var/log/valt-health-check.log

# Check recent backups
ls -lht /var/backups/valt-omniagent/ | head -10

# Check cron jobs
crontab -l
```

## Security

### Implemented Measures

1. **fail2ban**:
   - Blocks repeated SSH login failures
   - Protects Nginx from attacks
   - 1-hour ban after 3 failed attempts

2. **Firewall (UFW)**:
   - Only ports 22, 80, 443 open
   - All other traffic blocked

3. **Automatic Updates**:
   - Security patches applied automatically
   - System stability maintained

4. **SSL/TLS**:
   - Let's Encrypt certificates
   - Auto-renewal every 90 days
   - A+ SSL rating configuration

5. **Access Control**:
   - SSH key authentication only
   - No password authentication
   - Root access only via key

### Security Monitoring

```bash
# Check failed login attempts
fail2ban-client status sshd

# View firewall status
ufw status verbose

# Check SSL certificate
certbot certificates

# View security logs
tail -f /var/log/auth.log
```

## GitHub Actions Setup

### Required Secrets

Add these to your GitHub repository settings (Settings → Secrets and variables → Actions):

1. **`SSH_PRIVATE_KEY`**:
   - Content of `ubuntu-ky.pem`
   - Used for SSH authentication

2. **`SERVER_IP`**:
   - Value: `91.99.79.131`
   - Server IP address

3. **`WEBHOOK_URL`** (Optional):
   - Slack/Discord/Teams webhook URL
   - For deployment notifications

4. **`S3_BACKUP_BUCKET`** (Optional):
   - S3 bucket name for backups
   - Requires AWS credentials configured

### Setup Steps

1. **Add SSH Key to GitHub**:
```bash
# Copy content of ubuntu-ky.pem
cat ubuntu-ky.pem | clip  # Windows
cat ubuntu-ky.pem | pbcopy  # Mac
cat ubuntu-ky.pem  # Linux (manual copy)

# Go to GitHub repo → Settings → Secrets → New repository secret
# Name: SSH_PRIVATE_KEY
# Value: Paste the key content
```

2. **Add Server IP**:
```
Name: SERVER_IP
Value: 91.99.79.131
```

3. **Enable Workflow**:
```bash
git add .github/workflows/deploy.yml
git commit -m "Add CI/CD workflow"
git push origin main
```

4. **Test Workflow**:
- Go to Actions tab in GitHub
- Click on latest workflow run
- Verify all steps complete successfully

## Troubleshooting

### Deployment Failures

**Issue**: Build fails locally
```bash
# Check TypeScript errors
npx tsc --noEmit

# Check linting
npm run lint

# Try clean build
rm -rf .next node_modules
npm install
npm run build
```

**Issue**: SSH connection fails
```bash
# Test SSH
ssh -i ubuntu-ky.pem root@91.99.79.131 "echo 'Connected'"

# Check key permissions
chmod 600 ubuntu-ky.pem

# Check server is accessible
ping 91.99.79.131
```

**Issue**: Health check fails after deployment
```bash
# Check PM2 status
ssh -i ubuntu-ky.pem root@91.99.79.131 "pm2 status"

# Check logs
ssh -i ubuntu-ky.pem root@91.99.79.131 "pm2 logs valt-omniagent --lines 50 --err"

# Rollback
ssh -i ubuntu-ky.pem root@91.99.79.131 "/root/scripts/rollback.sh latest"
```

### Backup/Restore Issues

**Issue**: Backup fails
```bash
# Check disk space
df -h

# Check permissions
ls -la /var/backups/valt-omniagent/

# Manual backup
cd /var/www/valt-omniagent
tar -czf /tmp/manual-backup.tar.gz .next package.json
```

**Issue**: Restore fails
```bash
# Verify backup integrity
tar -tzf backup_file.tar.gz

# Check backup location
ls -lh /var/backups/valt-omniagent/

# Try specific component restore
/root/scripts/restore.sh valt-omniagent_application_*.tar.gz
```

### Performance Issues

**Issue**: High memory usage
```bash
# Restart PM2
pm2 restart valt-omniagent

# Check memory
free -h
pm2 status

# Increase memory limit in ecosystem.config.js
max_memory_restart: '2G'
```

**Issue**: High disk usage
```bash
# Check disk usage
df -h
du -sh /var/www/valt-omniagent/*

# Clean old backups
find /var/backups/valt-omniagent -name "*.tar.gz" -mtime +30 -delete

# Clean logs
pm2 flush
find /var/www/valt-omniagent/logs -name "*.log" -mtime +7 -delete

# Clean npm cache
npm cache clean --force
```

## Best Practices

### Development

1. **Always test locally before pushing**:
```bash
npm run build
npm run start  # Test production build
```

2. **Use feature branches**:
```bash
git checkout -b feature/new-feature
# Make changes
git push origin feature/new-feature
# Create PR, don't push to main directly
```

3. **Write meaningful commit messages**:
```bash
git commit -m "feat: Add user authentication
git commit -m "fix: Resolve memory leak in dashboard"
git commit -m "docs: Update deployment guide"
```

### Deployment

1. **Deploy during low-traffic periods**
2. **Monitor logs after deployment**
3. **Keep rollback ready**
4. **Test in staging first (if available)**
5. **Communicate deployments to team**

### Maintenance

1. **Weekly Tasks**:
   - Review logs for errors
   - Check disk space
   - Verify backups are running

2. **Monthly Tasks**:
   - Review backup retention
   - Update dependencies
   - Security audit
   - Performance review

3. **Quarterly Tasks**:
   - Disaster recovery drill
   - Documentation review
   - Capacity planning

## Contact & Support

**Development Team**: [Add contact info]
**System Administrator**: [Add contact info]
**Emergency Contact**: [Add 24/7 contact]

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Operations Guide](/root/OPERATIONS-README.md)
