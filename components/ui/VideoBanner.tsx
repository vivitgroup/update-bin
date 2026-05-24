'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

export default function VideoBanner() {
  const videoRef   = useRef<HTMLVideoElement>(null);
  const [ready,    setReady]   = useState(false);
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.addEventListener('canplay', () => setReady(true));
    v.addEventListener('timeupdate', () => {
      // Show BS logo overlay when scissors are cutting (~2s mark)
      if (v.currentTime > 2 && v.currentTime < 5) {
        setShowLogo(true);
      } else if (v.currentTime >= 5) {
        setShowLogo(false);
      }
    });
  }, []);

  return (
    <section className="relative w-full overflow-hidden" style={{ height: 'clamp(400px, 60vh, 700px)' }}>

      {/* ── Video / Fallback ── */}
      <div className="absolute inset-0">
        {/* CSS-animated fabric-cutting scene (fallback when no video) */}
        <FabricCuttingScene showLogo={showLogo} />
      </div>

      {/* ── Dark overlay ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(28,10,10,0.6) 60%, rgba(28,10,10,0.92) 100%)',
        }}
      />

      {/* ── Content overlay ── */}
      <div className="absolute inset-0 flex items-end">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 w-full">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.35em] mb-3 opacity-80 text-white">
              ✂️ &nbsp;Premium Fabric Cutting
            </p>
            <h2
              className="font-black text-white mb-4 leading-none"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontFamily: 'Georgia, serif' }}
            >
              كل قطعة قماش <br />
              <span style={{ color: '#E31837' }}>قصة إبداع</span>
            </h2>
            <p className="text-white/70 mb-6 text-base md:text-lg leading-relaxed max-w-lg">
              أقمشة فاخرة مقصوصة بدقة متناهية — من أجود المصادر العالمية إلى يديكِ
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="font-bold text-white px-7 py-3.5 rounded-xl transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #8B0000, #E31837)' }}
              >
                تسوق الآن ←
              </Link>
              <Link
                href="/dress-viewer"
                className="font-bold px-7 py-3.5 rounded-xl transition-all hover:bg-white/20 border border-white/30 backdrop-blur-sm"
                style={{ color: 'white', background: 'rgba(255,255,255,0.1)' }}
              >
                صممي فستانك ✨
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── CSS Fabric Cutting Animation Scene ── */
function FabricCuttingScene({ showLogo }: { showLogo: boolean }) {
  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a0a0a 0%, #2d1010 40%, #4a1515 100%)' }}>

      {/* Fabric texture layers */}
      <div className="absolute inset-0 opacity-20"
           style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(139,0,0,0.3) 40px,rgba(139,0,0,0.3) 41px), repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(139,0,0,0.3) 40px,rgba(139,0,0,0.3) 41px)' }} />

      {/* Animated fabric waves */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {/* Large fabric drape */}
        <div
          className="absolute w-full h-full opacity-30"
          style={{
            background: 'linear-gradient(135deg, #8B0000 0%, #C0C0C0 35%, #8B0000 60%, #C0C0C0 100%)',
            backgroundSize: '400% 400%',
            animation: 'fabricShimmer 6s ease infinite',
          }}
        />

        {/* Fabric fold lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute w-full opacity-15"
            style={{
              height: '2px',
              background: 'linear-gradient(to right, transparent, #E31837, transparent)',
              top:       `${20 + i * 15}%`,
              animation: `fabricFold ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Scissors path animation */}
      <div
        className="absolute"
        style={{
          top: '40%',
          left: '-10%',
          animation: 'scissorsCut 4s cubic-bezier(0.4,0,0.6,1) infinite',
          transformOrigin: 'center',
        }}
      >
        <ScissorsSVG />
      </div>

      {/* Fabric being cut — left piece */}
      <div
        className="absolute top-0 left-0 h-full opacity-40"
        style={{
          width: '50%',
          background: 'linear-gradient(to right, #8B0000, #C41E3A)',
          animation: 'fabricFallLeft 4s ease-in-out infinite',
          transformOrigin: 'top right',
        }}
      />

      {/* Fabric being cut — right piece */}
      <div
        className="absolute top-0 right-0 h-full opacity-40"
        style={{
          width: '50%',
          background: 'linear-gradient(to left, #8B0000, #C41E3A)',
          animation: 'fabricFallRight 4s ease-in-out infinite',
          transformOrigin: 'top left',
        }}
      />

      {/* ── Floating BS Logo appears during cut ── */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-700"
        style={{ opacity: showLogo ? 1 : 0.15, transform: showLogo ? 'scale(1)' : 'scale(0.85)' }}
      >
        <BsLettersLogo />
      </div>

      {/* Particle effects — fabric threads */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 rounded-full opacity-60"
            style={{
              height:           `${20 + Math.random() * 40}px`,
              left:             `${5 + i * 8}%`,
              background:       i % 2 === 0 ? '#E31837' : '#C0C0C0',
              animation:        `threadFall ${2 + (i % 3)}s ${i * 0.2}s ease-in infinite`,
              top:              '-10%',
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes fabricShimmer {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @keyframes fabricFold {
          0%,100% { transform: scaleX(1) translateY(0); opacity: 0.15; }
          50%      { transform: scaleX(1.05) translateY(4px); opacity: 0.3; }
        }
        @keyframes scissorsCut {
          0%      { left: -15%; top: 38%; transform: rotate(0deg) scale(0.8); opacity: 0; }
          10%     { opacity: 1; }
          45%     { left: 55%; top: 42%; transform: rotate(-5deg) scale(1); opacity: 1; }
          50%     { left: 55%; top: 42%; transform: rotate(0deg) scale(1.1); opacity: 1; }
          55%     { left: 60%; top: 42%; transform: rotate(5deg) scale(1); opacity: 1; }
          90%     { opacity: 1; }
          100%    { left: 110%; top: 38%; transform: rotate(0deg) scale(0.8); opacity: 0; }
        }
        @keyframes fabricFallLeft {
          0%,100% { transform: rotateY(0deg); }
          48%,52% { transform: rotateY(-3deg) translateX(-2px); }
        }
        @keyframes fabricFallRight {
          0%,100% { transform: rotateY(0deg); }
          48%,52% { transform: rotateY(3deg) translateX(2px); }
        }
        @keyframes threadFall {
          0%   { top: -10%; opacity: 0; transform: rotate(0deg); }
          10%  { opacity: 0.7; }
          90%  { opacity: 0.4; }
          100% { top: 110%; opacity: 0; transform: rotate(20deg); }
        }
      `}</style>
    </div>
  );
}

/* ── Scissors SVG ── */
function ScissorsSVG() {
  return (
    <svg width="120" height="80" viewBox="0 0 120 80" className="drop-shadow-2xl">
      <defs>
        <linearGradient id="vSc" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#CC0000" />
          <stop offset="50%" stopColor="#FF2020" />
          <stop offset="100%" stopColor="#CC0000" />
        </linearGradient>
      </defs>
      {/* Top blade */}
      <path d="M20,32 L110,22" stroke="url(#vSc)" strokeWidth="7" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate"
          values="-6 60 40; 0 60 40; -6 60 40" dur="0.5s" repeatCount="indefinite" />
      </path>
      {/* Bottom blade */}
      <path d="M20,48 L110,58" stroke="url(#vSc)" strokeWidth="7" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate"
          values="6 60 40; 0 60 40; 6 60 40" dur="0.5s" repeatCount="indefinite" />
      </path>
      {/* Pivot */}
      <circle cx="60" cy="40" r="6" fill="#CC0000" />
      <circle cx="60" cy="40" r="2.5" fill="#FF5555" />
      {/* Handles */}
      <ellipse cx="20" cy="28" rx="12" ry="8" fill="none" stroke="url(#vSc)" strokeWidth="6" transform="rotate(-10 20 28)" />
      <ellipse cx="20" cy="52" rx="12" ry="8" fill="none" stroke="url(#vSc)" strokeWidth="6" transform="rotate(10 20 52)" />
    </svg>
  );
}

/* ── BS Letters Logo for overlay ── */
function BsLettersLogo() {
  return (
    <svg width="280" height="200" viewBox="0 0 280 200" className="drop-shadow-2xl">
      <defs>
        <linearGradient id="vB" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B0000" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#5C0000" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="vS" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D0D0D0" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#A0A0A0" stopOpacity="0.85" />
        </linearGradient>
        <filter id="vGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <text x="10" y="170" fontFamily="Georgia,serif" fontSize="185" fontWeight="900"
            fontStyle="italic" fill="url(#vB)" filter="url(#vGlow)" opacity="0.9">B</text>
      <text x="130" y="160" fontFamily="Georgia,serif" fontSize="160" fontWeight="900"
            fontStyle="italic" fill="url(#vS)" filter="url(#vGlow)" opacity="0.8">S</text>

      {/* Scissors across text */}
      <path d="M30,115 L250,90" stroke="#E31837" strokeWidth="6" strokeLinecap="round" opacity="0.8">
        <animateTransform attributeName="transform" type="rotate"
          values="-3 140 102; 0 140 102; -3 140 102" dur="0.8s" repeatCount="indefinite" />
      </path>
      <path d="M30,125 L250,150" stroke="#E31837" strokeWidth="6" strokeLinecap="round" opacity="0.8">
        <animateTransform attributeName="transform" type="rotate"
          values="3 140 138; 0 140 138; 3 140 138" dur="0.8s" repeatCount="indefinite" />
      </path>
      <circle cx="140" cy="118" r="9" fill="#CC0000" />
      <circle cx="140" cy="118" r="4" fill="#FF5555" />
    </svg>
  );
}
