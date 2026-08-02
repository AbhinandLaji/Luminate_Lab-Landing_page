/**
 * ScrollProgress — pure CSS implementation.
 * Uses animation-timeline: scroll() which is compositor-only and zero JS overhead.
 * Falls back gracefully on browsers without scroll-timeline support.
 */
export default function ScrollProgress() {
  return (
    <>
      <style>{`
        @supports (animation-timeline: scroll()) {
          #scroll-progress-bar {
            animation: scroll-grow linear both;
            animation-timeline: scroll(root);
          }
          @keyframes scroll-grow {
            from { transform: scaleX(0); }
            to   { transform: scaleX(1); }
          }
        }
      `}</style>
      <div
        id="scroll-progress-bar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          transformOrigin: '0%',
          transform: 'scaleX(0)',
          background: 'linear-gradient(90deg, #5b7cf7, #8b5cf6, #2dd4bf)',
          zIndex: 9999,
          pointerEvents: 'none',
          willChange: 'transform',
          boxShadow: '0 0 6px rgba(91,124,247,0.5)',
        }}
      />
    </>
  )
}