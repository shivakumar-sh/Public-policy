const Chat = require('../models/Chat');
const Policy = require('../models/Policy');
const { callOpenAI, parseJSONResponse } = require('../utils/openaiHelper');
const { buildRecommendationPrompt } = require('../utils/promptBuilder');

/**
 * Recommendation Service
 * Suggests policies based on user history and profile
 */
const recommendService = {
  /**
   * Get personalized recommendations for a user
   */
  getRecommendations: async (userId) => {
    // 1. Get recent chat context
    const recentChats = await Chat.find({ user: userId })
      .sort({ updatedAt: -1 })
      .limit(5);
    
    const messages = [];
    recentChats.forEach(chat => {
      messages.push(...chat.messages.slice(-4).map(m => m.content));
    });

    // 2. Extract topics if history exists
    let topics = [];
    if (messages.length > 0) {
      topics = await recommendService.extractTopicsFromChats(messages);
    }

    // 3. Get popular policies as base or fallback
    const popular = await Policy.find({ isActive: true })
      .sort({ views: -1 })
      .limit(10);

    if (topics.length === 0) {
      return popular.slice(0, 3);
    }

    // 4. Generate AI recommendations
    const userProfile = { id: userId }; // Extendable with age, location etc
    const prompt = buildRecommendationPrompt(userProfile, topics);
    const response = await callOpenAI(prompt, { temperature: 0.5 });

    return response;
  },

  /**
   * Extract main policy topics from chat history
   */
  extractTopicsFromChats: async (messages) => {
    try {
      const prompt = [
        { 
          role: 'system', 
          content: 'Extract 3-5 main policy topics from these conversations. Return as JSON array of strings only.' 
        },
        { role: 'user', content: messages.join('\n').substring(0, 5000) }
      ];
      const response = await callOpenAI(prompt, { max_tokens: 100 });
      return parseJSONResponse(response) || [];
    } catch (e) {
      return [];
    }
  },

  /**
   * Get most viewed policies
   */
  getPopularPolicies: async () => {
    return await Policy.find({ isActive: true })
      .sort({ views: -1 })
      .limit(5);
  }
};

module.exports = recommendService;
