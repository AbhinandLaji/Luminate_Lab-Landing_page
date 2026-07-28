import React, { useEffect } from 'react';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 md:py-24" style={{ color: 'var(--text-secondary)' }}>
      <h1 className="text-3xl md:text-5xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>Privacy Policy</h1>
      <p className="mb-6">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      
      <div className="space-y-8 text-sm md:text-base leading-relaxed">
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>1. Introduction</h2>
          <p>
            Welcome to Luminate Labs ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. 
            This Privacy Policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) 
            and tell you about your privacy rights and how the law protects you.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>2. Data We Collect</h2>
          <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
            <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>3. How We Use Your Data</h2>
          <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal obligation.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>4. Third-Party Links</h2>
          <p>
            This website may include links to third-party websites, plug-ins and applications. Clicking on those links or enabling those connections may 
            allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, including any requests to exercise your legal rights, please contact us using the details provided on our Contact page.
          </p>
        </section>
      </div>
    </div>
  );
}
