const Policy = require('../models/Policy');
const { callOpenAI } = require('../utils/openaiHelper');
const { buildComparePrompt } = require('../utils/promptBuilder');

/**
 * Policy Comparison Service
 * Compares two policies side-by-side
 */
const compareService = {
  /**
   * Compare two policies by ID
   */
  comparePolicies: async (policyId1, policyId2, language = 'en') => {
    const [p1, p2] = await Promise.all([
      Policy.findById(policyId1),
      Policy.findById(policyId2)
    ]);

    if (!p1 || !p2) throw new Error('One or both policies not found');

    const messages = buildComparePrompt(p1, p2, language);
    return await callOpenAI(messages, { temperature: 0.5 });
  },

  /**
   * Compare two policy texts directly
   */
  compareTexts: async (p1Obj, p2Obj, language = 'en') => {
    const messages = buildComparePrompt(p1Obj, p2Obj, language);
    return await callOpenAI(messages, { temperature: 0.5 });
  }
};

module.exports = compareService;
