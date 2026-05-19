const mongoose = require('mongoose');

const tokenUsageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  endpoint: {
    type: String,
    required: false
  },
  feature: {
    type: String,
    required: false
  },
  model: {
    type: String,
    required: true
  },
  promptTokens: {
    type: Number,
    required: true
  },
  completionTokens: {
    type: Number,
    required: true
  },
  totalTokens: {
    type: Number,
    required: true
  },
  estimatedCostUSD: {
    type: Number,
    required: false,
    default: 0
  },
  language: {
    type: String,
    default: 'en'
  }
}, { timestamps: true });

tokenUsageSchema.statics.calculateCost = function(model, promptTokens, completionTokens) {
  const rates = {
    'gpt-4-turbo-preview': { prompt: 10 / 1000000, completion: 30 / 1000000 },
    'default': { prompt: 1.5 / 1000000, completion: 2 / 1000000 }
  };
  const rate = rates[model] || rates['default'];
  return (promptTokens * rate.prompt) + (completionTokens * rate.completion);
};

tokenUsageSchema.index({ userId: 1, createdAt: -1 });

const TokenUsage = mongoose.model('TokenUsage', tokenUsageSchema);
module.exports = TokenUsage;
