const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Policy = require('../models/Policy');
const Chat = require('../models/Chat');
const Document = require('../models/Document');

// @desc    Get user's bookmarked policies
// @route   GET /api/users/bookmarks
// @access  Private
const getBookmarks = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('bookmarks');
  res.json({
    success: true,
    data: user.bookmarks,
  });
});

// @desc    Add a policy to bookmarks
// @route   POST /api/users/bookmarks/:id
// @access  Private
const addBookmark = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const policy = await Policy.findById(req.params.id);

  if (!policy) {
    res.status(404);
    throw new Error('Policy not found');
  }

  if (user.bookmarks.includes(policy._id)) {
    res.status(400);
    throw new Error('Policy already bookmarked');
  }

  user.bookmarks.push(policy._id);
  await user.save();

  res.json({
    success: true,
    message: 'Policy bookmarked',
  });
});

// @desc    Remove a policy from bookmarks
// @route   DELETE /api/users/bookmarks/:id
// @access  Private
const removeBookmark = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  user.bookmarks = user.bookmarks.filter(
    (id) => id.toString() !== req.params.id
  );
  await user.save();

  res.json({
    success: true,
    message: 'Bookmark removed',
  });
});

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
const getUserStats = asyncHandler(async (req, res) => {
  const chatsCount = await Chat.countDocuments({ user: req.user._id });
  const docsCount = await Document.countDocuments({ user: req.user._id });
  const bookmarksCount = req.user.bookmarks.length;

  res.json({
    success: true,
    data: {
      chats: chatsCount,
      documents: docsCount,
      bookmarks: bookmarksCount,
    },
  });
});

module.exports = {
  getBookmarks,
  addBookmark,
  removeBookmark,
  getUserStats,
};
