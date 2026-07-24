import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, useMotionValue, useAnimate, stagger } from 'framer-motion'
import SwipeCarousel from './mobile/SwipeCarousel'
import GradualBlur from './GradualBlur'
/* ══════════════════════════════════════════════════════
   PROBLEM DATA
══════════════════════════════════════════════════════ */
const problems = [
    {
        number: '01', accentName: 'blue',
        title: ['Outdated', 'Digital', 'Presence.'],
        hook: 'First impressions define your brand.',
        desc: 'An outdated or slow website signals distrust. Customers compare you to competitors instantly. Without a modern, fast, and responsive digital presence, you lose opportunities before a conversation even begins.',
        stat: { value: 'Now', unit: 'the right time to modernize', context: 'A modern digital presence is your most powerful business asset' },
    },
    {
        number: '02', accentName: 'violet',
        title: ['Manual &', 'Repetitive', 'Workflows.'],
        hook: 'Time spent on repetition is time lost to growth.',
        desc: 'Teams bogged down by manual data entry, repetitive tasks, and disconnected tools cannot focus on what matters. Custom software automation frees your team to do higher-value work and scales without adding headcount.',
        stat: { value: 'High', unit: 'cost of manual processes', context: 'Automation eliminates error-prone workflows and unlocks operational efficiency' },
    },
    {
        number: '03', accentName: 'teal',
        title: ['Poor User', 'Experience', 'Design.'],
        hook: 'Confusion drives users away.',
        desc: 'Unintuitive interfaces frustrate users and erode trust. Poor UX directly impacts retention, satisfaction, and revenue. Great design is not cosmetic — it is a competitive advantage that drives measurable product success.',
        stat: { value: 'Critical', unit: 'role of UX in product success', context: 'Intuitive design reduces friction and keeps users engaged with your product' },
    },
    {
        number: '04', accentName: 'rose',
        title: ['Disconnected', 'Business', 'Systems.'],
        hook: 'Data silos slow every decision.',
        desc: 'When your tools do not talk to each other, data lives in silos and teams work with incomplete information. Custom integrations and unified platforms eliminate gaps, streamline operations, and give leadership real-time clarity.',
        stat: { value: 'Zero', unit: 'tolerance for data silos', context: 'Integrated systems give your team a single source of truth across every department' },
    },
    {
        number: '05', accentName: 'orange',
        title: ['No Tech', 'Competitive', 'Advantage.'],
        hook: 'Technology is the new differentiator.',
        desc: 'Businesses that fail to adopt AI, automation, and modern software fall behind those that do. A tailored technology strategy — from intelligent features to scalable architecture — is what separates leaders from followers in every industry.',
        stat: { value: 'Future', unit: 'built on smart technology', context: 'AI-powered tools and modern platforms give businesses a lasting competitive edge' },
    },
]
const N = problems.length

/* ──────────────────────────────────────────────
   Ambient background per panel — pure MV
────────────────────────────────────────────── */
function ProblemBg({ p, idx, scrollY }) {
    const phase = useTransform(scrollY, v => (v - (idx + 0.5) / N) * N)
    const opacity = useTransform(phase, [-0.85, -0.4, 0.4, 0.85], [0, 1, 1, 0])
    return (
        <motion.div aria-hidden style={{ position: 'absolute', inset: 0, opacity, pointerEvents: 'none', zIndex: 0, willChange: 'opacity' }}>
            <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: 700, height: 700, background: `radial-gradient(circle, var(--accent-${p.accentName}-bg) 0%,transparent 70%)` }} />
            <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: 500, height: 500, background: `radial-gradient(circle, var(--accent-${p.accentName}-bg) 0%,transparent 65%)` }} />
        </motion.div>
    )
}

