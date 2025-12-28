#!/usr/bin/env bash
set -euo pipefail

echo "===> Installing nginx if missing"
if ! command -v nginx >/dev/null 2>&1; then
  apt-get update
  apt-get install -y nginx
else
  nginx -v
fi

mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled
if [ -f /tmp/nginx.conf ]; then
  mv /tmp/nginx.conf /etc/nginx/sites-available/omni.valtara.ai
fi
ln -sf /etc/nginx/sites-available/omni.valtara.ai /etc/nginx/sites-enabled/omni.valtara.ai
nginx -t || true
systemctl enable --now nginx || service nginx restart || true

chmod +x /root/scripts/*.sh || true
if [ -x /root/scripts/health-check.sh ]; then
  /root/scripts/health-check.sh || echo "health-check returned non-zero"
else
  echo "No health-check script found"
fi

pm2 startup systemd -u root --hp /root || true
pm2 save || true

echo "===> Done"
