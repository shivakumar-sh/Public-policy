import React from 'react';
import { HiTranslate } from 'react-icons/hi';
import { LANGUAGES } from '../utils/constants';
import useChat from '../hooks/useChat';
import useAuth from '../hooks/useAuth';

const LanguageSelector = () => {
  const { language, setLanguage } = useChat();
  const { user, updateProfile } = useAuth();

  const handleChange = async (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    
    // Persist to user profile if logged in
    if (user) {
      try {
        await updateProfile({ language: newLang });
      } catch (error) {
        console.error('Failed to update language preference');
      }
    }
  };

  return (
    <div className="relative flex items-center gap-2 group">
      <div className="absolute left-3 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none">
        <HiTranslate size={18} />
      </div>
      <select
        value={language}
        onChange={handleChange}
        className="appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-8 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer transition-all"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName}
          </option>
        ))}
      </select>
      <div className="absolute right-3 pointer-events-none text-slate-400">
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
};

export default LanguageSelector;
