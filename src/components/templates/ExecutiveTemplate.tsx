import { ResumeData } from '@/types/resume';

interface Props {
    data: ResumeData;
}

export default function ExecutiveTemplate({ data }: Props) {
    return (
        <div className="bg-[#fbfcfa] w-full h-full text-slate-900 flex flex-col font-serif px-10 py-12">
            {/* Header */}
            <header className="mb-8 text-center border-b-2 border-slate-900 pb-6">
                <h1 className="text-4xl font-bold uppercase tracking-widest text-slate-900 mb-3">
                    {data.personalInfo.fullName || 'YOUR NAME'}
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-widest font-sans text-slate-700 font-semibold">
                    {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                    {data.personalInfo.location && <span className="text-slate-400">•</span>}

                    {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                    {data.personalInfo.phone && <span className="text-slate-400">•</span>}

                    {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                    {data.personalInfo.website && <span className="text-slate-400">•</span>}

                    {data.personalInfo.website && <a href={data.personalInfo.website} className="hover:text-slate-900 transition-colors">{data.personalInfo.website}</a>}
                </div>
            </header>

            {/* Main Content Area */}
            <main className="space-y-6">
                {/* Executive Summary */}
                {data.summary && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-3 font-sans border-b border-slate-300 pb-1">
                            Executive Profile
                        </h2>
                        <p className="text-sm text-slate-800 leading-relaxed text-justify">
                            {data.summary}
                        </p>
                    </section>
                )}

                {/* Core Competencies (Skills) */}
                {data.skills && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-3 font-sans border-b border-slate-300 pb-1">
                            Core Competencies
                        </h2>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-800 font-sans">
                            {data.skills.split(',').map((skill, index) => (
                                <div key={index} className="flex items-center gap-2 w-1/4">
                                    <div className="w-1 h-1 bg-slate-900 rounded-full"></div>
                                    <span>{skill.trim()}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Professional Experience */}
                {data.experience.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-4 font-sans border-b border-slate-300 pb-1">
                            Professional Experience
                        </h2>
                        <div className="space-y-6">
                            {data.experience.map((exp) => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-end mb-1">
                                        <h3 className="font-bold text-slate-900 text-[15px] uppercase tracking-wide">
                                            {exp.company}
                                        </h3>
                                        <span className="text-xs font-bold font-sans text-slate-600 uppercase tracking-wider">
                                            {exp.startDate} {exp.endDate ? `— ${exp.endDate}` : ''}
                                        </span>
                                    </div>
                                    <div className="text-[13px] font-bold font-sans italic text-slate-700 mb-2">
                                        {exp.position}
                                    </div>
                                    <div className="text-[13px] text-slate-800 leading-relaxed whitespace-pre-wrap ml-2 list-disc list-outside">
                                        {exp.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {data.education.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-4 font-sans border-b border-slate-300 pb-1">
                            Education
                        </h2>
                        <div className="space-y-4">
                            {data.education.map((edu) => (
                                <div key={edu.id} className="flex justify-between items-baseline">
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">{edu.school}</h3>
                                        <div className="text-[13px] text-slate-800 italic">{edu.degree}</div>
                                    </div>
                                    <div className="text-xs font-bold font-sans text-slate-600 uppercase tracking-wider">
                                        {edu.startDate} {edu.endDate ? `— ${edu.endDate}` : ''}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Certifications (Affiliations) */}
                {data.certifications && data.certifications.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-3 font-sans border-b border-slate-300 pb-1">
                            Professional Affiliations
                        </h2>
                        <div className="space-y-2">
                            {data.certifications.map((cert) => (
                                <div key={cert.id} className="text-[13px] text-slate-800 flex justify-between">
                                    <span className="font-semibold">{cert.name} <span className="font-normal italic text-slate-600 ml-1">— {cert.issuer}</span></span>
                                    <span className="font-sans font-medium text-xs text-slate-500">{cert.date}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
