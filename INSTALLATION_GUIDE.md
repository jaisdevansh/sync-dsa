# 🚀 DSA Auto Sync - Installation Guide

## For Your Friend

Hey! This extension will automatically sync your LeetCode and GeeksforGeeks solutions to GitHub.

---

## 📦 Installation Steps

### Step 1: Download the Extension

You should have received a file called `dsa-sync-extension.zip`

### Step 2: Extract the ZIP

1. Right-click on `dsa-sync-extension.zip`
2. Select "Extract All..." or "Extract Here"
3. Remember the folder location

### Step 3: Load Extension in Chrome

1. Open Google Chrome
2. Go to `chrome://extensions/` (copy-paste this in address bar)
3. Enable **Developer mode** (toggle switch in top-right corner)
4. Click **"Load unpacked"** button
5. Select the extracted folder (the one with `manifest.json` inside)
6. Extension should now appear with DSA Auto Sync icon

### Step 4: Connect with GitHub

1. Click the extension icon in Chrome toolbar (top-right)
2. Click **"CONNECT WITH GITHUB"** button
3. You'll be redirected to GitHub
4. Click **"Authorize"** to grant permissions
5. You'll see a success page with your token
6. Wait 10 seconds (or close the tab)
7. Click extension icon again
8. Should now show **"Connected"** with green checkmark ✓

---

## ✅ How to Use

### On LeetCode:

1. Go to any problem (e.g., https://leetcode.com/problems/two-sum/)
2. Write your solution
3. Click **"Submit"**
4. Wait for **"Accepted"** result
5. You'll see a notification: **"✅ Synced to GitHub!"**
6. Check your GitHub profile → `dsa-solutions` repository

### On GeeksforGeeks:

1. Go to any problem
2. Write your solution
3. Click **"Submit"**
4. Wait for **"Problem Solved Successfully"**
5. You'll see a notification: **"✅ Synced to GitHub!"**
6. Check your GitHub profile → `dsa-solutions` repository

---

## 📊 View Your Dashboard

1. Click extension icon
2. Click **"VIEW DASHBOARD"** button
3. See your stats:
   - Total problems solved
   - Current streak
   - Platform breakdown
   - Recent submissions with code

---

## 🔧 Troubleshooting

### Extension not showing "Connected" after GitHub auth

**Solution:**
1. Click extension icon
2. Right-click → **"Inspect popup"**
3. Go to **Console** tab
4. Look for errors
5. Try clicking "RECONNECT" button

### Submissions not syncing

**Check:**
1. Extension shows "Connected" ✓
2. You submitted and got "Accepted" result
3. Wait a few seconds for sync
4. Check GitHub repository

### GitHub repository not created

**Don't worry!**
- Repository will be created automatically on first submission
- Named: `dsa-solutions`
- Public repository
- Check your GitHub profile after first submission

---

## 📁 Repository Structure

Your GitHub repo will look like this:

```
dsa-solutions/
├── leetcode/
│   ├── easy/
│   │   ├── two-sum.js
│   │   └── valid-parentheses.js
│   ├── medium/
│   │   └── add-two-numbers.js
│   └── hard/
│       └── median-of-two-sorted-arrays.js
├── gfg/
│   ├── easy/
│   ├── medium/
│   └── hard/
└── codingninjas/
    ├── easy/
    ├── medium/
    └── hard/
```

---

## 🎯 Features

- ✅ Auto-sync to GitHub after every accepted submission
- ✅ Works on LeetCode, GeeksforGeeks, and CodingNinjas
- ✅ Organizes by platform and difficulty
- ✅ Duplicate detection (won't sync same problem twice)
- ✅ Dashboard to view stats
- ✅ Code preview with copy button
- ✅ Streak tracking

---

## ⚠️ Important Notes

1. **First Time Setup**: You need to authorize GitHub once
2. **Internet Required**: Extension needs internet to sync
3. **Accepted Solutions Only**: Only syncs when you get "Accepted"
4. **Public Repository**: Your solutions will be in a public repo
5. **One Account**: One GitHub account per extension

---

## 🆘 Need Help?

If something doesn't work:

1. **Check extension is "Connected"**
   - Click extension icon
   - Should show green checkmark

2. **Check GitHub authorization**
   - Go to GitHub Settings → Applications
   - Should see "DSA Auto Sync" in authorized apps

3. **Try reconnecting**
   - Click extension icon
   - Click "RECONNECT"
   - Authorize again

4. **Reload extension**
   - Go to `chrome://extensions/`
   - Find DSA Auto Sync
   - Click reload icon (circular arrow)

5. **Contact the developer**
   - Share error messages
   - Share what you were doing when it failed

---

## 🎉 That's It!

You're all set! Start solving problems and they'll automatically sync to your GitHub.

**Happy Coding! 🚀**

---

## 📝 Quick Checklist

- [ ] Downloaded `dsa-sync-extension.zip`
- [ ] Extracted the ZIP file
- [ ] Loaded extension in Chrome
- [ ] Enabled Developer mode
- [ ] Connected with GitHub
- [ ] Extension shows "Connected" ✓
- [ ] Submitted a test problem
- [ ] Saw "✅ Synced to GitHub!" notification
- [ ] Checked GitHub for `dsa-solutions` repo
- [ ] Verified file is in the repo

**All done? You're ready to go! 🎊**
