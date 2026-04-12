# System Architecture

## Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER SOLVES PROBLEM                      │
│                    (LeetCode/GFG/CodingNinjas)                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CHROME EXTENSION (Vanilla JS)                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Content Scripts (Platform-specific)                      │  │
│  │  • Detect "Accepted" status                              │  │
│  │  • Extract: title, code, difficulty, language            │  │
│  │  • Debounce duplicates (1s)                              │  │
│  │  • Send to background script                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Background Script (Service Worker)                       │  │
│  │  • Attach JWT from storage                               │  │
│  │  • POST to /api/submission/submit                        │  │
│  │  • Handle response                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Popup UI                                                 │  │
│  │  • GitHub OAuth login                                     │  │
│  │  • Store JWT                                              │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP POST (< 200ms)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND API (Fastify)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Middleware Layer                                         │  │
│  │  • Rate limiting (30 req/min)                            │  │
│  │  • JWT verification                                       │  │
│  │  • Error handling                                         │  │
│  │  • Request validation (Zod)                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Routes                                                   │  │
│  │  • POST /api/auth/github/callback                        │  │
│  │  • POST /api/submission/submit ⚡ FAST PATH              │  │
│  │  • GET  /api/stats/me                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Fast Path (< 200ms)                                     │  │
│  │  1. Validate input                                        │  │
│  │  2. Check duplicate (parallel query)                     │  │
│  │  3. Insert submission to DB                              │  │
│  │  4. Update stats (same transaction)                      │  │
│  │  5. Queue GitHub job (async)                             │  │
│  │  6. Return success immediately ✅                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────┬────────────────────────────┬───────────────────────┘
             │                            │
             │ Queue Job                  │ Read Stats
             ▼                            ▼
┌─────────────────────────┐   ┌──────────────────────────────────┐
│   REDIS (Upstash)       │   │  POSTGRESQL (Neon)               │
│  ┌──────────────────┐   │   │  ┌────────────────────────────┐ │
│  │  BullMQ Queue    │   │   │  │  Tables:                   │ │
│  │  • submissions   │   │   │  │  • users                   │ │
│  │  • retry: 3x     │   │   │  │  • submissions             │ │
│  │  • backoff: exp  │   │   │  │  • stats (indexed)         │ │
│  └──────────────────┘   │   │  └────────────────────────────┘ │
└────────────┬────────────┘   │  ┌────────────────────────────┐ │
             │                │  │  Optimizations:            │ │
             │                │  │  • Indexed queries         │ │
             │                │  │  • Stats pre-computed      │ │
             │                │  │  • Connection pooling      │ │
             │                │  └────────────────────────────┘ │
             ▼                └──────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────┐
│                    WORKER PROCESS (Background)                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  BullMQ Worker                                            │  │
│  │  • Concurrency: 5                                         │  │
│  │  • Process jobs from queue                               │  │
│  │  • Call GitHub Service                                    │  │
│  │  • Retry on failure (3x, exponential backoff)           │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GITHUB SERVICE                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Smart Push Logic                                         │  │
│  │  1. Ensure repo exists (create if not)                   │  │
│  │  2. Check if file exists                                  │  │
│  │  3. Get SHA if exists                                     │  │
│  │  4. PUT file (create or update)                          │  │
│  │  5. Handle rate limits                                    │  │
│  │  6. Handle conflicts                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GITHUB REPOSITORY                             │
│  Structure:                                                      │
│  ├── leetcode/                                                   │
│  │   ├── easy/                                                   │
│  │   ├── medium/                                                 │
│  │   └── hard/                                                   │
│  ├── gfg/                                                        │
│  └── codingninjas/                                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    DASHBOARD (Next.js)                           │
│  Route: /dashboard?jwt=TOKEN                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Fetch user stats from API                                │  │
│  │  Display:                                                  │  │
│  │  • Total solved                                            │  │
│  │  • Streak                                                  │  │
│  │  • Difficulty breakdown                                    │  │
│  │  • Platform breakdown                                      │  │
│  │  • Recent submissions                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│  Unlocked after: 5 solves                                        │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Submission Flow (Critical Path)

```
Extension → Backend API (< 200ms) → User gets response
                ↓
            Queue Job
                ↓
            Worker (background)
                ↓
            GitHub API
```

### Key Performance Optimizations

1. **Async Queue**: GitHub push happens in background
2. **Parallel Queries**: User + duplicate check in parallel
3. **Pre-computed Stats**: Updated on write, not read
4. **Indexed Queries**: Fast lookups on user_id, created_at
5. **Debouncing**: Prevent duplicate submissions in extension
6. **Rate Limiting**: Protect API from abuse
7. **Connection Pooling**: Reuse DB connections

## Error Handling Strategy

### Extension
- Retry with exponential backoff
- Show user-friendly error messages
- Log errors to console

### Backend
- Validate all inputs (Zod)
- Return safe error responses
- Never expose internal errors
- Log all errors

### Worker
- Retry failed jobs (3x)
- Exponential backoff
- Log failures
- Move to failed queue after max retries

### GitHub
- Handle rate limits (wait and retry)
- Handle file conflicts (use SHA)
- Handle network errors (retry)

## Security Measures

1. **Token Encryption**: GitHub tokens encrypted at rest (AES-256-GCM)
2. **JWT Auth**: Stateless authentication
3. **Rate Limiting**: Prevent abuse
4. **Input Validation**: Zod schemas
5. **CORS**: Restrict origins
6. **HTTPS**: Production only

## Scalability

### Current Capacity
- API: ~1000 req/min (single instance)
- Worker: 5 concurrent jobs
- Database: Neon auto-scales

### Scaling Strategy
1. Horizontal scaling: Add more API instances
2. Worker scaling: Add more worker processes
3. Redis: Upgrade to cluster
4. Database: Connection pooling + read replicas

## Monitoring Points

1. API response times
2. Queue length
3. Worker job success/failure rate
4. GitHub API rate limit usage
5. Database query performance
6. Error rates by endpoint
