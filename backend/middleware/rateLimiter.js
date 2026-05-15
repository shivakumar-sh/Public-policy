const rateLimit = require('express-rate-limit');

/**
 * General rate limiter for all API routes
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Stricter limiter for AI/LLM routes
 */
const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // Limit each user to 20 AI requests per minute
  message: {
    success: false,
    message: 'AI is currently busy processing your requests. Please wait a minute.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Auth rate limiter to prevent brute force
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login/register attempts
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * File upload limiter
 */
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each user to 10 uploads per hour
  message: {
    success: false,
    message: 'Upload limit reached. Please try again in an hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  chatLimiter,
  authLimiter,
  uploadLimiter
};
