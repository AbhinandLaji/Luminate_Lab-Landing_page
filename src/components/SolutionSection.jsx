import { useState } from 'react'
import AnimatedSection from './AnimatedSection'
import { TiltCard } from '../hooks/TiltCard'
import { AnimatePresence, motion } from 'framer-motion'

const pillars = [
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
            </svg>
        ),
        title: 'Web Development',
        desc: 'We build fast, responsive, and scalable web applications using modern frameworks like React and Next.js — engineered for performance and maintainability.',
        tag: 'Frontend & Backend',
        accentName: 'blue',
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
        ),
        title: 'Mobile App Development',
        desc: 'From iOS to Android, we craft intuitive cross-platform mobile experiences using Flutter and React Native that delight users and drive engagement.',
        tag: 'iOS & Android',
        accentName: 'indigo',
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
        ),
        title: 'UI/UX Design',
        desc: 'We design intuitive, beautiful, and user-centered interfaces — from wireframes and prototypes to polished design systems that elevate product experiences.',
        tag: 'Design & Prototyping',
        accentName: 'violet',
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
            </svg>
        ),
        title: 'Custom Software Solutions',
        desc: 'We architect and build bespoke software tailored to your business — ERP systems, internal tools, dashboards, and workflow automation platforms built to scale.',
        tag: 'Tailored Engineering',
        accentName: 'purple',
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z" /><path d="M9 9h.01M15 9h.01M9 15s1 1 3 1 3-1 3-1" /><path d="M8 12h8" />
            </svg>
        ),
        title: 'AI-Powered Applications',
        desc: 'We integrate intelligent AI capabilities into your products — from natural language features and recommendation engines to computer vision and process automation.',
        tag: 'AI & Machine Learning',
        accentName: 'teal',
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
        title: 'Maintenance & Support',
        desc: 'We provide ongoing technical support, performance monitoring, security updates, and iterative enhancements to keep your software reliable and future-ready.',
        tag: 'Long-Term Partnership',
        accentName: 'rose',
    },
]

/**
 * PillarCard — Pure imperative hover. Zero React re-renders on hover.
 * Uses a stable ref callback to attach listeners once; cleanup on unmount.
 */
function PillarCard({ pillar }) {
    return (
        <div className="card p-8 h-full flex flex-col cursor-default">
            {/* Icon + tag row */}
            <div className="flex items-start justify-between mb-6">
                <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center animate-transition"
                    style={{
                        background: `var(--accent-${pillar.accentName}-bg)`,
                        color: `var(--accent-${pillar.accentName})`,
                        border: `1px solid var(--accent-${pillar.accentName}-border)`,
                        transition: 'transform 0.25s ease, background 0.25s ease, border-color 0.25s ease, color 0.25s ease',
                    }}
                    ref={el => {
                        if (!el || el.__tiltBound) return
                        el.__tiltBound = true
                        const card = el.closest('.card')
                        if (!card) return
                        const enter = () => {
                            el.style.transform = 'scale(1.08) rotate(-3deg)'
                        }
                        const leave = () => {
                            el.style.transform = ''
                        }
                        card.addEventListener('mouseenter', enter, { passive: true })
                        card.addEventListener('mouseleave', leave, { passive: true })
                    }}
                >
                    {pillar.icon}
                </div>
                <span
                    className="text-xs font-bold px-2.5 py-1 rounded-lg"
                    style={{
                        background: `var(--accent-${pillar.accentName}-bg)`,
                        color: `var(--accent-${pillar.accentName})`,
                        letterSpacing: '0.05em'
                    }}
                >
                    {pillar.tag}
                </span>
            </div>

            <h3
                className="font-bold text-base mb-3"
                style={{ color: 'var(--text-secondary)', letterSpacing: '-0.01em' }}
            >
                {pillar.title}
            </h3>
            <p className="text-sm leading-relaxed mt-auto" style={{ color: 'var(--text-muted)' }}>
                {pillar.desc}
            </p>

            {/* Bottom accent — attached via stable ref, no duplicate listeners */}
            <div
                className="h-0.5 rounded-full mt-6"
                style={{
                    background: `linear-gradient(90deg, var(--accent-${pillar.accentName}), transparent)`,
                    width: '0%',
                    transition: 'width 0.45s ease',
                }}
                ref={el => {
                    if (!el || el.__accentBound) return
                    el.__accentBound = true
                    const card = el.closest('.card')
                    if (!card) return
                    card.addEventListener('mouseenter', () => { el.style.width = '70%' }, { passive: true })
                    card.addEventListener('mouseleave', () => { el.style.width = '0%' }, { passive: true })
                }}
            />
        </div>
    )
}

