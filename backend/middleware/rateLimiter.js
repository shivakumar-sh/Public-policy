// backend/middleware/rateLimiter.js
// Purpose: Feature-specific API rate limiting to protect AI budgets and platform stability

const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false
});

const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 15,
  keyGenerator: (req) => req.user?._id || req.ip,
  message: { success: false, message: 'Sending too fast. Wait a moment.' },
  skip: (req) => req.user?.role === 'admin'
});

const aiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10,
  keyGenerator: (req) => req.user?._id || req.ip,
  message: { success: false, message: 'Too many AI requests. Please wait 5 minutes.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' }
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  keyGenerator: (req) => req.user?._id || req.ip,
  message: { success: false, message: 'Upload limit reached. Try again in 1 hour.' }
});

module.exports = {
  generalLimiter,
  chatLimiter,
  aiLimiter,
  authLimiter,
  uploadLimiter
};
