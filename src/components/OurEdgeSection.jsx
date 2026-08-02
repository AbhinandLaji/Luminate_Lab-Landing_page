import { useRef, useEffect, useState, useCallback, memo } from 'react'
import {
    motion, useMotionValue, useSpring, useTransform, useScroll,
} from 'framer-motion'

/* ════════════════════════════════════════════════════
   SVG ICONS — high-quality, single-colour stroke icons
   All are pure SVG, no emoji, no external dependency
════════════════════════════════════════════════════ */
const Icons = {
    rocket: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 25 Q 15 5, 30 15 T 35 35 Z" fill="currentColor" fillOpacity="0.1" />
            <circle cx="25" cy="15" r="4" fill="currentColor" />
        </svg>
    ),
    diamond: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="10,30 20,5 35,20 25,35" fill="currentColor" fillOpacity="0.1" />
            <line x1="10" y1="30" x2="35" y2="20" />
        </svg>
    ),
    chart: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 35 L 15 15 L 25 25 L 35 5" stroke="currentColor" strokeWidth="3" />
            <circle cx="35" cy="5" r="3" fill="currentColor" />
            <circle cx="15" cy="15" r="3" fill="currentColor" />
        </svg>
    ),
    shield: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 10 Q 20 0, 35 10 L 30 30 Q 20 40, 10 30 Z" fill="currentColor" fillOpacity="0.1" />
            <circle cx="20" cy="20" r="6" stroke="currentColor" strokeDasharray="2 2" />
        </svg>
    ),
    globe: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="20" cy="20" rx="15" ry="10" transform="rotate(30 20 20)" stroke="currentColor" />
            <ellipse cx="20" cy="20" rx="5" ry="15" transform="rotate(-45 20 20)" fill="currentColor" fillOpacity="0.1" />
        </svg>
    ),
    zap: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 5 L 10 20 L 25 20 L 15 35 L 35 15 L 20 15 Z" fill="currentColor" fillOpacity="0.1" />
        </svg>
    ),
}

/* ════════════════════════════════════════════════════
   BUBBLE CONFIG — SVG icons, no emojis
════════════════════════════════════════════════════ */
const BUBBLES = [
    { id: 'custom-solutions', value: 'Custom', label: 'Built Solutions', accentName: 'blue', icon: Icons.rocket, relX: -0.26, relY: -0.30, fx: 0.012, fy: 0.008, delay: 0.05 },
    { id: 'transparency', value: 'Open', label: 'Transparent Process', accentName: 'teal', icon: Icons.diamond, relX: 0.26, relY: -0.28, fx: -0.010, fy: 0.010, delay: 0.14 },
    { id: 'tech-stack', value: 'Modern', label: 'Technology Stack', accentName: 'violet', icon: Icons.chart, relX: -0.33, relY: 0.10, fx: 0.014, fy: -0.008, delay: 0.22 },
    { id: 'scalable', value: 'Scalable', label: 'Architecture Design', accentName: 'rose', icon: Icons.shield, relX: 0.31, relY: 0.12, fx: -0.011, fy: -0.010, delay: 0.10 },
    { id: 'support', value: 'Swift', label: 'Dedicated Support', accentName: 'purple', icon: Icons.globe, relX: -0.12, relY: 0.34, fx: 0.007, fy: -0.014, delay: 0.18 },
    { id: 'partnerships', value: 'Long-Term', label: 'Client Partnerships', accentName: 'indigo', icon: Icons.zap, relX: 0.14, relY: 0.34, fx: -0.008, fy: -0.012, delay: 0.26 },
]

/* MARQUEE intentionally empty */
const MARQUEE = []

/* ────────────────────────────────────────────────
   Individual floating bubble — memo, GPU-only transforms
──────────────────────────────────────────────── */
const EdgeBubble = memo(function EdgeBubble({ bubble, spreadSpring, smX, smY, sectionW, sectionH }) {
    const x = useTransform(
        [spreadSpring, smX, sectionW],
        ([s, mx, w]) => s * bubble.relX * w + mx * bubble.fx
    )
    const y = useTransform(
        [spreadSpring, smY, sectionH],
        ([s, my, h]) => s * bubble.relY * h + my * bubble.fy
    )

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22, delay: bubble.delay }}
            style={{
                position: 'absolute', left: '50%', top: '50%',
                translateX: '-50%', translateY: '-50%',
                x, y, zIndex: 10, willChange: 'transform',
            }}
        >
            <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{
                    padding: '16px 22px',
                    borderRadius: '20px',
                    background: `var(--bg-secondary)`,
                    border: `1px solid var(--border-subtle)`,
                    textAlign: 'center',
                    userSelect: 'none',
                    minWidth: '128px',
                    cursor: 'default',
                }}
            >
                {/* Quality SVG icon */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 10px',
                    color: `var(--accent-${bubble.accentName})`,
                    transform: 'scale(1.2)'
                }}>
                    {bubble.icon}
                </div>

                <div style={{
                    fontSize: '1.7rem', fontWeight: 900,
                    letterSpacing: '-0.04em', lineHeight: 1,
                    color: `var(--accent-${bubble.accentName})`, marginBottom: '4px',
                }}>
                    {bubble.value}
                </div>
                <div style={{
                    fontSize: '0.6rem', fontWeight: 700,
                    letterSpacing: '0.07em', textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                }}>
                    {bubble.label}
                </div>
                <div style={{
                    height: '1.5px', borderRadius: '2px',
                    background: `linear-gradient(90deg, transparent, var(--accent-${bubble.accentName}), transparent)`,
                    marginTop: '10px', opacity: 0.45,
                }} />
            </motion.div>
        </motion.div>
    )
})

