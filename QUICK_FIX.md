# 🚨 QUICK FIX: Content Script Not Working

## Problem
LeetCode aur GFG dono pe extension kaam nahi kar raha.

## Root Cause
Content script load nahi ho raha hai.

## ✅ INSTANT FIX

### Step 1: Extension Reload (MUST DO)

1. Go to: `chrome://extensions/`
2. Find "DSA Auto Sync"
3. Click **REMOVE** button
4. Click **Load unpacked** again
5. Select: `C:\Users\devan\OneDrive\Desktop\sync\apps\extension`

### Step 2: Test on LeetCode

1. Go to: https://leetcode.com/problems/two-sum/
2. Press **F12** (open console)
3. You should see:
   ```
   [DSA Sync] Initialized on leetcode
   ```

### Step 3: If Still Not Working

Content script me issue hai. Let me add debug logs:

**Open:** `apps/extension/content.js`

**Add this at the VERY TOP (line 1):**
```javascript
console.log('🔥 DSA SYNC CONTENT SCRIPT LOADED!');
```

Then reload extension and check console.

## 🎯 Alternative: Manual Test

Agar content script load nahi ho raha, toh manually test karo:

### On LeetCode Page:

1. Open console (F12)
2. Paste this code:
```javascript
// Manual submission test
chrome.runtime.sendMessage({
  type: 'SUBMISSION_DETECTED',
  data: {
    title: 'Two Sum',
    difficulty: 'easy',
    code: 'function twoSum() { return [0,1]; }',
    language: 'javascript',
    platform: 'leetcode'
  }
}, (response) => {
  console.log('Response:', response);
});
```

3. Check backend logs - should see submission!

## 🔍 Debug Checklist

Run this in LeetCode console:
```javascript
// Check if extension is accessible
console.log('Chrome runtime:', typeof chrome.runtime);

// Check current URL
console.log('URL:', window.location.href);

// Check if matches pattern
console.log('Matches:', window.location.href.includes('leetcode.com/problems/'));
```

## 📝 Expected Output

### Console (F12):
```
🔥 DSA SYNC CONTENT SCRIPT LOADED!
[DSA Sync] Initialized on leetcode
```

### After Submit:
```
[DSA Sync] Submission detected: Two Sum
```

### Backend Terminal:
```
[INFO] Submission received from user: jaisdevansh
[INFO] Added to queue: job-123
```

### Worker Terminal:
```
[INFO] Processing job: job-123
[INFO] Pushed to GitHub: leetcode/easy/two-sum.js
```

## 🚀 Quick Commands

```bash
# Check if backend is running
curl http://localhost:3000/health

# Check extension files exist
ls apps/extension/content.js
ls apps/extension/background.js
ls apps/extension/manifest.json
```

## ⚡ FASTEST FIX

1. **Remove extension completely**
2. **Reload it fresh**
3. **Hard refresh LeetCode page** (Ctrl+Shift+R)
4. **Check console** (F12)
5. **Should see:** `[DSA Sync] Initialized on leetcode`

If you see that message → Extension is working!
If NOT → Content script has issue

## 🎯 Test Right Now

1. Open: https://leetcode.com/problems/two-sum/
2. Press F12
3. Look for: `[DSA Sync] Initialized on leetcode`

**Dikha?** YES / NO

Batao kya dikha, main fix kar dunga! 🔥
