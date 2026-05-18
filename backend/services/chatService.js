// backend/services/chatService.js
// Purpose: Core business logic for handling user chats, context management, and AI streaming

const Chat = require('../models/Chat');
const TokenUsage = require('../models/TokenUsage');
const { calculateCost } = require('../models/TokenUsage');
const { buildChatMessages, buildTitleMessages } = require('../utils/promptBuilder');
const { callOpenAIWithFallback, callOpenAI, createStreamingResponse } = require('../utils/openaiHelper');
const { setupSSEHeaders, sendChunk, sendMetadata, sendDone, sendError, streamChatResponse } = require('../utils/streamHandler');
const { buildContextFromHistory } = require('../utils/contextManager');
const { isWithinTokenLimit, trimConversationHistory, estimateTokens } = require('../utils/tokenCounter');
const followupService = require('./followupService');

const createNewChat = async (userId, firstMessage) => {
  const generatedTitle = await generateChatTitle(firstMessage);
  const newChat = new Chat({
    user: userId,
    title: generatedTitle,
    messages: [],
    language: 'en'
  });
  await newChat.save();
  return newChat;
};

const generateChatTitle = async (message) => {
  try {
    const messages = buildTitleMessages(message);
    const title = await callOpenAI(messages, { temperature: 0.3, max_tokens: 20 });
    const cleaned = title.replace(/["']/g, '').trim();
    return cleaned || 'Policy Chat';
  } catch (error) {
    return 'Policy Chat';
  }
};

const processChat = async (userId, chatId, userMessage, language = 'en') => {
  let chat;
  if (chatId) {
    chat = await Chat.findOne({ _id: chatId, user: userId });
    if (!chat) throw new Error('Chat not found');
  } else {
    chat = await createNewChat(userId, userMessage);
  }

  await chat.addMessage('user', userMessage, language);

  const historyMessages = buildContextFromHistory(chat.messages, 10);
  let messages = buildChatMessages(userMessage, language, historyMessages);

  if (!isWithinTokenLimit(messages)) {
    messages = trimConversationHistory(messages);
  }

  const responseText = await callOpenAIWithFallback(messages, { temperature: 0.7, max_tokens: 1500 });
  await chat.addMessage('assistant', responseText, language);

  // Generate follow-ups asynchronously in parallel
  const followUpsPromise = followupService.generateFollowUps(chat.messages);

  // Background token tracking
  setTimeout(async () => {
    try {
      const promptTokens = estimateTokens(userMessage);
      const completionTokens = estimateTokens(responseText);
      const totalTokens = promptTokens + completionTokens;
      const cost = calculateCost('gpt-4-turbo-preview', promptTokens, completionTokens);

      await TokenUsage.create({
        userId,
        chatId: chat._id,
        feature: 'chat',
        model: 'gpt-4-turbo-preview',
        promptTokens,
        completionTokens,
        totalTokens,
        estimatedCostUSD: cost,
        language
      });
    } catch (err) {
      console.error('❌ Background Token Tracking Error:', err.message);
    }
  }, 0);

  const followUps = await followUpsPromise;

  return {
    response: responseText,
    chatId: chat._id,
    chatTitle: chat.title,
    followUps,
    language
  };
};

const processChatWithStream = async (userId, chatId, userMessage, language = 'en', res) => {
  let chat;
  if (chatId) {
    chat = await Chat.findOne({ _id: chatId, user: userId });
    if (!chat) throw new Error('Chat not found');
  } else {
    chat = await createNewChat(userId, userMessage);
  }

  await chat.addMessage('user', userMessage, language);

  const historyMessages = buildContextFromHistory(chat.messages, 10);
  let messages = buildChatMessages(userMessage, language, historyMessages);

  if (!isWithinTokenLimit(messages)) {
    messages = trimConversationHistory(messages);
  }

  await streamChatResponse(res, messages, { temperature: 0.7 }, async (fullContent) => {
    await chat.addMessage('assistant', fullContent, language);
    const followUps = await followupService.generateFollowUps(chat.messages);
    sendMetadata(res, { chatId: chat._id, followUps });
    sendDone(res);

    // Background token tracking
    setTimeout(async () => {
      try {
        const promptTokens = estimateTokens(userMessage);
        const completionTokens = estimateTokens(fullContent);
        const cost = calculateCost('gpt-4-turbo-preview', promptTokens, completionTokens);
        await TokenUsage.create({
          userId, chatId: chat._id, feature: 'chat', model: 'gpt-4-turbo-preview',
          promptTokens, completionTokens, totalTokens: promptTokens + completionTokens, estimatedCostUSD: cost, language
        });
      } catch (err) {
        console.error('❌ Background Token Tracking Error:', err.message);
      }
    }, 0);
  });
};

const getUserChats = async (userId, page = 1, limit = 20) => {
  return await Chat.getUserChats(userId, page, limit);
};

const getChatById = async (chatId, userId) => {
  const chat = await Chat.findOne({ _id: chatId, user: userId });
  if (!chat) throw new Error('Chat not found or unauthorized');
  return chat;
};

const deleteChatById = async (chatId, userId) => {
  const result = await Chat.findOneAndDelete({ _id: chatId, user: userId });
  if (!result) throw new Error('Chat not found or unauthorized');
  return { success: true, message: 'Chat deleted successfully' };
};

const archiveChat = async (chatId, userId) => {
  const chat = await Chat.findOne({ _id: chatId, user: userId });
  if (!chat) throw new Error('Chat not found or unauthorized');
  chat.isArchived = true;
  await chat.save();
  return chat;
};

const getChatStats = async (userId) => {
  const totalChats = await Chat.countDocuments({ user: userId });
  const chats = await Chat.find({ user: userId });
  const totalMessages = chats.reduce((sum, c) => sum + (c.messages?.length || 0), 0);
  return {
    totalChats,
    totalMessages,
    mostUsedLanguage: 'en',
    recentTopics: ['Agriculture', 'Health', 'Education']
  };
};

module.exports = {
  processChat,
  processChatWithStream,
  createNewChat,
  generateChatTitle,
  getUserChats,
  getChatById,
  deleteChatById,
  archiveChat,
  getChatStats
};
