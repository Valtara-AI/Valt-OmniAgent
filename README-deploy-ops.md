Deployment & Operations - Quick Reference

This file contains the exact commands used during the automated deployment and where to find logs and artifacts on the server.

1) Files uploaded to server
- /tmp/deploy.tar.gz  (deployment archive)
- /tmp/nginx.conf
- /root/scripts/*     (deployment, backup, restore, health-check scripts)

2) Extraction & deploy commands (what we ran remotely)
- Extract & install:
  mkdir -p /var/www/valt-omniagent
  cd /var/www/valt-omniagent
  tar -xzf /tmp/deploy.tar.gz -C /var/www/valt-omniagent
  npm ci --production

- Start with PM2:
  pm2 startOrRestart ecosystem.config.js --env production
  pm2 save
  pm2 startup systemd -u root --hp /root

- Nginx (site file):
  mv /tmp/nginx.conf /etc/nginx/sites-available/omni.valtara.ai
  ln -sf /etc/nginx/sites-available/omni.valtara.ai /etc/nginx/sites-enabled/omni.valtara.ai
  nginx -t && systemctl reload nginx || service nginx reload

3) Health check & monitoring
- Health-check script location: /root/scripts/health-check.sh
- How to run manually:
  /root/scripts/health-check.sh
- PM2 logs:
  pm2 logs valt-omniagent --lines 200 --nostream
- Nginx logs:
  tail -n 200 /var/log/nginx/error.log /var/log/nginx/access.log

4) SSL (Let's Encrypt) — run after DNS A record points to the server
- Example certbot command (non-interactive):
  certbot --nginx -d omni.valtara.ai -d www.omni.valtara.ai --non-interactive --agree-tos -m your-email@example.com
- After certbot completes, verify:
  curl -I https://omni.valtara.ai

5) Rollback
- Quick rollback using the included rollback script:
  /root/scripts/rollback.sh latest

6) Notes & recommendations
- The application authentication endpoints are placeholders; secure auth before opening to users.
- Do not commit `ubuntu-ky.pem` or any `.env` that contains secrets. Use `.env.example` as template and store secrets in GitHub Actions secrets or the server's environment.
- Add the `SSH_PRIVATE_KEY` as a GitHub secret (`SSH_PRIVATE_KEY`) if you want CI-driven deploys via the workflow in `.github/workflows/deploy.yml`.

If you want, I can add a small system check script that verifies PM2 and nginx are healthy and prints diagnostics.
