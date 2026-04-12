# 🔧 Fix: Extension Shows "Not Connected" Even After GitHub Auth

## Problem
After connecting GitHub, the extension still shows "Not connected" status.

## Why This Happens
The OAuth flow opens in a new window, and the JWT needs to be communicated back to the extension popup.

## ✅ Solution (Updated Flow)

### How It Works Now:
1. Click "CONNECT GITHUB" in extension
2. GitHub auth opens in popup window (not tab)
3. After auth, success page sends JWT back to extension
4. Extension automatically updates to "Connected"

### Steps to Test:

1. **Reload Extension:**
   - Go to `chrome://extensions/`
   - Find "DSA Auto Sync"
   - Click refresh button 🔄

2. **Open Extension Popup:**
   - Click extension icon
   - Should show "Not connected"

3. **Connect GitHub:**
   - Click "CONNECT GITHUB" button
   - New popup window opens (NOT a tab)
   - Authorize on GitHub
   - Success page appears

4. **Check Extension:**
   - Success page will auto-close after 10s
   - Extension popup should now show:
     - Status: "Connected" (green)
     - Icon: ✓ (checkmark)
     - Button: "RECONNECT"

## 🐛 If Still Not Working

### Option 1: Manual JWT Entry (Temporary)

If the automatic flow doesn't work, you can manually save the JWT:

1. After GitHub auth, on success page:
   - Click "Show" button
   - Click "Copy" button
   
2. Open browser console (F12)

3. Run this command:
```javascript
chrome.storage.local.set({ jwt: 'PASTE_YOUR_JWT_HERE' }, () => {
  console.log('JWT saved!');
});
```

4. Reload extension popup

### Option 2: Check Console

1. Open extension popup
2. Right-click → Inspect
3. Check console for errors
4. Should see: `[DSA Sync] Init error:` if something failed

### Option 3: Verify JWT is Saved

Run in console:
```javascript
chrome.storage.local.get('jwt', (result) => {
  console.log('JWT:', result.jwt ? 'EXISTS' : 'NOT FOUND');
});
```

## 🎯 Expected Behavior

### Before Connection:
```
Status: Not connected (gray)
Icon: 🔒
Button: CONNECT GITHUB (purple gradient)
```

### After Connection:
```
Status: Connected (green)
Icon: ✓ (green background)
Button: RECONNECT (gray)
Stats: Visible (if you have solved problems)
```

## 📝 Testing Checklist

- [ ] Extension reloaded
- [ ] Clicked "CONNECT GITHUB"
- [ ] Auth window opened (popup, not tab)
- [ ] Authorized on GitHub
- [ ] Success page appeared
- [ ] Success page auto-closed
- [ ] Extension shows "Connected"
- [ ] Icon changed to ✓

## 🚀 Quick Fix Command

If you just want to test and skip OAuth:

1. Get JWT from backend logs or success page
2. Run in extension console:
```javascript
chrome.storage.local.set({ 
  jwt: 'YOUR_JWT_TOKEN_HERE',
  username: 'YOUR_GITHUB_USERNAME'
}, () => {
  location.reload();
});
```

3. Extension will show "Connected"

---

**Note:** The window.opener communication works when the auth page is opened via `window.open()` (popup), not `chrome.tabs.create()` (new tab). The updated code uses popup windows for proper communication.
