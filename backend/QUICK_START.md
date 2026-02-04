# Quick Start Guide - PlaceMate Backend

## 🚀 Get Running in 5 Minutes

### Step 1: Prerequisites Check

Make sure you have:
- ✅ Node.js 18+ installed: `node --version`
- ✅ MongoDB running: `mongod --version`
- ✅ npm installed: `npm --version`

### Step 2: Install Dependencies

```bash
cd backend
npm install
```

This installs all required packages (~2-3 minutes).

### Step 3: Configure Environment

```bash
cp .env.example .env
```

**IMPORTANT:** Open `.env` and update at minimum:

```env
# Must change these for security!
JWT_ACCESS_SECRET=generate-a-random-64-char-string-here
JWT_REFRESH_SECRET=generate-another-random-64-char-string-here
COOKIE_SECRET=and-one-more-random-string-here

# MongoDB (if using local MongoDB)
MONGODB_URI=mongodb://localhost:27017/placemate

# Your frontend URL
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173
```

**Generate secure secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 4: Start MongoDB

**Option A - Local MongoDB:**
```bash
mongod
```

**Option B - MongoDB Atlas (Cloud):**
1. Create free cluster at https://mongodb.com/atlas
2. Get connection string
3. Update `MONGODB_URI` in `.env`

**Option C - Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7
```

### Step 5: Run the Server

```bash
npm run dev
```

You should see:
```
🚀 Server started successfully
📡 Environment: development
🔗 API URL: http://localhost:5000/v1
📊 Health check: http://localhost:5000/v1/health
```

### Step 6: Test It

Open your browser or use curl:
```bash
curl http://localhost:5000/v1/health
```

Expected response:
```json
{
  "success": true,
  "message": "PlaceMate API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 📋 Next Steps

### Test Authentication

**1. Create a user:**
```bash
curl -X POST http://localhost:5000/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

**2. Save the access token from response**

**3. Create an application:**
```bash
curl -X POST http://localhost:5000/v1/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "companyName": "Google",
    "role": "Software Engineer",
    "location": "Mountain View, CA",
    "jobType": "full-time",
    "source": "LinkedIn",
    "appliedDate": "2024-01-01"
  }'
```

---

## 🔧 Troubleshooting

### "Cannot connect to MongoDB"
```bash
# Check if MongoDB is running
pgrep mongod

# Start MongoDB
mongod
```

### "Port 5000 already in use"
```bash
# Find what's using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change port in .env
PORT=8000
```

### "Module not found" errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Environment validation fails
Make sure your `.env` file has ALL required variables from `.env.example`

---

## 📦 Production Deployment

### Using Docker

```bash
# Build and run
docker-compose up -d

# Check logs
docker-compose logs -f backend

# Stop
docker-compose down
```

### Manual Deploy

```bash
# Build TypeScript
npm run build

# Set production environment
export NODE_ENV=production

# Use PM2 for process management
npm install -g pm2
pm2 start dist/server.js --name placemate-api

# Monitor
pm2 logs placemate-api
pm2 monit
```

---

## 📚 Documentation

- **Full API Docs:** See `API_DOCUMENTATION.md`
- **Architecture:** See `README.md`
- **Code Examples:** See test files in `src/tests/`

---

## ✅ Verification Checklist

Before connecting frontend:

- [ ] Server starts without errors
- [ ] Health check endpoint returns 200
- [ ] Can signup a new user
- [ ] Can login with credentials
- [ ] Can create an application with auth token
- [ ] MongoDB collections are created (users, applications)
- [ ] Logs are being written to `logs/` folder

---

## 🆘 Need Help?

**Common Issues:**

1. **TypeScript errors:** Run `npm run build` to check for compilation errors
2. **Auth not working:** Verify JWT secrets are set in `.env`
3. **CORS errors:** Add your frontend URL to `ALLOWED_ORIGINS`
4. **Validation errors:** Check request body matches schema in `*.schema.ts` files

**Check logs:**
- Development: Console output
- Production: `logs/app.log` and `logs/error.log`

---

You're all set! 🎉

The backend is now ready to connect with your React frontend.
