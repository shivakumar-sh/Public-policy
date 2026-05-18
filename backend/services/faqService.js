// backend/services/faqService.js
// Purpose: Automatically generates realistic citizen FAQs for government policies

const Policy = require('../models/Policy');
const AICache = require('../models/AICache');
const { buildFAQMessages } = require('../utils/promptBuilder');
const { callOpenAIForJSON, callOpenAI } = require('../utils/openaiHelper');
const { parseFAQResponse } = require('../utils/responseParser');
const translateService = require('./translateService');

const generateFAQs = async (policyId, language = 'en') => {
  const policy = await Policy.findById(policyId);
  if (!policy) throw new Error('Policy not found');

  const cached = await AICache.getCached('faq', policy.content, language);
  if (cached) return JSON.parse(cached);

  const messages = buildFAQMessages(policy.title, policy.content, language);
  const jsonResult = await callOpenAIForJSON(messages, { temperature: 0.6, max_tokens: 2500 });

  let validFAQs = parseFAQResponse(jsonResult);
  if (language !== 'en') {
    validFAQs = await translateService.translateFAQs(validFAQs, language);
  }

  await AICache.setCached('faq', policy.content, language, JSON.stringify(validFAQs), 48);

  return validFAQs;
};

const generateFAQsFromText = async (title, content, language = 'en') => {
  const messages = buildFAQMessages(title, content, language);
  const jsonResult = await callOpenAIForJSON(messages, { temperature: 0.6, max_tokens: 2500 });
  let validFAQs = parseFAQResponse(jsonResult);
  if (language !== 'en') {
    validFAQs = await translateService.translateFAQs(validFAQs, language);
  }
  return validFAQs;
};

const generateQuickFAQ = async (policyId, count = 5) => {
  const policy = await Policy.findById(policyId);
  if (!policy) throw new Error('Policy not found');

  const messages = [
    { role: 'system', content: `Generate exactly ${count} FAQs for this policy. Return JSON array of objects with question and answer.` },
    { role: 'user', content: `Title: ${policy.title}\nContent: ${policy.content}` }
  ];
  const result = await callOpenAIForJSON(messages);
  return Array.isArray(result) ? result.slice(0, count) : [];
};

const getFAQByCategory = async (policyId, category, language = 'en') => {
  const allFAQs = await generateFAQs(policyId, language);
  return allFAQs.filter(faq => faq.category?.toLowerCase() === category.toLowerCase());
};

module.exports = {
  generateFAQs,
  generateFAQsFromText,
  generateQuickFAQ,
  getFAQByCategory
};
