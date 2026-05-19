import React, { useState, useEffect } from 'react';
import { HiUser, HiChatAlt2, HiBookmark, HiDocumentText, HiCog, HiChevronRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../utils/helpers';

const UserDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ chats: 0, bookmarks: 0, documents: 0 });
  const [recentChats, setRecentChats] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, chatsRes, bookmarksRes] = await Promise.all([
          api.get('/users/stats'),
          api.get('/chat/history'),
          api.get('/users/bookmarks')
        ]);
        setStats(statsRes.data || { chats: 0, bookmarks: 0, documents: 0 });
        setRecentChats(chatsRes.data?.items?.slice(0, 5) || []);
        setBookmarks(bookmarksRes.data?.slice(0, 5) || []);
      } catch (e) {
        console.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden">
              {user?.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <HiUser size={48} />}
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">Namaste, {user?.name.split(' ')[0]}!</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Welcome to your policy dashboard.</p>
            </div>
          </div>
          <Link to="/profile" className="btn-secondary flex items-center gap-2 border-slate-200 text-slate-600">
            <HiCog /> Edit Profile
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card flex items-center gap-6 border-none shadow-xl bg-primary text-white">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <HiChatAlt2 size={28} />
            </div>
            <div>
              <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Total Chats</p>
              <p className="text-3xl font-black">{stats.chats}</p>
            </div>
          </div>
          <div className="card flex items-center gap-6 border-none shadow-xl bg-white dark:bg-slate-800 transition-colors">
            <div className="w-14 h-14 bg-accent/10 text-accent rounded-2xl flex items-center justify-center">
              <HiBookmark size={28} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Bookmarks</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{stats.bookmarks}</p>
            </div>
          </div>
          <div className="card flex items-center gap-6 border-none shadow-xl bg-white dark:bg-slate-800 transition-colors">
            <div className="w-14 h-14 bg-success/10 text-success rounded-2xl flex items-center justify-center">
              <HiDocumentText size={28} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Documents</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{stats.documents}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent AI Chats</h2>
              <Link to="/chat" className="text-sm text-primary font-bold hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {recentChats.length > 0 ? recentChats.map(chat => (
                <Link key={chat._id} to="/chat" className="card !p-4 flex items-center justify-between hover:border-primary transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-slate-400 group-hover:text-primary transition-colors">
                      <HiChatAlt2 size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700 dark:text-white truncate max-w-[200px]">{chat.title}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest">{formatDate(chat.updatedAt)}</p>
                    </div>
                  </div>
                  <HiChevronRight className="text-slate-300 group-hover:text-primary transition-all" />
                </Link>
              )) : (
                <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-400 italic">No recent chats</p>
                </div>
              )}
            </div>
          </div>

          {/* Saved Policies */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Bookmarked Policies</h2>
              <Link to="/policies" className="text-sm text-primary font-bold hover:underline">Browse More</Link>
            </div>
            <div className="space-y-3">
              {bookmarks.length > 0 ? bookmarks.map(policy => (
                <Link key={policy._id} to={`/policies/${policy._id}`} className="card !p-4 flex items-center justify-between hover:border-accent transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-accent/10 rounded-lg text-accent">
                      <HiBookmark size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700 dark:text-white truncate max-w-[200px]">{policy.title}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest">{policy.category}</p>
                    </div>
                  </div>
                  <HiChevronRight className="text-slate-300 group-hover:text-accent transition-all" />
                </Link>
              )) : (
                <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-400 italic">No bookmarks yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
