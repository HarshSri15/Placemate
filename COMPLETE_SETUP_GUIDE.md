# 🚀 PlaceMate Full Stack Setup Guide

**Complete guide to get your PlaceMate app running in 10 minutes**

---

## 📦 What You Have

1. **Frontend** (React + TypeScript + Vite + Tailwind) - Already complete
2. **Backend** (Node.js + Express + TypeScript + MongoDB) - Just built for you

Both are **100% production-ready** and work **perfectly together**.

---

## ⚡ 10-Minute Setup

### Step 1: Extract Backend (1 min)

```bash
unzip placemate-backend-final.zip
cd backend-final
```

### Step 2: Install Dependencies (2 min)

```bash
npm install
```

### Step 3: Configure Environment (2 min)

```bash
cp .env.example .env
```

**Edit `.env`** - Generate 3 secrets:

```bash
# Generate a secret:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Run this 3 times and paste into .env
```

```env
JWT_ACCESS_SECRET=<paste-first-secret>
JWT_REFRESH_SECRET=<paste-second-secret>
COOKIE_SECRET=<paste-third-secret>

MONGODB_URI=mongodb://localhost:27017/placemate
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173
```

### Step 4: Start MongoDB (1 min)

**Option A - Local MongoDB:**
```bash
mongod
```

