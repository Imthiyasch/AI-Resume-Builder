'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { ResumeData, defaultResumeData } from '@/types/resume';
import ResumeForm from '@/components/ResumeForm';
import ResumePreview from '@/components/ResumePreview';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function ResumeEditor() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [data, setData] = useState<ResumeData>(defaultResumeData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [sessionToken, setSessionToken] = useState('');

    useEffect(() => {
        const fetchResume = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }
            setSessionToken(session.access_token);

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

                if (resumeData && resumeData.content) {
                    setData({ ...defaultResumeData, ...resumeData.content, title: resumeData.title });
                }
            } catch (err) {
                console.error('Failed to load resume', err);
            } finally {
                setLoading(false);
            }
        };

        fetchResume();
    }, [id, router]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/save-resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionToken}`
                },
                body: JSON.stringify({
                    id,
                    title: data.title || 'Untitled Resume',
                    content: data
                })
            });
            const result = await res.json();
            if (result.resume && id === 'new') {
                router.push(`/resume/${result.resume.id}`);
            }
        } catch (err) {
            console.error('Save failed', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-black">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-black">
            <div className="bg-zinc-950 border-b border-zinc-800 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-zinc-500 hover:text-white transition-colors p-2 rounded-full hover:bg-zinc-900">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData({ ...data, title: e.target.value })}
                        className="text-lg font-bold text-white bg-transparent border-transparent focus:border-indigo-500 focus:ring-indigo-500 rounded-md px-3 py-1.5 w-48 sm:w-64 hover:bg-zinc-900 transition-colors"
                        placeholder="Resume Title"
                    />
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-500 hover:shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all disabled:opacity-70 flex items-center gap-2"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span className="hidden sm:inline">{saving ? 'Saving...' : 'Save'}</span>
                </button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row relative">
                <div className="flex-1 lg:w-1/2 overflow-y-auto border-r border-zinc-800 bg-zinc-950 shadow-inner custom-scrollbar">
                    <ResumeForm data={data} setData={setData} sessionToken={sessionToken} />
                </div>
                <div className="flex-1 lg:w-1/2 overflow-y-auto bg-zinc-900 p-4 lg:p-8 flex justify-center custom-scrollbar">
                    {/* Note: ResumePreview itself implies paper and usually stays white. */}
                    <ResumePreview data={data} />
                </div>
            </div>
        </div>
    );
}
