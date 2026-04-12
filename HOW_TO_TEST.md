# 🧪 How to Test DSA Auto Sync Extension

## ✅ Prerequisites Check

Before testing, make sure:
- ✅ Backend running on port 3000
- ✅ Worker running (processing queue)
- ✅ Dashboard running on port 3001
- ✅ Extension loaded in Chrome
- ✅ GitHub connected (JWT token saved)

## 🎯 Testing Steps

### 1. Verify Extension is Loaded

1. Go to `chrome://extensions/`
2. Find "DSA Auto Sync"
3. Make sure it's **enabled**
4. Check that it shows:
   - Version: 1.0.0
   - Service worker: Active
   - No errors

### 2. Connect GitHub (If Not Already)

1. Click extension icon
2. Click "CONNECT GITHUB" button
3. Authorize on GitHub
4. You should see success page
5. Extension popup should show "Connected" status

### 3. Test on LeetCode

#### Option A: Easy Test Problem

1. Go to: https://leetcode.com/problems/two-sum/
2. Select any language (JavaScript, Python, etc.)
3. Write a simple solution:

```javascript
var twoSum = function(nums, target) {
    for(let i = 0; i < nums.length; i++) {
        for(let j = i + 1; j < nums.length; j++) {
            if(nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
};
```

4. Click "Submit" (not "Run")
5. Wait for "Accepted" result

#### What Should Happen:

✅ Green toast appears: "✅ Synced to GitHub!"
✅ Check browser console (F12) for logs:
   - `[DSA Sync] Submission detected: Two Sum`
   - `[DSA Sync] Initialized on leetcode`

✅ Check backend terminal for:
   - `[INFO] Processing submission...`
   - `[INFO] Pushed to GitHub...`

✅ Check your GitHub repo:
   - Go to: https://github.com/YOUR_USERNAME/dsa-solutions
   - Should see new file: `leetcode/easy/two-sum.js`

### 4. Test on GeeksforGeeks

1. Go to: https://practice.geeksforgeeks.org/problems/
2. Pick any easy problem
3. Submit solution
4. Wait for "Success" result
5. Same checks as LeetCode

### 5. Check Stats

1. Click extension icon
2. Should see:
   - Total Solved: 1 (or more)
   - Streak: 1 🔥

3. After 5 problems:
   - "VIEW DASHBOARD" button appears
   - Click it to see full dashboard

## 🐛 Troubleshooting

### Extension Not Detecting Submission

**Check Console (F12):**
```
[DSA Sync] Initialized on leetcode
```
If you don't see this, extension didn't load.

**Fix:**
1. Reload extension: `chrome://extensions/` → Click refresh
2. Reload LeetCode page
3. Try again

### Toast Shows "⚠️ Sync failed"

**Check:**
1. Backend running? → `http://localhost:3000/health`
2. JWT token valid? → Click extension, should show "Connected"
3. Check backend logs for errors

**Fix:**
1. Reconnect GitHub in extension
2. Restart backend: `npm run dev:backend`

### No File in GitHub Repo

**Check:**
1. Worker running? → Should see logs in worker terminal
2. Redis connected? → Check worker logs
3. GitHub token valid? → Try reconnecting

**Fix:**
1. Restart worker: `npm run dev:worker`
2. Check `.env` has correct GitHub credentials

### Content Script Not Running

**Check Manifest:**
- URL pattern matches: `https://leetcode.com/problems/*`
- Content script injected: Check in DevTools → Sources

**Fix:**
1. Make sure you're on a problem page (not homepage)
2. Reload extension
3. Hard refresh page (Ctrl+Shift+R)

## 📊 Verify Everything Works

### Backend Logs Should Show:
```
[INFO] 🚀 Server running on port 3000
[INFO] Submission received from user: YOUR_USERNAME
[INFO] Added to queue: job-123
```

### Worker Logs Should Show:
```
[INFO] 🔄 Worker started
[INFO] Processing job: job-123
[INFO] Pushed to GitHub: leetcode/easy/two-sum.js
[INFO] Stats updated
```

### Extension Console Should Show:
```
[DSA Sync] Initialized on leetcode
[DSA Sync] Submission detected: Two Sum
[DSA Sync] Message sent to background
```

## 🎉 Success Indicators

✅ Toast notification appears
✅ File created in GitHub repo
✅ Stats updated in extension
✅ Dashboard shows problem (after 5 solves)
✅ No errors in any console

## 🔍 Quick Debug Commands

```bash
# Check backend health
curl http://localhost:3000/health

# Check if Redis is connected
# (Should see no errors in worker logs)

# Check database
# (Should see users table with your GitHub username)
```

## 📝 Test Checklist

- [ ] Extension loaded and enabled
- [ ] GitHub connected (shows "Connected")
- [ ] Backend running (port 3000)
- [ ] Worker running (processing queue)
- [ ] Submitted problem on LeetCode
- [ ] Saw "✅ Synced to GitHub!" toast
- [ ] File appeared in GitHub repo
- [ ] Stats updated in extension
- [ ] No errors in console

If all checked ✅ → **System is working perfectly!** 🎊

## 🚀 Next Steps

After successful test:
1. Solve more problems to unlock dashboard (5 total)
2. Check streak by solving daily
3. View stats on dashboard
4. Share your GitHub repo!

---

**Need Help?**
- Check backend logs: Terminal running `npm run dev:backend`
- Check worker logs: Terminal running `npm run dev:worker`
- Check extension console: F12 on LeetCode page
- Check background script: `chrome://extensions/` → DSA Auto Sync → Service Worker → Console
