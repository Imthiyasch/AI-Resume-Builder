'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, FileText, Loader2, Calendar, Trash2, Pencil, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// Skeleton card for loading state
function ResumeSkeleton() {
    return (
        <div className="bg-zinc-950/50 rounded-2xl border border-white/5 p-5 animate-pulse">
            <div className="aspect-[3/4] bg-zinc-800/50 rounded-xl mb-5" />
            <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
            <div className="h-3 bg-zinc-800/50 rounded w-1/2" />
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
                .order('created_at', { ascending: false });

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
                template_id: 'professional'
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

    return (
        <div className="min-h-[calc(100vh-4rem)] p-6 sm:p-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-extrabold text-white tracking-tight"
                        >
                            My Resumes
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-zinc-400 mt-1"
                        >
                            Manage and polish your professional resumes.
                        </motion.p>
                    </div>

                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCreateNew}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold shadow-xl hover:shadow-indigo-500/20 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Resume
                    </motion.button>
                </header>

                {/* Loading skeleton */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <ResumeSkeleton key={i} />)}
                    </div>
                )}

                <AnimatePresence mode="popLayout">
                    {!loading && resumes.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-white/5 p-16 text-center shadow-2xl relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
                            <div className="relative z-10">
                                <div className="mx-auto w-20 h-20 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                                    <FileText className="w-10 h-10 text-zinc-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">No resumes yet</h3>
                                <p className="text-zinc-400 mb-8 max-w-md mx-auto leading-relaxed">
                                    Create your first AI-powered resume in minutes. Let&apos;s get you hired!
                                </p>
                                <button
                                    onClick={handleCreateNew}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3.5 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg"
                                >
                                    <Plus className="w-5 h-5" />
                                    Create Your First Resume
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {!loading && resumes.length > 0 && (
                        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {resumes.map((resume, index) => (
                                    <motion.div
                                        key={resume.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link href={`/resume/${resume.id}`}>
                                            <div className="bg-zinc-950/50 backdrop-blur-md rounded-2xl border border-white/5 p-5 hover:border-indigo-500/30 transition-all cursor-pointer group h-full flex flex-col shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1 overflow-hidden relative">
                                                {/* Action buttons */}
                                                <div className="absolute top-3 right-3 z-20 flex gap-1">
                                                    <button
                                                        onClick={(e) => startRename(resume, e)}
                                                        className="p-2 bg-zinc-900/80 rounded-lg text-zinc-500 hover:text-indigo-400 hover:bg-indigo-400/10 transition-all backdrop-blur-sm border border-white/5"
                                                        title="Rename"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDelete(resume.id, e)}
                                                        disabled={deletingId === resume.id}
                                                        className="p-2 bg-zinc-900/80 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all backdrop-blur-sm border border-white/5"
                                                        title="Delete"
                                                    >
                                                        {deletingId === resume.id ? (
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        )}
                                                    </button>
                                                </div>

                                                {/* Preview area */}
                                                <div className="aspect-[3/4] bg-zinc-900/50 rounded-xl mb-5 p-6 border border-white/5 group-hover:bg-indigo-950/20 transition-colors flex items-center justify-center relative overflow-hidden">
                                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-indigo-500/10 to-transparent" />
                                                    <FileText className="w-20 h-20 text-zinc-700 group-hover:text-indigo-400/50 transition-all duration-500 group-hover:scale-110" />
                                                    <div className="absolute bottom-4 left-4 right-4 translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                                                        <div className="bg-indigo-600 text-white text-xs font-bold py-2 rounded-lg text-center shadow-lg uppercase tracking-wider">
                                                            Edit Resume
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="px-1">
                                                    {/* Inline rename */}
                                                    {renamingId === resume.id ? (
                                                        <div className="flex gap-1 mb-2" onClick={e => e.preventDefault()}>
                                                            <input
                                                                autoFocus
                                                                value={renameValue}
                                                                onChange={e => setRenameValue(e.target.value)}
                                                                onKeyDown={e => {
                                                                    if (e.key === 'Enter') commitRename(resume.id);
                                                                    if (e.key === 'Escape') setRenamingId(null);
                                                                }}
                                                                className="flex-1 bg-zinc-800 border border-indigo-500/50 rounded-lg px-2 py-1 text-sm text-white focus:outline-none"
                                                            />
                                                            <button onClick={(e) => commitRename(resume.id, e)} className="p-1 text-indigo-400 hover:text-green-400"><Check className="w-4 h-4" /></button>
                                                            <button onClick={e => { e.preventDefault(); setRenamingId(null); }} className="p-1 text-zinc-500 hover:text-red-400"><X className="w-4 h-4" /></button>
                                                        </div>
                                                    ) : (
                                                        <h3 className="font-bold text-lg text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-1">
                                                            {resume.title}
                                                        </h3>
                                                    )}
                                                    <div className="flex items-center text-xs text-zinc-500 gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        <span>
                                                            {new Date(resume.updated_at || resume.created_at).toLocaleDateString(undefined, {
                                                                month: 'short', day: 'numeric', year: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
