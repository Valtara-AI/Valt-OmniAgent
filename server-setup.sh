#!/bin/bash

# Server Setup Script for Valt OmniAgent
# Run this on the server: 91.99.79.131

set -e

echo "🔧 Setting up server for Valt OmniAgent..."

# Update system
echo "📦 Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js 20.x (LTS)
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt-get install -y nginx

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/valt-omniagent
sudo mkdir -p /var/www/valt-omniagent/logs
sudo chown -R $USER:$USER /var/www/valt-omniagent

# Copy nginx configuration
echo "🔧 Setting up Nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/omni.valtara.ai
sudo ln -sf /etc/nginx/sites-available/omni.valtara.ai /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Install Certbot for SSL
echo "🔒 Installing Certbot for SSL..."
sudo apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate
echo "🔒 Getting SSL certificate..."
sudo certbot --nginx -d omni.valtara.ai -d www.omni.valtara.ai --non-interactive --agree-tos --email admin@valtara.ai

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Reload nginx
sudo systemctl reload nginx

# Enable PM2 to start on boot
pm2 startup systemd -u $USER --hp /home/$USER
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER

echo "✅ Server setup complete!"
echo ""
echo "Next steps:"
echo "1. Upload your application files to /var/www/valt-omniagent"
echo "2. Run: cd /var/www/valt-omniagent && npm ci"
echo "3. Run: pm2 start ecosystem.config.js"
echo "4. Run: pm2 save"
echo ""
echo "🌐 Your site will be available at: https://omni.valtara.ai"
