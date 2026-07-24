import { motion } from 'framer-motion'
import { useMemo } from 'react'

/**
 * AnimatedSection — scroll-reveal wrapper.
 *
 * Performance rules applied:
 *  - NO filter:blur in any variant (triggers stacking context + expensive paint)
 *  - Only opacity, y, x, scale — all compositor-only properties
 *  - 'blur' direction is now treated as a faster fade+y (maintained API compat)
 *  - prefers-reduced-motion: all animations replaced with simple opacity fade
 *  - variants object is memoized per-instance to avoid recreating on every render
 *
 * direction: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade' | 'blur'
 */

// Detect reduced-motion once at module load — no overhead inside components
const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

const buildVariants = (direction, distance = 28) => {
    // Reduced-motion: only fade, no movement
    if (prefersReduced) {
        return {
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
        }
    }

    const initial = { opacity: 0 }

    if (direction === 'up') initial.y = distance
    if (direction === 'down') initial.y = -distance
    if (direction === 'left') initial.x = distance
    if (direction === 'right') initial.x = -distance
    if (direction === 'scale') { initial.scale = 0.90; initial.y = 16 }
    // 'blur' was using filter — replaced with a subtle scale+fade for same feel
    if (direction === 'blur') { initial.scale = 0.94; initial.y = 14 }

    return {
        hidden: initial,
        visible: { opacity: 1, y: 0, x: 0, scale: 1 },
    }
}

const containerVariants = (staggerDelay = 0.08) => ({
    hidden: {},
    visible: { transition: { staggerChildren: staggerDelay, delayChildren: 0 } },
})

export default function AnimatedSection({
    children,
    className = '',
    delay = 0,
    style = {},
    amount = 0.1,
    direction = 'up',
    distance = 28,
    duration = 0.65,
    stagger = false,
    staggerDelay = 0.08,
    as: Tag = 'div',
}) {
    const variants = useMemo(() => {
        const v = buildVariants(direction, distance)
        v.visible.transition = { duration, delay, ease: [0.16, 1, 0.3, 1] }
        return v
    }, [direction, distance, duration, delay])

    if (stagger) {
        return (
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount }}
                variants={containerVariants(staggerDelay)}
                className={className}
                style={style}
            >
                {children}
            </motion.div>
        )
    }

    const MotionTag = motion[Tag] || motion.div

    return (
        <MotionTag
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount }}
            variants={variants}
            className={className}
            style={style}
        >
            {children}
        </MotionTag>
    )
}

/**
 * AnimatedItem — staggered child of AnimatedSection with stagger=true
 */
export function AnimatedItem({
    children,
    className = '',
    style = {},
    direction = 'up',
    distance = 24,
    duration = 0.55,
}) {
    const variants = useMemo(() => {
        const v = buildVariants(direction, distance)
        v.visible.transition = { duration, ease: [0.16, 1, 0.3, 1] }
        return v
    }, [direction, distance, duration])

    return (
        <motion.div variants={variants} className={className} style={style}>
            {children}
        </motion.div>
    )
}