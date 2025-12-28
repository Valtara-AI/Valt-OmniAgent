#!/bin/bash

# Deployment script for Valt OmniAgent
# Server: 91.99.79.131
# Domain: omni.valtara.ai

set -e

echo "🚀 Starting deployment to omni.valtara.ai..."

# Configuration
SERVER_USER="root"
SERVER_IP="91.99.79.131"
SERVER_PATH="/var/www/valt-omniagent"
DOMAIN="omni.valtara.ai"

# Build locally
echo "📦 Building production bundle..."
npm ci
npm run build

# Create deployment package
echo "📁 Creating deployment package..."
tar -czf deploy.tar.gz \
  .next \
  public \
  package.json \
  package-lock.json \
  next.config.js \
  ecosystem.config.js \
  --exclude=node_modules

# Upload to server
echo "⬆️  Uploading to server..."
scp -i ubuntu-ky.pem deploy.tar.gz ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/

# Deploy on server
echo "🔧 Deploying on server..."
ssh -i ubuntu-ky.pem ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
cd /var/www/valt-omniagent

# Extract files
tar -xzf deploy.tar.gz
rm deploy.tar.gz

# Install production dependencies
npm ci --production

# Restart application
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

echo "✅ Deployment complete!"
ENDSSH

# Cleanup
rm deploy.tar.gz

echo "🎉 Deployment to ${DOMAIN} successful!"
echo "🌐 Visit: https://${DOMAIN}"
