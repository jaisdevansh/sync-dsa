# DSA Auto Sync

Production-grade system that automatically syncs your DSA solutions to GitHub.

## Architecture

- **Extension**: Vanilla JS (Manifest v3) - Detects submissions on LeetCode, GFG, CodingNinjas
- **Backend**: Node.js + Fastify - Ultra-fast API with async queue processing
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Queue**: BullMQ + Redis (Upstash)
- **Dashboard**: Next.js - View stats after 5 solves

## Performance

- API response: < 200ms
- GitHub push: Async background job
- No blocking operations
- Debounced duplicate submissions

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in:

```bash
cp .env.example .env
```

Generate encryption key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Setup Database

```bash
npm run db:generate
npm run db:push
```

### 4. Start Services

Backend:
```bash
npm run dev:backend
```

Dashboard:
```bash
npm run dev:dashboard
```

### 5. Setup GitHub OAuth (Extension)

**Important:** Load extension first to get Extension ID!

1. **Load Extension**:
   - Chrome → `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" → Select `apps/extension`
   - Copy Extension ID (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

2. **Create GitHub OAuth App**:
   - Go to https://github.com/settings/developers
   - Click "New OAuth App"
   - Fill in:
     - Name: `DSA Auto Sync`
     - Homepage: `https://github.com/YOUR_USERNAME/dsa-auto-sync`
     - Callback: `https://YOUR_EXTENSION_ID.chromiumapp.org/oauth2`
   - Copy Client ID and Client Secret

3. **Update Extension**:
   - Open `apps/extension/popup.js`
   - Line 2: `const GITHUB_CLIENT_ID = 'YOUR_CLIENT_ID';`

4. **Update Backend .env**:
   - Add `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`

5. **Reload Extension**:
   - `chrome://extensions/` → Click reload icon
   - Click extension icon → Login with GitHub

📖 Detailed guide: `apps/extension/GITHUB_OAUTH_SETUP.md`

### 6. Load Extension

### 6. Test It!

1. Go to LeetCode/GFG/CodingNinjas
2. Solve any problem
3. Submit and get "Accepted"
4. Watch for toast: "✅ Synced to GitHub!"
5. Check your GitHub repo: `github.com/YOUR_USERNAME/dsa-solutions`

## How It Works

1. Solve problem on LeetCode/GFG/CodingNinjas
2. Extension detects "Accepted" status
3. Extracts code, title, difficulty, language
4. Sends to backend API (< 200ms response)
5. Backend queues GitHub push job
6. Worker processes job in background
7. Stats updated in database
8. Dashboard unlocks after 5 solves

## Error Handling

- Extension: Retry with exponential backoff
- Backend: Input validation with Zod
- GitHub: 3 retries, handles rate limits & file conflicts
- Queue: Automatic retry on failure
- Database: Safe fallbacks, never crashes

## Tech Stack

- Fastify (backend)
- BullMQ (queue)
- Drizzle ORM (database)
- Next.js (dashboard)
- Vanilla JS (extension)

## Project Structure

```
apps/
  backend/       # Fastify API server
  dashboard/     # Next.js dashboard
  extension/     # Chrome extension
packages/
  database/      # Drizzle schema & migrations
```

## API Endpoints

- `POST /api/auth/github/callback` - OAuth callback
- `POST /api/submission/submit` - Submit solution
- `GET /api/stats/me` - Get user stats

## License

MIT
