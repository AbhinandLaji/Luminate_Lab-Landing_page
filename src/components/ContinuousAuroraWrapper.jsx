import { useRef, useState, useEffect } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'
import AuroraWave from './AuroraWave'

export default function ContinuousAuroraWrapper({ children }) {
    const containerRef = useRef(null)
    const [isDesktop, setIsDesktop] = useState(false)

    // Only mount AuroraWave on desktop — its per-frame path rebuilds + SVG
    // filters + mix-blend-mode are too heavy for mobile GPUs and were
    // causing scroll jank there.
    useEffect(() => {
        const mq = window.matchMedia('(min-width: 1024px)')
        setIsDesktop(mq.matches)
        const onChange = e => setIsDesktop(e.matches)
        mq.addEventListener('change', onChange)
        return () => mq.removeEventListener('change', onChange)
    }, [])

    // Track scroll across the entire wrapper's visibility
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start']
    })

    // Consolidated opacity transform:
    // 0 -> 0.05: Fade in as the top enters the screen
    // 0.05 -> 0.95: Fully visible throughout the sections
    // 0.95 -> 1.0: Fade out as the bottom leaves the screen
    const auroraOpacity = useTransform(
        scrollYProgress,
        [0, 0.05, 0.95, 1],
        [0, 1, 1, 0] // Max opacity 1.0 (AuroraWave handles the base 0.35 opacity)
    )

    return (
        <div ref={containerRef} style={{ position: 'relative' }}>
            {isDesktop && (
                <motion.div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 0,
                        pointerEvents: 'none',
                        opacity: auroraOpacity
                    }}
                >
                    <AuroraWave
                        interactive={false}
                        position="full"
                        opacity={0.35}
                        scrollYProgress={scrollYProgress}
                    />
                </motion.div>
            )}

            <div style={{ position: 'relative' }}>
                {children}
            </div>
        </div>
    )
}