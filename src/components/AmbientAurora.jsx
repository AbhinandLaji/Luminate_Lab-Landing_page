import { memo } from 'react'
import AuroraWave from './AuroraWave'

const AmbientAurora = memo(function AmbientAurora({ position = 'left' }) {
    const isLeft = position === 'left'

    return (
        <div 
            className="hidden md:block absolute top-0 bottom-0 pointer-events-none overflow-hidden"
            style={{
                left: isLeft ? '-65px' : 'auto',
                right: isLeft ? 'auto' : '-65px',
                width: '200px',
                height: '100%',
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
