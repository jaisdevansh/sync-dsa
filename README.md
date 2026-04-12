# 🚀 DSA Auto Sync

Automatically sync your LeetCode & GeeksforGeeks solutions to GitHub with a Chrome extension.

## ✨ Features

- 🔄 Auto-detect submissions on LeetCode & GeeksforGeeks
- 📤 Sync code to GitHub automatically
- 📊 Track progress with stats dashboard
- 🔥 Maintain coding streak
- 🎯 Unlock dashboard after 5 problems

## 🏗️ Architecture

```
├── apps/
│   ├── backend/          # Fastify API server
│   ├── dashboard/        # Next.js dashboard
│   └── extension/        # Chrome extension
├── packages/
│   └── database/         # Drizzle ORM schema
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

Copy `.env.template` to `.env` and fill in:

```env
DATABASE_URL=your_neon_postgres_url
REDIS_URL=your_upstash_redis_url
GITHUB_CLIENT_ID=your_github_oauth_id
GITHUB_CLIENT_SECRET=your_github_oauth_secret
JWT_SECRET=random_32_char_string
ENCRYPTION_KEY=random_64_char_hex
```

### 3. Setup Database

```bash
npm run db:push
```

### 4. Start Services

```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Worker
npm run dev:worker

# Terminal 3: Dashboard
npm run dev:dashboard
```

### 5. Load Extension

1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `apps/extension` folder

## 📦 Deployment

### Deploy Backend (Render.com)

Backend + Worker combined in single free service:

1. Push to GitHub
2. Go to [Render.com](https://render.com)
3. Create "Web Service" from Blueprint
4. Connect repository: `jaisdevansh/sync-dsa`
5. Render will auto-detect `render.yaml`
6. Add environment variables (see below)
7. Deploy!

### Deploy Dashboard (Vercel)

```bash
cd apps/dashboard
vercel --prod
```

Or connect GitHub repo on Vercel dashboard.

### Share Extension with Friends

Extension is NOT published to Chrome Web Store. Users load it locally:

**Option 1: Share GitHub Repo**
- Send link: https://github.com/jaisdevansh/sync-dsa
- They follow instructions in `INSTALL_EXTENSION.md`

**Option 2: Share ZIP File**
1. Zip the `apps/extension` folder
2. Share via email/drive
3. They extract and load in Chrome (`chrome://extensions/`)

See `INSTALL_EXTENSION.md` for detailed user instructions.

## 🧪 Testing

1. Go to [LeetCode Two Sum](https://leetcode.com/problems/two-sum/)
2. Submit a solution
3. Check console: `[DSA Sync] Submission detected`
4. Check GitHub repo for new file
5. Check extension for updated stats

## 📚 Tech Stack

- **Backend:** Fastify, BullMQ, Drizzle ORM
- **Database:** PostgreSQL (Neon)
- **Cache/Queue:** Redis (Upstash)
- **Dashboard:** Next.js, Tailwind CSS
- **Extension:** Vanilla JavaScript (Manifest v3)

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `REDIS_URL` | Redis connection string | `rediss://...` |
| `GITHUB_CLIENT_ID` | GitHub OAuth App ID | `Ov23li...` |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth Secret | `436121...` |
| `JWT_SECRET` | JWT signing secret | `random32chars` |
| `ENCRYPTION_KEY` | Token encryption key | `random64hex` |

## 📖 Documentation

- **ARCHITECTURE.md** - System architecture details
- **FEATURES.md** - Feature specifications
- **DEPLOY_WITHOUT_EXTENSION.md** - Deployment guide

## 🐛 Troubleshooting

### Extension not detecting submissions

1. Check console (F12) for `[DSA Sync] Initialized on leetcode`
2. Reload extension: `chrome://extensions/` → Refresh
3. Hard reload page: Ctrl+Shift+R

### Backend not receiving submissions

1. Check backend logs for errors
2. Verify JWT token is saved: Check extension storage
3. Test backend health: `curl http://localhost:3000/health`

### Worker not processing jobs

1. Check worker logs for Redis connection
2. Verify REDIS_URL format: `rediss://` (double 's')
3. Check GitHub token is valid

## 💰 Cost (Free Tier)

- Backend (Render): $0
- Worker (Render): $0
- Dashboard (Vercel): $0
- Database (Neon): $0
- Redis (Upstash): $0

**Total: $0/month** 🎉

## 📝 License

MIT

## 🤝 Contributing

Pull requests are welcome!

## 📧 Support

For issues, please open a GitHub issue.

---

**Made with ❤️ for DSA enthusiasts**
