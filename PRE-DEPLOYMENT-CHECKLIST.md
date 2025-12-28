# Pre-Deployment Checklist

## ✅ Code Quality & Build

- [x] All TypeScript errors fixed
- [ ] Production build completed successfully (`npm run build`)
- [ ] No console errors in development mode
- [ ] All pages load correctly in development
- [ ] Responsive design tested on mobile/tablet/desktop

## ✅ Configuration Files

- [x] `next.config.js` - No deprecated options
- [x] `tsconfig.json` - Proper TypeScript configuration
- [x] `package.json` - All dependencies up to date
- [x] `.env.local` - Environment variables configured
- [x] `ecosystem.config.js` - PM2 configuration ready
- [x] `nginx.conf` - Web server configuration ready
- [x] `deploy.sh` - Deployment script ready
- [x] `server-setup.sh` - Server initialization script ready

## 🔒 Security

- [ ] Environment variables (`.env.local`) not committed to git
- [ ] SSH key (`ubuntu-ky.pem`) permissions set correctly (600)
- [ ] No API keys or secrets in code
- [ ] SSL certificates will be configured (via Certbot)
- [ ] Firewall rules configured (ports 22, 80, 443 only)
- [ ] Strong passwords for any admin accounts

## 🌐 DNS & Domain

- [ ] DNS A record for `omni.valtara.ai` → `91.99.79.131`
- [ ] DNS A record for `www.omni.valtara.ai` → `91.99.79.131`
- [ ] DNS propagation complete (check with `nslookup omni.valtara.ai`)
- [ ] Domain ownership verified

## 🖥️ Server Requirements

- [ ] Server accessible via SSH: `ssh -i ubuntu-ky.pem root@91.99.79.131`
- [ ] Server has sufficient resources (2GB+ RAM recommended)
- [ ] Server OS: Ubuntu 20.04+ or Debian 11+
- [ ] Server has internet access
- [ ] Server timezone configured

## 📦 Server Software (installed via server-setup.sh)

- [ ] Node.js 20.x LTS installed
- [ ] npm installed
- [ ] PM2 process manager installed
- [ ] Nginx web server installed
- [ ] Certbot (Let's Encrypt) installed
- [ ] UFW firewall configured

## 🚀 Deployment Files

- [x] `DEPLOYMENT.md` - Main deployment guide created
- [x] `DEPLOYMENT-WINDOWS.md` - Windows-specific guide created
- [ ] Deployment scripts tested locally
- [ ] Backup strategy documented

## ⚠️ Known Limitations (To Address Before Production)

### Critical (Must Fix Before Launch)
- [ ] **Authentication System** - Currently placeholder
  - `src/app/api/auth/[...nextauth]/route.ts` - Returns 404
  - `src/app/api/auth/signup/route.ts` - Returns 501
  - `src/app/auth/signin/page.tsx` - Placeholder UI
  - `src/app/auth/signup/page.tsx` - Placeholder UI
  
### Important (Fix Soon After Launch)
- [ ] Database configuration (if needed)
- [ ] Email service integration (for password reset, notifications)
- [ ] Analytics integration (Google Analytics, etc.)
- [ ] Error monitoring (Sentry, LogRocket, etc.)
- [ ] Rate limiting on API endpoints
- [ ] CORS configuration if needed

### Nice to Have (Can Be Added Later)
- [ ] CDN for static assets
- [ ] Image optimization
- [ ] Redis for caching
- [ ] Database backups automated
- [ ] Monitoring and alerting (UptimeRobot, etc.)

## 🧪 Testing

### Local Testing
- [ ] `npm run dev` - Development server runs without errors
- [ ] `npm run build` - Production build succeeds
- [ ] `npm run start` - Production server runs locally
- [ ] All routes accessible (/, /about, /contact, /dashboard, etc.)
- [ ] Theme toggle works (light/dark mode)
- [ ] Forms validate correctly
- [ ] Mobile responsive design tested

### Post-Deployment Testing
- [ ] Site accessible via HTTPS: https://omni.valtara.ai
- [ ] SSL certificate valid (green padlock in browser)
- [ ] All static assets load (images, CSS, JS)
- [ ] All pages load correctly
- [ ] No console errors in browser
- [ ] LeadConnector widget loads
- [ ] Navigation works correctly
- [ ] Forms submit correctly (when implemented)
- [ ] 404 page displays for invalid routes
- [ ] Performance is acceptable (page load < 3s)

## 📊 Performance

- [ ] Lighthouse score checked (aim for 90+ on all metrics)
- [ ] Core Web Vitals optimized
- [ ] Images optimized (WebP format where possible)
- [ ] Code splitting implemented
- [ ] Lazy loading for heavy components
- [ ] CDN configured (optional)

## 📝 Documentation

- [x] README.md updated
- [x] DEPLOYMENT.md created
- [x] DEPLOYMENT-WINDOWS.md created
- [ ] API documentation (if applicable)
- [ ] Environment variables documented
- [ ] Troubleshooting guide updated

## 🔄 Maintenance Plan

- [ ] Update schedule planned (security patches, dependencies)
- [ ] Backup schedule established
- [ ] Monitoring alerts configured
- [ ] Team trained on deployment process
- [ ] Rollback procedure documented

## 🎯 Go-Live Plan

### Phase 1: Initial Deployment (Day 1)
1. Run `server-setup.sh` on server
2. Deploy application with `deploy.sh`
3. Verify site is accessible
4. Test all critical paths
5. Monitor logs for errors

### Phase 2: Soft Launch (Days 2-7)
1. Share with small group of test users
2. Gather feedback
3. Fix critical bugs
4. Monitor performance and errors
5. Optimize based on real usage

### Phase 3: Public Launch (Day 8+)
1. Announce to wider audience
2. Monitor traffic and performance
3. Scale resources if needed
4. Continue iterating based on feedback

## 📞 Emergency Contacts

- **Server Provider**: _______________
- **Domain Registrar**: _______________
- **Development Team**: _______________
- **System Administrator**: _______________

## 🎉 Post-Launch

Once successfully deployed:
- [ ] Celebrate! 🎊
- [ ] Share launch announcement
- [ ] Monitor analytics and user feedback
- [ ] Plan next iteration/features
- [ ] Schedule regular maintenance

---

## Quick Deploy Commands

### First-Time Setup
```bash
# 1. Upload and run server setup
scp -i ubuntu-ky.pem server-setup.sh nginx.conf root@91.99.79.131:/tmp/
ssh -i ubuntu-ky.pem root@91.99.79.131 "cd /tmp && chmod +x server-setup.sh && ./server-setup.sh"

# 2. Deploy application
chmod +x deploy.sh
bash deploy.sh

# 3. Verify
ssh -i ubuntu-ky.pem root@91.99.79.131 "pm2 status"
curl https://omni.valtara.ai
```

### Subsequent Deployments
```bash
# Just run the deploy script
bash deploy.sh
```

---

**Last Updated**: 2024
**Project**: Valt OmniAgent
**Domain**: omni.valtara.ai
**Server**: 91.99.79.131