/* ──────────────────────────────────────────────
   Big watermark number — pure MV
────────────────────────────────────────────── */
function Watermark({ p, idx, scrollY }) {
    const phase = useTransform(scrollY, v => (v - (idx + 0.5) / N) * N)
    const opacity = useTransform(phase, [-0.85, -0.4, 0.4, 0.85], [0, 0.045, 0.045, 0])
    const scale = useTransform(phase, [-0.8, 0, 0.8], [1.15, 1, 1.15])
    return (
        <motion.div aria-hidden style={{
            position: 'absolute', right: '-2%', top: '50%', translateY: '-50%',
            fontSize: 'clamp(12rem,24vw,20rem)', fontWeight: 900, lineHeight: 1,
            letterSpacing: '-0.08em', color: `var(--accent-${p.accentName})`, opacity, scale,
            pointerEvents: 'none', userSelect: 'none', zIndex: 1,
        }}>
            {p.number}
        </motion.div>
    )
}

/* ──────────────────────────────────────────────
   Stat number count-up animation
────────────────────────────────────────────── */
function StatCountUp({ value, isActive }) {
    const [displayVal, setDisplayVal] = useState('0')

    useEffect(() => {
        if (!isActive) {
            setDisplayVal('0')
            return
        }

        const match = value.match(/^([^\d]*)([\d.]+)(.*)$/)
        if (!match) {
            setDisplayVal(value)
            return
        }

        const prefix = match[1]
        const numVal = parseFloat(match[2])
        const suffix = match[3]

        let startTimestamp = null
        const duration = 850

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp
            const elapsed = timestamp - startTimestamp
            const progress = Math.min(elapsed / duration, 1)

            const easeProgress = 1 - Math.pow(1 - progress, 3)
            const currentNum = numVal * easeProgress

            const formattedNum = Number.isInteger(numVal)
                ? Math.floor(currentNum).toString()
                : currentNum.toFixed(1)

            setDisplayVal(`${prefix}${formattedNum}${suffix}`)

            if (progress < 1) {
                window.requestAnimationFrame(step)
            }
        }

        const animFrame = window.requestAnimationFrame(step)
        return () => window.cancelAnimationFrame(animFrame)
    }, [value, isActive])

    return displayVal
}

/* ──────────────────────────────────────────────
   HYBRID panel:
   — Outer move/opacity: pure MV (always smooth)
   — Inner reveals: useAnimate fired by phase threshold
 ────────────────────────────────────────────── */
