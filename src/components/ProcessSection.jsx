import { useState, useEffect, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedSection from './AnimatedSection'

/* ══════════════════════════════════════════════════════
   STEP DATA
   ══════════════════════════════════════════════════════ */
const steps = [
    {
        number: '01', title: 'Discovery', tag: 'Weeks 1–2', accentName: 'blue',
        headline: 'Revenue System Audit',
        desc: 'We conduct a comprehensive analysis of your acquisition and revenue ecosystem — identifying bottlenecks, inefficiencies, and unrealized growth levers. Every recommendation is grounded in data, not assumptions.',
        bullets: [
            'End-to-end funnel and pipeline audit',
            'Competitive landscape and positioning analysis',
            'Audience segmentation and intent mapping',
            'Offer structure and messaging evaluation',
        ],
        stats: [{ v: '72hr', l: 'Audit delivery window' }, { v: '100%', l: 'Data-backed recommendations' }],
        icon: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
        ),
    },
    {
        number: '02', title: 'Strategy', tag: 'Weeks 2–3', accentName: 'violet',
        headline: 'Growth Architecture Blueprint',
        desc: 'A tailored, channel-agnostic growth strategy engineered around your margins, market dynamics, and long-term expansion objectives.',
        bullets: [
            'Channel prioritization and capital allocation model',
            'Creative positioning and hypothesis framework',
            '90-day performance roadmap with defined KPIs',
            'End-to-end funnel and lifecycle architecture',
        ],
        stats: [{ v: '90-Day', l: 'Strategic roadmap' }, { v: 'Custom', l: 'Built for your model' }],
        icon: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
            </svg>
        ),
    },
    {
        number: '03', title: 'Execution', tag: 'Weeks 3–8', accentName: 'teal',
        headline: 'Integrated Launch & Deployment',
        desc: 'We implement and activate every core component of the revenue system — acquisition channels, conversion infrastructure, automation, and lifecycle sequences — in coordinated alignment.',
        bullets: [
            'Multi-channel acquisition rollout',
            'Conversion environment build and optimization',
            'Creative production and structured testing cycles',
            'Performance sprints with continuous iteration',
        ],
        stats: [{ v: '2–4 Weeks', l: 'Go-live window' }, { v: 'Parallel', l: 'Cross-channel deployment' }],
        icon: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
        ),
    },
    {
        number: '04', title: 'Scale', tag: 'Month 3+', accentName: 'rose',
        headline: 'Optimization & Expansion',
        desc: 'We systematically amplify high-performing channels, optimize retention dynamics, and refine revenue efficiency — driving sustainable, compounding growth.',
        bullets: [
            'Performance-based scaling framework',
            'Cross-channel reinforcement loops',
            'Lifetime value and retention optimization',
            'Executive-level performance reporting',
        ],
        stats: [{ v: 'MoM', l: 'Compounding growth cycles' }, { v: 'Systemized', l: 'Scale methodology' }],
        icon: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
            </svg>
        ),
    },
]

const N = steps.length
const AUTO_MS = 4600  // ms before auto-advancing to next step

    /* Timer keyframe — injected once at module load, not on every render */
    ; (() => {
        if (typeof document === 'undefined') return
        if (document.getElementById('proc-kf')) return
        const s = document.createElement('style')
        s.id = 'proc-kf'
        s.textContent = '@keyframes procFill { from { transform: scaleX(0) } to { transform: scaleX(1) } }'
        document.head.appendChild(s)
    })()

/* ————————————————————————————————————————————————————————————————————————————
   StepAccordion — mobile-only vertical tap-to-expand step
   ———————————————————————————————————————————————————————————————————————————— */
