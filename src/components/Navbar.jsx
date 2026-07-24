import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const homeLinks = [
    { label: 'Challenge', href: '#problem' },
    { label: 'Our Edge', href: '#our-edge' },
    { label: 'Why Us', href: '#why-us' },
]

const detailsLinks = [
    { label: 'Services', href: '#solution' },
    { label: 'Process', href: '#process' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'About', href: '/#why-us' },
]

export default function Navbar({ currentPath = '/' }) {
    const [scrolled, setScrolled] = useState(false)
    const [active, setActive] = useState('')
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return document.documentElement.getAttribute('data-theme') || 'light'
        }
        return 'light'
    })

    const isDetails = currentPath === '/details'
    const activeLinks = isDetails ? detailsLinks : homeLinks

    useEffect(() => {
        const handleThemeChange = () => {
            setTheme(document.documentElement.getAttribute('data-theme') || 'light')
        }
        window.addEventListener('themechange', handleThemeChange)
        return () => window.removeEventListener('themechange', handleThemeChange)
    }, [])

    const toggleTheme = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light'
        if (nextTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.setAttribute('data-theme', 'light')
            localStorage.setItem('theme', 'light')
        }
        window.dispatchEvent(new Event('themechange'))
    }

    useEffect(() => {
        let rafId = null
        const onScroll = () => {
            if (rafId) return
            rafId = requestAnimationFrame(() => {
                setScrolled(window.scrollY > 60)
                rafId = null
            })
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => {
            window.removeEventListener('scroll', onScroll)
            if (rafId) cancelAnimationFrame(rafId)
        }
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                let mostVisible = null
                let maxRatio = 0
                
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
                        maxRatio = entry.intersectionRatio
                        mostVisible = entry.target.id
                    }
                })
                
                if (mostVisible) {
                    const link = activeLinks.find(l => l.href.endsWith('#' + mostVisible))
                    if (link) setActive(link.label)
                }
            },
            { rootMargin: '-10% 0px -70% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
        )

        activeLinks.forEach((link) => {
            if (link.href.startsWith('#')) {
                const id = link.href.slice(1)
                const el = document.getElementById(id)
                if (el) observer.observe(el)
            }
        })

        return () => observer.disconnect()
    }, [activeLinks])

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="fixed top-0 left-0 right-0 z-50"
        >
            {/* Main nav bar */}
            <div
                className="transition-all duration-500"
                style={{
                    background: scrolled ? 'var(--glass-bg)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(28px) saturate(130%)' : 'none',
                    WebkitBackdropFilter: scrolled ? 'blur(28px) saturate(130%)' : 'none',
                    borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
                }}
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">

                    {/* Logo */}
                    <a href={isDetails ? '/' : '#'} className="flex items-center gap-3 group" aria-label="Luminate Labs home">
                        <div className="w-9 h-9 relative flex items-center justify-center">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-violet)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 logo-spin" style={{ filter: 'drop-shadow(0 0 8px var(--accent-violet-bg))' }}>
                                <circle cx="12" cy="12" r="10" />
                                <path d="M10 6 Q 16 7, 17.5 13.5" />
                                <path d="M14 5.5 Q 18 3, 20 6" />
                                <path d="M7 10 Q 4 13, 8 19" />
                                <path d="M11.5 11.5 Q 6 12, 4 17" />
                                <path d="M8 13.5 Q 11 18, 14 17.5" />
                                <circle cx="10" cy="6" r="1.2" fill="var(--accent-violet)" stroke="none" />
                                <circle cx="17.5" cy="13.5" r="1.2" fill="var(--accent-violet)" stroke="none" />
                                <circle cx="14" cy="5.5" r="1.2" fill="var(--accent-violet)" stroke="none" />
                                <circle cx="7" cy="10" r="1.2" fill="var(--accent-violet)" stroke="none" />
                                <circle cx="11.5" cy="11.5" r="1.2" fill="var(--accent-violet)" stroke="none" />
                                <circle cx="8" cy="13.5" r="1.2" fill="var(--accent-violet)" stroke="none" />
                                <circle cx="14" cy="17.5" r="1.2" fill="var(--accent-violet)" stroke="none" />
                            </svg>
                        </div>
                        <span
                            className="font-bold text-base tracking-tight transition-colors duration-300"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            Luminate<span style={{ color: 'var(--accent-violet)' }}>Labs</span>
                        </span>
                    </a>

                    {/* Desktop links */}
                    <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
                        {activeLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setActive(link.label)}
                                className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group"
                                style={{ color: active === link.label ? 'var(--text-secondary)' : 'var(--text-muted)' }}
                                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--border-subtle)' }}
                                onMouseLeave={e => { e.currentTarget.style.color = active === link.label ? 'var(--text-secondary)' : 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <a
                            href="https://wa.me/919496070442"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                            style={{ color: 'var(--text-muted)' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                        >
                            Contact
                        </a>
                        <a href="https://wa.me/919496070442" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '10px 22px', fontSize: '0.85rem', borderRadius: '12px' }}>
                            Get Started
                            <ArrowRight size={15} />
                        </a>
                        
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-200"
                            style={{
                                background: 'var(--bg-secondary)',
                                borderColor: 'var(--border-subtle)',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = 'var(--border-accent)'
                                e.currentTarget.style.color = 'var(--text-primary)'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = 'var(--border-subtle)'
                                e.currentTarget.style.color = 'var(--text-secondary)'
                            }}
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="5" />
                                    <line x1="12" y1="1" x2="12" y2="3" />
                                    <line x1="12" y1="21" x2="12" y2="23" />
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                    <line x1="1" y1="12" x2="3" y2="12" />
                                    <line x1="21" y1="12" x2="23" y2="12" />
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                </svg>
                            )}
                        </button>
                    </div>

                </div>
            </div>

        </motion.header>
    )
}

function ArrowRight({ size = 16 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}