function ProblemPanel({ p, idx, activeIdx }) {
    const isActive = idx === activeIdx
    const isPast = idx < activeIdx

    const opacity = isActive ? 1 : 0
    const y = isActive ? 0 : (isPast ? -72 : 72)
    const scale = isActive ? 1 : (isPast ? 0.94 : 0.97)
    const rotate = isActive ? 0 : (isPast ? -2.5 : 2.5)

    // Inner — imperative via useAnimate (rich animations, fired on panel entry)
    const [scope, run] = useAnimate()
    const active = useRef(false)

    useEffect(() => {
        if (isActive && !active.current) {
            active.current = true
            // Choreographed stagger: badge -> heading -> stat card -> description/hook
            run('.pb', { opacity: 1, y: 0 }, { delay: 0.0, type: 'spring', stiffness: 120, damping: 15 })
            run('.pl', { opacity: 1, y: 0 }, { delay: stagger(0.06, { startDelay: 0.08 }), type: 'spring', stiffness: 110, damping: 14 })
            run('.ps', { opacity: 1, x: 0, scale: 1 }, { delay: 0.20, type: 'spring', stiffness: 95, damping: 13 })
            run('.ph', { opacity: 1, y: 0 }, { delay: 0.28, type: 'spring', stiffness: 100, damping: 15 })
            run('.pd', { opacity: 1, y: 0 }, { delay: 0.36, type: 'spring', stiffness: 100, damping: 15 })
        } else if (!isActive && active.current) {
            active.current = false
            // Smooth reset to prevent visual pop
            run('.pb', { opacity: 0, y: 14 }, { duration: 0.25, ease: 'easeOut' })
            run('.pl', { opacity: 0, y: 24 }, { duration: 0.25, ease: 'easeOut' })
            run('.ph', { opacity: 0, y: 14 }, { duration: 0.25, ease: 'easeOut' })
            run('.pd', { opacity: 0, y: 14 }, { duration: 0.25, ease: 'easeOut' })
            run('.ps', { opacity: 0, x: 32, scale: 0.96 }, { duration: 0.25, ease: 'easeOut' })
        }
    }, [isActive, run])

    return (
        <motion.div
            animate={{ opacity, y, scale, rotate }}
            transition={{
                opacity: { duration: 0.4 },
                y: { type: 'spring', stiffness: 85, damping: 14 },
                scale: { type: 'spring', stiffness: 85, damping: 14 },
                rotate: { type: 'spring', stiffness: 65, damping: 12 }
            }}
            style={{
                position: 'absolute', inset: 0, zIndex: isActive ? 5 : 4,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '0 24px',
                pointerEvents: isActive ? 'auto' : 'none',
                willChange: 'transform,opacity',
            }}
        >
            <div ref={scope} style={{ maxWidth: 960, width: '100%' }}>
                {/* Label row */}
                <motion.div className="pb" initial={{ opacity: 0, y: 14 }} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 44 }}>
                    <span style={{ padding: '5px 14px', borderRadius: 100, background: `var(--accent-${p.accentName}-bg)`, border: `1px solid var(--accent-${p.accentName}-border)`, fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: `var(--accent-${p.accentName})` }}>
                        The Challenge
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-faint)', letterSpacing: '0.06em' }}>
                        Problem {p.number}
                    </span>
                </motion.div>

                {/* Two-column grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>

                    {/* LEFT — title + copy */}
                    <div>
                        {p.title.map((line, i) => (
                            <motion.div
                                key={i}
                                className="pl"
                                initial={{ opacity: 0, y: 24 }}
                                style={{
                                    fontSize: 'clamp(2.6rem,6.5vw,5.5rem)',
                                    fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.04em', display: 'block',
                                    color: i === p.title.length - 1 ? `var(--accent-${p.accentName})` : 'var(--text-primary)',
                                }}
                            >
                                {line}
                            </motion.div>
                        ))}

                        <motion.p
                            className="ph"
                            initial={{ opacity: 0, y: 14 }}
                            style={{ marginTop: 24, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.55 }}
                        >
                            &ldquo;{p.hook}&rdquo;
                        </motion.p>

                        <motion.p
                            className="pd"
                            initial={{ opacity: 0, y: 14 }}
                            style={{ marginTop: 16, fontSize: '0.96rem', color: 'var(--text-muted)', lineHeight: 1.82, maxWidth: 420 }}
                        >
                            {p.desc}
                        </motion.p>
                    </div>

                    {/* RIGHT — stat card */}
                    <motion.div
                        className="ps"
                        initial={{ opacity: 0, x: 32, scale: 0.96 }}
                        style={{
                            padding: 40, borderRadius: 24,
                            background: `linear-gradient(145deg, var(--bg-card), var(--accent-${p.accentName}-bg))`,
                            border: `1px solid var(--accent-${p.accentName}-border)`,
                            backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                            position: 'relative', overflow: 'hidden',
                            willChange: 'transform,opacity',
                        }}
                    >
                        <div aria-hidden style={{ position: 'absolute', bottom: '-30%', right: '-10%', width: 280, height: 280, borderRadius: '50%', background: `radial-gradient(circle, var(--accent-${p.accentName}-bg) 0%, transparent 70%)`, pointerEvents: 'none' }} />
                        <div style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.05em', color: `var(--accent-${p.accentName})`, position: 'relative', zIndex: 2 }}>
                            <StatCountUp value={p.stat.value} isActive={isActive} />
                        </div>
                        <div style={{ marginTop: 14, position: 'relative', zIndex: 2 }}>
                            <div style={{ fontSize: '0.93rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>{p.stat.unit}</div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>{p.stat.context}</div>
                        </div>
                        <div aria-hidden style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent, var(--accent-${p.accentName}),transparent)` }} />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}

/* ──────────────────────────────────────────────
   Progress pills — pure MV
────────────────────────────────────────────── */
function Dot({ idx, scrollY, accentName }) {
    const phase = useTransform(scrollY, v => Math.abs((v - (idx + 0.5) / N) * N))
    const width = useTransform(phase, [0, 0.5, 1.2], [28, 10, 8])
    const opacity = useTransform(phase, [0, 0.55, 1.2], [1, 0.45, 0.2])
    return <motion.div style={{ width, height: 8, borderRadius: 4, background: `var(--accent-${accentName})`, opacity, flexShrink: 0 }} />
}

/* ──────────────────────────────────────────────
   Mobile card
────────────────────────────────────────────── */
function MobileCard({ p }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            style={{ borderRadius: 20, padding: '26px 22px', marginBottom: 14, background: `linear-gradient(145deg, var(--bg-card), var(--accent-${p.accentName}-bg))`, border: `1px solid var(--accent-${p.accentName}-border)`, position: 'relative', overflow: 'hidden' }}
        >
            <span style={{ fontSize: '0.64rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: `var(--accent-${p.accentName})` }}>Problem {p.number}</span>
            <h3 style={{ fontSize: 'clamp(1.6rem,6vw,2.3rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, color: 'var(--text-primary)', margin: '10px 0 6px' }}>
                {p.title.join(' ')}
            </h3>
            <div style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.04em', color: `var(--accent-${p.accentName})`, lineHeight: 1, marginBottom: 5 }}>
                {p.stat.value}
            </div>
            <div style={{ fontSize: '0.77rem', color: 'var(--text-muted)', marginBottom: 12 }}>{p.stat.unit} — {p.stat.context}</div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.72 }}>{p.desc}</p>
            <div aria-hidden style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,var(--accent-${p.accentName}),transparent)` }} />
        </motion.div>
    )
}