function StepAccordion({ step, isOpen, onToggle }) {
    return (
        <div
            style={{
                borderBottom: '1px solid var(--border-subtle)',
                overflow: 'hidden',
            }}
        >
            {/* Header row — always visible */}
            <button
                onClick={onToggle}
                style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 16,
                    padding: '20px 20px', border: 'none',
                    textAlign: 'left', cursor: 'pointer',
                    transition: 'background 0.2s ease',
                    background: isOpen ? `var(--accent-${step.accentName}-bg)` : 'transparent',
                }}
            >
                {/* Step circle */}
                <div style={{
                    width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                    background: isOpen ? `var(--accent-${step.accentName})` : 'var(--border-subtle)',
                    border: `2px solid ${isOpen ? `var(--accent-${step.accentName})` : 'var(--border-subtle)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    color: isOpen ? '#fff' : 'var(--text-muted)',
                    fontSize: '0.78rem', fontWeight: 900, letterSpacing: '-0.02em',
                }}>
                    {step.number}
                </div>
                {/* Title + tag */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: isOpen ? 'var(--text-primary)' : 'var(--text-secondary)', letterSpacing: '-0.02em', transition: 'color 0.2s' }}>
                        {step.title}
                    </div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: `var(--accent-${step.accentName})`, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 3 }}>
                        {step.tag}
                    </div>
                </div>
                {/* Chevron */}
                <svg
                    width="18" height="18" viewBox="0 0 18 18" fill="none"
                    style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', color: isOpen ? `var(--accent-${step.accentName})` : 'var(--text-faint)' }}
                >
                    <path d="M4.5 7l4.5 4.5L13.5 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {/* Expandable content */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{ padding: '0 20px 24px 80px' }}>
                            {/* Headline */}
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em', marginBottom: 8 }}>
                                {step.headline}
                            </h3>
                            {/* Desc */}
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 16 }}>
                                {step.desc}
                            </p>
                            {/* Bullets */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 18 }}>
                                {step.bullets.map(b => (
                                    <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 9, background: `var(--accent-${step.accentName}-bg)`, border: `1px solid var(--accent-${step.accentName}-border)` }}>
                                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: `var(--accent-${step.accentName})`, flexShrink: 0 }} />
                                        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{b}</span>
                                    </div>
                                ))}
                            </div>
                            {/* Stats chips */}
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                {step.stats.map(s => (
                                    <div key={s.l} style={{ padding: '8px 16px', borderRadius: 100, background: `var(--accent-${step.accentName}-bg)`, border: `1px solid var(--accent-${step.accentName}-border)`, textAlign: 'center' }}>
                                        <div style={{ fontSize: '1rem', fontWeight: 900, color: `var(--accent-${step.accentName})`, lineHeight: 1 }}>{s.v}</div>
                                        <div style={{ fontSize: '0.56rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginTop: 3 }}>{s.l}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

/* ══════════════════════════════════════════════════════
   StepTab — top navigation button with progress bar
   ══════════════════════════════════════════════════════ */
const StepTab = memo(function StepTab({ step, isActive, onClick, autoKey }) {
    return (
        <button
            onClick={onClick}
            aria-pressed={isActive}
            style={{
                position: 'relative', overflow: 'hidden',
                display: 'flex', alignItems: 'center', gap: 11,
                padding: '13px 16px', borderRadius: 14, width: '100%',
                border: `1px solid ${isActive ? `var(--accent-${step.accentName}-border)` : 'var(--border-subtle)'}`,
                background: isActive ? `var(--accent-${step.accentName}-bg)` : 'var(--bg-tertiary)',
                cursor: 'pointer', textAlign: 'left',
                transition: 'border-color 0.3s ease, background 0.3s ease',
            }}
        >
            {/* Number badge */}
            <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: isActive ? `var(--accent-${step.accentName}-bg)` : 'var(--border-subtle)',
                border: `1px solid ${isActive ? `var(--accent-${step.accentName}-border)` : 'var(--border-subtle)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.3s, border-color 0.3s',
            }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '-0.01em', color: isActive ? `var(--accent-${step.accentName})` : 'var(--text-muted)', transition: 'color 0.3s' }}>
                    {step.number}
                </span>
            </div>

            {/* Labels */}
            <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, whiteSpace: 'nowrap', color: isActive ? 'var(--text-primary)' : 'var(--text-muted)', transition: 'color 0.3s', marginBottom: 3 }}>
                    {step.title}
                </div>
                <div style={{ fontSize: '0.61rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: isActive ? `var(--accent-${step.accentName})` : 'var(--text-faint)', transition: 'color 0.3s' }}>
                    {step.tag}
                </div>
            </div>

            {/* Auto-advance progress bar — pure CSS scaleX (GPU compositor only) */}
            {isActive && (
                <div
                    key={autoKey}  /* re-mount to restart animation on step change */
                    aria-hidden="true"
                    style={{
                        position: 'absolute', bottom: 0, left: 0,
                        width: '100%', height: '2px',
                        background: `var(--accent-${step.accentName})`,
                        transformOrigin: 'left center',
                        borderRadius: '0 2px 2px 0',
                        animation: `procFill ${AUTO_MS}ms linear forwards`,
                        willChange: 'transform',
                    }}
                />
            )}
        </button>
    )
})

