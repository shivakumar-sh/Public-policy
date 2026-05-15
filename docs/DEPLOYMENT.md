# 🚢 Deployment Guide

## ☁️ Backend Deployment (Render.com)

1. **GitHub Sync**: Push your code to a GitHub repository.
2. **New Web Service**: Create a new Web Service on Render.
3. **Root Directory**: Set to `backend`.
4. **Environment**: Select `Node`.
5. **Build Command**: `npm install`
6. **Start Command**: `node server.js`
7. **Env Vars**: Add all variables from `backend/.env.example`.
8. **Networking**: Ensure `PORT` matches your env (default 5000).

## 🎨 Frontend Deployment (Vercel)

1. **New Project**: Import your repository on Vercel.
2. **Framework**: Select `Create React App`.
3. **Root Directory**: Set to `frontend`.
4. **Build Settings**: Vercel auto-detects `npm run build`.
5. **Env Vars**: Add `REACT_APP_API_URL` pointing to your Render backend (e.g., `https://policy-api.onrender.com/api`).
6. **Deploy**: Click deploy.

## 💾 Database (MongoDB Atlas)

1. **Cluster**: Create a free Shared Cluster.
2. **Access**: Add a Database User and whitelist IP `0.0.0.0/0` (for Render).
3. **Connect**: Copy the `MONGODB_URI` string and update your backend environment variables.

---

## 🏁 Post-Deployment Checklist

- [ ] Verify CORS settings in `server.js` allow your Vercel URL.
- [ ] Test the Login/Register flow.
- [ ] Verify PDF upload (check file size limits on Render).
- [ ] Test AI responses with a real OpenAI key.
