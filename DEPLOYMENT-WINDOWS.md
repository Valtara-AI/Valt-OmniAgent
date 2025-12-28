# Windows Deployment Quick Start

## For Windows Users

Since you're on Windows, here's how to deploy using Git Bash (recommended) or WSL.

### Option 1: Using Git Bash (Easiest)

1. **Open Git Bash** (Right-click in project folder → "Git Bash Here")

2. **Set SSH key permissions**:
```bash
chmod 600 ubuntu-ky.pem
```

3. **Test SSH connection**:
```bash
ssh -i ubuntu-ky.pem root@91.99.79.131
```

4. **Upload server setup files**:
```bash
scp -i ubuntu-ky.pem server-setup.sh nginx.conf root@91.99.79.131:/tmp/
```

5. **Run server setup** (one-time):
```bash
ssh -i ubuntu-ky.pem root@91.99.79.131 "cd /tmp && chmod +x server-setup.sh && ./server-setup.sh"
```

6. **Deploy application**:
```bash
chmod +x deploy.sh
bash deploy.sh
```

### Option 2: Using WSL (Ubuntu on Windows)

1. **Open WSL terminal** (Type "Ubuntu" in Start menu)

2. **Navigate to project** (assuming it's in D:\Valt OmniAgent):
```bash
cd /mnt/d/Valt\ OmniAgent
```

3. **Follow the same steps as Git Bash above**

### Option 3: Manual Deployment (If scripts don't work)

#### Step 1: Build locally
```cmd
npm run build
```

#### Step 2: Create archive (use 7-Zip or WinRAR)
- Select these folders/files: `.next`, `public`, `package.json`, `package-lock.json`, `.env.local`, `ecosystem.config.js`, `next.config.js`
- Right-click → 7-Zip → Add to archive → create `deploy.tar.gz`

#### Step 3: Upload using FileZilla or WinSCP
- **Protocol**: SFTP
- **Host**: 91.99.79.131
- **Port**: 22
- **User**: root
- **Key file**: ubuntu-ky.pem (convert to PPK for WinSCP)
- Upload to: `/var/www/valt-omniagent/`

#### Step 4: SSH with PuTTY
1. Download PuTTY and PuTTYgen
2. Convert ubuntu-ky.pem to PPK format:
   - Open PuTTYgen
   - Load → Select ubuntu-ky.pem
   - Save private key → save as ubuntu-ky.ppk

3. Connect with PuTTY:
   - Host: 91.99.79.131
   - Connection → SSH → Auth → Private key: ubuntu-ky.ppk
   - Click Open

#### Step 5: Extract and run
```bash
cd /var/www/valt-omniagent
tar -xzf deploy.tar.gz
npm ci --production
pm2 restart valt-omniagent || pm2 start ecosystem.config.js
pm2 save
```

## Troubleshooting Windows-Specific Issues

### "Permission denied" with SSH key

**Git Bash Solution**:
```bash
chmod 600 ubuntu-ky.pem
```

**Windows Command Prompt** (if Git Bash doesn't work):
```cmd
icacls ubuntu-ky.pem /inheritance:r
icacls ubuntu-ky.pem /grant:r "%USERNAME%:R"
```

### "bash: command not found" when running deploy.sh

Make sure you're using Git Bash, not Command Prompt or PowerShell.

**Alternative**: Use WSL (Windows Subsystem for Linux)
```bash
wsl bash deploy.sh
```

### Line Ending Issues

If you see errors like "bad interpreter" or "^M" characters:

**Convert line endings**:
```bash
dos2unix deploy.sh server-setup.sh
# or
sed -i 's/\r$//' deploy.sh server-setup.sh
```

### Firewall Issues

Windows Firewall might block SSH/SFTP:
1. Windows Security → Firewall & network protection
2. Advanced settings → Outbound Rules
3. Ensure SSH (port 22) is allowed

## Quick Test

**Test if everything is set up correctly**:

```bash
# In Git Bash
ssh -i ubuntu-ky.pem root@91.99.79.131 "echo 'Connection successful!'"
```

If you see "Connection successful!", you're ready to deploy!

## Video Walkthrough

For visual learners, here's the step-by-step process:

1. Install Git for Windows: https://git-scm.com/download/win
2. Right-click in project folder → "Git Bash Here"
3. Run: `chmod 600 ubuntu-ky.pem`
4. Run: `bash deploy.sh`
5. Wait for deployment to complete
6. Visit: https://omni.valtara.ai

## Common Windows Commands

**Check if Node.js is installed**:
```cmd
node --version
npm --version
```

**Open project in VS Code**:
```cmd
code .
```

**Run development server**:
```cmd
npm run dev
```

**Build for production**:
```cmd
npm run build
```

## Need Help?

If you encounter issues:

1. Check that Git Bash is installed
2. Make sure you're in the correct directory (D:\Valt OmniAgent)
3. Verify ubuntu-ky.pem is in the project root
4. Check DEPLOYMENT.md for detailed troubleshooting

## PowerShell Alternative (Advanced)

If you prefer PowerShell, here's how to deploy:

```powershell
# Set up SSH (one-time)
# Install OpenSSH Client (Windows 10 1809+)
Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0

# Set key permissions
icacls ubuntu-ky.pem /inheritance:r
icacls ubuntu-ky.pem /grant:r "$env:USERNAME:R"

# Test connection
ssh -i ubuntu-ky.pem root@91.99.79.131

# Build
npm run build

# Create archive (requires tar.exe - Windows 10 1803+)
tar -czf deploy.tar.gz .next public package.json package-lock.json .env.local ecosystem.config.js next.config.js

# Upload
scp -i ubuntu-ky.pem deploy.tar.gz root@91.99.79.131:/var/www/valt-omniagent/

# Deploy
ssh -i ubuntu-ky.pem root@91.99.79.131 "cd /var/www/valt-omniagent && tar -xzf deploy.tar.gz && npm ci --production && pm2 restart valt-omniagent"
```

**Note**: Git Bash is still recommended as it's more compatible with shell scripts.
