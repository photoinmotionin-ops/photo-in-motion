import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Film } from 'lucide-react';

const rowTopWorks = [
  {
    id: 't1',
    title: 'Forever Begins',
    category: 'WEDDINGS',
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 't2',
    title: 'Golden Sunset Vows',
    category: 'PRE-WEDDING',
    img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 't3',
    title: 'The Royal Baraat',
    category: 'CELEBRATIONS',
    img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 't4',
    title: 'Aura of Serenity',
    category: 'PORTRAITURE',
    img: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 't5',
    title: 'Moments in Harmony',
    category: 'CINEMATIC',
    img: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=85'
  }
];

const rowBottomWorks = [
  {
    id: 'b1',
    title: 'Marigold Showers',
    category: 'HALDI RITUALS',
    img: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 'b2',
    title: 'Starlit First Dance',
    category: 'RECEPTIONS',
    img: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 'b3',
    title: 'Whispers of Eternity',
    category: 'DESTINATION',
    img: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 'b4',
    title: 'The Sacred Knot',
    category: 'RITUALS',
    img: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 'b5',
    title: 'Chasing the Horizon',
    category: 'PRE-WEDDING',
    img: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=900&q=85'
  }
];

export default function CinematicStrip() {
  const containerRef = useRef(null);

  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const xRow1 = useTransform(scrollYProgress, [0, 1], ["0%", "-28%"]);
  const xRow2 = useTransform(scrollYProgress, [0, 1], ["-28%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);

  return (
    <section 
      ref={containerRef}
      className="cinematic-film-showcase-root"
      style={{
        position: 'relative',
        width: '100%',
        padding: '90px 0 100px',
        background: '#050505',
        overflow: 'hidden',
        borderTop: '1px solid rgba(198, 164, 107, 0.15)',
        borderBottom: '1px solid rgba(198, 164, 107, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Background Ambient Glow */}
      <div 
        style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '750px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(198, 164, 107, 0.12) 0%, rgba(198, 164, 107, 0) 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Title Badge */}
      <div style={{ textAlign: 'center', marginBottom: '45px', position: 'relative', zIndex: 10, padding: '0 20px' }}>
        <div 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 16px',
            borderRadius: '9999px',
            background: 'rgba(198, 164, 107, 0.08)',
            border: '1px solid rgba(198, 164, 107, 0.25)',
            color: 'var(--gold, #c6a46b)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            marginBottom: '10px'
          }}
        >
          <Film size={13} color="var(--gold, #c6a46b)" />
          <span>CINEMATIC ARCHIVE</span>
        </div>

        <h3 
          style={{
            fontFamily: 'var(--heading-font, "Cinzel", serif)',
            fontSize: 'clamp(28px, 4vw, 44px)',
            color: 'var(--white, #fff)',
            margin: '0 0 8px 0',
            fontWeight: 400,
            letterSpacing: '0.5px'
          }}
        >
          Every Frame Tells A Story
        </h3>
        
        <p style={{ color: 'var(--muted, #888)', fontSize: '13.5px', margin: 0, letterSpacing: '0.5px' }}>
          Unfolding moments preserved in timeless motion.
        </p>
      </div>

      {/* DUAL-TRACK PARALLAX FILM REEL */}
      <motion.div 
        style={{ opacity, width: '100%', position: 'relative', zIndex: 5 }}
        className="film-tracks-wrapper"
      >
        {/* ROW 1: Gliding Left */}
        <div style={{ position: 'relative', width: '100%', overflow: 'hidden', padding: '12px 0' }}>
          <div className="film-sprocket-row">
            {[...Array(40)].map((_, i) => (
              <div key={i} className="sprocket-cell">
                <span className="sprocket-hole" />
                <span className="sprocket-code">35MM · KODAK 500T</span>
              </div>
            ))}
          </div>

          <motion.div style={{ x: xRow1 }} className="film-ribbon-row">
            {rowTopWorks.concat(rowTopWorks).map((work, idx) => (
              <div key={`top-${work.id}-${idx}`} className="film-cell-card group">
                <div className="film-cell-inner">
                  <img src={work.img} alt={work.title} className="film-cell-img" loading="lazy" />
                  <div className="film-cell-overlay">
                    <span className="film-cell-cat">{work.category}</span>
                    <h5 className="film-cell-title">{work.title}</h5>
                  </div>
                  <div className="film-frame-number">#{String((idx % rowTopWorks.length) + 1).padStart(2, '0')}</div>
                </div>
              </div>
            ))}
          </motion.div>

          <div className="film-sprocket-row">
            {[...Array(40)].map((_, i) => (
              <div key={i} className="sprocket-cell">
                <span className="sprocket-hole" />
                <span className="sprocket-code">SAFETY FILM</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: '24px' }} />

        {/* ROW 2: Gliding Right */}
        <div style={{ position: 'relative', width: '100%', overflow: 'hidden', padding: '12px 0' }}>
          <div className="film-sprocket-row">
            {[...Array(40)].map((_, i) => (
              <div key={i} className="sprocket-cell">
                <span className="sprocket-hole" />
                <span className="sprocket-code">4K DCI · 24FPS</span>
              </div>
            ))}
          </div>

          <motion.div style={{ x: xRow2 }} className="film-ribbon-row">
            {rowBottomWorks.concat(rowBottomWorks).map((work, idx) => (
              <div key={`bot-${work.id}-${idx}`} className="film-cell-card group">
                <div className="film-cell-inner">
                  <img src={work.img} alt={work.title} className="film-cell-img" loading="lazy" />
                  <div className="film-cell-overlay">
                    <span className="film-cell-cat">{work.category}</span>
                    <h5 className="film-cell-title">{work.title}</h5>
                  </div>
                  <div className="film-frame-number">#{String((idx % rowBottomWorks.length) + 6).padStart(2, '0')}</div>
                </div>
              </div>
            ))}
          </motion.div>

          <div className="film-sprocket-row">
            {[...Array(40)].map((_, i) => (
              <div key={i} className="sprocket-cell">
                <span className="sprocket-hole" />
                <span className="sprocket-code">RAW COLOR GRADE</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Light Sweep Flare */}
      <motion.div
        animate={{ x: ['-120%', '220%'] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", repeatDelay: 2 }}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: '35%',
          background: 'linear-gradient(90deg, transparent 0%, rgba(198, 164, 107, 0.12) 50%, rgba(255, 255, 255, 0.18) 55%, transparent 100%)',
          transform: 'skewX(-25deg)',
          pointerEvents: 'none',
          zIndex: 8
        }}
      />

      <style>{`
        .film-sprocket-row {
          width: 100%;
          display: flex;
          gap: 18px;
          overflow: hidden;
          padding: 6px 0;
          opacity: 0.55;
          user-select: none;
          pointer-events: none;
        }
        .sprocket-cell {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .sprocket-hole {
          width: 14px;
          height: 10px;
          border-radius: 2px;
          background: #141414;
          border: 1px solid #2a2a2a;
          display: block;
        }
        .sprocket-code {
          font-family: monospace;
          font-size: 8px;
          letter-spacing: 1.5px;
          color: rgba(198, 164, 107, 0.6);
        }
        .film-ribbon-row {
          display: flex;
          gap: 22px;
          width: max-content;
          padding: 10px 0;
          cursor: grab;
        }
        .film-ribbon-row:active {
          cursor: grabbing;
        }
        .film-cell-card {
          flex-shrink: 0;
          width: 320px;
          height: 210px;
          border-radius: 12px;
          overflow: hidden;
          background: #101010;
          border: 1px solid rgba(198, 164, 107, 0.25);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease, box-shadow 0.4s ease;
          position: relative;
        }
        .film-cell-card:hover {
          transform: scale(1.05) translateY(-4px);
          border-color: rgba(198, 164, 107, 0.8);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.9), 0 0 25px rgba(198, 164, 107, 0.35);
          z-index: 10;
        }
        .film-cell-inner {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
        }
        .film-cell-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s ease;
        }
        .film-cell-card:hover .film-cell-img {
          transform: scale(1.1);
        }
        .film-cell-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(0, 0, 0, 0.85) 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 14px 16px;
          opacity: 0.9;
        }
        .film-cell-cat {
          font-family: monospace;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: var(--gold, #c6a46b);
          text-transform: uppercase;
          margin-bottom: 3px;
        }
        .film-cell-title {
          font-family: var(--heading-font, "Cinzel", serif);
          font-size: 14px;
          font-weight: 400;
          color: #fff;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .film-frame-number {
          position: absolute;
          top: 10px;
          right: 12px;
          font-family: monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          color: rgba(255, 255, 255, 0.6);
          background: rgba(0, 0, 0, 0.65);
          padding: 2px 7px;
          border-radius: 4px;
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        @media (max-width: 768px) {
          .film-cell-card {
            width: 240px;
            height: 160px;
          }
          .film-ribbon-row {
            gap: 14px;
          }
        }
      `}</style>
    </section>
  );
}