function PillarRow({ pillar, isOpen, onToggle }) {
    return (
        <div style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <button
                onClick={onToggle}
                style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 16,
                    padding: '17px 20px',
                    background: isOpen ? `var(--accent-${pillar.accentName}-bg)` : 'transparent',
                    border: 'none', textAlign: 'left', cursor: 'pointer',
                    transition: 'background 0.2s ease',
                }}
            >
                {/* Icon */}
                <div style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    background: `var(--accent-${pillar.accentName}-bg)`,
                    border: `1px solid var(--accent-${pillar.accentName}-border)`,
                    display: 'flex', alignItems: 'center', justifyIntent: 'center', justifyContent: 'center',
                    color: `var(--accent-${pillar.accentName})`,
                    transition: 'all 0.25s ease',
                }}>
                    {pillar.icon}
                </div>
                {/* Title */}
                <span style={{ flex: 1, fontWeight: 700, fontSize: '0.97rem', color: isOpen ? 'var(--text-primary)' : 'var(--text-secondary)', letterSpacing: '-0.015em', transition: 'color 0.2s' }}>
                    {pillar.title}
                </span>
                {/* Tag */}
                <span style={{ fontSize: '0.6rem', fontWeight: 800, padding: '4px 10px', borderRadius: 100, background: `var(--accent-${pillar.accentName}-bg)`, color: `var(--accent-${pillar.accentName})`, letterSpacing: '0.06em', flexShrink: 0, transition: 'color 0.2s' }}>
                    {pillar.tag}
                </span>
                {/* Chevron */}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease', color: isOpen ? `var(--accent-${pillar.accentName})` : 'var(--text-muted)' }}>
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: 'hidden' }}
                    >
                        <p style={{ padding: '0 20px 18px 76px', fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.75 }}>
                            {pillar.desc}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default function SolutionSection() {
    const [openPillar, setOpenPillar] = useState(null)

    return (
        <section id="solution" aria-labelledby="solution-heading" className="relative py-32 px-6 overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
            <div className="section-divider absolute top-0 left-0 right-0" />

            {/* Static ambient */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '650px', height: '650px', background: 'radial-gradient(circle, var(--accent-blue-bg) 0%, transparent 70%)' }} />
                <div style={{ position: 'absolute', top: '30%', left: '-8%', width: '500px', height: '500px', background: 'radial-gradient(circle, var(--accent-indigo-bg) 0%, transparent 65%)' }} />
                <div style={{ position: 'absolute', bottom: '-5%', left: '40%', transform: 'translateX(-50%)', width: '400px', height: '300px', background: 'radial-gradient(ellipse, var(--accent-teal-bg) 0%, transparent 65%)' }} />
            </div>

            <div className="relative max-w-6xl mx-auto">
                <AnimatedSection className="text-center mb-12 md:mb-20">
                    <span className="section-label">What We Build</span>
                    <h2
                        id="solution-heading"
                        className="mt-6 font-black tracking-tight max-w-2xl mx-auto"
                        style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}
                    >
                        Everything You Need to Build &amp; Scale
                    </h2>
                    <p className="mt-5 text-lg max-w-md mx-auto" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                        End-to-end software services. One dedicated team.
                    </p>
                </AnimatedSection>

                {/* Desktop: Tilt card grid */}
                <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-5">
                    {pillars.map((pillar, i) => (
                        <AnimatedSection key={pillar.title} delay={i * 0.06}>
                            <TiltCard tiltMax={9} glare tiltScale={1.03} className="h-full">
                                <PillarCard pillar={pillar} />
                            </TiltCard>
                        </AnimatedSection>
                    ))}
                </div>

                {/* Mobile: tap-to-expand accordion */}
                <div className="sm:hidden" style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}>
                    {pillars.map((pillar) => (
                        <PillarRow
                            key={pillar.title}
                            pillar={pillar}
                            isOpen={openPillar === pillar.title}
                            onToggle={() => setOpenPillar(openPillar === pillar.title ? null : pillar.title)}
                        />
                    ))}
                </div>
            </div>

            <div className="section-divider absolute bottom-0 left-0 right-0" />
        </section>
    )
}
