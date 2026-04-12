# 🚀 Launch Checklist - DSA Auto Sync

Use this checklist before launching the extension.

## ✅ Pre-Launch Checklist

### Environment Setup
- [ ] Node.js 18+ installed
- [ ] All dependencies installed (`npm install`)
- [ ] Neon PostgreSQL database created
- [ ] Upstash Redis database created
- [ ] GitHub OAuth app created

### Configuration
- [ ] `apps/backend/.env` file created and filled
- [ ] `DATABASE_URL` configured
- [ ] `REDIS_URL` configured
- [ ] `GITHUB_CLIENT_ID` configured
- [ ] `GITHUB_CLIENT_SECRET` configured
- [ ] `JWT_SECRET` generated (32+ chars)
- [ ] `ENCRYPTION_KEY` generated (64 char hex)
- [ ] Extension `popup.js` updated with Client ID

### Database
- [ ] Migrations generated (`npm run db:generate`)
- [ ] Schema pushed to database (`npm run db:push`)
- [ ] Database connection tested

### Extension Icons
- [ ] `icon16.png` exists in `apps/extension/icons/`
- [ ] `icon48.png` exists in `apps/extension/icons/`
- [ ] `icon128.png` exists in `apps/extension/icons/`

### Services Running
- [ ] Backend API running (`npm run dev:backend`)
- [ ] Worker running (`npm run dev:worker`)
- [ ] Dashboard running (`npm run dev:dashboard`)
- [ ] No errors in any terminal

### Extension
- [ ] Extension loaded in Chrome
- [ ] No errors in `chrome://extensions/`
- [ ] Extension icon visible in toolbar
- [ ] Popup opens without errors

### GitHub OAuth
- [ ] OAuth app callback URL correct
- [ ] Can click "Connect GitHub" in popup
- [ ] OAuth flow completes successfully
- [ ] JWT stored in extension storage
- [ ] Status shows "Connected ✓"

### Functionality Tests
- [ ] Submit problem on LeetCode
- [ ] Toast notification appears
- [ ] Check GitHub repo created
- [ ] File pushed to GitHub
- [ ] Stats updated in popup
- [ ] Worker logs show success
- [ ] No errors in browser console

### Dashboard
- [ ] Dashboard accessible at localhost:3001
- [ ] Can view stats after 5 solves
- [ ] Dashboard button appears in popup
- [ ] Dashboard loads user data correctly

---

## 🧪 Test Scenarios

### Test 1: LeetCode Easy Problem
1. Go to https://leetcode.com/problems/two-sum/
2. Submit solution
3. Wait for "Accepted"
4. Verify:
   - [ ] Toast appears
   - [ ] GitHub repo updated
   - [ ] Stats incremented
   - [ ] Easy count +1

### Test 2: GeeksforGeeks Problem
1. Go to https://practice.geeksforgeeks.org/problems/
2. Submit solution
3. Verify:
   - [ ] Toast appears
   - [ ] GitHub repo updated
   - [ ] GFG count +1

### Test 3: Duplicate Submission
1. Submit same problem twice
2. Verify:
   - [ ] Second submission skipped
   - [ ] No duplicate in GitHub
   - [ ] Stats not double-counted

### Test 4: Network Failure
1. Disconnect internet
2. Submit problem
3. Verify:
   - [ ] Retry attempts logged
   - [ ] Error toast shown
4. Reconnect internet
5. Verify:
   - [ ] Next submission works

### Test 5: Dashboard Unlock
1. Solve 5 problems
2. Verify:
   - [ ] Dashboard button appears
   - [ ] Dashboard loads correctly
   - [ ] Stats display accurately

---

## 🔍 Final Verification

### Backend Health
```bash
curl http://localhost:3000/health
```
Expected: `{"status":"ok","timestamp":"..."}`

### Extension Storage
Open browser console in popup:
```javascript
chrome.storage.local.get(['jwt', 'stats'], console.log)
```
Expected: JWT and stats object

### GitHub Repository
Check: `https://github.com/YOUR_USERNAME/dsa-solutions`
Expected: Folder structure with solutions

---

## 📊 Performance Checks

- [ ] API response time < 200ms
- [ ] Toast appears within 2 seconds
- [ ] GitHub push completes in background
- [ ] No memory leaks in extension
- [ ] Worker processing jobs efficiently

---

## 🐛 Common Issues

### Issue: Extension won't load
- Check icons exist
- Verify manifest.json is valid
- Check browser console for errors

### Issue: GitHub push fails
- Verify OAuth token has `repo` scope
- Check worker logs
- Verify GitHub API rate limits

### Issue: Stats not updating
- Check database connection
- Verify worker is running
- Check backend logs

---

## ✅ Ready to Launch!

Once all items are checked:

1. Extension is working perfectly
2. All tests pass
3. No errors in any logs
4. GitHub sync is reliable
5. Dashboard displays correctly

**You're ready to use DSA Auto Sync!** 🎉

---

## 📝 Post-Launch

- Monitor worker logs for errors
- Check GitHub repo for synced solutions
- Track stats in dashboard
- Report any issues

Happy coding! 🚀
