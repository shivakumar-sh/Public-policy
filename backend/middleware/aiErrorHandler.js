// backend/middleware/aiErrorHandler.js
// Purpose: Intercepts AI-specific errors and formats standardized, actionable client responses

const { getErrorMessage } = require('../utils/openaiHelper');

const handleAIError = (error, req, res, next) => {
  const msg = error.message || '';

  if (msg === 'AI_RATE_LIMIT') {
    return res.status(429).json({ success: false, message: getErrorMessage('AI_RATE_LIMIT'), retryAfter: 60 });
  }
  if (msg === 'AI_CONTEXT_TOO_LONG') {
    return res.status(400).json({ success: false, message: getErrorMessage('AI_CONTEXT_TOO_LONG'), action: 'new_chat' });
  }
  if (msg === 'AI_INVALID_KEY') {
    return res.status(503).json({ success: false, message: 'AI service unavailable' });
  }
  if (msg === 'AI_SERVER_ERROR') {
    return res.status(503).json({ success: false, message: getErrorMessage('AI_SERVER_ERROR'), retryAfter: 30 });
  }
  if (msg === 'AI_NETWORK_ERROR') {
    return res.status(503).json({ success: false, message: getErrorMessage('AI_NETWORK_ERROR') });
  }

  next(error);
};

const validateAIRequest = (req, res, next) => {
  const { message, language } = req.body;

  if (req.path.includes('/send') || req.path.includes('/stream')) {
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Message is required and must be a non-empty string' });
    }
    if (message.length > 1000) {
      return res.status(400).json({ success: false, message: 'Message exceeds maximum length of 1000 characters' });
    }
  }

  if (language && !['en', 'hi', 'kn', 'ta'].includes(language)) {
    return res.status(400).json({ success: false, message: 'Unsupported language code' });
  }

  next();
};

module.exports = {
  handleAIError,
  validateAIRequest
};
