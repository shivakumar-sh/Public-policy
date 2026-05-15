/**
 * Token Counter Utility
 * Simple estimation of token counts for context management
 */

const countTokens = (text) => {
  if (!text) return 0;
  // Standard approximation: 1 token ~= 4 characters in English
  return Math.ceil(text.length / 4);
};

const truncateToTokenLimit = (text, maxTokens) => {
  const currentTokens = countTokens(text);
  if (currentTokens <= maxTokens) return text;
  
  const maxLength = maxTokens * 4;
  return text.substring(0, maxLength) + "\n\n[Content truncated due to length limits]";
};

const getConversationTokens = (messages) => {
  return messages.reduce((total, msg) => total + countTokens(msg.content), 0);
};

const isWithinLimit = (messages, maxTokens = 3500) => {
  return getConversationTokens(messages) <= maxTokens;
};

const trimConversationHistory = (messages, maxTokens = 3000) => {
  if (getConversationTokens(messages) <= maxTokens) return messages;

  const systemMessage = messages.find(m => m.role === 'system');
  const otherMessages = messages.filter(m => m.role !== 'system');
  
  let trimmed = [...otherMessages];
  
  // Keep removing oldest pairs until within limit or only 4 messages left
  while (getConversationTokens([systemMessage, ...trimmed]) > maxTokens && trimmed.length > 4) {
    trimmed.shift(); // Remove oldest
  }
  
  return systemMessage ? [systemMessage, ...trimmed] : trimmed;
};

module.exports = {
  countTokens,
  truncateToTokenLimit,
  getConversationTokens,
  isWithinLimit,
  trimConversationHistory
};
