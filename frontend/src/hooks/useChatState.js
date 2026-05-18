// frontend/src/hooks/useChatState.js
// Purpose: Core stateful hook managing chat conversations, streaming, and sidebar history for the ChatProvider

import { useState, useEffect, useCallback, useRef } from 'react';
import { getChatHistory, getChatById, deleteChat as apiDeleteChat, sendMessage as apiSendMessage } from '../services/chatService';
import useStream from './useStream';

const useChatState = () => {
  const [messages, setMessages] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [followUps, setFollowUps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const messagesEndRef = useRef(null);
  const { streamingText, isStreaming, startStream } = useStream();

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }, []);

  const loadChatHistory = useCallback(async () => {
    try {
      const history = await getChatHistory(1, 30);
      setChats(history || []);
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  }, []);

  useEffect(() => {
    loadChatHistory();
  }, [loadChatHistory]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, scrollToBottom]);

  const startNewChat = useCallback(() => {
    setMessages([]);
    setCurrentChatId(null);
    setFollowUps([]);
    setError(null);
  }, []);

  const loadChat = useCallback(async (chatId) => {
    if (!chatId) return;
    setIsLoading(true);
    setError(null);
    try {
      const chat = await getChatById(chatId);
      if (chat) {
        setMessages(chat.messages || []);
        setCurrentChatId(chat._id);
        setFollowUps([]);
      }
    } catch (err) {
      setError('Failed to load chat messages');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteChat = useCallback(async (chatId) => {
    try {
      const success = await apiDeleteChat(chatId);
      if (success) {
        setChats(prev => prev.filter(c => c._id !== chatId));
        if (currentChatId === chatId) {
          startNewChat();
        }
      }
    } catch (err) {
      setError('Failed to delete chat');
    }
  }, [currentChatId, startNewChat]);

  const sendMessage = useCallback((text) => {
    if (!text || !text.trim()) return;

    const userMsg = { role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setFollowUps([]);
    setError(null);

    let capturedChatId = currentChatId;
    let capturedFollowUps = [];

    startStream(
      { chatId: currentChatId, message: text, language: currentLanguage },
      {
        onMetadata: (meta) => {
          if (meta.chatId) capturedChatId = meta.chatId;
          if (meta.followUps) capturedFollowUps = meta.followUps;
        },
        onComplete: () => {
          setIsTyping(false);
          setMessages(prev => {
            // Replace temporary streaming text with finalized message
            return [...prev, { role: 'assistant', content: streamingText, timestamp: new Date() }];
          });
          if (capturedChatId && capturedChatId !== currentChatId) {
            setCurrentChatId(capturedChatId);
            loadChatHistory();
          }
          if (capturedFollowUps.length > 0) {
            setFollowUps(capturedFollowUps);
          }
        },
        onError: (err) => {
          setIsTyping(false);
          setError(err.message || 'Failed to generate AI response');
        }
      }
    );
  }, [currentChatId, currentLanguage, startStream, streamingText, loadChatHistory]);

  const sendMessageNonStream = useCallback(async (text) => {
    if (!text || !text.trim()) return;

    const userMsg = { role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setFollowUps([]);
    setError(null);

    try {
      const res = await apiSendMessage({ chatId: currentChatId, message: text, language: currentLanguage });
      if (res.data) {
        setMessages(prev => [...prev, { role: 'assistant', content: res.data.response, timestamp: new Date() }]);
        if (!currentChatId) {
          setCurrentChatId(res.data.chatId);
          loadChatHistory();
        }
        setFollowUps(res.data.followUps || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setIsTyping(false);
    }
  }, [currentChatId, currentLanguage, loadChatHistory]);

  const handleFollowUp = useCallback((question) => {
    sendMessage(question);
  }, [sendMessage]);

  const setLanguage = useCallback((langCode) => {
    setCurrentLanguage(langCode);
  }, []);

  return {
    messages,
    currentChatId,
    currentChat: { _id: currentChatId }, // Alias for Sidebar.js compatibility
    chats,
    isTyping,
    isStreaming,
    streamingText,
    followUps,
    isLoading,
    error,
    currentLanguage,
    language: currentLanguage, // Alias for ChatContext compatibility
    messagesEndRef,
    sendMessage,
    sendMessageNonStream,
    startNewChat,
    newChat: startNewChat, // Alias for Sidebar.js compatibility
    loadChat,
    loadChatHistory,
    loadChats: loadChatHistory, // Alias for ChatbotPage.js compatibility
    deleteChat,
    handleFollowUp,
    setLanguage,
    scrollToBottom
  };
};

export default useChatState;
