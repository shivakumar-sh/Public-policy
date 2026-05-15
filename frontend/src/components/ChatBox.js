import React, { useState, useEffect, useRef } from 'react';
import { HiPaperAirplane, HiX, HiPlus, HiChatAlt2, HiTranslate } from 'react-icons/hi';
import ChatMessage from './ChatMessage';
import TypingAnimation from './TypingAnimation';
import VoiceInput from './VoiceInput';
import FollowUpChips from './FollowUpChips';
import useChat from '../hooks/useChat';
import { LANGUAGES } from '../utils/constants';

const ChatBox = ({ initialChatId = null }) => {
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState('en');
  const messagesEndRef = useRef(null);
  
  const { 
    messages, 
    isTyping, 
    isStreaming, 
    followUps, 
    sendMessage, 
    startNewChat,
    loading 
  } = useChat(initialChatId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping || isStreaming) return;
    
    const text = inputText;
    setInputText('');
    await sendMessage(text, language);
  };

  const handleFollowUp = (question) => {
    sendMessage(question, language);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 transition-all">
      {/* Chat Header */}
      <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
            <HiChatAlt2 size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">NyayaBot AI</h3>
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Online & Ready
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative group">
            <HiTranslate className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary transition-colors" size={18} />
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 appearance-none cursor-pointer hover:border-primary transition-all focus:ring-2 focus:ring-primary/20 outline-none"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={startNewChat}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-400 hover:text-rose-500 transition-all"
            title="Start New Chat"
          >
            <HiPlus size={20} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
        {messages.length === 0 && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center text-primary mb-6 animate-bounce-slow">
              <HiChatAlt2 size={40} />
            </div>
            <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">Namaste! I am NyayaBot</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Ask me anything about Indian government policies, schemes, or your legal rights. I explain things in very simple words.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-3 w-full">
              <button onClick={() => setInputText("What is PM Kisan Yojana?")} className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 hover:bg-primary/5 hover:text-primary border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-400 transition-all text-left flex items-center justify-between group">
                "What is PM Kisan Yojana?"
                <HiPaperAirplane className="opacity-0 group-hover:opacity-100 -rotate-45 transition-all" />
              </button>
              <button onClick={() => setInputText("Am I eligible for Ayushman Bharat?")} className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 hover:bg-primary/5 hover:text-primary border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-400 transition-all text-left flex items-center justify-between group">
                "Am I eligible for Ayushman Bharat?"
                <HiPaperAirplane className="opacity-0 group-hover:opacity-100 -rotate-45 transition-all" />
              </button>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <ChatMessage key={idx} {...msg} />
        ))}
        
        {isTyping && <TypingAnimation />}
        
        {!isStreaming && followUps.length > 0 && (
          <FollowUpChips suggestions={followUps} onSelect={handleFollowUp} />
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
        <form onSubmit={handleSend} className="relative flex items-center gap-3">
          <div className="relative flex-1 group">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask NyayaBot about any policy..."
              className="w-full pl-6 pr-14 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-700 dark:text-white placeholder:text-slate-400 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
              disabled={isStreaming}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <VoiceInput onResult={(text) => setInputText(text)} language={language} />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!inputText.trim() || isStreaming}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all ${!inputText.trim() || isStreaming ? 'bg-slate-200 dark:bg-slate-700 cursor-not-allowed' : 'bg-primary hover:scale-105 active:scale-95 shadow-primary/30'}`}
          >
            <HiPaperAirplane size={24} className="rotate-45" />
          </button>
        </form>
        <p className="mt-3 text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
          NyayaBot can make mistakes. Please verify important info on official websites.
        </p>
      </div>
    </div>
  );
};

export default ChatBox;
