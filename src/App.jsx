import { useState, useEffect, lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import ScrollProgress from './components/ScrollProgress'
import AnimatedSection from './components/AnimatedSection'
import SplashScreen from './components/SplashScreen'

// ─── Lazy-load all below-fold and route-only sections ───
const ProblemSection        = lazy(() => import('./components/ProblemSection'))
const SolutionSection       = lazy(() => import('./components/SolutionSection'))
const OurEdgeSection        = lazy(() => import('./components/OurEdgeSection'))
const ProcessSection        = lazy(() => import('./components/ProcessSection'))
const WhyUsSection          = lazy(() => import('./components/WhyUsSection'))
const GlimpseSection        = lazy(() => import('./components/GlimpseSection'))
const ContactSection        = lazy(() => import('./components/ContactSection'))
const CTASection            = lazy(() => import('./components/CTASection'))
const Footer                = lazy(() => import('./components/Footer'))
const FloatingCTA           = lazy(() => import('./components/mobile/FloatingCTA'))
const MobileNav             = lazy(() => import('./components/mobile/MobileNav'))
const DetailsPage           = lazy(() => import('./components/DetailsPage'))
const PrivacyPolicy         = lazy(() => import('./components/PrivacyPolicy'))
const TermsOfService        = lazy(() => import('./components/TermsOfService'))
const ContinuousAuroraWrapper = lazy(() => import('./components/ContinuousAuroraWrapper'))

// Minimal spinner shown while lazy chunks load
function SectionFallback() {
  return <div style={{ minHeight: '100px' }} aria-hidden="true" />
}


function DeepLinksBlock() {
  return (
    <AnimatedSection as="section" className="py-16 border-t" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-secondary)' }}>
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
            href="https://wa.me/919496070442"
            target="_blank"
            rel="noopener noreferrer"
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
    </AnimatedSection>
  )
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Dynamic SEO Title and Meta Description updater
  useEffect(() => {
    let title = 'Luminate Labs — Premium Software Development Studio'
    let description = 'Luminate Labs builds fast, scalable, and tailored software solutions — web applications, mobile apps, custom software, UI/UX design, and AI integrations.'

    if (currentPath === '/details') {
      title = 'Services & Process | Luminate Labs'
      description = 'Explore our custom software solutions, modern tech stack, and agile development process at Luminate Labs.'
    } else if (currentPath === '/privacy') {
      title = 'Privacy Policy | Luminate Labs'
      description = 'Read the privacy policy for Luminate Labs. Learn how we collect, use, and protect your data.'
    } else if (currentPath === '/terms') {
      title = 'Terms of Service | Luminate Labs'
      description = 'Read the terms of service and conditions for working with Luminate Labs.'
    }

    document.title = title
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', description)
    }
  }, [currentPath])

  // Universal link interceptor for client-side routing
  useEffect(() => {
    const handleLinkClick = (e) => {
      if (e.defaultPrevented) return
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
  const isPrivacyPage = currentPath === '/privacy'
  const isTermsPage = currentPath === '/terms'

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <ScrollProgress />
      <Navbar currentPath={currentPath} />
      <Suspense fallback={null}><MobileNav currentPath={currentPath} /></Suspense>

      <main id="main-content" aria-label="Luminate Labs — Software Development Company" style={{ paddingTop: (isDetailsPage || isPrivacyPage || isTermsPage) ? '80px' : '0px' }}>
        <Suspense fallback={<SectionFallback />}>
          {isDetailsPage ? (
            <DetailsPage />
          ) : isPrivacyPage ? (
            <PrivacyPolicy />
          ) : isTermsPage ? (
            <TermsOfService />
          ) : (
            <>
              <HeroSection />
              <Suspense fallback={<SectionFallback />}>
                <ContinuousAuroraWrapper>
                  <ProblemSection />
                  <OurEdgeSection />
                  <WhyUsSection />
                </ContinuousAuroraWrapper>
                <GlimpseSection />
                <CTASection />
                <DeepLinksBlock />
              </Suspense>
            </>
          )}
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Footer />
        <FloatingCTA />
      </Suspense>
    </div>
    </>
  )
}



