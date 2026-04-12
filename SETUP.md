# 🚀 DSA Auto Sync - Complete Setup Guide

## Prerequisites

- Node.js 18+ installed
- Chrome browser
- GitHub account
- Neon PostgreSQL account (free tier)
- Upstash Redis account (free tier)

---

## Step 1: Clone & Install (2 minutes)

```bash
# Install all dependencies
npm install
```

---

## Step 2: Setup External Services (5 minutes)

### A. Neon PostgreSQL

1. Go to https://neon.tech
2. Sign up (free)
3. Create new project
4. Copy connection string (looks like: `postgresql://user:pass@host/db`)

### B. Upstash Redis

1. Go to https://upstash.com
2. Sign up (free)
3. Create Redis database
4. Copy connection string (looks like: `redis://default:pass@host:port`)

### C. GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in:
   - **Application name**: `DSA Auto Sync`
   - **Homepage URL**: `https://github.com/YOUR_USERNAME/dsa-auto-sync`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/github/callback`
4. Click "Register application"
5. Copy **Client ID**
6. Click "Generate a new client secret"
7. Copy **Client Secret**

---

## Step 3: Configure Environment (2 minutes)

### Backend Configuration

```bash
cd apps/backend
cp .env.example .env
```

Edit `apps/backend/.env`:

```bash
# Database (from Neon)
DATABASE_URL=postgresql://user:password@host/database

# Redis (from Upstash)
REDIS_URL=redis://default:password@host:port

# GitHub OAuth (from GitHub)
GITHUB_CLIENT_ID=Ov23liABCDEFGHIJKLMN
GITHUB_CLIENT_SECRET=github_pat_11ABCDEFG...

# JWT Secret (generate random 32+ chars)
JWT_SECRET=your_random_secret_min_32_characters_long

# Encryption Key (generate using command below)
ENCRYPTION_KEY=

# Server
PORT=3000
CORS_ORIGIN=*
NODE_ENV=development
```

### Generate Encryption Key

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as `ENCRYPTION_KEY` value.

---

## Step 4: Setup Database (1 minute)

```bash
# Generate migrations
npm run db:generate

# Push schema to database
npm run db:push
```

---

## Step 5: Configure Extension (1 minute)

Edit `apps/extension/popup.js` (line 7):

```javascript
const GITHUB_CLIENT_ID = 'Ov23liABCDEFGHIJKLMN'; // Your actual Client ID
```

---

## Step 6: Generate Extension Icons (1 minute)

### Option 1: Use HTML Generator (Recommended)

```bash
# Open the icon generator
start apps/extension/icons/create-simple-icons.html
```

1. Click "📦 Download All Icons"
2. Save the 3 PNG files to `apps/extension/icons/` folder

### Option 2: Use Online Tool

1. Open `apps/extension/icons/icon.svg`
2. Go to https://cloudconvert.com/svg-to-png
3. Convert to 16x16, 48x48, 128x128
4. Save as `icon16.png`, `icon48.png`, `icon128.png`

---

## Step 7: Start Services (1 minute)

Open 3 terminals:

### Terminal 1 - Backend API

```bash
npm run dev:backend
```

Should see: `🚀 Server running on port 3000`

### Terminal 2 - Queue Worker

```bash
npm run dev:worker
```

Should see: `🔄 Worker started`

### Terminal 3 - Dashboard

```bash
npm run dev:dashboard
```

Should see: `✓ Ready on http://localhost:3001`

---

## Step 8: Load Extension (1 minute)

1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable **"Developer mode"** (top right toggle)
4. Click **"Load unpacked"**
5. Select folder: `apps/extension`
6. Extension should load successfully! ✅

---

## Step 9: Connect GitHub (30 seconds)

1. Click the extension icon in Chrome toolbar
2. Click **"Connect GitHub"**
3. Authorize the app
4. Should see: "Connected ✓"

---

## Step 10: Test It! (2 minutes)

### Test on LeetCode

1. Go to https://leetcode.com/problems/two-sum/
2. Write any solution
3. Click "Submit"
4. Wait for "Accepted"
5. Should see toast: **"✅ Synced to GitHub!"**
6. Check your GitHub: `github.com/YOUR_USERNAME/dsa-solutions`

### Test on GeeksforGeeks

1. Go to https://practice.geeksforgeeks.org/problems/
2. Select any problem
3. Submit solution
4. Wait for success
5. Should see toast notification

---

## ✅ Verification Checklist

- [ ] Backend running on port 3000
- [ ] Worker processing jobs
- [ ] Dashboard accessible at http://localhost:3001
- [ ] Extension loaded in Chrome
- [ ] GitHub connected
- [ ] Test submission synced to GitHub
- [ ] Stats showing in extension popup
- [ ] Dashboard unlocked after 5 solves

---

## 🐛 Troubleshooting

### Extension not loading

**Error**: "Manifest file is missing or unreadable"

**Fix**: Make sure icons exist in `apps/extension/icons/` folder

### Backend not starting

**Error**: "Missing required environment variable"

**Fix**: Check all variables in `.env` are filled

### GitHub push failing

**Error**: "Failed to push to GitHub"

**Fix**: 
- Check GitHub token has `repo` scope
- Verify OAuth app callback URL is correct
- Check worker logs for specific error

### Submission not detected

**Fix**:
- Check browser console (F12) for errors
- Verify you're on a problem page
- Make sure submission shows "Accepted"

### Database connection failed

**Fix**:
- Verify DATABASE_URL is correct
- Check Neon dashboard for connection string
- Ensure database is not paused

---

## 🎉 Success!

You should now have:
- ✅ Extension detecting submissions
- ✅ Auto-syncing to GitHub
- ✅ Stats tracking
- ✅ Dashboard showing progress

## Next Steps

1. Solve 5 problems to unlock dashboard
2. Check `github.com/YOUR_USERNAME/dsa-solutions` for synced code
3. View stats in extension popup
4. Access dashboard at http://localhost:3001/dashboard?jwt=YOUR_JWT

---

## 📚 Additional Resources

- [Extension README](apps/extension/README.md)
- [Backend API Docs](apps/backend/README.md)
- [Testing Guide](TESTING.md)
- [Deployment Guide](DEPLOYMENT.md)

---

## 🆘 Need Help?

Check the troubleshooting section or review:
- Backend logs in Terminal 1
- Worker logs in Terminal 2
- Browser console (F12)
- Extension popup for error messages

Happy coding! 🚀
