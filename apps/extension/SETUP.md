# Extension Setup Guide

## GitHub OAuth App Configuration

### Step 1: Create GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in the details:

```
Application name: DSA Auto Sync
Homepage URL: https://github.com/YOUR_USERNAME/dsa-auto-sync
Application description: Auto-sync DSA solutions to GitHub
Authorization callback URL: https://YOUR_EXTENSION_ID.chromiumapp.org/oauth2
```

**Important:** You'll get the Extension ID after loading the extension in Chrome (Step 2).

### Step 2: Get Extension ID

1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked"
5. Select `apps/extension` folder
6. Copy the Extension ID (looks like: `abcdefghijklmnopqrstuvwxyz123456`)

### Step 3: Update GitHub OAuth Callback URL

1. Go back to your GitHub OAuth App settings
2. Update Authorization callback URL to:
   ```
   https://YOUR_EXTENSION_ID.chromiumapp.org/oauth2
   ```
   Replace `YOUR_EXTENSION_ID` with the actual ID from Step 2

3. Save changes
4. Copy the Client ID and Client Secret

### Step 4: Configure Extension

1. Open `apps/extension/config.js`
2. Replace `YOUR_GITHUB_CLIENT_ID` with your actual Client ID:
   ```javascript
   const CONFIG = {
     API_URL: 'http://localhost:3000/api',
     GITHUB_CLIENT_ID: 'Ov23liABCDEFGHIJKLMN', // Your actual Client ID
   };
   ```

### Step 5: Configure Backend

1. Open `apps/backend/.env`
2. Add your GitHub credentials:
   ```
   GITHUB_CLIENT_ID=Ov23liABCDEFGHIJKLMN
   GITHUB_CLIENT_SECRET=your_client_secret_here
   ```

### Step 6: Reload Extension

1. Go to `chrome://extensions/`
2. Click the reload icon on your extension
3. Click the extension icon
4. Click "Login with GitHub"
5. Authorize the app

## Quick Reference

### Development URLs
```
Extension Redirect URI: https://YOUR_EXTENSION_ID.chromiumapp.org/oauth2
Backend API: http://localhost:3000/api
Dashboard: http://localhost:3001
```

### Production URLs
```
Extension Redirect URI: https://YOUR_EXTENSION_ID.chromiumapp.org/oauth2
Backend API: https://api.yourdomain.com/api
Dashboard: https://dashboard.yourdomain.com
```

## Troubleshooting

### "redirect_uri_mismatch" Error
- Make sure the callback URL in GitHub OAuth App matches exactly:
  `https://YOUR_EXTENSION_ID.chromiumapp.org/oauth2`
- No trailing slash
- Use the correct Extension ID

### Extension ID Changed
- If you reload the extension as "unpacked", the ID might change
- Update the GitHub OAuth callback URL with the new ID
- For production, publish to Chrome Web Store for a permanent ID

### OAuth Flow Not Working
1. Check browser console for errors (F12)
2. Verify GITHUB_CLIENT_ID in config.js
3. Verify backend has correct GITHUB_CLIENT_SECRET
4. Check that backend is running on port 3000

## Alternative: Simple OAuth Flow (Fallback)

If Chrome Identity API doesn't work, you can use the simple tab-based flow:

1. Keep the original `popup.js` code
2. Set GitHub OAuth callback to: `http://localhost:3000/callback`
3. Backend will handle the redirect

This is simpler but less secure for production.

## Production Deployment

For Chrome Web Store:

1. Publish extension to Chrome Web Store
2. Get permanent Extension ID
3. Update GitHub OAuth callback URL
4. Update config.js with production API URL
5. Update manifest.json host_permissions for production domains
