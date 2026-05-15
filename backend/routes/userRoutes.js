const express = require('express');
const router = express.Router();
const {
  getBookmarks,
  addBookmark,
  removeBookmark,
  getUserStats,
} = require('../controllers/userController');
const { getRecommendations } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.get('/bookmarks', protect, getBookmarks);
router.post('/bookmarks/:id', protect, addBookmark);
router.delete('/bookmarks/:id', protect, removeBookmark);
router.get('/stats', protect, getUserStats);
router.get('/recommendations', protect, getRecommendations);

module.exports = router;
