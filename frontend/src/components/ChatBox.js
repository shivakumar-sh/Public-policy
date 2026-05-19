// frontend/src/components/ChatBox.js
// Purpose: Master chat interface combining message list, input bar, voice controls, and PDF uploader

import React, { useState } from 'react';
import useChat from '../hooks/useChat';
import useVoice from '../hooks/useVoice';
import ChatMessage from './ChatMessage';
import TypingAnimation from './TypingAnimation';
import VoiceInput from './VoiceInput';
import FollowUpChips from './FollowUpChips';
import LanguageSelector from './LanguageSelector';
import PDFUploader from './PDFUploader';
import useTranslation from '../hooks/useTranslation';
import { HiOutlinePaperClip, HiOutlinePaperAirplane, HiOutlineSparkles, HiOutlinePlus } from 'react-icons/hi';

const ChatBox = () => {
  const [inputText, setInputText] = useState('');
  const [showPDFUploader, setShowPDFUploader] = useState(false);
  const { t } = useTranslation();

  const {
    messages,
    isTyping,
    isStreaming,
    streamingText,
    followUps,
    currentLanguage,
    messagesEndRef,
    sendMessage,
    startNewChat,
    handleFollowUp,
    setLanguage
  } = useChat();

  const voice = useVoice();

  const handleSend = () => {
    if (!inputText || !inputText.trim() || isTyping) return;
    sendMessage(inputText);
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDocumentSummarized = (summaryText, documentId) => {
    setShowPDFUploader(false);
    // Add summary to chat as user requesting summary
    sendMessage(`Summarize uploaded document ID: ${documentId}`);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-colors">
      
      {/* TOP BAR */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold shadow-inner">
            <HiOutlineSparkles size={20} />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-800 dark:text-slate-100">NyayaBot AI Assistant</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Multilingual Civic AI</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <LanguageSelector currentLanguage={currentLanguage} onChange={setLanguage} compact={false} />
          <button onClick={startNewChat} className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95">
            <HiOutlinePlus size={16} /> New Chat
          </button>
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto animate-in fade-in duration-500">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 shadow-inner">
              <HiOutlineSparkles size={36} />
            </div>
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-2">Ask NyayaBot About Any Government Policy</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6 font-medium">
              I simplify complex public schemes, eligibility criteria, and application steps in English, Hindi, Kannada, and Tamil.
            </p>
            <div className="flex flex-col gap-2 w-full">
              <button onClick={() => sendMessage('What is PM Kisan Samman Nidhi?')} className="p-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary/40 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:shadow transition-all text-left flex items-center justify-between group">
                <span>What is PM Kisan Samman Nidhi?</span>
                <HiOutlinePaperAirplane className="text-slate-400 group-hover:text-primary transition-colors rotate-90" size={14} />
              </button>
              <button onClick={() => sendMessage('Explain Ayushman Bharat health insurance scheme')} className="p-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary/40 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:shadow transition-all text-left flex items-center justify-between group">
                <span>Explain Ayushman Bharat health insurance scheme</span>
                <HiOutlinePaperAirplane className="text-slate-400 group-hover:text-primary transition-colors rotate-90" size={14} />
              </button>
              <button onClick={() => sendMessage('How to apply for MGNREGA job card?')} className="p-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary/40 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:shadow transition-all text-left flex items-center justify-between group">
                <span>How to apply for MGNREGA job card?</span>
                <HiOutlinePaperAirplane className="text-slate-400 group-hover:text-primary transition-colors rotate-90" size={14} />
              </button>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            role={message.role}
            content={message.content}
            timestamp={message.timestamp}
            isStreaming={false}
            language={currentLanguage}
            onSpeak={(text) => voice.speak(text, currentLanguage)}
          />
        ))}

        {isStreaming && (
          <ChatMessage
            role="assistant"
            content={streamingText}
            timestamp={new Date()}
            isStreaming={true}
            language={currentLanguage}
          />
        )}

        {isTyping && !isStreaming && <TypingAnimation />}

        {!isStreaming && followUps.length > 0 && (
          <FollowUpChips questions={followUps} onSelect={handleFollowUp} />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* PDF UPLOADER TRAY */}
      {showPDFUploader && (
        <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-800/30 animate-in slide-in-from-bottom-2 duration-300">
          <PDFUploader onSummarized={handleDocumentSummarized} onError={() => setShowPDFUploader(false)} />
        </div>
      )}

      {/* INPUT BAR */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900">
        <div className="flex items-end gap-2.5 max-w-5xl mx-auto">
          <button
            onClick={() => setShowPDFUploader(!showPDFUploader)}
            title="Upload Policy PDF"
            className={`p-3.5 rounded-xl border transition-all flex items-center justify-center ${showPDFUploader ? 'bg-primary/10 border-primary text-primary shadow-inner' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
          >
            <HiOutlinePaperClip size={20} />
          </button>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('chatPlaceholder')}
            rows={1}
            maxLength={1000}
            className="flex-1 resize-none border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-900 transition-all font-medium placeholder:text-slate-400"
          />

          <VoiceInput language={currentLanguage} onResult={(text) => setInputText(prev => prev + ' ' + text)} disabled={isTyping} />

          <button
            onClick={handleSend}
            disabled={!inputText || !inputText.trim() || isTyping}
            title="Send Message"
            className="p-3.5 rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-40 disabled:hover:bg-primary transition-all shadow-md active:scale-95 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
          >
            <HiOutlinePaperAirplane className="rotate-90" size={20} />
          </button>
        </div>
        <div className="flex justify-between items-center mt-2 px-1 max-w-5xl mx-auto">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">🔒 Citizen Privacy Protected</p>
          <p className="text-[10px] text-slate-400 font-medium">{inputText.length}/1000 chars</p>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
