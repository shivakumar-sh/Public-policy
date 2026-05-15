const Document = require('../models/Document');
const { callOpenAI } = require('../utils/openaiHelper');
const { buildSummaryPrompt } = require('../utils/promptBuilder');
const { truncateToTokenLimit } = require('../utils/tokenCounter');

/**
 * Summarization Service
 * Handles PDF text analysis and summary generation
 */
const summarizeService = {
  /**
   * Summarize a document stored in database
   */
  summarizeDocument: async (documentId, userId, language = 'en') => {
    const doc = await Document.findOne({ _id: documentId, user: userId });
    
    if (!doc) throw new Error('Document not found');
    if (!doc.extractedText) throw new Error('No text extracted from document');

    try {
      const messages = buildSummaryPrompt(doc.extractedText, language);
      const summary = await callOpenAI(messages, { temperature: 0.3, max_tokens: 2000 });

      doc.summary = summary;
      doc.status = 'completed';
      doc.language = language;
      await doc.save();

      return summary;
    } catch (error) {
      doc.status = 'failed';
      await doc.save();
      throw error;
    }
  },

  /**
   * Summarize arbitrary text directly
   */
  summarizeText: async (text, language = 'en') => {
    const truncatedText = truncateToTokenLimit(text, 3500);
    const messages = buildSummaryPrompt(truncatedText, language);
    return await callOpenAI(messages, { temperature: 0.3 });
  },

  /**
   * Extract key features as JSON
   */
  extractKeyPoints: async (text) => {
    const prompt = [
      { 
        role: 'system', 
        content: 'Extract 5-7 key points from the following policy text. Return as a JSON array of strings only.' 
      },
      { role: 'user', content: text.substring(0, 8000) }
    ];
    
    const response = await callOpenAI(prompt, { temperature: 0.3 });
    const cleaned = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  }
};

module.exports = summarizeService;
