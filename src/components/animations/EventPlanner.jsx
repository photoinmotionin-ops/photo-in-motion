import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Sliders, 
  Play, 
  Pause, 
  Mic 
} from 'lucide-react';

const defaultMasterShotGallery = [
  {
    id: 'shot-01',
    lens: '85mm f/1.4',
    category: 'BRIDAL PORTRAITURE',
    focalName: 'The Signature Bokeh',
    desc: 'Creamy optical depth with tack-sharp focus on the bridal veil and eye highlights.',
    shutter: '1/500s',
    aperture: 'f/1.4',
    apertureRatio: 0.95,
    iso: 'ISO 100',
    kelvin: '5600K Daylight',
    imgGraded: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    imgRaw: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=25'
  },
  {
    id: 'shot-02',
    lens: '24mm f/2.8',
    category: 'ROYAL VENUE & MANDAP',
    focalName: 'Architectural Grandeur',
    desc: 'Capturing the monumental scale of grand chandeliers, palace pillars, and floral ceilings.',
    shutter: '1/250s',
    aperture: 'f/4.0',
    apertureRatio: 0.55,
    iso: 'ISO 400',
    kelvin: '3200K Tungsten',
    imgGraded: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85',
    imgRaw: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=25'
  },
  {
    id: 'shot-03',
    lens: '50mm f/1.2',
    category: 'UNSTAGED CANDIDS',
    focalName: 'Joyous Marigold Haldi',
    desc: 'Freeze-motion laughter and flying marigold petals with natural human field of view.',
    shutter: '1/800s',
    aperture: 'f/1.8',
    apertureRatio: 0.88,
    iso: 'ISO 200',
    kelvin: '5200K Warm Sunlight',
    imgGraded: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85',
    imgRaw: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=25'
  },
  {
    id: 'shot-04',
    lens: '135mm f/2.0',
    category: 'INTIMATE TELEPHOTO',
    focalName: 'Stolen Glance in the Mist',
    desc: 'Unobtrusive compression from afar, preserving tender moments without intruding.',
    shutter: '1/640s',
    aperture: 'f/2.0',
    apertureRatio: 0.78,
    iso: 'ISO 640',
    kelvin: '4800K Golden Dawn',
    imgGraded: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
    imgRaw: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=25'
  },
  {
    id: 'shot-05',
    lens: '35mm f/1.4',
    category: 'EVENING RECEPTION GALA',
    focalName: 'The First Dance',
    desc: 'Cinematic wide-aperture capture of starlit waltzes and ambient venue spotlights.',
    shutter: '1/200s',
    aperture: 'f/1.4',
    apertureRatio: 0.95,
    iso: 'ISO 800',
    kelvin: '3800K Ambiance',
    imgGraded: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=85',
    imgRaw: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=25'
  },
  {
    id: 'shot-06',
    lens: '85mm f/1.4',
    category: 'EDITORIAL PORTRAIT',
    focalName: 'Serenity & Grace',
    desc: 'Studio-quality natural window sidelight highlighting jewelry and embroidery details.',
    shutter: '1/320s',
    aperture: 'f/1.6',
    apertureRatio: 0.9,
    iso: 'ISO 160',
    kelvin: '5500K Studio',
    imgGraded: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
    imgRaw: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=25'
  }
];

