'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { 
  Users, 
  FileText, 
  Trash2, 
  Ban, 
  ShieldCheck, 
  Search, 
  ArrowLeft,
  Loader2,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface AdminUser {
  id: string;
  email: string;
  is_admin: boolean;
  is_banned?: boolean;
  created_at: string;
  resume_count: number;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState({ total_users: 0, total_resumes: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAdmin();
    fetchStats();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      router.push('/dashboard');
      return;
    }
    setIsAdmin(true);
  };

  const handleBanUser = async (user: AdminUser) => {
    const isBanned = !user.is_banned;
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_banned: isBanned })
      });
      if (!res.ok) throw new Error('Failed to update user');
      
      setUsers(users.map(u => u.id === user.id ? { ...u, is_banned: isBanned } : u));
      toast.success(isBanned ? 'User banned successfully' : 'User unbanned successfully');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteData = async (userId: string) => {
    if (!confirm('Are you sure you want to delete all resumes for this user? This cannot be undone.')) return;
    
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete user data');
      
      setUsers(users.map(u => u.id === userId ? { ...u, resume_count: 0 } : u));
      toast.success('User resume data cleared');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setUsers(data.users);
      setStats({
        total_users: data.total_users,
        total_resumes: data.total_resumes
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.id.includes(search)
  ).filter(u => u.id !== users[0]?.id); // Hide self as a safety measure for accidental deletion? No.

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
        <Loader2 className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <Link href="/dashboard" className="flex items-center gap-2 text-[var(--text-muted)] hover:text-indigo-500 mb-4 transition-colors">
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <h1 className="text-4xl font-black tracking-tight text-[var(--text-main)] flex items-center gap-4">
              Admin <span className="text-indigo-500 font-light italic">Panel</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4 bg-[var(--card-bg)] p-2 rounded-2xl border border-[var(--border-subtle)] shadow-xl w-full md:w-auto">
            <Search className="text-[var(--text-muted)] ml-3" size={20} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none p-2 text-[var(--text-main)] w-full"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-8 rounded-[2rem] border border-[var(--border-subtle)] shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-6">
              <Users size={24} />
            </div>
            <p className="text-[var(--text-muted)] font-bold uppercase tracking-wider text-xs mb-2">Total Users</p>
            <p className="text-4xl font-black text-[var(--text-main)]">{stats.total_users}</p>
          </div>
          
          <div className="glass-card p-8 rounded-[2rem] border border-[var(--border-subtle)] shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6">
              <FileText size={24} />
            </div>
            <p className="text-[var(--text-muted)] font-bold uppercase tracking-wider text-xs mb-2">Total Resumes</p>
            <p className="text-4xl font-black text-[var(--text-main)]">{stats.total_resumes}</p>
          </div>

          <div className="glass-card p-8 rounded-[2rem] border border-green-500/10 shadow-2xl bg-gradient-to-br from-green-500/5 to-transparent">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 mb-6">
              <ShieldCheck size={24} />
            </div>
            <p className="text-[var(--text-muted)] font-bold uppercase tracking-wider text-xs mb-2">Admin Status</p>
            <p className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
              Verified <CheckCircle2 size={18} className="text-green-500" />
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div className="glass-card rounded-[2.5rem] border border-[var(--border-subtle)] shadow-3xl overflow-hidden bg-[var(--card-bg)]">
          <div className="p-8 border-b border-[var(--border-subtle)]">
            <h2 className="text-xl font-bold text-[var(--text-main)]">User Management</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[var(--bg-main)]/50 text-[var(--text-muted)] text-sm uppercase tracking-widest font-bold">
                  <th className="py-6 px-8">User Information</th>
                  <th className="py-6 px-8">Resumes</th>
                  <th className="py-6 px-8">Joined Date</th>
                  <th className="py-6 px-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-indigo-500/5 transition-colors group">
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-xs">
                          {user.email.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-[var(--text-main)] flex items-center gap-2">
                            {user.email}
                            {user.is_banned && <span className="text-[8px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">Banned</span>}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] font-mono">{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-2 text-[var(--text-main)] font-bold">
                        <FileText size={16} className="text-indigo-500" />
                        {user.resume_count}
                      </div>
                    </td>
                    <td className="py-6 px-8 text-[var(--text-muted)] text-sm">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-6 px-8 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleBanUser(user)}
                          className={`p-2 rounded-lg transition-colors ${user.is_banned ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'hover:bg-orange-500/10 text-orange-500'}`} 
                          title={user.is_banned ? 'Unban User' : 'Ban User'}
                        >
                          <Ban size={20} />
                        </button>
                        <button 
                          onClick={() => handleDeleteData(user.id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors" 
                          title="Delete Data"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
