import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';
import useChat from '../hooks/useChat';

const ChatbotPage = () => {
  const { loadChats } = useChat();

  useEffect(() => {
    loadChats();
  }, []);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      <div className="flex-grow flex flex-col p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">AI Policy Explainer</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Simplifying government regulations in real-time.</p>
          </div>
          <div className="md:hidden">
            {/* Simple mobile chat switcher could go here */}
          </div>
        </div>
        
        <div className="flex-grow min-h-0">
          <ChatBox />
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
