# 🚀 Production Setup Complete

## ✅ Deployed Services

- **Backend + Worker**: https://dsa-sync-backend.onrender.com
- **Dashboard**: https://sync-dsa-dashboard.vercel.app
- **Extension**: Load locally from `apps/extension` folder

## 🔧 GitHub OAuth Update Required

### Update Callback URL:

1. Go to: https://github.com/settings/developers
2. Select your OAuth App (Client ID: `Ov23lixTaTeICwY4oD9L`)
3. Update **Authorization callback URL** to:
   ```
   https://dsa-sync-backend.onrender.com/api/auth/github/callback
   ```
4. Click **Update application**

### Optional: Support Both Local + Production

Add both URLs (one per line):
```
http://localhost:3000/api/auth/github/callback
https://dsa-sync-backend.onrender.com/api/auth/github/callback
```

## 📦 Extension Installation

1. Go to `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select `apps/extension` folder
5. Extension will now use production URLs

## 🧪 Testing

1. Open extension popup
2. Click **CONNECT TO GITHUB**
3. Authorize the app
4. Go to LeetCode/GFG and solve a problem
5. Check GitHub repo for new file
6. Check dashboard: https://sync-dsa-dashboard.vercel.app/dashboard

## 🔄 Update Extension (After Code Changes)

1. Make changes in `apps/extension/`
2. Go to `chrome://extensions/`
3. Click **Reload** button on DSA Auto Sync extension
4. Changes will be applied

## 📝 Notes

- Extension files are NOT published to Chrome Web Store
- Users load extension locally (unpacked)
- Backend and Worker run on Render (free tier)
- Dashboard runs on Vercel (free tier)
- No monthly costs! 🎉

## 🐛 Troubleshooting

### Extension not connecting:
- Check GitHub OAuth callback URL is updated
- Check browser console for errors
- Reload extension from `chrome://extensions/`

### Submissions not syncing:
- Check backend logs on Render dashboard
- Verify JWT token in extension storage
- Check worker is running on Render

### Dashboard not loading:
- Verify backend URL in Vercel environment variables
- Check browser console for CORS errors
