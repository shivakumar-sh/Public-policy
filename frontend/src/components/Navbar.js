import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMenu, HiX, HiMoon, HiSun, HiUserCircle } from 'react-icons/hi';
import useAuth from '../hooks/useAuth';
import useDarkMode from '../hooks/useDarkMode';
import useTranslation from '../hooks/useTranslation';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">P</div>
              <span className="text-xl font-bold text-slate-900 dark:text-white hidden sm:block">PolicyBot</span>
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-4">
              <Link to="/" className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white">{t('home')}</Link>
              <Link to="/policies" className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white">{t('policies')}</Link>
              <Link to="/chat" className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white">{t('chatAI')}</Link>
              <Link to="/compare" className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white">{t('compare')}</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            <button onClick={toggleDarkMode} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              {isDarkMode ? <HiSun size={20} /> : <HiMoon size={20} />}
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary">
                  <HiUserCircle size={24} />
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="text-sm font-medium text-danger hover:underline">Logout</button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary">{t('login')}</Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm">{t('register')}</Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600 dark:text-slate-300">
              {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-4">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 text-base font-medium text-slate-600 dark:text-slate-300">{t('home')}</Link>
            <Link to="/policies" className="block px-3 py-2 text-base font-medium text-slate-600 dark:text-slate-300">{t('policies')}</Link>
            <Link to="/chat" className="block px-3 py-2 text-base font-medium text-slate-600 dark:text-slate-300">{t('chatAI')}</Link>
            <Link to="/compare" className="block px-3 py-2 text-base font-medium text-slate-600 dark:text-slate-300">{t('compare')}</Link>
            <div className="flex items-center justify-between px-3 py-2">
              <LanguageSelector />
              <button onClick={toggleDarkMode} className="p-2 text-slate-500 rounded-full">
                {isDarkMode ? <HiSun size={20} /> : <HiMoon size={20} />}
              </button>
            </div>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 text-base font-medium text-slate-600 dark:text-slate-300">Dashboard</Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-base font-medium text-danger">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-base font-medium text-slate-600">{t('login')}</Link>
                <Link to="/register" className="block px-3 py-2 text-base font-medium text-primary">{t('register')}</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
