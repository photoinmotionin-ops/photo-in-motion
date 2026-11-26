import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw, ChevronLeft, ChevronRight, Film, Sparkles, ExternalLink } from 'lucide-react';

/**
 * ShowreelPlayer.jsx
 * Cinematic Living Portfolio Reel Player for "Photo In Motion"
 * 
 * Features:
 * - Dynamic full video playback without hardcoded 10s capping
 * - Automatic real duration calculation & dynamic time tracking
 * - Support for both direct MP4/WebM video files & YouTube embed playback
 * - Smooth transition between showreel scenes
 * - Fullscreen, mute/unmute, scrubbable progress bar, and play/pause controls
 * - Fully configurable via props passed from AdminChange state
 */

export default function ShowreelPlayer({ 
  showreels = [],
  title = "Living Portfolio Reel",
  badge = "Motion Showcase",
  tagline = "Immerse yourself in cinematic love stories captured at 60 frames per second",
  autoPlay = true,
  defaultMuted = true
}) {
  // Fallback showreels if none provided via props
  const defaultReels = [
    {
      id: 1,
      title: 'Royal Mandap & Grand Baraat',
      couple: 'Dev & Avantika',
      location: 'Udaipur Lake Palace',
      duration: '0:45',
      category: 'Grand Wedding',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-having-their-first-dance-41484-large.mp4',
      poster: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1920'
    },
    {
      id: 2,
      title: 'Sunset Beach Pheras',
      couple: 'Kabir & Rhea',
      location: 'Radhanagar, Havelock',
      duration: '0:38',
      category: 'Destination',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-bride-and-groom-during-a-traditional-indian-41589-large.mp4',
      poster: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1920'
    },
    {
      id: 3,
      title: 'Nocturnal Sangeet Symphony',
      couple: 'Aryan & Samaira',
      location: 'Taj Falaknuma Palace',
      duration: '0:52',
      category: 'Sangeet Night',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-groom-putting-the-ring-on-the-brides-finger-41588-large.mp4',
      poster: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1920'
    }
  ];

  const activeReels = Array.isArray(showreels) && showreels.length > 0 ? showreels : defaultReels;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(defaultMuted);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const currentReel = activeReels[currentIndex] || activeReels[0];

  // Helper: Detect if current video URL is a YouTube link
  const getYouTubeId = (url) => {
    if (!url || typeof url !== 'string') return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const ytId = getYouTubeId(currentReel?.videoUrl);

  // Auto-hide controls when playing after 3 seconds of inactivity
  const handleMouseMove = () => {
    setControlsVisible(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    }
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  // Reset video states when switching reels
  useEffect(() => {
    setCurrentTime(0);
    setBuffered(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay policies might require muting
            setIsMuted(true);
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(() => setIsPlaying(false));
            }
          });
        }
      }
    }
  }, [currentIndex]);

  // Video Event Handlers for Native Video Elements
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const realDur = videoRef.current.duration;
      if (!isNaN(realDur) && realDur > 0) {
        setDuration(realDur);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.buffered.length > 0) {
        const end = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
        setBuffered(end);
      }
    }
  };

  const handleVideoEnded = () => {
    // Automatically transition to next reel upon video completion
    if (currentIndex < activeReels.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Loop back to first reel
      setCurrentIndex(0);
    }
  };

  const togglePlay = () => {
    if (ytId) {
      setIsPlaying(!isPlaying);
      return;
    }
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    } else {
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const targetTime = pos * duration;
    if (videoRef.current && !isNaN(targetTime)) {
      videoRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const formatSeconds = (sec) => {
    if (isNaN(sec) || sec <= 0) return '0:00';
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <section className="relative w-full py-24 bg-neutral-950 text-white overflow-hidden">
      {/* Background Ambience Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-yellow-600/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs uppercase tracking-widest font-mono font-medium mb-4">
              <Film className="w-3.5 h-3.5" />
              {badge}
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight">
              {title}
            </h2>
            <p className="mt-3 text-neutral-400 max-w-xl text-sm sm:text-base font-light">
              {tagline}
            </p>
          </div>

          {/* Reel Counter & Fast Navigation Buttons */}
          <div className="mt-6 md:mt-0 flex items-center gap-3">
            <span className="font-mono text-xs text-neutral-400 tracking-wider">
              REEL <span className="text-amber-400 font-bold">{currentIndex + 1}</span> / {activeReels.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : activeReels.length - 1))}
                aria-label="Previous Reel"
                className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-amber-400/50 flex items-center justify-center transition-all text-neutral-300 hover:text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => (prev < activeReels.length - 1 ? prev + 1 : 0))}
                aria-label="Next Reel"
                className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-amber-400/50 flex items-center justify-center transition-all text-neutral-300 hover:text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Cinematic Video Theater */}
        <div 
          ref={playerContainerRef}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
          className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden bg-black border border-white/15 shadow-2xl shadow-black/80 group"
        >
          {/* Direct Video File vs YouTube Video Stream */}
          {ytId ? (
            <div className="w-full h-full relative">
              <iframe
                title={currentReel?.title || "Living Showreel"}
                src={`https://www.youtube.com/embed/${ytId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=1&rel=0&modestbranding=1&loop=1`}
                className="w-full h-full border-0 absolute inset-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="w-full h-full relative" onClick={togglePlay}>
              <video
                ref={videoRef}
                src={currentReel?.videoUrl}
                poster={currentReel?.poster}
                playsInline
                autoPlay={autoPlay}
                muted={isMuted}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
                className="w-full h-full object-cover cursor-pointer"
              />

              {/* Big Center Play/Pause Indicator on Pause */}
              {!isPlaying && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center transition-opacity">
                  <div className="w-20 h-20 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center shadow-2xl transform scale-100 group-hover:scale-110 transition-transform pl-1">
                    <Play className="w-8 h-8 fill-neutral-950" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Top Info Overlay Badge */}
          <div className={`absolute top-6 left-6 right-6 flex items-start justify-between pointer-events-none transition-opacity duration-300 ${controlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-neutral-950/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 shadow-lg">
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 block font-semibold">
                {currentReel?.category || "Cinematic Highlight"}
              </span>
              <h3 className="text-sm sm:text-base font-serif font-medium text-white">
                {currentReel?.title}
              </h3>
              <p className="text-xs text-neutral-400 font-light mt-0.5">
                {currentReel?.couple} • {currentReel?.location}
              </p>
            </div>

            <div className="bg-neutral-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-[11px] font-mono text-neutral-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              4K 60FPS CINEMA
            </div>
          </div>

          {/* Bottom Player Controls (For Native Video) */}
          {!ytId && (
            <div className={`absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${controlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
              {/* Scrubbable Timeline Track */}
              <div 
                onClick={(e) => { e.stopPropagation(); handleSeek(e); }}
                className="w-full h-2 bg-white/20 hover:h-3 rounded-full overflow-hidden cursor-pointer relative transition-all mb-4 group/track"
              >
                {/* Buffered Track */}
                <div 
                  className="absolute top-0 left-0 bottom-0 bg-white/30 transition-all duration-150"
                  style={{ width: `${duration > 0 ? (buffered / duration) * 100 : 0}%` }}
                />
                {/* Current Playhead Progress */}
                <div 
                  className="absolute top-0 left-0 bottom-0 bg-amber-400 transition-all duration-75 relative"
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md opacity-0 group-hover/track:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Bottom Control Buttons & Time Details */}
              <div className="flex items-center justify-between text-white" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-4">
                  <button
                    onClick={togglePlay}
                    aria-label={isPlaying ? "Pause" : "Play"}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-neutral-200 hover:text-white"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 pl-0.5" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    aria-label={isMuted ? "Unmute" : "Mute"}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-neutral-200 hover:text-white"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <span className="font-mono text-xs text-neutral-300 tracking-wider">
                    {formatSeconds(currentTime)} / {duration > 0 ? formatSeconds(duration) : (currentReel?.duration || "0:00")}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.currentTime = 0;
                        setCurrentTime(0);
                      }
                    }}
                    aria-label="Restart Video"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-neutral-200 hover:text-white"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={toggleFullscreen}
                    aria-label="Toggle Fullscreen"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-neutral-200 hover:text-white"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Thumbnail Reel Strip for Seamless Switching */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {activeReels.map((reel, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={reel.id || idx}
                onClick={() => setCurrentIndex(idx)}
                className={`group relative text-left rounded-xl overflow-hidden border transition-all duration-300 p-2 sm:p-2.5 ${
                  isSelected 
                    ? 'bg-amber-500/10 border-amber-400 shadow-lg shadow-amber-500/10' 
                    : 'bg-neutral-900/60 border-white/10 hover:border-white/30'
                }`}
              >
                <div className="relative aspect-video rounded-lg overflow-hidden mb-2 bg-neutral-950">
                  <img
                    src={reel.poster || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600"}
                    alt={reel.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                  <span className="absolute bottom-1 right-1.5 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-mono text-neutral-300">
                    {reel.duration || "Cinema"}
                  </span>
                </div>
                <div className="truncate">
                  <p className={`text-xs font-medium truncate ${isSelected ? 'text-amber-400 font-semibold' : 'text-neutral-200'}`}>
                    {reel.title}
                  </p>
                  <p className="text-[11px] text-neutral-400 truncate font-light">
                    {reel.couple}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
