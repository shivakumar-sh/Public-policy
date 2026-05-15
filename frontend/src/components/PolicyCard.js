import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight, HiBookmark, HiEye } from 'react-icons/hi';
import { formatDate, truncateText } from '../utils/helpers';

const PolicyCard = ({ policy }) => {
  return (
    <div className="card group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full uppercase tracking-wider">
          {policy.category}
        </span>
        <button className="text-slate-300 hover:text-accent transition-colors">
          <HiBookmark size={20} />
        </button>
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem]">
        {policy.title}
      </h3>
      
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 flex-grow line-clamp-3">
        {policy.description}
      </p>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50 dark:border-slate-700/50">
        <div className="flex items-center gap-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">
          <span className="flex items-center gap-1"><HiEye /> {policy.views || 0}</span>
          <span>{formatDate(policy.dateEnacted)}</span>
        </div>
        <Link 
          to={`/policies/${policy._id}`}
          className="flex items-center gap-1 text-primary text-sm font-bold group-hover:gap-2 transition-all"
        >
          Read More <HiOutlineArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default PolicyCard;
