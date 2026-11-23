import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Aperture, 
  Sparkles, 
  Camera, 
  Play, 
  Pause, 
  RotateCw, 
  ChevronRight, 
  Compass,
  Film
} from 'lucide-react';
import './CinematicReveal.css';

gsap.registerPlugin(ScrollTrigger);

const galleryMoments = [
  {
    id: 1,
    tag: "ROYAL WEDDING",
    title: "Forever Begins at Sacred Dusk",
    focal: "85mm • f/1.4 • ISO 100",
    angle: 0,
    desc: "Vows whispered beneath temple archways as the golden hour blesses every vow.",
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
    thumb: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 2,
    tag: "CINEMATIC HALDI",
    title: "Golden Petals & Joyous Tears",
    focal: "50mm • f/1.2 • ISO 200",
    angle: 60,
    desc: "Unbridled laughter and flying marigold showers captured in slow-motion warmth.",
    url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85",
    thumb: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 3,
    tag: "PRE-WEDDING DAWN",
    title: "Whispers Across The Mist",
    focal: "35mm • f/1.8 • ISO 160",
    angle: 120,
    desc: "Quiet intimacy framed by serene waters, morning reflections, and timeless poetry.",
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85",
    thumb: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 4,
    tag: "GRAND CELEBRATION",
    title: "The Euphoria of Royal Baraat",
    focal: "24mm • f/2.0 • ISO 400",
    angle: 180,
    desc: "High energy, celebratory drums, and kaleidoscopic colors frozen at peak motion.",
    url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85",
    thumb: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 5,
    tag: "STARLIT RECEPTION",
    title: "First Dance Under Chandeliers",
    focal: "105mm • f/2.8 • ISO 800",
    angle: 240,
    desc: "Chandelier glints, velvet suits, and the quiet universe of two lovers dancing alone.",
    url: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=85",
    thumb: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 6,
    tag: "SOUL PORTRAIT",
    title: "Elegance in The Mirror",
    focal: "85mm • f/1.4 • ISO 100",
    angle: 300,
    desc: "The bridal veil catching soft natural window light in profound stillness.",
    url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85",
    thumb: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=300&q=80"
  }
];

