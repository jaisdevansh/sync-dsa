# 🎯 Quick Testing Guide

## Where to Test

### LeetCode
1. Go to: https://leetcode.com/problems/two-sum/
2. Write any solution
3. Click "Submit" (NOT "Run")
4. Wait for "Accepted"

### GeeksforGeeks  
1. Go to: https://practice.geeksforgeeks.org/problems/
2. Pick any problem
3. Submit solution
4. Wait for "Success"

## What You'll See

### ✅ Success Flow:

1. **On Submit:**
   - Green toast: "✅ Synced to GitHub!"
   
2. **In Extension:**
   - Total Solved: +1
   - Streak: Updated
   
3. **On GitHub:**
   - New file in: `https://github.com/YOUR_USERNAME/dsa-solutions`
   - Path: `leetcode/easy/problem-name.js`

4. **In Console (F12):**
   ```
   [DSA Sync] Submission detected: Two Sum
   ```

5. **Backend Logs:**
   ```
   [INFO] Submission received
   [INFO] Added to queue
   ```

6. **Worker Logs:**
   ```
   [INFO] Processing job
   [INFO] Pushed to GitHub
   ```

## Quick Check

```bash
# 1. Backend running?
curl http://localhost:3000/health

# 2. Extension loaded?
chrome://extensions/ → DSA Auto Sync → Enabled ✓

# 3. GitHub connected?
Click extension icon → Should show "Connected"
```

## If Something Fails

### No Toast Appears
- Reload extension: `chrome://extensions/` → Refresh
- Reload LeetCode page
- Check console (F12) for errors

### Toast Shows Error
- Check backend is running (port 3000)
- Reconnect GitHub in extension
- Check backend logs for errors

### No File in GitHub
- Check worker is running
- Check worker logs for errors
- Verify GitHub token in `.env`

## Test Problem (Copy-Paste)

```javascript
// LeetCode: Two Sum
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

1. Go to: https://leetcode.com/problems/two-sum/
2. Paste this code
3. Click "Submit"
4. Wait for "Accepted"
5. Check GitHub repo!

---

**That's it!** If you see the file in GitHub, everything is working! 🎉
