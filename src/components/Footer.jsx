const columns = [
    {
        heading: 'Services',
        links: [
            { label: 'Web Development', href: '/details#solution' },
            { label: 'Mobile Apps', href: '/details#solution' },
            { label: 'Custom Software', href: '/details#solution' },
            { label: 'UI/UX Design', href: '/details#solution' },
        ],
    },
    {
        heading: 'Company',
        links: [
            { label: 'Our Process', href: '/details#process' },
            { label: 'Why Us', href: '/#why-us' },
            { label: 'Portfolio', href: '/details#portfolio' },
            { label: 'Contact', href: '/details#contact' },
        ],
    },
]

const socials = [
    {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/company/112707161/',
        icon: (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
            </svg>
        ),
    },
    {
        label: 'Twitter/X',
        href: 'https://x.com/luminate_labs',
        icon: (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4l16 16M4 20L20 4" />
            </svg>
        ),
    },
    {
        label: 'Instagram',
        href: 'https://www.instagram.com/luminate_labs_',
        icon: (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
        ),
    },
]

function FooterLink({ href, children }) {
    return (
        <a href={href} className="block text-sm transition-colors duration-200" style={{ color: 'var(--text-muted)' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-secondary)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
            {children}
        </a>
    )
}

export default function Footer() {
    return (
        <footer
            className="pb-24 md:pb-0"
            style={{
                background: 'var(--bg-secondary)',
                borderTop: '1px solid var(--border-subtle)',
            }}
        >
            {/* Main footer */}
            <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16">
                <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-10 md:gap-12">
                    {/* Brand column */}
                    <div className="col-span-2 sm:col-span-1 md:col-span-2">
                        {/* Logo */}
                        <div className="flex items-center gap-3 mb-5">
                            <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-violet)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px var(--accent-violet-bg))' }}>
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
                            <span className="font-bold text-base tracking-tight" style={{ color: 'var(--text-primary)' }}>
                                Luminate<span style={{ color: 'var(--accent-blue)' }}>Labs</span>
                            </span>
                        </div>

                        <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-muted)' }}>
                            Luminate Labs is a software development company specializing in web applications, mobile apps, custom software, UI/UX design, and AI-powered solutions.
                        </p>

                        {/* Social icons */}
                        <div className="flex items-center gap-3 mt-6">
                            {socials.map(s => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={s.label}
                                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                                    style={{
                                        background: 'var(--bg-tertiary)',
                                        border: '1px solid var(--border-subtle)',
                                        color: 'var(--text-muted)',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = 'var(--accent-blue-bg)'
                                        e.currentTarget.style.borderColor = 'var(--accent-blue-border)'
                                        e.currentTarget.style.color = 'var(--accent-blue)'
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = 'var(--bg-tertiary)'
                                        e.currentTarget.style.borderColor = 'var(--border-subtle)'
                                        e.currentTarget.style.color = 'var(--text-muted)'
                                    }}
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {columns.map(col => (
                        <div key={col.heading}>
                            <h4
                                className="text-xs font-bold uppercase tracking-widest mb-5"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                {col.heading}
                            </h4>
                            <div className="flex flex-col gap-3">
                                {col.links.map(l => (
                                    <FooterLink key={l.label} href={l.href}>{l.label}</FooterLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom bar */}
            <div
                className="max-w-6xl mx-auto px-6 lg:px-10 py-5 flex flex-col items-start sm:flex-row sm:items-center justify-between gap-3"
                style={{ borderTop: '1px solid var(--border-subtle)' }}
            >
                <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
                    © {new Date().getFullYear()} Luminate Labs. All rights reserved.
                </p>
                <div className="flex items-center gap-5">
                    {['Privacy Policy', 'Terms of Service'].map(l => (
                        <a
                            key={l}
                            href="#"
                            className="text-xs transition-colors duration-200"
                            style={{ color: 'var(--text-faint)' }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-faint)')}
                        >
                            {l}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    )
}