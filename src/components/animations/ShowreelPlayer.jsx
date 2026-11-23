import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  X, 
  Film, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Sparkles
} from 'lucide-react';

// 8 Curated demo shorts with verified direct CDN URLs and high-res posters
const showreels = [
  {
    id: 'reel-1',
    number: '01',
    title: 'The Royal Wedding Saga',
    category: 'WEDDINGS',
    location: 'Udaivilas, Udaipur',
    duration: '0:38',
    videoUrl: 'https://assets.mixkit.co/videos/42999/42999-720.mp4',
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
    videoUrl: 'https://assets.mixkit.co/videos/41001/41001-720.mp4',
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
    videoUrl: 'https://assets.mixkit.co/videos/40545/40545-720.mp4',
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
    videoUrl: 'https://assets.mixkit.co/videos/42523/42523-720.mp4',
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
    videoUrl: 'https://assets.mixkit.co/videos/40544/40544-720.mp4',
    poster: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=85',
    synopsis: 'Sparklers illuminate the twilight as the couple takes their inaugural dance as one.'
  },
  {
    id: 'reel-6',
    number: '06',
    title: 'Timeless Candid Laughter',
    category: 'CANDIDS',
    location: 'Vagator Beach, Goa',
    duration: '0:28',
    videoUrl: 'https://assets.mixkit.co/videos/42271/42271-720.mp4',
    poster: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85',
    synopsis: 'Unposed, unscripted, and utterly beautiful moments caught in the warm coastal sun.'
  },
  {
    id: 'reel-7',
    number: '07',
    title: 'Royal Heritage Walk',
    category: 'HERITAGE',
    location: 'Mehrangarh Fort, Jodhpur',
    duration: '0:34',
    videoUrl: 'https://assets.mixkit.co/videos/34487/34487-720.mp4',
    poster: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
    synopsis: 'Regal architecture, sweeping crimson veils, and royal palace courtyards.'
  },
  {
    id: 'reel-8',
    number: '08',
    title: 'Twilight Whispers',
    category: 'CINEMATIC',
    location: 'Gulmarg, Kashmir',
    duration: '0:40',
    videoUrl: 'https://assets.mixkit.co/videos/41000/41000-720.mp4',
    poster: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=85',
    synopsis: 'Serene mountain horizons, pine breezes, and heartfelt eternal promises.'
  }
];

