const Policy = require('../models/Policy');
const { callOpenAI } = require('../utils/openaiHelper');
const { buildSimplifyPrompt } = require('../utils/promptBuilder');

/**
 * Simplification Service
 * Converts complex policy text into citizen-friendly language
 */
const simplifyService = {
  /**
   * Simplify a policy from database
   */
  simplifyPolicy: async (policyId, language = 'en') => {
    const policy = await Policy.findById(policyId);
    if (!policy) throw new Error('Policy not found');

    const messages = buildSimplifyPrompt(policy.content, policy.title, language);
    const simplified = await callOpenAI(messages, { temperature: 0.3 });

    // Only save to DB if it's English, or we could have a map of translations
    if (language === 'en') {
      policy.simplifiedContent = simplified;
      await policy.save();
    }

    return simplified;
  },

  /**
   * Simplify arbitrary text
   */
  simplifyText: async (title, content, language = 'en') => {
    const messages = buildSimplifyPrompt(content, title, language);
    return await callOpenAI(messages, { temperature: 0.3 });
  }
};

module.exports = simplifyService;