export default function CinematicReveal() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isShutterActive, setIsShutterActive] = useState(false);
  const [isOrbitPaused, setIsOrbitPaused] = useState(false);

  const containerRef = useRef(null);
  const orbitalStageRef = useRef(null);
  const centerPortalRef = useRef(null);
  const detailsRef = useRef(null);

  // Auto-cycle through the moments every 5 seconds
  useEffect(() => {
    if (isOrbitPaused) return;
    const interval = setInterval(() => {
      triggerFrameChange((activeIndex + 1) % galleryMoments.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex, isOrbitPaused]);

  // Aperture shutter snap transition
  const triggerFrameChange = (nextIndex) => {
    if (nextIndex === activeIndex) return;
    setIsShutterActive(true);
    setTimeout(() => {
      setActiveIndex(nextIndex);
      setIsShutterActive(false);
    }, 360);
  };

  // GSAP entrance animation on scroll
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          end: "bottom 25%",
          toggleActions: "play none none reverse"
        }
      });

      tl.fromTo(
        centerPortalRef.current,
        { scale: 0.7, opacity: 0, rotate: -40 },
        { scale: 1, opacity: 1, rotate: 0, duration: 1.3, ease: "power3.out" }
      )
      .fromTo(
        ".surrounding-satellite-node",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.9, stagger: 0.1, ease: "back.out(1.4)" },
        "-=0.8"
      )
      .fromTo(
        detailsRef.current,
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.5"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const activeMoment = galleryMoments[activeIndex];

  return (
    <section className="cinematic-reveal-container" ref={containerRef}>
      
      {/* Background Cinematic Atmosphere */}
      <div className="cinematic-ambient-radial" />
      <div className="cinematic-film-noise" />
      <div className="cinematic-grid-vignette" />

      {/* Top Header Badge */}
      <div className="reveal-header text-center">
        <div className="reveal-badge-pill">
          <Aperture className="w-3.5 h-3.5 text-gold animate-spin-slow" />
          <span>360° CINEMATIC ORBIT</span>
        </div>
        <h2 className="reveal-main-heading">
          Constellation of <span>Timeless Moments</span>
        </h2>
        <p className="reveal-sub-heading">
          Click any surrounding frame or let the lens orbit automatically through our archive.
        </p>
      </div>

      {/* MAIN ORBITAL STAGE */}
      <div 
        className="cinematic-stage-wrap" 
        ref={orbitalStageRef}
        onMouseEnter={() => setIsOrbitPaused(true)}
        onMouseLeave={() => setIsOrbitPaused(false)}
      >
        
        {/* Ambient Ring Glow */}
        <div className="orbital-glowing-backdrop" />

        {/* Orbit Track Rings */}
        <div className="orbit-track-ring outer-ring" />
        <div className="orbit-track-ring middle-ring" />
        <div className="orbit-track-ring inner-ring" />

        {/* CONTINUOUSLY ROTATING SURROUNDING SATELLITE CAROUSEL */}
        <div className={`orbiting-constellation-plane ${isOrbitPaused ? 'orbit-paused' : ''}`}>
          {galleryMoments.map((moment, index) => {
            const isActive = index === activeIndex;
            const angleDeg = index * (360 / galleryMoments.length);

            return (
              <div
                key={moment.id}
                className={`surrounding-satellite-node ${isActive ? 'satellite-active' : ''}`}
                style={{
                  transform: `rotate(${angleDeg}deg) translateY(-210px)`
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  triggerFrameChange(index);
                }}
              >
                {/* Counter-rotate inside each satellite so image remains upright */}
                <div className={`satellite-inner-upright ${isOrbitPaused ? 'orbit-paused' : ''}`}>
                  <div className="satellite-img-card">
                    <img src={moment.thumb} alt={moment.title} className="satellite-img" />
                    
                    {/* Active Halo Beacon */}
                    {isActive && (
                      <div className="satellite-active-beacon">
                        <span className="beacon-ping" />
                        <span className="beacon-core" />
                      </div>
                    )}

                    {/* Quick Tag Label */}
                    <div className="satellite-mini-tag">
                      <span>{moment.tag.split(" ")[0]}</span>
                    </div>
                  </div>

                  {/* Laser Line Connector to Center */}
                  {isActive && <div className="satellite-laser-beam" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* CENTER MASTER APERTURE LENS */}
        <div 
          className="center-master-lens" 
          ref={centerPortalRef}
          onClick={() => triggerFrameChange((activeIndex + 1) % galleryMoments.length)}
          title="Click to advance frame"
        >
          {/* Dial with rotating technical camera calibrations */}
          <div className="lens-tech-dial always-spin-cw">
            <svg viewBox="0 0 360 360" className="lens-svg-track">
              <defs>
                <path
                  id="techDialPath"
                  d="M 180, 180 m -155, 0 a 155,155 0 1,1 310,0 a 155,155 0 1,1 -310,0"
                />
              </defs>
              <circle cx="180" cy="180" r="170" className="lens-svg-dashed" />
              <circle cx="180" cy="180" r="150" className="lens-svg-solid" />
              <text className="lens-svg-text">
                <textPath href="#techDialPath" startOffset="0%">
                  • 24MM • 35MM • 50MM • 85MM • 105MM • F/1.2 • CINEMATIC 4K • RAW • 120FPS • ISO 100 •
                </textPath>
              </text>
            </svg>
          </div>

          {/* Golden Aperture Bezel & Reflection */}
          <div className="center-bezel-ring" />
          <div className="center-curved-reflection" />

          {/* The Hero Image Inside The Center Circle */}
          <div className="center-image-portal">
            <img
              key={activeMoment.id}
              src={activeMoment.url}
              alt={activeMoment.title}
              className="center-active-photo kenburns-motion"
            />

            {/* Shutter Blade Animation */}
            <div className={`aperture-shutter-overlay ${isShutterActive ? 'shutter-active' : ''}`}>
              <div className="shutter-iris iris-top" />
              <div className="shutter-iris iris-bottom" />
              <div className="shutter-strobe" />
            </div>

            {/* In-Lens Technical Badge */}
            <div className="center-lens-floating-pill">
              <Camera className="w-3 h-3 text-gold" />
              <span>{activeMoment.focal}</span>
            </div>
          </div>
        </div>

      </div>

      {/* DYNAMIC CAPTION & CONTROLS */}
      <div className="reveal-meta-panel" ref={detailsRef}>
        
        {/* Pause/Play Button */}
        <div className="orbit-controls-bar">
          <button
            type="button"
            onClick={() => setIsOrbitPaused(!isOrbitPaused)}
            className="orbit-pause-toggle-btn"
          >
            {isOrbitPaused ? (
              <>
                <Play className="w-3.5 h-3.5 text-gold" />
                <span>Resume Orbit Rotation</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 text-gold" />
                <span>Pause Orbit on Hover</span>
              </>
            )}
          </button>
        </div>

        <div className="meta-category-row">
          <span className="meta-category-badge">{activeMoment.tag}</span>
          <span className="meta-index-ticker">
            0{activeIndex + 1} <span className="text-white/30">/</span> 0{galleryMoments.length}
          </span>
        </div>

        <h3 className="meta-story-title">{activeMoment.title}</h3>
        <p className="meta-story-description">{activeMoment.desc}</p>

        {/* Thumbnail Selector Strip */}
        <div className="meta-thumbnails-strip">
          {galleryMoments.map((item, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={item.id}
                onClick={() => triggerFrameChange(idx)}
                className={`thumb-nav-pill ${isSelected ? 'thumb-nav-active' : ''}`}
                title={item.title}
              >
                <img src={item.thumb} alt={item.tag} className="thumb-nav-img" />
                <span className="thumb-nav-index">{idx + 1}</span>
              </button>
            );
          })}
        </div>

      </div>

    </section>
  );
}
