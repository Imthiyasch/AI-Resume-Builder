import { ResumeData } from '@/types/resume';

interface Props {
    data: ResumeData;
}

/**
 * ATS Clean Template
 * Single-column, standard headings, no images/tables/graphics
 * Max machine-readability for Applicant Tracking Systems
 */
export default function ATSCleanTemplate({ data }: Props) {
    return (
        <div
            style={{
                fontFamily: "'Arial', 'Helvetica', sans-serif",
                background: '#ffffff',
                color: '#000000',
                padding: '36px 40px',
                width: '100%',
                minHeight: '297mm',
                boxSizing: 'border-box',
                fontSize: '11px',
                lineHeight: '1.5',
            }}
        >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '18px', borderBottom: '2px solid #000', paddingBottom: '14px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 6px 0' }}>
                    {data.personalInfo.fullName || 'YOUR NAME'}
                </h1>
                <div style={{ fontSize: '10px', color: '#333', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
                    {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                    {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                    {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
                </div>
            </div>

            {/* Summary */}
            {data.summary && (
                <section style={{ marginBottom: '14px' }}>
                    <h2 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '1px solid #000', paddingBottom: '3px', marginBottom: '6px' }}>
                        PROFESSIONAL SUMMARY
                    </h2>
                    <p style={{ margin: 0, color: '#222' }}>{data.summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
                <section style={{ marginBottom: '14px' }}>
                    <h2 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '1px solid #000', paddingBottom: '3px', marginBottom: '8px' }}>
                        WORK EXPERIENCE
                    </h2>
                    {data.experience.map((exp) => (
                        <div key={exp.id} style={{ marginBottom: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <strong style={{ fontSize: '11px' }}>{exp.position}</strong>
                                <span style={{ fontSize: '10px', color: '#555' }}>{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}</span>
                            </div>
                            <div style={{ fontSize: '10px', fontStyle: 'italic', color: '#333', marginBottom: '4px' }}>{exp.company}</div>
                            <div style={{ whiteSpace: 'pre-wrap', color: '#222' }}>{exp.description}</div>
                        </div>
                    ))}
                </section>
            )}

            {/* Education */}
            {data.education.length > 0 && (
                <section style={{ marginBottom: '14px' }}>
                    <h2 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '1px solid #000', paddingBottom: '3px', marginBottom: '8px' }}>
                        EDUCATION
                    </h2>
                    {data.education.map((edu) => (
                        <div key={edu.id} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <div>
                                <strong>{edu.degree}</strong>
                                <div style={{ fontSize: '10px', color: '#333' }}>{edu.school}</div>
                            </div>
                            <span style={{ fontSize: '10px', color: '#555' }}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</span>
                        </div>
                    ))}
                </section>
            )}

            {/* Skills */}
            {data.skills && (
                <section style={{ marginBottom: '14px' }}>
                    <h2 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '1px solid #000', paddingBottom: '3px', marginBottom: '6px' }}>
                        SKILLS
                    </h2>
                    <p style={{ margin: 0 }}>{data.skills}</p>
                </section>
            )}

            {/* Certifications */}
            {data.certifications && data.certifications.length > 0 && (
                <section style={{ marginBottom: '14px' }}>
                    <h2 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '1px solid #000', paddingBottom: '3px', marginBottom: '6px' }}>
                        CERTIFICATIONS
                    </h2>
                    {data.certifications.map((cert) => (
                        <div key={cert.id}>{cert.name} — {cert.issuer}{cert.date ? ` (${cert.date})` : ''}</div>
                    ))}
                </section>
            )}

            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
                <section>
                    <h2 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '1px solid #000', paddingBottom: '3px', marginBottom: '8px' }}>
                        PROJECTS
                    </h2>
                    {data.projects.map((proj) => (
                        <div key={proj.id} style={{ marginBottom: '8px' }}>
                            <strong>{proj.name}</strong>{proj.link ? ` | ${proj.link}` : ''}
                            <div style={{ whiteSpace: 'pre-wrap', color: '#333' }}>{proj.description}</div>
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
}
