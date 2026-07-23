import AnimatedSection from './AnimatedSection'
import AmbientAurora from './AmbientAurora'
import { TiltCard } from '../hooks/TiltCard'
import SwipeCarousel from './mobile/SwipeCarousel'

const features = [
    {
        accentName: 'blue',
        label: 'Full Ownership',
        headline: 'You Own the System. We Build It.',
        body: "No black boxes. No agency lock-in. We build the infrastructure that you control and understand — forever.",
        stats: [
            { value: '100%', label: 'Transparent Reporting' },
            { value: 'Day 1', label: 'Full Access' },
        ],
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
        ),
    },
    {
        accentName: 'violet',
        label: 'Proven Framework',
        headline: 'Built on What Actually Works.',
        body: 'Every strategy is backed by real performance data from $10M+ in tested ad spend across 15+ industries.',
        stats: [
            { value: '$10M+', label: 'Ad Spend Managed' },
            { value: '3.8x', label: 'Avg ROAS' },
        ],
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
            </svg>
        ),
    },
    {
        accentName: 'purple',
        label: 'Dedicated Team',
        headline: 'One Team. Complete Accountability.',
        body: 'A senior specialist handles your account end-to-end — not a revolving door of junior account managers.',
        stats: [
            { value: '48hr', label: 'Response Time' },
            { value: '98%', label: 'Retention Rate' },
        ],
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
]

function FeatureCard({ f }) {
    return (
        <div
            className="card p-6 md:p-10 flex flex-col gap-5 cursor-default"
            style={{
                background: `linear-gradient(160deg, var(--bg-card) 0%, var(--accent-${f.accentName}-bg) 100%)`,
            }}
        >
            {/* Icon */}
            <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                    background: `var(--accent-${f.accentName}-bg)`,
                    border: `1px solid var(--accent-${f.accentName}-border)`,
                    color: `var(--accent-${f.accentName})`,
                }}
            >
                {f.icon}
            </div>

            {/* Label chip */}
            <span
                className="self-start text-xs font-bold px-3 py-1 rounded-lg"
                style={{ background: `var(--accent-${f.accentName}-bg)`, color: `var(--accent-${f.accentName})`, letterSpacing: '0.06em', textTransform: 'uppercase' }}
            >
                {f.label}
            </span>

            {/* Headline */}
            <h3
                className="font-black text-xl leading-tight"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.025em' }}
            >
                {f.headline}
            </h3>

            {/* Body */}
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {f.body}
            </p>

            {/* Mini stats */}
            <div className="flex gap-6 pt-2" style={{ borderTop: `1px solid var(--accent-${f.accentName}-border)` }}>
                {f.stats.map(stat => (
                    <div key={stat.label} className="flex flex-col gap-1">
                        <span
                            className="text-xl font-black"
                            style={{ color: `var(--accent-${f.accentName})`, letterSpacing: '-0.03em' }}
                        >
                            {stat.value}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
                    </div>
                ))}
            </div>

            {/* Bottom accent */}
            <div
                className="h-0.5 rounded-full"
                style={{ background: `linear-gradient(90deg, var(--accent-${f.accentName}), transparent)`, width: '50%' }}
            />
        </div>
    )
}

export default function WhyUsSection() {
    return (
        <section id="why-us" aria-labelledby="whyus-heading" className="relative py-20 md:py-32 px-5 md:px-6 overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
            <AmbientAurora position="left" />
            <div className="section-divider absolute top-0 left-0 right-0" />

            {/* Rich ambient background */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                {/* Large purple bottom-center */}
                <div style={{
                    position: 'absolute', bottom: '-15%', left: '50%', transform: 'translateX(-50%)',
                    width: '800px', height: '600px',
                    background: 'radial-gradient(ellipse, var(--accent-violet-bg) 0%, transparent 70%)',
                }} />
                {/* Blue top-left */}
                <div style={{
                    position: 'absolute', top: '-10%', left: '-5%',
                    width: '500px', height: '500px',
                    background: 'radial-gradient(circle, var(--accent-blue-bg) 0%, transparent 65%)',
                }} />
                {/* Rose accent right */}
                <div style={{
                    position: 'absolute', top: '30%', right: '-5%',
                    width: '300px', height: '300px',
                    background: 'radial-gradient(circle, var(--accent-rose-bg) 0%, transparent 65%)',
                }} />
            </div>

            <div className="relative max-w-6xl mx-auto">
                <AnimatedSection className="text-center mb-12 md:mb-20">
                    <span className="section-label">Our Edge</span>
                    <h2
                        id="whyus-heading"
                        className="mt-6 font-black tracking-tight max-w-2xl mx-auto"
                        style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}
                    >
                        Why Luminate Labs
                    </h2>
                    <p className="mt-5 text-lg max-w-md mx-auto" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                        We&apos;re not a vendor. We&apos;re your growth partner.
                    </p>
                </AnimatedSection>

                {/* Desktop: 3-col tilt card grid */}
                <div className="hidden md:grid grid-cols-3 gap-5">
                    {features.map((f, i) => (
                        <AnimatedSection key={f.label} delay={i * 0.1}>
                            <FeatureCard f={f} />
                        </AnimatedSection>
                    ))}
                </div>

                {/* Mobile: swipe carousel */}
                <div className="md:hidden">
                    <SwipeCarousel
                        items={features}
                        keyProp={f => f.label}
                        accentFn={f => `var(--accent-${f.accentName})`}
                        cardWidth="82vw"
                        gap={12}
                        renderItem={(f) => (
                            <div
                                style={{
                                    borderRadius: 22,
                                    background: `linear-gradient(160deg, var(--bg-card) 0%, var(--accent-${f.accentName}-bg) 100%)`,
                                    border: `1px solid var(--accent-${f.accentName}-border)`,
                                    padding: '28px 24px',
                                    display: 'flex', flexDirection: 'column', gap: 18,
                                    minHeight: 360,
                                }}
                            >
                                {/* Icon */}
                                <div style={{ width: 52, height: 52, borderRadius: 16, background: `var(--accent-${f.accentName}-bg)`, border: `1px solid var(--accent-${f.accentName}-border)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: `var(--accent-${f.accentName})` }}>
                                    {f.icon}
                                </div>

                                {/* Label chip */}
                                <span style={{ alignSelf: 'flex-start', fontSize: '0.65rem', fontWeight: 800, padding: '4px 12px', borderRadius: 100, background: `var(--accent-${f.accentName}-bg)`, color: `var(--accent-${f.accentName})`, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    {f.label}
                                </span>

                                {/* Headline */}
                                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '-0.025em', color: 'var(--text-primary)', lineHeight: 1.2, margin: 0 }}>
                                    {f.headline}
                                </h3>

                                {/* Body */}
                                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.75, margin: 0 }}>
                                    {f.body}
                                </p>

                                {/* Stats row */}
                                <div style={{ display: 'flex', gap: 24, paddingTop: 14, borderTop: `1px solid var(--accent-${f.accentName}-border)`, marginTop: 'auto' }}>
                                    {f.stats.map(s => (
                                        <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                            <span style={{ fontSize: '1.4rem', fontWeight: 900, color: `var(--accent-${f.accentName})`, letterSpacing: '-0.03em' }}>{s.value}</span>
                                            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{s.label}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Accent line */}
                                <div style={{ height: 2, borderRadius: 2, background: `linear-gradient(90deg, var(--accent-${f.accentName}), transparent)`, width: '50%' }} />
                            </div>
                        )}
                    />
                    <div style={{ height: 32 }} />
                </div>
            </div>

            <div className="section-divider absolute bottom-0 left-0 right-0" />
        </section>
    )
}
