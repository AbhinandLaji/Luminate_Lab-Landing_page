import { useRef, useEffect, useState, useCallback, memo } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useTypewriter } from '../hooks/useTypewriter'
import ParticleField from './ParticleField'

const PHRASES = ['Scale Operations.', 'Accelerate Growth.', 'Automate Client Flow.', 'Drive Revenue.', 'Scale Predictably.']
const TICKER_ITEMS = ['Paid Media', '•', 'Funnel Design', '•', 'Email Nurture', '•', 'CRM Automation', '•', 'SEO & Content', '•', 'Sales Systems', '•', 'Performance Analytics', '•']

    // Inject keyframes once at module load — not on every render
    ; (() => {
        if (typeof document === 'undefined') return
        if (document.getElementById('hero-kf')) return
        const s = document.createElement('style')
        s.id = 'hero-kf'
        s.textContent = `
        @keyframes heroPing { 75%,100%{ transform:scale(2.2);opacity:0; } }
        @keyframes heroTicker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes heroFloat  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    `
        document.head.appendChild(s)
    })()

/* ─── Capability pill ─── */
function CapabilityPill({ label, icon, accentName = 'blue' }) {
    return (
        <div className="m-stat-card" style={{ borderColor: `var(--accent-${accentName}-border)`, gap: 8, padding: '18px 14px' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `var(--accent-${accentName}-bg)`, color: `var(--accent-${accentName})`, marginBottom: 2 }}>
                {icon}
            </div>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-secondary)', lineHeight: 1.3, textAlign: 'center' }}>
                {label}
            </div>
        </div>
    )
}

/* ─── Live badge ─── */
function LiveBadge() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8"
            style={{ background: 'rgba(91,124,247,0.10)', border: '1px solid rgba(91,124,247,0.22)', backdropFilter: 'blur(12px)' }}
        >
            <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#5b7cf7', animation: 'heroPing 1.5s cubic-bezier(0,0,0.2,1) infinite' }} />
                <span className="relative inline-flex rounded-full w-2 h-2" style={{ background: '#5b7cf7' }} />
            </span>
            <span style={{ color: '#a5b4fc', fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Performance-Driven Acquisition
            </span>
        </motion.div>
    )
}

/* ─── Typewriter ─── */
function TypewriterHeadline() {
    const { displayed } = useTypewriter(PHRASES, { typingSpeed: 65, deletingSpeed: 35, pauseAfterWord: 2200, pauseAfterDelete: 380 })
    return (
        <span className="gradient-text" style={{ display: 'inline-block', minWidth: '3ch' }}>
            {displayed}
            <motion.span aria-hidden="true" animate={{ opacity: [1, 1, 0, 0] }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-block', width: '3px', height: '0.88em', background: 'linear-gradient(180deg,#5b7cf7,#2dd4bf)', borderRadius: '2px', marginLeft: '4px', verticalAlign: 'middle' }} />
        </span>
    )
}

/* ─── Magnetic button (desktop only) ─── */
const MagneticButton = memo(function MagneticButton({ children, href, className, style: styleProp, ...props }) {
    const ref = useRef(null)
    const x = useMotionValue(0); const y = useMotionValue(0)
    const sx = useSpring(x, { stiffness: 300, damping: 18 })
    const sy = useSpring(y, { stiffness: 300, damping: 18 })
    const onMove = useCallback((e) => {
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * 0.35)
        y.set((e.clientY - r.top - r.height / 2) * 0.35)
    }, [x, y])
    const onLeave = useCallback(() => { x.set(0); y.set(0) }, [x, y])
    return (
        <motion.a ref={ref} href={href} className={className} style={{ ...styleProp, x: sx, y: sy, display: 'inline-flex' }}
            onMouseMove={onMove} onMouseLeave={onLeave} whileTap={{ scale: 0.95 }} {...props}>
            {children}
        </motion.a>
    )
})

/* ─── Desktop parallax orbs ─── */
const ParallaxOrbs = memo(function ParallaxOrbs() {
    const mx = useMotionValue(0); const my = useMotionValue(0)
    const smX = useSpring(mx, { stiffness: 50, damping: 30 })
    const smY = useSpring(my, { stiffness: 50, damping: 30 })
    const ox1 = useTransform(smX, v => v * 0.022); const oy1 = useTransform(smY, v => v * 0.022)
    const ox2 = useTransform(smX, v => v * -0.015); const oy2 = useTransform(smY, v => v * 0.018)
    const ox3 = useTransform(smX, v => v * 0.03); const oy3 = useTransform(smY, v => v * -0.025)
    const ox4 = useTransform(smX, v => v * -0.025); const oy4 = useTransform(smY, v => v * 0.03)
    useEffect(() => {
        const move = (e) => { mx.set(e.clientX - window.innerWidth / 2); my.set(e.clientY - window.innerHeight / 2) }
        window.addEventListener('mousemove', move, { passive: true })
        return () => window.removeEventListener('mousemove', move)
    }, [mx, my])
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <motion.div style={{ x: ox1, y: oy1, position: 'absolute', top: '-8%', left: '50%', marginLeft: '-550px', width: '1100px', height: '800px', background: 'var(--hero-orb-1)', willChange: 'transform' }} />
            <motion.div style={{ x: ox2, y: oy2, position: 'absolute', top: '5%', right: '-8%', width: '600px', height: '600px', background: 'var(--hero-orb-2)', willChange: 'transform' }} />
            <motion.div style={{ x: ox3, y: oy3, position: 'absolute', bottom: '5%', left: '-5%', width: '520px', height: '520px', background: 'var(--hero-orb-3)', willChange: 'transform' }} />
            <motion.div style={{ x: ox4, y: oy4, position: 'absolute', bottom: '15%', right: '5%', width: '320px', height: '320px', background: 'var(--hero-orb-4)', willChange: 'transform' }} />
            <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '400px', background: 'var(--hero-orb-center)' }} />
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'var(--hero-grid-pattern)', backgroundSize: '32px 32px', maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 100%)' }} />
        </div>
    )
})

