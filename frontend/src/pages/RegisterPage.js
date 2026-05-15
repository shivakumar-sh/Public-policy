import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiUser, HiMail, HiLockClosed, HiTranslate } from 'react-icons/hi';
import useAuth from '../hooks/useAuth';
import { LANGUAGES } from '../utils/constants';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    language: 'en',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      // error handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HiUser size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Create Account</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Join us to simplify policies and find government schemes.
          </p>
        </div>
        
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              name="name"
              type="text"
              required
              className="input-field pl-12"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="relative">
            <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              name="email"
              type="email"
              required
              className="input-field pl-12"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="relative">
            <HiTranslate className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <select
              name="language"
              className="input-field pl-12 appearance-none cursor-pointer"
              value={formData.language}
              onChange={handleChange}
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              name="password"
              type="password"
              required
              className="input-field pl-12"
              placeholder="Password (min 8 chars)"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="relative">
            <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              name="confirmPassword"
              type="password"
              required
              className="input-field pl-12"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-4 text-lg font-bold mt-4 shadow-lg shadow-primary/20"
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account? <Link to="/login" className="font-bold text-primary hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
