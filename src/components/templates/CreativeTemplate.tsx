import { ResumeData } from '@/types/resume';

interface Props {
    data: ResumeData;
}

export default function CreativeTemplate({ data }: Props) {
    return (
        <div className="bg-[#faf9f6] w-full h-full text-slate-800 flex font-sans">
            {/* Left Sidebar */}
            <div className="w-1/3 bg-teal-800 text-teal-50 p-8 flex flex-col">
                <div className="mb-12">
                    <div className="w-24 h-24 bg-teal-700 rounded-full flex items-center justify-center text-4xl font-bold mb-6 text-teal-100 shadow-inner">
                        {data.personalInfo.fullName ? data.personalInfo.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">
                        {data.personalInfo.fullName || 'YOUR NAME'}
                    </h1>
                    {data.title && <div className="text-teal-300 font-medium tracking-wide uppercase text-sm mb-6">{data.title}</div>}

                    <div className="space-y-3 text-sm text-teal-100/80">
                        {data.personalInfo.email && <div className="flex items-center gap-2"><span>✉</span> {data.personalInfo.email}</div>}
                        {data.personalInfo.phone && <div className="flex items-center gap-2"><span>☎</span> {data.personalInfo.phone}</div>}
                        {data.personalInfo.location && <div className="flex items-center gap-2"><span>⌂</span> {data.personalInfo.location}</div>}
                        {data.personalInfo.website && <div className="flex items-center gap-2"><span>✧</span> <a href={data.personalInfo.website} className="hover:text-white truncate">{data.personalInfo.website}</a></div>}
                    </div>
                </div>

                {/* Skills Sidebar */}
                {data.skills && (
                    <div className="mb-8">
                        <h2 className="text-lg font-bold uppercase tracking-wider text-white mb-4 border-b border-teal-700 pb-2">Expertise</h2>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.split(',').map((skill, i) => (
                                <span key={i} className="bg-teal-700/50 text-teal-50 px-3 py-1 text-xs font-semibold rounded-full border border-teal-600">
                                    {skill.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education Sidebar */}
                {data.education.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold uppercase tracking-wider text-white mb-4 border-b border-teal-700 pb-2">Education</h2>
                        <div className="space-y-4">
                            {data.education.map((edu) => (
                                <div key={edu.id}>
                                    <h3 className="font-bold text-white text-sm">{edu.degree}</h3>
                                    <div className="text-teal-200 text-xs my-0.5">{edu.school}</div>
                                    <div className="text-teal-400 text-xs font-medium">
                                        {edu.startDate} {edu.endDate ? `— ${edu.endDate}` : ''}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="w-2/3 p-10 flex flex-col bg-white">
                {/* Summary */}
                {data.summary && (
                    <div className="mb-8 bg-[#fdfaf6] p-6 rounded-2xl border border-orange-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-orange-400"></div>
                        <h2 className="text-lg font-bold uppercase tracking-wide text-slate-800 mb-2">Profile</h2>
                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                            {data.summary}
                        </p>
                    </div>
                )}

                {/* Experience */}
                {data.experience.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-bold uppercase tracking-wide text-teal-800 mb-6 flex items-center gap-3">
                            <span className="w-8 h-1 bg-orange-400 rounded-full"></span>
                            Experience
                        </h2>
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                            {data.experience.map((exp) => (
                                <div key={exp.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-orange-400 text-slate-500 shadow shrink-0 absolute left-0 md:left-1/2 -translate-x-1/2"></div>
                                    <div className="w-full pl-8 md:pl-0 md:w-[calc(50%-1.5rem)] text-left md:odd:text-right">
                                        <div className="flex flex-col md:group-odd:items-end">
                                            <h3 className="font-bold text-slate-800 md:group-odd:text-right">{exp.position}</h3>
                                            <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full inline-block mt-1 mb-2 w-max">
                                                {exp.startDate} {exp.endDate ? `— ${exp.endDate}` : ''}
                                            </span>
                                        </div>
                                        <div className="text-sm font-semibold text-teal-700 mb-2">{exp.company}</div>
                                        <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                                            {exp.description}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects */}
                {data.projects && data.projects.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-xl font-bold uppercase tracking-wide text-teal-800 mb-4 flex items-center gap-3">
                            <span className="w-8 h-1 bg-orange-400 rounded-full"></span>
                            Initiatives
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {data.projects.map((proj) => (
                                <div key={proj.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-teal-200 transition-colors">
                                    <h3 className="font-bold text-slate-800 mb-1">{proj.name}</h3>
                                    <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                                        {proj.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
