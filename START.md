# ⚡ Quick Start - DSA Auto Sync

## 🎯 Goal
Get the extension running in 10 minutes.

---

## Step 1: Install (1 min)
```bash
npm install
```

## Step 2: Environment (3 min)

Create `apps/backend/.env`:
```bash
DATABASE_URL=postgresql://...  # Get from neon.tech
REDIS_URL=redis://...          # Get from upstash.com
GITHUB_CLIENT_ID=...           # Get from github.com/settings/developers
GITHUB_CLIENT_SECRET=...       # Get from GitHub OAuth app
JWT_SECRET=any_random_32_char_string_here_works
ENCRYPTION_KEY=                # Generate below
PORT=3000
CORS_ORIGIN=*
NODE_ENV=development
```

Generate encryption key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 3: Database (1 min)
```bash
npm run db:generate
npm run db:push
```

## Step 4: Icons (1 min)
```bash
# Open in browser
start apps/extension/icons/create-simple-icons.html

# Click "Download All Icons"
# Save to apps/extension/icons/
```

## Step 5: Configure Extension (30 sec)

Edit `apps/extension/popup.js` line 7:
```javascript
const GITHUB_CLIENT_ID = 'YOUR_ACTUAL_CLIENT_ID';
```

## Step 6: Start Services (1 min)

**Terminal 1:**
```bash
npm run dev:backend
```

**Terminal 2:**
```bash
npm run dev:worker
```

**Terminal 3:**
```bash
npm run dev:dashboard
```

## Step 7: Load Extension (1 min)

1. Chrome → `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `apps/extension` folder
5. Done! ✅

## Step 8: Connect (30 sec)

1. Click extension icon
2. Click "Connect GitHub"
3. Authorize
4. See "Connected ✓"

## Step 9: Test (1 min)

1. Go to https://leetcode.com/problems/two-sum/
2. Submit any solution
3. Wait for "Accepted"
4. See toast: "✅ Synced to GitHub!"
5. Check: `github.com/YOUR_USERNAME/dsa-solutions`

---

## ✅ Success!

You should now have:
- Extension working
- GitHub syncing
- Stats tracking
- Dashboard ready (after 5 solves)

---

## 🐛 Issues?

See [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) for troubleshooting.

---

## 📚 Full Guide

For detailed setup: [SETUP.md](SETUP.md)
