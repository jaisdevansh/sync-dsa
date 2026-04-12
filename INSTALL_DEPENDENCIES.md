# 📦 Install Dependencies

## Installation is running in background...

Wait for 2-3 minutes for npm install to complete.

## Check if installation is complete:

```bash
# Check if node_modules folder exists
ls node_modules
```

If you see folders, installation is done!

## Then run:

```bash
# 1. Database setup
npm run db:generate
npm run db:push

# 2. Start backend
npm run dev:backend
```

## If installation is stuck:

Press `Ctrl+C` and run manually:
```bash
npm install
```

Wait for it to complete (2-3 minutes).

## After installation completes:

You should see:
```
added XXX packages in XXs
```

Then you can start the backend!
