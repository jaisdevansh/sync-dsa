# 🚀 Render Deployment Guide - Step by Step

## 📋 Prerequisites:

- GitHub account
- Render account (free): https://render.com/
- Repository: https://github.com/jaisdevansh/sync-dsa

---

## 🎯 Step-by-Step Deployment:

### Step 1: Create Render Account

1. Go to: https://render.com/
2. Click **"Get Started"**
3. Sign up with GitHub
4. Authorize Render to access your repositories

---

### Step 2: Create New Web Service

1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Connect your repository:
   - If not connected, click "Connect account"
   - Select: `jaisdevansh/sync-dsa`
4. Click **"Connect"**

---

### Step 3: Configure Service

Fill in these settings:

**Name:**
```
dsa-sync-backend
```

**Region:**
```
Oregon (US West) or Singapore (closest to you)
```

**Branch:**
```
main
```

**Root Directory:**
```
apps/backend
```

**Runtime:**
```
Node
```

**Build Command:**
```
npm install
```

**Start Command:** (IMPORTANT!)
```
npm start
```

Or:
```
node src/server.js
```

**Note:** Don't use `npm run dev` - that's only for local development!

**Instance Type:**
```
Free
```

---

### Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Copy these from `RENDER_ENV_VARIABLES.txt`:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_8TM2BINSAROW@ep-twilight-star-anfshec1.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require` |
| `GITHUB_CLIENT_ID` | `Ov23lixTaTeICwY4oD9L` |
| `GITHUB_CLIENT_SECRET` | `436121c0b05e819233b6df61bc3870c323de9df4` |
| `JWT_SECRET` | `DSAAUTOSYNC2024SECUREKEY12345` |
| `ENCRYPTION_KEY` | `a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2` |
| `PORT` | `3000` |
| `CORS_ORIGIN` | `*` |
| `NODE_ENV` | `production` |

**Or paste one by one:**

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

---

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (2-5 minutes)
3. Watch logs for:
   ```
   ✅ Migrations completed successfully
   🚀 Server running on port 3000
   ```

---

### Step 6: Get Your Service URL

After deployment, you'll get a URL like:
```
https://dsa-sync-backend.onrender.com
```

**Test it:**
```
https://dsa-sync-backend.onrender.com/keepalive
```

Should return:
```json
{"status":"ok","timestamp":"..."}
```

---

## 🔧 Configuration Summary:

### Service Settings:
- **Name:** `dsa-sync-backend`
- **Root Directory:** `apps/backend`
- **Build Command:** `npm install`
- **Start Command:** `node src/server.js`
- **Instance Type:** Free

### Environment Variables (8 total):
1. DATABASE_URL
2. GITHUB_CLIENT_ID
3. GITHUB_CLIENT_SECRET
4. JWT_SECRET
5. ENCRYPTION_KEY
6. PORT
7. CORS_ORIGIN
8. NODE_ENV

---

## ✅ Verification:

After deployment, test these endpoints:

### 1. Keepalive:
```
https://dsa-sync-backend.onrender.com/keepalive
```
Expected: `{"status":"ok",...}`

### 2. OAuth Flow:
```
https://github.com/login/oauth/authorize?client_id=Ov23lixTaTeICwY4oD9L&scope=repo&redirect_uri=https://dsa-sync-backend.onrender.com/api/auth/github/callback
```
Expected: GitHub authorization page

---

## 🚨 Common Issues:

### Issue: Build fails
**Solution:**
- Check Root Directory is `apps/backend`
- Check Build Command is `npm install`
- Check logs for errors

### Issue: Server crashes on start
**Solution:**
- Check all environment variables are set
- Check Start Command is `node src/server.js`
- Check logs for missing env vars

### Issue: Database connection fails
**Solution:**
- Verify DATABASE_URL is correct
- Check Neon database is active
- Test connection from Neon dashboard

---

## 📊 Monitoring:

### Check Logs:
1. Go to Render Dashboard
2. Click on your service
3. Click **"Logs"** tab
4. Look for:
   - `✅ Migrations completed successfully`
   - `🚀 Server running on port 3000`
   - `📝 Environment: production`

### Check Metrics:
1. Click **"Metrics"** tab
2. Monitor:
   - CPU usage
   - Memory usage
   - Request count

---

## 🔄 Auto-Deploy:

Render automatically deploys when you push to GitHub:

1. Make changes locally
2. Commit and push to GitHub
3. Render detects changes
4. Automatically rebuilds and deploys
5. Check logs for deployment status

---

## 💰 Free Tier Limits:

- **750 hours/month** (enough for 24/7 with keepalive)
- **Spins down after 15 minutes** of inactivity
- **Takes 30-60 seconds** to wake up
- **Solution:** Setup UptimeRobot keepalive

---

## 🎯 Next Steps:

After deployment:

1. ✅ Update GitHub OAuth callback URL
2. ✅ Setup UptimeRobot keepalive
3. ✅ Test OAuth flow
4. ✅ Test extension
5. ✅ Share with friends

---

## 📝 Quick Reference:

**Service URL:**
```
https://dsa-sync-backend.onrender.com
```

**Keepalive Endpoint:**
```
https://dsa-sync-backend.onrender.com/keepalive
```

**OAuth Callback:**
```
https://dsa-sync-backend.onrender.com/api/auth/github/callback
```

---

## 🆘 Need Help?

Check these:
1. Render logs for errors
2. Environment variables are all set
3. Root directory is correct
4. Start command is correct
5. Database is accessible

---

**That's it! Your backend is now deployed on Render! 🚀**
