'use client';

import { ResumeData } from '@/types/resume';
import { useState } from 'react';
import { Sparkles, Plus, Trash2, ChevronLeft, ChevronRight, User, Briefcase, GraduationCap, Code, Layout, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Props {
    data: ResumeData;
    setData: (data: ResumeData) => void;
    sessionToken: string;
}

const steps = [
    { id: 'templates', title: 'Layout', icon: Layout },
    { id: 'personal', title: 'Personal', icon: User },
    { id: 'experience', title: 'Experience', icon: Briefcase },
    { id: 'education', title: 'Education', icon: GraduationCap },
    { id: 'skills', title: 'Skills', icon: Code },
];

export default function ResumeForm({ data, setData, sessionToken }: Props) {
    const [currentStep, setCurrentStep] = useState(0);
    const [loadingAI, setLoadingAI] = useState<string | null>(null);

    const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setData({
            ...data,
            personalInfo: { ...data.personalInfo, [e.target.name]: e.target.value }
        });
    };

    const generateAI = async (fieldId: string, promptInfo: string, currentContent: string, onUpdate: (newContent: string) => void) => {
        if (loadingAI) return; // Prevent duplicate requests
        setLoadingAI(fieldId);
        const toastId = toast.loading('AI is rewriting... ✨');
        try {
            const res = await fetch('/api/generate-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: promptInfo, content: currentContent })
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'AI request failed');
            if (result.improvedContent) {
                onUpdate(result.improvedContent.trim());
                toast.success('Content enhanced by AI!', { id: toastId });
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'AI enhancement failed', { id: toastId });
            console.error(err);
        } finally {
            setLoadingAI(null);
        }
    };

    const addArrayItem = (key: keyof ResumeData, defaultItem: any) => {
        setData({
            ...data,
            [key]: [...(data[key] as any[] || []), { id: crypto.randomUUID(), ...defaultItem }]
        });
    };

    const updateArrayItem = (key: keyof ResumeData, id: string, field: string, value: string) => {
        const list = data[key] as any[] || [];
        setData({
            ...data,
            [key]: list.map(item => item.id === id ? { ...item, [field]: value } : item)
        });
    };

    const removeArrayItem = (key: keyof ResumeData, id: string) => {
        const list = data[key] as any[] || [];
        setData({
            ...data,
            [key]: list.filter(item => item.id !== id)
        });
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 0, 0));

    const renderStep = () => {
        const step = steps[currentStep].id;

        switch (step) {
            case 'templates':
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            {['modern', 'professional', 'minimalist', 'creative', 'executive', 'tech', 'elegant', 'compact', 'bold', 'startup'].map((tpl) => (
                                <button
                                    key={tpl}
                                    type="button"
                                    onClick={() => setData({ ...data, templateId: tpl })}
                                    className={`relative p-4 rounded-2xl text-left border-2 transition-all overflow-hidden group ${data.templateId === tpl
                                            ? 'border-indigo-500 bg-indigo-500/10'
                                            : 'border-white/5 bg-zinc-900/50 hover:border-white/20'
                                        }`}
                                >
                                    <div className="font-bold text-white capitalize mb-1">{tpl}</div>
                                    <div className="text-xs text-zinc-500 line-clamp-1">Professional layout for {tpl} style.</div>
                                    {data.templateId === tpl && (
                                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                );

            case 'personal':
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-zinc-400">Full Name</label>
                                <input name="fullName" value={data.personalInfo.fullName} onChange={handlePersonalChange} className="form-input" placeholder="John Doe" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-zinc-400">Email Address</label>
                                <input name="email" value={data.personalInfo.email} onChange={handlePersonalChange} className="form-input" placeholder="john@example.com" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-zinc-400">Phone Number</label>
                                <input name="phone" value={data.personalInfo.phone} onChange={handlePersonalChange} className="form-input" placeholder="+1 234 567 890" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-zinc-400">Location</label>
                                <input name="location" value={data.personalInfo.location} onChange={handlePersonalChange} className="form-input" placeholder="New York, NY" />
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-sm font-semibold text-zinc-400">Website / Portfolio</label>
                                <input name="website" value={data.personalInfo.website} onChange={handlePersonalChange} className="form-input" placeholder="https://portfolio.com" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-zinc-400">Professional Summary</label>
                                <button
                                    type="button"
                                    onClick={() => generateAI('summary', `Create a professional summary for: ${data.personalInfo.fullName}. Skills: ${data.skills}.`, data.summary, (res) => setData({ ...data, summary: res }))}
                                    disabled={!!loadingAI}
                                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors disabled:opacity-50"
                                >
                                    {loadingAI === 'summary' ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-3.5 h-3.5" />
                                    )}
                                    {loadingAI === 'summary' ? 'Writing...' : 'AI Rewrite'}
                                </button>
                            </div>
                            <textarea
                                rows={5}
                                value={data.summary}
                                onChange={(e) => setData({ ...data, summary: e.target.value })}
                                className="form-input w-full resize-none"
                                placeholder="Write a brief professional summary..."
                            />
                        </div>
                    </motion.div>
                );

            case 'experience':
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {data.experience.map((exp, idx) => (
                            <div key={exp.id} className="p-5 rounded-2xl bg-zinc-900/50 border border-white/5 relative group">
                                <button
                                    onClick={() => removeArrayItem('experience', exp.id)}
                                    className="absolute top-4 right-4 text-zinc-600 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <input placeholder="Job Title" value={exp.position} onChange={(e) => updateArrayItem('experience', exp.id, 'position', e.target.value)} className="form-input font-bold" />
                                    <input placeholder="Company" value={exp.company} onChange={(e) => updateArrayItem('experience', exp.id, 'company', e.target.value)} className="form-input" />
                                    <input placeholder="Start Date" value={exp.startDate} onChange={(e) => updateArrayItem('experience', exp.id, 'startDate', e.target.value)} className="form-input text-sm" />
                                    <input placeholder="End Date" value={exp.endDate} onChange={(e) => updateArrayItem('experience', exp.id, 'endDate', e.target.value)} className="form-input text-sm" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-xs font-bold text-zinc-500 uppercase">Achievements</span>
                                        <button
                                            onClick={() => generateAI(`exp-${exp.id}`, `Rewrite bullet points for ${exp.position} at ${exp.company}.`, exp.description, (res) => updateArrayItem('experience', exp.id, 'description', res))}
                                            disabled={!!loadingAI}
                                            className="flex items-center gap-1 text-xs text-indigo-400 font-bold disabled:opacity-50"
                                        >
                                            {loadingAI === `exp-${exp.id}` ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : (
                                                <Sparkles className="w-3 h-3" />
                                            )}
                                            {loadingAI === `exp-${exp.id}` ? 'Enhancing...' : 'AI Enhance'}
                                        </button>
                                    </div>
                                    <textarea
                                        rows={3}
                                        value={exp.description}
                                        onChange={(e) => updateArrayItem('experience', exp.id, 'description', e.target.value)}
                                        className="form-input w-full text-sm resize-none"
                                        placeholder="• Accomplished X using Y resulting in Z"
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={() => addArrayItem('experience', { company: '', position: '', startDate: '', endDate: '', description: '' })}
                            className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-zinc-500 hover:border-indigo-500/50 hover:text-indigo-400 transition-all flex items-center justify-center gap-2 group"
                        >
                            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Add Experience
                        </button>
                    </motion.div>
                );

            case 'education':
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {data.education.map((edu) => (
                            <div key={edu.id} className="p-5 rounded-2xl bg-zinc-900/50 border border-white/5 relative">
                                <button
                                    onClick={() => removeArrayItem('education', edu.id)}
                                    className="absolute top-4 right-4 text-zinc-600 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="space-y-3">
                                    <input placeholder="Degree / Major" value={edu.degree} onChange={(e) => updateArrayItem('education', edu.id, 'degree', e.target.value)} className="form-input font-bold" />
                                    <input placeholder="School / University" value={edu.school} onChange={(e) => updateArrayItem('education', edu.id, 'school', e.target.value)} className="form-input text-zinc-400" />
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        <input placeholder="Start Year" value={edu.startDate} onChange={(e) => updateArrayItem('education', edu.id, 'startDate', e.target.value)} className="form-input text-sm" />
                                        <input placeholder="End Year" value={edu.endDate} onChange={(e) => updateArrayItem('education', edu.id, 'endDate', e.target.value)} className="form-input text-sm" />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={() => addArrayItem('education', { school: '', degree: '', startDate: '', endDate: '' })}
                            className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-zinc-500 hover:border-indigo-500/50 hover:text-indigo-400 transition-all flex items-center justify-center gap-2 group"
                        >
                            <Plus className="w-5 h-5" />
                            Add Education
                        </button>
                    </motion.div>
                );

            case 'skills':
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Top Skills</label>
                            <textarea
                                rows={4}
                                value={data.skills}
                                onChange={(e) => setData({ ...data, skills: e.target.value })}
                                className="form-input w-full resize-none"
                                placeholder="React, TypeScript, Node.js, AWS, UI/UX Design..."
                            />
                            <p className="text-[10px] text-zinc-500">Separate skills with commas.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Certifications</label>
                                <button
                                    onClick={() => addArrayItem('certifications', { name: '', issuer: '', date: '' })}
                                    className="text-xs text-indigo-400 font-bold flex items-center gap-1"
                                >
                                    <Plus className="w-3 h-3" /> Add New
                                </button>
                            </div>
                            {data.certifications?.map(cert => (
                                <div key={cert.id} className="flex gap-2 items-start relative group">
                                    <input placeholder="Cert Name" value={cert.name} onChange={(e) => updateArrayItem('certifications', cert.id, 'name', e.target.value)} className="form-input text-xs h-10" />
                                    <input placeholder="Issuer" value={cert.issuer} onChange={(e) => updateArrayItem('certifications', cert.id, 'issuer', e.target.value)} className="form-input text-xs h-10 w-32" />
                                    <button onClick={() => removeArrayItem('certifications', cert.id)} className="p-2.5 text-zinc-600 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );
        }
    };

    return (
        <div className="flex flex-col h-full bg-black/40 backdrop-blur-3xl overflow-hidden relative">
            {/* Step Indicator */}
            <div className="px-6 py-6 border-b border-white/5 bg-black/20 shrink-0">
                <div className="flex justify-between relative max-w-sm mx-auto">
                    {steps.map((s, i) => {
                        const Icon = s.icon;
                        const active = i <= currentStep;
                        return (
                            <div key={s.id} className="flex flex-col items-center gap-2 relative z-10">
                                <button
                                    onClick={() => setCurrentStep(i)}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 shadow-lg ${i === currentStep
                                            ? 'bg-indigo-600 text-white scale-110'
                                            : active
                                                ? 'bg-indigo-900/40 text-indigo-400 border border-indigo-500/20'
                                                : 'bg-zinc-800 text-zinc-500 border border-transparent'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                </button>
                                <span className={`text-[10px] font-bold uppercase tracking-tighter ${i === currentStep ? 'text-white' : 'text-zinc-500'}`}>{s.title}</span>
                            </div>
                        );
                    })}
                    {/* Progress Line */}
                    <div className="absolute top-5 left-8 right-8 h-[2px] bg-zinc-800 z-0">
                        <motion.div
                            className="h-full bg-indigo-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar relative">
                <div className="max-w-2xl mx-auto">
                    <AnimatePresence mode="wait">
                        <div key={currentStep}>
                            {renderStep()}
                        </div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="px-6 py-4 border-t border-white/5 bg-black/40 flex justify-between items-center shrink-0">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white disabled:opacity-0 transition-all font-bold text-sm"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                </button>
                <div className="flex gap-2">
                    {currentStep < steps.length - 1 ? (
                        <button
                            onClick={nextStep}
                            className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-indigo-500 shadow-xl transition-all flex items-center gap-2"
                        >
                            Continue
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <div className="text-zinc-500 text-xs font-medium animate-pulse">Save to finalise your resume.</div>
                    )}
                </div>
            </div>

        </div>
    );
}
