# Quick Start Guide

Get DSA Auto Sync running in 5 minutes.

## Prerequisites

- Node.js 18+
- npm 9+
- Chrome browser

## Step 1: Clone & Install (1 min)

```bash
git clone <your-repo>
cd dsa-auto-sync
npm install
```

## Step 2: Setup Services (2 min)

### Get Neon PostgreSQL
1. Go to https://neon.tech
2. Create free account
3. Create new project
4. Copy connection string

### Get Upstash Redis
1. Go to https://upstash.com
2. Create free account
3. Create Redis database
4. Copy connection string

### Setup GitHub OAuth
1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - Name: DSA Auto Sync
   - Homepage: http://localhost:3000
   - Callback: http://localhost:3000/api/auth/github/callback
4. Copy Client ID and Client Secret

## Step 3: Configure Environment (1 min)

```bash
cp .env.example .env
```

Edit `.env`:
```bash
DATABASE_URL=postgresql://... # from Neon
REDIS_URL=redis://... # from Upstash
GITHUB_CLIENT_ID=... # from GitHub
GITHUB_CLIENT_SECRET=... # from GitHub
JWT_SECRET=your_random_32_char_string
ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
PORT=3000
CORS_ORIGIN=*
```

## Step 4: Setup Database (30 sec)

```bash
npm run db:generate
npm run db:push
```

## Step 5: Start Services (30 sec)

Open 3 terminals:

Terminal 1 - Backend:
```bash
npm run dev:backend
```

Terminal 2 - Worker:
```bash
npm run dev:worker
```

Terminal 3 - Dashboard:
```bash
npm run dev:dashboard
```

## Step 6: Load Extension (30 sec)

1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select `apps/extension` folder

## Step 7: Test It! (1 min)

1. Click extension icon
2. Click "Login with GitHub"
3. Authorize the app
4. Go to LeetCode
5. Solve any problem
6. Submit and get "Accepted"
7. Watch for toast: "✅ Synced to GitHub!"
8. Check your GitHub repo: `github.com/YOUR_USERNAME/dsa-solutions`

## Verify Everything Works

```bash
# Check backend
curl http://localhost:3000/health
# Should return: {"status":"ok"}

# Check dashboard
open http://localhost:3001
# Should see landing page

# Check worker logs
# Terminal 2 should show: "🔄 Worker started"
```

## Troubleshooting

### Extension not detecting submission
- Check console for errors (F12)
- Verify you're on LeetCode/GFG/CodingNinjas
- Make sure submission shows "Accepted"

### Backend not starting
- Check if port 3000 is available
- Verify DATABASE_URL is correct
- Check logs for errors

### Worker not processing
- Verify REDIS_URL is correct
- Check worker terminal for errors
- Ensure Redis is accessible

### GitHub push failing
- Check GitHub token has `repo` scope
- Verify OAuth app is configured correctly
- Check worker logs for specific error

## Next Steps

- Solve 5 problems to unlock dashboard
- Check `TESTING.md` for comprehensive testing
- Read `DEPLOYMENT.md` for production setup
- See `ARCHITECTURE.md` for system design

## Common Commands

```bash
# Development
npm run dev:backend      # Start API server
npm run dev:worker       # Start queue worker
npm run dev:dashboard    # Start Next.js dashboard

# Database
npm run db:generate      # Generate migrations
npm run db:push          # Push schema to database

# Production
npm run build            # Build all apps
npm run start:backend    # Start production API
npm run start:worker     # Start production worker
npm run start:dashboard  # Start production dashboard
```

## Support

If you encounter issues:
1. Check logs in all terminals
2. Verify environment variables
3. Ensure all services are running
4. Check `TESTING.md` for debugging steps

Happy coding! 🚀
