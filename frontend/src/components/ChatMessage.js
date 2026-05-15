import React from 'react';
import ReactMarkdown from 'react-markdown';
import { HiUser, HiSparkles, HiDuplicate, HiThumbUp, HiThumbDown, HiVolumeUp } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const ChatMessage = ({ role, content, timestamp }) => {
  const isAssistant = role === 'assistant';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast.success('Message copied!');
  };

  const handleSpeech = () => {
    const utterance = new SpeechSynthesisUtterance(content);
    // Auto-detect language or use default
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`flex items-start gap-4 ${isAssistant ? 'justify-start' : 'justify-end'} group`}>
      {isAssistant && (
        <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20 animate-in fade-in slide-in-from-left-2">
          <HiSparkles size={20} />
        </div>
      )}
      
      <div className={`max-w-[85%] space-y-2 ${isAssistant ? '' : 'flex flex-col items-end'}`}>
        <div 
          className={`px-6 py-4 rounded-3xl shadow-sm relative transition-all ${
            isAssistant 
            ? 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-600 rounded-tl-none' 
            : 'bg-primary text-white shadow-primary/20 rounded-tr-none font-medium'
          }`}
        >
          <div className="prose prose-slate dark:prose-invert max-w-none prose-sm prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-headings:mb-3 prose-headings:mt-4 first:prose-headings:mt-0">
            {isAssistant ? (
              <ReactMarkdown>{String(content || '')}</ReactMarkdown>
            ) : (
              <p className="whitespace-pre-wrap">{String(content || '')}</p>
            )}
          </div>
          
          <span className={`text-[10px] mt-2 block opacity-40 font-bold uppercase tracking-widest ${isAssistant ? 'text-slate-500' : 'text-white'}`}>
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {isAssistant && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pl-2">
            <ActionButton icon={<HiDuplicate size={14} />} onClick={copyToClipboard} title="Copy" />
            <ActionButton icon={<HiVolumeUp size={14} />} onClick={handleSpeech} title="Listen" />
            <div className="w-px h-3 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <ActionButton icon={<HiThumbUp size={14} />} title="Helpful" />
            <ActionButton icon={<HiThumbDown size={14} />} title="Not helpful" />
          </div>
        )}
      </div>

      {!isAssistant && (
        <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-700 text-slate-400 flex items-center justify-center flex-shrink-0 border border-slate-100 dark:border-slate-600 shadow-sm animate-in fade-in slide-in-from-right-2">
          <HiUser size={20} />
        </div>
      )}
    </div>
  );
};

const ActionButton = ({ icon, onClick, title }) => (
  <button 
    onClick={onClick}
    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary transition-all"
    title={title}
  >
    {icon}
  </button>
);

export default ChatMessage;
