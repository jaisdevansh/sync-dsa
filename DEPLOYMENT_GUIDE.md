# 🚀 DSA Auto Sync - Complete Deployment Guide

## 📋 Overview

You need to deploy 3 components:
1. **Backend API** (Fastify server)
2. **Worker Service** (BullMQ processor)
3. **Dashboard** (Next.js app)
4. **Extension** (Chrome Web Store)

---

## 🎯 Deployment Options

### Option 1: Free Tier (Recommended for Testing)
- Backend + Worker: **Render.com** (Free)
- Dashboard: **Vercel** (Free)
- Database: **Neon** (Already set up)
- Redis: **Upstash** (Already set up)

### Option 2: Production (Paid)
- Backend + Worker: **Railway** / **Fly.io**
- Dashboard: **Vercel** / **Netlify**
- Database: **Neon** (Paid tier)
- Redis: **Upstash** (Paid tier)

---

## 🔧 Part 1: Backend Deployment (Render.com)

### Step 1: Prepare Backend for Deployment

1. **Create `render.yaml` in root:**

```yaml
services:
  # Backend API
  - type: web
    name: dsa-sync-backend
    env: node
    region: oregon
    plan: free
    buildCommand: npm install && npm run build --workspace=apps/backend
    startCommand: npm run start --workspace=apps/backend
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
      - key: DATABASE_URL
        fromDatabase:
          name: neondb
          property: connectionString
      - key: REDIS_URL
        sync: false
      - key: GITHUB_CLIENT_ID
        sync: false
      - key: GITHUB_CLIENT_SECRET
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: ENCRYPTION_KEY
        generateValue: true
      - key: CORS_ORIGIN
        value: "*"

  # Worker Service
  - type: worker
    name: dsa-sync-worker
    env: node
    region: oregon
    plan: free
    buildCommand: npm install
    startCommand: npm run start:worker --workspace=apps/backend
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: neondb
          property: connectionString
      - key: REDIS_URL
        sync: false
      - key: GITHUB_CLIENT_ID
        sync: false
      - key: GITHUB_CLIENT_SECRET
        sync: false
      - key: ENCRYPTION_KEY
        sync: false
```

### Step 2: Deploy to Render

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Go to Render.com:**
   - Sign up: https://render.com
   - Click "New +" → "Blueprint"
   - Connect your GitHub repo
   - Render will auto-detect `render.yaml`

3. **Add Environment Variables:**
   - DATABASE_URL: (Your Neon URL)
   - REDIS_URL: `rediss://default:YOUR_TOKEN@known-katydid-96053.upstash.io:6379`
   - GITHUB_CLIENT_ID: `Ov23lixTaTeICwY4oD9L`
   - GITHUB_CLIENT_SECRET: `436121c0b05e819233b6df61bc3870c323de9df4`
   - ENCRYPTION_KEY: `a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2`

4. **Deploy:**
   - Click "Apply"
   - Wait 5-10 minutes
   - Your backend will be live at: `https://dsa-sync-backend.onrender.com`

---

## 🎨 Part 2: Dashboard Deployment (Vercel)

### Step 1: Prepare Dashboard

1. **Update `apps/dashboard/lib/api.js`:**

```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function fetchStats(jwt) {
  const response = await fetch(`${API_BASE_URL}/stats/me`, {
    headers: { 'Authorization': `Bearer ${jwt}` },
  });
  return response.json();
}
```

2. **Create `vercel.json` in `apps/dashboard/`:**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_API_URL": "https://dsa-sync-backend.onrender.com/api"
  }
}
```

### Step 2: Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd apps/dashboard
   vercel
   ```

3. **Follow prompts:**
   - Link to existing project? No
   - Project name: dsa-sync-dashboard
   - Directory: ./
   - Build command: npm run build
   - Output directory: .next

4. **Set Environment Variable:**
   ```bash
   vercel env add NEXT_PUBLIC_API_URL
   # Enter: https://dsa-sync-backend.onrender.com/api
   ```

