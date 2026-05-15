# 📜 Public Policy Explainer Bot

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Stack: MERN](https://img.shields.io/badge/Stack-MERN-green.svg)](https://www.mongodb.com/mern-stack)
[![AI: OpenAI GPT-4](https://img.shields.io/badge/AI-OpenAI%20GPT--4-orange.svg)](https://openai.com/)

An AI-powered web platform designed to help Indian citizens understand complex government policies, laws, and public schemes in simple, plain language.

## ✨ Features

- **🤖 AI Policy Explainer**: A conversational chatbot that simplifies legal jargon into bullet points and real-life examples.
- **📄 PDF Summarization**: Upload official policy PDFs for instant, structured summaries.
- **🌐 Multi-Language Support**: Fully functional in **English, Hindi, Kannada, and Tamil**.
- **⚖️ Policy Comparison**: Side-by-side AI analysis of two different schemes or laws.
- **🎤 Voice Features**: Speech-to-Text input and Text-to-Speech output for accessibility.
- **🌓 Dark Mode**: Premium, eye-friendly design system with full dark mode support.
- **📊 Admin Dashboard**: Comprehensive platform analytics and user/policy management.

## 🛠️ Tech Stack

| Frontend | Backend |
| :--- | :--- |
| React.js (v18) | Node.js & Express |
| Tailwind CSS | MongoDB & Mongoose |
| Framer Motion (Animations) | OpenAI API (GPT-4) |
| Context API (State Mgmt) | JWT & Bcrypt (Security) |
| React Hot Toast | Multer & PDF-Parse |

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/public-policy-explainer-bot.git
cd public-policy-explainer-bot
```

### 2. Setup Backend
```bash
cd backend
npm install
# Create .env file based on .env.example and add your keys
npm run dev
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
# Create .env file based on .env.example
npm start
```

## 📂 Folder Structure

```text
public-policy-explainer-bot/
├── backend/            # Express server, MongoDB models, OpenAI integration
├── frontend/           # React application, Tailwind design system
└── docs/               # Detailed API and Deployment guides
```

## 🔑 Environment Variables

Required `.env` keys for the backend:
- `MONGODB_URI`: Your MongoDB Atlas connection string.
- `JWT_SECRET`: A long random string for securing tokens.
- `OPENAI_API_KEY`: Your OpenAI API key.

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
