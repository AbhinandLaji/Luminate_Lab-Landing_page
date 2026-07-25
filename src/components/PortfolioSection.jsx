import React from 'react'
import AnimatedSection from './AnimatedSection'

import { featuredProjects as projects } from '../data/featuredProjects'

export default function PortfolioSection() {
    return (
        <section id="portfolio" className="relative py-24 md:py-32 px-5 md:px-6 overflow-hidden" style={{ background: 'var(--bg-secondary)', contentVisibility: 'auto', containIntrinsicBlockSize: '700px' }}>
            <div className="relative z-10 max-w-6xl mx-auto">
                <AnimatedSection className="text-center mb-16 md:mb-20">
                    <span className="section-label">Our Work</span>
                    <h2
                        className="mt-6 font-black tracking-tight max-w-2xl mx-auto"
                        style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}
                    >
                        Featured Projects
                    </h2>
                    <p className="mt-5 text-lg max-w-md mx-auto" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                        A selection of digital products we've designed and developed.
                    </p>
                </AnimatedSection>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {projects.map((p, i) => (
                        <AnimatedSection key={p.id} delay={i * 0.1}>
                            <div 
                                id={`project-${p.slug}`}
                                style={{
                                    background: 'var(--bg-primary)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: 24,
                                    overflow: 'hidden',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'all 0.3s ease',
                                }}
                                className="group"
                            >
                                {/* Placeholder Image Area */}
                                <div style={{ 
                                    height: 220, 
                                    background: `var(--accent-${p.color}-bg)`,
                                    borderBottom: '1px solid var(--border-subtle)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: `var(--accent-${p.color})`
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: 100, background: 'var(--bg-primary)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', color: `var(--accent-${p.color})`, textTransform: 'uppercase' }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <polyline points="21 15 16 10 5 21" />
                                        </svg>
                                        Image Placeholder
                                    </div>
                                </div>
                                
                                {/* Content Area */}
                                <div style={{ padding: 32, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: `var(--accent-${p.color})`, marginBottom: 12 }}>
                                        {p.category}
                                    </div>
                                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12, letterSpacing: '-0.01em' }}>
                                        {p.title}
                                    </h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 24 }}>
                                        {p.desc}
                                    </p>
                                    
                                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                        View Case Study
                                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ transition: 'transform 0.2s' }} className="group-hover:translate-x-1">
                                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    )
}
