import { useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

/**
 * SwipeCarousel — reusable horizontal scroll-snap carousel (mobile only)
 *
 * Props:
 *   items      — array of data objects
 *   renderItem — (item, index, isActive) => JSX
 *   keyProp    — (item) => string key
 *   accentFn   — (item) => accent color string (optional, for dot color)
 *   className  — extra class on wrapper
 *   cardWidth  — CSS width string for each card (default '85vw')
 *   gap        — gap in px (default 12)
 */
export default function SwipeCarousel({
    items,
    renderItem,
    keyProp,
    accentFn,
    className = '',
    cardWidth = '84vw',
    gap = 12,
}) {
    const trackRef = useRef(null)
    const activeRef = useRef(0)
    const dotRefs = useRef([])
    const cardWRef = useRef(0)  // cached card width — avoids offsetWidth reads during scroll

    /* Cache card width once via ResizeObserver — zero reflow during scroll */
    const firstCardRef = useCallback((el) => {
        if (!el) return
        const ro = new ResizeObserver((entries) => {
            cardWRef.current = entries[0].contentRect.width
        })
        ro.observe(el)
    }, [])

    /* Update active dot on scroll — reads cardWRef (cached), no layout reads */
    const onScroll = useCallback(() => {
        const track = trackRef.current
        if (!track) return
        const cardW = cardWRef.current || track.scrollWidth / items.length
        const next = Math.round(track.scrollLeft / (cardW + gap))
        if (next !== activeRef.current) {
            const oldDot = dotRefs.current[activeRef.current]
            if (oldDot) { oldDot.style.width = '7px'; oldDot.style.opacity = '0.35' }
            activeRef.current = next
            const newDot = dotRefs.current[next]
            if (newDot) { newDot.style.width = '22px'; newDot.style.opacity = '1' }
        }
    }, [gap, items.length])


    return (
        <div className={className} style={{ position: 'relative' }}>
            <div
                ref={trackRef}
                onScroll={onScroll}
                className="swipe-track"
                style={{
                    display: 'flex',
                    overflowX: 'auto',
                    scrollSnapType: 'x mandatory',
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    gap: `${gap}px`,
                    padding: '0 8vw 16px',
                }}
            >
                <style>{`.swipe-track::-webkit-scrollbar{display:none}`}</style>

                {items.map((item, i) => (
                    <motion.div
                        key={keyProp(item)}
                        ref={i === 0 ? firstCardRef : undefined}
                        initial={{ opacity: 0, scale: 0.96 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.2) }}
                        style={{
                            scrollSnapAlign: 'center',
                            flexShrink: 0,
                            width: cardWidth,
                        }}
                    >
                        {renderItem(item, i)}
                    </motion.div>
                ))}
            </div>

            {/* Dot indicators */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginTop: '4px',
            }}>
                {items.map((item, i) => (
                    <div
                        key={`dot-${keyProp(item)}`}
                        ref={el => dotRefs.current[i] = el}
                        onClick={() => {
                            const track = trackRef.current
                            if (!track) return
                            const cardW = cardWRef.current || track.scrollWidth / items.length
                            track.scrollTo({ left: i * (cardW + gap), behavior: 'smooth' })
                        }}
                        style={{
                            width: i === 0 ? '22px' : '7px',
                            height: '7px',
                            borderRadius: '4px',
                            background: accentFn?.(item) || '#5b7cf7',
                            opacity: i === 0 ? 1 : 0.35,
                            cursor: 'pointer',
                            transition: 'width 0.3s ease, opacity 0.3s ease',
                            flexShrink: 0,
                        }}
                    />
                ))}
            </div>
        </div>
    )
}
