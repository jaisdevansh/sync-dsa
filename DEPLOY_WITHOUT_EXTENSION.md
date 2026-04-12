# 🚀 Deploy Backend + Dashboard Only (Extension Local)

## 🎯 Goal
Deploy backend and dashboard to cloud, but use extension locally (unpacked).

---

## ✅ Benefits
- No Chrome Web Store submission needed
- No $5 fee
- Faster updates (just reload extension)
- Full control
- Works for personal use

---

## 📦 What You'll Deploy

1. **Backend API** → Render.com (Free)
2. **Worker Service** → Render.com (Free)
3. **Dashboard** → Vercel (Free)
4. **Extension** → Local (Unpacked)

**Total Cost: $0** 🎉

---

## 🚀 Step 1: Deploy Backend to Render (10 min)

### 1.1 Push to GitHub

```bash
git init
git add .
git commit -m "Deploy backend"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 1.2 Create Render Account

1. Go to: https://render.com
2. Sign up with GitHub
3. Verify email

### 1.3 Deploy Backend Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repo
3. Configure:
   - **Name:** `dsa-sync-backend`
   - **Region:** Oregon (US West)
   - **Branch:** `main`
   - **Root Directory:** Leave empty
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm run start --workspace=apps/backend`
   - **Instance Type:** Free

4. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable"
   
   ```
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

5. Click **"Create Web Service"**

6. Wait 5-10 minutes for deployment

7. **Copy your URL:** `https://dsa-sync-backend.onrender.com`

### 1.4 Deploy Worker Service

1. Click **"New +"** → **"Background Worker"**
2. Connect same repo
3. Configure:
   - **Name:** `dsa-sync-worker`
   - **Region:** Oregon (US West)
   - **Branch:** `main`
   - **Build Command:** `npm install`
   - **Start Command:** `npm run start:worker --workspace=apps/backend`
   - **Instance Type:** Free

4. Add same environment variables (except PORT)

5. Click **"Create Background Worker"**

---

## 🎨 Step 2: Deploy Dashboard to Vercel (5 min)

### 2.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 2.2 Deploy Dashboard

```bash
cd apps/dashboard
vercel
```

Follow prompts:
- **Set up and deploy?** Y
- **Which scope?** Your account
- **Link to existing project?** N
- **Project name?** dsa-sync-dashboard
- **Directory?** ./
- **Override settings?** N

### 2.3 Add Environment Variable

```bash
vercel env add NEXT_PUBLIC_API_URL production
```

Enter: `https://dsa-sync-backend.onrender.com/api`

### 2.4 Redeploy with Env

```bash
vercel --prod
```

**Copy your URL:** `https://dsa-sync-dashboard.vercel.app`

---

## 🔧 Step 3: Update Extension for Production URLs

### 3.1 Update popup.js

Edit `apps/extension/popup.js`:

```javascript
const API_BASE_URL = 'https://dsa-sync-backend.onrender.com/api';
const DASHBOARD_URL = 'https://dsa-sync-dashboard.vercel.app/dashboard';
const GITHUB_CLIENT_ID = 'Ov23lixTaTeICwY4oD9L';
```

### 3.2 Update background.js

Edit `apps/extension/background.js`:

```javascript
const API_BASE_URL = 'https://dsa-sync-backend.onrender.com/api';
```

### 3.3 Update manifest.json

Edit `apps/extension/manifest.json`:

```json
{
  "host_permissions": [
    "https://leetcode.com/*",
    "https://www.geeksforgeeks.org/*",
    "https://dsa-sync-backend.onrender.com/*"
  ]
}
```

### 3.4 Reload Extension

1. Go to: `chrome://extensions/`
2. Find "DSA Auto Sync"
3. Click **Refresh** button 🔄

---

## 🔐 Step 4: Update GitHub OAuth Callback

1. Go to: https://github.com/settings/developers
2. Click your OAuth App: "DSA Auto Sync"
3. Update **"Authorization callback URL":**
   ```
   https://dsa-sync-backend.onrender.com/api/auth/github/callback
   ```
4. Click **"Update application"**

---

## ✅ Step 5: Test Everything

### 5.1 Test Backend

```bash
curl https://dsa-sync-backend.onrender.com/health
```

Should return: `{"status":"ok"}`

### 5.2 Test Dashboard

Open: `https://dsa-sync-dashboard.vercel.app`

