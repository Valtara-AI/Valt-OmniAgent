# MANUAL DEPLOYMENT STEPS - QUICK FIX

## Current Issue
The app directory on server is missing source files (`src` folder), causing build failures.

## Solution: Deploy Full App

### Step 1: Build Locally (on your Windows machine)
```powershell
npm ci
npm run build
```

### Step 2: Package the Build
```powershell
tar -czf deploy.tar.gz .next public src package.json package-lock.json next.config.js ecosystem.config.js
```

If tar doesn't work, use:
```powershell
# Create archive with 7-Zip or WinRAR including:
# - .next folder
# - public folder
# - src folder  
# - package.json
# - package-lock.json
# - next.config.js
# - ecosystem.config.js
```

### Step 3: Upload to Server
```powershell
scp -i ubuntu-ky.pem deploy.tar.gz root@91.99.79.131:/var/www/valt-omniagent/
```

### Step 4: Extract and Start on Server
```powershell
ssh -i ubuntu-ky.pem root@91.99.79.131
cd /var/www/valt-omniagent
tar -xzf deploy.tar.gz
rm deploy.tar.gz
npm ci --production
pm2 delete valt-omniagent
pm2 start ecosystem.config.js
pm2 save
pm2 list
```

### Step 5: Fix Nginx
```bash
# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Test and reload
nginx -t
systemctl reload nginx
```

### Step 6: Test
```bash
# On server
curl http://127.0.0.1:3000

# From local machine
curl http://91.99.79.131
curl https://omni.valtara.ai
```

## OR Use Automated Script

Run this complete command:
```powershell
npm ci; npm run build; tar -czf deploy.tar.gz .next public src package.json package-lock.json next.config.js ecosystem.config.js; scp -i ubuntu-ky.pem deploy.tar.gz root@91.99.79.131:/var/www/valt-omniagent/; ssh -i ubuntu-ky.pem root@91.99.79.131 "cd /var/www/valt-omniagent && tar -xzf deploy.tar.gz && rm deploy.tar.gz && npm ci --production && pm2 delete valt-omniagent; pm2 start ecosystem.config.js && pm2 save && pm2 list"; Remove-Item deploy.tar.gz
```

## Expected Final Result

```
pm2 list → valt-omniagent | online
netstat :3000 → LISTENING
curl http://omni.valtara.ai → 200 OK
curl https://omni.valtara.ai → 200 OK (with SSL)
```
