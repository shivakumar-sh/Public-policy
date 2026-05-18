// backend/utils/contextManager.js
// Purpose: Manages conversation and document context injection for AI prompts

const buildContextFromHistory = (chatMessages, maxMessages = 10) => {
  if (!Array.isArray(chatMessages)) return [];
  const recent = chatMessages.slice(-maxMessages);
  return recent.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
};

const injectDocumentContext = (messages, documentText, documentName) => {
  if (!Array.isArray(messages) || messages.length === 0) return messages;
  const clone = [...messages];
  const systemMsg = clone[0];

  const first800Words = (documentText || '').split(/\s+/).slice(0, 800).join(' ');
  const injection = `\n\nCONTEXT: The user has uploaded a document called '${documentName}'. Here is its content for reference:\n\n---\n${first800Words}\n---\n\nAnswer any questions about this document based on the content above.`;

  clone[0] = { ...systemMsg, content: systemMsg.content + injection };
  return clone;
};

const addUserContext = (messages, userInfo) => {
  if (!Array.isArray(messages) || messages.length === 0) return messages;
  const clone = [...messages];
  const systemMsg = clone[0];

  const contextStr = `\n\nUSER CONTEXT:\nLanguage preference: ${userInfo?.language || 'en'}\nPrevious topics discussed: ${userInfo?.previousTopics || 'None'}`;
  clone[0] = { ...systemMsg, content: systemMsg.content + contextStr };
  return clone;
};

const createFreshContext = (systemPrompt) => {
  return [{ role: 'system', content: systemPrompt }];
};

const mergeContexts = (baseMessages, additionalContext) => {
  if (!Array.isArray(baseMessages) || baseMessages.length === 0) return baseMessages;
  const clone = [...baseMessages];
  const systemMsg = clone[0];

  clone[0] = { ...systemMsg, content: systemMsg.content + '\n\n' + additionalContext };
  return clone;
};

module.exports = {
  buildContextFromHistory,
  injectDocumentContext,
  addUserContext,
  createFreshContext,
  mergeContexts
};
