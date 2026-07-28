import AnimatedSection from './AnimatedSection'
import { TiltCard } from '../hooks/TiltCard'
import SwipeCarousel from './mobile/SwipeCarousel'

const features = [
    {
        accentName: 'blue',
        label: 'Custom Engineering',
        headline: 'You Own What We Build.',
        body: "No templates. No shortcuts. Every solution is engineered from the ground up for your specific business — clean, maintainable code you fully own.",
        stats: [
            { value: 'Clean', label: 'Code Practices' },
            { value: 'Yours', label: 'Full Ownership' },
        ],
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
            </svg>
        ),
    },
    {
        accentName: 'violet',
        label: 'Scalable Architecture',
        headline: 'Built to Scale With You.',
        body: 'Every system we design is built with scalability, performance, and maintainability in mind — so your software grows as your business does, without costly rewrites.',
        stats: [
            { value: 'Modern', label: 'Tech Stack' },
            { value: 'Scalable', label: 'By Design' },
        ],
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 22 9 12 22 2 9 12 2" /><polyline points="2 9 12 13 22 9" /><line x1="12" y1="2" x2="12" y2="13" />
            </svg>
        ),
    },
    {
        accentName: 'purple',
        label: 'Dedicated Partnership',
        headline: 'One Team. Full Accountability.',
        body: 'A committed team handles your project end-to-end with transparent communication, regular updates, and a long-term commitment to your product’s success.',
        stats: [
            { value: 'Direct', label: 'Communication' },
            { value: 'Ongoing', label: 'Support' },
        ],
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
]

function FeatureCard({ f, isLarge }) {
    return (
        <div
            className={`card p-6 md:p-10 flex ${isLarge ? 'md:flex-row' : 'flex-col'} gap-6 cursor-default h-full items-start`}
            style={{
                background: `var(--bg-secondary)`,
                borderColor: `var(--border-subtle)`,
                borderWidth: '1px',
                borderStyle: 'solid',
            }}
        >
            {/* Left side for large card, or top for small card */}
            <div className={`flex flex-col ${isLarge ? 'md:w-1/2' : ''} h-full`}>
            {/* Icon */}
            <div
                style={{
                    color: `var(--accent-${f.accentName})`,
                    transform: 'scale(2.5)',
                    transformOrigin: 'top left',
                    marginBottom: '1rem',
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
            <div className="flex gap-6 pt-6 mt-auto">
                {f.stats.map(stat => (
                    <div key={stat.label} className="flex flex-col gap-1">
                        <span
                            className="text-xl font-black"
                            style={{ color: `var(--accent-${f.accentName})`, letterSpacing: '-0.03em' }}
                        >
                            {stat.value}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                            {stat.label}
                        </span>
                    </div>
                ))}
            </div>
            </div>

            {/* Right side for large card (optional graphic or abstract shape) */}
            {isLarge && (
                <div className="hidden md:flex md:w-1/2 h-full items-center justify-center p-8">
                    <div style={{ width: '100%', height: '100%', borderRadius: '16px', background: `var(--accent-${f.accentName}-bg)`, border: `1px solid var(--accent-${f.accentName}-border)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         {/* Abstract placeholder graphic for the large card */}
                         <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke={`var(--accent-${f.accentName})`} strokeWidth="1" opacity="0.3">
                            <circle cx="60" cy="60" r="40" strokeDasharray="4 4" />
                            <circle cx="60" cy="60" r="20" />
                            <path d="M60 20 L60 100 M20 60 L100 60" />
                         </svg>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function WhyUsSection() {
    return (
        <section id="why-us" aria-labelledby="whyus-heading" className="relative py-20 md:py-32 px-5 md:px-6 overflow-hidden">
            {/* Background layer drawn BEHIND the continuous aurora wrapper */}
            <div className="absolute inset-0" style={{ background: 'var(--bg-secondary)', zIndex: -10 }} />
            <div className="section-divider absolute top-0 left-0 right-0" />

            <div className="relative max-w-6xl mx-auto">
                <AnimatedSection className="text-center mb-12 md:mb-20">
                    <h2
                        id="whyus-heading"
                        className="font-black tracking-tight max-w-2xl mx-auto"
                        style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', lineHeight: 1.05, letterSpacing: '-0.04em', color: 'var(--text-primary)' }}
                    >
                        Why Luminate Labs
                    </h2>
                    <p className="mt-6 text-xl max-w-md mx-auto" style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        We're not a vendor. We're your technology partner.
                    </p>
                </AnimatedSection>

                {/* Desktop: Asymmetrical bento grid */}
                <div className="hidden md:grid md:grid-cols-2 gap-5">
                    {features.map((f, i) => (
                        <AnimatedSection key={f.label} delay={i * 0.1} className={i === 0 ? "md:col-span-2 h-full" : "h-full"}>
                            <FeatureCard f={f} isLarge={i === 0} />
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
                                        background: `linear-gradient(160deg, var(--accent-${f.accentName}-bg) 0%, var(--accent-${f.accentName}-border) 100%), var(--bg-card)`,
                                        border: `1px solid var(--accent-${f.accentName})`,
                                        padding: '28px 24px',
                                        display: 'flex', flexDirection: 'column', gap: 18,
                                        minHeight: 360,
                                    }}
                                >
                                    {/* Icon */}
                                    <div style={{ color: `var(--accent-${f.accentName})`, transform: 'scale(2.5)', transformOrigin: 'top left', marginBottom: '1rem' }}>
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

        </section>
    )
}