export default function ShowreelPlayer({ fallbackImg }) {
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [isHovered, setIsHovered] = useState(false);
  const [showCenterAction, setShowCenterAction] = useState(false);

  const mainVideoRef = useRef(null);
  const modalVideoRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const progressBarRef = useRef(null);
  const actionTimeoutRef = useRef(null);

  const activeReel = showreels[activeReelIndex] || showreels[0];

  const triggerActionFeedback = useCallback(() => {
    setShowCenterAction(true);
    if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
    actionTimeoutRef.current = setTimeout(() => {
      setShowCenterAction(false);
    }, 700);
  }, []);

  const formatTime = (seconds) => {
    if (isNaN(seconds) || !seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    const video = mainVideoRef.current;
    if (video) {
      video.currentTime = 0;
      setProgress(0);
      setCurrentTime('0:00');
      
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
    return () => {
      if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
    };
  }, [activeReelIndex]);

  const handleTimeUpdate = (e) => {
    const video = e.target;
    if (video.duration) {
      const p = (video.currentTime / video.duration) * 100;
      setProgress(p);
      setCurrentTime(formatTime(video.currentTime));
    }
  };

  const togglePlay = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const video = mainVideoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      video.play()
        .then(() => {
          setIsPlaying(true);
          triggerActionFeedback();
        })
        .catch(() => {
          // If unmuted playback was blocked by browser policy, fallback to muted
          if (!video.muted) {
            video.muted = true;
            setIsMuted(true);
            video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          } else {
            setIsPlaying(false);
          }
        });
    } else {
      video.pause();
      setIsPlaying(false);
      triggerActionFeedback();
    }
  };

  const toggleMute = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const video = mainVideoRef.current;
    if (video) {
      const nextMuted = !video.muted;
      video.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  // Interactive scrubber seek
  const handleSeek = (e) => {
    if (!progressBarRef.current || !mainVideoRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    if (mainVideoRef.current.duration) {
      mainVideoRef.current.currentTime = percentage * mainVideoRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  const scrollThumbnails = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div 
      style={{ 
        width: '100%', 
        maxWidth: '1100px', 
        margin: '0 auto',
        padding: '0 8px 32px 8px',
        boxSizing: 'border-box',
        color: '#f5f5f7',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* 1. ACTIVE SHOWREEL PLAYER */}
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          minHeight: '230px',
          maxHeight: '580px',
          borderRadius: '16px',
          overflow: 'hidden',
          background: '#09090b',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(198, 164, 107, 0.1)',
          userSelect: 'none'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeReel.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%', height: '100%', position: 'relative' }}
          >
            <video
              ref={mainVideoRef}
              src={activeReel.videoUrl}
              poster={activeReel.poster || fallbackImg}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              webkit-playsinline="true"
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onClick={togglePlay}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                cursor: 'pointer', 
                display: 'block' 
              }}
            />

            {/* Gradient Scrim */}
            <div 
              onClick={togglePlay}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.65) 100%)',
                cursor: 'pointer',
                zIndex: 2
              }}
            />

            {/* Top Bar */}
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
                zIndex: 10,
                pointerEvents: 'none'
              }}
            >
              <div 
                style={{
                  background: 'rgba(15, 15, 18, 0.75)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '5px 12px',
                  borderRadius: '30px',
                  color: 'var(--gold, #d4af37)',
                  fontSize: 'clamp(9px, 2.5vw, 11px)',
                  fontWeight: 600,
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  maxWidth: '72%',
                  pointerEvents: 'auto',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                }}
              >
                <span 
                  style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    background: '#ff3b30', 
                    flexShrink: 0,
                    boxShadow: '0 0 6px #ff3b30'
                  }} 
                />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                  background: 'rgba(15, 15, 18, 0.75)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  padding: '5px 10px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '11px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  flexShrink: 0,
                  pointerEvents: 'auto'
                }}
              >
                <Maximize2 size={13} />
                <span>Cinema</span>
              </button>
            </div>

            {/* Center Play Button: Only visible when paused or briefly upon user tap */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 15,
                pointerEvents: (!isPlaying || isHovered || showCenterAction) ? 'auto' : 'none',
                opacity: (!isPlaying || isHovered || showCenterAction) ? 1 : 0,
                transition: 'opacity 0.25s ease'
              }}
            >
              <motion.button
                type="button"
                onClick={togglePlay}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: isPlaying 
                    ? 'rgba(20, 20, 24, 0.65)' 
                    : 'linear-gradient(135deg, #e5c378 0%, #c6a46b 100%)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: isPlaying ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255, 255, 255, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isPlaying ? '#ffffff' : '#111111',
                  boxShadow: isPlaying 
                    ? '0 8px 30px rgba(0,0,0,0.5)' 
                    : '0 0 35px rgba(212, 175, 55, 0.6), 0 8px 25px rgba(0,0,0,0.5)',
                  cursor: 'pointer'
                }}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? (
                  <Pause size={24} fill="#ffffff" />
                ) : (
                  <Play size={24} fill="#111111" style={{ marginLeft: '3px' }} />
                )}
              </motion.button>
            </div>

            {/* Bottom Controls */}
            <div 
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '12px 14px 10px 14px',
                zIndex: 10,
                background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)'
              }}
            >
              {/* Interactive Scrubber */}
              <div 
                ref={progressBarRef}
                onClick={handleSeek}
                style={{
                  width: '100%',
                  height: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginBottom: '8px'
                }}
              >
                <div 
                  style={{
                    width: '100%',
                    height: '4px',
                    background: 'rgba(255,255,255,0.22)',
                    borderRadius: '3px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div 
                    style={{
                      width: `${progress}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #d4af37, #f3e5ab)',
                      borderRadius: '3px',
                      transition: 'width 0.1s linear'
                    }}
                  />
                </div>
              </div>

              {/* Title & Compact Controls */}
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-end', 
                  justifyContent: 'space-between', 
                  gap: '12px' 
                }}
              >
                <div style={{ textAlign: 'left', minWidth: 0, flex: 1 }}>
                  <h3 
                    style={{ 
                      margin: 0, 
                      color: 'var(--white, #ffffff)', 
                      fontSize: 'clamp(14px, 3.8vw, 20px)', 
                      fontFamily: 'var(--heading-font, Georgia, serif)', 
                      fontWeight: 600,
                      lineHeight: 1.25,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {activeReel.title}
                  </h3>
                  <p 
                    style={{ 
                      margin: '3px 0 0 0', 
                      color: 'var(--muted, #a1a1aa)', 
                      fontSize: 'clamp(10px, 2.6vw, 12px)',
                      lineHeight: 1.3,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {activeReel.synopsis}
                  </p>
                </div>

                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    flexShrink: 0 
                  }}
                >
                  <button
                    type="button"
                    onClick={toggleMute}
                    style={{
                      background: isMuted ? 'rgba(255,255,255,0.1)' : 'rgba(212, 175, 55, 0.25)',
                      border: isMuted ? '1px solid rgba(255,255,255,0.15)' : '1px solid var(--gold, #d4af37)',
                      color: isMuted ? 'var(--muted, #d1d5db)' : 'var(--gold, #d4af37)',
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  </button>

                  <span 
                    style={{ 
                      fontSize: '11px', 
                      color: 'var(--muted, #a1a1aa)', 
                      fontFamily: 'monospace',
                      minWidth: '32px',
                      textAlign: 'right'
                    }}
                  >
                    {currentTime}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. HORIZONTAL THUMBNAIL RIBBON */}
      <div style={{ marginTop: '22px', textAlign: 'left' }}>
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: '12px',
            padding: '0 2px'
          }}
        >
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              color: 'var(--gold, #d4af37)', 
              fontSize: '11px', 
              fontWeight: 600,
              letterSpacing: '0.8px', 
              textTransform: 'uppercase' 
            }}
          >
            <Film size={14} />
            <span>Select Demo Short ({showreels.length})</span>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              onClick={() => scrollThumbnails('left')}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#ffffff',
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
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#ffffff',
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

        <div
          ref={scrollContainerRef}
          style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '20px',
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
                  flex: '0 0 clamp(160px, 48vw, 220px)',
                  scrollSnapAlign: 'start',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background: isSelected 
                    ? 'rgba(198, 164, 107, 0.12)' 
                    : 'rgba(24, 24, 27, 0.65)',
                  border: isSelected 
                    ? '1.5px solid var(--gold, #d4af37)' 
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: isSelected 
                    ? '0 6px 20px rgba(198, 164, 107, 0.35)' 
                    : 'none',
                  transition: 'border 0.2s, box-shadow 0.2s',
                  position: 'relative'
                }}
              >
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                  <img 
                    src={reel.poster} 
                    alt={reel.title} 
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                  />
                  <div 
                    style={{ 
                      position: 'absolute', 
                      inset: 0, 
                      background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)' 
                    }} 
                  />
                  
                  {isSelected && (
                    <span 
                      style={{
                        position: 'absolute',
                        top: '6px',
                        left: '6px',
                        background: 'var(--gold, #d4af37)',
                        color: '#111111',
                        fontSize: '8px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '6px',
                        letterSpacing: '0.6px',
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      <Sparkles size={8} /> Now Playing
                    </span>
                  )}

                  <span 
                    style={{
                      position: 'absolute',
                      bottom: '5px',
                      right: '6px',
                      background: 'rgba(0,0,0,0.75)',
                      backdropFilter: 'blur(4px)',
                      color: '#ffffff',
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

                <div style={{ padding: '8px 10px 10px 10px' }}>
                  <span 
                    style={{ 
                      fontSize: '9px', 
                      color: isSelected ? 'var(--gold, #d4af37)' : 'var(--muted, #9ca3af)', 
                      letterSpacing: '0.6px', 
                      textTransform: 'uppercase', 
                      fontWeight: 600,
                      display: 'block', 
                      marginBottom: '2px' 
                    }}
                  >
                    {reel.number} · {reel.category}
                  </span>
                  <h4 
                    style={{ 
                      margin: 0, 
                      color: '#ffffff', 
                      fontSize: '12px', 
                      fontWeight: 600,
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis' 
                    }}
                  >
                    {reel.title}
                  </h4>
                  <p 
                    style={{ 
                      margin: '2px 0 0 0', 
                      color: 'var(--muted, #a1a1aa)', 
                      fontSize: '10px', 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis' 
                    }}
                  >
                    {reel.location}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 3. FULLSCREEN CINEMA MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              background: 'rgba(0, 0, 0, 0.97)',
              backdropFilter: 'blur(25px)',
              WebkitBackdropFilter: 'blur(25px)',
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
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div>
                <h3 
                  style={{ 
                    margin: 0, 
                    color: '#ffffff', 
                    fontFamily: 'var(--heading-font, Georgia, serif)', 
                    fontSize: 'clamp(15px, 4vw, 20px)' 
                  }}
                >
                  {activeReel.title}
                </h3>
                <p style={{ margin: '2px 0 0 0', color: 'var(--gold, #d4af37)', fontSize: '11px' }}>
                  {activeReel.category} · {activeReel.location}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#ffffff',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                aria-label="Close modal"
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
                marginTop: '14px',
                borderRadius: '14px',
                overflow: 'hidden',
                background: '#000000',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.95)'
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
