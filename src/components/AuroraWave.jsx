import { useEffect, useRef, useState, memo } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// AuroraWave — Filled closed-path S-curve glossy ribbon background
//
// Construction:
//   Each ribbon = closed <path> (top edge + bottom edge joined and filled).
//   Width tapers at ends (cosine envelope) for volume-ribbon silhouette.
//   A thin bright stroke rides the top edge as a specular highlight.
//   An ambient bloom ellipse sits behind all ribbons for smoky depth.
//
// Internal Strands:
//   3 thin paths per ribbon running inside the filled shape, mimicking 
//   fluid currents. They are clipped to the ribbon body shape.
//
// Multi-ribbon (3 strands): positioned to intertwine through the center.
//
// Blend modes:
//   Dark mode  → mix-blend-mode: screen  (luminous additive overlap)
//   Light mode → mix-blend-mode: normal  + heavily reduced opacities
// ─────────────────────────────────────────────────────────────────────────────

// Cosine-tapered half-width: 0 at ends → full at middle.
// pow < 1 broadens the flat peak zone.
function cosineTaper(i, segments, maxHW) {
    const t = i / segments
    return maxHW * Math.pow(Math.sin(t * Math.PI), 0.55)
}

// Build closed ribbon filled path (top edge down, bottom edge back = closed)
function buildRibbon(getCY, segments, startX, stepX, isVertical, hwFn) {
    const topPts = []
    const botPts = []
    for (let i = 0; i <= segments; i++) {
        const x  = startX + i * stepX
        const cy = getCY(x)
        const hw = hwFn(i)
        if (isVertical) {
            topPts.push([cy - hw, x])
            botPts.push([cy + hw, x])
        } else {
            topPts.push([x, cy - hw])
            botPts.push([x, cy + hw])
        }
    }
    const top = topPts.map((p, i) =>
        (i === 0 ? `M ${p[0].toFixed(1)},${p[1].toFixed(1)}`
                 : `L ${p[0].toFixed(1)},${p[1].toFixed(1)}`)).join(' ')
    const bot = [...botPts].reverse().map(p =>
        `L ${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
    return `${top} ${bot} Z`
}

// Build the top-edge-only stroke path (for the specular highlight)
function buildHighlightEdge(getCY, segments, startX, stepX, isVertical, hwFn, edgeFraction = 0.55) {
    const pts = []
    for (let i = 0; i <= segments; i++) {
        const x  = startX + i * stepX
        const cy = getCY(x)
        const hw = hwFn(i)
        // Highlight rides at (edgeFraction * hw) below the top edge — upper face of ribbon
        const hy = cy - hw * edgeFraction
        if (isVertical) pts.push([hy, x])
        else             pts.push([x, hy])
    }
    return pts.map((p, i) =>
        (i === 0 ? `M ${p[0].toFixed(1)},${p[1].toFixed(1)}`
                 : `L ${p[0].toFixed(1)},${p[1].toFixed(1)}`)).join(' ')
}

// Build a single stroked path for an internal fluid current strand
function buildStrand(getCY, segments, startX, stepX, isVertical, hwFn, t, strandCfg) {
    const pts = []
    for (let i = 0; i <= segments; i++) {
        const x  = startX + i * stepX
        const cy = getCY(x)
        const hw = hwFn(i)
        
        // Base offset + sine wave ripple along the length
        // phase affects where the ripple starts, speed makes the ripples flow over time
        const ripple = Math.sin((i / segments) * Math.PI * strandCfg.waves + strandCfg.phase + t * strandCfg.speed)
        const dynamicOffset = strandCfg.hwOffset + ripple * strandCfg.rippleAmp
        
        // Clamp to stay generally inside (clipPath provides the absolute hard edge)
        const offsetRatio = Math.max(-0.95, Math.min(0.95, dynamicOffset))
        
        const hy = cy + hw * offsetRatio
        if (isVertical) pts.push([hy, x])
        else            pts.push([x, hy])
    }
    return pts.map((p, i) =>
        (i === 0 ? `M ${p[0].toFixed(1)},${p[1].toFixed(1)}`
                 : `L ${p[0].toFixed(1)},${p[1].toFixed(1)}`)).join(' ')
}

// ─────────────────────────────────────────────────────────────────────────────

const SEGMENTS = 24 // points per path — enough smooth, cheap enough to compute

const AuroraWave = memo(function AuroraWave({
    interactive = true,
    position    = 'full',   // 'full' | 'left' | 'right'
    opacity     = null,
    maskRect    = null,     // { cx, cy, rx, ry } in relative [0..1] coordinates
}) {
    const svgRef       = useRef(null)
    const containerRef = useRef(null)
    const requestRef   = useRef(null)
    const isVisible    = useRef(true)
    const isTabVisible = useRef(true)
    const isReducedMotion = useRef(false)
    const lastMouseActive = useRef(Date.now())

    // Mouse smooth-follow (in viewBox coords)
    const targetX = useRef(500)
    const targetY = useRef(250)
    const smoothX = useRef(500)
    const smoothY = useRef(250)

    // DOM refs — one per layer per ribbon (avoids React re-renders in the rAF loop)
    // ambient blob
    const blobRef  = useRef(null)

    // Ribbon A
    const aGlow = useRef(null); const aBody = useRef(null)
    const aCore = useRef(null); const aHigh = useRef(null)
    const aClip = useRef(null)
    const aStrands = [useRef(null), useRef(null), useRef(null)]

    // Ribbon B
    const bGlow = useRef(null); const bBody = useRef(null)
    const bCore = useRef(null); const bHigh = useRef(null)
    const bClip = useRef(null)
    const bStrands = [useRef(null), useRef(null), useRef(null)]

    // Ribbon C
    const cGlow = useRef(null); const cBody = useRef(null)
    const cCore = useRef(null); const cHigh = useRef(null)
    const cClip = useRef(null)
    const cStrands = [useRef(null), useRef(null), useRef(null)]

    const [isDark, setIsDark] = useState(false)

    // ── Theme detection ──
    useEffect(() => {
        const check = () => setIsDark(
            document.documentElement.getAttribute('data-theme') === 'dark'
        )
        check()
        window.addEventListener('themechange', check)
        return () => window.removeEventListener('themechange', check)
    }, [])

    // ── Reduced motion ──
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
        isReducedMotion.current = mq.matches
        const onChange = e => { isReducedMotion.current = e.matches }
        mq.addEventListener('change', onChange)
        return () => mq.removeEventListener('change', onChange)
    }, [])

    // ── Main animation loop ──
    useEffect(() => {
        const svg       = svgRef.current
        const container = containerRef.current
        if (!svg || !container) return

        const isVertical  = position === 'left' || position === 'right'
        const VW          = isVertical ? 300 : 1000
        const VH          = isVertical ? 1000 : 500
        const totalLength = isVertical ? VH + 100 : VW + 100
        const startCoord  = -50
        const stepCoord   = totalLength / SEGMENTS

        // ── Mouse tracking on window (pointer-events:none containers block element-level listeners) ──
        const handleMouseMove = e => {
            if (!interactive) return
            const rect = container.getBoundingClientRect()
            targetX.current = ((e.clientX - rect.left) / rect.width)  * VW
            targetY.current = ((e.clientY - rect.top)  / rect.height) * VH
            lastMouseActive.current = Date.now()
        }
        if (interactive) window.addEventListener('mousemove', handleMouseMove, { passive: true })

        // ── Ribbon configs ──
        const cfgs = [
            {
                gradId:    'aw-grad-a',
                baseY:     isVertical ? 150 : 250,
                amp:       isVertical ? 35  : 45,
                freq:      1.35,
                phase:     0,
                speed:     0.013,
                hwGlow:    isVertical ? 16 : 22,
                hwBody:    isVertical ? 8  : 12,
                hwCore:    isVertical ? 4  : 6,
                mouseStr:  0.30,
                hlDriftAmp: 2.0,
                hlDriftSpd: 0.018,
                hlDriftOff: 0,
                strands: [
                    { hwOffset:  0.3, rippleAmp: 0.3, waves: 2.5, phase: 0.0, speed: 0.025 },
                    { hwOffset: -0.2, rippleAmp: 0.2, waves: 1.8, phase: 1.5, speed: 0.015 },
                    { hwOffset:  0.1, rippleAmp: 0.4, waves: 3.2, phase: 4.2, speed: 0.030 },
                ]
            },
            {
                gradId:    'aw-grad-b',
                baseY:     isVertical ? 150 : 250,
                amp:       isVertical ? 30  : 40,
                freq:      1.25,
                phase:     Math.PI * 0.6,
                speed:     0.010,
                hwGlow:    isVertical ? 14 : 18,
                hwBody:    isVertical ? 7  : 10,
                hwCore:    isVertical ? 3  : 5,
                mouseStr:  0.25,
                hlDriftAmp: 1.6,
                hlDriftSpd: 0.014,
                hlDriftOff: 2.1,
                strands: [
                    { hwOffset:  0.4, rippleAmp: 0.2, waves: 2.0, phase: 1.0, speed: 0.020 },
                    { hwOffset: -0.3, rippleAmp: 0.3, waves: 2.8, phase: 2.5, speed: -0.010 },
                    { hwOffset: -0.1, rippleAmp: 0.2, waves: 1.5, phase: 0.5, speed: 0.018 },
                ]
            },
            {
                gradId:    'aw-grad-c',
                baseY:     isVertical ? 150 : 250,
                amp:       isVertical ? 45  : 60,
                freq:      1.55,
                phase:     -Math.PI * 0.45,
                speed:     0.016,
                hwGlow:    isVertical ? 10 : 14,
                hwBody:    isVertical ? 5  : 7,
                hwCore:    isVertical ? 2  : 4,
                mouseStr:  0.20,
                hlDriftAmp: 1.2,
                hlDriftSpd: 0.021,
                hlDriftOff: 4.3,
                strands: [
                    { hwOffset:  0.2, rippleAmp: 0.4, waves: 3.0, phase: 0.2, speed: 0.035 },
                    { hwOffset: -0.4, rippleAmp: 0.1, waves: 1.2, phase: 3.1, speed: 0.012 },
                    { hwOffset:  0.0, rippleAmp: 0.3, waves: 2.2, phase: 1.8, speed: -0.020 },
                ]
            },
        ]

        const ribbonRefs = [
            { glow: aGlow, body: aBody, core: aCore, high: aHigh, clip: aClip, strands: aStrands },
            { glow: bGlow, body: bBody, core: bCore, high: bHigh, clip: bClip, strands: bStrands },
            { glow: cGlow, body: cBody, core: cCore, high: cHigh, clip: cClip, strands: cStrands },
        ]

        // Build center-Y function for a config at a given time + mouse state
        const makeCYFn = (cfg, t) => (x) => {
            const angle = ((x + 50) / 1000) * Math.PI * cfg.freq + cfg.phase
            let cy = cfg.baseY
            cy += Math.sin(angle + t * cfg.speed) * cfg.amp
            cy += Math.cos(angle * 1.88 - t * cfg.speed * 0.72) * (cfg.amp * 0.30)

            // Mouse influence (horizontal only, distance-weighted)
            if (interactive && !isVertical) {
                const dx   = (x + 50) - smoothX.current
                const dist = Math.abs(dx)
                if (dist < 500) {
                    const factor = Math.cos((dist / 500) * Math.PI * 0.5) ** 2
                    cy += (smoothY.current - cfg.baseY) * cfg.mouseStr * factor
                }
            }
            return cy
        }

        const drawAll = (t, doHighlightDrift) => {
            cfgs.forEach((cfg, ri) => {
                const refs = ribbonRefs[ri]
                const getCY = makeCYFn(cfg, t)
                const hwFn  = (i) => cosineTaper(i, SEGMENTS, cfg.hwGlow)
                const hwBodyFn = (i) => cosineTaper(i, SEGMENTS, cfg.hwBody)
                const hwCoreFn = (i) => cosineTaper(i, SEGMENTS, cfg.hwCore)

                const dBody = buildRibbon(getCY, SEGMENTS, startCoord, stepCoord, isVertical, hwBodyFn)

                refs.glow.current?.setAttribute('d',
                    buildRibbon(getCY, SEGMENTS, startCoord, stepCoord, isVertical, hwFn))
                refs.body.current?.setAttribute('d', dBody)
                refs.core.current?.setAttribute('d',
                    buildRibbon(getCY, SEGMENTS, startCoord, stepCoord, isVertical, hwCoreFn))
                
                // Update the clip path shape (identical to the body shape)
                refs.clip.current?.setAttribute('d', dBody)

                // Update internal fluid strands
                cfg.strands.forEach((strandCfg, si) => {
                    refs.strands[si].current?.setAttribute('d', 
                        buildStrand(getCY, SEGMENTS, startCoord, stepCoord, isVertical, hwBodyFn, t, strandCfg)
                    )
                })

                // Highlight: independent drift + mouse shift
                const drift = doHighlightDrift
                    ? Math.sin(t * cfg.hlDriftSpd + cfg.hlDriftOff) * cfg.hlDriftAmp
                    : 0
                const mShift = (interactive && !isVertical && doHighlightDrift)
                    ? (smoothY.current - cfg.baseY) * 0.07
                    : 0

                // getCY shifted by drift for the highlight path
                const getCYH = (x) => getCY(x) + drift + mShift
                refs.high.current?.setAttribute('d',
                    buildHighlightEdge(getCYH, SEGMENTS, startCoord, stepCoord, isVertical, hwBodyFn, 0.58))
            })
        }

        let time = 0

        const render = () => {
            if (isReducedMotion.current) {
                drawAll(0, false)
                return
            }

            requestRef.current = requestAnimationFrame(render)
            if (!isVisible.current || !isTabVisible.current) return

            time += 0.5

            // Smooth mouse / idle drift fallback
            if (interactive) {
                if (Date.now() - lastMouseActive.current > 2000) {
                    const it = time * 0.013
                    targetX.current = VW / 2 + Math.cos(it) * (VW * 0.30)
                    targetY.current = VH / 2 + Math.sin(it * 2.2) * (VH * 0.17)
                }
                smoothX.current += (targetX.current - smoothX.current) * 0.045
                smoothY.current += (targetY.current - smoothY.current) * 0.045
            }

            drawAll(time, true)
        }

        render()

        // Pause when off-screen
        const io = new IntersectionObserver(([entry]) => {
            isVisible.current = entry.isIntersecting
        }, { threshold: 0 })
        io.observe(svg)

        const onVis = () => { isTabVisible.current = document.visibilityState === 'visible' }
        document.addEventListener('visibilitychange', onVis, { passive: true })

        return () => {
            cancelAnimationFrame(requestRef.current)
            if (interactive) window.removeEventListener('mousemove', handleMouseMove)
            io.disconnect()
            document.removeEventListener('visibilitychange', onVis)
        }
    }, [interactive, position])

    // ── Visual theming ──
    const isVertical  = position === 'left' || position === 'right'
    const viewBoxStr  = isVertical ? '0 0 300 1000' : '0 0 1000 500'

    // Opacity budget per layer — light mode is drastically reduced because
    // mix-blend-mode:screen on a light background produces white-out.
    // In light mode we skip screen entirely and use normal + low opacities.
    const glowOp  = isDark ? 0.40 : 0.25
    const bodyOp  = isDark ? 0.58 : 0.40
    const coreOp  = isDark ? 0.80 : 0.70
    const highOp  = isDark ? 0.90 : 0.80
    const blobOp  = isDark ? 0.24 : 0.12

    const wrapperOp = opacity !== null
        ? opacity
        : isVertical ? (isDark ? 0.55 : 0.18) : 1

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ zIndex: 0, opacity: wrapperOp }}
            aria-hidden="true"
        >
            <svg
                ref={svgRef}
                viewBox={viewBoxStr}
                preserveAspectRatio="none"
                style={{
                    width: '100%', height: '100%',
                    display: 'block',
                    pointerEvents: 'none',
                    // screen blends luminously in dark mode; normal in light (avoids white-out)
                    mixBlendMode: isDark ? 'screen' : 'normal',
                    overflow: 'visible',
                }}
            >
                <defs>
                    {/* Ribbon A gradient — blue → violet (or pure blue in light mode) */}
                    <linearGradient id="aw-grad-a" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%"   stopColor="var(--accent-blue)"   stopOpacity="1" />
                        <stop offset="55%"  stopColor={isDark ? "var(--accent-violet)" : "var(--accent-blue)"} stopOpacity="1" />
                        <stop offset="100%" stopColor={isDark ? "var(--accent-indigo)" : "var(--accent-blue)"} stopOpacity="1" />
                    </linearGradient>

                    {/* Ribbon B gradient — violet → indigo (or pure blue in light mode) */}
                    <linearGradient id="aw-grad-b" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%"   stopColor={isDark ? "var(--accent-violet)" : "var(--accent-blue)"} stopOpacity="1" />
                        <stop offset="60%"  stopColor={isDark ? "var(--accent-indigo)" : "var(--accent-blue)"} stopOpacity="1" />
                        <stop offset="100%" stopColor="var(--accent-blue)"   stopOpacity="1" />
                    </linearGradient>

                    {/* Ribbon C gradient — indigo → blue (or pure blue in light mode) */}
                    <linearGradient id="aw-grad-c" x1="15%" y1="0%" x2="85%" y2="0%">
                        <stop offset="0%"   stopColor={isDark ? "var(--accent-indigo)" : "var(--accent-blue)"} stopOpacity="1" />
                        <stop offset="50%"  stopColor="var(--accent-blue)"   stopOpacity="1" />
                        <stop offset="100%" stopColor={isDark ? "var(--accent-violet)" : "var(--accent-blue)"} stopOpacity="1" />
                    </linearGradient>

                    {/* Specular highlight — crisp bright fade at ends */}
                    <linearGradient id="aw-highlight" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%"   stopColor="#fff" stopOpacity="0.00" />
                        <stop offset="20%"  stopColor="#fff" stopOpacity="0.80" />
                        <stop offset="50%"  stopColor="#e0eeff" stopOpacity="0.95" />
                        <stop offset="80%"  stopColor="#fff" stopOpacity="0.75" />
                        <stop offset="100%" stopColor="#fff" stopOpacity="0.00" />
                    </linearGradient>

                    {/* Bloom blur — very heavy, for the outer glow layer */}
                    <filter id="aw-bloom" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="20" />
                    </filter>

                    {/* Soft blur — main body layer */}
                    <filter id="aw-soft" x="-15%" y="-15%" width="130%" height="130%">
                        <feGaussianBlur stdDeviation="5" />
                    </filter>

                    {/* Ambient blob — enormous radius, pure background depth */}
                    <filter id="aw-ambient" x="-60%" y="-60%" width="220%" height="220%">
                        <feGaussianBlur stdDeviation="52" />
                    </filter>
                    
                    {/* Dimming mask to gracefully hide the ribbons behind the text block */}
                    <mask id="text-dim-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        {maskRect && (
                            <ellipse
                                cx={`${maskRect.cx * 100}%`}
                                cy={`${maskRect.cy * 100}%`}
                                rx={`${(maskRect.rx + 0.08) * 100}%`}
                                ry={`${(maskRect.ry + 0.12) * 100}%`}
                                fill="black"
                                filter="url(#aw-bloom)"
                                opacity={isDark ? "0.85" : "0.95"}
                            />
                        )}
                    </mask>

                    {/* Ribbon clip paths for internal strands */}
                    <clipPath id="aw-clip-a"><path ref={aClip} /></clipPath>
                    <clipPath id="aw-clip-b"><path ref={bClip} /></clipPath>
                    <clipPath id="aw-clip-c"><path ref={cClip} /></clipPath>
                </defs>

                <g mask="url(#text-dim-mask)">
                    {/* ── Ambient depth bloom ellipse (slowest, behind everything) ── */}
                    <ellipse
                        ref={blobRef}
                        cx={isVertical ? 150 : 500}
                        cy={isVertical ? 500 : 245}
                        rx={isVertical ? 100 : 400}
                        ry={isVertical ? 360 : 140}
                        fill="url(#aw-grad-a)"
                        filter="url(#aw-ambient)"
                        opacity={blobOp}
                    />

                    {/* ════ RIBBON A ════ */}
                    <path ref={aGlow} fill="url(#aw-grad-a)" filter="url(#aw-bloom)" opacity={glowOp} />
                    <path ref={aBody} fill="url(#aw-grad-a)" filter="url(#aw-soft)"  opacity={bodyOp} />
                    <path ref={aCore} fill="url(#aw-grad-a)"                         opacity={coreOp} />
                    <g clipPath="url(#aw-clip-a)">
                        <path ref={aStrands[0]} fill="none" stroke="url(#aw-grad-a)" strokeWidth={isVertical ? 1.0 : 1.5} opacity={isDark ? 0.35 : 0.15} />
                        <path ref={aStrands[1]} fill="none" stroke="url(#aw-highlight)" strokeWidth={isVertical ? 0.6 : 0.8} opacity={isDark ? 0.20 : 0.08} />
                        <path ref={aStrands[2]} fill="none" stroke="url(#aw-grad-a)" strokeWidth={isVertical ? 0.8 : 1.2} opacity={isDark ? 0.25 : 0.10} />
                    </g>
                    <path ref={aHigh} fill="none" stroke="url(#aw-highlight)" strokeWidth={isVertical ? 1.1 : 1.7} strokeLinecap="round" strokeLinejoin="round" opacity={highOp} />

                    {/* ════ RIBBON B ════ */}
                    <path ref={bGlow} fill="url(#aw-grad-b)" filter="url(#aw-bloom)" opacity={glowOp  * 0.80} />
                    <path ref={bBody} fill="url(#aw-grad-b)" filter="url(#aw-soft)"  opacity={bodyOp  * 0.80} />
                    <path ref={bCore} fill="url(#aw-grad-b)"                         opacity={coreOp  * 0.80} />
                    <g clipPath="url(#aw-clip-b)">
                        <path ref={bStrands[0]} fill="none" stroke="url(#aw-grad-b)" strokeWidth={isVertical ? 0.9 : 1.4} opacity={isDark ? 0.30 : 0.12} />
                        <path ref={bStrands[1]} fill="none" stroke="url(#aw-highlight)" strokeWidth={isVertical ? 0.5 : 0.7} opacity={isDark ? 0.15 : 0.06} />
                        <path ref={bStrands[2]} fill="none" stroke="url(#aw-grad-b)" strokeWidth={isVertical ? 0.7 : 1.1} opacity={isDark ? 0.22 : 0.09} />
                    </g>
                    <path ref={bHigh} fill="none" stroke="url(#aw-highlight)" strokeWidth={isVertical ? 0.9 : 1.3} strokeLinecap="round" strokeLinejoin="round" opacity={highOp * 0.80} />

                    {/* ════ RIBBON C ════ */}
                    <path ref={cGlow} fill="url(#aw-grad-c)" filter="url(#aw-bloom)" opacity={glowOp  * 0.60} />
                    <path ref={cBody} fill="url(#aw-grad-c)" filter="url(#aw-soft)"  opacity={bodyOp  * 0.60} />
                    <path ref={cCore} fill="url(#aw-grad-c)"                         opacity={coreOp  * 0.60} />
                    <g clipPath="url(#aw-clip-c)">
                        <path ref={cStrands[0]} fill="none" stroke="url(#aw-grad-c)" strokeWidth={isVertical ? 0.8 : 1.2} opacity={isDark ? 0.28 : 0.10} />
                        <path ref={cStrands[1]} fill="none" stroke="url(#aw-highlight)" strokeWidth={isVertical ? 0.4 : 0.6} opacity={isDark ? 0.15 : 0.05} />
                        <path ref={cStrands[2]} fill="none" stroke="url(#aw-grad-c)" strokeWidth={isVertical ? 0.6 : 1.0} opacity={isDark ? 0.20 : 0.08} />
                    </g>
                    <path ref={cHigh} fill="none" stroke="url(#aw-highlight)" strokeWidth={isVertical ? 0.7 : 1.0} strokeLinecap="round" strokeLinejoin="round" opacity={highOp * 0.60} />
                </g>
            </svg>
        </div>
    )
})

export default AuroraWave
