# 🔧 GitHub OAuth Configuration - CRITICAL!

## ⚠️ IMPORTANT: Update GitHub OAuth App Settings

Your friend is getting connection errors because the GitHub OAuth callback URL might be wrong.

---

## 📋 Steps to Fix:

### 1. Go to GitHub Developer Settings

1. Open: https://github.com/settings/developers
2. Click on **"OAuth Apps"**
3. Find your app: **"DSA Auto Sync"** (or whatever you named it)
4. Click on the app name

### 2. Update These Settings:

**Homepage URL:**
```
https://dsa-sync-backend.onrender.com
```

**Authorization callback URL:** (MOST IMPORTANT!)
```
https://dsa-sync-backend.onrender.com/api/auth/github/callback
```

⚠️ **Make sure it's EXACTLY this URL!**
- Must be `https://` (not `http://`)
- Must be `dsa-sync-backend.onrender.com` (not `localhost`)
- Must end with `/api/auth/github/callback`

### 3. Save Changes

Click **"Update application"** button at the bottom.

---

## 🔍 Current Configuration Check:

Your `.env` file has:
```
GITHUB_CLIENT_ID=Ov23lixTaTeICwY4oD9L
GITHUB_CLIENT_SECRET=436121c0b05e819233b6df61bc3870c323de9df4
```

**Verify on GitHub:**
- Client ID should match: `Ov23lixTaTeICwY4oD9L`
- If different, update `.env` file

---

## 🚨 Common Mistakes:

❌ **Wrong:** `http://localhost:3000/api/auth/github/callback`
❌ **Wrong:** `https://dsa-sync-backend.onrender.com/auth/github/callback` (missing `/api`)
❌ **Wrong:** `https://dsa-sync-backend.onrender.com/api/auth/callback` (missing `/github`)

✅ **Correct:** `https://dsa-sync-backend.onrender.com/api/auth/github/callback`

---

## 🧪 Test After Fixing:

1. Update GitHub OAuth settings
2. Wait 1-2 minutes for changes to propagate
3. Try connecting from extension again
4. Should redirect to success page
5. Extension should show "Connected" ✓

---

## 📸 Screenshot Reference:

Your GitHub OAuth App settings should look like this:

```
Application name: DSA Auto Sync (or your app name)
Homepage URL: https://dsa-sync-backend.onrender.com
Authorization callback URL: https://dsa-sync-backend.onrender.com/api/auth/github/callback
```

---

## ✅ Verification:

After updating, test the full URL in browser:
```
https://github.com/login/oauth/authorize?client_id=Ov23lixTaTeICwY4oD9L&scope=repo&redirect_uri=https://dsa-sync-backend.onrender.com/api/auth/github/callback
```

This should:
1. Show GitHub authorization page
2. After clicking "Authorize", redirect to your success page
3. Show JWT token and username

If this works, your friend's extension will work too!

---

## 🔄 If You Need to Recreate OAuth App:

If settings are messed up, create a new OAuth App:

1. Go to: https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name:** DSA Auto Sync
   - **Homepage URL:** `https://dsa-sync-backend.onrender.com`
   - **Authorization callback URL:** `https://dsa-sync-backend.onrender.com/api/auth/github/callback`
4. Click **"Register application"**
5. Copy the **Client ID** and **Client Secret**
6. Update `apps/backend/.env`:
   ```
   GITHUB_CLIENT_ID=<new_client_id>
   GITHUB_CLIENT_SECRET=<new_client_secret>
   ```
7. Redeploy backend to Render with new env vars

---

**Fix this first, then test again!**
