# 🚀 Extension Setup - 3 Minutes

## Step 1: Load Extension (30 sec)

```
Chrome → chrome://extensions/ → Developer mode ON → Load unpacked
```

Select folder: `apps/extension`

**Copy Extension ID:**
```
Example: abcdefghijklmnopqrstuvwxyz123456
```

---

## Step 2: GitHub OAuth (1 min)

Go to: https://github.com/settings/developers → New OAuth App

### Fill These Fields:

| Field | Value |
|-------|-------|
| **Application name** | `DSA Auto Sync` |
| **Homepage URL** | `https://github.com/YOUR_USERNAME/dsa-auto-sync` |
| **Authorization callback URL** | `https://YOUR_EXTENSION_ID.chromiumapp.org/oauth2` |

**Example Callback URL:**
```
https://abcdefghijklmnopqrstuvwxyz123456.chromiumapp.org/oauth2
```

Click "Register application"

**Copy:**
- Client ID (e.g., `Ov23liABCDEFGHIJKLMN`)
- Client Secret (click "Generate" first)

---

## Step 3: Update Extension (30 sec)

Open: `apps/extension/popup.js`

**Line 2 - Replace:**
```javascript
const GITHUB_CLIENT_ID = 'Ov23liABCDEFGHIJKLMN'; // Your actual Client ID
```

---

## Step 4: Update Backend (30 sec)

Open: `apps/backend/.env`

**Add:**
```bash
GITHUB_CLIENT_ID=Ov23liABCDEFGHIJKLMN
GITHUB_CLIENT_SECRET=github_pat_11ABCDEFG...
```

---

## Step 5: Reload & Login (30 sec)

1. `chrome://extensions/` → Click reload icon on extension
2. Click extension icon in toolbar
3. Click "Login with GitHub"
4. Authorize the app
5. Done! ✅

---

## 🎯 Summary

**Homepage URL:** Kuch bhi valid URL (GitHub repo link recommended)

**Callback URL:** `https://EXTENSION_ID.chromiumapp.org/oauth2`

**Extension ID kahan milega?** Extension load karne ke baad `chrome://extensions/` pe

---

## ✅ Test It

1. Go to LeetCode
2. Solve any problem
3. Submit → Get "Accepted"
4. See toast: "✅ Synced to GitHub!"
5. Check: `github.com/YOUR_USERNAME/dsa-solutions`

---

## ❌ Troubleshooting

### "redirect_uri_mismatch" error?
- Extension ID sahi hai?
- GitHub OAuth callback URL exactly match karta hai?
- Format: `https://EXTENSION_ID.chromiumapp.org/oauth2` (no trailing slash)

### OAuth popup nahi khul raha?
- popup.js mein GITHUB_CLIENT_ID update kiya?
- Extension reload kiya?
- Browser console check karo (F12)

### Backend se connect nahi ho raha?
- Backend running hai? (`npm run dev:backend`)
- Worker running hai? (`npm run dev:worker`)
- .env file sahi hai?

---

**Need help?** Check `GITHUB_OAUTH_SETUP.md` for detailed guide.
