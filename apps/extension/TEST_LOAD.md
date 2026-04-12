# Test Extension Loading

## ✅ Correct Folder Structure

Your extension folder is correctly structured:

```
apps/extension/
├── manifest.json ✅ (Main file - Chrome reads this first)
├── background.js ✅
├── content.js ✅
├── popup.html ✅
├── popup.js ✅
├── styles.css ✅
├── icons/
│   ├── icon16.png ✅
│   ├── icon48.png ✅
│   └── icon128.png ✅
└── utils/
    └── api.js ✅
```

## 🎯 Exact Steps to Load

1. Open Chrome
2. Type in address bar: `chrome://extensions/`
3. Enable "Developer mode" (top right toggle)
4. Click "Load unpacked" button
5. Navigate to: `C:\Users\devan\OneDrive\Desktop\sync\apps\extension`
6. Click "Select Folder"

## ⚠️ Common Mistakes

❌ **WRONG**: Selecting `sync` folder
❌ **WRONG**: Selecting `apps` folder
✅ **CORRECT**: Selecting `apps\extension` folder

## 🔍 How to Verify Correct Folder

When you open the folder in the file picker, you should see:
- manifest.json (file)
- background.js (file)
- popup.html (file)
- icons (folder)
- utils (folder)

If you see these files, you're in the RIGHT folder!

## 🐛 Still Getting Error?

If you still see "Manifest file is missing or unreadable":

1. Check file permissions - right click manifest.json → Properties → make sure it's not blocked
2. Try copying the entire `extension` folder to Desktop and load from there
3. Make sure manifest.json is valid JSON (no syntax errors)

## ✅ Verification

Run this in PowerShell from the sync folder:
```powershell
Test-Path "apps/extension/manifest.json"
```

Should return: `True`
