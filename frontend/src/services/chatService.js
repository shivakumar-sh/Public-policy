// frontend/src/services/chatService.js
// Purpose: Axios wrapper for communicating with backend AI endpoints

import api from './api';

export const sendMessage = async ({ chatId, message, language }) => {
  const response = await api.post('/chat/send', { chatId, message, language });
  return response.data;
};

export const streamMessage = async ({ chatId, message, language }, callbacks) => {
  const { onChunk, onMetadata, onDone, onError } = callbacks;
  let token = localStorage.getItem('token');
  if (!token) {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try { token = JSON.parse(userStr).token; } catch (e) {}
    }
  }
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  try {
    const response = await fetch(`${baseUrl}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ chatId, message, language })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'Stream connection failed');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // keep incomplete last line in buffer

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') {
            if (onDone) onDone();
            continue;
          }
          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.type === 'chunk' && onChunk) onChunk(parsed.content);
            else if (parsed.type === 'metadata' && onMetadata) onMetadata(parsed);
            else if (parsed.type === 'done' && onDone) onDone();
            else if (parsed.type === 'error' && onError) onError(new Error(parsed.message));
          } catch (e) {
            // ignore malformed JSON chunk
          }
        }
      }
    }
  } catch (error) {
    if (onError) onError(error);
  }
};

export const getChatHistory = async (page = 1, limit = 20) => {
  const response = await api.get(`/chat/history?page=${page}&limit=${limit}`);
  return response.data?.data?.items || [];
};

export const getChatById = async (chatId) => {
  const response = await api.get(`/chat/${chatId}`);
  return response.data?.data || null;
};

export const deleteChat = async (chatId) => {
  const response = await api.delete(`/chat/${chatId}`);
  return response.data?.success || false;
};

export const translateMessage = async (text, language) => {
  const response = await api.post('/chat/translate', { text, language });
  return response.data?.data?.translated || text;
};

export const simplifyPolicy = async (policyId, language) => {
  const response = await api.post(`/chat/policies/${policyId}/simplify`, { language });
  return response.data?.data?.simplified || '';
};

export const comparePolicies = async (policyId1, policyId2, language) => {
  const response = await api.post('/chat/policies/compare', { policyId1, policyId2, language });
  return response.data?.data?.comparison || '';
};

export const generateFAQs = async (policyId, language) => {
  const response = await api.post(`/chat/policies/${policyId}/faq`, { language });
  return response.data?.data?.faqs || [];
};

export const summarizeDocument = async (documentId, language) => {
  const response = await api.post(`/chat/documents/${documentId}/summarize`, { language });
  return response.data?.data?.summary || '';
};

export const getRecommendations = async () => {
  const response = await api.get('/chat/recommendations');
  return response.data?.data?.recommendations || [];
};

const chatService = {
  sendMessage,
  send: sendMessage,
  streamMessage,
  getChatHistory,
  getHistory: getChatHistory,
  getChatById,
  deleteChat,
  translateMessage,
  simplifyPolicy,
  comparePolicies,
  generateFAQs,
  summarizeDocument,
  getRecommendations
};

export default chatService;