/* ══════════════════════════════════════════════════════
   StepContent — left visual + right text
   ══════════════════════════════════════════════════════ */
const StepContent = memo(function StepContent({ step }) {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
        }}>
            {/* ─── Desktop 2-col grid ──────────────── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: 0,
            }}
                className="proc-inner"
            >
                {/* ── LEFT — visual card ── */}
                <div style={{
                    position: 'relative', overflow: 'hidden',
                    background: `linear-gradient(155deg, var(--bg-card) 0%, var(--accent-${step.accentName}-bg) 100%)`,
                    borderRight: `1px solid var(--accent-${step.accentName}-border)`,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    padding: '44px 32px',
                    minHeight: 280,
                }}>
                    {/* Giant ghost number */}
                    <div aria-hidden style={{
                        position: 'absolute', bottom: '-18px', right: '-10px',
                        fontSize: '12rem', fontWeight: 900,
                        lineHeight: 1, letterSpacing: '-0.06em',
                        color: `var(--accent-${step.accentName})`, opacity: 0.055,
                        userSelect: 'none', pointerEvents: 'none',
                    }}>
                        {step.number}
                    </div>

                    {/* Radial glow */}
                    <div aria-hidden style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%,-50%)',
                        width: 200, height: 200, borderRadius: '50%',
                        background: `radial-gradient(circle, var(--accent-${step.accentName}-bg) 0%, transparent 70%)`,
                        pointerEvents: 'none',
                    }} />

                    {/* Dot grid */}
                    <div aria-hidden style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: `radial-gradient(circle, var(--accent-${step.accentName}-border) 1px, transparent 1px)`,
                        backgroundSize: '26px 26px',
                        maskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, black 10%, transparent 100%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, black 10%, transparent 100%)',
                    }} />

                    {/* Icon box */}
                    <motion.div
                        key={step.number}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            width: 64, height: 64, borderRadius: 18,
                            background: `var(--accent-${step.accentName}-bg)`,
                            border: `1px solid var(--accent-${step.accentName}-border)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: `var(--accent-${step.accentName})`, marginBottom: 24, position: 'relative', zIndex: 2,
                        }}
                    >
                        {step.icon}
                    </motion.div>

                    {/* Stat chips */}
                    <div style={{ display: 'flex', gap: 10, position: 'relative', zIndex: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                        {step.stats.map((s, i) => (
                            <motion.div
                                key={s.l}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 + 0.2 }}
                                style={{
                                    padding: '8px 16px', borderRadius: 100,
                                    background: `var(--accent-${step.accentName}-bg)`,
                                    border: `1px solid var(--accent-${step.accentName}-border)`,
                                    textAlign: 'center',
                                }}
                            >
                                <div style={{ fontSize: '1.15rem', fontWeight: 900, letterSpacing: '-0.035em', color: `var(--accent-${step.accentName})`, lineHeight: 1 }}>
                                    {s.v}
                                </div>
                                <div style={{ fontSize: '0.59rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginTop: 3 }}>
                                    {s.l}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ── RIGHT — text content ── */}
                <div style={{
                    padding: '40px 36px',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                }}>
                    {/* Tag */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 13px', borderRadius: 100, background: `var(--accent-${step.accentName}-bg)`, border: `1px solid var(--accent-${step.accentName}-border)`, marginBottom: 18, width: 'fit-content' }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: `var(--accent-${step.accentName})` }} />
                        <span style={{ fontSize: '0.67rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: `var(--accent-${step.accentName})` }}>{step.tag}</span>
                    </div>

                    {/* Headline */}
                    <h3 style={{
                        fontSize: 'clamp(1.5rem, 2.8vw, 2.1rem)',
                        fontWeight: 900, letterSpacing: '-0.03em',
                        color: 'var(--text-primary)', lineHeight: 1.18,
                        marginBottom: 14,
                    }}>
                        {step.number}. {step.headline}
                    </h3>

                    {/* Description */}
                    <p style={{ fontSize: '0.93rem', color: 'var(--text-muted)', lineHeight: 1.85, marginBottom: 24, maxWidth: 440 }}>
                        {step.desc}
                    </p>

                    {/* Bullets */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {step.bullets.map((b, i) => (
                            <motion.div
                                key={b}
                                initial={{ opacity: 0, x: 14 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.06 + 0.08, duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 11,
                                    padding: '9px 14px', borderRadius: 10,
                                    background: `var(--accent-${step.accentName}-bg)`,
                                    border: `1px solid var(--accent-${step.accentName}-border)`,
                                }}
                            >
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                    <path d="M2 6.5l3 3 6-6" stroke={`var(--accent-${step.accentName})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{b}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
})

