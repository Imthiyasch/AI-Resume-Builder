import { ResumeData } from '@/types/resume';

interface Props {
    data: ResumeData;
}

export default function MinimalistTemplate({ data }: Props) {
    return (
        <div className="bg-white w-full h-full text-zinc-800 flex flex-col font-sans px-8 py-10">
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-3xl font-light tracking-wide mb-3 text-zinc-900">
                    {data.personalInfo.fullName || 'YOUR NAME'}
                </h1>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-500 uppercase tracking-widest">
                    {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                    {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                    {data.personalInfo.website && <a href={data.personalInfo.website} className="hover:text-zinc-800 transition-colors">{data.personalInfo.website}</a>}
                </div>
            </div>

            <div className="space-y-10">
                {/* Summary */}
                {data.summary && (
                    <section className="grid grid-cols-12 gap-6">
                        <div className="col-span-3 text-xs uppercase tracking-widest text-zinc-400 font-semibold pt-1">
                            About
                        </div>
                        <div className="col-span-9 text-sm leading-8 text-zinc-700 font-light whitespace-pre-wrap">
                            {data.summary}
                        </div>
                    </section>
                )}

                {/* Experience */}
                {data.experience.length > 0 && (
                    <section className="grid grid-cols-12 gap-6">
                        <div className="col-span-3 text-xs uppercase tracking-widest text-zinc-400 font-semibold pt-1">
                            Experience
                        </div>
                        <div className="col-span-9 space-y-8">
                            {data.experience.map((exp) => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-medium text-zinc-900">{exp.position}</h3>
                                        <span className="text-xs text-zinc-500 tracking-wider">
                                            {exp.startDate} {exp.endDate ? `— ${exp.endDate}` : ''}
                                        </span>
                                    </div>
                                    <div className="text-sm text-zinc-500 mb-3">{exp.company}</div>
                                    <div className="text-sm text-zinc-700 leading-7 font-light whitespace-pre-wrap">
                                        {exp.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {data.education.length > 0 && (
                    <section className="grid grid-cols-12 gap-6">
                        <div className="col-span-3 text-xs uppercase tracking-widest text-zinc-400 font-semibold pt-1">
                            Education
                        </div>
                        <div className="col-span-9 space-y-6">
                            {data.education.map((edu) => (
                                <div key={edu.id} className="flex justify-between items-baseline">
                                    <div>
                                        <h3 className="font-medium text-zinc-900">{edu.degree}</h3>
                                        <div className="text-sm text-zinc-500">{edu.school}</div>
                                    </div>
                                    <div className="text-xs text-zinc-500 tracking-wider">
                                        {edu.startDate} {edu.endDate ? `— ${edu.endDate}` : ''}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills & Projects Grid */}
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-3 text-xs uppercase tracking-widest text-zinc-400 font-semibold pt-1">
                        Additional
                    </div>
                    <div className="col-span-9 grid grid-cols-2 gap-8">
                        {/* Skills */}
                        {data.skills && (
                            <div>
                                <h4 className="text-xs uppercase tracking-widest text-zinc-900 font-medium mb-3">Skills</h4>
                                <p className="text-sm text-zinc-700 leading-7 font-light">
                                    {data.skills.split(',').map(s => s.trim()).join(' • ')}
                                </p>
                            </div>
                        )}

                        {/* Certs & Projects condensed */}
                        <div className="space-y-6">
                            {data.projects && data.projects.length > 0 && (
                                <div>
                                    <h4 className="text-xs uppercase tracking-widest text-zinc-900 font-medium mb-3">Projects</h4>
                                    <div className="space-y-3">
                                        {data.projects.map((proj) => (
                                            <div key={proj.id} className="text-sm font-light text-zinc-700">
                                                <span className="font-medium text-zinc-900 mr-2">{proj.name}</span>
                                                {proj.description}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
