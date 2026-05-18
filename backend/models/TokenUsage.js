// backend/models/TokenUsage.js
// Purpose: Mongoose schema for tracking AI token consumption and cost analytics

const mongoose = require('mongoose');

const tokenUsageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  },
  feature: {
    type: String,
    enum: ['chat', 'summarize', 'simplify', 'compare', 'translate', 'faq', 'recommend', 'title', 'followup'],
    required: true
  },
  model: {
    type: String,
    required: true
  },
  promptTokens: {
    type: Number,
    default: 0
  },
  completionTokens: {
    type: Number,
    default: 0
  },
  totalTokens: {
    type: Number,
    default: 0
  },
  estimatedCostUSD: {
    type: Number,
    default: 0
  },
  language: {
    type: String,
    default: 'en'
  }
}, { timestamps: true });

// Statics
tokenUsageSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $group: {
      _id: '$feature',
      totalTokens: { $sum: '$totalTokens' },
      totalCost: { $sum: '$estimatedCostUSD' }
    }}
  ]);
  return stats.reduce((acc, curr) => {
    acc[curr._id] = { totalTokens: curr.totalTokens, totalCost: curr.totalCost };
    return acc;
  }, {});
};

tokenUsageSchema.statics.getDailyStats = async function(days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return await this.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    { $group: {
      _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
      totalTokens: { $sum: '$totalTokens' },
      totalCost: { $sum: '$estimatedCostUSD' }
    }},
    { $sort: { _id: 1 } },
    { $project: { date: '$_id', totalTokens: 1, totalCost: 1, _id: 0 } }
  ]);
};

tokenUsageSchema.statics.getTopUsers = async function(limit = 10) {
  return await this.aggregate([
    { $group: {
      _id: '$userId',
      totalTokens: { $sum: '$totalTokens' },
      totalCost: { $sum: '$estimatedCostUSD' }
    }},
    { $sort: { totalTokens: -1 } },
    { $limit: limit },
    { $lookup: {
      from: 'users',
      localField: '_id',
      foreignField: '_id',
      as: 'user'
    }},
    { $unwind: '$user' },
    { $project: { userId: '$_id', name: '$user.name', email: '$user.email', totalTokens: 1, totalCost: 1, _id: 0 } }
  ]);
};

const calculateCost = (model, promptTokens, completionTokens) => {
  let promptRate = 0;
  let completionRate = 0;

  if (model.includes('gpt-4')) {
    promptRate = 0.01 / 1000;
    completionRate = 0.03 / 1000;
  } else if (model.includes('gpt-3.5')) {
    promptRate = 0.001 / 1000;
    completionRate = 0.002 / 1000;
  }

  return (promptTokens * promptRate) + (completionTokens * completionRate);
};

const TokenUsage = mongoose.models.TokenUsage || mongoose.model('TokenUsage', tokenUsageSchema);
module.exports = TokenUsage;
module.exports.calculateCost = calculateCost;
