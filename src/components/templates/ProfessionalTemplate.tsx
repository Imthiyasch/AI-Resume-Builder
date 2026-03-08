import { ResumeData } from '@/types/resume';

interface Props {
    data: ResumeData;
}

export default function ProfessionalTemplate({ data }: Props) {
    return (
        <div className="bg-white w-full h-full text-slate-900 flex flex-col font-serif">
            {/* Header */}
            <div className="text-left mb-8 flex justify-between items-end border-b-4 border-slate-900 pb-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-none mb-2">
                        {data.personalInfo.fullName || 'YOUR NAME'}
                    </h1>
                </div>
                <div className="text-right text-sm text-slate-700 font-sans flex flex-col gap-0.5">
                    {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                    {data.personalInfo.website && <a href={data.personalInfo.website} className="text-blue-700">{data.personalInfo.website}</a>}
                    {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                </div>
            </div>

            <div className="flex-1 grid grid-cols-12 gap-8">
                {/* Left Column - Main Details */}
                <div className="col-span-8 space-y-6">
                    {/* Summary */}
                    {data.summary && (
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2 font-sans tracking-wide uppercase">Profile</h2>
                            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                                {data.summary}
                            </p>
                        </div>
                    )}

                    {/* Experience */}
                    {data.experience.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-4 font-sans tracking-wide uppercase">Experience</h2>
                            <div className="space-y-5">
                                {data.experience.map((exp) => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h3 className="font-bold text-slate-900 text-lg">{exp.position}</h3>
                                            <span className="text-sm font-semibold text-slate-600 font-sans">
                                                {exp.startDate} {exp.endDate ? `— ${exp.endDate}` : ''}
                                            </span>
                                        </div>
                                        <div className="text-sm font-medium text-slate-700 mb-2">
                                            {exp.company}
                                        </div>
                                        <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap list-disc list-inside">
                                            {exp.description}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Side Details */}
                <div className="col-span-4 space-y-6">
                    {/* Skills */}
                    {data.skills && (
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 mb-2 font-sans tracking-wide uppercase border-t-2 border-slate-900 pt-2 lg:border-t-0 lg:pt-0">Expertise</h2>
                            <p className="text-sm text-slate-700 leading-relaxed font-sans">
                                {data.skills.split(',').map((skill, i) => (
                                    <span key={i} className="block mb-1">• {skill.trim()}</span>
                                ))}
                            </p>
                        </div>
                    )}

                    {/* Education */}
                    {data.education.length > 0 && (
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 mb-3 font-sans tracking-wide uppercase border-t-2 border-slate-900 pt-2">Education</h2>
                            <div className="space-y-4">
                                {data.education.map((edu) => (
                                    <div key={edu.id}>
                                        <h3 className="font-bold text-slate-900 text-sm">{edu.degree}</h3>
                                        <div className="text-sm text-slate-700 italic">{edu.school}</div>
                                        <div className="text-xs font-semibold text-slate-500 font-sans mt-0.5">
                                            {edu.startDate} {edu.endDate ? `— ${edu.endDate}` : ''}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Certifications */}
                    {data.certifications && data.certifications.length > 0 && (
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 mb-3 font-sans tracking-wide uppercase border-t-2 border-slate-900 pt-2">Certs</h2>
                            <div className="space-y-3">
                                {data.certifications.map((cert) => (
                                    <div key={cert.id} className="text-sm">
                                        <span className="font-bold text-slate-900 block">{cert.name}</span>
                                        <span className="text-slate-600 text-xs font-sans">{cert.issuer} ({cert.date})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Projects Full Width */}
            {data.projects && data.projects.length > 0 && (
                <div className="mt-6 border-t border-slate-300 pt-4">
                    <h2 className="text-xl font-bold text-slate-900 mb-3 font-sans tracking-wide uppercase">Notable Projects</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {data.projects.map((proj) => (
                            <div key={proj.id} className="text-sm">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <h3 className="font-bold text-slate-900">{proj.name}</h3>
                                    {proj.link && (
                                        <a href={proj.link} className="text-xs text-blue-700 font-sans">
                                            Link
                                        </a>
                                    )}
                                </div>
                                <div className="text-slate-700 leading-relaxed font-sans text-xs">
                                    {proj.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
