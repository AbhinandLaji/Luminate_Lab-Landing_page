import { useEffect } from 'react'
import SolutionSection from './SolutionSection'
import ProcessSection from './ProcessSection'
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
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
            <ProcessSection />
            <ContactSection />
        </div>
    )
}
