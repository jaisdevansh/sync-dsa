# 🚀 Start Backend Server

## Problem
You're seeing "localhost refused to connect" because backend is not running.

## Solution - Start All Services

### Step 1: Database Setup (First Time Only)
```bash
npm run db:generate
npm run db:push
```

### Step 2: Start Backend (Terminal 1)
```bash
npm run dev:backend
```

You should see:
```
🚀 Server running on port 3000
📝 Environment: development
```

### Step 3: Start Worker (Terminal 2)
```bash
npm run dev:worker
```

You should see:
```
🔄 Worker started
📦 Processing submissions queue
```

### Step 4: Start Dashboard (Terminal 3)
```bash
npm run dev:dashboard
```

You should see:
```
✓ Ready on http://localhost:3001
```

---

## Quick Check

After starting backend, test:
```bash
curl http://localhost:3000/health
```

Should return:
```json
{"status":"ok","timestamp":"..."}
```

---

## Now Try Again

1. Backend is running ✅
2. Go to extension
3. Click "Connect GitHub"
4. Should work now! 🎉

---

## All 3 Services Must Be Running

| Service | Port | Command |
|---------|------|---------|
| Backend | 3000 | `npm run dev:backend` |
| Worker | - | `npm run dev:worker` |
| Dashboard | 3001 | `npm run dev:dashboard` |

Keep all 3 terminals open!
