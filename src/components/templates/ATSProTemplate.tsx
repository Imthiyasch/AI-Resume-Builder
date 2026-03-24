import { ResumeData } from '@/types/resume';

interface Props {
    data: ResumeData;
}

/**
 * ATS Pro Template
 * Professional single-column with blue accent line, no graphics
 * Optimized for corporate ATS parsers
 */
export default function ATSProTemplate({ data }: Props) {
    return (
        <div
            style={{
                fontFamily: "'Calibri', 'Georgia', serif",
                background: '#ffffff',
                color: '#1a1a1a',
                padding: '40px 44px',
                width: '100%',
                minHeight: '297mm',
                boxSizing: 'border-box',
                fontSize: '11px',
                lineHeight: '1.6',
            }}
        >
            {/* Header */}
            <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a3a5c', margin: '0 0 4px 0', letterSpacing: '0.5px' }}>
                    {data.personalInfo.fullName || 'YOUR NAME'}
                </h1>
                <div style={{ height: '3px', background: 'linear-gradient(to right, #1a3a5c, #4a90d9)', marginBottom: '8px', borderRadius: '2px' }} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '10px', color: '#444' }}>
                    {data.personalInfo.email && <span>✉ {data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span>☎ {data.personalInfo.phone}</span>}
                    {data.personalInfo.location && <span>⌖ {data.personalInfo.location}</span>}
                    {data.personalInfo.website && <span>⊕ {data.personalInfo.website}</span>}
                </div>
            </div>

            {/* Summary */}
            {data.summary && (
                <section style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '11px', fontWeight: '700', color: '#1a3a5c', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px' }}>
                        Professional Summary
                    </h2>
                    <div style={{ width: '100%', height: '1px', background: '#d0d8e0', marginBottom: '8px' }} />
                    <p style={{ margin: 0, color: '#333', textAlign: 'justify' }}>{data.summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
                <section style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '11px', fontWeight: '700', color: '#1a3a5c', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px' }}>
                        Work Experience
                    </h2>
                    <div style={{ width: '100%', height: '1px', background: '#d0d8e0', marginBottom: '10px' }} />
                    {data.experience.map((exp) => (
                        <div key={exp.id} style={{ marginBottom: '12px', paddingLeft: '8px', borderLeft: '3px solid #4a90d9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <strong style={{ fontSize: '11.5px', color: '#1a1a1a' }}>{exp.position}</strong>
                                <span style={{ fontSize: '10px', color: '#666', whiteSpace: 'nowrap' }}>{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ' – Present'}</span>
                            </div>
                            <div style={{ color: '#1a3a5c', fontWeight: '600', fontSize: '10.5px', marginBottom: '4px' }}>{exp.company}</div>
                            <div style={{ whiteSpace: 'pre-wrap', color: '#333' }}>{exp.description}</div>
                        </div>
                    ))}
                </section>
            )}

            {/* Education */}
            {data.education.length > 0 && (
                <section style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '11px', fontWeight: '700', color: '#1a3a5c', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px' }}>
                        Education
                    </h2>
                    <div style={{ width: '100%', height: '1px', background: '#d0d8e0', marginBottom: '10px' }} />
                    {data.education.map((edu) => (
                        <div key={edu.id} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <strong style={{ color: '#1a1a1a' }}>{edu.degree}</strong>
                                <div style={{ color: '#1a3a5c', fontSize: '10px' }}>{edu.school}</div>
                            </div>
                            <span style={{ fontSize: '10px', color: '#666' }}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</span>
                        </div>
                    ))}
                </section>
            )}

            {/* Skills */}
            {data.skills && (
                <section style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '11px', fontWeight: '700', color: '#1a3a5c', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px' }}>
                        Core Competencies
                    </h2>
                    <div style={{ width: '100%', height: '1px', background: '#d0d8e0', marginBottom: '8px' }} />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {data.skills.split(',').map((skill, i) => (
                            <span key={i} style={{ background: '#eef2f7', color: '#1a3a5c', padding: '2px 10px', borderRadius: '2px', fontSize: '10px', fontWeight: '500', border: '1px solid #d0d8e0' }}>
                                {skill.trim()}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* Certifications */}
            {data.certifications && data.certifications.length > 0 && (
                <section>
                    <h2 style={{ fontSize: '11px', fontWeight: '700', color: '#1a3a5c', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px' }}>
                        Certifications
                    </h2>
                    <div style={{ width: '100%', height: '1px', background: '#d0d8e0', marginBottom: '8px' }} />
                    {data.certifications.map((cert) => (
                        <div key={cert.id} style={{ marginBottom: '4px' }}>
                            <strong>{cert.name}</strong> — {cert.issuer}{cert.date ? `, ${cert.date}` : ''}
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
}