export default function EventPlanner({ shots = null }) {
  const gallery = (shots && shots.length > 0) ? shots : defaultMasterShotGallery;

  const [currentShotIndex, setCurrentShotIndex] = useState(0);
  const [isGraded, setIsGraded] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [cycleProgress, setCycleProgress] = useState(0);

  // 5.2 seconds per photo for a relaxed cinematic showcase
  const CYCLE_DURATION = 5200; 

  const currentShot = gallery[currentShotIndex] || gallery[0];

  // Automated Smooth Progress Timer & Image Cycling
  useEffect(() => {
    if (!isPlaying) return;

    const intervalStep = 50;
    const stepIncrement = (intervalStep / CYCLE_DURATION) * 100;

    const progressTimer = setInterval(() => {
      setCycleProgress((prev) => {
        if (prev >= 100) {
          triggerNextShot();
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalStep);

    return () => clearInterval(progressTimer);
  }, [currentShotIndex, isPlaying, gallery.length]);

  const triggerNextShot = (explicitIndex = null) => {
    setCycleProgress(0);
    setCurrentShotIndex((prev) => 
      explicitIndex !== null ? explicitIndex : (prev + 1) % gallery.length
    );
  };

  return (
    <section 
      className="camera-focus-engine-root"
      style={{
        position: 'relative',
        width: '100%',
        padding: '110px 5% 100px',
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
      {/* Background Ambient Glow */}
      <div 
        style={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(198, 164, 107, 0.14) 0%, transparent 70%)',
          filter: 'blur(110px)',
          pointerEvents: 'none'
        }}
      />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 10 }}>
        <div 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 18px',
            borderRadius: '9999px',
            background: 'rgba(198, 164, 107, 0.08)',
            border: '1px solid rgba(198, 164, 107, 0.28)',
            color: 'var(--gold, #c6a46b)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            marginBottom: '14px',
            backdropFilter: 'blur(8px)'
          }}
        >
          <Camera size={14} color="var(--gold, #c6a46b)" />
          <span>REAL-TIME CAMERA FOCUS ENGINE</span>
        </div>

        <h2 
          style={{
            fontFamily: 'var(--heading-font, "Cinzel", serif)',
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 400,
            color: 'var(--white, #fff)',
            margin: '0 0 12px 0',
            letterSpacing: '0.2px'
          }}
        >
          Through the <span style={{ color: 'var(--gold, #c6a46b)', fontStyle: 'italic' }}>Director's Viewfinder</span>
        </h2>

        <p style={{ color: 'var(--muted, #888)', fontSize: '14px', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
          Automated live camera tracking, multi-lens switching, and master cinema color grading in continuous motion.
        </p>
      </div>

      {/* Main Viewfinder Frame */}
      <div 
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1120px',
          borderRadius: '24px',
          overflow: 'hidden',
          background: '#0c0c0b',
          border: '1px solid rgba(198, 164, 107, 0.35)',
          boxShadow: '0 30px 90px rgba(0, 0, 0, 0.9)',
          zIndex: 10
        }}
      >
        {/* Top Status & Controls */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 22px',
            background: 'rgba(12, 12, 11, 0.95)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '11px',
            fontFamily: 'monospace',
            color: 'rgba(255, 255, 255, 0.7)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 'bold' }}>
              <span className="live-rec-dot" />
              LIVE SHOT SEQUENCE
            </span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
            <span style={{ color: 'var(--gold, #c6a46b)' }} className="hidden sm:inline">
              4K CINEMA DCI · 24.00 FPS
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '9999px',
                background: isPlaying ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.15)',
                border: isPlaying ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
                color: isPlaying ? '#4ade80' : '#f87171',
                fontSize: '10.5px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} />}
              <span>{isPlaying ? 'AUTO-CHANGING' : 'PAUSED'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsGraded(!isGraded)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '9999px',
                background: isGraded ? 'rgba(198, 164, 107, 0.18)' : 'rgba(255, 255, 255, 0.06)',
                border: isGraded ? '1px solid var(--gold, #c6a46b)' : '1px solid rgba(255, 255, 255, 0.15)',
                color: isGraded ? 'var(--gold, #c6a46b)' : '#fff',
                fontSize: '10.5px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            >
              <Sliders size={12} />
              <span>{isGraded ? '35MM GOLD LUT' : 'RAW S-LOG SENSOR'}</span>
            </button>
          </div>
        </div>

        {/* Auto-Countdown Progress Bar */}
        <div style={{ width: '100%', height: '3px', background: 'rgba(255, 255, 255, 0.08)', position: 'relative' }}>
          <div 
            style={{ 
              width: `${cycleProgress}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, var(--gold, #c6a46b), #f8d794)',
              transition: 'width 0.05s linear',
              boxShadow: '0 0 10px rgba(198, 164, 107, 0.8)'
            }} 
          />
        </div>

        {/* Viewfinder Main Viewport */}
        <div 
          onClick={() => triggerNextShot()}
          style={{ 
            position: 'relative', 
            width: '100%', 
            aspectRatio: '16/9', 
            overflow: 'hidden', 
            background: '#050505',
            cursor: 'pointer'
          }}
          title="Click to advance frame"
        >
          {/* SMOOTH CROSS-FADE / POP TRANSITION */}
          <AnimatePresence mode="popLayout">
            <motion.img
              key={`${currentShot.id || currentShotIndex}-${isGraded}`}
              src={isGraded ? currentShot.imgGraded : (currentShot.imgRaw || currentShot.imgGraded)}
              alt={currentShot.focalName}
              initial={{ opacity: 0, scale: 1.06, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
              transition={{ 
                duration: 0.9, 
                ease: [0.25, 1, 0.5, 1] 
              }}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: isGraded ? 'none' : 'grayscale(45%) contrast(80%) brightness(120%)'
              }}
            />
          </AnimatePresence>

          <div className="viewfinder-light-leak" />

          {/* 3x3 Composition Grid */}
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gridTemplateRows: '1fr 1fr 1fr',
              pointerEvents: 'none',
              zIndex: 10,
              opacity: 0.16
            }}
          >
            <div style={{ borderRight: '1px solid rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.4)' }} />
            <div style={{ borderRight: '1px solid rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.4)' }} />
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.4)' }} />
            <div style={{ borderRight: '1px solid rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.4)' }} />
            <div style={{ borderRight: '1px solid rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.4)' }} />
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.4)' }} />
          </div>

          {/* Optical Iris Gauge & Audio Meter */}
          <div 
            style={{
              position: 'absolute',
              top: '16px',
              right: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              zIndex: 25,
              pointerEvents: 'none'
            }}
          >
            <div 
              style={{
                background: 'rgba(10, 10, 10, 0.85)',
                backdropFilter: 'blur(8px)',
                padding: '8px 12px',
                borderRadius: '12px',
                border: '1px solid rgba(198, 164, 107, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                fontFamily: 'monospace'
              }}
            >
              <div 
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: '1.5px solid var(--gold, #c6a46b)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#000'
                }}
              >
                <div 
                  style={{
                    width: `${Math.round((currentShot.apertureRatio || 0.8) * 14)}px`,
                    height: `${Math.round((currentShot.apertureRatio || 0.8) * 14)}px`,
                    borderRadius: '50%',
                    background: 'var(--gold, #c6a46b)',
                    transition: 'all 0.4s ease'
                  }}
                />
              </div>
              <span style={{ color: 'var(--gold, #c6a46b)', fontWeight: 700 }}>
                {currentShot.aperture}
              </span>
            </div>

            <div 
              style={{
                background: 'rgba(10, 10, 10, 0.85)',
                backdropFilter: 'blur(8px)',
                padding: '6px 12px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Mic size={11} color="#4ade80" />
              <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '10px' }}>
                <span className="audio-bar bar-1" />
                <span className="audio-bar bar-2" />
                <span className="audio-bar bar-3" />
                <span className="audio-bar bar-4" />
                <span className="audio-bar bar-5" />
              </div>
              <span style={{ fontSize: '9px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)' }}>-14dB</span>
            </div>
          </div>

          {/* Telemetry Bar */}
          <div 
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '16px 24px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              fontFamily: 'monospace',
              fontSize: '11.5px',
              color: '#fff',
              zIndex: 25,
              pointerEvents: 'none'
            }}
          >
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--gold, #c6a46b)', fontWeight: 'bold' }}>
                {currentShot.lens}
              </span>
              <span>SHUTTER: {currentShot.shutter}</span>
              <span>IRIS: {currentShot.aperture}</span>
              <span>{currentShot.iso}</span>
              <span className="hidden sm:inline">{currentShot.kelvin}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'rgba(255,255,255,0.75)' }}>
              <span className="hidden sm:inline">DUAL SD: V90 OK</span>
              <span style={{ color: '#22c55e', fontWeight: 600 }}>BATT: 98%</span>
            </div>
          </div>
        </div>

        {/* Bottom Story & Lens Selector Thumbnails */}
        <div 
          style={{
            padding: '20px 24px',
            background: '#0d0d0c',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--gold, #c6a46b)', fontWeight: 700, letterSpacing: '1px' }}>
                {currentShot.category}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>
                SHOT 0{currentShotIndex + 1} OF 0{gallery.length}
              </span>
            </div>
            <h4 style={{ fontFamily: 'var(--heading-font, "Cinzel", serif)', fontSize: '16px', color: '#fff', margin: '0 0 3px 0' }}>
              {currentShot.focalName}
            </h4>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.4 }}>
              {currentShot.desc}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {gallery.map((shot, idx) => {
              const isSelected = idx === currentShotIndex;

              return (
                <button
                  key={shot.id || idx}
                  type="button"
                  onClick={() => triggerNextShot(idx)}
                  style={{
                    position: 'relative',
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: isSelected ? '2px solid var(--gold, #c6a46b)' : '1px solid rgba(255, 255, 255, 0.2)',
                    background: '#000',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.3s ease',
                    boxShadow: isSelected ? '0 0 14px rgba(198, 164, 107, 0.6)' : 'none',
                    transform: isSelected ? 'scale(1.1)' : 'scale(1)'
                  }}
                  title={`${shot.lens} - ${shot.focalName}`}
                >
                  <img 
                    src={shot.imgGraded} 
                    alt={shot.lens} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isSelected ? 1 : 0.55 }}
                  />
                  {isSelected && (
                    <span 
                      style={{
                        position: 'absolute',
                        inset: 0,
                        border: '1.5px solid var(--gold, #c6a46b)',
                        borderRadius: '50%'
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .live-rec-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ef4444;
          display: inline-block;
          box-shadow: 0 0 8px #ef4444;
          animation: recPulse 1.2s infinite ease-in-out;
        }
        @keyframes recPulse {
          0% { opacity: 0.4; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
          100% { opacity: 0.4; transform: scale(0.85); }
        }
        .viewfinder-light-leak {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(198, 164, 107, 0.1) 0%, transparent 40%, rgba(255, 255, 255, 0.05) 100%);
          pointer-events: none;
          z-index: 12;
        }
        .audio-bar {
          width: 2.5px;
          border-radius: 1px;
          background: #22c55e;
          animation: audioWave 1s infinite alternate ease-in-out;
        }
        .bar-1 { height: 4px; animation-delay: 0.1s; }
        .bar-2 { height: 8px; animation-delay: 0.3s; }
        .bar-3 { height: 10px; animation-delay: 0.15s; }
        .bar-4 { height: 6px; animation-delay: 0.4s; }
        .bar-5 { height: 9px; animation-delay: 0.25s; background: #eab308; }
        @keyframes audioWave {
          0% { height: 3px; }
          100% { height: 11px; }
        }
        @media (max-width: 768px) {
          .camera-focus-engine-root {
            padding: 70px 4% !important;
          }
        }
      `}</style>
    </section>
  );
}
