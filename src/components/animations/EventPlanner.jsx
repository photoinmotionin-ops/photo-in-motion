import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Aperture, 
  Sliders
} from 'lucide-react';

const cameraPerspectives = [
  {
    id: 'focal-85',
    lens: '85mm f/1.4',
    name: 'The Signature Portrait',
    role: 'SHALLOW DEPTH OF FIELD · EYE-AF LOCK',
    desc: 'Separates the subject from the background with creamy optical bokeh, locking onto eye micro-expressions.',
    shutter: '1/400s',
    aperture: 'f/1.4',
    iso: 'ISO 100',
    kelvin: '5600K',
    afPoints: { x: '52%', y: '38%' },
    imgGraded: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    imgRaw: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=30'
  },
  {
    id: 'focal-24',
    lens: '24mm f/2.8',
    name: 'The Architectural Grandeur',
    role: 'ULTRA-WIDE PERSPECTIVE · VENUE & MANDAP',
    desc: 'Captures the monumental scale of your celebration venue, chandeliers, and the grand entrance in 4K clarity.',
    shutter: '1/250s',
    aperture: 'f/4.0',
    iso: 'ISO 400',
    kelvin: '3200K',
    afPoints: { x: '50%', y: '55%' },
    imgGraded: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85',
    imgRaw: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=30'
  },
  {
    id: 'focal-50',
    lens: '50mm f/1.2',
    name: 'The Human Connection',
    role: 'NATURAL FIELD OF VIEW · UNSTAGED CANDIDS',
    desc: 'Replicates natural human vision to capture raw laughter, flying flowers, and tearful hugs without interference.',
    shutter: '1/800s',
    aperture: 'f/1.8',
    iso: 'ISO 200',
    kelvin: '5200K',
    afPoints: { x: '46%', y: '42%' },
    imgGraded: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85',
    imgRaw: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=30'
  },
  {
    id: 'focal-135',
    lens: '135mm f/2.0',
    name: 'The Intimate Telephoto',
    role: 'DISTANT COMPRESSION · STOLEN GLANCES',
    desc: 'Discreet long-distance compression that documents sacred rituals and private glances from across the room.',
    shutter: '1/500s',
    aperture: 'f/2.0',
    iso: 'ISO 800',
    kelvin: '4800K',
    afPoints: { x: '58%', y: '35%' },
    imgGraded: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
    imgRaw: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=30'
  }
];