/* ══════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════ */
export default function ProblemSection() {
    const sectionRef = useRef(null)
    const { scrollYProgress: sectionProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'start start']
    })

    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })

    const [activeIdx, setActiveIdx] = useState(-1)

    useMotionValueEvent(scrollYProgress, 'change', latest => {
        if (latest <= 0.015) {
            if (activeIdx !== -1) {
                setActiveIdx(-1)
            }
            return
        }

        const progressPerCard = 1 / N
        const rawIndex = latest / progressPerCard
        const roundedIndex = Math.min(N - 1, Math.max(0, Math.floor(rawIndex)))
        if (roundedIndex !== activeIdx) {
            setActiveIdx(roundedIndex)
        }
    })

    const isScrollingMV = useMotionValue(0)
    useEffect(() => {
        let timeoutId
        const handleScroll = () => {
            isScrollingMV.set(1)
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => isScrollingMV.set(0), 35)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => {
            window.removeEventListener('scroll', handleScroll)
            clearTimeout(timeoutId)
        }
    }, [])

    return (
        <section ref={sectionRef} id="problem" style={{ position: 'relative' }}>
            <div className="section-divider absolute top-0 left-0 right-0" style={{ zIndex: 10 }} />

            {/* ══ DESKTOP — 500vh sticky ══ */}
            <div ref={containerRef} className="hidden lg:block" style={{ height: `${N * 100}vh`, position: 'relative' }}>
                <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
                    <motion.div style={{ opacity: isScrollingMV, pointerEvents: 'none', zIndex: 30 }}>
                        <GradualBlur
                            target="parent"
                            position="top"
                            height="5.5rem"
                            strength={1.5}
                            divCount={4}
                            curve="bezier"
                            animated={false}
                            opacity={1}
                        />
                        <GradualBlur
                            target="parent"
                            position="bottom"
                            height="5.5rem"
                            strength={1.5}
                            divCount={4}
                            curve="bezier"
                            animated={false}
                            opacity={1}
                        />
                    </motion.div>

                    {/* Subtle grid */}
                    <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: 'linear-gradient(var(--grid-lines) 1px,transparent 1px),linear-gradient(90deg,var(--grid-lines) 1px,transparent 1px)', backgroundSize: '64px 64px', maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%,black 0%,transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%,black 0%,transparent 100%)' }} />

                    {problems.map((p, i) => <ProblemBg key={p.number} p={p} idx={i} scrollY={scrollYProgress} />)}
                    {problems.map((p, i) => <Watermark key={p.number} p={p} idx={i} scrollY={scrollYProgress} />)}
                    {problems.map((p, i) => <ProblemPanel key={p.number} p={p} idx={i} activeIdx={activeIdx} />)}

                    {/* Progress pills */}
                    <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 8, zIndex: 20 }}>
                        {problems.map((p, i) => <Dot key={p.number} idx={i} scrollY={scrollYProgress} accentName={p.accentName} />)}
                    </div>

                    {/* Scroll cue */}
                    <div aria-hidden style={{ position: 'absolute', right: 28, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 20 }}>
                        <span style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-faint)', writingMode: 'vertical-rl' }}>scroll</span>
                        <motion.div animate={{ scaleY: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }} style={{ width: 1, height: 48, background: 'linear-gradient(180deg,var(--border-accent),transparent)', transformOrigin: 'top' }} />
                    </div>
                </div>
            </div>

            {/* ══ MOBILE — horizontal swipe carousel ══ */}
            <div className="lg:hidden relative">
                <motion.div style={{ opacity: isScrollingMV, pointerEvents: 'none', zIndex: 30 }}>
                    <GradualBlur
                        target="parent"
                        position="top"
                        height="2.5rem"
                        strength={0.8}
                        divCount={3}
                        curve="bezier"
                        animated={false}
                        opacity={1}
                    />
                    <GradualBlur
                        target="parent"
                        position="bottom"
                        height="2.5rem"
                        strength={0.8}
                        divCount={3}
                        curve="bezier"
                        animated={false}
                        opacity={1}
                    />
                </motion.div>

                {/* Section header */}
                <div style={{ textAlign: 'center', padding: '64px 20px 32px' }}>
                    <span className="section-label">The Challenge</span>
                    <h2 style={{ fontSize: 'clamp(2rem, 8vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginTop: 16, lineHeight: 1.1 }}>
                        Most Businesses Are<br />Held Back by Technology
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 10 }}>Swipe to explore each challenge →</p>
                </div>

                <SwipeCarousel
                    items={problems}
                    keyProp={p => p.number}
                    accentFn={p => `var(--accent-${p.accentName})`}
                    cardWidth="82vw"
                    gap={12}
                    renderItem={(p) => (
                        <div style={{
                            borderRadius: 24, overflow: 'hidden',
                            background: `linear-gradient(160deg, var(--bg-card) 0%, var(--accent-${p.accentName}-bg) 100%)`,
                            border: `1px solid var(--accent-${p.accentName}-border)`,
                            padding: '28px 24px 24px',
                            position: 'relative',
                            minHeight: 380,
                            display: 'flex', flexDirection: 'column',
                        }}>
                            {/* Top badge row */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                                <span style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: `var(--accent-${p.accentName})`, padding: '4px 12px', borderRadius: 100, background: `var(--accent-${p.accentName}-bg)`, border: `1px solid var(--accent-${p.accentName}-border)` }}>
                                    Problem {p.number}
                                </span>
                                <span style={{ fontSize: '0.6rem', color: 'var(--text-faint)', fontWeight: 600, letterSpacing: '0.08em' }}>THE CHALLENGE</span>
                            </div>

                            {/* Title */}
                            <h3 style={{ fontSize: 'clamp(1.8rem, 7vw, 2.4rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.05, color: 'var(--text-primary)', marginBottom: 18 }}>
                                {p.title.map((l, i) => (
                                    <span key={i} style={{ display: 'block', color: i === p.title.length - 1 ? `var(--accent-${p.accentName})` : 'var(--text-primary)' }}>{l}</span>
                                ))}
                            </h3>

                            {/* Stat big number */}
                            <div style={{ fontSize: 'clamp(2.2rem,8vw,3rem)', fontWeight: 900, letterSpacing: '-0.05em', color: `var(--accent-${p.accentName})`, lineHeight: 1, marginBottom: 6 }}>
                                {p.stat.value}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
                                <strong style={{ color: 'var(--text-secondary)' }}>{p.stat.unit}</strong> — {p.stat.context}
                            </div>

                            {/* Hook quote */}
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.65, marginTop: 'auto', borderTop: `1px solid var(--accent-${p.accentName}-border)`, paddingTop: 14 }}>
                                &ldquo;{p.hook}&rdquo;
                            </p>

                            {/* Bottom accent line */}
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, var(--accent-${p.accentName}), transparent)` }} />
                        </div>
                    )}
                />

                <div style={{ height: 48 }} />
            </div>

            <div className="section-divider absolute bottom-0 left-0 right-0" />
        </section>
    )
}