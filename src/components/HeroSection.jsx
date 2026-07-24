import { useRef, useEffect, useState, useCallback, memo } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion'
import { useTypewriter } from '../hooks/useTypewriter'
import AuroraWave from './AuroraWave'
import Strands from './Strands'

const PHRASES = ['Ship Faster.', 'Scale Smarter.', 'Build to Last.', 'Innovate Daily.', 'Deliver Excellence.']
const TICKER_ITEMS = ['Web Development', '•', 'Mobile Apps', '•', 'UI/UX Design', '•', 'Custom Software', '•', 'AI Solutions', '•', 'Product Design', '•']

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
                Software Development Studio
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
// Background elements replaced with the dynamic AuroraWave component

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
const heroWords = ['We', 'Build', 'Products']


export default function HeroSection() {
    const heroRef = useRef(null)
    const desktopTextRef = useRef(null)
    const mobileTextRef = useRef(null)
    const [maskRect, setMaskRect] = useState(null)
    const [themeConfig, setThemeConfig] = useState({
        colors: ['#5b7cf7', '#8b5cf6', '#6366f1', '#5b7cf7'],
        isDark: true
    })

    useEffect(() => {
        const updateTheme = () => {
            const root = document.documentElement
            const isDark = root.getAttribute('data-theme') === 'dark'

            let colors;
            if (isDark) {
                const style = getComputedStyle(root)
                const blue = style.getPropertyValue('--accent-blue').trim() || '#5b7cf7'
                const violet = style.getPropertyValue('--accent-violet').trim() || '#8b5cf6'
                const indigo = style.getPropertyValue('--accent-indigo').trim() || '#6366f1'
                colors = [blue, violet, indigo, blue]
            } else {
                colors = ['#1e3a8a', '#4c1d95', '#312e81', '#1e3a8a'] // dark blue, dark violet, dark indigo
            }

            setThemeConfig({ colors, isDark })
        }
        updateTheme()

        const observer = new MutationObserver((mutations) => {
            for (const mut of mutations) {
                if (mut.type === 'attributes' && mut.attributeName === 'data-theme') {
                    updateTheme()
                }
            }
        })
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        const updateMask = () => {
            if (!heroRef.current) return
            const heroBounds = heroRef.current.getBoundingClientRect()
            const textNode = window.innerWidth >= 768 ? desktopTextRef.current : mobileTextRef.current
            if (!textNode) return
            const textBounds = textNode.getBoundingClientRect()

            // Calculate relative percentages [0..1] relative to the hero section
            const cx = (textBounds.left - heroBounds.left + textBounds.width / 2) / heroBounds.width
            const cy = (textBounds.top - heroBounds.top + textBounds.height / 2) / heroBounds.height
            const rx = (textBounds.width / 2) / heroBounds.width
            const ry = (textBounds.height / 2) / heroBounds.height
            setMaskRect({ cx, cy, rx, ry })
        }
        updateMask()
        window.addEventListener('resize', updateMask)
        return () => window.removeEventListener('resize', updateMask)
    }, [])

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'] // 0 = top of hero at top of viewport, 1 = bottom of hero at top of viewport
    })
    
    // Fade out Strands starting halfway down the hero, fully transparent near the bottom.
    // This provides a generous overlap with the Problem Section fade-in.
    const strandsOpacity = useTransform(scrollYProgress, [0.5, 0.95], [1, 0])

    return (
        <section
            ref={heroRef}
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
            style={{ background: 'var(--bg-primary)', paddingLeft: 'max(16px, env(safe-area-inset-left))', paddingRight: 'max(16px, env(safe-area-inset-right))' }}
        >

            {/* ── Dynamic Aurora Waves ── */}
            <motion.div style={{ position: 'absolute', inset: 0, opacity: strandsOpacity, zIndex: 0, pointerEvents: 'none' }}>
                <Strands 
                    maskRect={maskRect} 
                    colors={themeConfig.colors} 
                    count={3} 
                    speed={0.12}
                    waviness={0.6}
                    scale={2.2} 
                    amplitude={2.5} 
                    spread={2.5}
                    glow={themeConfig.isDark ? 2.2 : 1.0}
                    intensity={themeConfig.isDark ? 0.6 : 0.95}
                    saturation={themeConfig.isDark ? 1.5 : 2.5}
                    opacity={themeConfig.isDark ? 0.85 : 1.0}
                />
            </motion.div>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'var(--hero-grid-pattern)', backgroundSize: '32px 32px', maskImage: 'radial-gradient(ellipse 80% 65% at 50% 50%, black 20%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 65% at 50% 50%, black 20%, transparent 100%)', pointerEvents: 'none', zIndex: 1 }} />

            {/* ════════════ DESKTOP LAYOUT ════════════ */}
            <div className="hidden md:flex relative z-10 text-center max-w-5xl w-full mx-auto pt-32 pb-16 flex-col items-center">
                <LiveBadge />

                {/* Wrapping the main text block to measure it */}
                <div ref={desktopTextRef} className="flex flex-col items-center w-full">
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
                        We design and develop websites, mobile apps, custom software, <br /> intuitive user experiences, and AI-powered solutions.
                    </motion.p>
                </div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.08 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <MagneticButton href="#cta" className="btn-primary" style={{ width: 'auto' }}>
                        Start Your Project
                        <ArrowRight />
                    </MagneticButton>
                    <MagneticButton href="#solution" className="btn-ghost" style={{ width: 'auto' }}>
                        Explore Our Services
                    </MagneticButton>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.5 }} className="mt-14 flex flex-col items-center">
                    <p style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-faint)' }}>
                        Trusted by Forward-Thinking Companies
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
                            Software Development Studio
                        </span>
                    </motion.div>

                    <div ref={mobileTextRef} className="flex flex-col w-full">
                        {/* H1 — HUGE */}
                        <h1 style={{ fontSize: 'clamp(3.2rem, 12vw, 4.2rem)', lineHeight: 1.04, letterSpacing: '-0.045em', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 22 }}>
                            <motion.span
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                                style={{ display: 'block' }}
                            >
                                We Build<br />Products That
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
                            From concept to deployment — we build scalable digital products.
                        </motion.p>
                    </div>

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
                        Book a Free Consultation
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M4 9h10M10 5l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </motion.a>


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
                        Trusted by Forward-Thinking Companies
                    </p>
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
