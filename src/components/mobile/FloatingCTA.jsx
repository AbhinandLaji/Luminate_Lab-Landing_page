import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * FloatingCTA — sticky bottom booking bar (mobile only, md:hidden)
 * 
 * - Slides up after 2s or after user scrolls 80px
 * - Hides when the #cta section is in view (no double-up)
 * - Respects iOS safe-area-inset-bottom (notch/home indicator)
 * - Semi-transparent glass background
 */
export default function FloatingCTA() {
    const [visible, setVisible] = useState(false)
    const [hiddenByCTA, setHiddenByCTA] = useState(false)
    const timerRef = useRef(null)

    useEffect(() => {
        // Show after 2s OR after 80px scroll, whichever comes first
        timerRef.current = setTimeout(() => setVisible(true), 2000)

        const onScroll = () => {
            if (window.scrollY > 80) setVisible(true)
        }
        window.addEventListener('scroll', onScroll, { passive: true })

        // Observe #cta section — hide bar when it's visible
        const ctaEl = document.getElementById('cta')
        let io
        if (ctaEl) {
            io = new IntersectionObserver(
                ([entry]) => setHiddenByCTA(entry.isIntersecting),
                { threshold: 0.15 }
            )
            io.observe(ctaEl)
        }

        return () => {
            clearTimeout(timerRef.current)
            window.removeEventListener('scroll', onScroll)
            io?.disconnect()
        }
    }, [])

    const show = visible && !hiddenByCTA

    return (
        // Only rendered on mobile (md:hidden via wrapper)
        <div className="md:hidden">
            <AnimatePresence>
                {show && (
                    <motion.div
                        key="floating-cta"
                        initial={{ y: 120, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 120, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 340, damping: 32 }}
                        style={{
                            position: 'fixed',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            zIndex: 9999,
                            background: 'var(--glass-bg)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            borderTop: '1px solid var(--border-subtle)',
                            paddingBottom: 'env(safe-area-inset-bottom, 12px)',
                            paddingTop: '12px',
                            paddingLeft: '16px',
                            paddingRight: '16px',
                        }}
                    >
                        {/* Subtle accent glow at top edge */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                            background: 'linear-gradient(90deg, transparent, var(--accent-blue), var(--accent-violet), transparent)',
                        }} />

                        <a
                            href="#cta"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%',
                                padding: '14px 20px',
                                borderRadius: '14px',
                                background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-violet) 100%)',
                                textDecoration: 'none',
                                boxShadow: '0 8px 32px var(--accent-blue-bg)',
                            }}
                        >
                            <div>
                                <div style={{ fontSize: '0.97rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                                    Book a Strategy Call
                                </div>
                                <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.04em', marginTop: '2px' }}>
                                    Free · No commitment · 50+ brands scaled
                                </div>
                            </div>
                            {/* Arrow icon */}
                            <div style={{
                                width: 40, height: 40, borderRadius: '50%',
                                background: 'rgba(255,255,255,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M4 9h10M10 5l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
