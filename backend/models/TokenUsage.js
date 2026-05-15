const mongoose = require('mongoose');

const tokenUsageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    endpoint: {
      type: String,
      required: true,
    },
    promptTokens: {
      type: Number,
      required: true,
    },
    completionTokens: {
      type: Number,
      required: true,
    },
    totalTokens: {
      type: Number,
      required: true,
    },
    model: {
      type: String,
      default: 'gpt-3.5-turbo',
    },
  },
  {
    timestamps: true,
  }
);

const TokenUsage = mongoose.model('TokenUsage', tokenUsageSchema);
module.exports = TokenUsage;
