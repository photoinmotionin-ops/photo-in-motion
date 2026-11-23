import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  X, 
  Layers, 
  ChevronLeft, 
  ChevronRight,
  Clock
} from 'lucide-react';

const showreels = [
  {
    id: 'reel-1',
    number: '01',
    title: 'The Royal Wedding Saga',
    category: 'WEDDINGS',
    location: 'Udaivilas, Udaipur',
    duration: '0:38',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bride-holding-a-bouquet-of-flowers-42999-large.mp4',
    poster: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    synopsis: 'A grand royal union captured in 4K anamorphic richness with intimate emotional cadences.'
  },
  {
    id: 'reel-2',
    number: '02',
    title: 'Golden Sunset Vows',
    category: 'PRE-WEDDING',
    location: 'Pashan Lake, Pune',
    duration: '0:42',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-couple-walking-in-a-field-at-sunset-41001-large.mp4',
    poster: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
    synopsis: 'Golden hour silhouettes, mist over water, and vows etched before the crowd arrives.'
  },
  {
    id: 'reel-3',
    number: '03',
    title: 'Euphoria of the Sangeet',
    category: 'CELEBRATIONS',
    location: 'Grand Hyatt, Mumbai',
    duration: '0:35',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-confetti-falling-on-dancers-in-a-club-40545-large.mp4',
    poster: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85',
    synopsis: 'Explosive lighting, choreographies, and raw dance floor joy immortalized in cinematic 120fps.'
  },
  {
    id: 'reel-4',
    number: '04',
    title: 'Marigold Showers & Sacred Haldi',
    category: 'RITUALS',
    location: 'Heritage Haveli, Jaipur',
    duration: '0:30',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-throwing-yellow-powder-at-a-festival-42523-large.mp4',
    poster: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85',
    synopsis: 'Flying turmeric powder, uninhibited laughter, and sacred blessings from elders.'
  },
  {
    id: 'reel-5',
    number: '05',
    title: 'Midnight Waltz & First Dance',
    category: 'RECEPTIONS',
    location: 'Taj Falaknuma, Hyderabad',
    duration: '0:45',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-couple-dancing-at-a-party-40544-large.mp4',
    poster: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=85',
    synopsis: 'Sparklers illuminate the twilight as the couple takes their inaugural dance as one.'
  }
];

