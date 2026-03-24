import { ResumeData } from '@/types/resume';

interface Props {
    data: ResumeData;
}

/**
 * ATS Simple Template
 * Absolute minimum formatting — plain text layout
 * Best compatibility with all ATS systems
 */
export default function ATSSimpleTemplate({ data }: Props) {
    return (
        <div
            style={{
                fontFamily: "'Times New Roman', 'Times', serif",
                background: '#ffffff',
                color: '#000000',
                padding: '32px 36px',
                width: '100%',
                minHeight: '297mm',
                boxSizing: 'border-box',
                fontSize: '12px',
                lineHeight: '1.7',
            }}
        >
            {/* Header — plain centered */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: '900', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                    {data.personalInfo.fullName || 'YOUR NAME'}
                </h1>
                <div style={{ fontSize: '11px' }}>
                    {[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location, data.personalInfo.website]
                        .filter(Boolean)
                        .join(' | ')}
                </div>
                <hr style={{ border: 'none', borderTop: '1.5px solid #000', margin: '10px 0 0 0' }} />
            </div>

            {/* Summary */}
            {data.summary && (
                <section style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '12px', fontWeight: '700', textDecoration: 'underline', textTransform: 'uppercase', margin: '0 0 6px 0' }}>
                        Summary
                    </h2>
                    <p style={{ margin: 0 }}>{data.summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
                <section style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '12px', fontWeight: '700', textDecoration: 'underline', textTransform: 'uppercase', margin: '0 0 8px 0' }}>
                        Experience
                    </h2>
                    {data.experience.map((exp) => (
                        <div key={exp.id} style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <strong>{exp.position}, {exp.company}</strong>
                                <span style={{ fontSize: '11px' }}>{exp.startDate}{exp.endDate ? ` - ${exp.endDate}` : ''}</span>
                            </div>
                            <div style={{ whiteSpace: 'pre-wrap', marginTop: '4px' }}>{exp.description}</div>
                        </div>
                    ))}
                </section>
            )}

            {/* Education */}
            {data.education.length > 0 && (
                <section style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '12px', fontWeight: '700', textDecoration: 'underline', textTransform: 'uppercase', margin: '0 0 8px 0' }}>
                        Education
                    </h2>
                    {data.education.map((edu) => (
                        <div key={edu.id} style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <strong>{edu.degree}</strong> — {edu.school}
                            </div>
                            <span style={{ fontSize: '11px' }}>{edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}</span>
                        </div>
                    ))}
                </section>
            )}

            {/* Skills */}
            {data.skills && (
                <section style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '12px', fontWeight: '700', textDecoration: 'underline', textTransform: 'uppercase', margin: '0 0 6px 0' }}>
                        Skills
                    </h2>
                    <p style={{ margin: 0 }}>{data.skills}</p>
                </section>
            )}

            {/* Certifications */}
            {data.certifications && data.certifications.length > 0 && (
                <section style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '12px', fontWeight: '700', textDecoration: 'underline', textTransform: 'uppercase', margin: '0 0 6px 0' }}>
                        Certifications
                    </h2>
                    {data.certifications.map((cert) => (
                        <div key={cert.id}>{cert.name} — {cert.issuer}{cert.date ? ` (${cert.date})` : ''}</div>
                    ))}
                </section>
            )}

            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
                <section>
                    <h2 style={{ fontSize: '12px', fontWeight: '700', textDecoration: 'underline', textTransform: 'uppercase', margin: '0 0 8px 0' }}>
                        Projects
                    </h2>
                    {data.projects.map((proj) => (
                        <div key={proj.id} style={{ marginBottom: '8px' }}>
                            <strong>{proj.name}</strong>{proj.link ? ` (${proj.link})` : ''}
                            <div style={{ whiteSpace: 'pre-wrap' }}>{proj.description}</div>
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
}
