import { useRef } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'
import AuroraWave from './AuroraWave'

export default function ContinuousAuroraWrapper({ children }) {
    const containerRef = useRef(null)

    // Track scroll across all 3 sections
    const { scrollYProgress } = useScroll({
        target: containerRef,
        // Since the sections are sticky/normal and span the document, 
        // start start to end end captures the full scroll duration of this wrapper.
        offset: ['start start', 'end end']
    })

    // Fade in from Hero: 
    // In ProblemSection, the original logic was fading in as the section scrolled in.
    // The wrapper starts right at ProblemSection, so scrollYProgress=0 means top of ProblemSection is at the top of the screen.
    // Wait! Originally `target: sectionRef, offset: ['start end', 'start start']` faded in from 0 to 1.
    // When `scrollYProgress` of the wrapper is 0, `start start` has already been reached!
    // So the wrapper will already be at 100% opacity if we start here.
    // We should use `offset: ['start end', 'end end']` if we want to catch the fade-in!
    // But then scrollYProgress=0 means ProblemSection is at the bottom of the screen.
    // Let's adjust offset to capture the fade-in, and then map the crossover.
    const { scrollYProgress: fadeProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'start start']
    })

    const { scrollYProgress: fadeOutProgress } = useScroll({
        target: containerRef,
        offset: ['end end', 'end start']
    })

    // Combine fade in and fade out
    // When fadeProgress goes from 0.4 to 0.8, opacity goes 0 -> 1.
    // When fadeOutProgress goes from 0.0 to 1.0 (as the bottom of wrapper scrolls up),
    // opacity should go 1 -> 0.
    // We can use a custom useTransform that maps both:
    const auroraOpacity = useTransform(
        [fadeProgress, fadeOutProgress],
        ([inProg, outProg]) => {
            if (outProg > 0) {
                // Fading out
                return 1 - outProg
            }
            // Fading in
            return inProg < 0.85 ? 0 : inProg > 1.0 ? 1 : (inProg - 0.85) / 0.15
        }
    )

    return (
        <div ref={containerRef} style={{ position: 'relative' }}>
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

            <div style={{ position: 'relative' }}>
                {children}
            </div>
        </div>
    )
}
