import { useEffect } from 'react'
import SolutionSection from './SolutionSection'
import TechStackSection from './TechStackSection'
import ProcessSection from './ProcessSection'
import PortfolioSection from './PortfolioSection'
import ContactSection from './ContactSection'
import AmbientAurora from './AmbientAurora'

export default function DetailsPage() {
    useEffect(() => {
        const hash = window.location.hash
        if (hash) {
            const id = hash.slice(1)
            // Wait for mounting and animations to settle before smooth scrolling
            const timer = setTimeout(() => {
                const element = document.getElementById(id)
                if (element) {
                    const navbar = document.querySelector('header')
                    const navHeight = navbar ? navbar.getBoundingClientRect().height : 80
                    const offset = navHeight + 24 // navbar height + 24px breathing room
                    const elementPosition = element.getBoundingClientRect().top + window.scrollY
                    
                    window.scrollTo({ 
                        top: elementPosition - offset, 
                        behavior: 'smooth' 
                    })
                }
            }, 300)
            return () => clearTimeout(timer)
        } else {
            window.scrollTo({ top: 0, behavior: 'instant' })
        }
    }, [])

    return (
        <div className="details-page-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
            
            {/* Back to Home Button */}
            <div style={{ paddingTop: '40px', paddingLeft: '24px', paddingRight: '24px', maxWidth: '76rem', margin: '0 auto', position: 'relative', zIndex: 20 }}>
                <a 
                    href="/" 
                    className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:-translate-x-1" 
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back to Home
                </a>
            </div>

            <AmbientAurora position="left" />
            <AmbientAurora position="right" />
            <SolutionSection />
            <TechStackSection />
            <ProcessSection />
            <PortfolioSection />
            <ContactSection />
        </div>
    )
}
