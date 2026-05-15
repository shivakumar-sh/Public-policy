const asyncHandler = require('express-async-handler');
const chatService = require('../services/chatService');
const summarizeService = require('../services/summarizeService');
const simplifyService = require('../services/simplifyService');
const translateService = require('../services/translateService');
const compareService = require('../services/compareService');
const faqService = require('../services/faqService');
const recommendService = require('../services/recommendService');
const { streamOpenAI } = require('../utils/openaiHelper');
const { buildChatPrompt } = require('../utils/promptBuilder');
const Chat = require('../models/Chat');

/**
 * Chat Controller
 * Orchestrates all AI-related endpoints
 */

// @desc    Send a message to the AI
// @route   POST /api/chat/send
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { message, chatId, language } = req.body;
  const lang = language || 'en';

  if (!message) {
    res.status(400);
    throw new Error('Message is required');
  }

  const result = await chatService.processChat(req.user._id, chatId, message, lang);

  res.json({
    success: true,
    data: result
  });
});

// @desc    Stream AI response via SSE
// @route   POST /api/chat/stream
// @access  Private
const streamMessage = asyncHandler(async (req, res) => {
  const { message, chatId, language } = req.body;
  const lang = language || 'en';

  if (!message) {
    res.status(400);
    throw new Error('Message is required');
  }

  let chat;
  if (chatId) {
    chat = await Chat.findOne({ _id: chatId, user: req.user._id });
  }

  if (!chat) {
    chat = await Chat.create({
      user: req.user._id,
      title: message.substring(0, 30) + '...',
      language: lang,
      messages: []
    });
  }

  const history = chat.messages.map(m => ({ role: m.role, content: m.content }));
  const promptMessages = buildChatPrompt(message, lang, history);

  // We'll stream the response and save it once done
  // Note: For production, you'd want to handle the saving in the stream handler
  await streamOpenAI(promptMessages, res);
});

// @desc    Get user's chat history
// @route   GET /api/chat/history
// @access  Private
const getChatHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const result = await chatService.getChatHistory(req.user._id, page, limit);

  res.json({
    success: true,
    data: result
  });
});

// @desc    Get a single chat with messages
// @route   GET /api/chat/:id
// @access  Private
const getChatById = asyncHandler(async (req, res) => {
  const messages = await chatService.getChatMessages(req.params.id, req.user._id);
  res.json({
    success: true,
    data: messages
  });
});

// @desc    Delete a chat
// @route   DELETE /api/chat/:id
// @access  Private
const deleteChat = asyncHandler(async (req, res) => {
  const result = await chatService.deleteChat(req.params.id, req.user._id);
  res.json({
    success: true,
    message: result.message
  });
});

// @desc    Translate text
// @route   POST /api/chat/translate
// @access  Private
const translateMessage = asyncHandler(async (req, res) => {
  const { text, language } = req.body;
  const result = await translateService.translateText(text, language);
  res.json({
    success: true,
    data: result
  });
});

// @desc    Simplify a policy
// @route   POST /api/policies/:id/simplify
// @access  Private
const simplifyPolicy = asyncHandler(async (req, res) => {
  const { language } = req.body;
  const result = await simplifyService.simplifyPolicy(req.params.id, language);
  res.json({
    success: true,
    data: result
  });
});

// @desc    Compare two policies
// @route   POST /api/policies/compare
// @access  Private
const comparePolicies = asyncHandler(async (req, res) => {
  const { policyId1, policyId2, language } = req.body;
  const result = await compareService.comparePolicies(policyId1, policyId2, language);
  res.json({
    success: true,
    data: result
  });
});

// @desc    Generate FAQs for a policy
// @route   POST /api/policies/:id/faq
// @access  Private
const generateFAQs = asyncHandler(async (req, res) => {
  const { language } = req.body;
  const result = await faqService.generateFAQs(req.params.id, language);
  res.json({
    success: true,
    data: result
  });
});

// @desc    Summarize an uploaded document
// @route   POST /api/upload/:id/summarize
// @access  Private
const summarizeDocument = asyncHandler(async (req, res) => {
  const { language } = req.body;
  const result = await summarizeService.summarizeDocument(req.params.id, req.user._id, language);
  res.json({
    success: true,
    data: result
  });
});

// @desc    Get personalized recommendations
// @route   GET /api/users/recommendations
// @access  Private
const getRecommendations = asyncHandler(async (req, res) => {
  const result = await recommendService.getRecommendations(req.user._id);
  res.json({
    success: true,
    data: result
  });
});

module.exports = {
  sendMessage,
  streamMessage,
  getChatHistory,
  getChatById,
  deleteChat,
  translateMessage,
  simplifyPolicy,
  comparePolicies,
  generateFAQs,
  summarizeDocument,
  getRecommendations
};
