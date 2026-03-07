'use client';

import { ResumeData } from '@/types/resume';
import { useState } from 'react';
import { Sparkles, Plus, Trash2 } from 'lucide-react';

interface Props {
    data: ResumeData;
    setData: (data: ResumeData) => void;
    sessionToken: string;
}

export default function ResumeForm({ data, setData, sessionToken }: Props) {
    const [loadingAI, setLoadingAI] = useState<string | null>(null);

    const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            personalInfo: { ...data.personalInfo, [e.target.name]: e.target.value }
        });
    };

    const generateAI = async (fieldId: string, promptInfo: string, currentContent: string, onUpdate: (newContent: string) => void) => {
        setLoadingAI(fieldId);
        try {
            const res = await fetch('/api/generate-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: promptInfo, content: currentContent })
            });
            const result = await res.json();
            if (result.improvedContent) {
                onUpdate(result.improvedContent);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingAI(null);
        }
    };

    const handleGenerateSummary = () => {
        generateAI(
            'summary',
            `Generate a professional summary for someone with these skills: ${data.skills || ''}. Job title: ${data.title || ''}.`,
            data.summary,
            (newContent) => setData({ ...data, summary: newContent })
        );
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

    return (
        <div className="p-6 sm:p-8 space-y-10 max-w-3xl mx-auto text-zinc-100">
            {/* Personal Information */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-2">Personal Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input name="fullName" placeholder="Full Name" value={data.personalInfo.fullName} onChange={handlePersonalChange} className="form-input" />
                    <input name="email" placeholder="Email Address" value={data.personalInfo.email} onChange={handlePersonalChange} className="form-input" />
                    <input name="phone" placeholder="Phone Number" value={data.personalInfo.phone} onChange={handlePersonalChange} className="form-input" />
                    <input name="location" placeholder="Location (City, State)" value={data.personalInfo.location} onChange={handlePersonalChange} className="form-input" />
                    <input name="website" placeholder="LinkedIn or Portfolio URL" value={data.personalInfo.website} onChange={handlePersonalChange} className="form-input sm:col-span-2" />
                </div>
            </section>

            {/* Professional Summary */}
            <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <h2 className="text-xl font-bold text-white">Professional Summary</h2>
                    <button
                        type="button"
                        onClick={handleGenerateSummary}
                        disabled={loadingAI === 'summary'}
                        className="flex items-center gap-1.5 text-sm font-medium text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition-colors"
                    >
                        <Sparkles className="w-4 h-4" />
                        {loadingAI === 'summary' ? 'Writing...' : 'Rewrite with AI'}
                    </button>
                </div>
                <textarea
                    rows={4}
                    placeholder="Briefly describe your professional background and goals..."
                    value={data.summary}
                    onChange={(e) => setData({ ...data, summary: e.target.value })}
                    className="form-input w-full resize-y"
                />
            </section>

            {/* Work Experience */}
            <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <h2 className="text-xl font-bold text-white">Work Experience</h2>
                    <button
                        type="button"
                        onClick={() => addArrayItem('experience', { company: '', position: '', startDate: '', endDate: '', description: '' })}
                        className="flex items-center gap-1 text-sm font-medium text-indigo-400 hover:bg-indigo-900/30 hover:text-indigo-300 px-3 py-1.5 rounded transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </div>

                {data.experience.map((exp) => (
                    <div key={exp.id} className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4 group">
                        <button
                            onClick={() => removeArrayItem('experience', exp.id)}
                            className="absolute top-4 right-4 text-zinc-600 hover:text-red-400 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-6">
                            <input placeholder="Job Title" value={exp.position} onChange={(e) => updateArrayItem('experience', exp.id, 'position', e.target.value)} className="form-input font-medium" />
                            <input placeholder="Company Name" value={exp.company} onChange={(e) => updateArrayItem('experience', exp.id, 'company', e.target.value)} className="form-input" />
                            <input placeholder="Start Date (e.g. MM/YYYY)" value={exp.startDate} onChange={(e) => updateArrayItem('experience', exp.id, 'startDate', e.target.value)} className="form-input" />
                            <input placeholder="End Date (e.g. Present)" value={exp.endDate} onChange={(e) => updateArrayItem('experience', exp.id, 'endDate', e.target.value)} className="form-input" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-zinc-400">Description / Achievements</span>
                                <button
                                    type="button"
                                    onClick={() => generateAI(`exp-${exp.id}`, `Rewrite bullet points for a ${exp.position} at ${exp.company} focusing on impact and metrics.`, exp.description, (newContent) => updateArrayItem('experience', exp.id, 'description', newContent))}
                                    disabled={loadingAI === `exp-${exp.id}`}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    {loadingAI === `exp-${exp.id}` ? 'Enhancing...' : 'Enhance phrasing'}
                                </button>
                            </div>
                            <textarea
                                rows={4}
                                placeholder="• Increased revenue by X%...&#10;• Led a team of Y...&#10;• Developed Z feature using... (Use bullet points)"
                                value={exp.description}
                                onChange={(e) => updateArrayItem('experience', exp.id, 'description', e.target.value)}
                                className="form-input w-full"
                            />
                        </div>
                    </div>
                ))}
            </section>

            {/* Education */}
            <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <h2 className="text-xl font-bold text-white">Education</h2>
                    <button
                        type="button"
                        onClick={() => addArrayItem('education', { school: '', degree: '', startDate: '', endDate: '' })}
                        className="flex items-center gap-1 text-sm font-medium text-indigo-400 hover:bg-indigo-900/30 hover:text-indigo-300 px-3 py-1.5 rounded transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </div>
                {data.education.map((edu) => (
                    <div key={edu.id} className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 group">
                        <button
                            onClick={() => removeArrayItem('education', edu.id)}
                            className="absolute top-4 right-4 text-zinc-600 hover:text-red-400 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <input placeholder="Degree (e.g. B.S. Computer Science)" value={edu.degree} onChange={(e) => updateArrayItem('education', edu.id, 'degree', e.target.value)} className="form-input font-medium pr-8 sm:col-span-2" />
                        <input placeholder="School/University" value={edu.school} onChange={(e) => updateArrayItem('education', edu.id, 'school', e.target.value)} className="form-input sm:col-span-2" />
                        <input placeholder="Start Date" value={edu.startDate} onChange={(e) => updateArrayItem('education', edu.id, 'startDate', e.target.value)} className="form-input" />
                        <input placeholder="End Date (or Expected)" value={edu.endDate} onChange={(e) => updateArrayItem('education', edu.id, 'endDate', e.target.value)} className="form-input" />
                    </div>
                ))}
            </section>

            {/* Projects */}
            <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <h2 className="text-xl font-bold text-white">Projects</h2>
                    <button
                        type="button"
                        onClick={() => addArrayItem('projects', { name: '', description: '', link: '' })}
                        className="flex items-center gap-1 text-sm font-medium text-indigo-400 hover:bg-indigo-900/30 hover:text-indigo-300 px-3 py-1.5 rounded transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </div>
                {data.projects && data.projects.map((proj) => (
                    <div key={proj.id} className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4 group">
                        <button
                            onClick={() => removeArrayItem('projects', proj.id)}
                            className="absolute top-4 right-4 text-zinc-600 hover:text-red-400 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-6">
                            <input placeholder="Project Name" value={proj.name} onChange={(e) => updateArrayItem('projects', proj.id, 'name', e.target.value)} className="form-input font-medium" />
                            <input placeholder="Project Link (Optional)" value={proj.link} onChange={(e) => updateArrayItem('projects', proj.id, 'link', e.target.value)} className="form-input" />
                        </div>
                        <textarea
                            rows={3}
                            placeholder="Project description and technologies used..."
                            value={proj.description}
                            onChange={(e) => updateArrayItem('projects', proj.id, 'description', e.target.value)}
                            className="form-input w-full"
                        />
                    </div>
                ))}
            </section>

            {/* Certifications */}
            <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <h2 className="text-xl font-bold text-white">Certifications</h2>
                    <button
                        type="button"
                        onClick={() => addArrayItem('certifications', { name: '', issuer: '', date: '' })}
                        className="flex items-center gap-1 text-sm font-medium text-indigo-400 hover:bg-indigo-900/30 hover:text-indigo-300 px-3 py-1.5 rounded transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </div>
                {data.certifications && data.certifications.map((cert) => (
                    <div key={cert.id} className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 group">
                        <button
                            onClick={() => removeArrayItem('certifications', cert.id)}
                            className="absolute top-4 right-4 text-zinc-600 hover:text-red-400 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <input placeholder="Certification Name" value={cert.name} onChange={(e) => updateArrayItem('certifications', cert.id, 'name', e.target.value)} className="form-input font-medium pr-8 sm:col-span-2" />
                        <input placeholder="Issuer (e.g. AWS, Microsoft)" value={cert.issuer} onChange={(e) => updateArrayItem('certifications', cert.id, 'issuer', e.target.value)} className="form-input" />
                        <input placeholder="Date Issued" value={cert.date} onChange={(e) => updateArrayItem('certifications', cert.id, 'date', e.target.value)} className="form-input" />
                    </div>
                ))}
            </section>

            {/* Skills */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-2">Skills</h2>
                <textarea
                    rows={3}
                    placeholder="e.g. JavaScript, React, Node.js, Project Management, Agile (comma separated)"
                    value={data.skills}
                    onChange={(e) => setData({ ...data, skills: e.target.value })}
                    className="form-input w-full"
                />
            </section>

            <style jsx global>{`
        .form-input {
          @apply w-full px-4 py-2.5 rounded-lg border border-white/10 bg-black/40 text-white placeholder-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:bg-black/60 shadow-inner backdrop-blur-md transition-all;
        }
        
        section {
            @apply relative z-10;
        }
        
        h2 {
           @apply drop-shadow-sm;
        }
        
        .border-b {
           @apply border-white/10;
        }
        
        .bg-zinc-900 {
           @apply bg-white/5 border-white/10 backdrop-blur-md shadow-lg hover:border-pink-400/30 transition-all;
        }
      `}</style>
        </div>
    );
}