export default function ShowreelPlayer({ fallbackImg }) {
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');

  const mainVideoRef = useRef(null);
  const modalVideoRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const activeReel = showreels[activeReelIndex];

  // Auto-play when active reel changes
  useEffect(() => {
    if (mainVideoRef.current) {
      mainVideoRef.current.currentTime = 0;
      mainVideoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
    setProgress(0);
  }, [activeReelIndex]);

  const handleTimeUpdate = (e) => {
    const video = e.target;
    if (video && video.duration) {
      const p = (video.currentTime / video.duration) * 100;
      setProgress(p);

      const mins = Math.floor(video.currentTime / 60);
      const secs = Math.floor(video.currentTime % 60);
      setCurrentTime(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
    }
  };

  const togglePlay = (e) => {
    if (e) e.stopPropagation();
    if (mainVideoRef.current) {
      if (mainVideoRef.current.paused) {
        mainVideoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.warn("Playback error:", err);
        });
      } else {
        mainVideoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = (e) => {
    if (e) e.stopPropagation();
    if (mainVideoRef.current) {
      mainVideoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const scrollThumbnails = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* ========================================================
          1. ACTIVE SHOWREEL PLAYER WITH RESPONSIVE SCREEN
      ======================================================== */}
      <div 
        onClick={togglePlay}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          minHeight: '260px',
          maxHeight: '560px',
          borderRadius: '16px',
          overflow: 'hidden',
          background: '#050505',
          border: '1px solid var(--border)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          cursor: 'pointer'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeReel.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%', height: '100%', position: 'relative' }}
          >
            {/* HTML5 Video */}
            <video
              ref={mainVideoRef}
              src={activeReel.videoUrl}
              poster={activeReel.poster || fallbackImg}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />

            {/* Gradient Scrim */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.6) 100%)',
                pointerEvents: 'none'
              }}
            />

            {/* Top Bar: Clean Tag & Cinema Button */}
            <div 
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                right: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                zIndex: 10
              }}
            >
              <div 
                style={{
                  background: 'rgba(0,0,0,0.7)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  padding: '5px 10px',
                  borderRadius: '20px',
                  color: 'var(--gold)',
                  fontSize: '10px',
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  maxWidth: '70%',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis'
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff3b30', flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {activeReel.category} · {activeReel.location}
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                style={{
                  background: 'rgba(0,0,0,0.7)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid var(--border)',
                  color: 'var(--white)',
                  padding: '5px 10px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <Maximize2 size={13} />
                <span>Cinema</span>
              </button>
            </div>

            {/* Perfect Center Play/Pause Button */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 15,
                pointerEvents: 'auto'
              }}
            >
              <motion.button
                type="button"
                onClick={togglePlay}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--gold)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#111',
                  boxShadow: '0 0 30px rgba(198, 164, 107, 0.55)',
                  cursor: 'pointer'
                }}
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? (
                  <Pause size={24} fill="#111" />
                ) : (
                  <Play size={24} fill="#111" style={{ marginLeft: '3px' }} />
                )}
              </motion.button>
            </div>

            {/* Bottom Controls Bar */}
            <div 
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '12px 14px',
                zIndex: 10
              }}
            >
              {/* Scrub Progress Line */}
              <div 
                style={{
                  width: '100%',
                  height: '3px',
                  background: 'rgba(255,255,255,0.25)',
                  borderRadius: '2px',
                  marginBottom: '10px',
                  overflow: 'hidden'
                }}
              >
                <div 
                  style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: 'var(--gold)',
                    transition: 'width 0.15s linear'
                  }}
                />
              </div>

              {/* Responsive Bottom Details */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ textAlign: 'left', minWidth: 0, flex: 1 }}>
                  <h3 
                    style={{ 
                      margin: 0, 
                      color: 'var(--white)', 
                      fontSize: 'clamp(14px, 3.5vw, 20px)', 
                      fontFamily: 'var(--heading-font)', 
                      fontWeight: 400,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {activeReel.title}
                  </h3>
                  <p 
                    style={{ 
                      margin: '2px 0 0 0', 
                      color: 'var(--muted)', 
                      fontSize: '11px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {activeReel.synopsis}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={toggleMute}
                    style={{
                      background: 'rgba(0,0,0,0.7)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid var(--border)',
                      color: isMuted ? 'var(--muted)' : 'var(--gold)',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                  >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    <span>{isMuted ? 'MUTE' : 'UNMUTE'}</span>
                  </button>

                  <span style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'monospace' }}>
                    {currentTime}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ========================================================
          2. HORIZONTAL REEL PICKER SCROLLBAR (MOBILE & DESKTOP)
      ======================================================== */}
      <div style={{ marginTop: '20px', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold)', fontSize: '11px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            <Layers size={13} />
            <span>Select Reel ({showreels.length})</span>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              onClick={() => scrollThumbnails('left')}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)',
                color: 'var(--white)',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Scroll left"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              type="button"
              onClick={() => scrollThumbnails('right')}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)',
                color: 'var(--white)',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Scroll right"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

        {/* Swipeable Thumbnails Ribbon */}
        <div
          ref={scrollContainerRef}
          style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '8px',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none'
          }}
        >
          {showreels.map((reel, idx) => {
            const isSelected = idx === activeReelIndex;
            return (
              <motion.div
                key={reel.id}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveReelIndex(idx)}
                style={{
                  flex: '0 0 clamp(200px, 60vw, 250px)',
                  scrollSnapAlign: 'start',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background: isSelected ? 'rgba(198, 164, 107, 0.1)' : 'rgba(255,255,255,0.02)',
                  border: isSelected ? '1px solid var(--gold)' : '1px solid var(--border)',
                  boxShadow: isSelected ? '0 6px 20px rgba(198, 164, 107, 0.25)' : 'none',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                  <img 
                    src={reel.poster} 
                    alt={reel.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }} />
                  
                  {isSelected && (
                    <span 
                      style={{
                        position: 'absolute',
                        top: '6px',
                        left: '6px',
                        background: 'var(--gold)',
                        color: '#111',
                        fontSize: '8px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '8px',
                        letterSpacing: '0.8px',
                        textTransform: 'uppercase'
                      }}
                    >
                      Now Playing
                    </span>
                  )}

                  <span 
                    style={{
                      position: 'absolute',
                      bottom: '6px',
                      right: '6px',
                      background: 'rgba(0,0,0,0.7)',
                      color: 'var(--white)',
                      fontSize: '9px',
                      padding: '2px 5px',
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <Clock size={10} /> {reel.duration}
                  </span>
                </div>

                <div style={{ padding: '10px' }}>
                  <span style={{ fontSize: '9px', color: 'var(--gold)', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                    {reel.number} · {reel.category}
                  </span>
                  <h4 style={{ margin: 0, color: 'var(--white)', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {reel.title}
                  </h4>
                  <p style={{ margin: '3px 0 0 0', color: 'var(--muted)', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {reel.location}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          3. FULLSCREEN POP-UP MODAL (THEATER VIEW)
      ======================================================== */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(0, 0, 0, 0.96)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '16px'
            }}
          >
            <div 
              style={{
                width: '100%',
                maxWidth: '1100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--border)'
              }}
            >
              <div>
                <h3 style={{ margin: 0, color: 'var(--white)', fontFamily: 'var(--heading-font)', fontSize: '18px' }}>
                  {activeReel.title}
                </h3>
                <p style={{ margin: '2px 0 0 0', color: 'var(--gold)', fontSize: '11px' }}>
                  {activeReel.category} · {activeReel.location}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: 'var(--white)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div 
              style={{
                width: '100%',
                maxWidth: '1100px',
                aspectRatio: '16/9',
                maxHeight: '75vh',
                marginTop: '12px',
                borderRadius: '14px',
                overflow: 'hidden',
                background: '#000',
                border: '1px solid var(--border)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.9)'
              }}
            >
              <video
                ref={modalVideoRef}
                src={activeReel.videoUrl}
                poster={activeReel.poster}
                autoPlay
                controls
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
