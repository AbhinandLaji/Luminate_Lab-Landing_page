import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 200,
        damping: 30,
        restDelta: 0.001,
    })

    return (
        <motion.div
            style={{
                scaleX,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                transformOrigin: '0%',
                background: 'linear-gradient(90deg, #5b7cf7, #8b5cf6, #2dd4bf)',
                zIndex: 9999,
                pointerEvents: 'none',
                boxShadow: '0 0 10px rgba(91,124,247,0.6), 0 0 20px rgba(45,212,191,0.3)',
            }}
        />
    )
}