export default function EventPlanner() {
  const [activeFocalIndex, setActiveFocalIndex] = useState(0);
  const [isGraded, setIsGraded] = useState(true);
  const [isShutterFired, setIsShutterFired] = useState(false);
  const [isAutoCycling, setIsAutoCycling] = useState(true);

  const currentShot = cameraPerspectives[activeFocalIndex];

  useEffect(() => {
    if (!isAutoCycling) return;
    const interval = setInterval(() => {
      triggerLensChange((activeFocalIndex + 1) % cameraPerspectives.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeFocalIndex, isAutoCycling]);

  const triggerLensChange = (nextIndex) => {
    setIsShutterFired(true);
    setTimeout(() => {
      setActiveFocalIndex(nextIndex);
      setIsShutterFired(false);
    }, 280);
  };

  return (
    <section 
      className="camera-focus-engine-root"
      style={{
        position: 'relative',
        width: '100%',
        padding: '120px 6%',
        background: '#070707',
        color: '#fff',
        overflow: 'hidden',
        borderTop: '1px solid rgba(198, 164, 107, 0.15)',
        borderBottom: '1px solid rgba(198, 164, 107, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {/* Background Atmosphere */}
      <div 
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '750px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(198, 164, 107, 0.12) 0%, transparent 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none'
        }}
      />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '45px', position: 'relative', zIndex: 10 }}>
        <div 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '9999px',
            background: 'rgba(198, 164, 107, 0.08)',
            border: '1px solid rgba(198, 164, 107, 0.25)',
            color: 'var(--gold, #c6a46b)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}
        >
          <Camera size={14} color="var(--gold, #c6a46b)" />
          <span>THE MASTER'S CAMERA EYE</span>
        </div>

        <h2 
          style={{
            fontFamily: 'var(--heading-font, "Cinzel", serif)',
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 400,
            color: 'var(--white, #fff)',
            margin: '0 0 12px 0'
          }}
        >
          Anatomy of a <span style={{ color: 'var(--gold, #c6a46b)', fontStyle: 'italic' }}>Cinematic Frame</span>
        </h2>

        <p style={{ color: 'var(--muted, #888)', fontSize: '14.5px', maxWidth: '620px', margin: '0 auto', lineHeight: 1.6 }}>
          Automated multi-lens tracking and master cinema color grading designed to capture every glance with precision.
        </p>
      </div>

      {/* VIEWFINDER CONTAINER */}
      <div 
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1100px',
          borderRadius: '24px',
          overflow: 'hidden',
          background: '#0f0e0d',
          border: '1px solid rgba(198, 164, 107, 0.3)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.85)',
          zIndex: 10
        }}
        onMouseEnter={() => setIsAutoCycling(false)}
        onMouseLeave={() => setIsAutoCycling(true)}
      >
        {/* Top Viewfinder Status */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 24px',
            background: 'rgba(10, 10, 10, 0.85)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '11.5px',
            fontFamily: 'monospace',
            color: 'rgba(255, 255, 255, 0.7)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 'bold' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block', boxShadow: '0 0 8px #ef4444' }} />
              LIVE EYE-AF ACTIVE
            </span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
            <span style={{ color: 'var(--gold, #c6a46b)' }}>PRORES 422 HQ · 4K 10-BIT</span>
          </div>

          <button
            type="button"
            onClick={() => setIsGraded(!isGraded)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '5px 14px',
              borderRadius: '9999px',
              background: isGraded ? 'rgba(198, 164, 107, 0.18)' : 'rgba(255, 255, 255, 0.06)',
              border: isGraded ? '1px solid var(--gold, #c6a46b)' : '1px solid rgba(255, 255, 255, 0.15)',
              color: isGraded ? 'var(--gold, #c6a46b)' : '#fff',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.25s ease'
            }}
          >
            <Sliders size={12} />
            <span>{isGraded ? 'CINEMA LUT: 35MM GOLD' : 'RAW S-LOG3 SENSOR'}</span>
          </button>
        </div>

        {/* Viewfinder Monitor Screen */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', background: '#000' }}>
          <AnimatePresence mode="wait">
            <motion.img
              key={`${currentShot.id}-${isGraded}`}
              src={isGraded ? currentShot.imgGraded : currentShot.imgRaw}
              alt={currentShot.name}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: isGraded ? 'none' : 'grayscale(35%) contrast(85%) brightness(115%)'
              }}
            />
          </AnimatePresence>

          {/* Shutter Blade Flash */}
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              background: '#000',
              opacity: isShutterFired ? 1 : 0,
              pointerEvents: 'none',
              transition: 'opacity 0.15s ease-out',
              zIndex: 30
            }}
          />

          {/* Eye-AF Box Tracker */}
          <motion.div 
            animate={{
              left: currentShot.afPoints.x,
              top: currentShot.afPoints.y,
              scale: [1, 0.95, 1],
              borderColor: ['#c6a46b', '#22c55e', '#c6a46b']
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              width: '64px',
              height: '64px',
              transform: 'translate(-50%, -50%)',
              border: '1.5px solid var(--gold, #c6a46b)',
              borderRadius: '8px',
              pointerEvents: 'none',
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(198, 164, 107, 0.4)'
            }}
          >
            <div style={{ width: '4px', height: '4px', background: '#22c55e', borderRadius: '50%' }} />
            <span 
              style={{
                position: 'absolute',
                top: '-18px',
                left: 0,
                fontSize: '9px',
                fontFamily: 'monospace',
                background: 'rgba(0,0,0,0.85)',
                color: '#22c55e',
                padding: '1px 5px',
                borderRadius: '3px',
                border: '1px solid #22c55e'
              }}
            >
              [AF-LOCK]
            </span>
          </motion.div>

          {/* Bottom Telemetry Bar */}
          <div 
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '16px 24px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              fontFamily: 'monospace',
              fontSize: '12px',
              color: '#fff',
              zIndex: 25
            }}
          >
            <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
              <span style={{ color: 'var(--gold, #c6a46b)', fontWeight: 'bold' }}>{currentShot.lens}</span>
              <span>EXP: {currentShot.shutter}</span>
              <span>IRIS: {currentShot.aperture}</span>
              <span>{currentShot.iso}</span>
              <span>{currentShot.kelvin}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.7)' }}>
              <span>BATTERY: 94%</span>
              <span style={{ color: '#22c55e' }}>CARD 1: 4K RAW OK</span>
            </div>
          </div>
        </div>

        {/* BOTTOM LENS SELECTOR CARDS */}
        <div 
          style={{
            padding: '24px 30px',
            background: '#0d0c0b',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          {cameraPerspectives.map((persp, idx) => {
            const isSelected = idx === activeFocalIndex;

            return (
              <button
                key={persp.id}
                type="button"
                onClick={() => triggerLensChange(idx)}
                style={{
                  textAlign: 'left',
                  padding: '16px',
                  borderRadius: '16px',
                  background: isSelected ? 'rgba(198, 164, 107, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: isSelected ? '1px solid var(--gold, #c6a46b)' : '1px solid rgba(255, 255, 255, 0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeLensIndicator"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '20px',
                      right: '20px',
                      height: '2px',
                      background: 'var(--gold, #c6a46b)',
                      boxShadow: '0 0 10px var(--gold, #c6a46b)'
                    }}
                  />
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span 
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: isSelected ? 'var(--gold, #c6a46b)' : 'rgba(255,255,255,0.5)'
                    }}
                  >
                    {persp.lens}
                  </span>
                  {isSelected && <Aperture size={14} color="var(--gold, #c6a46b)" className="animate-spin-slow" />}
                </div>

                <h4 style={{ fontFamily: 'var(--heading-font, "Cinzel", serif)', fontSize: '15px', color: '#fff', margin: '0 0 4px 0' }}>
                  {persp.name}
                </h4>

                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.5 }}>
                  {persp.role}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spinSlow 8s linear infinite;
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .camera-focus-engine-root {
            padding: 80px 4% !important;
          }
        }
      `}</style>
    </section>
  );
}
