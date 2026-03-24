'use client';

import { useState } from 'react';
import { ResumeData } from '@/types/resume';
import { Sparkles, CheckCircle2, AlertCircle, Info, Send, Loader2, Gauge } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Props {
    data: ResumeData;
}

export default function ATSChecker({ data }: Props) {
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleCheck = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/ats-check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeData: data, jobDescription })
            });
            const dataResult = await res.json();
            if (dataResult.error) throw new Error(dataResult.error);
            setResult(dataResult);
            toast.success('ATS Analysis Complete!');
        } catch (err) {
            toast.error('Failed to run ATS check');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5';
        if (score >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-500/5';
        return 'text-rose-400 border-rose-500/30 bg-rose-500/5';
    };

    return (
        <div className="flex flex-col h-full bg-zinc-950/40 backdrop-blur-xl border-l border-white/5">
            <div className="p-6 border-b border-white/5 shrink-0">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-indigo-400" />
                    ATS Checker
                </h2>
                <p className="text-xs text-zinc-500 mt-1">AI-powered compatibility analysis for your resume</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {/* Input Area */}
                {!result && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                Target Job Description (Optional)
                            </label>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the job description here for a tailored ATS matching score..."
                                className="form-input w-full min-h-[200px] resize-none text-xs leading-relaxed"
                            />
                            <p className="text-[10px] text-zinc-500 italic"> Providing a job description allows the AI to check for specific keyword matching.</p>
                        </div>
                        
                        <button
                            onClick={handleCheck}
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                            Run ATS Analysis
                        </button>
                    </div>
                )}

                {/* Results Screen */}
                {result && (
                    <div className="space-y-8 pb-4">
                        {/* Overall Score Circle */}
                        <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-zinc-900/50 border border-white/5 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative">
                                <svg className="w-32 h-32 transform -rotate-90">
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="58"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        className="text-zinc-800"
                                    />
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="58"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray={364.4}
                                        strokeDashoffset={364.4 - (364.4 * result.score) / 100}
                                        className={`transition-all duration-1000 ease-out stroke-linecap-round ${result.score >= 80 ? 'text-emerald-500' : result.score >= 50 ? 'text-amber-500' : 'text-rose-500'}`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black text-white">{result.score}</span>
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">ATS Score</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setResult(null)} 
                                className="mt-8 text-xs font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest border-b border-transparent hover:border-zinc-500"
                            >
                                Reset & Re-check
                            </button>
                        </div>

                        {/* Analysis Grid */}
                        <div className="grid grid-cols-1 gap-4">
                            {Object.entries(result.analysis || {}).map(([key, value]: [string, any]) => (
                                <div key={key} className={`p-4 rounded-2xl border ${getScoreColor(value.score)}`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-xs font-black uppercase tracking-wider">{key}</h4>
                                        <span className="text-xs font-bold">{value.score}%</span>
                                    </div>
                                    <p className="text-[11px] leading-relaxed mb-3 opacity-80">{value.feedback}</p>
                                    {value.missing && value.missing.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-current/10">
                                            {value.missing.map((token: string) => (
                                                <span key={token} className="px-2 py-0.5 bg-current/10 rounded-md text-[9px] font-bold">-{token}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Suggestions */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-500" />
                                Critical Suggestions
                            </h4>
                            <div className="space-y-2">
                                {result.suggestions?.map((suggestion: string, i: number) => (
                                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-zinc-900/30 border border-white/5 text-[11px] leading-relaxed text-zinc-400">
                                        <div className="shrink-0 w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500">{i+1}</div>
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