/* ─── Mobile floating orbs (lightweight, no mouse tracking) ─── */
function MobileOrbs() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <div style={{ position: 'absolute', top: '-15%', left: '50%', transform: 'translateX(-50%)', width: '130vw', height: '70vw', background: 'var(--hero-mobile-orb-1)' }} />
            <motion.div style={{ position: 'absolute', top: '12%', right: '-20%', width: '65vw', height: '65vw', borderRadius: '50%', background: 'var(--hero-mobile-orb-2)', willChange: 'transform' }}
                animate={{ scale: [1, 1.08, 1], x: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.div style={{ position: 'absolute', bottom: '5%', left: '-15%', width: '55vw', height: '55vw', borderRadius: '50%', background: 'var(--hero-mobile-orb-3)', willChange: 'transform' }}
                animate={{ scale: [1, 1.06, 1], y: [0, -10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />
            {/* Grid dots */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'var(--hero-mobile-grid-pattern)', backgroundSize: '28px 28px', maskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 10%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 10%, transparent 100%)' }} />
        </div>
    )
}

/* ─── Scrolling ticker strip ─── */
function TickerStrip() {
    const items = [...TICKER_ITEMS, ...TICKER_ITEMS]
    return (
        <div style={{ overflow: 'hidden', padding: '11px 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-tertiary)' }} aria-hidden="true">
            <div className="marquee-track" style={{ gap: '24px', alignItems: 'center' }}>
                {items.map((item, i) => (
                    <span key={i} style={{
                        fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', flexShrink: 0,
                        color: item === '•' ? 'var(--accent-blue-border)' : 'var(--text-muted)',
                    }}>
                        {item}
                    </span>
                ))}
            </div>
        </div>
    )
}

/* ═══════════════════════════════════
   MAIN HERO SECTION
═══════════════════════════════════ */
const heroWords = ['We', 'Build', 'Systems']
const CAPABILITIES = [
    {
        label: 'Performance Visibility',
        accentName: 'blue',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>,
    },
    {
        label: 'Conversion Optimization',
        accentName: 'violet',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
    },
    {
        label: 'Automation Infrastructure',
        accentName: 'teal',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>,
    },
    {
        label: 'End-to-End Acquisition',
        accentName: 'slate',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
    },
]

export default function HeroSection() {
    return (
        <section
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
            style={{ background: 'var(--bg-primary)', paddingLeft: 'max(16px, env(safe-area-inset-left))', paddingRight: 'max(16px, env(safe-area-inset-right))' }}
        >

            {/* ── Desktop background ── */}
            <div className="hidden md:block"><ParallaxOrbs /></div>
            <div className="hidden md:block"><ParticleField count={60} color="91,124,247" speed={0.15} connectDistance={120} /></div>

            {/* ── Mobile background (no mouse tracking, lightweight) ── */}
            <div className="md:hidden"><MobileOrbs /></div>

            {/* ════════════ DESKTOP LAYOUT ════════════ */}
            <div className="hidden md:flex relative z-10 text-center max-w-5xl w-full mx-auto pt-32 pb-16 flex-col items-center">
                <LiveBadge />
                <h1 style={{ fontSize: 'clamp(3rem,7.5vw,5.75rem)', lineHeight: 1.06, letterSpacing: '-0.04em', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.45rem' }}>
                    {heroWords.map((w, i) => (
                        <motion.span key={w} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.13, duration: 0.6, ease: [0.16, 1, 0.3, 1] }} style={{ display: 'inline-block', marginRight: '0.28em' }}>
                            {w}
                        </motion.span>
                    ))}
                    <br />
                    <motion.span initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3em', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <span style={{ color: 'var(--text-primary)' }}>That&nbsp;</span>
                        <TypewriterHeadline />
                    </motion.span>
                </h1>
                <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.92 }}
                    style={{ fontSize: 'clamp(1rem,2vw,1.2rem)', color: 'var(--text-muted)', maxWidth: '520px', margin: '1.75rem auto 3.5rem', lineHeight: 1.7 }}>
                    We architect end-to-end growth systems <br /> that transform demand into measurable revenue.
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.08 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <MagneticButton href="#cta" className="btn-primary" style={{ width: 'auto' }}>
                        Book a Growth Audit
                        <ArrowRight />
                    </MagneticButton>
                    <MagneticButton href="#solution" className="btn-ghost" style={{ width: 'auto' }}>
                        Explore the Framework
                    </MagneticButton>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.28 }}
                    className="mt-20 grid grid-cols-4 gap-3 max-w-2xl w-full mx-auto">
                    {CAPABILITIES.map(c => <CapabilityPill key={c.label} {...c} />)}
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.5 }} className="mt-14 flex flex-col items-center">
                    <p style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-faint)' }}>
                        Built for Growth-Focused Businesses
                    </p>
                </motion.div>
            </div>

            {/* ══════════ MOBILE LAYOUT ══════════ */}
            <div
                className="md:hidden relative z-10 w-full flex flex-col"
                style={{ minHeight: '100dvh', paddingTop: 'calc(72px + env(safe-area-inset-top, 0px))' }}
            >
                {/* ── BEAT 1: Above fold ── */}
                <div className="flex flex-col px-5 pt-10 pb-8" style={{ flex: 1, justifyContent: 'center' }}>

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 16px', borderRadius: 100, background: 'rgba(91,124,247,0.10)', border: '1px solid rgba(91,124,247,0.22)', marginBottom: 28, width: 'fit-content' }}
                    >
                        <span className="relative flex" style={{ width: 7, height: 7 }}>
                            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#5b7cf7', animation: 'heroPing 1.5s cubic-bezier(0,0,0.2,1) infinite', opacity: 0.75 }} />
                            <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', width: 7, height: 7, background: '#5b7cf7' }} />
                        </span>
                        <span style={{ color: '#a5b4fc', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                            Performance-Driven Agency
                        </span>
                    </motion.div>

                    {/* H1 — HUGE */}
                    <h1 style={{ fontSize: 'clamp(3.2rem, 12vw, 4.2rem)', lineHeight: 1.04, letterSpacing: '-0.045em', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 22 }}>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                            style={{ display: 'block' }}
                        >
                            We Scale<br />Brands That
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.22, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                            style={{ display: 'block' }}
                        >
                            <TypewriterHeadline />
                        </motion.span>
                    </h1>

                    {/* Sub — one line, punchy */}
                    <motion.p
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: 0.35, duration: 0.55 }}
                        style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 32 }}
                    >
                        Full-stack acquisition — first click to closed deal.
                    </motion.p>

                    {/* Single CTA */}
                    <motion.a
                        href="#cta"
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                            width: '100%', padding: '18px 24px', borderRadius: 16,
                            background: 'linear-gradient(135deg, #5b7cf7 0%, #8b5cf6 100%)',
                            color: '#fff', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.01em',
                            textDecoration: 'none', boxShadow: '0 12px 40px rgba(91,124,247,0.45)',
                            marginBottom: 28,
                        }}
                    >
                        Book a Strategy Call
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M4 9h10M10 5l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </motion.a>

                    {/* Capability bar — 4 pillars */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: 0.55, duration: 0.6 }}
                        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}
                    >
                        {CAPABILITIES.map(c => (
                            <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                                <div style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `var(--accent-${c.accentName}-bg)`, color: `var(--accent-${c.accentName})`, flexShrink: 0 }}>
                                    {c.icon}
                                </div>
                                <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-secondary)', lineHeight: 1.25 }}>
                                    {c.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* ── BEAT 2: Below fold ── */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
                    <TickerStrip />
                </motion.div>

                {/* Social proof */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.75 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '20px 20px', paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))' }}
                >
                    <p style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-faint)' }}>
                        Built for Growth-Focused Businesses                    </p>
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                        {['Horizon', 'Vela', 'Arcane', 'Lumex', 'Stratus'].map((name) => (
                            <span key={name} style={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.16)' }}>{name}</span>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Bottom fade (desktop) */}
            <div className="hidden md:block absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
                style={{ background: 'linear-gradient(to bottom, transparent, var(--bg-primary))' }} aria-hidden="true" />

            {/* Desktop scroll indicator */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0, duration: 0.8 }}
                className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2">
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-faint)', fontWeight: 600 }}>Scroll</span>
                <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                    style={{ width: 1, height: 32, background: 'linear-gradient(180deg, rgba(91,124,247,0.7), transparent)' }} />
            </motion.div>
        </section>
    )
}

function ArrowRight() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}
