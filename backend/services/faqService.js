const Policy = require('../models/Policy');
const { callOpenAI, parseJSONResponse } = require('../utils/openaiHelper');
const { buildFAQPrompt } = require('../utils/promptBuilder');

/**
 * FAQ Generation Service
 * Generates frequently asked questions for a policy
 */
const faqService = {
  /**
   * Generate FAQs for a policy ID
   */
  generateFAQs: async (policyId, language = 'en') => {
    const policy = await Policy.findById(policyId);
    if (!policy) throw new Error('Policy not found');

    const messages = buildFAQPrompt(policy.title, policy.content, language);
    // Requesting a more structured response for parsing
    messages[0].content += "\nRespond with a valid JSON array of objects with 'question' and 'answer' keys.";
    
    const response = await callOpenAI(messages, { temperature: 0.5 });
    const faqs = parseJSONResponse(response);
    
    if (faqs) return faqs;

    // Fallback parsing if JSON fails (manual splitting)
    return faqService.manualParseFAQs(response);
  },

  /**
   * Generate FAQs from text
   */
  generateFAQsFromText: async (title, content, language = 'en') => {
    const messages = buildFAQPrompt(title, content, language);
    messages[0].content += "\nRespond with a valid JSON array of objects with 'question' and 'answer' keys.";
    
    const response = await callOpenAI(messages, { temperature: 0.5 });
    return parseJSONResponse(response) || faqService.manualParseFAQs(response);
  },

  /**
   * Manual parser for non-JSON AI responses
   */
  manualParseFAQs: (text) => {
    const lines = text.split('\n').filter(l => l.trim());
    const faqs = [];
    let current = null;

    lines.forEach(line => {
      if (line.toLowerCase().startsWith('q') || line.includes('?')) {
        if (current) faqs.push(current);
        current = { question: line.replace(/^Q\d+:\s*/i, '').trim(), answer: '' };
      } else if (current) {
        current.answer += (current.answer ? ' ' : '') + line.replace(/^A\d+:\s*/i, '').trim();
      }
    });
    
    if (current) faqs.push(current);
    return faqs.slice(0, 10);
  }
};

module.exports = faqService;
