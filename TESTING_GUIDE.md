# Testing Guide - DSA Auto Sync

## Quick Start Testing

### Step 1: Start Backend Locally

```bash
cd apps/backend
npm run dev
```

**Expected Output:**
```
[INFO] 2026-04-19... - 🔄 Running database migrations...
[INFO] 2026-04-19... - ✅ Migrations completed successfully
{"level":30,"time":...,"msg":"Server listening at http://0.0.0.0:3000"}
[INFO] 2026-04-19... - 🚀 Server running on port 3000
[INFO] 2026-04-19... - 📝 Environment: development
[INFO] 2026-04-19... - ⚠️ Queue disabled - Direct GitHub push enabled
[INFO] 2026-04-19... - ⏰ Auto-keepalive disabled (development mode)
```

### Step 2: Test Backend Health

```bash
node scratch/test_backend_health.js
```

This will verify the backend is running and accessible.

### Step 3: Load Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `apps/extension` folder
5. Extension should appear with DSA Auto Sync icon

### Step 4: Test GitHub OAuth

1. Click the extension icon in Chrome toolbar
2. Click "CONNECT WITH GITHUB"
3. You'll be redirected to GitHub authorization page
4. Click "Authorize" to grant permissions
5. You'll see a success page with your JWT token
6. **Wait 10 seconds** or close the tab manually
7. Click extension icon again
8. Should now show "Connected" with green checkmark ✓

**If it still shows "Connect with GitHub":**
- Open Chrome DevTools (F12)
- Go to Application tab → Storage → Local Storage → chrome-extension://...
- Check if `jwt` key exists with a value
- If not, there's an issue with the auth flow

### Step 5: Test LeetCode Submission

