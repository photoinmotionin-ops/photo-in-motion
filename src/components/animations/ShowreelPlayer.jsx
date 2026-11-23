import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw, 
  Sparkles, Award, MapPin, Eye, Share2, Film, Check, X
} from 'lucide-react';

// 10s–15s lightweight demo videos (Content-Disposition: none, open CORS, byte-range streaming enabled)
const showreels = [
  {
    id: 'reel-1',
    number: '01',
    title: 'The Royal Wedding Saga',
    category: 'WEDDINGS',
    location: 'Udaivilas, Udaipur',
    duration: '0:10',
    videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
    poster: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    synopsis: 'A grand royal union captured in 4K anamorphic richness with intimate emotional cadences.'
  },
  {
    id: 'reel-2',
    number: '02',
    title: 'Golden Sunset Vows',
    category: 'PRE-WEDDING',
    location: 'Pashan Lake, Pune',
    duration: '0:10',
    videoUrl: 'https://assets.codepen.io/6093409/river.mp4',
    poster: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
    synopsis: 'Golden hour silhouettes, mist over water, and vows etched before the crowd arrives.'
  },
  {
    id: 'reel-3',
    number: '03',
    title: 'Euphoria of the Sangeet',
    category: 'CELEBRATIONS',
    location: 'Grand Hyatt, Mumbai',
    duration: '0:10',
    videoUrl: 'https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4',
    poster: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85',
    synopsis: 'Explosive lighting, choreographies, and raw dance floor joy immortalized in cinematic 120fps.'
  },
  {
    id: 'reel-4',
    number: '04',
    title: 'Marigold Showers & Sacred Haldi',
    category: 'RITUALS',
    location: 'Heritage Haveli, Jaipur',
    duration: '0:05',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    poster: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85',
    synopsis: 'Flying turmeric powder, uninhibited laughter, and sacred blessings from elders.'
  },
  {
    id: 'reel-5',
    number: '05',
    title: 'Midnight Waltz & First Dance',
    category: 'RECEPTIONS',
    location: 'Taj Falaknuma, Hyderabad',
    duration: '0:10',
    videoUrl: 'https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4',
    poster: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=85',
    synopsis: 'Sparklers illuminate the twilight as the couple takes their inaugural dance as one.'
  }
];

