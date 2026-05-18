// frontend/src/components/LanguageSelector.js
// Purpose: Dropdown component for switching regional languages across the AI interface

import React from 'react';

const LANGUAGES = [
  { code: 'en', label: 'English', shortLabel: 'EN' },
  { code: 'hi', label: 'हिंदी', shortLabel: 'हि' },
  { code: 'kn', label: 'ಕನ್ನಡ', shortLabel: 'ಕ' },
  { code: 'ta', label: 'தமிழ்', shortLabel: 'த' }
];

const LanguageSelector = ({ currentLanguage, onChange, compact }) => {
  return (
    <div className="relative inline-block">
      <select
        value={currentLanguage || 'en'}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 
                   text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 
                   cursor-pointer focus:ring-2 focus:ring-primary focus:outline-none shadow-sm transition-all"
      >
        {LANGUAGES.map(lang => (
          <option key={lang.code} value={lang.code}>
            {compact ? lang.shortLabel : lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
