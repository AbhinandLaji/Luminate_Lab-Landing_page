import { useRef, useCallback } from 'react'

/**
 * useTilt — adds a 3-D perspective tilt to any element on mouse move.
 * Returns a ref to attach to the element and event handlers.
 */
export function useTilt({ max = 12, glare = true, scale = 1.04, speed = 400 } = {}) {
    const ref = useRef(null)
    const glareRef = useRef(null)
    const animRef = useRef(null)

    const handleMouseMove = useCallback((e) => {
        const el = ref.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const cx = (e.clientX - rect.left) / rect.width - 0.5
        const cy = (e.clientY - rect.top) / rect.height - 0.5

        const rotX = -cy * max * 2
        const rotY = cx * max * 2

        cancelAnimationFrame(animRef.current)
        animRef.current = requestAnimationFrame(() => {
            el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`
            el.style.transition = `transform 200ms cubic-bezier(0.03,0.98,0.52,0.99)`
            el.style.backfaceVisibility = 'hidden'

            if (glare && glareRef.current) {
                const angle = Math.atan2(cy, cx) * (180 / Math.PI) + 180
                glareRef.current.style.background =
                    `linear-gradient(${angle}deg, rgba(255,255,255,0.14) 0%, transparent 70%)`
                glareRef.current.style.opacity = '1'
            }
        })
    }, [max, scale, glare])

    const handleMouseLeave = useCallback(() => {
        const el = ref.current
        if (!el) return
        cancelAnimationFrame(animRef.current)
        el.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)`
        el.style.transition = `transform ${speed * 1.5}ms cubic-bezier(0.03,0.98,0.52,0.99)`
        if (glare && glareRef.current) {
            glareRef.current.style.opacity = '0'
        }
    }, [speed, glare])

    return {
        ref,
        glareRef,
        handlers: {
            onMouseMove: handleMouseMove,
            onMouseLeave: handleMouseLeave,
        },
    }
}
