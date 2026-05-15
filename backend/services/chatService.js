const Chat = require('../models/Chat');
const { callOpenAI } = require('../utils/openaiHelper');
const { buildChatPrompt, buildFollowUpPrompt } = require('../utils/promptBuilder');
const { trimConversationHistory, countTokens } = require('../utils/tokenCounter');

/**
 * Chat Service
 * Handles conversation logic and persistence
 */
const chatService = {
  /**
   * Process a new chat message
   */
  processChat: async (userId, chatId, userMessage, language = 'en') => {
    let chat;
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, user: userId });
    }

    if (!chat) {
      chat = await Chat.create({
        user: userId,
        title: userMessage.substring(0, 30) + '...',
        language,
        messages: []
      });
      // Generate a better title in the background
      chatService.generateChatTitle(userMessage).then(title => {
        chat.title = title;
        chat.save();
      });
    }

    // Format history for OpenAI
    const history = chat.messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    // Build and trim prompt
    let messages = buildChatPrompt(userMessage, language, history);
    messages = trimConversationHistory(messages);

    // Call AI
    const response = await callOpenAI(messages);

    // Save to DB
    chat.messages.push({ role: 'user', content: userMessage });
    chat.messages.push({ role: 'assistant', content: response });
    await chat.save();

    // Suggest follow-ups
    const followUps = await chatService.getFollowUpSuggestions(chat.messages);

    return {
      response,
      chatId: chat._id,
      followUps,
      tokensUsed: countTokens(response) + countTokens(userMessage)
    };
  },

  /**
   * Generate a natural title for the chat
   */
  generateChatTitle: async (message) => {
    try {
      const prompt = [{ 
        role: 'user', 
        content: `Generate a short 5-word title for a chat that starts with: "${message}". Return only the title, nothing else.` 
      }];
      const title = await callOpenAI(prompt, { max_tokens: 10 });
      return title.replace(/"/g, '').trim();
    } catch (e) {
      return message.substring(0, 30) + '...';
    }
  },

  /**
   * Get suggested follow-up questions
   */
  getFollowUpSuggestions: async (messages) => {
    try {
      const history = messages.slice(-4).map(m => ({ role: m.role, content: m.content }));
      const prompt = buildFollowUpPrompt(history);
      const response = await callOpenAI(prompt, { temperature: 0.5, max_tokens: 100 });
      
      // Clean and parse JSON
      const cleaned = response.replace(/```json|```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      return ["How do I apply?", "Am I eligible?", "What documents are needed?"];
    }
  },

  /**
   * Get paginated chat history for a user
   */
  getChatHistory: async (userId, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const chats = await Chat.find({ user: userId, isArchived: false })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('title language updatedAt');
    
    const total = await Chat.countDocuments({ user: userId, isArchived: false });
    
    return {
      chats,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    };
  },

  /**
   * Get all messages for a specific chat
   */
  getChatMessages: async (chatId, userId) => {
    const chat = await Chat.findOne({ _id: chatId, user: userId });
    if (!chat) throw new Error('Chat not found');
    return chat.messages;
  },

  /**
   * Delete a chat
   */
  deleteChat: async (chatId, userId) => {
    const chat = await Chat.findOneAndDelete({ _id: chatId, user: userId });
    if (!chat) throw new Error('Chat not found or unauthorized');
    return { message: 'Chat deleted successfully' };
  }
};

module.exports = chatService;
