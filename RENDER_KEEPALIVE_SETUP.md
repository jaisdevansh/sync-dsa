# ⏰ Keep Render Backend Awake - Fix Sleeping Issue

## 🔴 Problem:

Render free tier spins down your backend after **15 minutes of inactivity**. When your friend tries to connect, the request times out before the server wakes up.

---

## ✅ Solution: UptimeRobot (Free Cron Job)

Use UptimeRobot to ping your backend every 5-10 minutes so it never sleeps.

---

## 📋 Setup Steps:

### 1. Create UptimeRobot Account

1. Go to: https://uptimerobot.com/
2. Click **"Sign Up Free"**
3. Create account (free forever, no credit card needed)
4. Verify email

### 2. Add New Monitor

1. Click **"+ Add New Monitor"**
2. Fill in:
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** DSA Sync Backend Keepalive
   - **URL:** `https://dsa-sync-backend.onrender.com/keepalive`
   - **Monitoring Interval:** 5 minutes (or 10 minutes)
3. Click **"Create Monitor"**

### 3. Verify It's Working

1. Wait 5-10 minutes
2. Check UptimeRobot dashboard
3. Should show "Up" status
4. Your backend will never sleep now!

---

## 🎯 Alternative: Cron-Job.org

If you prefer another service:

1. Go to: https://cron-job.org/
2. Sign up (free)
3. Create new cron job:
   - **URL:** `https://dsa-sync-backend.onrender.com/keepalive`
   - **Interval:** Every 10 minutes
4. Save and enable

---

## 🧪 Test Your Keepalive Endpoint:

Open in browser:
```
https://dsa-sync-backend.onrender.com/keepalive
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2026-04-20T..."
}
```

If this works, UptimeRobot will keep pinging it!

---

## 📊 Benefits:

✅ Backend never sleeps
✅ Instant response for users
✅ No timeout errors
✅ Better user experience
✅ Free forever

---

## ⚠️ Important Notes:

1. **Free Render Tier Limits:**
   - 750 hours/month (enough for 24/7 with keepalive)
   - After 750 hours, backend will stop until next month

2. **Monitoring Interval:**
   - 5 minutes = 12 pings/hour = 288 pings/day
   - 10 minutes = 6 pings/hour = 144 pings/day
   - Both are well within limits

3. **Multiple Monitors:**
   - UptimeRobot free tier allows 50 monitors
   - You only need 1 for this project

---

## 🔍 Check Current Status:

Before setting up keepalive, check if backend is sleeping:

```bash
# Test from command line
curl https://dsa-sync-backend.onrender.com/keepalive

# If it takes 30+ seconds, backend was sleeping
# If it responds in 1-2 seconds, backend is awake
```

---

## ✅ After Setup:

1. UptimeRobot pings every 5-10 minutes
2. Backend stays awake 24/7
3. Your friend can connect instantly
4. No more timeout errors!

---

**Set this up ASAP to fix the connection timeout issue!**
