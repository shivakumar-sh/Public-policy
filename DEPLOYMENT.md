# 🚀 Public Policy Explainer Bot — Production Deployment Guide

This guide provides step-by-step instructions for deploying the **Public Policy Explainer Bot (NyayaBot)** to production using modern, free/low-cost cloud hosting providers: **Render** (for the Express Backend) and **Vercel** (for the React Frontend).

---

## 🏗️ Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│                   Vercel (Frontend)                    │
│      React 18 + Tailwind CSS + Framer Motion           │
└───────────────────────────┬────────────────────────────┘
                            │ HTTPS / WSS (SSE Streams)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Render (Backend)                     │
│         Node.js + Express + OpenAI API Layer           │
└───────────────────────────┬────────────────────────────┘
                            │ Mongoose / MongoDB Wire Protocol
                            ▼
┌────────────────────────────────────────────────────────┐
│                  MongoDB Atlas (Cloud)                 │
│        Shared Cluster (User Data, Chats, Cache)        │
└────────────────────────────────────────────────────────┘
```

---

## 🗄️ Step 1: MongoDB Atlas Configuration

Your backend connects to MongoDB Atlas using the connection string in your `.env`. To ensure Render can connect to your database:

1. Log in to your [MongoDB Atlas Dashboard](https://cloud.mongodb.com/).
2. Navigate to **Security** > **Network Access** in the left sidebar.
3. Click **Add IP Address**.
4. Select **Allow Access From Anywhere** (`0.0.0.0/0`).
5. Click **Confirm**. (This ensures your cloud backend IP, which is dynamic on Render, can successfully connect).

---

## ⚙️ Step 2: Deploy Backend on Render

Render is an excellent platform for hosting Node.js Express APIs with native support for Server-Sent Events (SSE) streaming.

### 1. Create Web Service
1. Log in to [Render](https://render.com/) and click **New** > **Web Service**.
2. Connect your GitHub repository: `shivakumar-sh/Public-policy`.

### 2. Configure Service Settings
* **Name**: `public-policy-backend` (or your preferred name)
* **Root Directory**: `backend`
* **Environment**: `Node`
* **Build Command**: `npm install`
* **Start Command**: `npm start`
* **Instance Type**: Free / Starter ($7/mo recommended for production streaming stability)

### 3. Add Environment Variables
Navigate to the **Environment** tab on Render and add the following keys:

| Key | Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Port for Express server |
| `NODE_ENV` | `production` | Enables production optimizations |
| `MONGODB_URI` | `mongodb+srv://rahul:rahul@rahul.r9x6viu.mongodb.net/` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | *(Your long secret string from .env)* | Secret key for signing auth tokens |
| `OPENAI_API_KEY` | `sk-proj-...` | Your active OpenAI API key |
| `FRONTEND_URL` | `https://your-frontend-app.vercel.app` | **CRITICAL**: The live Vercel URL (for CORS) |

4. Click **Deploy Web Service**. Once deployed, copy your live backend URL (e.g., `https://public-policy-backend.onrender.com`).

---

## 🌐 Step 3: Deploy Frontend on Vercel

Vercel provides seamless, zero-config deployments for React applications built with Create React App.

### 1. Import Project
1. Log in to [Vercel](https://vercel.com/) and click **Add New** > **Project**.
2. Import your GitHub repository: `shivakumar-sh/Public-policy`.

### 2. Configure Project Settings
* **Project Name**: `public-policy-explainer`
* **Framework Preset**: `Create React App`
* **Root Directory**: `frontend` (Click Edit to select the `frontend` folder)

### 3. Add Environment Variables
Expand the **Environment Variables** section and add:

| Key | Value | Description |
| :--- | :--- | :--- |
| `REACT_APP_API_URL` | `https://public-policy-backend.onrender.com/api` | Point to your deployed Render backend `/api` |

### 4. Deploy
1. Click **Deploy**. Vercel will automatically run `npm run build` and publish your optimized static frontend.
2. Once deployed, copy your live Vercel domain (e.g., `https://public-policy-explainer.vercel.app`).
3. **Important**: Make sure to paste this Vercel domain into your Render backend's `FRONTEND_URL` environment variable so CORS allows the connections!

---

## 🧪 Step 4: Post-Deployment Verification

Once both services are live, verify your production deployment:

1. **Visit your Vercel URL** in the browser.
2. **Test Authentication**: Create a new account or log in to ensure MongoDB connectivity.
3. **Test AI Streaming**: Open the chat box, select a language (e.g., Hindi or Kannada), and ask a policy question. Verify that the typing animation plays and words stream seamlessly.
4. **Test PDF Summarization**: Upload a sample policy PDF and verify the AI summary tray appears.

---

## 🛡️ Troubleshooting & Best Practices

* **CORS Errors**: If the frontend cannot connect to the backend, verify that `FRONTEND_URL` on Render exactly matches your Vercel domain (without a trailing slash `/`).
* **Streaming Delays**: Free tier cloud services spin down after 15 minutes of inactivity. The first request after a spin-down may take 30–50 seconds as the server wakes up. Upgrading to a paid instance ($7/mo) prevents sleep.
* **OpenAI Quota Exceeded (429)**: If your OpenAI balance runs out, the backend's built-in **Smart Demo Mode** will automatically take over, allowing users to continue testing the UI with simulated policy streams!
