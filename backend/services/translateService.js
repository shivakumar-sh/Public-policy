const { callOpenAI } = require('../utils/openaiHelper');
const { buildTranslationPrompt } = require('../utils/promptBuilder');
const Chat = require('../models/Chat');

/**
 * Translation Service
 * Handles multi-language support for policy content
 */
const translateService = {
  /**
   * Translate arbitrary text to target language
   */
  translateText: async (text, targetLanguage) => {
    if (targetLanguage === 'en') return text;
    
    const messages = buildTranslationPrompt(text, targetLanguage);
    return await callOpenAI(messages, { temperature: 0.3 });
  },

  /**
   * Translate the last AI message in a chat
   */
  translateChat: async (chatId, targetLanguage, userId) => {
    const chat = await Chat.findOne({ _id: chatId, user: userId });
    if (!chat) throw new Error('Chat not found');

    const lastMessage = chat.messages.filter(m => m.role === 'assistant').pop();
    if (!lastMessage) throw new Error('No assistant message to translate');

    return await translateService.translateText(lastMessage.content, targetLanguage);
  },

  /**
   * List supported languages
   */
  getSupportedLanguages: () => {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
      { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
      { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' }
    ];
  }
};

module.exports = translateService;
