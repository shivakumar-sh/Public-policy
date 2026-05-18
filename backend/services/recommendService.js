// backend/services/recommendService.js
// Purpose: Personalized government scheme recommendations based on chat history

const Chat = require('../models/Chat');
const Policy = require('../models/Policy');
const { buildRecommendationMessages, buildTopicExtractionMessages } = require('../utils/promptBuilder');
const { callOpenAIForJSON } = require('../utils/openaiHelper');
const { parseRecommendationsResponse, parseTopicsResponse } = require('../utils/responseParser');

const extractTopicsFromHistory = async (messages) => {
  if (!Array.isArray(messages) || messages.length === 0) return [];
  const concatenated = messages.slice(-10).map(m => m.content).join('\n');
  const promptMessages = buildTopicExtractionMessages([{ content: concatenated }]);
  const jsonResult = await callOpenAIForJSON(promptMessages);
  return parseTopicsResponse(jsonResult);
};

const getPopularPolicies = async (count = 3) => {
  const policies = await Policy.find().sort({ views: -1 }).limit(count);
  return policies.map((policy, index) => ({
    rank: index + 1,
    schemeName: policy.title,
    ministry: policy.ministry || 'Government of India',
    whyRelevant: 'This is one of the most accessed policies by citizens.',
    keyBenefit: (policy.description || '').slice(0, 100),
    quickApplyStep: 'Visit the official website or nearest CSC center to apply.',
    officialWebsite: '',
    estimatedBenefit: 'Varies based on eligibility',
    urgency: 'medium',
    urgencyReason: 'Popular scheme worth knowing about'
  }));
};

const getPersonalizedRecommendations = async (userId) => {
  const chats = await Chat.find({ user: userId }).sort({ updatedAt: -1 }).limit(10);
  const allMessages = chats.reduce((acc, chat) => acc.concat(chat.messages || []), []);

  if (allMessages.length < 3) {
    return await getPopularPolicies();
  }

  const recentTopics = await extractTopicsFromHistory(allMessages);
  const userProfile = { language: chats[0]?.language || 'en' };

  const messages = buildRecommendationMessages(userProfile, recentTopics);
  const jsonResult = await callOpenAIForJSON(messages, { temperature: 0.7 });
  const recommendations = parseRecommendationsResponse(jsonResult);

  if (!recommendations || recommendations.length === 0) {
    return await getPopularPolicies();
  }

  return recommendations;
};

const getRecommendationsByCategory = async (category, count = 3) => {
  const policies = await Policy.find({ category }).sort({ views: -1 }).limit(count);
  return policies.map((policy, index) => ({
    rank: index + 1,
    schemeName: policy.title,
    ministry: policy.ministry || 'Government of India',
    whyRelevant: `Highly relevant for citizens interested in ${category}.`,
    keyBenefit: (policy.description || '').slice(0, 100),
    quickApplyStep: 'Check official portal guidelines.',
    officialWebsite: '',
    estimatedBenefit: 'Varies',
    urgency: 'medium',
    urgencyReason: 'Key departmental scheme'
  }));
};

module.exports = {
  getPersonalizedRecommendations,
  extractTopicsFromHistory,
  getPopularPolicies,
  getRecommendationsByCategory
};
