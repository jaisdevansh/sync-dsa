# ⚡ Quick Deploy Guide (5 Steps)

## 🎯 Deploy in 30 Minutes

### Step 1: Push to GitHub (2 min)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### Step 2: Deploy Backend to Render (10 min)
1. Go to: https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your repo
5. Settings:
   - Name: `dsa-sync-backend`
   - Build Command: `npm install`
   - Start Command: `npm run start --workspace=apps/backend`
   - Add environment variables from `.env`
6. Click "Create Web Service"
7. Copy URL: `https://dsa-sync-backend.onrender.com`

### Step 3: Deploy Worker to Render (5 min)
1. Click "New +" → "Background Worker"
2. Connect same repo
3. Settings:
   - Name: `dsa-sync-worker`
   - Build Command: `npm install`
   - Start Command: `npm run start:worker --workspace=apps/backend`
   - Same environment variables
4. Click "Create Background Worker"

### Step 4: Deploy Dashboard to Vercel (5 min)
```bash
npm install -g vercel
cd apps/dashboard
vercel
```
- Follow prompts
- Set env: `NEXT_PUBLIC_API_URL=https://dsa-sync-backend.onrender.com/api`
- Copy URL: `https://dsa-sync-dashboard.vercel.app`

### Step 5: Update Extension (5 min)
1. Edit `apps/extension/popup.js`:
   ```javascript
   const API_BASE_URL = 'https://dsa-sync-backend.onrender.com/api';
   const DASHBOARD_URL = 'https://dsa-sync-dashboard.vercel.app/dashboard';
   ```

2. Edit `apps/extension/background.js`:
   ```javascript
   const API_BASE_URL = 'https://dsa-sync-backend.onrender.com/api';
   ```

3. Update GitHub OAuth:
   - Go to: https://github.com/settings/developers
   - Update callback: `https://dsa-sync-backend.onrender.com/api/auth/github/callback`

4. Test locally, then create ZIP for Chrome Web Store

---

## ✅ Done!

Your app is now live:
- Backend: `https://dsa-sync-backend.onrender.com`
- Dashboard: `https://dsa-sync-dashboard.vercel.app`
- Extension: Ready for Chrome Web Store

**Total Cost: $0 (Free tier)** 🎉
