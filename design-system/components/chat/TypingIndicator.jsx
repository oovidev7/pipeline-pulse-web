import React from 'react'

/**
 * Typing indicator — the Sentrum "S" mark pulsing in slate-500 with a soft
 * glow, shown while the assistant is thinking. CSS recreation of the app's
 * framer-motion AnimatedLogo.
 */
export function TypingIndicator({ size = 32, className = '', style }) {
  return (
    <div
      className={className}
      style={{ position: 'relative', width: size, height: size, ...style }}
    >
      <style>{`
        @keyframes snt-typing-scale { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes snt-typing-glow { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        @keyframes snt-typing-part {
          0% { opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .snt-typing * { animation: none !important; opacity: 1 !important; }
        }
      `}</style>
      <div
        className="snt-typing"
        style={{
          width: '100%',
          height: '100%',
          animation: 'snt-typing-scale 2s ease-in-out infinite',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'rgb(100 116 139 / 0.2)',
            filter: 'blur(6px)',
            animation: 'snt-typing-glow 2s ease-in-out infinite',
          }}
        ></div>
        <svg
          viewBox="0 0 123 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'relative', width: '100%', height: '100%' }}
          aria-label="Sentrum is thinking"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.89046 72.4424C4.32273 72.4424 0.557129 76.208 0.557129 80.7757C0.557129 85.3435 4.32273 89.1091 8.89046 89.1091C13.4582 89.1091 17.2238 85.3435 17.2238 80.7757C17.2238 76.208 13.4582 72.4424 8.89046 72.4424Z"
            fill="var(--slate-500)"
            style={{ animation: 'snt-typing-part 2s ease-in-out infinite' }}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M114.443 0.223633C109.875 0.223633 106.109 3.98923 106.109 8.55697C106.109 13.1247 109.875 16.8903 114.443 16.8903C119.01 16.8903 122.776 13.1247 122.776 8.55697C122.776 3.98923 119.01 0.223633 114.443 0.223633Z"
            fill="var(--slate-500)"
            style={{ animation: 'snt-typing-part 2s ease-in-out 0.2s infinite' }}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M29.7237 0.223633C15.229 0.223633 3.33301 12.1195 3.33301 26.6143C3.33301 41.109 15.2289 53.005 29.7237 53.005H93.6143C99.1143 53.005 103.338 57.229 103.338 62.729C103.338 68.229 99.1143 72.453 93.6143 72.453L28.333 72.4425C23.7653 72.4425 19.9997 76.2081 19.9997 80.7759C19.9997 85.3436 23.7653 89.1092 28.333 89.1092H93.609C108.104 89.1092 120 77.2134 120 62.7186C120 48.2239 108.104 36.3279 93.609 36.3279H29.7183C24.2183 36.3279 19.9943 32.1039 19.9943 26.6039C19.9943 21.1039 24.2183 16.8799 29.7183 16.8799L94.9997 16.8903C99.5674 16.8903 103.333 13.1247 103.333 8.55697C103.333 3.98923 99.5674 0.223633 94.9997 0.223633H29.7237Z"
            fill="var(--slate-500)"
            style={{ animation: 'snt-typing-part 2s ease-in-out 0.4s infinite' }}
          />
        </svg>
      </div>
    </div>
  )
}
