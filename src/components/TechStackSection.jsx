import React from 'react'
import AnimatedSection from './AnimatedSection'

const technologies = [
    { name: 'React', category: 'Frontend' },
    { name: 'Next.js', category: 'Frontend' },
    { name: 'Flutter', category: 'Mobile' },
    { name: 'Laravel', category: 'Backend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'PHP', category: 'Backend' },
    { name: 'Python', category: 'Backend/AI' },
    { name: 'MySQL', category: 'Database' },
    { name: 'MongoDB', category: 'Database' },
    { name: 'Git', category: 'DevOps' },
    { name: 'Docker', category: 'DevOps' },
]

function TechCard({ tech }) {
    return (
        <div className="tech-card">
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                {tech.name}
            </span>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                {tech.category}
            </span>
        </div>
    )
}
function useResponsiveLoop(base, minWidthPerItem = 156) {
    const [count, setCount] = React.useState(2)
    React.useEffect(() => {
        const calc = () => {
            const itemsToFillScreen = Math.ceil(window.innerWidth / minWidthPerItem)
            const setsNeeded = Math.max(2, Math.ceil((itemsToFillScreen * 2) / base.length))
            setCount(setsNeeded)
        }
        calc()
        window.addEventListener('resize', calc, { passive: true })
        return () => window.removeEventListener('resize', calc)
    }, [base])
    return React.useMemo(() => Array.from({ length: count }, () => base).flat(), [count])
}

function TechMarquee() {
    const loopTechnologies = useResponsiveLoop(technologies)
    return (
        <div className="tech-marquee">
            <div className="tech-marquee-track">
                {loopTechnologies.map((tech, i) => (
                    <TechCard key={`${tech.name}-${i}`} tech={tech} />
                ))}
            </div>
            <div className="tech-marquee-fade tech-marquee-fade-left" />
            <div className="tech-marquee-fade tech-marquee-fade-right" />
        </div>
    )
}

export default function TechStackSection() {
    return (
        <section className="relative py-24 md:py-32 px-5 md:px-6 overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
            <div className="section-divider absolute top-0 left-0 right-0" />

            <div className="relative z-10 max-w-6xl mx-auto">
                <AnimatedSection className="text-center mb-16 md:mb-24">
                    <span className="section-label">Our Stack</span>
                    <h2
                        className="mt-6 font-black tracking-tight max-w-2xl mx-auto"
                        style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}
                    >
                        Technologies We Use
                    </h2>
                    <p className="mt-5 text-lg max-w-md mx-auto" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                        We use modern, scalable technologies to build products that perform and last.
                    </p>
                </AnimatedSection>
            </div>

            <TechMarquee />

            <style>{`
                .tech-marquee {
                    position: relative;
                    width: 100%;
                    overflow: hidden;
                    /* Containment prevents layout recalculated on desktop */
                    contain: layout paint style;
                }

                .tech-marquee-track {
                    display: flex;
                    gap: 16px;
                    width: max-content;
                    will-change: transform;
                    /* Hardware acceleration layer */
                    transform: translateZ(0);
                    backface-visibility: hidden;
                    /* Adjust duration (e.g. 40s) so speed feels right across expanded list */
                    animation: marquee-scroll 40s linear infinite;
                }

                .tech-marquee:hover .tech-marquee-track {
                    animation-play-state: paused;
                }

                @keyframes marquee-scroll {
                    0% {
                        transform: translate3d(0, 0, 0);
                    }
                    100% {
                        /* Moves exactly 50% (2 full technology sets) */
                        transform: translate3d(-50%, 0, 0);
                    }
                }

                .tech-marquee-fade {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    width: 120px;
                    pointer-events: none;
                    z-index: 2;
                }
                .tech-marquee-fade-left {
                    left: 0;
                    background: linear-gradient(90deg, var(--bg-primary) 0%, transparent 100%);
                }
                .tech-marquee-fade-right {
                    right: 0;
                    background: linear-gradient(270deg, var(--bg-primary) 0%, transparent 100%);
                }

                .tech-card {
                    flex: 0 0 auto;
                    content-visibility: auto;
                    contain-intrinsic-size: 140px 76px;
                    padding: 16px 24px;
                    border-radius: 16px;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-subtle);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    min-width: 140px;
                    cursor: default;
                    -webkit-font-smoothing: antialiased;
                    /* Transition colors only, omitting transform to prevent hover drops */
                    transition: border-color 0.25s ease, background-color 0.25s ease;
                }

                .tech-card:hover {
                    border-color: var(--accent-blue);
                    background: var(--accent-blue-bg);
                }

                @media (prefers-reduced-motion: reduce) {
                    .tech-marquee-track {
                        animation: none;
                    }
                }
            `}</style>

            <div className="section-divider absolute bottom-0 left-0 right-0" />
        </section>
    )
}