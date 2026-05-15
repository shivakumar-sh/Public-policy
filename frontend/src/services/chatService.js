import api from './api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const chatService = {
  /**
   * Send a message and get full response
   */
  sendMessage: (message, chatId, language = 'en') => 
    api.post('/chat/send', { message, chatId, language }).then(res => res.data),

  /**
   * Stream message response using Fetch/ReadableStream
   */
  streamMessage: async (message, chatId, language, onChunk, onDone, onError) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;

      const response = await fetch(`${API_URL}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message, chatId, language })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onDone();
              return;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                onChunk(parsed.content);
              }
              if (parsed.error) {
                onError(new Error(parsed.error));
              }
            } catch (e) {}
          }
        }
      }
      onDone();
    } catch (error) {
      console.error('Streaming Error:', error);
      onError(error);
    }
  },

  /**
   * Get paginated chat history
   */
  getChatHistory: (page = 1, limit = 20) => 
    api.get(`/chat/history?page=${page}&limit=${limit}`).then(res => res.data),

  /**
   * Get messages for a specific chat
   */
  getChatMessages: (chatId) => 
    api.get(`/chat/${chatId}`).then(res => res.data),

  /**
   * Delete a chat
   */
  deleteChat: (chatId) => 
    api.delete(`/chat/${chatId}`).then(res => res.data),

  /**
   * Policy specific AI actions
   */
  simplifyPolicy: (policyId, language) => 
    api.post(`/policies/${policyId}/simplify`, { language }).then(res => res.data),
    
  comparePolicies: (policyId1, policyId2, language) => 
    api.post('/policies/compare', { policyId1, policyId2, language }).then(res => res.data),
    
  generateFAQs: (policyId, language) => 
    api.post(`/policies/${policyId}/faq`, { language }).then(res => res.data),
    
  summarizeDocument: (documentId, language) => 
    api.post(`/upload/${documentId}/summarize`, { language }).then(res => res.data),
    
  getRecommendations: () => 
    api.get('/users/recommendations').then(res => res.data),
};

export default chatService;
