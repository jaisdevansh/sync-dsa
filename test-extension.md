# DSA Sync Extension - Complete Testing Guide

## Pre-requisites Checklist ✅

### 1. Extension Setup
- [ ] Extension installed in Chrome
- [ ] Extension reloaded after latest changes
- [ ] Extension icon visible in toolbar

### 2. GitHub Connection
- [ ] Open extension popup (click icon)
- [ ] Click "CONNECT" button
- [ ] Authorize GitHub access
- [ ] Verify "Connected" status shows in popup

### 3. Backend Status
- [ ] Backend deployed on Render: `https://dsa-sync-backend.onrender.com`
- [ ] Worker service running
- [ ] Check health endpoint: `https://dsa-sync-backend.onrender.com/health`

## Testing Steps

### Test 1: LeetCode Submission
1. Go to any LeetCode problem
2. Open Console (F12)
3. Verify logs:
   ```
   [DSA Sync] Checking platform
   [DSA Sync] Platform detected: LeetCode
   [DSA Sync] Initialized on leetcode
   [DSA Sync] Extension connected successfully
   ```
4. Solve and submit problem
5. Wait for "Accepted" result
6. Check console for:
   ```
   [DSA Sync] Extraction attempt
   [DSA Sync] Full data
   [DSA Sync] Submission detected
   [DSA Sync] Service worker is alive
   ```
7. Look for toast: "✅ Synced to GitHub!"
8. Verify on GitHub: Check your repo for new file in `leetcode/[difficulty]/[problem-name].js`

### Test 2: GeeksforGeeks Submission
1. Go to any GFG problem: `www.geeksforgeeks.org/problems/...`
2. Open Console (F12)
3. Verify logs:
   ```
   [DSA Sync] Checking platform
   [DSA Sync] Platform detected: GeeksforGeeks
   [DSA Sync] Initialized on gfg
   [DSA Sync] Extension connected successfully
   [DSA Sync] Setting up GFG submit button listener
   ```
4. Solve and submit problem
5. Wait for "Problem Solved Successfully"
6. Check console for:
   ```
   [DSA Sync] Checking if GFG submission is accepted
   [DSA Sync] Found success text
   [DSA Sync] Extraction attempt
   [DSA Sync] Full data
   [DSA Sync] Submission detected
   ```
7. Look for toast: "✅ Synced to GitHub!"
8. Verify on GitHub: Check your repo for new file in `gfg/[difficulty]/[problem-name].cpp`

## Common Issues & Solutions

### Issue: "Extension context invalidated"
**Solution:** Reload the page (F5) after reloading extension

### Issue: "Please reload this page to sync"
**Solution:** Press F5 to refresh the page

### Issue: No logs in console
**Solution:** 
- Check if you're on correct URL pattern
- LeetCode: `leetcode.com/problems/*`
- GFG: `geeksforgeeks.org/problems/*`

### Issue: "Not authenticated" error
**Solution:** 
- Open extension popup
- Click CONNECT button
- Complete GitHub OAuth

### Issue: Code not extracted
**Solution:**
- Make sure code is in editor before submitting
- Try submitting again
- Check console for extraction logs

### Issue: GitHub push failed
**Solution:**
- Check backend logs on Render
- Verify GitHub token is valid
- Check worker service is running

## Verification Commands

### Check Backend Health
```bash
curl https://dsa-sync-backend.onrender.com/health
```

Expected response:
```json
{"status":"ok","timestamp":"2024-..."}
```

### Check Your Stats
Open extension popup - should show:
- Total Solved count
- Current streak
- "Connected" status

### Check GitHub Repo
Visit: `https://github.com/[your-username]/dsa-solutions`

Should see folders:
- `leetcode/easy/`
- `leetcode/medium/`
- `leetcode/hard/`
- `gfg/easy/`
- `gfg/medium/`
- `gfg/hard/`

## Success Criteria ✅

Extension is working correctly if:
1. ✅ Console shows platform detection
2. ✅ Extension ID is logged
3. ✅ Submission is extracted (title + code)
4. ✅ Toast notification appears
5. ✅ File appears on GitHub within 30 seconds
6. ✅ Stats update in extension popup

## Debug Mode

To enable detailed logging:
1. Open Console (F12)
2. All logs prefixed with `[DSA Sync]`
3. Check for any red errors
4. Share screenshot if issues persist

## Support

If issues persist after following this guide:
1. Take screenshot of console logs
2. Check Render backend logs
3. Verify extension is latest version
4. Try on different problem
