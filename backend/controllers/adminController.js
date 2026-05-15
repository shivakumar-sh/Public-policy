const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Policy = require('../models/Policy');
const Chat = require('../models/Chat');
const Feedback = require('../models/Feedback');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).sort('-createdAt');
  res.json({
    success: true,
    data: users,
  });
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.role = req.body.role || user.role;
    await user.save();
    res.json({
      success: true,
      message: 'User role updated',
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.role === 'admin') {
      res.status(400);
      throw new Error('Cannot delete an admin user');
    }
    await user.deleteOne();
    res.json({
      success: true,
      message: 'User removed',
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get platform stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getPlatformStats = asyncHandler(async (req, res) => {
  const userCount = await User.countDocuments();
  const policyCount = await Policy.countDocuments();
  const chatCount = await Chat.countDocuments();
  const feedbackCount = await Feedback.countDocuments();

  // Simple analytics: Signups per day (last 7 days)
  const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const signups = await User.aggregate([
    { $match: { createdAt: { $gte: last7Days } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.json({
    success: true,
    data: {
      users: userCount,
      policies: policyCount,
      chats: chatCount,
      feedbacks: feedbackCount,
      analytics: {
        signups
      }
    },
  });
});

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getPlatformStats,
};
