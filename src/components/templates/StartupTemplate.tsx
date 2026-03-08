import { ResumeData } from '@/types/resume';

interface Props {
    data: ResumeData;
}

export default function StartupTemplate({ data }: Props) {
    return (
        <div className="bg-[#f8f9fa] w-full h-full text-[#343a40] flex flex-col font-sans p-10">
            {/* Header */}
            <header className="mb-10 flex flex-col items-center text-center">
                <div className="bg-[#4dabf7] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                    {data.title || 'Professional'}
                </div>
                <h1 className="text-5xl font-extrabold tracking-tight text-[#212529] mb-4">
                    {data.personalInfo.fullName || 'Your Name'}
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-4 text-[13px] font-medium text-[#868e96]">
                    {data.personalInfo.location && (
                        <span className="flex items-center gap-1">📍 {data.personalInfo.location}</span>
                    )}
                    {data.personalInfo.email && (
                        <span className="flex items-center gap-1">✉️ {data.personalInfo.email}</span>
                    )}
                    {data.personalInfo.phone && (
                        <span className="flex items-center gap-1">📱 {data.personalInfo.phone}</span>
                    )}
                    {data.personalInfo.website && (
                        <span className="flex items-center gap-1">🌐 <a href={data.personalInfo.website} className="text-[#4dabf7] hover:underline">{data.personalInfo.website}</a></span>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
                {/* Left Column (Sidebar) */}
                <div className="col-span-1 space-y-8 bg-white p-6 rounded-2xl shadow-sm border border-[#e9ecef]">
                    {/* Summary */}
                    {data.summary && (
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-[#adb5bd] mb-3">About Me</h2>
                            <p className="text-[14px] leading-relaxed text-[#495057] font-medium">
                                {data.summary}
                            </p>
                        </section>
                    )}

                    {/* Skills */}
                    {data.skills && (
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-[#adb5bd] mb-3">Toolkit</h2>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.split(',').map((skill, index) => (
                                    <span key={index} className="bg-[#e7f5ff] text-[#1971c2] px-3 py-1.5 rounded-lg text-[13px] font-semibold border border-[#d0ebff]">
                                        {skill.trim()}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {data.education.length > 0 && (
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-[#adb5bd] mb-4">Education</h2>
                            <div className="space-y-4">
                                {data.education.map((edu) => (
                                    <div key={edu.id} className="relative pl-4 border-l-2 border-[#dee2e6]">
                                        <div className="absolute w-2 h-2 bg-[#adb5bd] rounded-full -left-[5px] top-1.5"></div>
                                        <h3 className="font-bold text-[#343a40] text-sm leading-tight">{edu.degree}</h3>
                                        <div className="text-[13px] font-medium text-[#868e96] mt-0.5">{edu.school}</div>
                                        <div className="text-[11px] font-bold text-[#adb5bd] uppercase tracking-wider mt-1">
                                            {edu.startDate} {edu.endDate ? `— ${edu.endDate}` : ''}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Certifications & Badges */}
                    {data.certifications && data.certifications.length > 0 && (
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-[#adb5bd] mb-3">Badges</h2>
                            <div className="space-y-2">
                                {data.certifications.map((cert) => (
                                    <div key={cert.id} className="flex flex-col bg-[#f8f9fa] p-2 rounded-lg border border-[#e9ecef]">
                                        <span className="font-bold text-[#495057] text-[13px]">{cert.name}</span>
                                        <span className="text-[#868e96] text-[11px] font-medium">{cert.issuer} • {cert.date}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Right Column (Main) */}
                <div className="col-span-2 space-y-8">
                    {/* Experience */}
                    {data.experience.length > 0 && (
                        <section className="bg-white p-8 rounded-2xl shadow-sm border border-[#e9ecef]">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-[#4dabf7] mb-6 flex items-center gap-2">
                                <span>🚀</span> Experience
                            </h2>
                            <div className="space-y-8">
                                {data.experience.map((exp) => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-start mb-1">
                                            <div>
                                                <h3 className="font-extrabold text-[#212529] text-lg">{exp.company}</h3>
                                                <div className="text-[15px] font-semibold text-[#868e96] mb-2">{exp.position}</div>
                                            </div>
                                            <span className="bg-[#f1f3f5] text-[#868e96] px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                                                {exp.startDate} {exp.endDate ? `— ${exp.endDate}` : ''}
                                            </span>
                                        </div>
                                        <div className="text-[14px] text-[#495057] leading-relaxed whitespace-pre-wrap ml-1 pl-4 border-l-2 border-[#e9ecef]">
                                            {exp.description}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Projects / Products */}
                    {data.projects && data.projects.length > 0 && (
                        <section className="bg-white p-8 rounded-2xl shadow-sm border border-[#e9ecef]">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-[#4dabf7] mb-6 flex items-center gap-2">
                                <span>💡</span> Shipped Products
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                {data.projects.map((proj) => (
                                    <div key={proj.id} className="group border border-[#dee2e6] hover:border-[#4dabf7] p-5 rounded-xl transition-all">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-bold text-[#212529] text-base group-hover:text-[#4dabf7] transition-colors">{proj.name}</h3>
                                            {proj.link && (
                                                <a href={proj.link} className="text-[#adb5bd] hover:text-[#4dabf7] transition-colors">
                                                    🔗
                                                </a>
                                            )}
                                        </div>
                                        <div className="text-[14px] text-[#495057] leading-relaxed whitespace-pre-wrap">
                                            {proj.description}
                                        </div>
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
