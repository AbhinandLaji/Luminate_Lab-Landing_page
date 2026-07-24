import AnimatedSection, { AnimatedItem } from './AnimatedSection'
import { motion } from 'framer-motion'

const points = [
    'No long-term contracts required',
    'Custom-built for your business needs',
    'Dedicated engineering team from Day 1',
]

export default function CTASection() {
    return (
        <section
            id="cta"
            className="relative py-8 md:py-12 px-5 md:px-6 overflow-hidden"
            style={{ background: 'var(--bg-primary)' }}
        >
            <div className="section-divider absolute top-0 left-0 right-0" />

            <AnimatedSection stagger={true} staggerDelay={0.06} className="relative z-10 max-w-4xl mx-auto">
                {/* Mesh Gradient Background (Centered behind the card) */}
                <div className="absolute inset-0 z-0 overflow-visible pointer-events-none rounded-2xl md:rounded-3xl flex items-center justify-center" aria-hidden="true">
                    <div className="mesh-blob blob-1" />
                    <div className="mesh-blob blob-2" />
                    <div className="mesh-blob blob-3" />
                </div>

                {/* Glass card wrapper - Frosts the mesh gradient behind it */}
                <div
                    className="glass relative z-10 rounded-2xl md:rounded-3xl p-6 md:p-8 text-center"
                    style={{
                        boxShadow: 'var(--shadow-card)',
                    }}
                >
                    <AnimatedItem direction="up" distance={12}>
                        <span className="section-label">Ready to Build?</span>
                    </AnimatedItem>

                    <AnimatedItem direction="up" distance={16}>
                        <h2
                            className="mt-4 mb-3 font-black"
                            style={{
                                fontSize: 'clamp(1.8rem, 5vw, 3.8rem)',
                                lineHeight: 1.06,
                                letterSpacing: '-0.04em',
                                color: 'var(--text-primary)',
                            }}
                        >
                            Stop Waiting.<br />
                            <span className="gradient-text">Start Building Something Great.</span>
                        </h2>
                    </AnimatedItem>

                    <AnimatedItem direction="up" distance={16}>
                        <p
                            className="mb-5 max-w-lg mx-auto"
                            style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.7 }}
                        >
                            One conversation to understand your vision. A dedicated team to bring it to life.
                        </p>
                    </AnimatedItem>

                    {/* Checklist */}
                    <AnimatedItem direction="up" distance={16}>
                        <div className="flex flex-col items-center justify-center gap-2 mb-5">
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
                    </AnimatedItem>

                    {/* CTA Button with Framer spring */}
                    <AnimatedItem direction="scale" distance={0}>
                        <motion.a
                            href="https://wa.me/919496070442"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary cta-btn-glow"
                            style={{ 
                                fontSize: '1rem', 
                                padding: '16px 32px', 
                                display: 'inline-flex', 
                                maxWidth: 340, 
                                width: '100%', 
                                justifyContent: 'center',
                                animation: 'ctaButtonGlow 1.5s ease-out 0.4s 2'
                            }}
                            whileHover={{ scale: 1.04, y: -3 }}
                            whileTap={{ scale: 0.96 }}
                            transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                        >
                            Book a Free Consultation
                            <ArrowRight />
                        </motion.a>
                    </AnimatedItem>

                    <AnimatedItem direction="up" distance={12}>
                        <p className="mt-4 text-xs" style={{ color: 'var(--text-faint)' }}>
                            No commitment. No technical jargon. Just great software.
                        </p>
                    </AnimatedItem>
                </div>
            </AnimatedSection>
        </section>
    )
}

function ArrowRight() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '8px' }}>
            <path d="M3.5 9h11M10 5l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}
