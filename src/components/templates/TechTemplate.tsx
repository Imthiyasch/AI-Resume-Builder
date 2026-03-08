import { ResumeData } from '@/types/resume';

interface Props {
    data: ResumeData;
}

export default function TechTemplate({ data }: Props) {
    return (
        <div className="bg-[#0a0a0a] w-full h-full text-zinc-300 flex flex-col font-mono p-10 border-4 border-emerald-900/30">
            {/* Header */}
            <header className="mb-10 relative">
                <div className="absolute top-0 right-0 text-emerald-500/50 text-xs">status: online</div>
                <h1 className="text-4xl font-bold text-emerald-400 mb-4 tracking-tighter lowercase">
                    <span className="text-zinc-500">const</span> {data.personalInfo.fullName ? data.personalInfo.fullName.replace(/\s+/g, '_') : 'dev_name'} = {'{'}
                </h1>
                <div className="space-y-1 text-sm pl-8 border-l-2 border-emerald-900/50 ml-2">
                    {data.personalInfo.email && <div><span className="text-emerald-300">email:</span> <span className="text-amber-300">"{data.personalInfo.email}"</span>,</div>}
                    {data.personalInfo.phone && <div><span className="text-emerald-300">phone:</span> <span className="text-amber-300">"{data.personalInfo.phone}"</span>,</div>}
                    {data.personalInfo.location && <div><span className="text-emerald-300">location:</span> <span className="text-amber-300">"{data.personalInfo.location}"</span>,</div>}
                    {data.personalInfo.website && <div><span className="text-emerald-300">repo:</span> <a href={data.personalInfo.website} className="text-cyan-400 hover:text-cyan-300 transition-colors">"{data.personalInfo.website}"</a>,</div>}
                </div>
                <div className="text-4xl font-bold text-emerald-400 mt-2 tracking-tighter">{'}'};</div>
            </header>

            {/* Summary */}
            {data.summary && (
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-zinc-100 mb-3 bg-zinc-900 inline-block px-2 py-0.5 border border-zinc-800">
                        <span className="text-emerald-500 mr-2">~/readme.md</span>
                    </h2>
                    <p className="text-sm leading-relaxed text-zinc-400 whitespace-pre-wrap pl-4 border-l-2 border-zinc-800">
                        {data.summary}
                    </p>
                </section>
            )}

            {/* Skills */}
            {data.skills && (
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-zinc-100 mb-3 bg-zinc-900 inline-block px-2 py-0.5 border border-zinc-800">
                        <span className="text-emerald-500 mr-2">~/dependencies.json</span>
                    </h2>
                    <div className="flex flex-wrap gap-2 pl-4">
                        {data.skills.split(',').map((skill, index) => (
                            <span key={index} className="bg-emerald-950/30 text-emerald-300 px-2 py-1 text-xs border border-emerald-900/50 rounded-sm">
                                {skill.trim()}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-zinc-100 mb-4 bg-zinc-900 inline-block px-2 py-0.5 border border-zinc-800">
                        <span className="text-emerald-500 mr-2">~/history.log</span>
                    </h2>
                    <div className="space-y-6 pl-4 border-l-2 border-zinc-800">
                        {data.experience.map((exp) => (
                            <div key={exp.id} className="relative">
                                <div className="absolute w-2 h-2 bg-emerald-500 -left-[21px] top-1.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                                <div className="flex flex-wrap justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-amber-400 text-sm">
                                        [{exp.company}] <span className="text-zinc-100">{exp.position}</span>
                                    </h3>
                                    <span className="text-xs text-zinc-500">
                                        {exp.startDate} {exp.endDate ? `-> ${exp.endDate}` : ''}
                                    </span>
                                </div>
                                <div className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap mt-2">
                                    {exp.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="grid grid-cols-2 gap-8">
                {/* Education */}
                {data.education.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold text-zinc-100 mb-4 bg-zinc-900 inline-block px-2 py-0.5 border border-zinc-800">
                            <span className="text-emerald-500 mr-2">~/education.txt</span>
                        </h2>
                        <div className="space-y-4 pl-4 border-l-2 border-zinc-800">
                            {data.education.map((edu) => (
                                <div key={edu.id} className="relative">
                                    <div className="absolute w-1.5 h-1.5 bg-zinc-500 -left-[19px] top-1.5 rounded-full"></div>
                                    <h3 className="font-bold text-zinc-100 text-sm">{edu.school}</h3>
                                    <div className="text-xs text-emerald-400 my-0.5">{edu.degree}</div>
                                    <div className="text-xs text-zinc-600">
                                        {edu.startDate} {edu.endDate ? `-> ${edu.endDate}` : ''}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {data.projects && data.projects.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold text-zinc-100 mb-4 bg-zinc-900 inline-block px-2 py-0.5 border border-zinc-800">
                            <span className="text-emerald-500 mr-2">~/deployments.md</span>
                        </h2>
                        <div className="space-y-4 pl-4 border-l-2 border-zinc-800">
                            {data.projects.map((proj) => (
                                <div key={proj.id} className="relative">
                                    <div className="absolute w-1.5 h-1.5 bg-cyan-500 -left-[19px] top-1.5 rounded-full"></div>
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <h3 className="font-bold text-zinc-100 text-sm">{proj.name}</h3>
                                        {proj.link && (
                                            <a href={proj.link} className="text-xs text-cyan-400 hover:text-cyan-300">
                                                [view]
                                            </a>
                                        )}
                                    </div>
                                    <div className="text-xs text-zinc-500 leading-relaxed whitespace-pre-wrap">
                                        {proj.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <div className="mt-auto text-center text-xs text-zinc-600 pt-8 animate-pulse">
                __EOF__
            </div>
        </div>
    );
}