1. Go to any LeetCode problem (e.g., https://leetcode.com/problems/two-sum/)
2. Write a solution
3. Click "Submit"
4. Wait for "Accepted" result
5. Look for toast notification: "✅ Synced to GitHub!"

**Check Backend Logs:**
```
[INFO] ... - 📥 leetcode: Two Sum (easy)
[INFO] ... - 💾 Saved to DB: Two Sum (ID: ...)
[INFO] ... - 🔄 Pushing to GitHub: Two Sum
[INFO] ... - ✅ Pushed to GitHub: Two Sum
```

**Check GitHub:**
- Go to your GitHub profile
- Find the `dsa-solutions` repository
- Navigate to `leetcode/easy/`
- You should see `two-sum.js` (or appropriate extension)

### Step 6: Test GFG Submission

1. Go to any GFG problem (e.g., https://www.geeksforgeeks.org/problems/...)
2. Write a solution
3. Click "Submit"
4. Wait for "Problem Solved Successfully" or "All test cases passed"
5. Look for toast notification: "✅ Synced to GitHub!"

**Check Backend Logs:**
```
[INFO] ... - 📥 gfg: Problem Name (medium)
[INFO] ... - 💾 Saved to DB: Problem Name (ID: ...)
[INFO] ... - 🔄 Pushing to GitHub: Problem Name
[INFO] ... - ✅ Pushed to GitHub: Problem Name
```

**Check Extension Console:**
1. Right-click extension icon → "Inspect popup"
2. Go to Console tab
3. Look for:
   - `[DSA Sync] Platform detected: GeeksforGeeks`
   - `[DSA Sync] Found title via selector "...": Problem Name`
   - `[DSA Sync] Extraction attempt: { title: "Problem Name", ... }`

### Step 7: Test Dashboard

1. Click extension icon
2. Click "VIEW DASHBOARD" button
3. Dashboard should open in new tab
4. Should show:
   - Total problems solved
   - Current streak
   - Platform breakdown (LeetCode, GFG)
   - Recent submissions with code preview

---

## Troubleshooting

### Issue: "Connect with GitHub" still showing after auth

**Solution:**
1. Open extension popup
2. Right-click → Inspect
3. Go to Console tab
4. Look for errors
5. Check Application → Storage → Local Storage
6. Verify `jwt` key exists

**If JWT is missing:**
- The success page might not be saving to chrome.storage
- Check if you're testing in incognito mode (storage might be restricted)
- Try regular Chrome window

### Issue: Title showing code instead of problem name

**Solution:**
1. Open browser console on the problem page (F12)
2. Look for `[DSA Sync]` logs
3. Check the extraction attempt log:
   ```
   [DSA Sync] Extraction attempt: {
     title: "...",
     titlePreview: "..."
   }
   ```
4. If title is wrong, the DOM selectors need updating
5. Share the console logs and problem URL

### Issue: GitHub push failing

**Check Backend Logs:**
```
[INFO] ... - 📥 gfg: Problem Name (medium)
[INFO] ... - 💾 Saved to DB: Problem Name (ID: ...)
[INFO] ... - 🔄 Pushing to GitHub: Problem Name
[ERROR] ... - ❌ GitHub Sync failed for Problem Name: [error message]
```

**Common Causes:**
1. **Invalid GitHub token**: Token might be expired or invalid
   - Reconnect with GitHub in extension
2. **Repository doesn't exist**: Backend will try to create it
   - Check GitHub for `dsa-solutions` repo
3. **Network error**: Check internet connection
4. **Rate limit**: GitHub API rate limit exceeded (60 requests/hour for unauthenticated)

### Issue: Duplicate submissions

**Expected Behavior:**
- Extension checks if problem was already submitted
- If duplicate within 30 seconds, shows: "ℹ️ Already submitted"
- Backend also checks database for duplicates

**If seeing duplicates on GitHub:**
- Check backend logs for "⏭️ Duplicate: ..." message
- If not appearing, duplicate detection might be failing

### Issue: Stats showing wrong count

**Solution:**
Run this SQL in Neon console:

```sql
-- First, check current stats
SELECT * FROM stats WHERE user_id = 1; -- Replace with your user ID

-- Then recalculate
UPDATE stats 
SET 
  total_solved = (SELECT COUNT(*) FROM submissions WHERE user_id = stats.user_id),
  easy_count = (SELECT COUNT(*) FROM submissions WHERE user_id = stats.user_id AND difficulty = 'easy'),
  medium_count = (SELECT COUNT(*) FROM submissions WHERE user_id = stats.user_id AND difficulty = 'medium'),
  hard_count = (SELECT COUNT(*) FROM submissions WHERE user_id = stats.user_id AND difficulty = 'hard'),
  leetcode_count = (SELECT COUNT(*) FROM submissions WHERE user_id = stats.user_id AND platform = 'leetcode'),
  gfg_count = (SELECT COUNT(*) FROM submissions WHERE user_id = stats.user_id AND platform = 'gfg'),
  cn_count = (SELECT COUNT(*) FROM submissions WHERE user_id = stats.user_id AND platform = 'codingninjas')
WHERE user_id = 1; -- Replace with your user ID

-- Verify
SELECT * FROM stats WHERE user_id = 1;
```

---

## Testing with Friends

### Before Sharing Extension:

1. **Verify backend is deployed to Render**
   - Check `apps/extension/background.js` has production URL
   - Current: `https://dsa-sync-backend.onrender.com/api` ✅

2. **Package extension:**
   ```bash
   # From project root
   cd apps/extension
   zip -r ../../dsa-sync-extension.zip . -x "*.git*" -x "*node_modules*"
   ```

3. **Share the ZIP file** with friends

4. **Installation instructions for friends:**
   - Download the ZIP file
   - Extract it to a folder
   - Open Chrome → `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the extracted folder
   - Click extension icon
   - Click "Connect with GitHub"
   - Authorize the app
   - Start solving problems!

### Testing Friend's Connection:

1. Ask friend to click "Connect with GitHub"
2. They should see GitHub authorization page
3. After authorizing, they should see success page
4. Extension should show "Connected" with green checkmark
5. Ask them to submit a problem
6. Check backend logs for their submission
7. Verify their GitHub repo has the file

---

## Production Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Environment variables set on Render
- [ ] Database migrations run successfully
- [ ] Extension uses production API URL
- [ ] Test OAuth flow in production
- [ ] Test LeetCode submission in production
- [ ] Test GFG submission in production
- [ ] Verify GitHub push works in production
- [ ] Test dashboard with production data
- [ ] Package extension as ZIP
- [ ] Share with friends and get feedback

---

## Useful Commands

### Backend
```bash
# Start development server
cd apps/backend
npm run dev

# Check logs
# (logs appear in terminal)

# Run migrations manually
node src/db/migrate.js
```

### Database (Neon SQL Console)
```sql
-- View all submissions
SELECT * FROM submissions ORDER BY created_at DESC LIMIT 10;

-- View stats
SELECT * FROM stats;

-- Delete a submission
DELETE FROM submissions WHERE id = 6;

-- Recalculate stats (see above)
```

### Extension
```bash
# Package for distribution
cd apps/extension
zip -r ../../dsa-sync-extension.zip . -x "*.git*"

# Reload extension in Chrome
# Go to chrome://extensions/ and click reload icon
```

### Dashboard
```bash
# Start development server
cd apps/dashboard
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

---

## Expected Behavior Summary

### ✅ Successful Flow:

1. User connects with GitHub → Extension shows "Connected" ✓
2. User submits problem → Toast shows "✅ Synced to GitHub!"
3. Backend logs show: 📥 → 💾 → 🔄 → ✅
4. GitHub repo has new file
5. Dashboard shows updated stats
6. Duplicate submission → Toast shows "ℹ️ Already submitted"

### ❌ Error Scenarios:

1. **Not authenticated**: Toast shows "⚠️ Not authenticated. Please login first."
2. **GitHub push failed**: Toast shows "⚠️ Saved to DB, but GitHub failed: [error]"
3. **Network error**: Toast shows "⚠️ Sync failed: [error]"
4. **Extension context invalidated**: Toast shows "⚠️ Please reload this page to sync"

---

## Debug Mode

To enable more detailed logging:

### Extension Console:
1. Right-click extension icon → Inspect popup
2. Console tab shows all `[DSA Sync]` logs

### Content Script Console:
1. Open problem page (LeetCode/GFG)
2. Press F12 → Console tab
3. Look for `[DSA Sync]` logs

### Backend Logs:
- All logs appear in terminal where `npm run dev` is running
- Look for emoji indicators: 📥 💾 🔄 ✅ ❌

---

## Success Indicators

You'll know everything is working when:

1. ✅ Extension shows "Connected" with green checkmark
2. ✅ Backend logs show complete flow: 📥 → 💾 → 🔄 → ✅
3. ✅ GitHub repo has the submitted file
4. ✅ Dashboard shows correct stats
5. ✅ Toast notifications appear on submission
6. ✅ No errors in console or backend logs

---

## Need Help?

If you encounter issues:

1. Check backend logs for errors
2. Check extension console for errors
3. Check browser console on problem page
4. Verify environment variables are set
5. Ensure database is accessible
6. Check GitHub token is valid
7. Share logs and error messages for debugging
