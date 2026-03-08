import { ResumeData } from '@/types/resume';

interface Props {
    data: ResumeData;
}

export default function ElegantTemplate({ data }: Props) {
    return (
        <div className="bg-[#f9f8f6] w-full h-full text-[#2c3e50] flex flex-col font-serif px-12 py-10 border-[8px] border-double border-[#e8dccb]">
            {/* Header */}
            <header className="mb-10 text-center relative">
                <div className="absolute inset-x-0 bottom-[-20px] mx-auto w-24 h-px bg-[#d4af37]"></div>
                <h1 className="text-4xl lg:text-5xl tracking-[0.2em] uppercase text-[#1a252f] mb-4">
                    {data.personalInfo.fullName || 'YOUR NAME'}
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs uppercase tracking-widest text-[#7f8c8d]">
                    {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                    {data.personalInfo.phone && (
                        <>
                            <span className="text-[#d4af37]">◆</span>
                            <span>{data.personalInfo.phone}</span>
                        </>
                    )}
                    {data.personalInfo.email && (
                        <>
                            <span className="text-[#d4af37]">◆</span>
                            <span>{data.personalInfo.email}</span>
                        </>
                    )}
                    {data.personalInfo.website && (
                        <>
                            <span className="text-[#d4af37]">◆</span>
                            <a href={data.personalInfo.website} className="hover:text-[#2c3e50] transition-colors">{data.personalInfo.website}</a>
                        </>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow space-y-8 mt-4">
                {/* Summary */}
                {data.summary && (
                    <section className="text-center px-8">
                        <p className="text-[13px] leading-relaxed italic text-[#34495e] whitespace-pre-wrap">
                            "{data.summary}"
                        </p>
                    </section>
                )}

                {/* Experience */}
                {data.experience.length > 0 && (
                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-px bg-[#e8dccb] flex-grow"></div>
                            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[#1a252f]">Professional History</h2>
                            <div className="h-px bg-[#e8dccb] flex-grow"></div>
                        </div>
                        <div className="space-y-6 pl-4 border-l border-[#d4af37]/30">
                            {data.experience.map((exp) => (
                                <div key={exp.id} className="relative">
                                    <div className="absolute w-1.5 h-1.5 bg-[#d4af37] -left-[19.5px] top-1.5 rounded-full transform rotate-45"></div>
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className="font-bold text-[#1a252f] text-[15px]">{exp.position}</h3>
                                        <span className="text-xs tracking-wider text-[#7f8c8d] font-sans">
                                            {exp.startDate} {exp.endDate ? `— ${exp.endDate}` : ''}
                                        </span>
                                    </div>
                                    <div className="text-[13px] font-semibold text-[#d4af37] mb-2 uppercase tracking-wide">
                                        {exp.company}
                                    </div>
                                    <div className="text-[13px] text-[#34495e] leading-relaxed whitespace-pre-wrap font-sans">
                                        {exp.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <div className="grid grid-cols-2 gap-10">
                    {/* Education */}
                    {data.education.length > 0 && (
                        <section>
                            <div className="flex items-center gap-4 mb-4">
                                <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[#1a252f]">Education</h2>
                                <div className="h-px bg-[#e8dccb] flex-grow"></div>
                            </div>
                            <div className="space-y-4">
                                {data.education.map((edu) => (
                                    <div key={edu.id}>
                                        <h3 className="font-bold text-[#1a252f] text-sm">{edu.degree}</h3>
                                        <div className="text-[13px] text-[#d4af37] my-0.5">{edu.school}</div>
                                        <div className="text-xs text-[#7f8c8d] font-sans tracking-wide">
                                            {edu.startDate} {edu.endDate ? `— ${edu.endDate}` : ''}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Expertise */}
                    {data.skills && (
                        <section>
                            <div className="flex items-center gap-4 mb-4">
                                <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[#1a252f]">Expertise</h2>
                                <div className="h-px bg-[#e8dccb] flex-grow"></div>
                            </div>
                            <div className="flex flex-wrap gap-2 text-[13px] font-sans">
                                {data.skills.split(',').map((skill, index) => (
                                    <span key={index} className="bg-white border border-[#e8dccb] text-[#34495e] px-3 py-1 rounded-sm shadow-sm">
                                        {skill.trim()}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Projects */}
                {data.projects && data.projects.length > 0 && (
                    <section>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-px bg-[#e8dccb] flex-grow"></div>
                            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[#1a252f]">Selected Works</h2>
                            <div className="h-px bg-[#e8dccb] flex-grow"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.projects.map((proj) => (
                                <div key={proj.id} className="text-center p-4 border border-[#e8dccb] bg-white text-[13px]">
                                    <h3 className="font-bold text-[#1a252f] mb-1 uppercase tracking-widest">{proj.name}</h3>
                                    {proj.link && (
                                        <a href={proj.link} className="block text-xs text-[#d4af37] mb-2 hover:underline">
                                            View Project
                                        </a>
                                    )}
                                    <div className="text-[#34495e] leading-relaxed whitespace-pre-wrap font-sans">
                                        {proj.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
