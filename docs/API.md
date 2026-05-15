# 🚀 API Documentation

**Base URL**: `http://localhost:5000/api`

## Authentication
All protected routes require a Bearer token in the `Authorization` header:
`Authorization: Bearer <your_jwt_token>`

---

## 🔐 Auth Endpoints

### Register User
`POST /api/auth/register`
- **Body**: `{ "name", "email", "password", "language" }`
- **Response**: User object with JWT token.

### Login User
`POST /api/auth/login`
- **Body**: `{ "email", "password" }`
- **Response**: User object with JWT token.

---

## 💬 Chat Endpoints

### Send Message
`POST /api/chat/send` (Protected)
- **Body**: `{ "message", "chatId", "language" }`
- **Description**: Sends a query to the AI policy assistant. Returns updated chat history.

### Get History
`GET /api/chat/history` (Protected)
- **Description**: Returns all chat titles and IDs for the logged-in user.

---

## 📜 Policy Endpoints

### Get All Policies
`GET /api/policies` (Public)
- **Description**: Returns list of all active policies.

### Simplify Policy
`POST /api/policies/:id/simplify` (Protected)
- **Description**: Triggers AI to generate a simplified version of a specific policy.

---

## 📂 Upload Endpoints

### Upload PDF
`POST /api/upload/pdf` (Protected)
- **Body**: Multipart form data with `pdf` field.
- **Description**: Uploads PDF, extracts text, and generates an AI summary.

---

## 🛠️ Admin Endpoints

### Platform Stats
`GET /api/admin/stats` (Admin Only)
- **Description**: Returns user growth, total chats, and system health status.
