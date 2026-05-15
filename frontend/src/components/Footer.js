import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">P</div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">PolicyBot</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              Making government policies accessible and understandable for every Indian citizen through the power of AI.
            </p>
            <div className="flex space-x-5 mt-6">
              <a href="#!" className="text-slate-400 hover:text-primary transition-colors"><FaTwitter size={20} /></a>
              <a href="#!" className="text-slate-400 hover:text-primary transition-colors"><FaLinkedin size={20} /></a>
              <a href="#!" className="text-slate-400 hover:text-primary transition-colors"><FaGithub size={20} /></a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link to="/policies" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Browse Policies</Link></li>
              <li><Link to="/chat" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">AI Explainer</Link></li>
              <li><Link to="/compare" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Compare Schemes</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="#!" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#!" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#!" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} Public Policy Explainer Bot. Built with ❤️ for India.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