Should load (might show "Not connected" - that's OK)

### 5.3 Test Extension

1. Click extension icon
2. Click "CONNECT GITHUB"
3. Authorize on GitHub
4. Should see "Connected" status

### 5.4 Test Full Flow

1. Go to: https://leetcode.com/problems/two-sum/
2. Submit a solution
3. Check console: `[DSA Sync] Submission detected`
4. Check GitHub repo: File should be created
5. Check extension: Stats should update

---

## 📊 Monitoring

### Check Backend Logs

1. Go to Render dashboard
2. Click "dsa-sync-backend"
3. Click "Logs" tab
4. Watch for errors

### Check Worker Logs

1. Click "dsa-sync-worker"
2. Click "Logs" tab
3. Should see: "Worker started", "Processing job"

### Check Dashboard Logs

```bash
vercel logs
```

---

## 🐛 Troubleshooting

### Backend Not Starting

**Check Render logs for:**
- Database connection errors
- Redis connection errors
- Missing environment variables

**Fix:**
- Verify DATABASE_URL is correct
- Verify REDIS_URL format: `rediss://` (with double 's')
- Check all env variables are set

### Extension Not Connecting

**Check:**
1. Backend URL in popup.js and background.js
2. GitHub OAuth callback URL
3. CORS settings (should be `*`)
4. Extension reloaded after changes

**Fix:**
```javascript
// In popup.js and background.js
const API_BASE_URL = 'https://YOUR-BACKEND-URL.onrender.com/api';
```

### Submissions Not Syncing

**Check:**
1. Worker is running (Render dashboard)
2. Redis is connected (worker logs)
3. GitHub token is valid
4. Backend logs for errors

---

## 🔄 Updating Your App

### Update Backend/Worker

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update backend"
   git push
   ```
3. Render auto-deploys (takes 2-3 min)

### Update Dashboard

```bash
cd apps/dashboard
# Make changes
vercel --prod
```

### Update Extension

1. Make changes in `apps/extension/`
2. Go to `chrome://extensions/`
3. Click **Refresh** button
4. Changes applied instantly!

---

## 💰 Cost

**Everything is FREE!** 🎉

- Backend (Render): $0
- Worker (Render): $0
- Dashboard (Vercel): $0
- Database (Neon): $0
- Redis (Upstash): $0
- Extension: $0 (local)

**Total: $0/month**

### Free Tier Limits

- **Render:** 750 hours/month (enough for 1 service 24/7)
- **Vercel:** 100GB bandwidth, unlimited requests
- **Neon:** 500MB storage, 10GB transfer
- **Upstash:** 10K commands/day

**Good for:** Personal use, 100-1000 submissions/month

---

## 📝 Deployment Checklist

### Pre-Deployment
- [x] Local testing complete
- [x] All services running locally
- [x] Extension working with localhost

### Backend Deployment
- [ ] Pushed to GitHub
- [ ] Deployed to Render
- [ ] Environment variables set
- [ ] Health check working
- [ ] Logs show no errors

### Worker Deployment
- [ ] Deployed to Render
- [ ] Environment variables set
- [ ] Logs show "Worker started"
- [ ] Redis connected

### Dashboard Deployment
- [ ] Deployed to Vercel
- [ ] Environment variable set
- [ ] Dashboard accessible
- [ ] No build errors

### Extension Update
- [ ] Production URLs updated
- [ ] manifest.json updated
- [ ] Extension reloaded
- [ ] GitHub OAuth updated

### Testing
- [ ] Backend health check passes
- [ ] Extension connects to GitHub
- [ ] Submission syncs to GitHub
- [ ] Stats update correctly
- [ ] Dashboard shows data

---

## 🎯 Your Deployed URLs

After deployment, save these:

```
Backend:   https://dsa-sync-backend.onrender.com
Dashboard: https://dsa-sync-dashboard.vercel.app
GitHub:    https://github.com/jaisdevansh/dsa-solutions
```

---

## 🚀 Quick Commands Reference

```bash
# Deploy Dashboard
cd apps/dashboard
vercel --prod

# Check Backend Health
curl https://dsa-sync-backend.onrender.com/health

# View Dashboard Logs
vercel logs

# Update Extension
# Just edit files and reload in chrome://extensions/

# Push Backend Updates
git add .
git commit -m "Update"
git push
# Render auto-deploys
```

---

## 📞 Need Help?

1. **Check logs first:**
   - Render: Dashboard → Logs
   - Vercel: `vercel logs`
   - Extension: F12 → Console

2. **Common issues:**
   - CORS errors: Check CORS_ORIGIN=*
   - Connection errors: Check URLs
   - Auth errors: Check GitHub OAuth callback

3. **Still stuck?**
   - Check environment variables
   - Verify all services are running
   - Test each component separately

---

**You're all set! Deploy and enjoy! 🎉**
