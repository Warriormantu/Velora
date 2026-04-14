# Velora - Premium Grocery Delivery Platform

## Deployment URLs

- **Frontend**: https://velora-black-beta.vercel.app/
- **Backend API**: https://velora-3u7f.onrender.com

## Setup Guide

### ✅ Next Step: Add Environment Variable to Vercel

1. Go to your Vercel project dashboard: https://vercel.com/dashboard
2. Click on your **Velora** project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://velora-3u7f.onrender.com`
   - **Environments**: Select **Production** and **Preview**
5. Click **Add**
6. Redeploy the project by clicking **Deployments** → **Redeploy**

After redeployment, your app should be able to reach the backend API! 🚀

---

## Environment Variables Reference

| Variable | Purpose | Value |
|----------|---------|-------|
| `VITE_API_URL` | Backend API base URL | `https://velora-3u7f.onrender.com` |

---

## Local Development

If running locally:

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Create `.env.local` (already created):
   ```
   VITE_API_URL=http://localhost:5000
   ```

3. Start backend on port 5000:
   ```bash
   cd backend
   npm install
   npm start
   ```

4. In another terminal, start frontend:
   ```bash
   cd frontend
   npm run dev
   ```

---

## API Endpoints

All API calls will be made to `https://velora-3u7f.onrender.com`:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/products` - Fetch products
- `GET /api/orders` - Fetch user orders
- `POST /api/orders` - Create new order
- (and other endpoints)
