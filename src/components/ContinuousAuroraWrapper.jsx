import { useRef, useState, useEffect } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'
import Strands from './Strands'

export default function ContinuousAuroraWrapper({ children }) {
    const containerRef = useRef(null)
    const [isDesktop, setIsDesktop] = useState(false)
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
        const mq = window.matchMedia('(min-width: 1024px)')
        setIsDesktop(mq.matches)
        const onChange = e => setIsDesktop(e.matches)
        mq.addEventListener('change', onChange)
        return () => mq.removeEventListener('change', onChange)
    }, [])

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start']
    })

    const auroraOpacity = useTransform(
        scrollYProgress,
        [0, 0.05, 0.99, 1],
        [0, 1, 1, 0]
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
                    <Strands
                        colors={themeConfig.colors}
                        count={2}
                        speed={0.12}
                        waviness={0.6}
                        scale={2.2}
                        amplitude={2.5}
                        spread={2.5}
                        glow={themeConfig.isDark ? 0.8 : 0.5}       // Reduced for less brightness
                        intensity={themeConfig.isDark ? 0.3 : 0.4}  // Reduced to keep it subtle
                        saturation={themeConfig.isDark ? 1.0 : 1.5}
                        opacity={themeConfig.isDark ? 0.35 : 0.5}   // Reduced so text is readable
                    />
                </motion.div>
            )}

            <div style={{ position: 'relative' }}>
                {children}
            </div>
        </div>
    )
}