5. **Your dashboard will be live at:**
   ```
   https://dsa-sync-dashboard.vercel.app
   ```

---

## 🔌 Part 3: Update Extension for Production

### Step 1: Update Extension URLs

**Edit `apps/extension/popup.js`:**

```javascript
const API_BASE_URL = 'https://dsa-sync-backend.onrender.com/api';
const DASHBOARD_URL = 'https://dsa-sync-dashboard.vercel.app/dashboard';
const GITHUB_CLIENT_ID = 'Ov23lixTaTeICwY4oD9L';
```

**Edit `apps/extension/background.js`:**

```javascript
const API_BASE_URL = 'https://dsa-sync-backend.onrender.com/api';
```

**Edit `apps/extension/manifest.json`:**

```json
{
  "host_permissions": [
    "https://leetcode.com/*",
    "https://www.geeksforgeeks.org/*",
    "https://dsa-sync-backend.onrender.com/*"
  ]
}
```

### Step 2: Update GitHub OAuth Callback

1. **Go to GitHub:**
   - https://github.com/settings/developers
   - Click your OAuth App
   - Update "Authorization callback URL":
     ```
     https://dsa-sync-backend.onrender.com/api/auth/github/callback
     ```

### Step 3: Test Extension Locally

1. Reload extension
2. Test with production URLs
3. Make sure everything works

---

## 📦 Part 4: Publish Extension to Chrome Web Store

### Step 1: Prepare Extension Package

1. **Update `manifest.json` version:**
   ```json
   {
     "version": "1.0.0",
     "name": "DSA Auto Sync",
     "description": "Automatically sync your DSA solutions to GitHub"
   }
   ```

2. **Create ZIP file:**
   ```bash
   cd apps/extension
   # Remove any unnecessary files
   rm -rf node_modules .env
   
   # Create ZIP (Windows)
   Compress-Archive -Path * -DestinationPath dsa-auto-sync-v1.0.0.zip
   ```

### Step 2: Chrome Web Store Submission

1. **Go to Chrome Web Store Developer Dashboard:**
   - https://chrome.google.com/webstore/devconsole
   - Pay one-time $5 registration fee

2. **Create New Item:**
   - Click "New Item"
   - Upload `dsa-auto-sync-v1.0.0.zip`

3. **Fill Store Listing:**
   - **Name:** DSA Auto Sync
   - **Summary:** Automatically sync your DSA solutions to GitHub
   - **Description:**
     ```
     DSA Auto Sync automatically detects when you solve coding problems on LeetCode or GeeksforGeeks and syncs them to your GitHub repository.

     Features:
     ✅ Auto-detect submissions on LeetCode & GeeksforGeeks
     ✅ Sync code to GitHub automatically
     ✅ Track your progress with stats
     ✅ View dashboard after 5 problems
     ✅ Maintain your coding streak

     How it works:
     1. Connect your GitHub account
     2. Solve problems on LeetCode/GFG
     3. Code automatically syncs to GitHub
     4. Track your progress in the dashboard
     ```

4. **Add Screenshots:**
   - Extension popup (connected state)
   - Success page
   - Dashboard
   - GitHub repo with synced files

5. **Category:** Developer Tools

6. **Privacy Policy:** (Required)
   ```
   https://your-domain.com/privacy-policy
   ```

7. **Submit for Review:**
   - Review takes 1-3 days
   - You'll get email when approved

---

## 🔐 Part 5: Environment Variables Summary

