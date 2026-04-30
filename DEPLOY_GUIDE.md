# GetFit — Deployment Guide
**FYP by Muhammad Huzaifa Irfan**

---

## STEP 1 — Set up MongoDB Atlas (Free Cloud Database)

1. Go to https://cloud.mongodb.com and create a FREE account
2. Click **"Build a Database"** → Choose **FREE (M0 Shared)**
3. Pick any region → Click **Create**
4. Create a database user:
   - Username: `huzaifa`
   - Password: make a strong password (copy it!)
5. Under "Network Access" → Click **"Add IP Address"** → **"Allow Access from Anywhere"** → Confirm
6. Click **"Connect"** → **"Drivers"** → Copy the connection string

It looks like:
```
mongodb+srv://huzaifa:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/gym_management?retryWrites=true&w=majority
```

---

## STEP 2 — Deploy Backend on Render (Free)

1. Go to https://github.com and create a repository called `gym-backend`
2. Upload all files from the **GymBack** folder to that repo
   - Make sure `.env` and `.env.production` are NOT uploaded (gitignore handles this)
3. Go to https://render.com → Sign up with GitHub
4. Click **"New"** → **"Web Service"**
5. Connect your `gym-backend` GitHub repo
6. Set these settings:
   - Name: `gym-management-backend`
   - Environment: **Node**
   - Build Command: `npm install`
   - Start Command: `npm start`
7. Scroll down to **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| MONGO_URI | your Atlas connection string from Step 1 |
| JWT_SECRET | `huzaifa_fyp_getfit_secret_2024_production` |
| JWT_EXPIRE | `7d` |
| NODE_ENV | `production` |
| CLIENT_URL | (leave empty for now, fill in after Step 3) |

8. Click **"Create Web Service"**
9. Wait 2-3 minutes → You will get a URL like:
   ```
   https://gym-management-backend.onrender.com
   ```
   **COPY THIS URL** — you need it in Step 3

---

## STEP 3 — Deploy Frontend on Vercel (Free)

1. Go to https://github.com and create a repository called `gym-frontend`
2. Upload all files from the **Gym-Front** folder to that repo
3. Go to https://vercel.com → Sign up with GitHub
4. Click **"New Project"** → Import your `gym-frontend` repo
5. Framework: **Vite**
6. Click **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| VITE_API_URL | `https://gym-management-backend.onrender.com/api` |

7. Click **"Deploy"**
8. Wait 1-2 minutes → You will get a URL like:
   ```
   https://gym-frontend.vercel.app
   ```
   **COPY THIS URL**

---

## STEP 4 — Connect Frontend and Backend

1. Go back to **Render** → Your backend service → **"Environment"**
2. Update `CLIENT_URL` to your Vercel URL:
   ```
   https://gym-frontend.vercel.app
   ```
3. Click **"Save Changes"** → Render will restart automatically

---

## STEP 5 — Seed Your Database

After backend is live, open your backend URL in the browser:
```
https://gym-management-backend.onrender.com
```
You should see:
```json
{"success": true, "message": "Gym Management System API is running..."}
```

Then in your **local** GymBack terminal run:
```bash
MONGO_URI="your_atlas_connection_string" node seeder.js
```

This creates:
- Admin: admin@gym.com / admin123
- Member: ali@example.com / member123
- 3 sample trainers
- 2 sample memberships

---

## STEP 6 — Test Everything

Open your Vercel URL → Try:
- Register a new account
- Login with admin@gym.com / admin123
- View trainers
- Buy a membership
- Use the chatbot

---

## Your Live URLs (fill in after deploying)

| Service | URL |
|---------|-----|
| Frontend | https://_________________.vercel.app |
| Backend | https://_________________.onrender.com |
| Database | MongoDB Atlas (cloud.mongodb.com) |

---

## Important Notes

- Render free tier **sleeps after 15 minutes** of no activity
  - First request after sleep takes ~30 seconds to wake up
  - This is normal on the free plan
- MongoDB Atlas free tier allows 512MB storage (more than enough for FYP)
- Vercel free tier is unlimited for personal projects

