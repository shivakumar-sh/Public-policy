// backend/utils/tokenCounter.js
// Purpose: Estimates token counts and manages conversation context limits

/**
 * Estimate tokens based on character length
 * 1 token ≈ 4 chars in English, ≈ 2-3 chars in Indic scripts
 */
const estimateTokens = (text) => {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
};

/**
 * Estimate total tokens for an array of messages
 */
const estimateMessageTokens = (messages) => {
  if (!Array.isArray(messages)) return 0;
  return messages.reduce((total, msg) => {
    const contentTokens = estimateTokens(msg.content || '');
    return total + contentTokens + 4; // 4 tokens overhead per message
  }, 0);
};

/**
 * Check if messages are within the specified token limit
 */
const isWithinTokenLimit = (messages, maxTokens = 3500) => {
  return estimateMessageTokens(messages) <= maxTokens;
};

/**
 * Truncate text to fit within a token budget
 */
const truncateText = (text, maxTokens = 2000) => {
  if (!text) return '';
  const currentTokens = estimateTokens(text);
  if (currentTokens <= maxTokens) return text;
  
  const maxChars = maxTokens * 4;
  const truncated = text.slice(0, maxChars);
  return truncated + "\n\n[Note: Document truncated due to length]";
};

/**
 * Trim conversation history to maintain token budget while preserving system prompt
 */
const trimConversationHistory = (messages, maxTokens = 3000) => {
  if (!Array.isArray(messages) || messages.length <= 1) return messages;
  
  const systemPrompt = messages[0];
  let trimmed = messages.slice(1);
  
  while (trimmed.length > 4 && estimateMessageTokens([systemPrompt, ...trimmed]) > maxTokens) {
    // Remove oldest user + assistant message pair
    trimmed = trimmed.slice(2);
  }
  
  return [systemPrompt, ...trimmed];
};

/**
 * Get detailed token usage statistics for a message array
 */
const getTokenStats = (messages) => {
  const estimatedTokens = estimateMessageTokens(messages);
  const maxLimit = 4096;
  return {
    totalMessages: Array.isArray(messages) ? messages.length : 0,
    estimatedTokens,
    isWithinLimit: estimatedTokens <= maxLimit,
    remainingTokens: Math.max(0, maxLimit - estimatedTokens)
  };
};

module.exports = {
  estimateTokens,
  estimateMessageTokens,
  isWithinTokenLimit,
  truncateText,
  trimConversationHistory,
  getTokenStats
};
