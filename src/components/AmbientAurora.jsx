import { memo, useState, useEffect } from 'react'
import AuroraWave from './AuroraWave'

const AmbientAurora = memo(function AmbientAurora({ position = 'left' }) {
    const isLeft = position === 'left'
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false
    )

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 768px)')
        const onChange = e => setIsMobile(e.matches)
        mq.addEventListener('change', onChange)
        return () => mq.removeEventListener('change', onChange)
    }, [])

    if (isMobile) return null

    return (
        <div 
            className="hidden md:block absolute top-0 pointer-events-none overflow-hidden"
            style={{
                left: isLeft ? '-65px' : 'auto',
                right: isLeft ? 'auto' : '-65px',
                width: '200px',
                height: '150vh',
                zIndex: 0
            }}
            aria-hidden="true"
        >
            <AuroraWave 
                interactive={false} 
                position={position} 
            />
        </div>
    )
})

export default AmbientAurora
