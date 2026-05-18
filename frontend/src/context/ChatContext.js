import React, { createContext } from 'react';
import useChatState from '../hooks/useChatState';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const chatState = useChatState();

  return (
    <ChatContext.Provider value={chatState}>
      {children}
    </ChatContext.Provider>
  );
};
