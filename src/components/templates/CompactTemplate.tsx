import { ResumeData } from '@/types/resume';

interface Props {
    data: ResumeData;
}

export default function CompactTemplate({ data }: Props) {
    return (
        <div className="bg-white w-full h-full text-slate-900 flex flex-col font-sans p-6 text-[11px] leading-tight">
            {/* Header */}
            <header className="flex justify-between items-end border-b-2 border-slate-800 pb-2 mb-3">
                <div>
                    <h1 className="text-3xl font-extrabold uppercase tracking-tight text-slate-900 leading-none m-0 p-0">
                        {data.personalInfo.fullName || 'YOUR NAME'}
                    </h1>
                </div>
                <div className="text-right text-[10px] text-slate-600 space-y-0.5">
                    {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
                    {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
                    {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
                    {data.personalInfo.website && <div><a href={data.personalInfo.website} className="text-blue-600">{data.personalInfo.website}</a></div>}
                </div>
            </header>

            <div className="flex-1 grid grid-cols-12 gap-4">
                {/* Left Column - Main Content */}
                <div className="col-span-8 space-y-3">
                    {/* Summary */}
                    {data.summary && (
                        <section>
                            <h2 className="text-[12px] font-bold uppercase tracking-wide text-slate-900 mb-1 border-b border-slate-200">Summary</h2>
                            <p className="text-slate-700 text-justify">
                                {data.summary}
                            </p>
                        </section>
                    )}

                    {/* Experience */}
                    {data.experience.length > 0 && (
                        <section>
                            <h2 className="text-[12px] font-bold uppercase tracking-wide text-slate-900 mb-2 border-b border-slate-200">Experience</h2>
                            <div className="space-y-3">
                                {data.experience.map((exp) => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="font-bold text-slate-900 text-[12px]">{exp.position}</h3>
                                            <span className="font-semibold text-slate-500 text-[10px]">
                                                {exp.startDate} {exp.endDate ? `— ${exp.endDate}` : ''}
                                            </span>
                                        </div>
                                        <div className="font-semibold text-slate-700 mb-1">
                                            {exp.company}
                                        </div>
                                        <div className="whitespace-pre-wrap ml-2 text-slate-600 list-disc list-outside">
                                            {exp.description}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Projects */}
                    {data.projects && data.projects.length > 0 && (
                        <section>
                            <h2 className="text-[12px] font-bold uppercase tracking-wide text-slate-900 mb-2 border-b border-slate-200">Projects</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {data.projects.map((proj) => (
                                    <div key={proj.id} className="relative pl-2 border-l-2 border-slate-300">
                                        <div className="flex items-baseline gap-1">
                                            <h3 className="font-bold text-slate-900 text-[11px]">{proj.name}</h3>
                                            {proj.link && <a href={proj.link} className="text-[9px] text-blue-600">[Link]</a>}
                                        </div>
                                        <div className="whitespace-pre-wrap text-[10px] text-slate-600 mt-0.5">
                                            {proj.description}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Right Column - Secondary Content */}
                <div className="col-span-4 space-y-3 border-l border-slate-200 pl-4 bg-slate-50 -my-6 py-6 pr-6 -mr-6">
                    {/* Education */}
                    {data.education.length > 0 && (
                        <section>
                            <h2 className="text-[12px] font-bold uppercase tracking-wide text-slate-900 mb-2 border-b border-slate-300 pb-0.5">Education</h2>
                            <div className="space-y-3">
                                {data.education.map((edu) => (
                                    <div key={edu.id}>
                                        <h3 className="font-bold text-slate-900 text-[11px] leading-tight mb-0.5">{edu.degree}</h3>
                                        <div className="text-slate-700 text-[10px] italic">{edu.school}</div>
                                        <div className="font-semibold text-slate-500 text-[9px] mt-0.5">
                                            {edu.startDate} {edu.endDate ? `— ${edu.endDate}` : ''}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills */}
                    {data.skills && (
                        <section>
                            <h2 className="text-[12px] font-bold uppercase tracking-wide text-slate-900 mb-2 border-b border-slate-300 pb-0.5">Skills</h2>
                            <p className="text-slate-700">
                                {data.skills}
                            </p>
                        </section>
                    )}

                    {/* Certifications */}
                    {data.certifications && data.certifications.length > 0 && (
                        <section>
                            <h2 className="text-[12px] font-bold uppercase tracking-wide text-slate-900 mb-2 border-b border-slate-300 pb-0.5">Certifications</h2>
                            <div className="space-y-2">
                                {data.certifications.map((cert) => (
                                    <div key={cert.id} className="leading-tight">
                                        <span className="font-bold text-slate-900 block text-[10px]">{cert.name}</span>
                                        <span className="text-slate-600 text-[9px]">{cert.issuer} • {cert.date}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
