// backend/models/Chat.js
// Purpose: Mongoose schema for storing user chat conversations and metadata

const mongoose = require('mongoose');
const { estimateTokens } = require('../utils/tokenCounter');

const messageSubSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  language: {
    type: String,
    default: 'en'
  },
  tokenCount: {
    type: Number,
    default: 0
  }
});

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    default: 'New Chat',
    trim: true,
    maxlength: 100
  },
  messages: [messageSubSchema],
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'hi', 'kn', 'ta']
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  documentContext: {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    },
    documentName: String,
    injectedAt: Date
  },
  totalTokensUsed: {
    type: Number,
    default: 0
  },
  messageCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Pre-save middleware to update messageCount
chatSchema.pre('save', function(next) {
  this.messageCount = this.messages.length;
  next();
});

// Methods
chatSchema.methods.addMessage = async function(role, content, language = 'en') {
  const tokenCount = estimateTokens(content);
  const newMessage = { role, content, language, tokenCount };
  this.messages.push(newMessage);
  this.messageCount = this.messages.length;
  this.totalTokensUsed += tokenCount;
  await this.save();
  return this.messages[this.messages.length - 1];
};

chatSchema.methods.getRecentMessages = function(count = 10) {
  return this.messages.slice(-count);
};

chatSchema.methods.getTotalTokens = function() {
  return this.messages.reduce((sum, msg) => sum + (msg.tokenCount || 0), 0);
};

// Statics
chatSchema.statics.getUserChats = async function(userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const chats = await this.find({ user: userId, isArchived: false })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('title messageCount language updatedAt createdAt');
  const total = await this.countDocuments({ user: userId, isArchived: false });
  return { chats, total, page, totalPages: Math.ceil(total / limit) };
};

chatSchema.statics.deleteUserChats = async function(userId) {
  return await this.deleteMany({ user: userId });
};

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);
module.exports = Chat;
