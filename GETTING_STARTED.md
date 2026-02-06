# 🎯 Getting Started - PlaceMate Full Stack

**Simple 3-step guide to run your app**

---

## 📦 What You Got

1. **Backend** (already set up) - Running on your machine
2. **Frontend** (this new zip) - Fully integrated with backend

---

## 🚀 Super Simple Setup

### Step 1: Make Sure Backend is Running

```bash
# In your backend folder
npm run dev

# Should show:
# ✅ Server started successfully
# 🔗 API URL: http://localhost:5000/v1
```

**If not running, follow the backend setup first!**

---

### Step 2: Extract & Start Frontend

```bash
# Extract the zip
unzip placemate-frontend-integrated.zip
cd frontend-integrated

# Install (only first time)
npm install

# Start frontend
npm run dev
```

**Frontend will run on:** `http://localhost:5173`

---

### Step 3: Test It! 🎉

1. Open browser: `http://localhost:5173`
2. Click **Sign Up**
3. Enter: email, password, name
4. **Create** a job application
5. See it in your **Dashboard**!

**That's it!** Your full-stack app is working with real database!

---

## ✅ What's Different Now?

### Before:
- Mock data (fake applications)
- Data in browser only
- Lost on refresh

### Now:
- **Real MongoDB database**
- **Your actual data**
- **Persists forever**
- **Works on any device**

---

## 🔧 What Changed in Frontend?

Only 2 files changed:

1. **`src/services/api.ts`** - NEW file that talks to backend
2. **`src/stores/applicationStore.ts`** - Updated to use API

Everything else is **exactly the same**!

---

## 📝 Quick Test Checklist

Open browser DevTools (F12) → Network tab:

- [ ] Sign up → See `POST /auth/signup` → Status 201 ✅
- [ ] Login → See `POST /auth/login` → Status 200 ✅
- [ ] Create app → See `POST /applications` → Status 201 ✅
- [ ] View apps → See `GET /applications` → Status 200 ✅

**All green?** You're good! 🎉

---

## ❌ Problem? Quick Fixes

### "Failed to fetch"
→ Backend not running. Start it first!

### "CORS error"
→ Check backend `.env` has:
```
ALLOWED_ORIGINS=http://localhost:5173
```

### "401 Unauthorized"
→ Try logging in again

### Nothing shows up
→ Check browser console (F12) for errors

---

## 🎯 What to Do Next

Your app is **production-ready**! You can:

1. **Use it** - Add real job applications
2. **Customize** - Change colors, add features
3. **Deploy** - Put it online (Vercel + Railway/Heroku)

---

## 📊 Current Setup

```
Frontend (localhost:5173)
        ↓
     API calls
        ↓
Backend (localhost:5000)
        ↓
MongoDB (localhost:27017 or Atlas)
```

**Everything connected!** 🔗

---

## 🎉 You're Done!

Both backend and frontend are running.
Your full-stack PlaceMate app is **LIVE**! 🚀

Start tracking those job applications! 💼
