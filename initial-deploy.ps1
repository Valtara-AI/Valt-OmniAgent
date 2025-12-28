# Valt OmniAgent - Windows PowerShell Deployment Script

$ErrorActionPreference = "Stop"

# Configuration
$SERVER_IP = "91.99.79.131"
$SERVER_USER = "root"
$SSH_KEY = "ubuntu-ky.pem"
$DOMAIN = "omni.valtara.ai"

function Write-ColoredOutput {
    param(
        [string]$Message,
        [string]$Color = "White",
        [string]$Prefix = ""
    )
    
    $timestamp = Get-Date -Format "HH:mm:ss"
    if ($Prefix) {
        Write-Host "[$timestamp] $Prefix " -NoNewline -ForegroundColor $Color
        Write-Host $Message
    } else {
        Write-Host "[$timestamp] $Message" -ForegroundColor $Color
    }
}

function Write-Success {
    param([string]$Message)
    Write-ColoredOutput -Message $Message -Color "Green" -Prefix "✓"
}

function Write-Error-Custom {
    param([string]$Message)
    Write-ColoredOutput -Message $Message -Color "Red" -Prefix "✗"
}

function Write-Warning-Custom {
    param([string]$Message)
    Write-ColoredOutput -Message $Message -Color "Yellow" -Prefix "⚠"
}

function Write-Info {
    param([string]$Message)
    Write-ColoredOutput -Message $Message -Color "Cyan"
}

# Header
Clear-Host
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "║        Valt OmniAgent - Initial Production Deployment     ║" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "Target Server: $SERVER_USER@$SERVER_IP"
Write-Host "Domain: $DOMAIN"
Write-Host "SSH Key: $SSH_KEY"
Write-Host ""

$confirm = Read-Host "Press Enter to continue or Ctrl+C to cancel"

# Step 1: Verify prerequisites
Write-Info "Step 1/7: Verifying prerequisites..."

if (-not (Test-Path $SSH_KEY)) {
    Write-Error-Custom "SSH key not found: $SSH_KEY"
    exit 1
}

# Set SSH key permissions (Windows)
icacls $SSH_KEY /inheritance:r | Out-Null
icacls $SSH_KEY /grant:r "$($env:USERNAME):R" | Out-Null
Write-Success "SSH key found and permissions set"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error-Custom "Node.js is not installed"
    exit 1
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error-Custom "npm is not installed"
    exit 1
}

Write-Success "Prerequisites verified"
Write-Host ""

# Step 2: Test server connectivity
Write-Info "Step 2/7: Testing server connectivity..."

$pingResult = Test-Connection -ComputerName $SERVER_IP -Count 1 -Quiet -ErrorAction SilentlyContinue
if ($pingResult) {
    Write-Success "Server is reachable"
} else {
    Write-Warning-Custom "Cannot ping server (this may be normal if ICMP is blocked)"
}

# Test SSH connection
try {
    $sshTest = ssh -i $SSH_KEY -o StrictHostKeyChecking=no -o ConnectTimeout=10 "$SERVER_USER@$SERVER_IP" "echo 'SSH connection successful'" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Success "SSH connection established"
    } else {
        throw "SSH connection failed"
    }
} catch {
    Write-Error-Custom "Cannot connect via SSH"
    Write-Host "Please check:"
    Write-Host "  - SSH key has correct permissions"
    Write-Host "  - Server allows SSH connections on port 22"
    Write-Host "  - SSH key is authorized on the server"
    Write-Host "  - OpenSSH Client is installed (Windows 10 1809+ feature)"
    exit 1
}
Write-Host ""

# Step 3: Build application locally
Write-Info "Step 3/7: Building application locally..."

Write-Info "Installing dependencies..."
npm ci
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "Failed to install dependencies"
    exit 1
}
Write-Success "Dependencies installed"

Write-Info "Building application..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "Build failed"
    exit 1
}
Write-Success "Application built successfully"
Write-Host ""

# Step 4: Upload server setup files
Write-Info "Step 4/7: Uploading server setup files..."

# Upload individual files
scp -i $SSH_KEY -o StrictHostKeyChecking=no server-setup.sh "$SERVER_USER@$SERVER_IP`:/tmp/" 2>&1 | Out-Null
scp -i $SSH_KEY -o StrictHostKeyChecking=no nginx.conf "$SERVER_USER@$SERVER_IP`:/tmp/" 2>&1 | Out-Null

if (Test-Path "scripts") {
    scp -i $SSH_KEY -o StrictHostKeyChecking=no -r scripts "$SERVER_USER@$SERVER_IP`:/tmp/" 2>&1 | Out-Null
}

Write-Success "Setup files uploaded"
Write-Host ""

# Step 5: Run server setup
Write-Info "Step 5/7: Running server setup (this may take 5-10 minutes)..."

$setupScript = @'
set -e
cd /tmp

