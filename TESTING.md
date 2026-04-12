# Testing Guide

## Manual Testing Checklist

### Backend API

1. **Health Check**
```bash
curl http://localhost:3000/health
# Expected: {"status":"ok"}
```

2. **GitHub OAuth Flow**
- Open extension popup
- Click "Login with GitHub"
- Authorize app
- Check JWT stored in extension storage

3. **Submission API**
```bash
curl -X POST http://localhost:3000/api/submission/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT" \
  -d '{
    "title": "Two Sum",
    "difficulty": "easy",
    "code": "function twoSum() {}",
    "language": "javascript",
    "platform": "leetcode"
  }'
# Expected: {"success":true,"submissionId":1}
```

4. **Stats API**
```bash
curl http://localhost:3000/api/stats/me \
  -H "Authorization: Bearer YOUR_JWT"
# Expected: User stats object
```

### Extension Testing

1. **LeetCode**
- Go to any LeetCode problem
- Submit a solution
- Wait for "Accepted"
- Check for toast notification
- Verify GitHub repo updated

2. **GeeksforGeeks**
- Go to any GFG problem
- Submit solution
- Check toast notification
- Verify sync

3. **CodingNinjas**
- Same as above

### Dashboard Testing

1. **Before 5 Solves**
- Visit http://localhost:3001
- Should see "Solve 5 problems to unlock"

2. **After 5 Solves**
- Visit http://localhost:3001/dashboard?jwt=YOUR_JWT
- Should see stats dashboard
- Verify all counts are correct
- Check recent submissions list

### Queue Testing

1. **Check Queue Status**
```bash
# In Redis CLI or Upstash console
LLEN bull:submissions:wait
LLEN bull:submissions:completed
LLEN bull:submissions:failed
```

2. **Monitor Worker Logs**
```bash
npm run dev:worker
# Watch for job processing logs
```

### Error Scenarios

1. **Invalid JWT**
```bash
curl http://localhost:3000/api/stats/me \
  -H "Authorization: Bearer invalid_token"
# Expected: 401 Unauthorized
```

2. **Missing Fields**
```bash
curl -X POST http://localhost:3000/api/submission/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT" \
  -d '{"title": "Test"}'
# Expected: 400 Validation Error
```

3. **Rate Limiting**
```bash
# Send 31 requests in 1 minute
for i in {1..31}; do
  curl http://localhost:3000/health
done
# Expected: 429 Too Many Requests on 31st request
```

4. **GitHub API Failure**
- Revoke GitHub token
- Submit solution
- Check worker retries 3 times
- Verify error logged

### Performance Testing

1. **API Response Time**
```bash
time curl -X POST http://localhost:3000/api/submission/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT" \
  -d '{...}'
# Should be < 200ms
```

2. **Concurrent Submissions**
```bash
# Use Apache Bench or similar
ab -n 100 -c 10 -H "Authorization: Bearer YOUR_JWT" \
  -p submission.json \
  http://localhost:3000/api/submission/submit
```

### Database Testing

1. **Check Stats Update**
```sql
SELECT * FROM stats WHERE user_id = 1;
-- Verify counts increment correctly
```

2. **Check Submissions**
```sql
SELECT * FROM submissions ORDER BY created_at DESC LIMIT 10;
-- Verify all fields populated
```

3. **Check Streak Calculation**
- Submit on consecutive days
- Verify streak increments
- Skip a day
- Verify streak resets to 1

## Automated Testing (Future)

Consider adding:
- Unit tests for services
- Integration tests for API routes
- E2E tests for extension
- Load testing for queue system

## Common Issues

1. **Extension not detecting submission**
   - Check console for errors
   - Verify selectors match current site structure
   - Platform may have updated their DOM

2. **GitHub push failing**
   - Check token permissions (needs `repo` scope)
   - Verify repo exists or can be created
   - Check rate limits

3. **Worker not processing jobs**
   - Verify Redis connection
   - Check worker logs
   - Ensure worker is running

4. **Dashboard not loading**
   - Check JWT in URL
   - Verify API is running
   - Check CORS settings
