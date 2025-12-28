#!/usr/bin/env bash
set -euo pipefail

echo "==> certbot version"
if command -v certbot >/dev/null 2>&1; then
  certbot --version || true
else
  echo "certbot: not installed"
fi

echo
echo "==> certbot certificates (if any)"
if command -v certbot >/dev/null 2>&1; then
  certbot certificates || true
else
  echo "no certbot binary"
fi

echo
echo "==> systemd timers for certbot"
if command -v systemctl >/dev/null 2>&1; then
  systemctl list-timers --all | grep -i certbot || true
else
  echo "systemctl not present"
fi

echo
echo "==> cron entries referencing certbot"
grep -R "certbot" /etc/cron.* 2>/dev/null || echo "no cron certbot entries"

echo
echo "==> Running /root/scripts/health-check.sh"
if [ -x /root/scripts/health-check.sh ]; then
  /root/scripts/health-check.sh || echo "health-check exit:$?"
else
  echo "health-check script not found or not executable"
fi
