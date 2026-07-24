import React from 'react'
import AnimatedSection from './AnimatedSection'

const technologies = [
    { name: 'React', category: 'Frontend' },
    { name: 'Next.js', category: 'Frontend' },
    { name: 'Flutter', category: 'Mobile' },
    { name: 'Laravel', category: 'Backend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'PHP', category: 'Backend' },
    { name: 'Python', category: 'Backend/AI' },
    { name: 'MySQL', category: 'Database' },
    { name: 'MongoDB', category: 'Database' },
    { name: 'Git', category: 'DevOps' },
    { name: 'Docker', category: 'DevOps' },
]

export default function TechStackSection() {
    return (
        <section className="relative py-24 md:py-32 px-5 md:px-6 overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
            <div className="section-divider absolute top-0 left-0 right-0" />
            
            <div className="relative z-10 max-w-6xl mx-auto">
                <AnimatedSection className="text-center mb-16 md:mb-24">
                    <span className="section-label">Our Stack</span>
                    <h2
                        className="mt-6 font-black tracking-tight max-w-2xl mx-auto"
                        style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}
                    >
                        Technologies We Use
                    </h2>
                    <p className="mt-5 text-lg max-w-md mx-auto" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                        We use modern, scalable technologies to build products that perform and last.
                    </p>
                </AnimatedSection>

                <AnimatedSection>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', maxWidth: 900, margin: '0 auto' }}>
                        {technologies.map((tech, i) => (
                            <div 
                                key={tech.name}
                                style={{
                                    padding: '16px 24px',
                                    borderRadius: 16,
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-subtle)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 6,
                                    transition: 'all 0.3s ease',
                                    cursor: 'default',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--accent-blue)';
                                    e.currentTarget.style.background = 'var(--accent-blue-bg)';
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                                    e.currentTarget.style.background = 'var(--bg-secondary)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                    {tech.name}
                                </span>
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                                    {tech.category}
                                </span>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>
            </div>
            
            <div className="section-divider absolute bottom-0 left-0 right-0" />
        </section>
    )
}
