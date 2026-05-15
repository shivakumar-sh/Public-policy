import React from 'react';
import { HiSearch } from 'react-icons/hi';

const SearchBar = ({ value, onChange, placeholder = "Search policies..." }) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
        <HiSearch size={22} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white"
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchBar;