export default function ShowreelPlayer() {
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [videoDuration, setVideoDuration] = useState('0:00');
  const [isBuffering, setIsBuffering] = useState(false);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const mainVideoRef = useRef(null);
  const modalVideoRef = useRef(null);
  const progressBarRef = useRef(null);

  const activeReel = showreels[activeReelIndex];

  // Video reload when switching reels
  useEffect(() => {
    const video = mainVideoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
      video.load();
      setProgress(0);
      setCurrentTime('0:00');
      video.muted = isMuted;

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  }, [activeReelIndex]);

  // Sync mute state
  useEffect(() => {
    if (mainVideoRef.current) mainVideoRef.current.muted = isMuted;
    if (modalVideoRef.current) modalVideoRef.current.muted = isMuted;
  }, [isMuted]);

  const togglePlay = () => {
    const video = isCinemaMode ? modalVideoRef.current : mainVideoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(prev => !prev);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleTimeUpdate = (e) => {
    const video = e.target;
    if (video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
      setCurrentTime(formatTime(video.currentTime));
      setVideoDuration(formatTime(video.duration));
    }
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    const bar = progressBarRef.current;
    const video = isCinemaMode ? modalVideoRef.current : mainVideoRef.current;
    if (!bar || !video || !video.duration) return;

    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    video.currentTime = percentage * video.duration;
    setProgress(percentage * 100);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <section className="relative bg-[#0d0905] text-white py-12 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#d4af37] blur-[150px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37] text-xs font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            Cinematic Highlights
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold font-serif tracking-tight text-white mb-2">
            The Living Portfolio
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm max-w-xl mx-auto">
            10-15 second short cuts captured in ultra-high fidelity.
          </p>
        </div>

        {/* Video Player Card */}
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-black/60 border border-stone-800 shadow-2xl backdrop-blur-xl">
          
          {/* Main Video Viewport */}
          <div 
            onClick={togglePlay}
            className="relative w-full aspect-video sm:aspect-[21/9] max-h-[550px] bg-black cursor-pointer group flex items-center justify-center overflow-hidden"
          >
            <video
              ref={mainVideoRef}
              src={activeReel.videoUrl}
              poster={activeReel.poster}
              playsInline
              webkit-playsinline="true"
              muted={isMuted}
              loop
              preload="auto"
              onTimeUpdate={handleTimeUpdate}
              onWaiting={() => setIsBuffering(true)}
              onPlaying={() => { setIsBuffering(false); setIsPlaying(true); }}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />

            {/* Buffering Indicator */}
            {isBuffering && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20 pointer-events-none">
                <div className="w-10 h-10 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Center Play Button (Hides when video is actively playing) */}
            <div 
              className={`absolute z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#d4af37]/90 text-stone-950 flex items-center justify-center shadow-lg transition-all duration-300 pointer-events-none ${
                isPlaying ? 'opacity-0 scale-75' : 'opacity-100 scale-100 shadow-[#d4af37]/40'
              }`}
            >
              <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-stone-950 translate-x-0.5" />
            </div>

            {/* Top Bar Badges */}
            <div className="absolute top-3 sm:top-5 left-3 sm:left-5 right-3 sm:right-5 flex items-center justify-between z-10 pointer-events-none">
              <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] sm:text-xs font-mono font-medium text-[#d4af37] uppercase tracking-wider">
                {activeReel.category}
              </span>
              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share showreel"
                  className="p-1.5 sm:p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-stone-300 hover:text-[#d4af37] hover:border-[#d4af37]/50 transition-colors"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setIsCinemaMode(true); }}
                  aria-label="Fullscreen Cinema mode"
                  className="p-1.5 sm:p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-stone-300 hover:text-[#d4af37] hover:border-[#d4af37]/50 transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 z-10 bg-gradient-to-t from-black via-black/60 to-transparent"
            >
              {/* Interactive Progress Bar */}
              <div 
                ref={progressBarRef}
                onClick={handleSeek}
                className="group/bar relative w-full h-1.5 sm:h-2 bg-stone-700/60 hover:h-2.5 rounded-full cursor-pointer mb-3 transition-all duration-150"
              >
                <div 
                  className="h-full bg-[#d4af37] rounded-full relative transition-[width] duration-100"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md scale-0 group-hover/bar:scale-100 transition-transform duration-150" />
                </div>
              </div>

              {/* Controls and Title Metadata Row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    className="p-2 rounded-full bg-[#d4af37] text-stone-950 hover:bg-[#ebd27c] transition-colors flex-shrink-0"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-stone-950" /> : <Play className="w-4 h-4 fill-stone-950 translate-x-0.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                    className="p-2 rounded-full bg-stone-900/80 border border-stone-700/60 text-stone-300 hover:text-white transition-colors flex-shrink-0"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-[#d4af37]" />}
                  </button>

                  <div className="min-w-0">
                    <p className="text-xs sm:text-base font-semibold text-white truncate">
                      {activeReel.title}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs text-stone-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-[#d4af37]" />
                        <span className="truncate max-w-[120px] sm:max-w-none">{activeReel.location}</span>
                      </span>
                      <span>•</span>
                      <span className="font-mono text-stone-400">{currentTime} / {activeReel.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                  <span className="text-[11px] font-mono text-stone-400 tracking-wider">
                    {activeReel.number} / 0{showreels.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Thumbnails Ribbon */}
          <div className="p-3 sm:p-5 bg-stone-950/90 border-t border-stone-800/80">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-semibold tracking-wider uppercase text-stone-400 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-[#d4af37]" />
                Select Short Cut
              </span>
              <span className="text-[11px] text-stone-500 font-mono">
                {activeReelIndex + 1} of {showreels.length}
              </span>
            </div>

            <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
              {showreels.map((reel, index) => {
                const isActive = index === activeReelIndex;
                return (
                  <button
                    key={reel.id}
                    type="button"
                    onClick={() => setActiveReelIndex(index)}
                    className={`relative flex-shrink-0 w-32 sm:w-44 text-left rounded-xl overflow-hidden border transition-all duration-300 group snap-start ${
                      isActive 
                        ? 'border-[#d4af37] ring-1 ring-[#d4af37]/50 shadow-lg shadow-[#d4af37]/10' 
                        : 'border-stone-800 opacity-60 hover:opacity-100 hover:border-stone-700'
                    }`}
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-900">
                      <img 
                        src={reel.poster} 
                        alt={reel.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/70 border border-white/10 text-white">
                        {reel.number}
                      </span>
                      <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/70 text-[#d4af37]">
                        {reel.duration}
                      </span>

                      {isActive && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <div className="w-6 h-6 rounded-full bg-[#d4af37] flex items-center justify-center">
                            {isPlaying ? (
                              <Pause className="w-3 h-3 fill-stone-950 text-stone-950" />
                            ) : (
                              <Play className="w-3 h-3 fill-stone-950 text-stone-950 translate-x-0.5" />
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-2 bg-stone-950">
                      <p className={`text-[11px] font-medium truncate ${isActive ? 'text-[#d4af37]' : 'text-stone-300'}`}>
                        {reel.title}
                      </p>
                      <p className="text-[10px] text-stone-500 truncate">
                        {reel.category}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Cinema Fullscreen Modal */}
      {isCinemaMode && (
        <div 
          onClick={() => setIsCinemaMode(false)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative w-full max-w-5xl rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 shadow-2xl"
          >
            <div className="relative aspect-video w-full bg-black">
              <video
                ref={modalVideoRef}
                src={activeReel.videoUrl}
                autoPlay
                playsInline
                muted={isMuted}
                controls
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="p-4 flex items-center justify-between border-t border-stone-800 bg-stone-950">
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-white">{activeReel.title}</h3>
                <p className="text-xs text-stone-400">{activeReel.location} • {activeReel.category}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCinemaMode(false)}
                className="p-2 rounded-full bg-stone-900 border border-stone-700 text-stone-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