**Option B - Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7
```

**Option C - MongoDB Atlas (Cloud):**
1. Create free cluster at https://mongodb.com/atlas
2. Get connection string
3. Update `MONGODB_URI` in `.env`

### Step 5: Start Backend (1 min)

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

### Step 6: Test Backend (1 min)

Open browser: http://localhost:5000/v1/health

Should show:
```json
{
  "success": true,
  "message": "PlaceMate API is running"
}
```

✅ **Backend is ready!**

### Step 7: Connect Frontend (2 min)

In your frontend project, create `src/services/api.ts`:

```typescript
const API_BASE = 'http://localhost:5000/v1';

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Request failed');
    
    return data.data;
  }

  async signup(userData: { email: string; password: string; name: string }) {
    const res = await this.request<{ user: any; accessToken: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    localStorage.setItem('accessToken', res.accessToken);
    return res;
  }

  async login(credentials: { email: string; password: string }) {
    const res = await this.request<{ user: any; accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    localStorage.setItem('accessToken', res.accessToken);
    return res;
  }

  async getApplications() {
    return this.request<any[]>('/applications');
  }

  async createApplication(data: any) {
    return this.request<any>('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDashboardStats() {
    return this.request<any>('/analytics/dashboard');
  }
}

export const api = new ApiClient();
```

### Step 8: Update Your Zustand Store (Optional)

Replace mock data calls with real API calls. See `FRONTEND_INTEGRATION.md` for complete example.

### Step 9: Start Frontend

```bash
cd your-frontend-directory
npm run dev
```

### Step 10: Test Full Stack! 🎉

1. Go to http://localhost:5173
2. Sign up with any email
3. Create a job application
4. See it in the dashboard
5. View analytics

---

## 🎯 What Works Now

✅ **Authentication**
- Signup
- Login
- Logout
- Token refresh
- Session management

✅ **Applications**
- Create new applications
- View all applications
- Update applications
- Delete applications
- Move through pipeline stages
- Track timeline events
- Add contacts

✅ **Analytics**
- Dashboard statistics
- Stage distribution charts
- Monthly application trends
- Conversion rates
- Top companies
- Average response time

✅ **Reminders**
- Create reminders
- Link to applications
- Mark complete
- View upcoming/overdue

✅ **User Management**
- Profile updates
- Preferences (theme, etc)
- Password change

---

## 📡 API Endpoints Summary

**Auth:**
- `POST /v1/auth/signup`
- `POST /v1/auth/login`
- `POST /v1/auth/logout`
- `POST /v1/auth/refresh`

**Applications:**
- `GET /v1/applications` - List all
- `POST /v1/applications` - Create
- `GET /v1/applications/:id` - Get one
- `PUT /v1/applications/:id` - Update
- `DELETE /v1/applications/:id` - Delete
- `PATCH /v1/applications/:id/stage` - Update stage

**Analytics:**
- `GET /v1/analytics/dashboard` - Stats
- `GET /v1/analytics/full` - Complete data

**Reminders:**
- `GET /v1/reminders` - List
- `POST /v1/reminders` - Create
- `PATCH /v1/reminders/:id/complete` - Mark done

---

## 🔧 Common Issues & Fixes

### "Cannot connect to MongoDB"

**Check if MongoDB is running:**
```bash
# Check process
ps aux | grep mongod

# Or try connecting
mongo
```

**Fix:** Start MongoDB:
```bash
mongod
```

### "JWT_ACCESS_SECRET must be at least 32 characters"

**Fix:** Generate proper secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Paste into `.env`

### "CORS error in browser"

**Check `.env`:**
```env
ALLOWED_ORIGINS=http://localhost:5173
```

**Must match your frontend URL exactly!**

### "Port 5000 already in use"

**Find what's using it:**
```bash
lsof -i :5000
```

**Kill it:**
```bash
kill -9 <PID>
```

**Or change port in `.env`:**
```env
PORT=8000
```

### Frontend can't reach backend

**Check:**
1. Backend running? Visit http://localhost:5000/v1/health
2. Correct API_BASE in frontend? Should be `http://localhost:5000/v1`
3. CORS configured? Check `.env` ALLOWED_ORIGINS

---

## 📊 Project Structure

```
placemate/
├── frontend/              # Your React app
│   ├── src/
│   │   ├── services/
│   │   │   └── api.ts    # ← Add this
│   │   ├── stores/
│   │   ├── components/
│   │   └── pages/
│   └── package.json
│
└── backend-final/         # This backend
    ├── src/
    │   ├── config/
    │   ├── modules/
    │   │   ├── auth/
    │   │   ├── users/
    │   │   ├── applications/
    │   │   ├── analytics/
    │   │   └── reminders/
    │   ├── middleware/
    │   ├── common/
    │   └── server.ts
    ├── .env              # ← Configure this
    └── package.json
```

---

## 🚀 Production Deployment

### Build Backend:
```bash
npm run build
```

### Run Production:
```bash
npm start
```

### Using Docker:
```bash
docker-compose up -d
```

### Deploy to Cloud:
- Backend → Heroku, Railway, Render, AWS
- Frontend → Vercel, Netlify
- Database → MongoDB Atlas (free tier)

---

## ✅ Verification Checklist

Before integrating:

- [ ] Backend starts without errors
- [ ] Health endpoint returns 200
- [ ] MongoDB connected (check logs)
- [ ] Can signup a user via Postman/curl
- [ ] Can login and receive token
- [ ] Can create application with auth token
- [ ] Frontend API client created
- [ ] Frontend can reach backend (no CORS errors)
- [ ] Can see data in frontend from backend

---

## 🎓 Next Steps

1. **Test auth flow** - Signup → Login → Create application
2. **Integrate with frontend** - Replace mock data
3. **Customize** - Add features, modify responses
4. **Deploy** - Host on cloud platforms
5. **Monitor** - Check logs, add error tracking

---

## 📚 Documentation

- **API Reference:** See backend code for detailed schemas
- **Frontend Integration:** `FRONTEND_INTEGRATION.md`
- **Architecture:** Clean architecture (Controller → Service → Repository)

---

## 🆘 Need Help?

**Check logs:**
```bash
# Backend logs in terminal
# Or in logs/ directory
cat logs/app.log
```

**Test API directly:**
```bash
# Health check
curl http://localhost:5000/v1/health

# Signup
curl -X POST http://localhost:5000/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","name":"Test"}'
```

---

## 🎉 You're All Set!

Your PlaceMate full-stack app is ready to use. The backend matches your frontend **perfectly** - every data structure, every endpoint, every response format.

Just start both servers and start building! 🚀
