# Deployment Guide

## Prerequisites

1. **Neon PostgreSQL Database**
   - Sign up at https://neon.tech
   - Create a new project
   - Copy connection string

2. **Upstash Redis**
   - Sign up at https://upstash.com
   - Create Redis database
   - Copy connection string

3. **GitHub OAuth App**
   - Go to GitHub Settings → Developer settings → OAuth Apps
   - Create new OAuth App
   - Authorization callback URL: `http://localhost:3000/api/auth/github/callback` (update for production)
   - Copy Client ID and Client Secret

## Environment Setup

1. Copy `.env.example` to `.env`
2. Fill in all values:

```bash
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
JWT_SECRET=... # min 32 chars
ENCRYPTION_KEY=... # 64 char hex (use generator command)
```

Generate encryption key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Database Migration

```bash
npm run db:generate
npm run db:push
```

## Running Locally

Terminal 1 - Backend:
```bash
npm run dev:backend
```

Terminal 2 - Worker:
```bash
cd apps/backend
npm run dev:worker
```

Terminal 3 - Dashboard:
```bash
npm run dev:dashboard
```

## Production Deployment

### Backend + Worker (Railway/Render/Fly.io)

1. Deploy backend as web service (port 3000)
2. Deploy worker as background worker
3. Set environment variables
4. Ensure both connect to same Redis

### Dashboard (Vercel/Netlify)

```bash
cd apps/dashboard
npm run build
```

Deploy `apps/dashboard` folder

### Extension

1. Update API URLs in:
   - `background.js`
   - `content-leetcode.js`
   - `popup.js`

2. Create icons (16x16, 48x48, 128x128)

3. Zip extension folder

4. Submit to Chrome Web Store

## Monitoring

- Check worker logs for GitHub push status
- Monitor Redis queue length
- Track API response times
- Set up error alerts

## Scaling

- Increase worker concurrency in `worker.ts`
- Add more worker instances
- Use Redis cluster for high traffic
- Enable database connection pooling

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Set proper CORS_ORIGIN
- [ ] Rotate JWT_SECRET regularly
- [ ] Enable rate limiting
- [ ] Add request validation
- [ ] Monitor for suspicious activity
- [ ] Keep dependencies updated
