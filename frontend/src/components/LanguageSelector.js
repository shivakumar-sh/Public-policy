// frontend/src/components/LanguageSelector.js
// Purpose: Dropdown component for switching regional languages across the AI interface

import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const LANGUAGES = [
  { code: 'en', label: 'English', shortLabel: 'EN' },
  { code: 'hi', label: 'हिंदी', shortLabel: 'हि' },
  { code: 'kn', label: 'ಕನ್ನಡ', shortLabel: 'ಕ' },
  { code: 'ta', label: 'தமிழ்', shortLabel: 'த' }
];

const LanguageSelector = ({ currentLanguage: propLanguage, onChange: propOnChange, compact }) => {
  const { language: contextLanguage, changeLanguage: contextChangeLanguage } = useContext(LanguageContext);

  const activeLanguage = propLanguage || contextLanguage || 'en';
  const handleLanguageChange = propOnChange || contextChangeLanguage;

  return (
    <div className="relative inline-block">
      <select
        value={activeLanguage}
        onChange={(e) => handleLanguageChange(e.target.value)}
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