### Backend (.env)
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://neondb_owner:npg_8TM2BINSAROW@ep-twilight-star-anfshec1.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require
REDIS_URL=rediss://default:gQAAAAAAAXc1AAIncDI2ZDg3ZGFhYmQyYjc0N2ViOGUzN2UzN2I4YjY3MTI5YXAyOTYwNTM@known-katydid-96053.upstash.io:6379
GITHUB_CLIENT_ID=Ov23lixTaTeICwY4oD9L
GITHUB_CLIENT_SECRET=436121c0b05e819233b6df61bc3870c323de9df4
JWT_SECRET=DSAAUTOSYNC2024SECUREKEY12345
ENCRYPTION_KEY=a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2
CORS_ORIGIN=*
```

### Dashboard (.env.local)
```env
NEXT_PUBLIC_API_URL=https://dsa-sync-backend.onrender.com/api
```

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] All tests passing locally
- [ ] Environment variables documented
- [ ] GitHub OAuth callback updated
- [ ] Extension tested with production URLs

### Backend Deployment
- [ ] Pushed to GitHub
- [ ] Deployed to Render
- [ ] Environment variables set
- [ ] Health check working: `/health`
- [ ] Database connected
- [ ] Redis connected

### Dashboard Deployment
- [ ] Deployed to Vercel
- [ ] API URL configured
- [ ] Dashboard accessible
- [ ] Stats loading correctly

### Extension
- [ ] Production URLs updated
- [ ] Manifest version bumped
- [ ] ZIP file created
- [ ] Submitted to Chrome Web Store
- [ ] Screenshots uploaded
- [ ] Privacy policy added

### Post-Deployment
- [ ] Test full flow end-to-end
- [ ] Monitor logs for errors
- [ ] Check GitHub repo for synced files
- [ ] Verify stats updating

---

## 🐛 Troubleshooting

### Backend Issues
```bash
# Check logs on Render
# Go to: Dashboard → Service → Logs

# Common issues:
# - Database connection: Check DATABASE_URL
# - Redis connection: Check REDIS_URL format
# - Port binding: Render uses PORT env variable
```

### Dashboard Issues
```bash
# Check Vercel logs
vercel logs

# Common issues:
# - API URL: Check NEXT_PUBLIC_API_URL
# - CORS: Make sure backend allows dashboard domain
```

### Extension Issues
```bash
# Check extension console
# chrome://extensions/ → DSA Auto Sync → Inspect views: service worker

# Common issues:
# - API URL: Check API_BASE_URL in popup.js and background.js
# - OAuth: Check GitHub callback URL
# - CORS: Check host_permissions in manifest.json
```

---

## 📊 Monitoring

### Backend Health
```bash
curl https://dsa-sync-backend.onrender.com/health
```

### Check Logs
- **Render:** Dashboard → Logs
- **Vercel:** `vercel logs`
- **Extension:** Chrome DevTools

---

## 💰 Cost Estimate

### Free Tier (Good for 100-1000 users)
- Backend (Render): $0
- Worker (Render): $0
- Dashboard (Vercel): $0
- Database (Neon): $0 (500MB)
- Redis (Upstash): $0 (10K commands/day)
- **Total: $0/month**

### Paid Tier (Production)
- Backend (Render): $7/month
- Worker (Render): $7/month
- Dashboard (Vercel): $20/month
- Database (Neon): $19/month
- Redis (Upstash): $10/month
- **Total: ~$63/month**

---

## 🚀 Quick Deploy Commands

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Deploy Dashboard
cd apps/dashboard
vercel --prod

# 3. Deploy Backend (via Render dashboard)
# Go to render.com and connect repo

# 4. Package Extension
cd apps/extension
Compress-Archive -Path * -DestinationPath ../dsa-auto-sync.zip

# 5. Upload to Chrome Web Store
# Go to chrome.google.com/webstore/devconsole
```

---

## 📝 Post-Deployment

1. **Test Everything:**
   - Extension connects to GitHub
   - Submissions sync to GitHub
   - Stats update correctly
   - Dashboard shows data

2. **Monitor:**
   - Check Render logs daily
   - Monitor Vercel analytics
   - Watch for errors

3. **Update:**
   - Keep dependencies updated
   - Monitor security alerts
   - Update extension as needed

---

**Need help? Check logs and error messages first!** 🚀
