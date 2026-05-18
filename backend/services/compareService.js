// backend/services/compareService.js
// Purpose: Objective side-by-side comparison of two government policies

const Policy = require('../models/Policy');
const AICache = require('../models/AICache');
const { buildCompareMessages } = require('../utils/promptBuilder');
const { callOpenAIWithFallback, callOpenAIForJSON } = require('../utils/openaiHelper');
const translateService = require('./translateService');

const comparePolicies = async (policyId1, policyId2, language = 'en') => {
  const [policy1, policy2] = await Promise.all([
    Policy.findById(policyId1),
    Policy.findById(policyId2)
  ]);

  if (!policy1 || !policy2) throw new Error('One or both policies not found');

  const cacheKeyInput = `${policyId1}:${policyId2}`;
  const cached = await AICache.getCached('compare', cacheKeyInput, language);
  if (cached) return cached;

  const messages = buildCompareMessages(policy1, policy2, language);
  let comparisonText = await callOpenAIWithFallback(messages, { temperature: 0.5, max_tokens: 2000 });

  if (language !== 'en') {
    comparisonText = await translateService.translateText(comparisonText, language);
  }

  await AICache.setCached('compare', cacheKeyInput, language, comparisonText, 48);

  return comparisonText;
};

const compareTexts = async (policy1Object, policy2Object, language = 'en') => {
  const messages = buildCompareMessages(policy1Object, policy2Object, language);
  let comparisonText = await callOpenAIWithFallback(messages, { temperature: 0.5, max_tokens: 2000 });

  if (language !== 'en') {
    comparisonText = await translateService.translateText(comparisonText, language);
  }
  return comparisonText;
};

const generateComparisonTable = async (policyId1, policyId2) => {
  const [policy1, policy2] = await Promise.all([
    Policy.findById(policyId1),
    Policy.findById(policyId2)
  ]);

  if (!policy1 || !policy2) throw new Error('Policies not found');

  const messages = [
    { role: 'system', content: 'Compare these two policies and return a JSON comparison table. Return JSON: { "headers": ["Feature", "Policy1Name", "Policy2Name"], "rows": [{ "feature": "Purpose", "policy1": "value", "policy2": "value" }] }' },
    { role: 'user', content: `Policy 1: ${policy1.title}\nContent: ${policy1.content}\n\nPolicy 2: ${policy2.title}\nContent: ${policy2.content}` }
  ];

  return await callOpenAIForJSON(messages) || { headers: ['Feature', policy1.title, policy2.title], rows: [] };
};

module.exports = {
  comparePolicies,
  compareTexts,
  generateComparisonTable
};
