# DSA Auto Sync - Chrome Extension

Lightweight, high-performance Chrome extension for automatically syncing DSA solutions to GitHub.

## 🎯 Features

- ✅ Detects "Accepted" submissions on LeetCode & GeeksforGeeks
- ✅ Extracts problem data automatically
- ✅ Sends to backend API with retry logic
- ✅ Shows instant feedback via toast notifications
- ✅ Displays stats in popup
- ✅ Unlocks dashboard after 5 problems

## 📁 File Structure

```
apps/extension/
├── manifest.json          # Extension configuration
├── content.js            # Detects submissions on problem pages
├── background.js         # Handles API communication
├── popup.html            # Popup UI structure
├── popup.js              # Popup logic
├── styles.css            # Popup styles
├── utils/
│   └── api.js           # Central API handler
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## 🚀 Installation

### 1. Load Extension

```bash
1. Open Chrome → chrome://extensions/
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select apps/extension folder
```

### 2. Configure

Open `popup.js` and update line 7:
```javascript
const GITHUB_CLIENT_ID = 'YOUR_GITHUB_CLIENT_ID';
```

### 3. Setup GitHub OAuth

See main project README for GitHub OAuth setup instructions.

### 4. Connect

1. Click extension icon
2. Click "Connect GitHub"
3. Authorize the app
4. Start solving problems!

## 🧠 How It Works

### Data Flow

```
Problem Page → content.js → background.js → Backend API
                    ↓
              Toast Notification
```

### content.js
- Runs on LeetCode and GeeksforGeeks problem pages
- Uses MutationObserver to detect "Accepted" status
- Extracts: title, difficulty, code, language, platform
- Debounces to prevent duplicate triggers (2s)
- Sends data to background script

### background.js
- Receives messages from content script
- Retrieves JWT from chrome.storage
- Makes API calls with retry logic (3 attempts)
- Updates local stats cache
- Never blocks UI

### popup.js
- Shows connection status
- Displays total solved & streak
- Handles GitHub OAuth flow
- Opens dashboard when unlocked

## ⚡ Performance Optimizations

1. **Lightweight**: Vanilla JS only, no frameworks
2. **Debounced**: 2-second debounce prevents duplicate triggers
3. **Efficient DOM**: Minimal queries, null-safe selectors
4. **Async Operations**: All API calls are non-blocking
5. **Smart Caching**: Stats cached locally for instant display
6. **Retry Logic**: Exponential backoff for failed requests

## 🛡️ Error Handling

### Extraction Failures
- Missing elements → Skip silently
- Invalid data → Log and skip
- Platform detection fails → No-op

### API Failures
- Network error → Retry 3 times with exponential backoff
- Auth error → Show error toast
- Server error → Log and notify user

### Edge Cases
- Duplicate submissions → Prevented by key-based deduplication
- Multiple tabs → Each tab operates independently
- Page navigation → Observer cleaned up properly

## 🔧 Configuration

### API Endpoint
Update in `background.js` and `popup.js`:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

For production:
```javascript
const API_BASE_URL = 'https://api.yourdomain.com/api';
```

### Dashboard URL
Update in `popup.js`:
```javascript
const DASHBOARD_URL = 'http://localhost:3001/dashboard';
```

## 🧪 Testing

### Manual Testing

1. **LeetCode**:
   - Go to any problem
   - Submit solution
   - Wait for "Accepted"
   - Check for toast notification

2. **GeeksforGeeks**:
   - Go to practice problem
   - Submit solution
   - Wait for success message
   - Check for toast notification

3. **Popup**:
   - Click extension icon
   - Verify stats display
   - Check dashboard button (after 5 solves)

### Debug Mode

Open browser console (F12) to see logs:
```
[DSA Sync] Initialized on leetcode
[DSA Sync] Submission detected: Two Sum
[DSA Sync] Retry 1/3 after 1000ms
```

## 🐛 Troubleshooting

### Submission not detected
- Check browser console for errors
- Verify you're on a problem page
- Ensure submission shows "Accepted"
- Platform selectors may have changed

### API calls failing
- Verify backend is running
- Check JWT is stored (chrome.storage)
- Verify API_BASE_URL is correct
- Check network tab for errors

### Toast not showing
- Check if toast is blocked by page styles
- Verify z-index is high enough
- Check browser console for errors

## 📊 Platform Support

### LeetCode
- ✅ Problem detection
- ✅ Title extraction
- ✅ Difficulty extraction
- ✅ Code extraction
- ✅ Language detection

### GeeksforGeeks
- ✅ Problem detection
- ✅ Title extraction
- ✅ Difficulty extraction
- ✅ Code extraction
- ✅ Language detection

## 🚀 Production Deployment

### 1. Update URLs
```javascript
// background.js & popup.js
const API_BASE_URL = 'https://api.yourdomain.com/api';
const DASHBOARD_URL = 'https://dashboard.yourdomain.com';
```

### 2. Add Icons
Place proper icons in `icons/` folder

### 3. Update Manifest
```json
{
  "host_permissions": [
    "https://leetcode.com/*",
    "https://www.geeksforgeeks.org/*",
    "https://api.yourdomain.com/*"
  ]
}
```

### 4. Package Extension
```bash
# Zip the extension folder
cd apps/extension
zip -r dsa-auto-sync.zip . -x "*.git*" "README.md"
```

### 5. Publish
- Go to Chrome Web Store Developer Dashboard
- Upload zip file
- Fill in store listing
- Submit for review

## 📝 Code Quality

- ✅ Strict mode enabled
- ✅ Null-safe selectors
- ✅ Error boundaries
- ✅ No global pollution (IIFE)
- ✅ Clean event listeners
- ✅ Proper cleanup on unload

## 🎨 UI/UX

- Clean, modern design
- Gradient header
- Clear status indicators
- Smooth transitions
- Responsive layout
- Accessible colors

## 📈 Metrics

- Extension size: ~15KB (without icons)
- Memory footprint: <5MB
- CPU usage: Minimal (observer-based)
- Network: Only on submission

## 🔐 Security

- No sensitive data in content script
- JWT stored in chrome.storage (encrypted by Chrome)
- API calls use HTTPS in production
- No eval() or unsafe code
- CSP compliant

---

**Built with performance and simplicity in mind** 🚀
