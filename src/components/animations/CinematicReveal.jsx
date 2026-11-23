import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Aperture, Sparkles, ChevronRight, Play, Camera } from 'lucide-react';
import './CinematicReveal.css';

gsap.registerPlugin(ScrollTrigger);

const cinematicFrames = [
  {
    id: 1,
    tag: "ROYAL WEDDINGS",
    title: "Forever in a Golden Glance",
    focal: "85mm • f/1.4 • 1/250s",
    desc: "Sacred ceremonies wrapped in heritage, silence, and eternal commitment.",
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85"
  },
  {
    id: 2,
    tag: "CINEMATIC EMOTIONS",
    title: "Where Whispers Turn Eternal",
    focal: "50mm • f/1.2 • 1/500s",
    desc: "Unstaged glances and real emotions etched into cinematic motion.",
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85"
  },
  {
    id: 3,
    tag: "TIMELESS CELEBRATIONS",
    title: "Dancing Under Starlit Skies",
    focal: "35mm • f/1.8 • 1/160s",
    desc: "Vibrant festivities and joyous reunions frozen in breathtaking light.",
    url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85"
  },
  {
    id: 4,
    tag: "SACRED PROMISES",
    title: "The Heartbeat of the Moment",
    focal: "24mm • f/2.0 • 1/1000s",
    desc: "Every frame a living painting, preserving memories for generations.",
    url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85"
  }
];

export default function CinematicReveal() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShutterClosing, setIsShutterClosing] = useState(false);

  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const circularPortalRef = useRef(null);
  const infoRef = useRef(null);

  // Auto-cycle through images every 4.5 seconds with shutter transition
  useEffect(() => {
    const timer = setInterval(() => {
      triggerNextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const triggerNextSlide = (nextIdx = null) => {
    setIsShutterClosing(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (nextIdx !== null ? nextIdx : (prev + 1) % cinematicFrames.length));
      setIsShutterClosing(false);
    }, 380);
  };

  // GSAP ScrollTrigger Reveal on enter
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          end: "bottom 30%",
          toggleActions: "play none none reverse"
        }
      });

      tl.fromTo(
        circularPortalRef.current,
        { scale: 0.6, opacity: 0, rotate: -45 },
        { scale: 1, opacity: 1, rotate: 0, duration: 1.4, ease: "power3.out" }
      ).fromTo(
        infoRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
        "-=0.7"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const activeFrame = cinematicFrames[currentIndex];

  return (
    <section className="cinematic-reveal-container" ref={containerRef}>
      {/* Background Cinematic Atmosphere */}
      <div className="cinematic-glow-backdrop" />
      <div className="cinematic-grid-overlay" />

      {/* Header Tag */}
      <div className="reveal-header text-center">
        <div className="reveal-badge">
          <Camera className="w-3.5 h-3.5 text-gold" />
          <span>OPTICAL IRIS ENGINE</span>
        </div>
        <h2 className="reveal-main-title">
          Through the <span>Master's Lens</span>
        </h2>
      </div>

      <div className="cinematic-stage" ref={stageRef}>
        
        {/* =========================================================
            CIRCULAR ROTATING LENS SHOWCASE
        ========================================================= */}
        <div 
          className="lens-assembly-wrapper" 
          ref={circularPortalRef}
          onClick={() => triggerNextSlide()}
          title="Click to view next frame"
        >
          {/* 1. Breathing Golden Halo */}
          <div className="lens-golden-halo" />

          {/* 2. Outer Rotating Focal Ring (Clockwise Continuous Motion) */}
          <div className="lens-outer-dial always-rotating-cw">
            <svg viewBox="0 0 400 400" className="lens-svg-dial">
              <defs>
                <path
                  id="textPathDial"
                  d="M 200, 200 m -175, 0 a 175,175 0 1,1 350,0 a 175,175 0 1,1 -350,0"
                />
              </defs>
              <circle cx="200" cy="200" r="190" className="dial-border-dashed" />
              <circle cx="200" cy="200" r="172" className="dial-border-solid" />
              <text className="dial-text-track">
                <textPath href="#textPathDial" startOffset="0%">
                  • 24MM • 35MM • 50MM • 85MM • 105MM • F/1.2 • 4K RAW • 60FPS • ISO 100 • SHUTTER 1/250 •
                </textPath>
              </text>
            </svg>
          </div>

          {/* 3. Middle Counter-Rotating Technical Ring (CCW Continuous Motion) */}
          <div className="lens-middle-ring always-rotating-ccw">
            <div className="lens-tick tick-0" />
            <div className="lens-tick tick-90" />
            <div className="lens-tick tick-180" />
            <div className="lens-tick tick-270" />
            <div className="lens-crosshair" />
          </div>

          {/* 4. Glowing Aperture Accent Bezel */}
          <div className="lens-aperture-bezel" />

          {/* 5. The Main Circular Image Portal */}
          <div className="lens-circular-portal">
            
            {/* Smooth Cycling Image with Ken Burns Zoom */}
            <div className="lens-image-holder">
              <img
                key={activeFrame.id}
                src={activeFrame.url}
                alt={activeFrame.title}
                className="lens-active-image ken-burns-active"
              />
            </div>

            {/* Camera Iris / Shutter Blade Closing Effect */}
            <div className={`lens-shutter-overlay ${isShutterClosing ? 'shutter-closed' : ''}`}>
              <div className="shutter-blade blade-top" />
              <div className="shutter-blade blade-bottom" />
              <div className="shutter-flash" />
            </div>

            {/* Curved Optical Glass Flare */}
            <div className="lens-glass-reflection" />
            
            {/* Center Floating Prompt Chip */}
            <div className="lens-center-pill">
              <Aperture className="w-3.5 h-3.5 text-gold animate-spin-slow" />
              <span>{activeFrame.focal}</span>
            </div>
          </div>
        </div>

        {/* =========================================================
            DYNAMIC STORY DETAILS CARD
        ========================================================= */}
        <div className="reveal-caption-panel" ref={infoRef}>
          <div className="caption-tag-row">
            <span className="caption-category-tag">{activeFrame.tag}</span>
            <span className="caption-counter">
              0{currentIndex + 1} <span className="text-white/30">/</span> 0{cinematicFrames.length}
            </span>
          </div>

          <h3 className="caption-title">{activeFrame.title}</h3>
          <p className="caption-desc">{activeFrame.desc}</p>

          {/* Interactive Navigation Dots with Circular Progress Bar */}
          <div className="caption-dots-wrap">
            {cinematicFrames.map((frame, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={frame.id}
                  onClick={() => triggerNextSlide(index)}
                  className={`caption-dot-btn ${isActive ? 'dot-active' : ''}`}
                  aria-label={`Jump to slide ${index + 1}`}
                >
                  <span className="dot-indicator" />
                  {isActive && <span className="dot-progress-halo" />}
                </button>
              );
            })}
          </div>

          <div className="caption-action-hint">
            <span>Tap circle to switch frame</span>
            <ChevronRight className="w-4 h-4 text-gold inline ml-1" />
          </div>
        </div>

      </div>
    </section>
  );
}
