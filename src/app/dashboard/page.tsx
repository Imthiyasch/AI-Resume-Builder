'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, FileText, Loader2, Calendar, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
    const router = useRouter();
    const [resumes, setResumes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchResumes = async () => {
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
            console.error('Failed to fetch resumes', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResumes();
    }, [router]);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm('Are you sure you want to delete this resume?')) return;

        setDeletingId(id);
        try {
            const { error } = await supabase
                .from('resumes')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setResumes(resumes.filter(r => r.id !== id));
        } catch (err) {
            console.error('Error deleting resume:', err);
            alert('Failed to delete resume');
        } finally {
            setDeletingId(null);
        }
    };

    const handleCreateNew = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
            .from('resumes')
            .insert([
                {
                    user_id: session.user.id,
                    title: 'Untitled Resume',
                    content: {
                        personalInfo: { fullName: '', email: '', phone: '', address: '', summary: '' },
                        experience: [],
                        education: [],
                        skills: []
                    },
                    template_id: 'professional'
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Error creating resume:', error);
            return;
        }

        router.push(`/resume/${data.id}`);
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-black/10 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
                    <p className="text-zinc-400 font-medium animate-pulse">Loading your resumes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] p-6 sm:p-10">
            <div className="max-w-7xl mx-auto">
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
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold shadow-xl hover:shadow-indigo-500/20 transition-all focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Resume
                    </motion.button>
                </header>

                <AnimatePresence mode="popLayout">
                    {resumes.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-white/5 p-16 text-center shadow-2xl relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 transition-opacity" />
                            <div className="relative z-10">
                                <div className="mx-auto w-20 h-20 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                                    <FileText className="w-10 h-10 text-zinc-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Begin your career journey</h3>
                                <p className="text-zinc-400 mb-8 max-w-md mx-auto leading-relaxed">
                                    Create a high-impact, AI-powered resume in minutes. Let's get started on your next big opportunity.
                                </p>
                                <button
                                    onClick={handleCreateNew}
                                    className="inline-flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded-xl font-bold hover:bg-zinc-200 transition-colors shadow-lg"
                                >
                                    <Plus className="w-5 h-5" />
                                    Get Started
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            layout
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
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
                                                <div className="absolute top-3 right-3 z-20">
                                                    <button
                                                        onClick={(e) => handleDelete(resume.id, e)}
                                                        disabled={deletingId === resume.id}
                                                        className="p-2 bg-zinc-900/80 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all backdrop-blur-sm border border-white/5"
                                                    >
                                                        {deletingId === resume.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>

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
                                                    <h3 className="font-bold text-lg text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-1">
                                                        {resume.title}
                                                    </h3>
                                                    <div className="flex items-center justify-between mt-auto">
                                                        <div className="flex items-center text-xs text-zinc-500 gap-1.5">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            <span>
                                                                {new Date(resume.updated_at || resume.created_at).toLocaleDateString(undefined, {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                })}
                                                            </span>
                                                        </div>
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
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