/* ────────────────────────────────────────────────
   Marquee belt (empty MARQUEE guard)
──────────────────────────────────────────────── */
function MarqueeStrip({ reverse = false }) {
    if (MARQUEE.length === 0) return null
    const items = [...MARQUEE, ...MARQUEE, ...MARQUEE]
    return (
        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', padding: '13px 0', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <motion.div
                style={{ display: 'inline-flex', gap: '28px', alignItems: 'center' }}
                animate={{ x: reverse ? [0, '33.33%'] : [0, '-33.33%'] }}
                transition={{ repeat: Infinity, duration: 26, ease: 'linear' }}
            >
                {items.map((item, i) => (
                    <span key={i} style={{ fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', flexShrink: 0, color: i % 2 === 0 ? 'rgba(165,180,252,0.45)' : 'rgba(255,255,255,0.13)', display: 'inline-flex', alignItems: 'center', gap: '22px' }}>
                        {item}
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(91,124,247,0.45)', display: 'inline-block' }} />
                    </span>
                ))}
            </motion.div>
        </div>
    )
}

/* ────────────────────────────────────────────────
   Orbiting ring — GPU rotation only
──────────────────────────────────────────────── */
const OrbitRing = memo(function OrbitRing({ smX, smY }) {
    const rx = useTransform(smY, v => v * 0.003)
    const ry = useTransform(smX, v => v * 0.003)
    return (
        <motion.div
            aria-hidden="true"
            style={{
                position: 'absolute', top: '50%', left: '50%',
                width: '460px', height: '460px', borderRadius: '50%',
                border: '1px solid var(--border-subtle)',
                translateX: '-50%', translateY: '-50%',
                rotateX: rx, rotateY: ry,
                transformStyle: 'preserve-3d', perspective: '1200px',
                pointerEvents: 'none', zIndex: 0, willChange: 'transform',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 52, repeat: Infinity, ease: 'linear' }}
        >
            <div style={{ position: 'absolute', top: '-4px', left: '50%', marginLeft: '-4px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-blue)', boxShadow: '0 0 12px var(--accent-blue)' }} />
        </motion.div>
    )
})

/* ════════════════════════════════════════════════════
   MAIN OUR EDGE SECTION
════════════════════════════════════════════════════ */
export default function OurEdgeSection() {
    const sectionRef = useRef(null)
    const roRef = useRef(null)

    const sectionW = useMotionValue(1100)
    const sectionH = useMotionValue(640)

    const initDims = useCallback((el) => {
        if (!el) { roRef.current?.disconnect(); return }
        // Use ResizeObserver entry.contentRect — zero forced reflow
        roRef.current = new ResizeObserver((entries) => {
            const { width, height } = entries[0].contentRect
            sectionW.set(width)
            sectionH.set(height)
        })
        roRef.current.observe(el)
    }, [sectionW, sectionH])

    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
    const spreadRaw = useTransform(scrollYProgress, [0, 0.28, 0.72, 1], [0.45, 1, 1, 0.45])
    const spreadSpring = useSpring(spreadRaw, { stiffness: 28, damping: 30, restDelta: 0.001 })

    const rawX = useMotionValue(0)
    const rawY = useMotionValue(0)
    const smX = useSpring(rawX, { stiffness: 45, damping: 30 })
    const smY = useSpring(rawY, { stiffness: 45, damping: 30 })

    const spotX = useMotionValue(-9999)
    const spotY = useMotionValue(-9999)
    const spX = useSpring(spotX, { stiffness: 120, damping: 28 })
    const spY = useSpring(spotY, { stiffness: 120, damping: 28 })
    const spotOpacity = useMotionValue(0)

    const rafMouseRef = useRef(null)
    const onMouseMove = useCallback((e) => {
        // Throttle with rAF — only one update per frame
        if (rafMouseRef.current) return
        rafMouseRef.current = requestAnimationFrame(() => {
            rafMouseRef.current = null
            const rect = sectionRef.current?.getBoundingClientRect()
            if (!rect) return
            rawX.set(e.clientX - (rect.left + rect.width / 2))
            rawY.set(e.clientY - (rect.top + rect.height / 2))
            spotX.set(e.clientX - rect.left)
            spotY.set(e.clientY - rect.top)
            spotOpacity.set(1)
        })
    }, [rawX, rawY, spotX, spotY, spotOpacity])

    const onMouseLeave = useCallback(() => {
        rawX.set(0); rawY.set(0); spotOpacity.set(0)
    }, [rawX, rawY, spotOpacity])

    const headX = useTransform(smX, v => -v * 0.014)
    const headY = useTransform(smY, v => -v * 0.009)

    const setRef = useCallback((el) => {
        sectionRef.current = el
        initDims(el)
    }, [initDims])

    return (
        <section
            ref={setRef}
            id="our-edge"
            style={{
                position: 'relative', overflow: 'hidden',
                // contentVisibility:auto skips rendering when off-screen
                contentVisibility: 'auto',
                containIntrinsicBlockSize: '90vh',
            }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
        >
            <div className="section-divider absolute top-0 left-0 right-0" style={{ zIndex: 5 }} />

            {/* ════ DESKTOP INTERACTIVE VIEW ════ */}
            <div className="hidden md:flex flex-col" style={{ minHeight: '90vh' }}>
                {/* Static ambient */}
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--grid-lines) 1px, transparent 1px), linear-gradient(90deg, var(--grid-lines) 1px, transparent 1px)', backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 100%)' }} />
                </div>
                {/* Cursor spotlight */}
                <motion.div aria-hidden="true" style={{ position: 'absolute', pointerEvents: 'none', width: '480px', height: '480px', borderRadius: '50%', left: spX, top: spY, translateX: '-50%', translateY: '-50%', background: 'var(--glow-spotlight)', opacity: spotOpacity, zIndex: 1, willChange: 'transform, opacity' }} />
                <MarqueeStrip />
                <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', padding: '60px 24px', perspective: '1200px' }}>
                    <OrbitRing smX={smX} smY={smY} />
                    {BUBBLES.map(bubble => (
                        <EdgeBubble key={bubble.id} bubble={bubble} spreadSpring={spreadSpring} smX={smX} smY={smY} sectionW={sectionW} sectionH={sectionH} />
                    ))}
                    <motion.div style={{ x: headX, y: headY, position: 'relative', zIndex: 20, textAlign: 'center', pointerEvents: 'none' }}>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                            <h2 style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4rem)', lineHeight: 1.05, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: '0 0 18px' }}>
                                Why Luminate Labs<br /><span className="gradient-text">By Design.</span>
                            </h2>
                            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '320px', lineHeight: 1.75, margin: '0 auto 28px' }}>
                                We don&apos;t operate as a vendor. We become your dedicated technology partner — embedded in your product journey from day one.
                            </p>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '7px 16px', borderRadius: '100px', background: 'var(--accent-blue-bg)', border: '1px solid var(--accent-blue-border)', pointerEvents: 'auto' }}>
                                <motion.span animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }} style={{ fontSize: '0.95rem', lineHeight: 1, color: 'var(--accent-blue)' }}>↕</motion.span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Scroll to Expand</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
                <MarqueeStrip reverse />
            </div>

            {/* ════ MOBILE STAT GRID VIEW ════ */}
            <div className="md:hidden relative" style={{ background: 'transparent' }}>
                {/* Mobile ambient */}
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(var(--grid-lines) 1px, transparent 1px)', backgroundSize: '24px 24px', maskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 0%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 0%, transparent 100%)' }} />
                </div>

                <div className="relative z-10 px-5 pt-16 pb-10">
                    {/* Heading */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}
                        className="text-center mb-10">
                        <h2 style={{ fontSize: 'clamp(2.2rem, 9vw, 3rem)', lineHeight: 1.08, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: '0 0 12px' }}>
                            Why Luminate Labs<br /><span className="gradient-text">By Design.</span>
                        </h2>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.75 }}>
                            We don&apos;t operate as a vendor. We become your dedicated technology partner — embedded in your product journey from day one.
                        </p>
                    </motion.div>

                    {/* 2×3 stat card grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        {BUBBLES.map((bubble, i) => (
                            <motion.div
                                key={bubble.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    borderRadius: 18,
                                    background: `var(--bg-secondary)`,
                                    border: `1px solid var(--border-subtle)`,
                                    padding: '18px 14px',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                                }}
                            >
                                {/* Icon */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: `var(--accent-${bubble.accentName})`, marginBottom: 10, transform: 'scale(1.2)' }}>
                                    {bubble.icon}
                                </div>
                                {/* Value */}
                                <div style={{ fontSize: '1.65rem', fontWeight: 900, letterSpacing: '-0.04em', color: `var(--accent-${bubble.accentName})`, lineHeight: 1, marginBottom: 4 }}>
                                    {bubble.value}
                                </div>
                                {/* Label */}
                                <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)' }}>
                                    {bubble.label}
                                </div>
                                {/* Bottom line */}
                                <div style={{ height: 1.5, width: '60%', borderRadius: 2, background: `linear-gradient(90deg, transparent, var(--accent-${bubble.accentName}), transparent)`, marginTop: 10, opacity: 0.4 }} />
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA row */}
                    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.5 }}
                        className="mt-10 text-center">
                        <a href="#cta" className="btn-primary" style={{ display: 'inline-flex', width: '100%', maxWidth: 300, justifyContent: 'center' }}>
                            Start Your Project
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </a>
                    </motion.div>
                </div>
            </div>

            <div className="section-divider absolute bottom-0 left-0 right-0" />
        </section>
    )
}

