// backend/services/translateService.js
// Purpose: Multi-language translation service preserving official scheme names and formatting

const { isSupported, getAllLanguages } = require('../utils/languageMapper');
const { buildTranslationMessages } = require('../utils/promptBuilder');
const { callOpenAIWithFallback, callOpenAIForJSON } = require('../utils/openaiHelper');
const AICache = require('../models/AICache');

const translateText = async (text, targetLanguageCode) => {
  if (!text || targetLanguageCode === 'en') return text;
  if (!isSupported(targetLanguageCode)) throw new Error('Language not supported');

  const cached = await AICache.getCached('translate', text, targetLanguageCode);
  if (cached) return cached;

  const messages = buildTranslationMessages(text, targetLanguageCode);
  const translated = await callOpenAIWithFallback(messages, { temperature: 0.3, max_tokens: 2000 });

  await AICache.setCached('translate', text, targetLanguageCode, translated, 48);
  return translated;
};

const translatePolicyContent = async (policyId, targetLanguageCode) => {
  const Policy = require('../models/Policy');
  const policy = await Policy.findById(policyId);
  if (!policy) throw new Error('Policy not found');

  const translated = await translateText(policy.content, targetLanguageCode);
  let simplifiedTranslated = null;
  if (policy.simplifiedContent) {
    simplifiedTranslated = await translateText(policy.simplifiedContent, targetLanguageCode);
  }

  return { original: policy.content, translated, simplifiedTranslated };
};

const translateFAQs = async (faqsArray, targetLanguageCode) => {
  if (targetLanguageCode === 'en' || !Array.isArray(faqsArray)) return faqsArray;

  return await Promise.all(faqsArray.map(async (faq) => {
    const transQ = await translateText(faq.question, targetLanguageCode);
    const transA = await translateText(faq.answer, targetLanguageCode);
    return { ...faq, question: transQ, answer: transA };
  }));
};

const detectLanguage = async (text) => {
  const messages = [
    { role: 'system', content: 'Detect the language of the text. Return JSON: { "language": "language name", "code": "ISO 639-1 code", "confidence": "high/medium/low" }' },
    { role: 'user', content: (text || '').slice(0, 200) }
  ];
  return await callOpenAIForJSON(messages) || { language: 'English', code: 'en', confidence: 'high' };
};

const getSupportedLanguages = () => {
  return getAllLanguages();
};

module.exports = {
  translateText,
  translatePolicyContent,
  translateFAQs,
  detectLanguage,
  getSupportedLanguages
};
