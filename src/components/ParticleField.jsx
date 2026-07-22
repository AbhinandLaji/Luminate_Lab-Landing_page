import { useRef, useEffect, memo } from 'react'

/**
 * ParticleField — canvas-based floating dots.
 * Optimizations:
 *  - IntersectionObserver + Page Visibility API: pauses RAF when canvas is off-screen OR tab is hidden
 *  - Uses dist² comparison (no Math.sqrt in inner loop)
 *  - Alpha levels bucketed (8 levels) to minimize ctx state changes in connection loop
 *  - Pre-computes fill string once per particle
 *  - willChange hint promotes canvas to its own compositor layer
 *  - devicePixelRatio-aware for crisp rendering on HiDPI screens
 */
const ParticleField = memo(function ParticleField({
    count = 40,
    color = '139,92,246',
    speed = 0.15,
    maxSize = 2,
    connectDistance = 110,
    style = {},
}) {
    const canvasRef = useRef(null)
    const animRef = useRef(null)
    const pts = useRef([])
    const visible = useRef(true)
    const tabVisible = useRef(true)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true })
        const distSq = connectDistance * connectDistance
        // Pre-bucket alpha strings (0-15 levels map to rgba strings) to avoid per-line string concat
        const alphaSteps = 16
        const strokeStyles = Array.from({ length: alphaSteps }, (_, i) => {
            const a = ((i / alphaSteps) * 0.15).toFixed(3)
            return `rgba(${color},${a})`
        })

        /* ── Resize (DPR-aware) ── */
        let dpr = Math.min(window.devicePixelRatio || 1, 2)
        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2)
            const w = canvas.offsetWidth
            const h = canvas.offsetHeight
            canvas.width = Math.round(w * dpr)
            canvas.height = Math.round(h * dpr)
            ctx.scale(dpr, dpr)
        }
        resize()
        const ro = new ResizeObserver(resize)
        ro.observe(canvas)

        /* ── Init particles ── */
        const init = () => {
            const logicalW = canvas.width / dpr
            const logicalH = canvas.height / dpr
            pts.current = Array.from({ length: count }, () => {
                const a = Math.random() * 0.4 + 0.08
                return {
                    x: Math.random() * logicalW,
                    y: Math.random() * logicalH,
                    vx: (Math.random() - 0.5) * speed * 2,
                    vy: (Math.random() - 0.5) * speed * 2,
                    r: Math.random() * maxSize + 0.4,
                    fill: `rgba(${color},${a.toFixed(2)})`,
                }
            })
        }
        init()

        /* ── Draw loop ── */
        const draw = () => {
            animRef.current = requestAnimationFrame(draw)
            if (!visible.current || !tabVisible.current) return

            const logicalW = canvas.width / dpr
            const logicalH = canvas.height / dpr
            ctx.clearRect(0, 0, logicalW, logicalH)

            const p = pts.current
            const n = p.length

            /* Connection lines — bucket by alpha to minimize ctx state changes */
            ctx.lineWidth = 0.5
            // Group lines by alpha bucket, draw all of each group together
            const lineGroups = new Array(alphaSteps)
            for (let i = 0; i < n; i++) {
                for (let j = i + 1; j < n; j++) {
                    const dx = p[i].x - p[j].x
                    const dy = p[i].y - p[j].y
                    const d2 = dx * dx + dy * dy
                    if (d2 < distSq) {
                        const rawAlpha = (1 - d2 / distSq) * 0.15
                        const bucket = Math.min(alphaSteps - 1, Math.floor(rawAlpha / 0.15 * alphaSteps))
                        if (!lineGroups[bucket]) lineGroups[bucket] = []
                        lineGroups[bucket].push(p[i].x, p[i].y, p[j].x, p[j].y)
                    }
                }
            }
            for (let b = 0; b < alphaSteps; b++) {
                const group = lineGroups[b]
                if (!group) continue
                ctx.strokeStyle = strokeStyles[b]
                ctx.beginPath()
                for (let k = 0; k < group.length; k += 4) {
                    ctx.moveTo(group[k], group[k + 1])
                    ctx.lineTo(group[k + 2], group[k + 3])
                }
                ctx.stroke()
            }

            /* Dots + movement */
            for (let i = 0; i < n; i++) {
                const pt = p[i]
                ctx.beginPath()
                ctx.arc(pt.x, pt.y, pt.r, 0, 6.2832)
                ctx.fillStyle = pt.fill
                ctx.fill()

                pt.x += pt.vx
                pt.y += pt.vy
                if (pt.x < 0 || pt.x > logicalW) pt.vx *= -1
                if (pt.y < 0 || pt.y > logicalH) pt.vy *= -1
            }
        }
        draw()

        /* ── Pause when off-screen (IntersectionObserver) ── */
        const io = new IntersectionObserver(
            ([e]) => { visible.current = e.isIntersecting },
            { threshold: 0 }
        )
        io.observe(canvas)

        /* ── Pause when tab is hidden (Page Visibility API) ── */
        const onVisibility = () => { tabVisible.current = document.visibilityState === 'visible' }
        document.addEventListener('visibilitychange', onVisibility, { passive: true })

        return () => {
            cancelAnimationFrame(animRef.current)
            ro.disconnect()
            io.disconnect()
            document.removeEventListener('visibilitychange', onVisibility)
        }
    }, [count, color, speed, maxSize, connectDistance])

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                pointerEvents: 'none', opacity: 'var(--particle-opacity)',
                willChange: 'transform',   // promotes canvas to its own compositor layer
                ...style,
            }}
            aria-hidden="true"
        />
    )
})

export default ParticleField
