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
