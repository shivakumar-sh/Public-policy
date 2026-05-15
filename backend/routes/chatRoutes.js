const express = require('express');
const router = express.Router();
const {
  sendMessage,
  streamMessage,
  getChatHistory,
  getChatById,
  deleteChat,
  translateMessage,
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// All chat routes are protected
router.use(protect);

router.post('/send', sendMessage);
router.post('/stream', streamMessage);
router.get('/history', getChatHistory);
router.get('/:id', getChatById);
router.delete('/:id', deleteChat);
router.post('/translate', translateMessage);

module.exports = router;
