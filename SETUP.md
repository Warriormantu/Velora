# Velora - Premium Grocery Delivery Platform

## Setup Guide

### Backend API Configuration

Your frontend is deployed on Vercel, but it needs to connect to a backend API. Follow these steps:

#### 1. Deploy Backend

Deploy your backend (`backend/server.js`) to one of these platforms:
- **Railway**: https://railway.app (recommended - free tier available)
- **Render**: https://render.com
- **AWS**: https://aws.amazon.com
- **Heroku**: https://heroku.com
- **DigitalOcean**: https://digitalocean.com

Note the backend URL (e.g., `https://velora-api.railway.app`)

#### 2. Add Environment Variable to Vercel

1. Go to your Vercel project dashboard: https://vercel.com/dashboard
2. Click on your **Velora** project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.com` (replace with your actual backend URL)
   - **Environments**: Select Production
5. Click **Add**
6. Redeploy the project (or push a new commit to trigger redeploy)

#### 3. Test Locally (Optional)

If running locally with `npm run dev`:
- Backend must run on `http://localhost:5000`
- Create `frontend/.env.local` (already created - don't commit it)
- Run: `npm run dev` in the frontend directory

### Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_URL` | Backend API base URL | `https://velora-api.railway.app` |

---

**Backend Routes** (these should be available at your backend URL):
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/products` - Fetch products
- `GET /api/orders` - Fetch user orders
- (and other API endpoints)
