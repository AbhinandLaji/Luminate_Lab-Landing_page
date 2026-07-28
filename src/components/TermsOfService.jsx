import React, { useEffect } from 'react';

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 md:py-24" style={{ color: 'var(--text-secondary)' }}>
      <h1 className="text-3xl md:text-5xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>Terms of Service</h1>
      <p className="mb-6">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      
      <div className="space-y-8 text-sm md:text-base leading-relaxed">
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>1. Agreement to Terms</h2>
          <p>
            By accessing or using the Luminate Labs website and services, you agree to be bound by these Terms of Service. 
            If you disagree with any part of the terms, then you may not access our website or use our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>2. Intellectual Property</h2>
          <p>
            The website and its original content, features, and functionality are owned by Luminate Labs and are protected by 
            international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>3. Services Provided</h2>
          <p>
            Luminate Labs provides software development, UI/UX design, and related digital services. The specific scope of work, 
            deliverables, and payment terms will be agreed upon in a separate contract or statement of work before any project begins.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>4. Limitation of Liability</h2>
          <p>
            In no event shall Luminate Labs, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable 
            for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, 
            data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>5. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of our operating jurisdiction, without regard 
            to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>6. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use 
            our Service after those revisions become effective, you agree to be bound by the revised terms.
          </p>
        </section>
      </div>
    </div>
  );
}
