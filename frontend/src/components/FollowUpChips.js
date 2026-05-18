// frontend/src/components/FollowUpChips.js
// Purpose: Renders clickable follow-up suggestion chips to drive citizen engagement

import React from 'react';
import { HiOutlineLightBulb } from 'react-icons/hi';

const FollowUpChips = ({ questions, onSelect }) => {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500 my-4">
      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
        <HiOutlineLightBulb size={16} />
        <span className="text-[10px] font-black uppercase tracking-widest">Suggested Questions</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelect(question)}
            className="px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-primary/5 hover:text-primary 
                       border border-slate-200 dark:border-slate-700 rounded-full text-xs font-bold 
                       text-slate-600 dark:text-slate-300 transition-all shadow-sm active:scale-95 text-left"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FollowUpChips;
