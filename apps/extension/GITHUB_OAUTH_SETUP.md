# GitHub OAuth Setup for Chrome Extension

## 📋 Quick Steps

### 1️⃣ Load Extension First
```
1. Chrome → chrome://extensions/
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select: apps/extension folder
5. Copy Extension ID (example: abcdefghijklmnopqrstuvwxyz123456)
```

### 2️⃣ Create GitHub OAuth App
```
1. Go to: https://github.com/settings/developers
2. Click: "OAuth Apps" → "New OAuth App"
3. Fill in:
```

**Application name:**
```
DSA Auto Sync
```

**Homepage URL:**
```
https://github.com/YOUR_USERNAME/dsa-auto-sync
```
(Ya koi bhi valid URL, jaise: https://yourwebsite.com)

**Application description:**
```
Automatically sync DSA solutions to GitHub repository
```

**Authorization callback URL:** (⚠️ IMPORTANT)
```
https://YOUR_EXTENSION_ID.chromiumapp.org/oauth2
```

**Example:**
```
https://abcdefghijklmnopqrstuvwxyz123456.chromiumapp.org/oauth2
```

### 3️⃣ Get Credentials
```
1. Click "Register application"
2. Copy "Client ID" (looks like: Ov23liABCDEFGHIJKLMN)
3. Click "Generate a new client secret"
4. Copy "Client Secret" (save it securely!)
```

### 4️⃣ Update Extension Config
Open `apps/extension/popup.js` and update line 2:
```javascript
const GITHUB_CLIENT_ID = 'Ov23liABCDEFGHIJKLMN'; // Your actual Client ID
```

### 5️⃣ Update Backend .env
Open `apps/backend/.env`:
```bash
GITHUB_CLIENT_ID=Ov23liABCDEFGHIJKLMN
GITHUB_CLIENT_SECRET=github_pat_11ABCDEFG...
```

### 6️⃣ Reload Extension
```
1. Go to chrome://extensions/
2. Click reload icon on DSA Auto Sync extension
3. Click extension icon
4. Click "Login with GitHub"
5. Authorize the app
```

## ✅ Complete Example

### GitHub OAuth App Settings:
```
Application name: DSA Auto Sync
Homepage URL: https://github.com/yourusername/dsa-auto-sync
Authorization callback URL: https://abcdefghijklmnopqrstuvwxyz123456.chromiumapp.org/oauth2
```

### Extension popup.js (line 2):
```javascript
const GITHUB_CLIENT_ID = 'Ov23liABCDEFGHIJKLMN';
```

### Backend .env:
```bash
GITHUB_CLIENT_ID=Ov23liABCDEFGHIJKLMN
GITHUB_CLIENT_SECRET=github_pat_11ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890
```

## 🔍 How to Find Extension ID

### Method 1: Extensions Page
```
1. chrome://extensions/
2. Look under extension name
3. ID: abcdefghijklmnopqrstuvwxyz123456
```

### Method 2: Console
```javascript
// In extension popup, press F12 and run:
chrome.runtime.id
```

## ⚠️ Common Issues

### Issue: "redirect_uri_mismatch"
**Solution:** 
- Extension ID must match exactly in GitHub OAuth callback URL
- Format: `https://YOUR_EXTENSION_ID.chromiumapp.org/oauth2`
- No trailing slash!

### Issue: Extension ID keeps changing
**Reason:** Unpacked extensions get new IDs when reloaded
**Solution:** 
- For development: Update GitHub OAuth URL each time
- For production: Publish to Chrome Web Store (permanent ID)

### Issue: OAuth popup doesn't open
**Solution:**
- Check popup.js has correct GITHUB_CLIENT_ID
- Check manifest.json has "identity" permission
- Check browser console for errors

## 🚀 Production Deployment

When publishing to Chrome Web Store:

1. **Publish extension** → Get permanent Extension ID
2. **Update GitHub OAuth** callback URL with permanent ID
3. **Update popup.js** with production API URL:
   ```javascript
   const API_URL = 'https://api.yourdomain.com/api';
   ```

## 📝 Summary

**Homepage URL:** Kuch bhi valid URL (GitHub repo ya website)
**Callback URL:** `https://EXTENSION_ID.chromiumapp.org/oauth2`

Extension ID milega extension load karne ke baad! 🎯
