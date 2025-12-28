# ==============================================================================
# VALT OMNIAGENT - WINDOWS DEPLOYMENT SCRIPT
# ==============================================================================
# Run this from your local Windows machine to deploy to the server
# ==============================================================================

param(
    [string]$ServerIP = "91.99.79.131",
    [string]$ServerUser = "root",
    [string]$KeyFile = "ubuntu-ky.pem",
    [string]$AppPath = "/var/www/valt-omniagent"
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  VALT OMNIAGENT - FULL DEPLOYMENT TO omni.valtara.ai" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Check for SSH key
if (-not (Test-Path $KeyFile)) {
    Write-Host "[!] SSH key file not found: $KeyFile" -ForegroundColor Yellow
    Write-Host "    Please ensure the key file is in the current directory" -ForegroundColor Yellow
    
    # Try common locations
    $possiblePaths = @(
        ".\ubuntu-ky.pem",
        "$env:USERPROFILE\.ssh\ubuntu-ky.pem",
        "$env:USERPROFILE\ubuntu-ky.pem"
    )
    
    foreach ($path in $possiblePaths) {
        if (Test-Path $path) {
            $KeyFile = $path
            Write-Host "[OK] Found key at: $KeyFile" -ForegroundColor Green
            break
        }
    }
    
    if (-not (Test-Path $KeyFile)) {
        Write-Host ""
        Write-Host "Please provide the path to your SSH key:" -ForegroundColor Yellow
        $KeyFile = Read-Host "Key file path"
        
        if (-not (Test-Path $KeyFile)) {
            Write-Host "[X] Key file not found. Exiting." -ForegroundColor Red
            exit 1
        }
    }
}

Write-Host "[OK] Using SSH key: $KeyFile" -ForegroundColor Green

# Step 1: Build locally
Write-Host ""
Write-Host "[1/5] Building production bundle..." -ForegroundColor Cyan

# Check if npm is available
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "[X] npm not found. Please install Node.js" -ForegroundColor Red
    exit 1
}

# Check if .next already exists (skip build if recent)
$skipBuild = $false
if (Test-Path ".next") {
    $nextDir = Get-Item ".next"
    $age = (Get-Date) - $nextDir.LastWriteTime
    if ($age.TotalMinutes -lt 30) {
        Write-Host "[OK] Recent build found, skipping build step" -ForegroundColor Green
        $skipBuild = $true
    }
}

if (-not $skipBuild) {
    Write-Host "      Installing dependencies..." -ForegroundColor Gray
    npm ci
    
    Write-Host "      Building Next.js app..." -ForegroundColor Gray
    npm run build
    
    if (-not (Test-Path ".next")) {
        Write-Host "[X] Build failed - .next directory not created" -ForegroundColor Red
        exit 1
    }
    Write-Host "[OK] Build completed" -ForegroundColor Green
}

# Step 2: Create deployment package
Write-Host ""
Write-Host "[2/5] Creating deployment package..." -ForegroundColor Cyan

# Remove old package if exists
if (Test-Path "deploy.tar.gz") {
    Remove-Item "deploy.tar.gz" -Force
}

# Create tar.gz using tar (available in Windows 10+)
$filesToInclude = @(
    ".next",
    "public",
    "package.json",
    "package-lock.json",
    "next.config.js",
    "ecosystem.config.js",
    "FULL-FIX-DEPLOY.sh",
    "diagnose-server.sh",
    "nginx-secure.conf"
)

$existingFiles = $filesToInclude | Where-Object { Test-Path $_ }

if ($existingFiles.Count -eq 0) {
    Write-Host "[X] No files to deploy" -ForegroundColor Red
    exit 1
}

Write-Host "      Including: $($existingFiles -join ', ')" -ForegroundColor Gray

# Use tar to create the archive
$fileList = $existingFiles -join " "
$tarResult = & tar -czf deploy.tar.gz $existingFiles 2>&1

