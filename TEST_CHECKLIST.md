# 🧪 Test Checklist - DSA Auto Sync

## Before You Start

- [ ] Backend is running: `cd apps/backend && npm run dev`
- [ ] Extension is loaded in Chrome: `chrome://extensions/`
- [ ] You have a GitHub account
- [ ] You're ready to test on LeetCode or GFG

---

## ✅ Test 1: Backend Health (30 seconds)

```bash
node scratch/test_backend_health.js
```

**Expected Output:**
```
🔍 Testing Backend Health...
1️⃣ Testing keepalive endpoint...
   ✅ Keepalive endpoint working
```

**Status**: [ ] PASS [ ] FAIL

---

## ✅ Test 2: OAuth Flow (2 minutes) - CRITICAL!

This is the main issue your friend faced!

**Steps:**
1. [ ] Click extension icon in Chrome toolbar
2. [ ] Click "CONNECT WITH GITHUB" button
3. [ ] GitHub authorization page opens
4. [ ] Click "Authorize" button
5. [ ] Success page appears with JWT token
6. [ ] Wait 10 seconds (or close tab)
7. [ ] Click extension icon again
8. [ ] Should show "Connected" with green ✓

**Expected Result:**
- Extension popup shows "Connected" (green text)
- Green checkmark icon
- Button changed to "RECONNECT"
- Stats card visible

**If Failed:**
- [ ] Open extension inspector (right-click icon → Inspect)
- [ ] Check Console for errors
- [ ] Check Application → Storage → Local Storage
- [ ] Look for `jwt` key with value

**Status**: [ ] PASS [ ] FAIL

**Notes:**
_______________________________________

---

## ✅ Test 3: LeetCode Submission (3 minutes)

