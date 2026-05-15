import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import PolicyCard from '../components/PolicyCard';
import policyService from '../services/policyService';
import LoadingSpinner from '../components/LoadingSpinner';
import { POLICY_CATEGORIES } from '../utils/constants';
import { HiFilter } from 'react-icons/hi';

const PolicySearchPage = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const data = await policyService.getPolicies();
        setPolicies(data);
      } catch (error) {
        console.error('Failed to fetch policies');
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  const filteredPolicies = policies.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pb-20 transition-colors">
      <div className="bg-slate-50 dark:bg-slate-800/50 py-16 border-b border-slate-100 dark:border-slate-800 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Browse Policy Directory</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Search and discover government policies, laws, and social schemes.</p>
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-slate-900 dark:text-white font-bold">
                <HiFilter className="text-primary" />
                <span>Categories</span>
              </div>
              <div className="flex flex-wrap lg:flex-col gap-2">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-4 py-2 text-left rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === 'All'
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-primary'
                  }`}
                >
                  All Categories
                </button>
                {POLICY_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 text-left rounded-xl text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-primary'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm font-medium text-slate-500">
                Showing <span className="text-slate-900 dark:text-white">{filteredPolicies.length}</span> results
              </p>
            </div>

            {loading ? (
              <LoadingSpinner size="lg" />
            ) : filteredPolicies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {filteredPolicies.map((policy) => (
                  <PolicyCard key={policy._id} policy={policy} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400 text-lg">No policies found matching your criteria.</p>
                <button 
                  onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                  className="mt-4 text-primary font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicySearchPage;
