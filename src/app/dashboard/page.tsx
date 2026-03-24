'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, FileText, Loader2, Calendar, Trash2, Pencil, Check, X, Search, Sparkles, TrendingUp, Target, Clock, Filter, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import DashboardSidebar from '@/components/DashboardSidebar';

// Skeleton card for loading state
function ResumeSkeleton() {
    return (
        <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)] p-6 animate-pulse">
            <div className="aspect-[3/4] bg-[var(--border-subtle)] rounded-2xl mb-5" />
            <div className="h-4 bg-[var(--border-subtle)] rounded w-3/4 mb-2" />
            <div className="h-3 bg-[var(--border-subtle)]/50 rounded w-1/2" />
        </div>
    );
}

export default function Dashboard() {
    const router = useRouter();
    const [resumes, setResumes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchResumes = useCallback(async () => {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            router.push('/login');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('resumes')
                .select('*')
                .order('updated_at', { ascending: false });

            if (error) throw error;
            setResumes(data || []);
        } catch (err) {
            toast.error('Failed to load resumes');
            console.error('Failed to fetch resumes', err);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchResumes();
    }, [fetchResumes]);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm('Are you sure you want to delete this resume?')) return;

        setDeletingId(id);
        try {
            const { error } = await supabase.from('resumes').delete().eq('id', id);
            if (error) throw error;
            setResumes(resumes.filter(r => r.id !== id));
            toast.success('Resume deleted');
        } catch (err) {
            toast.error('Failed to delete resume');
            console.error('Error deleting resume:', err);
        } finally {
            setDeletingId(null);
        }
    };

    const startRename = (resume: any, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setRenamingId(resume.id);
        setRenameValue(resume.title);
    };

    const commitRename = async (id: string, e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        if (!renameValue.trim()) return;
        try {
            const { error } = await supabase
                .from('resumes')
                .update({ title: renameValue.trim() })
                .eq('id', id);
            if (error) throw error;
            setResumes(resumes.map(r => r.id === id ? { ...r, title: renameValue.trim() } : r));
            toast.success('Resume renamed');
        } catch {
            toast.error('Failed to rename resume');
        } finally {
            setRenamingId(null);
        }
    };

    const handleCreateNew = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
            .from('resumes')
            .insert([{
                user_id: session.user.id,
                title: 'Untitled Resume',
                content: {
                    personalInfo: { fullName: '', email: '', phone: '', address: '', summary: '' },
                    experience: [],
                    education: [],
                    skills: []
                },
                template_id: 'ats-clean' // Default to ATS for new resumes
            }])
            .select()
            .single();

        if (error) {
            toast.error('Failed to create resume');
            console.error('Error creating resume:', error);
            return;
        }

        toast.success('New resume created!');
        router.push(`/resume/${data.id}`);
    };

    const filteredResumes = resumes.filter(r => 
        r.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-[var(--bg-app)]">
            <DashboardSidebar onCreateNew={handleCreateNew} />

            <main className="flex-1 overflow-y-auto h-full scroll-smooth custom-scrollbar">
                <div className="max-w-6xl mx-auto px-8 py-10">
                    {/* Header with Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        <div className="md:col-span-2">
                             <h1 className="text-3xl font-black text-[var(--text-main)] tracking-tight">
                                Welcome back, <span className="premium-gradient-text">Candidate</span>
                            </h1>
                            <p className="text-[var(--text-muted)] mt-1 font-medium italic">You&apos;re 3 steps away from your dream job.</p>
                        </div>
                        <div className="p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center gap-4 shadow-sm group hover:border-indigo-500/30 transition-all">
                             <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                <TrendingUp size={24} />
                             </div>
                             <div>
                                 <div className="text-2xl font-black">{resumes.length}</div>
                                 <div className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-widest leading-none">Total Resumes</div>
                             </div>
                        </div>
                        <div className="p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center gap-4 shadow-sm group hover:border-emerald-500/30 transition-all">
                             <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                <Target size={24} />
                             </div>
                             <div>
                                 <div className="text-2xl font-black">84%</div>
                                 <div className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-widest leading-none">Avg ATS Score</div>
                             </div>
                        </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
                        <div className="relative w-full sm:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Find a resume..."
                                className="w-full h-12 pl-12 pr-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button className="flex-1 sm:flex-none h-12 px-5 rounded-2xl border border-[var(--border-subtle)] text-sm font-bold flex items-center justify-center gap-2 hover:bg-[var(--bg-card)] transition-all">
                                <Filter size={18} className="text-indigo-500" />
                                Filter
                            </button>
                            <button className="flex-1 sm:flex-none h-12 px-5 rounded-2xl border border-[var(--border-subtle)] text-sm font-bold flex items-center justify-center gap-2 hover:bg-[var(--bg-card)] transition-all">
                                <Clock size={18} className="text-indigo-500" />
                                Recent
                            </button>
                        </div>
                    </div>

                    {/* Content Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => <ResumeSkeleton key={i} />)}
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filteredResumes.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-20 flex flex-col items-center text-center bg-[var(--bg-card)] rounded-[3rem] border border-dashed border-[var(--border-subtle)]"
                                >
                                    <div className="w-20 h-20 rounded-[2rem] bg-indigo-500/5 flex items-center justify-center mb-6">
                                        <FileText size={40} className="text-indigo-500/30" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">No resumes found</h3>
                                    <p className="text-[var(--text-muted)] text-sm mb-8 max-w-sm">
                                        {searchQuery ? `No results for "${searchQuery}". Try a different term.` : "Start your professional journey today!"}
                                    </p>
                                    <button onClick={handleCreateNew} className="premium-button px-8 py-3.5 rounded-2xl font-bold">
                                        Create First Resume
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
                                    <AnimatePresence>
                                        {filteredResumes.map((resume, index) => (
                                            <motion.div
                                                key={resume.id}
                                                layout
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <div className="group relative bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-subtle)] p-6 hover:border-indigo-500/30 transition-all shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-2 flex flex-col h-full overflow-hidden">
                                                    {/* Card Header Actions */}
                                                    <div className="flex justify-between items-center mb-6 z-20">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                                                <FileText size={16} />
                                                            </div>
                                                            <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Resume</div>
                                                        </div>
                                                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button 
                                                                onClick={(e) => startRename(resume, e)}
                                                                className="p-2 rounded-lg bg-[var(--bg-app)] hover:text-indigo-500 transition-colors"
                                                            >
                                                                <Pencil size={14} />
                                                            </button>
                                                            <button 
                                                                onClick={(e) => handleDelete(resume.id, e)}
                                                                className="p-2 rounded-lg bg-[var(--bg-app)] hover:text-rose-500 transition-colors"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Resume Preview Box */}
                                                    <Link href={`/resume/${resume.id}`} className="flex-1">
                                                        <div className="aspect-[3/4] bg-[var(--bg-app)] rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center border border-[var(--border-subtle)]/50 group-hover:border-indigo-500/20 transition-all">
                                                            <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            
                                                            {/* Mock Lines for Preview */}
                                                            <div className="w-3/4 space-y-3 opacity-30 group-hover:opacity-60 transition-opacity">
                                                                <div className="h-4 bg-zinc-700/50 rounded-full w-full" />
                                                                <div className="h-2 bg-zinc-700/30 rounded-full w-3/4" />
                                                                <div className="h-1 bg-zinc-700/20 rounded-full w-2/3" />
                                                                <div className="h-1 bg-zinc-700/20 rounded-full w-full" />
                                                                <div className="h-1 bg-zinc-700/20 rounded-full w-1/2" />
                                                            </div>

                                                            {/* ATS Score Indicator */}
                                                            <div className="absolute top-4 right-4 py-1.5 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-tighter flex items-center gap-1.5 backdrop-blur-md">
                                                                <Target size={12} />
                                                                <span>92 pts</span>
                                                            </div>

                                                            {/* Hover Overlay */}
                                                            <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                                                                <div className="w-14 h-14 rounded-full bg-white text-indigo-600 shadow-2xl flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                                    <ArrowRight size={24} />
                                                                </div>
                                                                <span className="text-sm font-black text-indigo-500 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 uppercase tracking-widest">Edit Now</span>
                                                            </div>
                                                        </div>

                                                        {/* Metadata */}
                                                        <div className="px-1 mb-2">
                                                            {renamingId === resume.id ? (
                                                                <div className="flex gap-1" onClick={e => e.preventDefault()}>
                                                                    <input
                                                                        autoFocus
                                                                        value={renameValue}
                                                                        onChange={e => setRenameValue(e.target.value)}
                                                                        onKeyDown={e => {
                                                                            if (e.key === 'Enter') commitRename(resume.id);
                                                                            if (e.key === 'Escape') setRenamingId(null);
                                                                        }}
                                                                        className="flex-1 bg-[var(--bg-app)] border border-indigo-500 rounded-xl px-3 py-1.5 text-sm font-bold focus:outline-none"
                                                                    />
                                                                    <button onClick={(e) => commitRename(resume.id, e)} className="p-2 text-indigo-500"><Check size={18} /></button>
                                                                </div>
                                                            ) : (
                                                                <h3 className="text-xl font-black text-[var(--text-main)] group-hover:text-indigo-500 transition-colors truncate">
                                                                    {resume.title}
                                                                </h3>
                                                            )}
                                                            <div className="flex items-center justify-between mt-3 px-1">
                                                                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                                                                    <Calendar size={14} />
                                                                    <span className="text-xs font-bold">{new Date(resume.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-[var(--text-muted)] border border-[var(--border-subtle)] px-2 py-0.5 rounded-lg">
                                                                    <Sparkles size={12} className="text-indigo-500" />
                                                                    <span className="text-[10px] font-bold uppercase tracking-widest">Optimized</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </main>
        </div>
    );
}
