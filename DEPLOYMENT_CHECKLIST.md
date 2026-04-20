# 🚀 Deployment Checklist - Before Sharing Extension

## ⚠️ CRITICAL: Complete These Steps Before Sharing!

Your friend is having issues because the backend might not be properly deployed or configured.

---

## ✅ Step 1: Verify Backend is Deployed on Render

### Check if backend is live:

Open in browser:
```
https://dsa-sync-backend.onrender.com/keepalive
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-04-20T..."
}
```

**If you get an error:**
- Backend is not deployed
- Backend is sleeping (takes 30+ seconds to respond)
- Wrong URL

---

## ✅ Step 2: Update GitHub OAuth Settings

Go to: https://github.com/settings/developers

**Required Settings:**
- **Homepage URL:** `https://dsa-sync-backend.onrender.com`
- **Callback URL:** `https://dsa-sync-backend.onrender.com/api/auth/github/callback`

See `GITHUB_OAUTH_SETUP.md` for detailed instructions.

---

## ✅ Step 3: Set Environment Variables on Render

Go to your Render dashboard → Your service → Environment

**Required Variables:**
```
DATABASE_URL=postgresql://neondb_owner:npg_8TM2BINSAROW@ep-twilight-star-anfshec1.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require

GITHUB_CLIENT_ID=Ov23lixTaTeICwY4oD9L
GITHUB_CLIENT_SECRET=436121c0b05e819233b6df61bc3870c323de9df4

JWT_SECRET=DSAAUTOSYNC2024SECUREKEY12345

ENCRYPTION_KEY=a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2

PORT=3000
CORS_ORIGIN=*
NODE_ENV=production
```

**After adding/updating:**
- Click "Save Changes"
- Render will automatically redeploy

---

## ✅ Step 4: Setup UptimeRobot Keepalive

See `RENDER_KEEPALIVE_SETUP.md` for instructions.

**Quick Setup:**
1. Go to: https://uptimerobot.com/
2. Sign up (free)
3. Add monitor:
   - URL: `https://dsa-sync-backend.onrender.com/keepalive`
   - Interval: 5 minutes
4. Done! Backend will never sleep

---

## ✅ Step 5: Test Full OAuth Flow

### Test in browser:

1. Open this URL:
```
https://github.com/login/oauth/authorize?client_id=Ov23lixTaTeICwY4oD9L&scope=repo&redirect_uri=https://dsa-sync-backend.onrender.com/api/auth/github/callback
```

2. Click "Authorize"

3. Should redirect to success page showing:
   - ✓ GitHub Connected
   - Your username
   - JWT token

**If this works, your extension will work!**

---

## ✅ Step 6: Test Extension Locally

Before sharing with friend:

1. Load extension in Chrome
2. Click "Connect with GitHub"
3. Authorize
4. Extension should show "Connected" ✓
5. Submit a test problem
6. Check GitHub for file

**If all steps work, you're ready to share!**

---

## 🔍 Troubleshooting:

### Backend not responding:
- Check Render dashboard for errors
- Check Render logs
- Verify environment variables are set
- Redeploy if needed

### OAuth redirect fails:
- Check GitHub OAuth callback URL
- Must be: `https://dsa-sync-backend.onrender.com/api/auth/github/callback`
- No typos, exact match required

### Extension not connecting:
- Check browser console for errors
- Verify backend is awake (use UptimeRobot)
- Check extension uses production URL in `background.js`

---

## 📋 Final Checklist:

Before sharing extension with friend:

- [ ] Backend deployed on Render
- [ ] Backend responds to `/keepalive` endpoint
- [ ] GitHub OAuth callback URL is correct
- [ ] Environment variables set on Render
- [ ] UptimeRobot keepalive configured
- [ ] Tested OAuth flow in browser (works!)
- [ ] Tested extension locally (connects!)
- [ ] Tested submission (syncs to GitHub!)
- [ ] Created fresh ZIP file
- [ ] Ready to share!

---

## 🎯 Quick Test Command:

Run this to test everything:

```bash
# Test backend
curl https://dsa-sync-backend.onrender.com/keepalive

# Test OAuth (open in browser)
# https://github.com/login/oauth/authorize?client_id=Ov23lixTaTeICwY4oD9L&scope=repo&redirect_uri=https://dsa-sync-backend.onrender.com/api/auth/github/callback
```

If both work, you're good to go!

---

## 🚨 Common Issues:

### Issue: "Failed to connect"
**Cause:** Backend is sleeping
**Fix:** Setup UptimeRobot keepalive

### Issue: "OAuth redirect failed"
**Cause:** Wrong callback URL in GitHub settings
**Fix:** Update to exact URL in GitHub OAuth settings

### Issue: "Extension shows 'Connect with GitHub' after auth"
**Cause:** JWT not reaching extension
**Fix:** Already fixed in latest code (chrome.storage + postMessage)

---

**Complete all steps, then share extension with confidence! 🚀**
