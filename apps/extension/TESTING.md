# Extension Testing Guide

## 🧪 Manual Testing Checklist

### Setup Testing

- [ ] Extension loads without errors
- [ ] Icons display correctly
- [ ] Popup opens and displays UI
- [ ] No console errors on load

### Authentication Flow

- [ ] "Connect GitHub" button works
- [ ] OAuth popup opens
- [ ] After authorization, JWT is stored
- [ ] Status changes to "Connected ✓"
- [ ] Stats card becomes visible

### LeetCode Testing

#### Test Case 1: Easy Problem
```
1. Go to: https://leetcode.com/problems/two-sum/
2. Write solution
3. Click "Submit"
4. Wait for "Accepted"
5. Expected: Toast "✅ Synced to GitHub!" appears
6. Check: GitHub repo has new file
```

#### Test Case 2: Medium Problem
```
1. Go to: https://leetcode.com/problems/add-two-numbers/
2. Submit solution
3. Wait for "Accepted"
4. Expected: Toast appears
5. Check: Stats increment in popup
```

#### Test Case 3: Hard Problem
```
1. Go to: https://leetcode.com/problems/median-of-two-sorted-arrays/
2. Submit solution
3. Wait for "Accepted"
4. Expected: Toast appears
5. Check: Hard count increments
```

### GeeksforGeeks Testing

#### Test Case 1: Basic Problem
```
1. Go to: https://practice.geeksforgeeks.org/problems/
2. Select any problem
3. Submit solution
4. Wait for success message
5. Expected: Toast appears
6. Check: GitHub repo updated
```

### Popup Testing

#### Stats Display
- [ ] Total solved shows correct count
- [ ] Streak displays correctly
- [ ] Stats update after submission
- [ ] Dashboard button appears after 5 solves

#### Dashboard Access
- [ ] Dashboard button opens correct URL
- [ ] JWT is passed in URL
- [ ] Dashboard loads user data

### Error Scenarios

#### Network Failure
```
1. Disconnect internet
2. Submit problem
3. Expected: Retry 3 times
4. Expected: Error toast appears
5. Reconnect internet
6. Submit again
7. Expected: Success
```

#### Invalid JWT
```
1. Manually corrupt JWT in storage
2. Submit problem
3. Expected: "Not authenticated" error
4. Reconnect GitHub
5. Expected: Works again
```

#### Missing Elements
```
1. Submit before page fully loads
2. Expected: No crash, silent skip
3. Wait for page load
4. Submit again
5. Expected: Works correctly
```

### Performance Testing

#### Debounce Test
```
1. Submit same problem twice quickly
2. Expected: Only one API call
3. Check network tab
4. Verify single request
```

#### Memory Leak Test
```
1. Open 10 problem tabs
2. Submit in each tab
3. Check Task Manager
4. Expected: Memory stable
5. Close tabs
6. Expected: Memory released
```

#### Observer Efficiency
```
1. Open browser console
2. Go to problem page
3. Type in code editor
4. Expected: No excessive logs
5. Expected: Observer only triggers on submission
```

## 🔍 Debug Checklist

### Console Logs

Look for these logs:
```
[DSA Sync] Initialized on leetcode
[DSA Sync] Submission detected: Problem Title
[DSA Sync] Retry 1/3 after 1000ms
```

### Chrome Storage

Check stored data:
```javascript
chrome.storage.local.get(['jwt', 'stats'], (data) => {
  console.log(data);
});
```

Expected:
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "stats": {
    "totalSolved": 5,
    "easyCount": 2,
    "mediumCount": 2,
    "hardCount": 1,
    "streak": 3
  }
}
```

### Network Tab

Check API calls:
```
POST http://localhost:3000/api/submission/submit
Status: 200
Response: {"success": true, "submissionId": 123}
```

## 🐛 Common Issues

### Issue: Toast not appearing
**Debug:**
- Check console for errors
- Verify toast element is created
- Check z-index conflicts
- Verify message is sent to background

**Fix:**
- Increase z-index in content.js
- Check page CSP restrictions

### Issue: Submission not detected
**Debug:**
- Check if observer is initialized
- Verify platform detection
- Check selector validity
- Look for DOM structure changes

**Fix:**
- Update selectors in content.js
- Add more robust detection logic

### Issue: API calls failing
**Debug:**
- Check backend is running
- Verify JWT exists
- Check CORS settings
- Look at network errors

**Fix:**
- Start backend server
- Reconnect GitHub
- Update CORS_ORIGIN in backend

### Issue: Stats not updating
**Debug:**
- Check API response
- Verify storage update
- Check popup refresh logic

**Fix:**
- Manually refresh popup
- Clear storage and reconnect

## 📊 Test Results Template

```
Date: ___________
Tester: ___________

Setup:
[ ] Extension loaded
[ ] No console errors
[ ] Popup displays

LeetCode:
[ ] Easy problem detected
[ ] Medium problem detected
[ ] Hard problem detected
[ ] Toast appears
[ ] GitHub updated

GeeksforGeeks:
[ ] Problem detected
[ ] Toast appears
[ ] GitHub updated

Popup:
[ ] Stats display
[ ] Dashboard button
[ ] OAuth flow

Errors:
[ ] Network failure handled
[ ] Invalid JWT handled
[ ] Missing elements handled

Performance:
[ ] Debounce works
[ ] No memory leaks
[ ] Observer efficient

Notes:
_________________________________
_________________________________
```

## 🚀 Automated Testing (Future)

Consider adding:
- Puppeteer tests for E2E
- Jest tests for utility functions
- Mock API responses
- Automated selector validation

## 📝 Regression Testing

Before each release:
1. Test on latest Chrome version
2. Test on both platforms
3. Test all error scenarios
4. Verify performance metrics
5. Check memory usage
6. Validate API integration

---

**Test thoroughly before deployment!** 🧪
