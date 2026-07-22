import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import ProblemSection from './components/ProblemSection'
import SolutionSection from './components/SolutionSection'
import OurEdgeSection from './components/OurEdgeSection'
import ProcessSection from './components/ProcessSection'
import WhyUsSection from './components/WhyUsSection'
import ContactSection from './components/ContactSection'
import CTASection from './components/CTASection'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import FloatingCTA from './components/mobile/FloatingCTA'
import MobileNav from './components/mobile/MobileNav'

export default function App() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <ScrollProgress />
      <Navbar />
      <MobileNav />
      <main id="main-content" aria-label="Luminate Labs — Customer Acquisition Agency">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <OurEdgeSection />
        <ProcessSection />
        <WhyUsSection />
        <ContactSection />
        <CTASection />
      </main>
      <Footer />

      <FloatingCTA />
    </div>
  )
}


