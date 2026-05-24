'use client';

import { useEffect, useState } from 'react';

export default function Loading() {
  const [phase, setPhase] = useState(0);

  // 0 = scissors moving, 1 = B revealed, 2 = S revealed, 3 = text
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 800);
    const t3 = setTimeout(() => setPhase(3), 1100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-[9999]"
      style={{ background: 'linear-gradient(135deg, #1C0A0A 0%, #3D0808 50%, #8B0000 100%)' }}
    >
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.04]"
           style={{ backgroundImage: 'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 12px)', backgroundSize: '12px 12px' }} />

      {/* ── Logo Animation Canvas ── */}
      <div className="relative mb-8" style={{ width: 200, height: 200 }}>

        {/* Glow behind */}
        <div className="absolute inset-0 rounded-full opacity-20 blur-2xl"
             style={{ background: 'radial-gradient(circle, #E31837, transparent 70%)' }} />

        {/* ── B Letter ── */}
        <div
          className="absolute left-0 top-0 transition-all duration-500"
          style={{
            opacity:   phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? 'scale(1) translateX(0)' : 'scale(0.7) translateX(-20px)',
          }}
        >
          <svg width="200" height="200" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="lB" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B0000" />
                <stop offset="60%" stopColor="#A31515" />
                <stop offset="100%" stopColor="#5C0000" />
              </linearGradient>
              <filter id="fB">
                <feDropShadow dx="2" dy="3" stdDeviation="4" floodColor="#00000055" />
              </filter>
            </defs>
            {/* B shape */}
            <text
              x="18" y="160"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontSize="165"
              fontWeight="900"
              fontStyle="italic"
              fill="url(#lB)"
              filter="url(#fB)"
              opacity="0.95"
            >B</text>
            {/* Ribbon loop across B */}
            <path
              d="M15,105 Q55,75 95,105 Q55,135 15,105 Z"
              fill="none"
              stroke="#8B0000"
              strokeWidth="3"
              opacity="0.4"
            />
          </svg>
        </div>

        {/* ── S Letter ── */}
        <div
          className="absolute left-0 top-0 transition-all duration-500"
          style={{
            opacity:   phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? 'scale(1) translateX(0)' : 'scale(0.7) translateX(20px)',
            transitionDelay: '100ms',
          }}
        >
          <svg width="200" height="200" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="lS" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E8E8E8" />
                <stop offset="40%" stopColor="#C0C0C0" />
                <stop offset="100%" stopColor="#A0A0A0" />
              </linearGradient>
              <filter id="fS">
                <feDropShadow dx="1" dy="2" stdDeviation="3" floodColor="#00000040" />
              </filter>
            </defs>
            {/* S shape */}
            <text
              x="88" y="155"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontSize="140"
              fontWeight="900"
              fontStyle="italic"
              fill="url(#lS)"
              filter="url(#fS)"
              opacity="0.85"
            >S</text>
          </svg>
        </div>

        {/* ── Scissors ── */}
        <div
          className="absolute left-0 top-0"
          style={{
            transform: phase === 0
              ? 'translateX(-60px) translateY(20px) rotate(-5deg)'
              : 'translateX(0) translateY(0) rotate(0deg)',
            transition: 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          <svg width="200" height="200" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="lSc" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#CC0000" />
                <stop offset="50%" stopColor="#FF2020" />
                <stop offset="100%" stopColor="#CC0000" />
              </linearGradient>
              <filter id="fSc">
                <feDropShadow dx="1" dy="2" stdDeviation="3" floodColor="#00000055" />
              </filter>
            </defs>

            {/* Top blade */}
            <path d="M42,102 L158,80" stroke="url(#lSc)" strokeWidth="9" strokeLinecap="round" filter="url(#fSc)">
              {phase === 0 && (
                <animateTransform attributeName="transform" type="rotate"
                  values="-10 95 95; 0 95 95; -4 95 95; 0 95 95"
                  dur="0.8s" repeatCount="indefinite" />
              )}
            </path>

            {/* Bottom blade */}
            <path d="M42,118 L158,140" stroke="url(#lSc)" strokeWidth="9" strokeLinecap="round" filter="url(#fSc)">
              {phase === 0 && (
                <animateTransform attributeName="transform" type="rotate"
                  values="10 95 125; 0 95 125; 4 95 125; 0 95 125"
                  dur="0.8s" repeatCount="indefinite" />
              )}
            </path>

            {/* Pivot */}
            <circle cx="95" cy="110" r="8" fill="#CC0000" />
            <circle cx="95" cy="110" r="3.5" fill="#FF5555" />

            {/* Handle ring top */}
            <ellipse cx="44" cy="96" rx="18" ry="12"
              fill="none" stroke="url(#lSc)" strokeWidth="8"
              transform="rotate(-15 44 96)" filter="url(#fSc)" />

            {/* Handle ring bottom */}
            <ellipse cx="44" cy="124" rx="18" ry="12"
              fill="none" stroke="url(#lSc)" strokeWidth="8"
              transform="rotate(15 44 124)" filter="url(#fSc)" />

            {/* Cut sparkles */}
            {phase >= 2 && (
              <g>
                <circle cx="158" cy="80" r="3" fill="#FFD700" opacity="0.9">
                  <animate attributeName="r" values="0;4;2;0" dur="0.5s" begin="0s" fill="freeze" />
                  <animate attributeName="opacity" values="0;1;0.5;0" dur="0.5s" begin="0s" fill="freeze" />
                </circle>
                <circle cx="163" cy="72" r="2" fill="#FF4444" opacity="0.8">
                  <animate attributeName="r" values="0;3;0" dur="0.4s" begin="0.1s" fill="freeze" />
                </circle>
                <circle cx="153" cy="72" r="2" fill="#FFD700" opacity="0.8">
                  <animate attributeName="r" values="0;3;0" dur="0.4s" begin="0.15s" fill="freeze" />
                </circle>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* ── Brand Text ── */}
      <div
        className="text-center transition-all duration-500"
        style={{
          opacity:   phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0)' : 'translateY(12px)',
        }}
      >
        <p
          className="text-white tracking-[0.3em] uppercase font-bold text-lg"
          style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.25em' }}
        >
          BIN SIDDIQ FABRIC
        </p>
        <p
          className="tracking-[0.5em] uppercase text-sm mt-1 font-semibold"
          style={{ color: '#E31837', letterSpacing: '0.4em' }}
        >
          PREMIUM QUALITY
        </p>

        {/* Loading dots */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: '#E31837',
                animation: `loadingDot 1.2s ${i * 0.2}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes loadingDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
