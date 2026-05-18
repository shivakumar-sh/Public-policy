// backend/controllers/chatController.js
// Purpose: Express controller handling HTTP requests for all AI services

const chatService = require('../services/chatService');
const summarizeService = require('../services/summarizeService');
const simplifyService = require('../services/simplifyService');
const translateService = require('../services/translateService');
const compareService = require('../services/compareService');
const faqService = require('../services/faqService');
const recommendService = require('../services/recommendService');

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const sendMessage = asyncHandler(async (req, res) => {
  const { message, language, chatId } = req.body;
  const userId = req.user?._id;

  const result = await chatService.processChat(userId, chatId, message, language);

  return res.status(200).json({
    success: true,
    data: {
      response: result.response,
      chatId: result.chatId,
      chatTitle: result.chatTitle,
      followUps: result.followUps,
      language: result.language
    },
    timestamp: new Date().toISOString()
  });
});

const streamMessage = asyncHandler(async (req, res) => {
  const { message, language, chatId } = req.body;
  const userId = req.user?._id;

  await chatService.processChatWithStream(userId, chatId, message, language, res);
});

const getChatHistory = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 20);
  const userId = req.user?._id;

  const result = await chatService.getUserChats(userId, page, limit);

  return res.status(200).json({
    success: true,
    data: {
      items: result.chats,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages
    },
    timestamp: new Date().toISOString()
  });
});

const getChatById = asyncHandler(async (req, res) => {
  const chatId = req.params.id;
  const userId = req.user?._id;

  const chat = await chatService.getChatById(chatId, userId);

  return res.status(200).json({
    success: true,
    data: chat,
    timestamp: new Date().toISOString()
  });
});

const deleteChat = asyncHandler(async (req, res) => {
  const chatId = req.params.id;
  const userId = req.user?._id;

  await chatService.deleteChatById(chatId, userId);

  return res.status(200).json({
    success: true,
    message: 'Chat deleted successfully',
    timestamp: new Date().toISOString()
  });
});

const translateMessage = asyncHandler(async (req, res) => {
  const { text, language } = req.body;
  if (!text || !language) {
    return res.status(400).json({ success: false, message: 'Text and language are required' });
  }

  const translated = await translateService.translateText(text, language);

  return res.status(200).json({
    success: true,
    data: { translated, language },
    timestamp: new Date().toISOString()
  });
});

const simplifyPolicyById = asyncHandler(async (req, res) => {
  const policyId = req.params.id;
  const language = req.body.language || 'en';

  const simplified = await simplifyService.simplifyPolicy(policyId, language);

  return res.status(200).json({
    success: true,
    data: { simplified, policyId },
    timestamp: new Date().toISOString()
  });
});

const compareTwoPolicies = asyncHandler(async (req, res) => {
  const { policyId1, policyId2, language } = req.body;
  if (!policyId1 || !policyId2 || policyId1 === policyId2) {
    return res.status(400).json({ success: false, message: 'Two distinct valid policy IDs are required' });
  }

  const comparison = await compareService.comparePolicies(policyId1, policyId2, language || 'en');

  return res.status(200).json({
    success: true,
    data: { comparison, policies: [policyId1, policyId2] },
    timestamp: new Date().toISOString()
  });
});

const generatePolicyFAQs = asyncHandler(async (req, res) => {
  const policyId = req.params.id;
  const language = req.body.language || 'en';

  const faqs = await faqService.generateFAQs(policyId, language);

  return res.status(200).json({
    success: true,
    data: { faqs, policyId },
    timestamp: new Date().toISOString()
  });
});

const summarizeUploadedDocument = asyncHandler(async (req, res) => {
  const documentId = req.params.id;
  const language = req.body.language || 'en';
  const userId = req.user?._id;

  const summary = await summarizeService.summarizeDocument(documentId, userId, language);

  return res.status(200).json({
    success: true,
    data: { summary, documentId },
    timestamp: new Date().toISOString()
  });
});

const getUserRecommendations = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const recommendations = await recommendService.getPersonalizedRecommendations(userId);

  return res.status(200).json({
    success: true,
    data: { recommendations },
    timestamp: new Date().toISOString()
  });
});

module.exports = {
  sendMessage,
  streamMessage,
  getChatHistory,
  getChatById,
  deleteChat,
  translateMessage,
  simplifyPolicyById,
  compareTwoPolicies,
  generatePolicyFAQs,
  summarizeUploadedDocument,
  getUserRecommendations
};
