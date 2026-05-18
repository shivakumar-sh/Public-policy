// backend/services/simplifyService.js
// Purpose: Transforms complex policy jargon into plain, accessible citizen language

const Policy = require('../models/Policy');
const AICache = require('../models/AICache');
const { buildSimplifyMessages } = require('../utils/promptBuilder');
const { callOpenAIWithFallback, callOpenAIForJSON } = require('../utils/openaiHelper');
const translateService = require('./translateService');

const simplifyPolicy = async (policyId, language = 'en') => {
  const policy = await Policy.findById(policyId);
  if (!policy) throw new Error('Policy not found');

  const cached = await AICache.getCached('simplify', policy.content, language);
  if (cached) return cached;

  const messages = buildSimplifyMessages(policy.title, policy.content, language);
  let simplifiedText = await callOpenAIWithFallback(messages, { temperature: 0.5, max_tokens: 1500 });

  if (language !== 'en') {
    simplifiedText = await translateService.translateText(simplifiedText, language);
  }

  policy.simplifiedContent = simplifiedText;
  await policy.save();

  await AICache.setCached('simplify', policy.content, language, simplifiedText, 72);

  return simplifiedText;
};

const simplifyText = async (title, content, language = 'en') => {
  const cached = await AICache.getCached('simplify_text', content, language);
  if (cached) return cached;

  const messages = buildSimplifyMessages(title, content, language);
  let simplifiedText = await callOpenAIWithFallback(messages, { temperature: 0.5, max_tokens: 1500 });

  if (language !== 'en') {
    simplifiedText = await translateService.translateText(simplifiedText, language);
  }

  await AICache.setCached('simplify_text', content, language, simplifiedText, 72);
  return simplifiedText;
};

const readingLevelCheck = async (text) => {
  const messages = [
    { role: 'system', content: 'Rate the reading difficulty of this text on a scale: 1 = Very Easy (Class 5), 10 = Very Hard (Legal Expert). Return JSON: { "score": number, "level": string, "suggestion": string }' },
    { role: 'user', content: text }
  ];
  return await callOpenAIForJSON(messages) || { score: 5, level: 'Moderate', suggestion: 'Clear and readable.' };
};

module.exports = {
  simplifyPolicy,
  simplifyText,
  readingLevelCheck
};