**Steps:**
1. [ ] Go to https://leetcode.com/problems/two-sum/
2. [ ] Write any solution (doesn't need to be correct)
3. [ ] Click "Submit"
4. [ ] Wait for "Accepted" result
5. [ ] Look for toast notification: "✅ Synced to GitHub!"

**Backend Logs Should Show:**
```
[INFO] ... - 📥 leetcode: Two Sum (easy)
[INFO] ... - 💾 Saved to DB: Two Sum (ID: ...)
[INFO] ... - 🔄 Pushing to GitHub: Two Sum
[INFO] ... - ✅ Pushed to GitHub: Two Sum
```

**GitHub Check:**
1. [ ] Go to github.com/YOUR_USERNAME/dsa-solutions
2. [ ] Navigate to `leetcode/easy/`
3. [ ] File `two-sum.js` exists
4. [ ] File contains your code

**Status**: [ ] PASS [ ] FAIL

**Notes:**
_______________________________________

---

## ✅ Test 4: GFG Title Extraction (3 minutes)

**Steps:**
1. [ ] Go to any GFG problem
2. [ ] Open browser console (F12)
3. [ ] Write a solution
4. [ ] Click "Submit"
5. [ ] Wait for success message

**Console Should Show:**
```
[DSA Sync] Platform detected: GeeksforGeeks
[DSA Sync] Found title via selector "...": Problem Name
[DSA Sync] Extraction attempt: {
  title: "Problem Name",  // ← Should be problem name, NOT code!
  titlePreview: "Problem Name"
}
```

**Backend Logs Should Show:**
```
[INFO] ... - 📥 gfg: Problem Name (medium)
[INFO] ... - 💾 Saved to DB: Problem Name (ID: ...)
[INFO] ... - 🔄 Pushing to GitHub: Problem Name
[INFO] ... - ✅ Pushed to GitHub: Problem Name
```

**GitHub Check:**
1. [ ] Go to github.com/YOUR_USERNAME/dsa-solutions
2. [ ] Navigate to `gfg/medium/` (or appropriate difficulty)
3. [ ] File exists with correct name
4. [ ] File contains your code

**Status**: [ ] PASS [ ] FAIL

**Notes:**
_______________________________________

---

## ✅ Test 5: Duplicate Detection (1 minute)

**Steps:**
1. [ ] Submit the same problem again (from Test 3 or 4)
2. [ ] Wait for result
3. [ ] Look for toast: "ℹ️ Already submitted"

**Backend Logs Should Show:**
```
[INFO] ... - 📥 leetcode: Two Sum (easy)
[INFO] ... - ⏭️ Duplicate: Two Sum
```

**Status**: [ ] PASS [ ] FAIL

---

## ✅ Test 6: Dashboard (1 minute)

**Steps:**
1. [ ] Click extension icon
2. [ ] Click "VIEW DASHBOARD" button
3. [ ] Dashboard opens in new tab

**Dashboard Should Show:**
- [ ] Total problems solved (correct count)
- [ ] Current streak
- [ ] Platform breakdown (LeetCode, GFG counts)
- [ ] Recent submissions list
- [ ] Code preview (expandable)
- [ ] Copy button works

**Status**: [ ] PASS [ ] FAIL

---

## ✅ Test 7: Fresh User (Friend Simulation) (5 minutes)

**Steps:**
1. [ ] Open Chrome in Incognito mode
2. [ ] Load extension (unpacked)
3. [ ] Click "Connect with GitHub"
4. [ ] Authorize
5. [ ] Should show "Connected" ✓
6. [ ] Submit a problem
7. [ ] Check GitHub for file

**Status**: [ ] PASS [ ] FAIL

**Notes:**
_______________________________________

---

## 📊 Test Results Summary

| Test | Status | Notes |
|------|--------|-------|
| 1. Backend Health | [ ] | |
| 2. OAuth Flow | [ ] | CRITICAL |
| 3. LeetCode Submission | [ ] | |
| 4. GFG Title Extraction | [ ] | |
| 5. Duplicate Detection | [ ] | |
| 6. Dashboard | [ ] | |
| 7. Fresh User | [ ] | |

**Overall Status**: [ ] ALL PASS [ ] SOME FAILED

---

## 🚨 If Any Test Failed

### OAuth Flow Failed (Test 2)
**Most Common Issue!**

1. Open extension inspector:
   - Right-click extension icon
   - Click "Inspect popup"
   - Go to Console tab
   - Look for errors

2. Check chrome.storage:
   - Application tab
   - Storage → Local Storage
   - Look for `jwt` key
   - If missing, auth didn't save

3. Check success page:
   - After authorizing GitHub
   - Right-click → Inspect
   - Console should show: "JWT saved to chrome.storage"
   - If not, chrome.storage might be blocked

**Solution:**
- Try in regular Chrome window (not incognito)
- Reload extension
- Clear extension storage
- Try again

### GitHub Push Failed (Test 3 or 4)

1. Check backend logs for error:
   ```
   [ERROR] ... - ❌ GitHub Sync failed: [error message]
   ```

2. Common causes:
   - Invalid GitHub token → Reconnect with GitHub
   - Repository doesn't exist → Backend will create it
   - Network error → Check internet
   - Rate limit → Wait and try again

### Title Extraction Failed (Test 4)

1. Check console logs:
   ```
   [DSA Sync] Extraction attempt: {
     title: "C++ Solutionclass Solution...",  // ← BAD!
   }
   ```

2. If title is code:
   - Share the problem URL
   - Share console logs
   - DOM selectors might need updating

---

## ✅ Ready for Production?

All tests must pass before deploying:

- [ ] Test 1: Backend Health - PASS
- [ ] Test 2: OAuth Flow - PASS (CRITICAL!)
- [ ] Test 3: LeetCode Submission - PASS
- [ ] Test 4: GFG Title Extraction - PASS
- [ ] Test 5: Duplicate Detection - PASS
- [ ] Test 6: Dashboard - PASS
- [ ] Test 7: Fresh User - PASS

**If all pass:**
```bash
# Package extension
cd apps/extension
zip -r ../../dsa-sync-extension.zip . -x "*.git*"

# Share dsa-sync-extension.zip with friends!
```

**If any fail:**
- Check TESTING_GUIDE.md for troubleshooting
- Share error logs
- Don't deploy until fixed

---

## 📝 Notes Section

Use this space to write down any issues, errors, or observations:

```
Test 1 (Backend Health):


Test 2 (OAuth Flow):


Test 3 (LeetCode):


Test 4 (GFG):


Test 5 (Duplicate):


Test 6 (Dashboard):


Test 7 (Fresh User):


Other Notes:


```

---

## 🎯 Priority Order

If you're short on time, test in this order:

1. **Test 2 (OAuth)** - CRITICAL! This is what your friend experienced
2. **Test 3 (LeetCode)** - Core functionality
3. **Test 4 (GFG)** - Title extraction fix
4. **Test 7 (Fresh User)** - Simulates friend's experience
5. **Test 5 (Duplicate)** - Nice to have
6. **Test 6 (Dashboard)** - Nice to have
7. **Test 1 (Backend)** - Quick sanity check

---

**Good luck with testing! 🚀**

Remember: Test 2 (OAuth Flow) is the most important - that's the issue your friend faced!
