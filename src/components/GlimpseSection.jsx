import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AnimatedSection from './AnimatedSection'
import { featuredProjects } from '../data/featuredProjects'

// Spring config matching ProblemSection.jsx for consistency
const springConfig = { type: 'spring', stiffness: 100, damping: 15 }

export default function GlimpseSection() {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 768px)')
        setIsMobile(mq.matches)
        const handler = e => setIsMobile(e.matches)
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
    }, [])

    return (
        <section 
            className="relative px-5 md:px-6 py-8 md:py-12 flex justify-center w-full z-10"
            style={{ background: 'var(--bg-primary)' }}
        >
            <div className="w-full max-w-[86rem]">
                <AnimatedSection>
                    {/* The Banner Container */}
                    <motion.div 
                        className="relative flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-6 md:py-0 w-full cursor-pointer select-none"
                        style={{
                            minHeight: isMobile ? 'auto' : '143px',
                            overflow: 'visible' 
                        }}
                        transition={springConfig}
                        onClick={() => setIsExpanded(!isExpanded)}
                        role="button"
                        tabIndex={0}
                        aria-expanded={isExpanded}
                        aria-label="Toggle project preview cards"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setIsExpanded(!isExpanded);
                            }
                        }}
                    >
                        {/* Background Layer: placed in a separate child to prevent backdrop-filter from clipping the overflowing cards */}
                        <div 
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background: 'var(--glass-bg)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                boxShadow: 'var(--shadow-card)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '1.5rem',
                                zIndex: 0
                            }}
                        />

                        {/* Left Side: Text */}
                        <div className="flex flex-col md:flex-row items-center md:items-baseline gap-2 md:gap-4 text-center md:text-left z-10 w-full md:w-auto">
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0, whiteSpace: 'nowrap' }}>
                                Glimpse of our work
                            </h2>
                            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0, whiteSpace: 'nowrap' }}>
                                A sneak peek into what we build.
                            </p>
                        </div>

                        {/* Right Side / Bottom: Card Stack */}
                        <div 
                            className="relative mt-8 md:mt-0 flex items-center justify-center flex-shrink-0"
                            style={{ 
                                width: isMobile ? '140px' : '190px',
                                height: isMobile ? '135px' : '135px',
                                marginRight: isMobile ? '0' : '24px'
                            }}
                        >
                            {/* The Cards */}
                            {featuredProjects.map((card, index) => {
                                // 0: bottom, 1: middle, 2: top
                                const isBottom = index === 0;
                                const isMiddle = index === 1;
                                const isTop = index === 2;
                                
                                // Collapsed state rotation & offset for stacked look
                                let collapsedX = 0;
                                let collapsedY = 0;
                                let collapsedRotate = 0;
                                let collapsedScale = 1;

                                if (isBottom) {
                                    collapsedX = 0;
                                    collapsedY = isMobile ? 18 : 24;
                                    collapsedRotate = -8;
                                    collapsedScale = 0.85;
                                } else if (isMiddle) {
                                    collapsedX = 0;
                                    collapsedY = isMobile ? -2 : -4;
                                    collapsedRotate = -2;
                                    collapsedScale = 0.95;
                                } else {
                                    // Top card pops out prominently (acts as fixed anchor)
                                    collapsedX = 0;
                                    collapsedY = isMobile ? -20 : -32; 
                                    collapsedRotate = 4;
                                    collapsedScale = 1.05;
                                }

                                // Expanded state fan out
                                let expandedX = 0;
                                let expandedY = 0;
                                let expandedRotate = 0;
                                let expandedScale = 1;

                                if (isBottom) {
                                    expandedX = isMobile ? -95 : -130;
                                    expandedY = 16;
                                    expandedRotate = -14;
                                } else if (isMiddle) {
                                    expandedX = isMobile ? 95 : 130;
                                    expandedY = 16;
                                    expandedRotate = 14;
                                } else {
                                    // Top card MUST stay exactly where it is in the collapsed state
                                    expandedX = collapsedX;
                                    expandedY = collapsedY;
                                    expandedRotate = collapsedRotate;
                                    expandedScale = collapsedScale;
                                }

                                return (
                                    <motion.a
                                        href={`/details#project-${card.slug}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (!isExpanded) {
                                                setIsExpanded(true);
                                            } else {
                                                // Programmatically trigger the SPA router
                                                const url = `/details#project-${card.slug}`;
                                                window.history.pushState({}, '', url);
                                                window.dispatchEvent(new PopStateEvent('popstate'));
                                                
                                                // Handle smooth scroll to anchor
                                                setTimeout(() => {
                                                    const id = `project-${card.slug}`;
                                                    const el = document.getElementById(id);
                                                    if (el) {
                                                        const navbar = document.querySelector('header');
                                                        const navHeight = navbar ? navbar.getBoundingClientRect().height : 80;
                                                        const offset = navHeight + 24;
                                                        const elementPosition = el.getBoundingClientRect().top + window.scrollY;
                                                        
                                                        window.scrollTo({ 
                                                            top: elementPosition - offset, 
                                                            behavior: 'smooth' 
                                                        });
                                                    }
                                                }, 300);
                                            }
                                        }}
                                        key={card.id}
                                        className="absolute shadow-lg flex flex-col items-center justify-center overflow-hidden"
                                        style={{
                                            width: isMobile ? '140px' : '180px',
                                            height: isMobile ? '90px' : '115px', // Scaled up for the taller banner
                                            borderRadius: '0.75rem',
                                            background: 'var(--bg-primary)',
                                            border: '1px solid var(--border-subtle)',
                                            zIndex: index,
                                            boxShadow: 'var(--shadow-hover)'
                                        }}
                                        initial={false}
                                        animate={{
                                            x: isExpanded ? expandedX : collapsedX,
                                            y: isExpanded ? expandedY : collapsedY,
                                            rotate: isExpanded ? expandedRotate : collapsedRotate,
                                            scale: isExpanded ? expandedScale : collapsedScale,
                                        }}
                                        transition={springConfig}
                                    >
                                        {/* Card Content - Placeholder */}
                                        <div 
                                            style={{ 
                                                width: '100%', 
                                                height: '60%', 
                                                background: `var(--accent-${card.color}-bg)`,
                                                borderBottom: '1px solid var(--border-subtle)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: `var(--accent-${card.color})`
                                            }}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                                <polyline points="21 15 16 10 5 21" />
                                            </svg>
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                {card.category}
                                            </span>
                                        </div>
                                    </motion.a>
                                )
                            })}
                        </div>
                    </motion.div>
                </AnimatedSection>
            </div>
        </section>
    )
}
