import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineSearch, HiLightningBolt, HiTranslate, HiDocumentText } from 'react-icons/hi';
import PolicyCard from '../components/PolicyCard';
import policyService from '../services/policyService';
import LoadingSpinner from '../components/LoadingSpinner';
import useAuth from '../hooks/useAuth';
import useTranslation from '../hooks/useTranslation';

const HomePage = () => {
  const [featuredPolicies, setFeaturedPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const data = await policyService.getPolicies();
        setFeaturedPolicies(data.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch policies');
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white leading-tight mb-6">
            {t('heroTitle')} <br />
            <span className="text-primary">{t('heroHighlight')}</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
            {t('heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/chat" className="btn-primary flex items-center justify-center gap-2 text-lg px-8">
              <HiLightningBolt /> {t('startChatting')}
            </Link>
            <Link to="/policies" className="btn-secondary flex items-center justify-center gap-2 text-lg px-8">
              <HiOutlineSearch /> {t('browsePolicies')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center text-primary mx-auto mb-6 group-hover:scale-110 transition-transform">
                <HiLightningBolt size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AI Summaries</h3>
              <p className="text-slate-500 dark:text-slate-400">Get the gist of 50-page policy documents in under 10 seconds.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center text-accent mx-auto mb-6 group-hover:scale-110 transition-transform">
                <HiTranslate size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Multi-Language</h3>
              <p className="text-slate-500 dark:text-slate-400">Available in Hindi, Kannada, Tamil and English to serve every Indian.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center text-success mx-auto mb-6 group-hover:scale-110 transition-transform">
                <HiDocumentText size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">PDF Upload</h3>
              <p className="text-slate-500 dark:text-slate-400">Upload any official gazette or policy PDF for instant simplified analysis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Policies */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Featured Policies</h2>
              <p className="text-slate-500 dark:text-slate-400">Stay updated with the latest government schemes.</p>
            </div>
            <Link to="/policies" className="text-primary font-bold hover:underline">View All</Link>
          </div>

          {loading ? (
            <LoadingSpinner size="lg" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPolicies.map((policy) => (
                <PolicyCard key={policy._id} policy={policy} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t('empoweringTitle')}</h2>
          <p className="text-white/80 max-w-xl mx-auto mb-10 text-lg">
            {t('empoweringDesc')}
          </p>
          {isAuthenticated ? (
            <Link to="/policies" className="bg-white text-primary px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all inline-block">
              {t('explorePolicies')}
            </Link>
          ) : (
            <Link to="/register" className="bg-white text-primary px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all inline-block">
              {t('getStartedFree')}
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
