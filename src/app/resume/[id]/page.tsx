'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { ResumeData, defaultResumeData } from '@/types/resume';
import ResumeForm from '@/components/ResumeForm';
import ResumePreview from '@/components/ResumePreview';
import { Loader2, ArrowLeft, Save, CheckCircle2, Eye, Pencil } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ResumeEditor() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [data, setData] = useState<ResumeData>(defaultResumeData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedAt, setSavedAt] = useState<Date | null>(null);
    const [sessionToken, setSessionToken] = useState('');
    const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
    
    // Ref for debounce timer
    const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const sessionTokenRef = useRef('');

    useEffect(() => {
        sessionTokenRef.current = sessionToken;
    }, [sessionToken]);

    useEffect(() => {
        const fetchResume = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }
            setSessionToken(session.access_token);
            sessionTokenRef.current = session.access_token;

            if (id === 'new') {
                setData(defaultResumeData);
                setLoading(false);
                return;
            }

            try {
                const { data: resumeData, error } = await supabase
                    .from('resumes')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                if (resumeData && resumeData.content) {
                    setData({ ...defaultResumeData, ...resumeData.content, title: resumeData.title });
                }
            } catch (err) {
                toast.error('Failed to load resume');
                console.error('Failed to load resume', err);
            } finally {
                setLoading(false);
            }
        };

        fetchResume();
    }, [id, router]);

    // Auto-save: debounced 2s after last change
    const performSave = useCallback(async (currentData: ResumeData, token: string, resumeId: string, isManual = false) => {
        if (!token || resumeId === 'new') return;
        setSaving(true);
        try {
            const res = await fetch('/api/save-resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: resumeId,
                    title: currentData.title || 'Untitled Resume',
                    content: currentData
                })
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Save failed');
            setSavedAt(new Date());
            if (isManual) toast.success('Resume saved!');
            if (result.resume && resumeId === 'new') {
                router.push(`/resume/${result.resume.id}`);
            }
        } catch (err) {
            if (isManual) toast.error('Failed to save resume');
            console.error('Save failed', err);
        } finally {
            setSaving(false);
        }
    }, [router]);

    // Trigger auto-save whenever data changes
    useEffect(() => {
        if (loading || id === 'new') return;
        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
        autoSaveTimer.current = setTimeout(() => {
            performSave(data, sessionTokenRef.current, id, false);
        }, 2000);
        return () => {
            if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
        };
    }, [data, loading, id, performSave]);

    const handleSave = () => {
        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
        performSave(data, sessionToken, id, true);
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-black">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    <p className="text-zinc-400 text-sm">Loading resume...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-black">
            {/* Toolbar */}
            <div className="bg-zinc-950 border-b border-zinc-800 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard" className="text-zinc-500 hover:text-white transition-colors p-2 rounded-full hover:bg-zinc-900">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData({ ...data, title: e.target.value })}
                        className="text-lg font-bold text-white bg-transparent border-transparent focus:border-indigo-500 focus:ring-indigo-500 rounded-md px-3 py-1.5 w-40 sm:w-64 hover:bg-zinc-900 transition-colors"
                        placeholder="Resume Title"
                    />
                </div>

                <div className="flex items-center gap-3">
                    {/* Auto-save indicator */}
                    {savedAt && !saving && (
                        <span className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Saved {savedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}

                    {/* Mobile tab toggle */}
                    <div className="flex lg:hidden bg-zinc-800 rounded-lg p-1 gap-1">
                        <button
                            onClick={() => setMobileTab('edit')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mobileTab === 'edit' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                        >
                            <Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                            onClick={() => setMobileTab('preview')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mobileTab === 'preview' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                        >
                            <Eye className="w-3.5 h-3.5" /> Preview
                        </button>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-500 hover:shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all disabled:opacity-70 flex items-center gap-2"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span className="hidden sm:inline">{saving ? 'Saving...' : 'Save'}</span>
                    </button>
                </div>
            </div>

            {/* Editor + Preview */}
            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row relative">
                {/* Edit panel */}
                <div className={`${mobileTab === 'edit' ? 'flex' : 'hidden'} lg:flex flex-1 lg:w-1/2 overflow-y-auto border-r border-zinc-800 bg-zinc-950 shadow-inner`}>
                    <div className="w-full">
                        <ResumeForm data={data} setData={setData} sessionToken={sessionToken} />
                    </div>
                </div>

                {/* Preview panel */}
                <div className={`${mobileTab === 'preview' ? 'flex' : 'hidden'} lg:flex flex-1 lg:w-1/2 overflow-y-auto bg-zinc-900 p-4 lg:p-8 justify-center`}>
                    <ResumePreview data={data} />
                </div>
            </div>
        </div>
    );
}
