// backend/routes/chatRoutes.js
// Purpose: Express route definitions for all AI-powered features and chat management

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');
const { chatLimiter, aiLimiter } = require('../middleware/rateLimiter');
const { validateAIRequest } = require('../middleware/aiErrorHandler');

// Core Chat Routes
router.post('/send', protect, chatLimiter, validateAIRequest, chatController.sendMessage);
router.post('/stream', protect, chatLimiter, validateAIRequest, chatController.streamMessage);
router.get('/history', protect, chatController.getChatHistory);
router.get('/:id', protect, chatController.getChatById);
router.delete('/:id', protect, chatController.deleteChat);
router.post('/translate', protect, validateAIRequest, chatController.translateMessage);

// Policy AI Routes
router.post('/policies/:id/simplify', protect, aiLimiter, chatController.simplifyPolicyById);
router.post('/policies/compare', protect, aiLimiter, chatController.compareTwoPolicies);
router.post('/policies/:id/faq', protect, aiLimiter, chatController.generatePolicyFAQs);

// Document AI Routes
router.post('/documents/:id/summarize', protect, aiLimiter, chatController.summarizeUploadedDocument);

// User AI Routes
router.get('/recommendations', protect, chatController.getUserRecommendations);

module.exports = router;