if (-not (Test-Path "deploy.tar.gz")) {
    Write-Host "[X] Failed to create deployment package" -ForegroundColor Red
    Write-Host $tarResult -ForegroundColor Red
    exit 1
}

$packageSize = [math]::Round((Get-Item "deploy.tar.gz").Length / 1MB, 2)
Write-Host "[OK] Package created: deploy.tar.gz ($packageSize MB)" -ForegroundColor Green

# Step 3: Upload to server
Write-Host ""
Write-Host "[3/5] Uploading to server..." -ForegroundColor Cyan

# Create app directory on server
Write-Host "      Creating directory on server..." -ForegroundColor Gray
& ssh -i $KeyFile "$ServerUser@$ServerIP" "mkdir -p $AppPath/logs"

# Upload package
Write-Host "      Uploading package..." -ForegroundColor Gray
& scp -i $KeyFile deploy.tar.gz "$ServerUser@$ServerIP`:$AppPath/"

if ($LASTEXITCODE -ne 0) {
    Write-Host "[X] Upload failed" -ForegroundColor Red
    exit 1
}

# Upload the fix script separately
Write-Host "      Uploading deployment scripts..." -ForegroundColor Gray
& scp -i $KeyFile "FULL-FIX-DEPLOY.sh" "$ServerUser@$ServerIP`:$AppPath/"
& scp -i $KeyFile "diagnose-server.sh" "$ServerUser@$ServerIP`:$AppPath/"

Write-Host "[OK] Files uploaded" -ForegroundColor Green

# Step 4: Run deployment on server
Write-Host ""
Write-Host "[4/5] Deploying and securing on server..." -ForegroundColor Cyan

$deployScript = @'
cd /var/www/valt-omniagent
echo "[i] Extracting files..."
tar -xzf deploy.tar.gz
rm -f deploy.tar.gz
chmod +x FULL-FIX-DEPLOY.sh diagnose-server.sh
echo "[i] Running deployment script..."
./FULL-FIX-DEPLOY.sh
'@

& ssh -i $KeyFile "$ServerUser@$ServerIP" $deployScript

if ($LASTEXITCODE -ne 0) {
    Write-Host "[!] Deployment may have encountered issues" -ForegroundColor Yellow
} else {
    Write-Host "[OK] Server deployment completed" -ForegroundColor Green
}

# Step 5: Verify deployment
Write-Host ""
Write-Host "[5/5] Verifying deployment..." -ForegroundColor Cyan

Start-Sleep -Seconds 5

try {
    $response = Invoke-WebRequest -Uri "https://omni.valtara.ai" -UseBasicParsing -TimeoutSec 30 -SkipCertificateCheck -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "[OK] Site is UP and responding!" -ForegroundColor Green
    } else {
        Write-Host "[!] Site returned status: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[!] Could not verify site - may need a few minutes" -ForegroundColor Yellow
    Write-Host "    Error: $($_.Exception.Message)" -ForegroundColor Gray
}

# Cleanup
Write-Host ""
Write-Host "[i] Cleaning up local files..." -ForegroundColor Gray
if (Test-Path "deploy.tar.gz") {
    Remove-Item "deploy.tar.gz" -Force
}

# Final summary
Write-Host ""
Write-Host "================================================================" -ForegroundColor Green
Write-Host "  DEPLOYMENT COMPLETE" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Site URL:     https://omni.valtara.ai" -ForegroundColor White
Write-Host "  Server:       $ServerIP" -ForegroundColor White
Write-Host ""
Write-Host "  To check status, SSH into the server:" -ForegroundColor Gray
Write-Host "    ssh -i $KeyFile $ServerUser@$ServerIP" -ForegroundColor Gray
Write-Host ""
Write-Host "  Then run:" -ForegroundColor Gray
Write-Host "    pm2 status" -ForegroundColor Gray
Write-Host "    pm2 logs valt-omniagent" -ForegroundColor Gray
Write-Host ""
