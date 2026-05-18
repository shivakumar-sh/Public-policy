// backend/services/summarizeService.js
// Purpose: Handles PDF and document summarization with caching and multi-language support

const Document = require('../models/Document');
const AICache = require('../models/AICache');
const { buildSummaryMessages } = require('../utils/promptBuilder');
const { callOpenAIWithFallback, callOpenAIForJSON } = require('../utils/openaiHelper');
const translateService = require('./translateService');
const faqService = require('./faqService');
const { truncateText } = require('../utils/tokenCounter');

const summarizeDocument = async (documentId, userId, language = 'en') => {
  const document = await Document.findOne({ _id: documentId, user: userId });
  if (!document) throw new Error('Document not found');
  if (document.status === 'processing') throw new Error('Document still processing');

  if (document.summary && language === 'en') {
    return document.summary;
  }

  const cached = await AICache.getCached('summarize', document.extractedText, language);
  if (cached) return cached;

  const messages = buildSummaryMessages(document.extractedText, language);
  let summaryText = await callOpenAIWithFallback(messages, { temperature: 0.3, max_tokens: 2000 });

  if (language !== 'en') {
    summaryText = await translateService.translateText(summaryText, language);
  }

  document.summary = summaryText;
  document.status = 'completed';
  await document.save();

  await AICache.setCached('summarize', document.extractedText, language, summaryText, 48);

  return summaryText;
};

const summarizeText = async (rawText, documentName, language = 'en') => {
  const truncated = truncateText(rawText, 2500);
  const cached = await AICache.getCached('summarize_text', truncated, language);
  if (cached) return cached;

  const messages = buildSummaryMessages(truncated, language);
  let summaryText = await callOpenAIWithFallback(messages, { temperature: 0.3, max_tokens: 2000 });

  if (language !== 'en') {
    summaryText = await translateService.translateText(summaryText, language);
  }

  await AICache.setCached('summarize_text', truncated, language, summaryText, 48);
  return summaryText;
};

const extractKeyPoints = async (text, count = 7) => {
  const messages = [
    { role: 'system', content: `Extract exactly ${count} key points from the text. Return ONLY a JSON array of strings.` },
    { role: 'user', content: text }
  ];
  const result = await callOpenAIForJSON(messages);
  if (Array.isArray(result)) return result.slice(0, count);
  return [];
};

const generateDocumentFAQ = async (documentId, userId, language = 'en') => {
  const document = await Document.findOne({ _id: documentId, user: userId });
  if (!document) throw new Error('Document not found');
  return await faqService.generateFAQsFromText(document.title || 'Document', document.extractedText, language);
};

module.exports = {
  summarizeDocument,
  summarizeText,
  extractKeyPoints,
  generateDocumentFAQ
};
