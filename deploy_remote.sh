#!/usr/bin/env bash
set -euo pipefail

echo "===> Checking node..."
if ! command -v node >/dev/null 2>&1; then
  echo "Node not found, installing Node 20.x"
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get update
  apt-get install -y nodejs build-essential
else
  echo "Node present: $(node --version)"
fi

echo "===> Installing/ensuring pm2..."
if ! command -v pm2 >/dev/null 2>&1; then
  npm install -g pm2
else
  echo "pm2 present: $(pm2 --version)"
fi

echo "===> Preparing deploy directory"
mkdir -p /var/www/valt-omniagent
cd /var/www/valt-omniagent
if [ -d current ]; then mv current current.$(date +%s); fi

echo "===> Extracting archive"
if [ -f /tmp/deploy.tar.gz ]; then
  tar -xzf /tmp/deploy.tar.gz -C /var/www/valt-omniagent
else
  echo "ERROR: /tmp/deploy.tar.gz not found" >&2
  exit 2
fi

echo "===> Installing production deps"
# Ensure npm exists
if ! command -v npm >/dev/null 2>&1; then
  echo "ERROR: npm not found after install" >&2
  exit 3
fi
npm ci --production || npm install --production

echo "===> Starting app with PM2"
pm2 startOrRestart ecosystem.config.js --env production || pm2 start ecosystem.config.js --env production
pm2 save

# Enable nginx config if present
if [ -f /tmp/nginx.conf ]; then
  echo "===> Installing nginx config"
  mv /tmp/nginx.conf /etc/nginx/sites-available/omni.valtara.ai || true
fi
ln -sf /etc/nginx/sites-available/omni.valtara.ai /etc/nginx/sites-enabled/omni.valtara.ai || true
nginx -t 2>/dev/null || true
systemctl reload nginx 2>/dev/null || service nginx reload 2>/dev/null || true

echo "===> Running health-check if available"
if [ -x /root/scripts/health-check.sh ]; then
  /root/scripts/health-check.sh || echo "health-check returned non-zero"
else
  echo "No health-check script found"
fi

echo "===> Deploy script finished"
