import React, { useState, useEffect } from 'react';
import { HiScale, HiSparkles, HiInformationCircle } from 'react-icons/hi';
import policyService from '../services/policyService';
import chatService from '../services/chatService';
import LoadingSpinner from '../components/LoadingSpinner';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-hot-toast';

const ComparePoliciesPage = () => {
  const [policies, setPolicies] = useState([]);
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await policyService.getPolicies();
        setPolicies(data);
      } catch (e) {
        toast.error('Failed to load policies');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleCompare = async () => {
    if (!p1 || !p2) {
      toast.error('Please select two policies to compare');
      return;
    }
    if (p1 === p2) {
      toast.error('Please select two different policies');
      return;
    }

    setComparing(true);
    try {
      const policy1 = policies.find(p => p._id === p1);
      const policy2 = policies.find(p => p._id === p2);

      const prompt = `Compare the following two government policies clearly:
      Policy 1: ${policy1.title} - ${policy1.content.substring(0, 2000)}
      Policy 2: ${policy2.title} - ${policy2.content.substring(0, 2000)}
      
      Show similarities, differences, target beneficiaries, benefits, and which is better suited for different types of citizens. Use a structured table or clear bullet points.`;
      
      const response = await chatService.send({ message: prompt });
      // The backend returns the full chat object, the last message is the AI response
      setComparisonResult(response.messages[response.messages.length - 1].content);
    } catch (e) {
      toast.error('Comparison failed');
    } finally {
      setComparing(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HiScale size={32} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Compare Policies</h1>
          <p className="text-slate-500 dark:text-slate-400">Select two policies to see a side-by-side AI comparison.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="card">
            <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Policy 1</label>
            <select 
              value={p1} 
              onChange={(e) => setP1(e.target.value)}
              className="input-field appearance-none cursor-pointer"
            >
              <option value="">Select a policy...</option>
              {policies.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
            </select>
          </div>
          <div className="card">
            <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Policy 2</label>
            <select 
              value={p2} 
              onChange={(e) => setP2(e.target.value)}
              className="input-field appearance-none cursor-pointer"
            >
              <option value="">Select a policy...</option>
              {policies.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
            </select>
          </div>
        </div>

        <div className="text-center mb-12">
          <button 
            onClick={handleCompare}
            disabled={comparing}
            className="btn-primary px-12 py-4 text-lg shadow-xl shadow-primary/20"
          >
            {comparing ? 'Analyzing Comparison...' : 'Compare with AI'}
          </button>
        </div>

        {comparisonResult && (
          <div className="card animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-8 text-primary font-bold text-lg border-b border-slate-100 dark:border-slate-700 pb-4">
              <HiSparkles />
              <span>AI Comparative Analysis</span>
            </div>
            <div className="prose prose-blue dark:prose-invert max-w-none">
              <ReactMarkdown>{comparisonResult}</ReactMarkdown>
            </div>
            
            <div className="mt-12 bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl flex gap-4 items-start border border-slate-100 dark:border-slate-800 transition-colors">
              <HiInformationCircle className="text-primary flex-shrink-0" size={24} />
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                This comparison is generated by AI based on policy documents. Always refer to official government websites for the most accurate and up-to-date eligibility criteria.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePoliciesPage;
