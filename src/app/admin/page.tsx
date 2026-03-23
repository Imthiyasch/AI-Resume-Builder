'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { 
    Users, 
    FileText, 
    Shield, 
    Search, 
    ArrowLeft, 
    Loader2, 
    UserPlus, 
    ExternalLink,
    TrendingUp,
    Activity,
    Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface UserProfile {
    id: string;
    email: string;
    is_admin: boolean;
    created_at: string;
    resume_count?: number;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalResumes: 0,
        adminCount: 0
    });

    useEffect(() => {
        const fetchAdminData = async () => {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push('/login');
                return;
            }

            // Verify admin status
            const { data: profile } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('id', session.user.id)
                .single();

            if (!profile?.is_admin) {
                router.push('/dashboard');
                return;
            }

            try {
                // Fetch profiles
                const { data: profiles, error: pError } = await supabase
                    .from('profiles')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (pError) throw pError;

                // Fetch resume counts for each user
                const { data: resumes, error: rError } = await supabase
                    .from('resumes')
                    .select('user_id');

                if (rError) throw rError;

                const resumeCounts: Record<string, number> = {};
                resumes?.forEach(r => {
                    resumeCounts[r.user_id] = (resumeCounts[r.user_id] || 0) + 1;
                });

                const enrichedUsers = profiles.map(u => ({
                    ...u,
                    resume_count: resumeCounts[u.id] || 0
                }));

                setUsers(enrichedUsers);
                setStats({
                    totalUsers: enrichedUsers.length,
                    totalResumes: resumes?.length || 0,
                    adminCount: enrichedUsers.filter(u => u.is_admin).length
                });

            } catch (err) {
                console.error('Admin fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [router]);

    const filteredUsers = users.filter(u => 
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-black">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                    <p className="text-zinc-500 font-medium">Scanning network...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-black text-white p-6 sm:p-10">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold uppercase tracking-wider">
                            <Shield className="w-4 h-4" />
                            Admin Command Center
                        </div>
                        <h1 className="text-4xl font-black tracking-tight">System Overview</h1>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input 
                                type="text" 
                                placeholder="Search users by email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-zinc-900/50 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-64 transition-all"
                            />
                        </div>
                        <Link href="/dashboard" className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/5 text-sm font-bold hover:bg-zinc-800 transition-all flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Exit Admin
                        </Link>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard 
                        title="Total Operators" 
                        value={stats.totalUsers} 
                        icon={Users} 
                        color="indigo" 
                        subtitle={`${stats.adminCount} Administrators`}
                    />
                    <StatCard 
                        title="Resumes Generated" 
                        value={stats.totalResumes} 
                        icon={FileText} 
                        color="purple" 
                        subtitle="Across all accounts"
                    />
                    <StatCard 
                        title="Avg. Resumes/User" 
                        value={(stats.totalResumes / (stats.totalUsers || 1)).toFixed(1)} 
                        icon={TrendingUp} 
                        color="emerald" 
                        subtitle="Engagement metric"
                    />
                </div>

                {/* Users Table */}
                <div className="bg-zinc-950/50 border border-white/5 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-3xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Operator</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">ID</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Privileges</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 text-center">Data Count</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Enrolled</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.map((user) => (
                                    <motion.tr 
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-white/[0.02] transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm shadow-lg">
                                                    {user.email[0].toUpperCase()}
                                                </div>
                                                <div className="font-semibold text-zinc-200 group-hover:text-white transition-colors">{user.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-zinc-500">
                                            {user.id.slice(0, 18)}...
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.is_admin ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-tight border border-indigo-500/20">
                                                    <Shield className="w-3 h-3" />
                                                    Admin
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-tight">
                                                    Member
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="font-bold text-white">{user.resume_count}</span>
                                                <span className="text-[10px] text-zinc-600 uppercase">Resumes</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-zinc-400">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {!user.is_admin && (
                                                    <button 
                                                        onClick={async () => {
                                                            if (confirm(`Promote ${user.email} to admin?`)) {
                                                                const { error } = await supabase
                                                                    .from('profiles')
                                                                    .update({ is_admin: true })
                                                                    .eq('id', user.id);
                                                                if (error) alert(error.message);
                                                                else window.location.reload();
                                                            }
                                                        }}
                                                        className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-all"
                                                        title="Promote to Admin"
                                                    >
                                                        <Shield className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={async () => {
                                                        if (confirm(`Warning: This will delete ${user.email} and all their resumes. Proceed?`)) {
                                                            const { error } = await supabase.auth.admin.deleteUser(user.id);
                                                            if (error) alert("To delete users, you need service_role key or use the Supabase dashboard. Access restricted.");
                                                            else window.location.reload();
                                                        }
                                                    }}
                                                    className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: 'indigo' | 'purple' | 'emerald';
    subtitle: string;
}

function StatCard({ title, value, icon: Icon, color, subtitle }: StatCardProps) {
    const colors: Record<string, string> = {
        indigo: "from-indigo-600/20 to-indigo-600/5 text-indigo-400",
        purple: "from-purple-600/20 to-purple-600/5 text-purple-400",
        emerald: "from-emerald-600/20 to-emerald-600/5 text-emerald-400"
    };

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="bg-zinc-950/50 border border-white/5 rounded-3xl p-6 relative overflow-hidden group shadow-xl"
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${colors[color]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
                    <h3 className="text-3xl font-black text-white">{value}</h3>
                    <p className="text-zinc-600 text-[10px] mt-1 font-medium">{subtitle}</p>
                </div>
                <div className={`p-3 rounded-2xl bg-zinc-900 border border-white/10 ${colors[color].split(' ')[2]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </motion.div>
    );
}

const MoreVertical = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
);
