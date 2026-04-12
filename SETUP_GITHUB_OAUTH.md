# 🚀 GitHub OAuth Setup - Step by Step

## Step 1: Create GitHub OAuth App (2 minutes)

### Go to GitHub Settings
1. Open: https://github.com/settings/developers
2. Click **"OAuth Apps"** (left sidebar)
3. Click **"New OAuth App"** button

### Fill the Form
```
Application name: DSA Auto Sync

Homepage URL: https://github.com/YOUR_USERNAME/dsa-auto-sync
(Replace YOUR_USERNAME with your actual GitHub username)

Application description: Automatically sync DSA solutions to GitHub

Authorization callback URL: http://localhost:3000/api/auth/github/callback
```

### Get Credentials
1. Click **"Register application"**
2. You'll see **Client ID** - COPY IT (looks like: `Ov23liABCDEFGHIJKLMN`)
3. Click **"Generate a new client secret"**
4. COPY the **Client Secret** immediately (you won't see it again!)

---

## Step 2: I'll Configure Everything

Once you have:
- ✅ Client ID (example: `Ov23liABCDEFGHIJKLMN`)
- ✅ Client Secret (example: `github_pat_11ABCDEFG...`)

Tell me these values and I'll update:
1. `apps/backend/.env` - Backend configuration
2. `apps/extension/popup.js` - Extension configuration

---

## Quick Reference

### What to Copy from GitHub:

**Client ID** (Public - safe to share):
```
Ov23liABCDEFGHIJKLMN
```

**Client Secret** (Private - keep secret):
```
github_pat_11ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890
```

---

## After I Configure:

1. Reload extension in Chrome (`chrome://extensions/` → reload button)
2. Click extension icon
3. Click "Connect GitHub"
4. Authorize the app
5. Done! ✅

---

## Need Help?

If you're stuck, just:
1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill the form (copy-paste from above)
4. Get Client ID and Secret
5. Share them with me (Client ID is safe to share, Secret should be private but I need it to configure)

Let's do this! 🚀
