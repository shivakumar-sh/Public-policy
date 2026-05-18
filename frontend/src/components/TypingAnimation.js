// frontend/src/components/TypingAnimation.js
// Purpose: Bouncing dots animation simulating AI thinking/typing state

import React from 'react';
import { HiOutlineSparkles } from 'react-icons/hi';

const TypingAnimation = () => {
  return (
    <div className="flex gap-3 my-2 animate-in fade-in duration-300" aria-label="AI is typing">
      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0 shadow-inner">
        <HiOutlineSparkles size={18} />
      </div>
      <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 border border-slate-200 dark:border-slate-700/50 shadow-sm">
        <div className="flex gap-1.5 items-center h-5">
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

export default TypingAnimation;
