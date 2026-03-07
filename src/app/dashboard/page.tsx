'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, FileText, Loader2, Calendar } from 'lucide-react';

export default function Dashboard() {
    const router = useRouter();
    const [resumes, setResumes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserAndResumes = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push('/login');
                return;
            }

            try {
                const res = await fetch('/api/get-resumes', {
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                    },
                });
                const data = await res.json();
                if (data.resumes) {
                    setResumes(data.resumes);
                }
            } catch (err) {
                console.error('Failed to fetch resumes', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndResumes();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-black flex text-indigo-500 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">My Resumes</h1>
                    <Link
                        href="/resume/new"
                        className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-500 shadow-sm transition"
                    >
                        <Plus className="w-5 h-5" />
                        Create Resume
                    </Link>
                </div>

                {resumes.length === 0 ? (
                    <div className="bg-zinc-950 rounded-2xl border border-zinc-800/50 p-12 text-center shadow-2xl">
                        <div className="mx-auto w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                            <FileText className="w-8 h-8 text-zinc-600" />
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">No resumes yet</h3>
                        <p className="text-zinc-400 mb-6 max-w-sm mx-auto">Create your first AI-powered resume to stand out and land your dream job.</p>
                        <Link
                            href="/resume/new"
                            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-500 transition shadow-[0_0_15px_rgba(79,70,229,0.3)]"
                        >
                            <Plus className="w-5 h-5" />
                            Create Resume
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resumes.map((resume) => (
                            <Link key={resume.id} href={`/resume/${resume.id}`}>
                                <div className="bg-zinc-950 rounded-xl border border-zinc-800/50 p-6 hover:shadow-2xl hover:border-indigo-500/50 transition-all cursor-pointer group h-full flex flex-col shadow-sm hover:-translate-y-1">
                                    <div className="flex-grow flex items-center justify-center bg-zinc-900 rounded-lg mb-5 p-8 border border-zinc-800/80 group-hover:bg-indigo-950/30 transition-colors">
                                        <FileText className="w-16 h-16 text-zinc-700 group-hover:text-indigo-400 transition-colors" />
                                    </div>
                                    <h3 className="font-semibold text-xl text-zinc-100 mb-2 group-hover:text-indigo-400 transition-colors line-clamp-1">
                                        {resume.title}
                                    </h3>
                                    <div className="flex items-center text-sm text-zinc-500 gap-1.5 mt-auto">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            Updated {new Date(resume.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
