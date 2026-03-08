import { ResumeData } from '@/types/resume';

interface Props {
    data: ResumeData;
}

export default function BoldTemplate({ data }: Props) {
    return (
        <div className="bg-red-600 w-full h-full text-white flex flex-col font-sans p-10">
            {/* Header */}
            <header className="mb-10 text-left border-b-8 border-white pb-6">
                <h1 className="text-6xl lg:text-7xl font-black uppercase tracking-tighter mb-4 leading-none">
                    {data.personalInfo.fullName || 'YOUR NAME'}
                </h1>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-bold uppercase tracking-widest text-red-200">
                    {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                    {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                    {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                    {data.personalInfo.website && <a href={data.personalInfo.website} className="hover:text-white transition-colors">{data.personalInfo.website}</a>}
                </div>
            </header>

            <div className="grid grid-cols-12 gap-12">
                {/* Main Content Column */}
                <div className="col-span-8 space-y-10">
                    {/* Summary */}
                    {data.summary && (
                        <section>
                            <h2 className="text-2xl font-black uppercase tracking-tighter mb-3 bg-white text-red-600 inline-block px-3 py-1">
                                Who I Am
                            </h2>
                            <p className="text-lg font-medium leading-relaxed whitespace-pre-wrap">
                                {data.summary}
                            </p>
                        </section>
                    )}

                    {/* Experience */}
                    {data.experience.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 bg-white text-red-600 inline-block px-3 py-1">
                                What I've Done
                            </h2>
                            <div className="space-y-8">
                                {data.experience.map((exp) => (
                                    <div key={exp.id} className="border-l-4 border-red-300 pl-6">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-black text-2xl uppercase tracking-tight">{exp.position}</h3>
                                            <span className="text-sm font-bold text-red-200 shrink-0 ml-4">
                                                {exp.startDate} {exp.endDate ? `— ${exp.endDate}` : ''}
                                            </span>
                                        </div>
                                        <div className="text-xl font-bold text-red-200 mb-3 uppercase tracking-wider">
                                            {exp.company}
                                        </div>
                                        <div className="text-base font-medium leading-relaxed whitespace-pre-wrap">
                                            {exp.description}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Side Content Column */}
                <div className="col-span-4 space-y-10">
                    {/* Skills */}
                    {data.skills && (
                        <section>
                            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 bg-white text-red-600 inline-block px-3 py-1">
                                Skills
                            </h2>
                            <div className="flex flex-col gap-2 font-bold text-lg uppercase tracking-wider">
                                {data.skills.split(',').map((skill, index) => (
                                    <span key={index} className="border-b-2 border-red-400 pb-1">
                                        {skill.trim()}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {data.education.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 bg-white text-red-600 inline-block px-3 py-1">
                                Education
                            </h2>
                            <div className="space-y-6">
                                {data.education.map((edu) => (
                                    <div key={edu.id}>
                                        <h3 className="font-black text-xl uppercase tracking-tight leading-tight mb-1">{edu.degree}</h3>
                                        <div className="text-lg font-bold text-red-200 uppercase tracking-wider mb-1">{edu.school}</div>
                                        <div className="text-sm font-bold text-red-300">
                                            {edu.startDate} {edu.endDate ? `— ${edu.endDate}` : ''}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Projects */}
                    {data.projects && data.projects.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 bg-white text-red-600 inline-block px-3 py-1">
                                Projects
                            </h2>
                            <div className="space-y-6">
                                {data.projects.map((proj) => (
                                    <div key={proj.id} className="bg-red-700 p-4 border-2 border-red-500">
                                        <div className="flex items-baseline gap-2 mb-2">
                                            <h3 className="font-black text-lg uppercase tracking-tight">{proj.name}</h3>
                                            {proj.link && (
                                                <a href={proj.link} className="text-xs font-bold text-red-200 hover:text-white uppercase tracking-wider border-b border-red-200">
                                                    Link
                                                </a>
                                            )}
                                        </div>
                                        <div className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
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
