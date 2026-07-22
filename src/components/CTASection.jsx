import AnimatedSection from './AnimatedSection'
import { motion } from 'framer-motion'

    // Inject CTA keyframes once at module load
    ; (() => {
        if (typeof document === 'undefined') return
        if (document.getElementById('cta-kf')) return
        const s = document.createElement('style')
        s.id = 'cta-kf'
        s.textContent = `
        @keyframes ctaPulse  { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:.15;transform:scale(1.15)} }
        @keyframes ctaPulse2 { 0%,100%{opacity:.25;transform:scale(1)} 50%{opacity:.08;transform:scale(1.3)} }
    `
        document.head.appendChild(s)
    })()

/* ── Checklist items ─── */
const points = [
    'No long-term contracts required',
    'Results-focused engagement model',
    'Dedicated senior strategist from Day 1',
]

export default function CTASection() {
    return (
        <section
            id="cta"
            className="relative py-20 md:py-40 px-5 md:px-6 overflow-hidden"
            style={{ background: 'var(--bg-primary)' }}
        >

            <div className="section-divider absolute top-0 left-0 right-0" />

            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center" aria-hidden="true">
                {/* Center large violet-teal orb */}
                <div style={{
                    width: '700px', height: '700px', borderRadius: '50%',
                    background: 'radial-gradient(circle, var(--accent-blue-bg) 0%, var(--accent-violet-bg) 30%, var(--accent-teal-bg) 60%, transparent 75%)',
                    animation: 'ctaPulse 5s ease-in-out infinite',
                    willChange: 'transform, opacity',
                }} />
                {/* Outer ring */}
                <div style={{
                    position: 'absolute',
                    width: '1000px', height: '1000px', borderRadius: '50%',
                    background: 'radial-gradient(circle, var(--accent-blue-bg) 0%, var(--accent-violet-bg) 40%, transparent 65%)',
                    animation: 'ctaPulse2 6s ease-in-out infinite',
                    willChange: 'transform, opacity',
                }} />
                {/* Rose accent — bottom left */}
                <div style={{
                    position: 'absolute', bottom: '0', left: '0',
                    width: '350px', height: '350px',
                    background: 'radial-gradient(circle, var(--accent-rose-bg) 0%, transparent 65%)',
                }} />
                {/* Indigo accent — top right */}
                <div style={{
                    position: 'absolute', top: '0', right: '0',
                    width: '300px', height: '300px',
                    background: 'radial-gradient(circle, var(--accent-blue-bg) 0%, transparent 65%)',
                }} />
            </div>


            <div className="relative z-10 max-w-4xl mx-auto">
                <AnimatedSection>
                    {/* Glass card wrapper */}
                    <div
                        className="glass rounded-2xl md:rounded-3xl p-7 sm:p-12 md:p-20 text-center"
                        style={{
                            background: 'var(--glass-bg)',
                            border: '1px solid var(--border-subtle)',
                            boxShadow: 'var(--shadow-card)',
                        }}
                    >
                        <span className="section-label">Ready to Scale?</span>

                        <h2
                            className="mt-6 md:mt-8 mb-5 md:mb-6 font-black"
                            style={{
                                fontSize: 'clamp(2.0rem, 5.5vw, 4.25rem)',
                                lineHeight: 1.06,
                                letterSpacing: '-0.04em',
                                color: 'var(--text-primary)',
                            }}
                        >
                            Stop Guessing.<br />
                            <span className="gradient-text">Start Operating with Precision.</span>
                        </h2>

                        <p
                            className="mb-10 max-w-lg mx-auto"
                            style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.7 }}
                        >
                            One strategic call. A fully architected acquisition and revenue system designed around your business model.
                        </p>

                        {/* Checklist */}
                        <div className="flex flex-col items-center justify-center gap-3 mb-8 md:mb-10">
                            {points.map(p => (
                                <div key={p} className="flex items-center gap-2">
                                    <span
                                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                                        style={{ background: 'var(--accent-blue-bg)', border: '1px solid var(--accent-blue-border)' }}
                                    >
                                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                            <path d="M1.5 4L3 5.5L6.5 2" stroke="var(--accent-blue)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Button with Framer spring */}
                        <motion.a
                            href="mailto:hello@luminatelabs.com"
                            className="btn-primary"
                            style={{ fontSize: '1rem', padding: '17px 36px', display: 'inline-flex', maxWidth: 340, width: '100%', justifyContent: 'center' }}
                            whileHover={{ scale: 1.04, y: -3 }}
                            whileTap={{ scale: 0.96 }}
                            transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                        >
                            Book Your Strategy Call
                            <ArrowRight />
                        </motion.a>

                        <p className="mt-6 text-xs" style={{ color: 'var(--text-faint)' }}>
                            No commitment. No agency jargon. Just results.
                        </p>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    )
}

function ArrowRight() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.5 9h11M10 5l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}
