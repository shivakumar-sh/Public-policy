// backend/services/sentimentService.js
// Purpose: Analyzes citizen feedback sentiment to identify core issues and praises

const Feedback = require('../models/Feedback');
const { buildSentimentMessages } = require('../utils/promptBuilder');
const { callOpenAIForJSON } = require('../utils/openaiHelper');

const analyzeFeedback = async (feedbackId) => {
  const feedback = await Feedback.findById(feedbackId);
  if (!feedback || !feedback.comment) {
    return { sentiment: 'neutral', score: 0 };
  }

  const messages = buildSentimentMessages(feedback.comment);
  const result = await callOpenAIForJSON(messages, { temperature: 0.3 }) || {
    sentiment: 'neutral',
    score: 0.5,
    mainIssue: 'None',
    mainPraise: 'General satisfaction',
    actionRequired: false,
    suggestedAction: 'None'
  };

  feedback.sentiment = result.sentiment;
  feedback.sentimentScore = result.score;
  await feedback.save();

  return result;
};

const analyzeText = async (text) => {
  if (!text) return { sentiment: 'neutral', score: 0 };
  const messages = buildSentimentMessages(text);
  return await callOpenAIForJSON(messages, { temperature: 0.3 }) || { sentiment: 'neutral', score: 0.5 };
};

const getBatchSentiment = async (feedbackIds = []) => {
  const results = [];
  // Process in chunks of 5
  for (let i = 0; i < feedbackIds.length; i += 5) {
    const batch = feedbackIds.slice(i, i + 5);
    const batchResults = await Promise.all(batch.map(id => analyzeFeedback(id)));
    results.push(...batchResults);
    if (i + 5 < feedbackIds.length) {
      await new Promise(r => setTimeout(r, 1000)); // 1 sec delay between batches
    }
  }
  return results;
};

const getSentimentSummary = async (userId) => {
  const feedbacks = await Feedback.find({ user: userId });
  let positive = 0;
  let negative = 0;
  let neutral = 0;
  let totalRating = 0;

  feedbacks.forEach(f => {
    if (f.sentiment === 'positive') positive++;
    else if (f.sentiment === 'negative') negative++;
    else neutral++;
    totalRating += (f.rating || 5);
  });

  return {
    totalFeedbacks: feedbacks.length,
    positive,
    negative,
    neutral,
    averageRating: feedbacks.length ? (totalRating / feedbacks.length).toFixed(1) : 5.0
  };
};

module.exports = {
  analyzeFeedback,
  analyzeText,
  getBatchSentiment,
  getSentimentSummary
};
