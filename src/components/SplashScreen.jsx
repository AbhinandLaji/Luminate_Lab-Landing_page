import React, { useState, useEffect } from 'react';
import './SplashScreen.css';

export default function SplashScreen({ onComplete }) {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Prevent scrolling while splash screen is active
    document.body.style.overflow = 'hidden';
    
    // Start fading out after 3.5s to ensure the full animation completes and is visible
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 3500);

    // Completely unmount after 4s (wait for fade transition)
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      document.body.style.overflow = '';
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`splash-container ${isFading ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <div className="splash-logo">
          <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 12px rgba(139, 92, 246, 0.4))' }}>
            <circle cx="12" cy="12" r="10" />
            <path d="M10 6 Q 16 7, 17.5 13.5" />
            <path d="M14 5.5 Q 18 3, 20 6" />
            <path d="M7 10 Q 4 13, 8 19" />
            <path d="M11.5 11.5 Q 6 12, 4 17" />
            <path d="M8 13.5 Q 11 18, 14 17.5" />
            <circle cx="10" cy="6" r="1.2" fill="#8b5cf6" stroke="none" />
            <circle cx="17.5" cy="13.5" r="1.2" fill="#8b5cf6" stroke="none" />
            <circle cx="14" cy="5.5" r="1.2" fill="#8b5cf6" stroke="none" />
            <circle cx="7" cy="10" r="1.2" fill="#8b5cf6" stroke="none" />
            <circle cx="11.5" cy="11.5" r="1.2" fill="#8b5cf6" stroke="none" />
            <circle cx="8" cy="13.5" r="1.2" fill="#8b5cf6" stroke="none" />
            <circle cx="14" cy="17.5" r="1.2" fill="#8b5cf6" stroke="none" />
          </svg>
        </div>
        <span className="splash-word splash-luminate">Luminate</span>
        <span className="splash-word splash-labs">Labs</span>
      </div>
    </div>
  );
}