# Make scripts executable
chmod +x server-setup.sh
chmod +x scripts/*.sh 2>/dev/null || true

# Run server setup
if ./server-setup.sh; then
    echo "Server setup completed"
else
    echo "Server setup failed"
    exit 1
fi
'@

ssh -i $SSH_KEY -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" $setupScript

if ($LASTEXITCODE -eq 0) {
    Write-Success "Server setup completed"
} else {
    Write-Error-Custom "Server setup failed"
    exit 1
}
Write-Host ""

# Step 6: Deploy application
Write-Info "Step 6/7: Deploying application..."

# Create deployment archive using tar (Windows 10 1803+ has tar)
Write-Info "Creating deployment archive..."
$filesToArchive = @(
    ".next",
    "public",
    "package.json",
    "package-lock.json",
    "next.config.js",
    "ecosystem.config.js"
)

# Add env files if they exist
if (Test-Path ".env.local") { $filesToArchive += ".env.local" }
if (Test-Path ".env.production") { $filesToArchive += ".env.production" }

tar -czf deploy.tar.gz $filesToArchive 2>&1 | Out-Null
Write-Success "Deployment archive created"

# Upload deployment archive
Write-Info "Uploading application..."
scp -i $SSH_KEY deploy.tar.gz "$SERVER_USER@$SERVER_IP`:/var/www/valt-omniagent/" 2>&1 | Out-Null
Write-Success "Application uploaded"

# Deploy on server
$deployScript = @'
set -e
cd /var/www/valt-omniagent

echo "Extracting application..."
tar -xzf deploy.tar.gz

echo "Installing dependencies..."
npm ci --production --silent

echo "Starting application with PM2..."
pm2 start ecosystem.config.js
pm2 save

# Clean up
rm -f deploy.tar.gz

echo "Application deployed"
'@

ssh -i $SSH_KEY "$SERVER_USER@$SERVER_IP" $deployScript

if ($LASTEXITCODE -eq 0) {
    Write-Success "Application deployed"
} else {
    Write-Error-Custom "Deployment failed"
    Remove-Item deploy.tar.gz -ErrorAction SilentlyContinue
    exit 1
}

Remove-Item deploy.tar.gz -ErrorAction SilentlyContinue
Write-Host ""

# Step 7: Setup CI/CD infrastructure
Write-Info "Step 7/7: Setting up CI/CD infrastructure..."

$cicdScript = @'
set -e

if [ -f "/tmp/scripts/setup-cicd.sh" ]; then
    mkdir -p /root/scripts
    cp /tmp/scripts/*.sh /root/scripts/ 2>/dev/null || true
    chmod +x /root/scripts/*.sh
    
    cd /root/scripts
    ./setup-cicd.sh
    
    echo "CI/CD infrastructure configured"
else
    echo "CI/CD setup script not found, skipping..."
fi
'@

ssh -i $SSH_KEY "$SERVER_USER@$SERVER_IP" $cicdScript

if ($LASTEXITCODE -eq 0) {
    Write-Success "CI/CD infrastructure configured"
} else {
    Write-Warning-Custom "CI/CD setup had issues (non-fatal)"
}
Write-Host ""

# Health check
Write-Info "Running health check..."
Start-Sleep -Seconds 10

# Check PM2 status
$pm2Check = ssh -i $SSH_KEY "$SERVER_USER@$SERVER_IP" "pm2 list | grep -q 'valt-omniagent.*online' && echo 'running' || echo 'not running'"
if ($pm2Check -match "running") {
    Write-Success "PM2 process is running"
} else {
    Write-Error-Custom "PM2 process is not running"
    exit 1
}

# Check local response
$responseCode = ssh -i $SSH_KEY "$SERVER_USER@$SERVER_IP" "curl -s -o /dev/null -w '%{http_code}' http://localhost:3000"

if ($responseCode -in @("200", "301", "302")) {
    Write-Success "Application is responding (HTTP $responseCode)"
} else {
    Write-Error-Custom "Application is not responding (HTTP $responseCode)"
    Write-Host "Check logs with: ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 logs valt-omniagent'"
    exit 1
}

# Summary
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "║              Deployment Successful! 🎉                    ║" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Important Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Configure DNS:" -ForegroundColor Green
Write-Host ("   - Point A record for " + $DOMAIN + " to " + $SERVER_IP)
Write-Host ("   - Point A record for www." + $DOMAIN + " to " + $SERVER_IP)
Write-Host ""
Write-Host "2. Verify SSL Certificate:" -ForegroundColor Green
Write-Host "   - Wait for DNS propagation 5-15 minutes"
Write-Host "   - SSH to server and run certbot certificates"
Write-Host ""
Write-Host "3. Set up GitHub Actions (Optional):" -ForegroundColor Green
Write-Host "   - Add SSH_PRIVATE_KEY secret to GitHub repository"
Write-Host ("   - Add SERVER_IP secret: " + $SERVER_IP)
Write-Host "   - Push .github/workflows/deploy.yml to enable CI/CD"
Write-Host ""
Write-Host "Quick Commands:" -ForegroundColor Yellow
Write-Host ""
Write-Host ("  View logs:    ssh -i " + $SSH_KEY + " " + $SERVER_USER + "@" + $SERVER_IP + " 'pm2 logs valt-omniagent'")
Write-Host ("  Check status: ssh -i " + $SSH_KEY + " " + $SERVER_USER + "@" + $SERVER_IP + " 'pm2 status'")
Write-Host ("  Restart app:  ssh -i " + $SSH_KEY + " " + $SERVER_USER + "@" + $SERVER_IP + " 'pm2 restart valt-omniagent'")
Write-Host ("  Run backup:   ssh -i " + $SSH_KEY + " " + $SERVER_USER + "@" + $SERVER_IP + " '/root/scripts/backup.sh full'")
Write-Host ""
Write-Host "Access Points:" -ForegroundColor Yellow
Write-Host ""
Write-Host ("  Application: http://" + $SERVER_IP + " (working now)")
Write-Host ("  Domain:      https://" + $DOMAIN + " (after DNS + SSL setup)")
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Deployment:  DEPLOYMENT.md"
Write-Host "  CI/CD:       CICD-DOCUMENTATION.md"
Write-Host "  Windows:     DEPLOYMENT-WINDOWS.md"
Write-Host ""
Write-Host ("Deployment completed at: " + (Get-Date)) -ForegroundColor Green
Write-Host ""

$null = Read-Host "Press Enter to exit"
