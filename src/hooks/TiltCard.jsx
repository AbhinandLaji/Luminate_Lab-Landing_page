import { useTilt } from './useTilt'

/**
 * TiltCard — drop-in wrapper that applies the 3D tilt effect.
 * Accepts all div props plus tiltMax, glare, tiltScale.
 */
export function TiltCard({ children, className = '', style = {}, tiltMax = 10, glare = true, tiltScale = 1.03, ...rest }) {
    const { ref, glareRef, handlers } = useTilt({ max: tiltMax, glare, scale: tiltScale })

    return (
        <div
            ref={ref}
            className={className}
            style={{ position: 'relative', transformStyle: 'preserve-3d', willChange: 'transform', ...style }}
            {...handlers}
            {...rest}
        >
            {/* Glare overlay */}
            {glare && (
                <div
                    ref={glareRef}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 'inherit',
                        pointerEvents: 'none',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        zIndex: 2,
                    }}
                    aria-hidden="true"
                />
            )}
            <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
                {children}
            </div>
        </div>
    )
}
