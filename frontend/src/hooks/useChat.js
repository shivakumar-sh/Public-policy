import { useState, useCallback, useEffect } from 'react';
import chatService from '../services/chatService';
import { toast } from 'react-hot-toast';

/**
 * useChat Hook
 * Manages chat state, messaging, streaming, and history
 */
const useChat = (initialChatId = null) => {
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(initialChatId);
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * Load all chats for the sidebar
   */
  const loadChats = useCallback(async () => {
    try {
      const data = await chatService.getChatHistory();
      // data structure is { success: true, data: { chats: [], pagination: {} } }
      // but api.js might be unwrapping it differently. 
      // Based on chatService.js: api.get(...).then(res => res.data)
      // So data is { chats: [], pagination: {} }
      setChats(data.chats || []);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  }, []);

  // Initial load of history
  useEffect(() => {
    loadChats();
  }, [loadChats]);

  // Load specific chat if ID provided
  useEffect(() => {
    if (initialChatId) {
      loadChat(initialChatId);
    }
  }, [initialChatId]);

  /**
   * Load messages for a single chat
   */
  const loadChat = async (chatId) => {
    if (!chatId) return;
    setLoading(true);
    try {
      const history = await chatService.getChatMessages(chatId);
      setMessages(history);
      setCurrentChatId(chatId);
    } catch (error) {
      toast.error('Failed to load chat messages');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Send a message (streaming or standard)
   */
  const sendMessage = async (text, language = 'en', stream = true) => {
    if (!text.trim()) return;

    // Add user message to UI immediately
    const userMsg = { role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setFollowUps([]);

    if (stream) {
      setIsStreaming(true);
      let aiContent = "";
      
      // Add empty assistant message to be filled by stream
      setMessages(prev => [...prev, { role: 'assistant', content: '', timestamp: new Date() }]);

      await chatService.streamMessage(
        text,
        currentChatId,
        language,
        (chunk) => {
          setIsTyping(false);
          aiContent += chunk;
          setMessages(prev => {
            const last = prev[prev.length - 1];
            const updated = { ...last, content: aiContent };
            return [...prev.slice(0, -1), updated];
          });
        },
        () => {
          setIsStreaming(false);
          // Refresh history to show new chat title if it's the first message
          if (!currentChatId) {
            loadChats();
          }
        },
        (error) => {
          setIsStreaming(false);
          setIsTyping(false);
          toast.error(error.message || 'Error streaming response');
        }
      );
    } else {
      try {
        const result = await chatService.sendMessage(text, currentChatId, language);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: result.data.response, 
          timestamp: new Date() 
        }]);
        
        if (!currentChatId) {
          setCurrentChatId(result.data.chatId);
          loadChats();
        }
        
        setFollowUps(result.data.followUps || []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to send message');
      } finally {
        setIsTyping(false);
      }
    }
  };

  /**
   * Reset state for a new chat
   */
  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setFollowUps([]);
  };

  /**
   * Delete a chat and refresh list
   */
  const deleteChat = async (chatId) => {
    try {
      await chatService.deleteChat(chatId);
      setChats(prev => prev.filter(c => c._id !== chatId));
      if (currentChatId === chatId) {
        startNewChat();
      }
      toast.success('Chat deleted');
    } catch (error) {
      toast.error('Failed to delete chat');
    }
  };

  return {
    messages,
    chats,
    currentChatId,
    currentChat: chats.find(c => c._id === currentChatId),
    isTyping,
    isStreaming,
    followUps,
    loading,
    sendMessage,
    startNewChat,
    newChat: startNewChat,
    loadChat,
    loadChats,
    deleteChat,
    setMessages
  };
};

export default useChat;
