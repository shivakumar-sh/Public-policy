// frontend/src/components/ChatMessage.js
// Purpose: Renders user and AI message bubbles with markdown, copy, speak, and feedback controls

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { HiOutlineSparkles, HiOutlineClipboardCopy, HiOutlineVolumeUp, HiOutlineThumbUp, HiOutlineThumbDown } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const ChatMessage = ({ role, content, timestamp, isStreaming, language, onSpeak, onFeedback }) => {
  const [feedbackGiven, setFeedbackGiven] = useState(null);
  const isAssistant = role === 'assistant';

  const formatTime = (time) => {
    if (!time) return '';
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleFeedbackClick = (positive) => {
    setFeedbackGiven(positive ? 'up' : 'down');
    if (onFeedback) onFeedback(positive);
    toast.success(positive ? 'Thanks for the feedback!' : 'We will improve this.');
  };

  if (!isAssistant) {
    return (
      <div className="flex justify-end my-3 animate-in fade-in duration-300">
        <div className="max-w-[75%]">
          <div className="bg-primary text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{String(content || '')}</p>
          </div>
          <p className="text-[10px] text-slate-400 text-right mt-1 font-medium">{formatTime(timestamp)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 my-3 animate-in fade-in duration-300">
      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0 shadow-inner">
        <HiOutlineSparkles size={18} />
      </div>
      <div className="max-w-[75%] flex-1">
        <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-2xl rounded-tl-sm px-5 py-4 relative group shadow-sm">
          {isStreaming && <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1 align-middle" />}
          <div className="prose prose-slate dark:prose-invert max-w-none prose-sm prose-p:leading-relaxed prose-headings:mb-3 prose-headings:mt-4 first:prose-headings:mt-0">
            <ReactMarkdown
              components={{
                h2: ({node, children, ...props}) => <h2 className="text-lg font-bold mt-3 mb-2 text-slate-900 dark:text-white" {...props}>{children}</h2>,
                h3: ({node, children, ...props}) => <h3 className="text-base font-semibold mt-2 mb-1 text-slate-800 dark:text-slate-200" {...props}>{children}</h3>,
                ul: ({node, ...props}) => <ul className="list-disc pl-4 my-2 space-y-1" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-4 my-2 space-y-1" {...props} />,
                li: ({node, ...props}) => <li className="text-sm" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold text-slate-900 dark:text-white" {...props} />,
                p: ({node, ...props}) => <p className="mb-2 text-sm leading-relaxed" {...props} />
              }}
            >
              {String(content || '')}
            </ReactMarkdown>
          </div>

          {!isStreaming && (
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
              <button onClick={() => copyToClipboard(content)} className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors" title="Copy">
                <HiOutlineClipboardCopy size={16} />
              </button>
              <button onClick={() => onSpeak && onSpeak(content)} className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors" title="Read aloud">
                <HiOutlineVolumeUp size={16} />
              </button>
            </div>
          )}
        </div>

        {!isStreaming && (
          <div className="flex items-center gap-3 mt-1.5 px-1">
            <p className="text-[10px] text-slate-400 font-medium">{formatTime(timestamp)}</p>
            <div className="flex items-center gap-1.5 ml-auto">
              <button onClick={() => handleFeedbackClick(true)} className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${feedbackGiven === 'up' ? 'text-success' : 'text-slate-400 hover:text-slate-600'}`} title="Helpful">
                <HiOutlineThumbUp size={14} />
              </button>
              <button onClick={() => handleFeedbackClick(false)} className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${feedbackGiven === 'down' ? 'text-danger' : 'text-slate-400 hover:text-slate-600'}`} title="Not helpful">
                <HiOutlineThumbDown size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
