import { useState } from 'react'
import AnimatedSection from './AnimatedSection'
import { motion, AnimatePresence } from 'framer-motion'

export default function ContactSection() {
    const [status, setStatus] = useState(null) // null | 'submitting' | 'success' | 'error'

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus('submitting')

        const formData = new FormData(e.target)
        formData.append('access_key', '6523992b-8a5f-4a37-8898-385d564fa793')

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })

            const data = await response.json()

            if (data.success) {
                setStatus('success')
                e.target.reset()
            } else {
                setStatus('error')
            }
        } catch (error) {
            setStatus('error')
        }
    }

    return (
        <section id="contact" aria-labelledby="contact-heading" className="relative py-24 md:py-32 px-5 md:px-6 overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
            <div className="section-divider absolute top-0 left-0 right-0" />

            {/* Ambient background glows */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div style={{
                    position: 'absolute', top: '-10%', left: '10%',
                    width: '600px', height: '600px',
                    background: 'radial-gradient(circle, var(--accent-blue-bg) 0%, transparent 65%)',
                }} />
                <div style={{
                    position: 'absolute', bottom: '-10%', right: '10%',
                    width: '500px', height: '500px',
                    background: 'radial-gradient(circle, var(--accent-violet-bg) 0%, transparent 65%)',
                }} />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
                <AnimatedSection className="text-center mb-12 md:mb-16">
                    <span className="section-label">Get in Touch</span>
                    <h2
                        id="contact-heading"
                        className="mt-6 font-black tracking-tight"
                        style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', lineHeight: 1.1, color: 'var(--text-primary)' }}
                    >
                        Send a Message
                    </h2>
                    <p className="mt-4 max-w-lg mx-auto" style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
                        Have a project in mind or want to discuss your software needs? We&apos;d love to hear from you.
                    </p>
                </AnimatedSection>

                <AnimatedSection>
                    <div
                        className="glass rounded-2xl md:rounded-3xl p-6 sm:p-10 mx-auto"
                        style={{
                            maxWidth: '600px',
                            background: 'var(--glass-bg)',
                            border: '1px solid var(--border-subtle)',
                            boxShadow: 'var(--shadow-card)',
                        }}
                    >
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <input type="hidden" name="subject" value="New Inquiry from Luminate Labs Website" />
                            <input type="checkbox" name="botcheck" style={{ display: 'none' }} />

                            <div className="flex flex-col sm:flex-row gap-5">
                                <div className="flex-1">
                                    <label htmlFor="name" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        placeholder="John Doe"
                                        className="w-full px-4 py-3 rounded-xl transition-all"
                                        style={{
                                            background: 'var(--bg-secondary)',
                                            border: '1px solid var(--border-subtle)',
                                            color: 'var(--text-primary)',
                                            outline: 'none',
                                        }}
                                        onFocus={e => e.target.style.borderColor = 'var(--accent-blue)'}
                                        onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="phone" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Mobile Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        required
                                        placeholder="9496070442"
                                        className="w-full px-4 py-3 rounded-xl transition-all"
                                        style={{
                                            background: 'var(--bg-secondary)',
                                            border: '1px solid var(--border-subtle)',
                                            color: 'var(--text-primary)',
                                            outline: 'none',
                                        }}
                                        onFocus={e => e.target.style.borderColor = 'var(--accent-blue)'}
                                        onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    placeholder="Tell us about your project, business requirements, or your idea..."
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-xl transition-all resize-none"
                                    style={{
                                        background: 'var(--bg-secondary)',
                                        border: '1px solid var(--border-subtle)',
                                        color: 'var(--text-primary)',
                                        outline: 'none',
                                    }}
                                    onFocus={e => e.target.style.borderColor = 'var(--accent-blue)'}
                                    onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
                                />
                            </div>

                            <motion.button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="mt-2 w-full flex items-center justify-center font-bold text-base transition-all"
                                style={{
                                    padding: '16px 24px',
                                    borderRadius: '14px',
                                    background: status === 'submitting' ? 'var(--accent-blue-bg)' : 'linear-gradient(135deg, var(--accent-blue), var(--accent-violet))',
                                    color: '#fff',
                                    cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                                    boxShadow: status === 'submitting' ? 'none' : '0 8px 24px var(--accent-blue-bg)',
                                }}
                                whileHover={status !== 'submitting' ? { scale: 1.02 } : {}}
                                whileTap={status !== 'submitting' ? { scale: 0.98 } : {}}
                            >
                                {status === 'submitting' ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </span>
                                ) : 'Send Message'}
                            </motion.button>

                            <AnimatePresence>
                                {status === 'success' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-center mt-2 text-sm font-medium text-green-500"
                                    >
                                        Message sent successfully! We'll be in touch shortly.
                                    </motion.div>
                                )}
                                {status === 'error' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-center mt-2 text-sm font-medium text-red-500"
                                    >
                                        Something went wrong. Please try again or email us directly.
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </div>
                </AnimatedSection>
            </div>

            <div className="section-divider absolute bottom-0 left-0 right-0" />
        </section>
    )
}
