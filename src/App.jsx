import { useState, useEffect } from 'react'
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
import DetailsPage from './components/DetailsPage'
import ContinuousAuroraWrapper from './components/ContinuousAuroraWrapper'

function DeepLinksBlock() {
  return (
    <section className="py-16 border-t" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-secondary)' }}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h3 style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--text-muted)', marginBottom: 28 }}>
          Explore Detailed Services &amp; Process
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
          <a
            href="/details#solution"
            className="px-6 py-3.5 rounded-xl border text-sm font-semibold transition-all duration-300"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-secondary)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent-blue)';
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Comprehensive Software Solutions &rarr;
          </a>
          <a
            href="/details#process"
            className="px-6 py-3.5 rounded-xl border text-sm font-semibold transition-all duration-300"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-secondary)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent-violet)';
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            How We Build Software Products &rarr;
          </a>
          <a
            href="/details#contact"
            className="px-6 py-3.5 rounded-xl border text-sm font-semibold transition-all duration-300"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-secondary)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent-teal)';
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Send a Message &rarr;
          </a>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Universal link interceptor for client-side routing
  useEffect(() => {
    const handleLinkClick = (e) => {
      const target = e.target.closest('a')
      if (!target) return

      const href = target.getAttribute('href')
      if (href && (href.startsWith('/') || href.startsWith('#'))) {
        // Skip external target="_blank" or modifier key clicks
        if (target.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

        try {
          const url = new URL(target.href)
          if (url.origin === window.location.origin) {
            e.preventDefault()
            const oldPath = window.location.pathname
            const newPath = url.pathname
            const newHash = url.hash

            if (oldPath !== newPath) {
              window.history.pushState(null, '', target.href)
              window.dispatchEvent(new PopStateEvent('popstate'))
            } else if (newHash) {
              // Same page anchor navigation
              const id = newHash.slice(1)
              const el = id ? document.getElementById(id) : null
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' })
              } else if (newHash === '#') {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }
          }
        } catch (err) {
          // ignore invalid URLs
        }
      }
    }
    document.addEventListener('click', handleLinkClick)
    return () => document.removeEventListener('click', handleLinkClick)
  }, [])

  const isDetailsPage = currentPath === '/details'

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <ScrollProgress />
      <Navbar currentPath={currentPath} />
      <MobileNav currentPath={currentPath} />

      <main id="main-content" aria-label="Luminate Labs — Software Development Company" style={{ paddingTop: isDetailsPage ? '80px' : '0px' }}>
        {isDetailsPage ? (
          <DetailsPage />
        ) : (
          <>
            <HeroSection />
            <ContinuousAuroraWrapper>
              <ProblemSection />
              <OurEdgeSection />
              <WhyUsSection />
            </ContinuousAuroraWrapper>
            <CTASection />
            <DeepLinksBlock />
          </>
        )}
      </main>

      <Footer />
      <FloatingCTA />
    </div>
  )
}



