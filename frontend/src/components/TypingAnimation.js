import React from 'react';
import { HiSparkles } from 'react-icons/hi';

const TypingAnimation = () => {
  return (
    <div className="flex items-start gap-4 animate-in fade-in duration-300">
      <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
        <HiSparkles size={20} />
      </div>
      
      <div className="bg-white dark:bg-slate-700 px-5 py-4 rounded-3xl rounded-tl-none border border-slate-100 dark:border-slate-600 shadow-sm flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></div>
        <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]"></div>
        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
        <span className="ml-2 text-[10px] font-black text-primary uppercase tracking-widest">NyayaBot is thinking</span>
      </div>
    </div>
  );
};

export default TypingAnimation;