/* ══════════════════════════════════════════════════════
   MAIN EXPORT
   ══════════════════════════════════════════════════════ */
export default function ProcessSection() {
    const [active, setActive] = useState(0)
    const [autoKey, setAutoKey] = useState(0)   // increments to restart CSS animation
    const [manualMode, setManualMode] = useState(false)

    /* Auto-advance — pauses after user manual click */
    useEffect(() => {
        if (manualMode) return
        const id = setTimeout(() => {
            setActive(a => (a + 1) % N)
            setAutoKey(k => k + 1)
        }, AUTO_MS)
        return () => clearTimeout(id)
    }, [active, autoKey, manualMode])

    const handleTabClick = useCallback((i) => {
        setActive(i)
        setAutoKey(k => k + 1)
        setManualMode(true)
    }, [])

    // Mobile accordion state
    const [openStep, setOpenStep] = useState(0)

    const current = steps[active]

    return (
        <section id="process" style={{ background: 'var(--bg-primary)', position: 'relative' }}>

            <div className="section-divider absolute top-0 left-0 right-0" />

            {/* Ambient — no filter:blur */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div style={{ position: 'absolute', top: '-10%', right: '-6%', width: '500px', height: '500px', background: 'radial-gradient(circle, var(--accent-blue-bg) 0%, transparent 68%)' }} />
                <div style={{ position: 'absolute', bottom: '-8%', left: '-4%', width: '420px', height: '420px', background: 'radial-gradient(circle, var(--accent-violet-bg) 0%, transparent 65%)' }} />
            </div>

            <div className="relative max-w-6xl mx-auto px-6 py-28">

                {/* Heading */}
                <AnimatedSection className="text-center mb-14">
                    <span className="section-label">Our Process</span>
                    <h2
                        className="font-black tracking-tight mt-6 mb-5"
                        style={{ fontSize: 'clamp(1.95rem, 4vw, 3rem)', letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.1 }}
                    >
                        How We Build Your<br />
                        <span className="gradient-text">Acquisition Engine</span>
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: 420, margin: '0 auto' }}>
                        Four phases. No fluff. Just a systematic path from zero to scale.
                    </p>
                </AnimatedSection>

                {/* ── Tab row — horizontal scroll on mobile, grid on desktop ── */}
                {/* Mobile — outer div has no inline style so md:hidden works */}
                <div className="hidden">
                    <div style={{ overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch', display: 'flex', gap: 10, paddingLeft: 4, paddingRight: 4, paddingBottom: 4 }}>
                        {steps.map((step, i) => (
                            <div key={step.number} style={{ flexShrink: 0, width: 150 }}>
                                <StepTab
                                    step={step}
                                    isActive={active === i}
                                    onClick={() => handleTabClick(i)}
                                    autoKey={active === i ? autoKey : 0}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                {/* Desktop */}
                <div className="hidden md:block">
                    <AnimatedSection delay={0.1} className="grid grid-cols-4 gap-3 mb-6">
                        {steps.map((step, i) => (
                            <StepTab
                                key={step.number}
                                step={step}
                                isActive={active === i}
                                onClick={() => handleTabClick(i)}
                                autoKey={active === i ? autoKey : 0}
                            />
                        ))}
                    </AnimatedSection>
                </div>

                {/* Auto-mode hint */}
                {!manualMode && (
                    <div className="hidden md:block text-center mb-3">
                        <span style={{ fontSize: '0.67rem', color: 'var(--text-faint)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            Auto-advancing · Click any step to explore
                        </span>
                    </div>
                )}

                {/* ── Content panel (Desktop only) ── */}
                <div className="hidden md:block">
                    <AnimatedSection delay={0.18}>
                        <div style={{
                            borderRadius: 20,
                            border: `1px solid var(--accent-${current.accentName}-border)`,
                            overflow: 'hidden',
                            background: 'var(--bg-card)',
                            boxShadow: `var(--shadow-card), 0 0 0 1px var(--border-subtle), inset 0 1px 0 rgba(255,255,255,0.05)`,
                            transition: 'border-color 0.4s ease',
                        }}>
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={active}
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -18 }}
                                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    {/* Desktop: 2-col inner grid */}
                                    <div className="hidden md:grid" style={{ gridTemplateColumns: '42% 1fr' }}>
                                        {/* LEFT – visual */}
                                        <div style={{
                                            position: 'relative', overflow: 'hidden',
                                            background: `linear-gradient(155deg, var(--bg-card) 0%, var(--accent-${current.accentName}-bg) 100%)`,
                                            borderRight: `1px solid var(--accent-${current.accentName}-border)`,
                                            display: 'flex', flexDirection: 'column',
                                            alignItems: 'center', justifyContent: 'center',
                                            padding: '52px 36px',
                                            minHeight: 380,
                                        }}>
                                            <div aria-hidden style={{ position: 'absolute', bottom: '-14px', right: '-8px', fontSize: '10rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.06em', color: `var(--accent-${current.accentName})`, opacity: 0.048, userSelect: 'none', pointerEvents: 'none' }}>
                                                {current.number}
                                            </div>
                                            <div aria-hidden style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 240, height: 240, borderRadius: '50%', background: `radial-gradient(circle, var(--accent-${current.accentName}-bg) 0%, transparent 70%)` }} />
                                            <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle, var(--accent-${current.accentName}-border) 1px, transparent 1px)`, backgroundSize: '26px 26px', maskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, black 10%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, black 10%, transparent 100%)' }} />
                                            <motion.div
                                                key={current.number + '-icon'}
                                                initial={{ scale: 0.76, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                                                style={{ width: 68, height: 68, borderRadius: 20, background: `var(--accent-${current.accentName}-bg)`, border: `1px solid var(--accent-${current.accentName}-border)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: `var(--accent-${current.accentName})`, marginBottom: 28, position: 'relative', zIndex: 2 }}
                                            >
                                                {current.icon}
                                            </motion.div>
                                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
                                                {current.stats.map((s, i) => (
                                                    <motion.div key={s.l} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.09 + 0.18 }}
                                                        style={{ padding: '9px 18px', borderRadius: 100, background: `var(--accent-${current.accentName}-bg)`, border: `1px solid var(--accent-${current.accentName}-border)`, textAlign: 'center' }}
                                                    >
                                                        <div style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.04em', color: `var(--accent-${current.accentName})`, lineHeight: 1 }}>{s.v}</div>
                                                        <div style={{ fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginTop: 4 }}>{s.l}</div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                        {/* RIGHT – text */}
                                        <div style={{ padding: '44px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 13px', borderRadius: 100, background: `var(--accent-${current.accentName}-bg)`, border: `1px solid var(--accent-${current.accentName}-border)`, marginBottom: 18, width: 'fit-content' }}>
                                                <div style={{ width: 5, height: 5, borderRadius: '50%', background: `var(--accent-${current.accentName})` }} />
                                                <span style={{ fontSize: '0.67rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: `var(--accent-${current.accentName})` }}>{current.tag}</span>
                                            </div>
                                            <h3 style={{ fontSize: 'clamp(1.45rem, 2.6vw, 2.0rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 14 }}>
                                                {current.number}. {current.headline}
                                            </h3>
                                            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.88, marginBottom: 24, maxWidth: 400 }}>
                                                {current.desc}
                                            </p>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                {current.bullets.map((b, i) => (
                                                    <motion.div key={b} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.055 + 0.06, duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                                                        style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 14px', borderRadius: 10, background: `var(--accent-${current.accentName}-bg)`, border: `1px solid var(--accent-${current.accentName}-border)` }}
                                                    >
                                                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5l3 3 6-6" stroke={`var(--accent-${current.accentName})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{b}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                            <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                                                <button
                                                    onClick={() => { setActive((active + 1) % N); setAutoKey(k => k + 1); setManualMode(true) }}
                                                    style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 100, background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 600, transition: 'all 0.2s ease' }}
                                                    onMouseEnter={e => {
                                                        e.currentTarget.style.background = `var(--accent-${current.accentName}-bg)`
                                                        e.currentTarget.style.borderColor = `var(--accent-${current.accentName}-border)`
                                                        e.currentTarget.style.color = `var(--accent-${current.accentName})`
                                                    }}
                                                    onMouseLeave={e => {
                                                        e.currentTarget.style.background = 'var(--bg-tertiary)'
                                                        e.currentTarget.style.borderColor = 'var(--border-subtle)'
                                                        e.currentTarget.style.color = 'var(--text-muted)'
                                                    }}
                                                >
                                                    Next: {steps[(active + 1) % N].title}
                                                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 6.5h7M7 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </AnimatedSection>
                </div>

                {/* Step dots — desktop only */}
                <div className="hidden md:flex items-center justify-center gap-2 mt-6">
                    {steps.map((step, i) => (
                        <button
                            key={step.number}
                            onClick={() => handleTabClick(i)}
                            aria-label={`Step ${i + 1}: ${step.title}`}
                            style={{
                                width: active === i ? 24 : 7, height: 7, borderRadius: 100,
                                background: active === i ? `var(--accent-${step.accentName})` : 'var(--border-subtle)',
                                border: 'none', cursor: 'pointer', padding: 0,
                                transition: 'width 0.35s ease, background 0.3s ease',
                            }}
                        />
                    ))}
                </div>

                {/* Mobile: vertical accordion */}
                <div className="md:hidden">
                    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}>
                        {steps.map((step, i) => (
                            <StepAccordion
                                key={step.number}
                                step={step}
                                isOpen={openStep === i}
                                onToggle={() => setOpenStep(openStep === i ? null : i)}
                            />
                        ))}
                    </div>
                </div>

            </div>

            <div className="section-divider absolute bottom-0 left-0 right-0" />
        </section>
    )
}
