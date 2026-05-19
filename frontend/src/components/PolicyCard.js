import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { HiOutlineArrowRight, HiBookmark, HiEye } from 'react-icons/hi';
import { formatDate } from '../utils/helpers';
import useBookmarks from '../hooks/useBookmarks';
import useTranslation from '../hooks/useTranslation';

const categoryColors = {
  Agriculture: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50',
  Health: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50',
  Finance: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50',
  Housing: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50',
  Employment: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-900/50',
  Education: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/50',
  Environment: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/30 dark:text-teal-400 dark:border-teal-900/50',
  Technology: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/30 dark:text-cyan-400 dark:border-cyan-900/50',
  Other: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950/30 dark:text-slate-400 dark:border-slate-900/50'
};

const PolicyCard = ({ policy }) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { t } = useTranslation();
  const bookmarked = isBookmarked(policy._id);

  const badgeClass = categoryColors[policy.category] || categoryColors.Other;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-300" />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <span className={`px-3 py-1 border text-[10px] font-black rounded-full uppercase tracking-wider ${badgeClass}`}>
          {policy.category}
        </span>
        <button 
          onClick={() => toggleBookmark(policy._id)} 
          className={`p-2 rounded-xl transition-all shadow-sm active:scale-95 ${bookmarked ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700'}`}
          title={bookmarked ? t('bookmarked') : t('bookmark')}
        >
          <HiBookmark size={18} />
        </button>
      </div>
      
      <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2 line-clamp-2 min-h-[3rem] relative z-10 leading-snug group-hover:text-primary transition-colors">
        {policy.title}
      </h3>
      
      <p className="text-slate-500 dark:text-slate-400 text-xs mb-6 flex-grow line-clamp-3 leading-relaxed font-medium">
        {policy.description}
      </p>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50 dark:border-slate-700/50 relative z-10">
        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span className="flex items-center gap-1"><HiEye size={12} /> {policy.views || 0}</span>
          <span>{formatDate(policy.dateEnacted)}</span>
        </div>
        <RouterLink 
          to={`/policies/${policy._id}`}
          className="flex items-center gap-1 text-primary text-xs font-black group-hover:gap-2 transition-all"
        >
          {t('readMore')} <HiOutlineArrowRight size={14} />
        </RouterLink>
      </div>
    </div>
  );
};

export default PolicyCard;
