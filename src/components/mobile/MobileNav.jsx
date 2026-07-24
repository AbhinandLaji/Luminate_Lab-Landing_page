import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * MobileNav — bottom navigation for mobile (md:hidden)
 *
 * Layout:
 *  - Minimal transparent top bar: Logo + "Menu" button
 *  - Persistent floating bottom pill: always visible
 *  - Bottom sheet: slides up with full section links
 */

const NAV_LINKS = [
    { label: 'Services', href: '#solution', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg> },
    { label: 'Process', href: '#process', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg> },
    { label: 'Portfolio', href: '#portfolio', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg> },
    { label: 'About', href: '#why-us', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> },
]

/* ─── Bottom sheet overlay ─── */
function BottomSheet({ open, onClose, theme, onThemeToggle, currentPath = '/' }) {
    const isDetails = currentPath === '/details'
    const dynamicLinks = NAV_LINKS.map(link => {
        if (link.label === 'Services') {
            return { ...link, href: isDetails ? '#solution' : '/details#solution' }
        }
        if (link.label === 'Process') {
            return { ...link, href: isDetails ? '#process' : '/details#process' }
        }
        if (link.label === 'Portfolio') {
            return { ...link, href: isDetails ? '#portfolio' : '/details#portfolio' }
        }
        return { ...link, href: isDetails ? `/${link.href}` : link.href }
    })

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 9990,
                            background: 'rgba(0,0,0,0.65)',
                            backdropFilter: 'blur(4px)',
                        }}
                    />
                    {/* Sheet */}
                    <motion.div
                        key="sheet"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', stiffness: 380, damping: 38 }}
                        style={{
                            position: 'fixed', left: 0, right: 0, bottom: 0,
                            zIndex: 9995,
                            background: 'var(--glass-bg)',
                            backdropFilter: 'blur(24px)',
                            WebkitBackdropFilter: 'blur(24px)',
                            borderTop: '1px solid var(--border-subtle)',
                            borderRadius: '24px 24px 0 0',
                            paddingBottom: 'env(safe-area-inset-bottom, 20px)',
                        }}
                    >
                        {/* Drag handle */}
                        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '14px', paddingBottom: '10px' }}>
                            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--text-muted)' }} />
                        </div>

                        {/* Logo + title */}
                        <div style={{ padding: '8px 24px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
                            <div style={{ fontSize: '1.15rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
                                Luminate <span style={{ color: 'var(--accent-blue)' }}>Labs</span>
                            </div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                Software Development Studio
                            </div>
                        </div>

                        {/* Links */}
                        <nav style={{ padding: '12px 16px' }}>
                            {dynamicLinks.map((link, i) => (
                                <motion.a
                                    key={link.label}
                                    href={link.href}
                                    onClick={onClose}
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.04 + 0.05, duration: 0.28 }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 14,
                                        padding: '14px 16px', borderRadius: 14, marginBottom: 4,
                                        textDecoration: 'none', color: 'var(--text-secondary)',
                                        background: 'var(--bg-tertiary)',
                                    }}
                                    onTouchStart={e => { e.currentTarget.style.background = 'var(--border-subtle)' }}
                                    onTouchEnd={e => { e.currentTarget.style.background = 'var(--bg-tertiary)' }}
                                >
                                    <span style={{ color: 'var(--accent-blue)' }}>{link.icon}</span>
                                    <span style={{ fontSize: '1rem', fontWeight: 600 }}>{link.label}</span>
                                    <svg style={{ marginLeft: 'auto', opacity: 0.3 }} width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </motion.a>
                            ))}

                            {/* Theme Toggle row */}
                            <motion.button
                                onClick={onThemeToggle}
                                initial={{ opacity: 0, x: -16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: NAV_LINKS.length * 0.04 + 0.05, duration: 0.28 }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 14,
                                    width: '100%', border: 'none', textAlign: 'left',
                                    padding: '14px 16px', borderRadius: 14, marginBottom: 8,
                                    color: 'var(--text-secondary)',
                                    background: 'var(--border-subtle)',
                                    cursor: 'pointer',
                                }}
                            >
                                <span style={{ color: 'var(--accent-violet)', display: 'flex', alignItems: 'center' }}>
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
                                </span>
                                <span style={{ fontSize: '1rem', fontWeight: 600 }}>Theme: {theme === 'light' ? 'Light' : 'Dark'}</span>
                                <span style={{ marginLeft: 'auto', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Tap to switch</span>
                            </motion.button>

                            {/* CTA link */}
                            <motion.a
                                href={isDetails ? '/#cta' : '#cta'}
                                onClick={onClose}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.28, duration: 0.28 }}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    gap: 8, marginTop: 8,
                                    padding: '15px', borderRadius: 14,
                                    background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-violet))',
                                    textDecoration: 'none', color: '#fff',
                                    fontSize: '0.97rem', fontWeight: 800,
                                    boxShadow: '0 8px 28px var(--accent-blue-bg)',
                                }}
                            >
                                Book a Free Consultation
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </motion.a>
                        </nav>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

/* ─── Persistent floating bottom pill nav ─── */
function BottomPillNav({ onMenuOpen, currentPath = '/' }) {
    const isDetails = currentPath === '/details'
    const quickLinks = [
        { href: isDetails ? '/' : '#', label: 'Home', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> },
        { href: isDetails ? '/#problem' : '#problem', label: 'Problem', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg> },
        { href: isDetails ? '#process' : '/details#process', label: 'Process', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg> },
        { href: isDetails ? '/#our-edge' : '#our-edge', label: 'Results', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg> },
    ]

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
                left: 0,
                right: 0,
                zIndex: 9980,
                display: 'flex',
                justifyContent: 'center',
                pointerEvents: 'none',
            }}
        >
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 0,
                padding: '6px 8px',
                borderRadius: '100px',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-card)',
                pointerEvents: 'auto',
            }}>
                {/* Quick nav links */}
                {quickLinks.map(item => (
                    <a key={item.label} href={item.href} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textDecoration: 'none' }} onTouchStart={e => { e.currentTarget.style.background = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--accent-blue)' }} onTouchEnd={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}>
                        {item.icon}
                    </a>
                ))}

                {/* Separator */}
                <div style={{ width: 1, height: 24, background: 'var(--border-subtle)', margin: '0 4px' }} />

                {/* Menu button */}
                <button
                    onClick={onMenuOpen}
                    style={{
                        width: 40, height: 40, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'var(--accent-blue-bg)',
                        border: '1px solid var(--accent-blue-border)',
                        color: 'var(--accent-blue)', cursor: 'pointer',
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <line x1="2" y1="5" x2="14" y2="5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <line x1="2" y1="11" x2="10" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                </button>
            </div>
        </div >
    )
}

/* ═══ MAIN EXPORT ═══ */
export default function MobileNav({ currentPath = '/' }) {
    const [sheetOpen, setSheetOpen] = useState(false)
    const openSheet = useCallback(() => setSheetOpen(true), [])
    const closeSheet = useCallback(() => setSheetOpen(false), [])

    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return document.documentElement.getAttribute('data-theme') || 'light'
        }
        return 'light'
    })

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

    return (
        <div className="md:hidden">
            <BottomPillNav onMenuOpen={openSheet} currentPath={currentPath} />
            <BottomSheet open={sheetOpen} onClose={closeSheet} theme={theme} onThemeToggle={toggleTheme} currentPath={currentPath} />
        </div>
    )
}