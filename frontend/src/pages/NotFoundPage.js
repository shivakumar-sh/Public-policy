import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-900 px-4 transition-colors">
      <div className="text-[120px] font-black text-primary/10 leading-none">404</div>
      <h1 className="text-4xl font-black text-slate-900 dark:text-white -mt-10 mb-4">Page Not Found</h1>
      <p className="text-slate-500 dark:text-slate-400 text-center max-w-md mb-8">
        The policy page you're looking for doesn't exist or has been moved to another section.
      </p>
      <Link to="/" className="btn-primary flex items-center gap-2">
        <HiOutlineArrowLeft /> Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
