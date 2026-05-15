import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiOutlineArrowLeft, HiSparkles, HiBookOpen, HiBookmark, HiShare } from 'react-icons/hi';
import policyService from '../services/policyService';
import LoadingSpinner from '../components/LoadingSpinner';
import FeedbackForm from '../components/FeedbackForm';
import { formatDate } from '../utils/helpers';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-hot-toast';

const PolicyDetailsPage = () => {
  const { id } = useParams();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [activeTab, setActiveTab] = useState('simplified'); // 'simplified' or 'original'

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const data = await policyService.getPolicyById(id);
        setPolicy(data);
      } catch (error) {
        toast.error('Failed to load policy details');
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
  }, [id]);

  const handleSimplify = async () => {
    setIsSimplifying(true);
    try {
      const simplified = await policyService.simplify(id);
      setPolicy({ ...policy, simplifiedContent: simplified });
      setActiveTab('simplified');
      toast.success('AI simplification complete!');
    } catch (error) {
      toast.error('Simplification failed');
    } finally {
      setIsSimplifying(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (!policy) return <div className="min-h-screen flex items-center justify-center">Policy not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors">
      <div className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 pt-12 pb-8 transition-colors">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/policies" className="inline-flex items-center gap-2 text-primary font-bold mb-8 hover:-translate-x-1 transition-transform">
            <HiOutlineArrowLeft /> Back to Directory
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-black rounded-full uppercase tracking-widest">{policy.category}</span>
                <span className="text-slate-400 text-xs font-medium uppercase tracking-widest">{formatDate(policy.dateEnacted)}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                {policy.title}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">{policy.ministry}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 transition-all text-slate-600 dark:text-slate-300 shadow-sm" title="Bookmark">
                <HiBookmark size={24} />
              </button>
              <button className="p-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 transition-all text-slate-600 dark:text-slate-300 shadow-sm" title="Share">
                <HiShare size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 gap-8">
          <div className="card !p-0 overflow-hidden">
            {/* Tabs Header */}
            <div className="flex border-b border-slate-100 dark:border-slate-700">
              <button 
                onClick={() => setActiveTab('simplified')}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all ${
                  activeTab === 'simplified' 
                    ? 'text-primary bg-primary/5 border-b-2 border-primary' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <HiSparkles size={18} /> AI Simplified
              </button>
              <button 
                onClick={() => setActiveTab('original')}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all ${
                  activeTab === 'original' 
                    ? 'text-primary bg-primary/5 border-b-2 border-primary' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <HiBookOpen size={18} /> Original Content
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'simplified' ? (
                policy.simplifiedContent ? (
                  <div className="prose prose-blue dark:prose-invert max-w-none animate-in fade-in">
                    <ReactMarkdown>{policy.simplifiedContent}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <HiSparkles size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Need a simpler explanation?</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 mb-8">Our AI can break this policy down into easy points for you.</p>
                    <button 
                      onClick={handleSimplify}
                      disabled={isSimplifying}
                      className="btn-primary"
                    >
                      {isSimplifying ? 'Generating Summary...' : 'Simplify with AI'}
                    </button>
                  </div>
                )
              ) : (
                <div className="prose prose-slate dark:prose-invert max-w-none animate-in fade-in">
                  <ReactMarkdown>{policy.content}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>

          {/* Feedback Form */}
          {activeTab === 'simplified' && policy.simplifiedContent && (
            <FeedbackForm policyId={policy._id} />
          )}

          {/* Related / Sidebar Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Key Tags</h4>
              <div className="flex flex-wrap gap-2">
                {policy.tags?.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold">#{tag}</span>
                ))}
              </div>
            </div>
            <div className="card">
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-primary font-bold hover:underline">Official Notification PDF</a></li>
                <li><a href="#" className="text-sm text-primary font-bold hover:underline">Apply for this scheme</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyDetailsPage;
