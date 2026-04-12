# 🔧 Configure GitHub OAuth

## Problem
You're seeing 404 error because GitHub Client ID is not configured.

## Solution

### Step 1: Create GitHub OAuth App (2 minutes)

1. Go to: https://github.com/settings/developers
2. Click **"OAuth Apps"** → **"New OAuth App"**
3. Fill in:
   - **Application name**: `DSA Auto Sync`
   - **Homepage URL**: `https://github.com/YOUR_USERNAME/dsa-auto-sync`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/github/callback`
4. Click **"Register application"**
5. Copy the **Client ID** (looks like: `Ov23liABCDEFGHIJKLMN`)
6. Click **"Generate a new client secret"**
7. Copy the **Client Secret**

### Step 2: Update Extension (30 seconds)

Open: `apps/extension/popup.js`

Find line 7:
```javascript
const GITHUB_CLIENT_ID = 'YOUR_GITHUB_CLIENT_ID'; // Replace this
```

Replace with your actual Client ID:
```javascript
const GITHUB_CLIENT_ID = 'Ov23liABCDEFGHIJKLMN'; // Your actual Client ID
```

### Step 3: Update Backend (30 seconds)

Open: `apps/backend/.env`

Add these lines:
```bash
GITHUB_CLIENT_ID=Ov23liABCDEFGHIJKLMN
GITHUB_CLIENT_SECRET=github_pat_11ABCDEFG...
```

### Step 4: Reload Extension (10 seconds)

1. Go to `chrome://extensions/`
2. Find "DSA Auto Sync"
3. Click the **reload** icon (circular arrow)
4. Click extension icon again
5. Click "Connect GitHub"
6. Should work now! ✅

---

## Quick Example

If your GitHub Client ID is: `Ov23liXYZ123ABC`

Then in `popup.js` line 7:
```javascript
const GITHUB_CLIENT_ID = 'Ov23liXYZ123ABC';
```

And in `.env`:
```bash
GITHUB_CLIENT_ID=Ov23liXYZ123ABC
GITHUB_CLIENT_SECRET=github_pat_11ABCDEFGHIJKLMNOP...
```

---

## ⚠️ Important Notes

- Client ID is PUBLIC (safe to put in extension)
- Client Secret is PRIVATE (only in backend .env)
- Callback URL must be: `http://localhost:3000/api/auth/github/callback`
- For production, update callback URL to your deployed backend

---

## 🎯 After Configuration

1. Reload extension
2. Click "Connect GitHub"
3. Authorize on GitHub
4. Should see "Connected ✓"
5. Start solving problems!
