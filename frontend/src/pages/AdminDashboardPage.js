import React, { useState, useEffect } from 'react';
import { HiUsers, HiDocumentText, HiChatAlt2, HiAnnotation, HiTrendingUp, HiTrash, HiUserCircle, HiCheckCircle } from 'react-icons/hi';
import { formatDate } from '../utils/helpers';
import adminService from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, usersData] = await Promise.all([
          adminService.getStats(),
          adminService.getUsers()
        ]);
        setStats(statsData.data);
        setUsers(usersData.data);
      } catch (e) {
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminService.deleteUser(id);
        setUsers(users.filter(u => u._id !== id));
        toast.success('User deleted');
      } catch (e) {
        toast.error(e.response?.data?.message || 'Deletion failed');
      }
    }
  };

  const handleRoleChange = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await adminService.updateUserRole(id, newRole);
      setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
      toast.success('Role updated');
    } catch (e) {
      toast.error('Role update failed');
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
            <HiTrendingUp size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Admin Control Panel</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium italic">Platform analytics and management</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard icon={<HiUsers />} label="Total Users" value={stats?.users} color="blue" />
          <StatCard icon={<HiDocumentText />} label="Policies" value={stats?.policies} color="emerald" />
          <StatCard icon={<HiChatAlt2 />} label="Total Chats" value={stats?.chats} color="amber" />
          <StatCard icon={<HiAnnotation />} label="Feedbacks" value={stats?.feedbacks} color="rose" />
        </div>

        {/* Admin Tabs */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'stats' ? 'bg-primary text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
          >
            Analytics
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'users' ? 'bg-primary text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
          >
            User Management
          </button>
        </div>

        {activeTab === 'stats' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="card">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">User Growth (Last 7 Days)</h3>
              <div className="h-64 flex items-end justify-between gap-2 px-4 pb-4">
                {stats?.analytics.signups.map((day, i) => (
                  <div key={i} className="flex flex-col items-center flex-grow gap-2 group">
                    <div 
                      className="w-full bg-primary/20 hover:bg-primary transition-all rounded-t-lg relative"
                      style={{ height: `${(day.count / Math.max(...stats.analytics.signups.map(d => d.count), 1)) * 100}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {day.count} signups
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 rotate-45 md:rotate-0 mt-2">{day._id.split('-').slice(1).join('/')}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HiCheckCircle size={48} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">System Status: Optimal</h3>
                <p className="text-slate-500 mt-2">All API services are running within normal latencies.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="card overflow-hidden !p-0 border-none shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 text-xs font-black uppercase tracking-widest border-b border-slate-100 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400">
                          <HiUserCircle size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{u.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleRoleChange(u._id, u.role)}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Change Role
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(u._id)}
                        className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                      >
                        <HiTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-500',
    emerald: 'bg-emerald-500/10 text-emerald-500',
    amber: 'bg-amber-500/10 text-amber-500',
    rose: 'bg-rose-500/10 text-rose-500',
  };
  return (
    <div className="card shadow-xl border-none">
      <div className={`w-12 h-12 ${colors[color]} rounded-xl flex items-center justify-center mb-4`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-black text-slate-900 dark:text-white">{value || 0}</p>
    </div>
  );
};

export default AdminDashboardPage;
