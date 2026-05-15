import React, { createContext, useState, useEffect } from 'react';
import chatService from '../services/chatService';
import { toast } from 'react-hot-toast';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState('en');

  const loadChats = async () => {
    try {
      const data = await chatService.getHistory();
      setChats(data);
    } catch (error) {
      console.error('Failed to load chats', error);
    }
  };

  const loadChat = async (id) => {
    try {
      const data = await chatService.getChatById(id);
      setCurrentChat(data);
      setMessages(data.messages);
    } catch (error) {
      toast.error('Failed to load chat');
    }
  };

  const sendMessage = async (message) => {
    setIsTyping(true);
    try {
      const data = await chatService.send({
        message,
        chatId: currentChat?._id,
        language
      });
      setCurrentChat(data);
      setMessages(data.messages);
      loadChats(); // Refresh history
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsTyping(false);
    }
  };

  const deleteChat = async (id) => {
    try {
      await chatService.deleteChat(id);
      setChats(chats.filter(c => c._id !== id));
      if (currentChat?._id === id) {
        setCurrentChat(null);
        setMessages([]);
      }
      toast.success('Chat deleted');
    } catch (error) {
      toast.error('Failed to delete chat');
    }
  };

  const newChat = () => {
    setCurrentChat(null);
    setMessages([]);
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        messages,
        isTyping,
        language,
        setLanguage,
        loadChats,
        loadChat,
        sendMessage,
        deleteChat,
        newChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
