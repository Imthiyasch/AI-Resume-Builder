import { ResumeData } from '@/types/resume';

interface Props {
    data: ResumeData;
}

export default function ModernTemplate({ data }: Props) {
    return (
        <div className="bg-white w-full h-full text-gray-900 flex flex-col" style={{ padding: '10% 8%' }}>
            {/* Header */}
            <div className="text-center mb-8 border-b-2 border-gray-800 pb-6">
                <h1 className="text-3xl md:text-4xl font-serif font-bold uppercase tracking-wider mb-2">
                    {data.personalInfo.fullName || 'YOUR NAME'}
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-gray-600">
                    {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                    {data.personalInfo.phone && (
                        <>
                            <span className="text-gray-300">|</span>
                            <span>{data.personalInfo.phone}</span>
                        </>
                    )}
                    {data.personalInfo.location && (
                        <>
                            <span className="text-gray-300">|</span>
                            <span>{data.personalInfo.location}</span>
                        </>
                    )}
                    {data.personalInfo.website && (
                        <>
                            <span className="text-gray-300">|</span>
                            <a href={data.personalInfo.website} className="text-blue-600 hover:underline">{data.personalInfo.website}</a>
                        </>
                    )}
                </div>
            </div>

            {/* Summary */}
            {data.summary && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold uppercase tracking-widest text-gray-800 mb-2 border-b border-gray-300 pb-1">
                        Professional Summary
                    </h2>
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {data.summary}
                    </p>
                </div>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold uppercase tracking-widest text-gray-800 mb-3 border-b border-gray-300 pb-1">
                        Experience
                    </h2>
                    <div className="space-y-4">
                        {data.experience.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-gray-900">{exp.position}</h3>
                                    <span className="text-sm font-medium text-gray-600">
                                        {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ''}
                                    </span>
                                </div>
                                <div className="text-sm font-medium text-gray-800 mb-2 italic">
                                    {exp.company}
                                </div>
                                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap pl-4 relative">
                                    {exp.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {data.education.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold uppercase tracking-widest text-gray-800 mb-3 border-b border-gray-300 pb-1">
                        Education
                    </h2>
                    <div className="space-y-3">
                        {data.education.map((edu) => (
                            <div key={edu.id} className="flex justify-between items-baseline">
                                <div>
                                    <h3 className="font-bold text-gray-900">{edu.school}</h3>
                                    <div className="text-sm text-gray-700">{edu.degree}</div>
                                </div>
                                <div className="text-sm font-medium text-gray-600">
                                    {edu.startDate} {edu.endDate ? `- ${edu.endDate}` : ''}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold uppercase tracking-widest text-gray-800 mb-3 border-b border-gray-300 pb-1">
                        Projects
                    </h2>
                    <div className="space-y-3">
                        {data.projects.map((proj) => (
                            <div key={proj.id}>
                                <div className="flex items-baseline gap-2 mb-1">
                                    <h3 className="font-bold text-gray-900">{proj.name}</h3>
                                    {proj.link && (
                                        <a href={proj.link} className="text-xs text-blue-600 hover:underline">
                                            ({proj.link})
                                        </a>
                                    )}
                                </div>
                                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {proj.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Certifications */}
            {data.certifications && data.certifications.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold uppercase tracking-widest text-gray-800 mb-3 border-b border-gray-300 pb-1">
                        Certifications
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {data.certifications.map((cert) => (
                            <div key={cert.id} className="text-sm">
                                <span className="font-bold text-gray-900">{cert.name}</span>
                                <span className="text-gray-600 ml-2">— {cert.issuer} ({cert.date})</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            {data.skills && (
                <div>
                    <h2 className="text-lg font-bold uppercase tracking-widest text-gray-800 mb-3 border-b border-gray-300 pb-1">
                        Skills
                    </h2>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        {data.skills}
                    </p>
                </div>
            )}
        </div>
    );
}
