import React from 'react';
import { HiOutlineLightBulb } from 'react-icons/hi';

const FollowUpChips = ({ suggestions, onSelect }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
        <HiOutlineLightBulb size={16} />
        <span className="text-[10px] font-black uppercase tracking-widest">Suggested Questions</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelect(suggestion)}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 hover:bg-primary/5 hover:text-primary border border-slate-100 dark:border-slate-700 rounded-full text-xs font-bold text-slate-600 dark:text-slate-400 transition-all shadow-sm active:scale-95"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FollowUpChips;
