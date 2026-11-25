import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, ArrowDown, Play, Pause, Volume2, VolumeX, 
  Star, MapPin, Sparkles, Film, Maximize2, X 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CinematicReveal from '../components/animations/CinematicReveal';
import CinematicStrip from '../components/animations/CinematicStrip'; 
import EventPlanner from '../components/animations/EventPlanner';

const maskReveal = { hidden: { y: "100%", rotate: 2 }, visible: { y: 0, rotate: 0, transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } } };
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } };
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } } };

const featuredWorks = [
  { number: '01', category: 'WEDDINGS', title: 'Forever Begins', key: 'img1' },
  { number: '02', category: 'CELEBRATIONS', title: 'Beautiful Together', key: 'img2' },
  { number: '03', category: 'CINEMATIC FILMS', title: 'Beyond The Frame', key: 'img3' },
];

// EXPANDED TO 6 TESTIMONIALS FOR DESKTOP GROUPING
const testimonials = [
  { name: 'Ananya & Rahul', rating: 5, key: 'testimonial1' },
  { name: 'Sarah & James', rating: 5, key: 'testimonial2' },
  { name: 'Priya & Arjun', rating: 5, key: 'testimonial3' },
  { name: 'Neha & Vikram', rating: 5, key: 'testimonial4' },
  { name: 'Riya & Karan', rating: 5, key: 'testimonial5' },
  { name: 'Simran & Aditya', rating: 5, key: 'testimonial6' },
];

// 10s–15s Short video clips 
const shortReels = [
  {
    id: 'reel-1',
    number: '01',
    title: 'The Royal Wedding Saga',
    category: 'WEDDINGS',
    location: 'Udaivilas, Udaipur',
    duration: '0:10',
    videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
    poster: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 'reel-2',
    number: '02',
    title: 'Golden Sunset Vows',
    category: 'PRE-WEDDING',
    location: 'Pashan Lake, Pune',
    duration: '0:10',
    videoUrl: 'https://assets.codepen.io/6093409/river.mp4',
    poster: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 'reel-3',
    number: '03',
    title: 'Euphoria of the Sangeet',
    category: 'CELEBRATIONS',
    location: 'Grand Hyatt, Mumbai',
    duration: '0:10',
    videoUrl: 'https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4',
    poster: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 'reel-4',
    number: '04',
    title: 'Marigold Showers & Sacred Haldi',
    category: 'RITUALS',
    location: 'Heritage Haveli, Jaipur',
    duration: '0:05',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    poster: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 'reel-5',
    number: '05',
    title: 'Midnight Waltz & First Dance',
    category: 'RECEPTIONS',
    location: 'Taj Falaknuma, Hyderabad',
    duration: '0:10',
    videoUrl: 'https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4',
    poster: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=85'
  }
];

export default function Home() {
  const [content, setContent] = useState({
    heroTitle: 'Every Frame.\nA Timeless Story.',
    heroSub: "We don't just capture moments. We turn emotions, memories and beautiful stories into something that lasts forever.",
    storyTitle: 'Moments pass.\nStories stay forever.',
    storyText: 'At Photo In Motion, we believe every celebration has a story worth telling. Through thoughtful photography and cinematic filmmaking, we preserve the feelings behind every frame.',
    testimonial1: 'They captured the essence of our wedding perfectly.',
    testimonial2: 'The cinematic film they created for us is an absolute masterpiece.',
    testimonial3: 'Professional, unobtrusive, and incredibly talented.',
    testimonial4: 'Every frame was a work of art. We couldn\'t be happier.',
    testimonial5: 'They turned our special day into a cinematic experience.',
    testimonial6: 'The attention to detail was flawless. Highly recommended!',
    img1: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85',
    img2: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85',
    img3: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
    showreelImg: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80'
  });

  // Showreel Player States
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [isCinemaMode, setIsCinemaMode] = useState(false);

  // Testimonial State
  const [isMobile, setIsMobile] = useState(false);
  const [activeTestimonialGroup, setActiveTestimonialGroup] = useState(0); // For Desktop (0, 1, 2...)
  const [activeTestimonialSingle, setActiveTestimonialSingle] = useState(0); // For Mobile (0, 1, 2...)

  const videoRef = useRef(null);
  const modalVideoRef = useRef(null);
  const progressBarRef = useRef(null);

  const activeReel = shortReels[activeReelIndex];

  // Check screen size on load and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    checkMobile(); // Check on mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch backend content
  useEffect(() => {
    fetch('/api/enquiry?action=get_content')
      .then(res => res.json())
      .then(data => {
        if (Object.keys(data).length > 0) {
          setContent(data);
        }
      })
      .catch(() => {});
  }, []);

  // Auto-cycle Testimonials (Different logic for Desktop vs Mobile)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isMobile) {
        setActiveTestimonialSingle((prev) => (prev + 1) % testimonials.length);
      } else {
        // Group testimonials in chunks of 3
        const totalGroups = Math.ceil(testimonials.length / 3);
        setActiveTestimonialGroup((prev) => (prev + 1) % totalGroups);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isMobile]);

  // When video index changes, load and auto-play
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
      video.load();
      video.muted = isMuted;
      setProgress(0);
      setCurrentTime('0:00');

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  }, [activeReelIndex]);

  // Keep muted state synced
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
    if (modalVideoRef.current) modalVideoRef.current.muted = isMuted;
  }, [isMuted]);

  const handleVideoEnded = () => {
    setActiveReelIndex(prev => (prev + 1) % shortReels.length);
  };

  const togglePlay = (e) => {
    if (e) e.stopPropagation();
    const video = isCinemaMode ? modalVideoRef.current : videoRef.current;
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

  const handleTimeUpdate = (e) => {
    const video = e.target;
    if (video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
      const mins = Math.floor(video.currentTime / 60);
      const secs = Math.floor(video.currentTime % 60);
      setCurrentTime(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
    }
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    const bar = progressBarRef.current;
    const video = isCinemaMode ? modalVideoRef.current : videoRef.current;
    if (!bar || !video || !video.duration) return;

    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    video.currentTime = percentage * video.duration;
    setProgress(percentage * 100);
  };

  // Calculate current testimonials to show
  const startIdx = activeTestimonialGroup * 3;
  const currentDesktopTestimonials = testimonials.slice(startIdx, startIdx + 3);
  const currentMobileTestimonial = testimonials[activeTestimonialSingle];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      
      {/* 1. HERO SECTION */}
      <section className="hero" id="home">
        <div className="hero-overlay" />
        <motion.div className="hero-content" initial="hidden" animate="visible" variants={staggerContainer}>
          <div style={{ overflow: 'hidden' }}>
            <motion.p className="eyebrow" variants={maskReveal}>WEDDING · EVENTS · CINEMATIC FILMS</motion.p>
          </div>
          <h1 style={{ whiteSpace: 'pre-line' }}>
            <div style={{ overflow: 'hidden' }}>
              <motion.div variants={maskReveal}>{content.heroTitle}</motion.div>
            </div>
          </h1>
          <motion.p className="hero-description" variants={fadeUp}>
            {content.heroSub}
          </motion.p>
          <motion.div className="hero-actions" variants={fadeUp}>
            <Link to="/portfolio" className="primary-btn">Explore Our Work <ArrowUpRight size={18} /></Link>
            <Link to="/contact" className="secondary-btn" style={{ borderBottom: '1px solid var(--gold)' }}>Book Your Experience</Link>
          </motion.div>
        </motion.div>
        <motion.div className="hero-bottom" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}>
          <span>BASED IN INDIA · AVAILABLE WORLDWIDE</span>
          <a href="#story">SCROLL TO EXPLORE <ArrowDown size={15} /></a>
          <span>EST. WITH PASSION</span>
        </motion.div>
      </section>

      <CinematicStrip />
      <CinematicReveal />

      {/* 2. INTRODUCTION */}
      <motion.section className="intro-section" id="story" style={{ padding: '120px 10%' }} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
        <motion.p className="eyebrow" variants={fadeUp}>MORE THAN JUST PHOTOGRAPHY</motion.p>
        <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(48px, 6vw, 78px)', fontWeight: 400, margin: 0, whiteSpace: 'pre-line' }}>
          <div style={{ overflow: 'hidden' }}><motion.div variants={maskReveal}>{content.storyTitle}</motion.div></div>
        </h2>
        <motion.p variants={fadeUp} style={{ maxWidth: '800px', margin: '40px auto 0', fontSize: '15px', lineHeight: '2', color: 'var(--muted)' }}>
          {content.storyText}
        </motion.p>
      </motion.section>

      {/* 3. FEATURED WORKS */}
      <section className="portfolio-section" style={{ padding: '100px 10%', background: 'var(--bg-light)' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} style={{ textAlign: 'center' }}>
          <motion.p className="eyebrow" variants={fadeUp}>A COLLECTION OF MEMORIES</motion.p>
          <h2>
            <div style={{ overflow: 'hidden' }}><motion.div variants={maskReveal}>Selected</motion.div></div>
            <div style={{ overflow: 'hidden' }}><motion.div variants={maskReveal}><span>Stories</span></motion.div></div>
          </h2>
        </motion.div>

        <motion.div className="portfolio-grid" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}>
          {featuredWorks.map((item) => (
            <motion.article 
              className="portfolio-card" 
              key={item.number} 
              style={{ backgroundImage: `url("${content[item.key]}")` }} 
              variants={fadeUp} 
              whileHover={{ y: -10, scale: 1.02, boxShadow: "0px 20px 40px rgba(0,0,0,0.4)" }} 
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span>{item.number} / {item.category}</span>
              <h3>{item.title}</h3>
              <Link to="/portfolio" className="portfolio-link">Explore Story <ArrowUpRight size={17} /></Link>
            </motion.article>
          ))}
        </motion.div>
        
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <Link to="/portfolio" className="secondary-btn" style={{ borderBottom: '1px solid var(--gold)' }}>
            View All Stories
          </Link>
        </div>
      </section>

      {/* 4. SHOWREEL - Interactive Player with Auto-Advance & Selection Ribbon */}
      <section className="showreel-section" style={{ padding: '100px 7%', background: 'var(--bg, #101010)', textAlign: 'center' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.p className="eyebrow" variants={fadeUp}>THE CINEMATIC EXPERIENCE</motion.p>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(44px, 6vw, 74px)', fontWeight: 400, margin: '0 0 40px 0' }}>
            <div style={{ overflow: 'hidden' }}><motion.div variants={maskReveal}>Watch Our</motion.div></div>
            <div style={{ overflow: 'hidden' }}><motion.div variants={maskReveal}><span>Showreel</span></motion.div></div>
          </h2>

          {/* Main Player Container */}
          <motion.div 
            variants={fadeUp} 
            style={{ 
              maxWidth: '1040px', 
              margin: '0 auto', 
              borderRadius: '20px', 
              overflow: 'hidden', 
              border: '1px solid var(--border, rgba(255,255,255,0.1))',
              background: '#050505',
              boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
              position: 'relative'
            }}
          >
            {/* Video Viewport */}
            <div 
              onClick={togglePlay}
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16/9',
                maxHeight: '520px',
                background: '#000',
                cursor: 'pointer',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <video
                ref={videoRef}
                src={activeReel.videoUrl}
                poster={activeReel.poster || content.showreelImg}
                playsInline
                webkit-playsinline="true"
                muted={isMuted}
                preload="auto"
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Shading Overlays */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)', pointerEvents: 'none' }} />

              {/* Big Center Play Button (hides smoothly when playing) */}
              <div 
                style={{
                  position: 'absolute',
                  zIndex: 10,
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--gold, #c6a46b)',
                  color: '#111',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 30px rgba(198, 164, 107, 0.5)',
                  transition: 'opacity 0.3s ease, transform 0.3s ease',
                  opacity: isPlaying ? 0 : 1,
                  transform: isPlaying ? 'scale(0.8)' : 'scale(1)',
                  pointerEvents: 'none'
                }}
              >
                <Play size={28} fill="#111" style={{ marginLeft: '4px' }} />
              </div>

              {/* Top Meta Tag & Fullscreen toggle */}
              <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                <span style={{ padding: '5px 12px', borderRadius: '6px', background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.12)', fontSize: '11px', letterSpacing: '1.5px', color: 'var(--gold, #c6a46b)', fontWeight: 600, textTransform: 'uppercase' }}>
                  {activeReel.category}
                </span>

                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setIsCinemaMode(true); }}
                  style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  title="Cinema Mode"
                >
                  <Maximize2 size={15} />
                </button>
              </div>

              {/* Bottom Control Bar */}
              <div 
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '16px 20px',
                  zIndex: 10,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)'
                }}
              >
                {/* Seek Bar */}
                <div 
                  ref={progressBarRef}
                  onClick={handleSeek}
                  style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px', cursor: 'pointer', marginBottom: '12px', position: 'relative' }}
                >
                  <div style={{ width: `${progress}%`, height: '100%', background: 'var(--gold, #c6a46b)', borderRadius: '3px', position: 'relative' }}>
                    <div style={{ position: 'absolute', right: '-4px', top: '50%', transform: 'translateY(-50%)', width: '10px', height: '10px', borderRadius: '50%', background: '#fff' }} />
                  </div>
                </div>

                {/* Info and Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', minWidth: 0 }}>
                    <button
                      type="button"
                      onClick={togglePlay}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--gold, #c6a46b)', color: '#111', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                    >
                      {isPlaying ? <Pause size={17} fill="#111" /> : <Play size={17} fill="#111" style={{ marginLeft: '2px' }} />}
                    </button>

                    <button
                      type="button"
                      onClick={toggleMute}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                    >
                      {isMuted ? <VolumeX size={17} color="#aaa" /> : <Volume2 size={17} color="var(--gold, #c6a46b)" />}
                    </button>

                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {activeReel.title}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--muted, #aaa)', marginTop: '2px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <MapPin size={11} color="var(--gold, #c6a46b)" /> {activeReel.location}
                        </span>
                        <span>•</span>
                        <span>{currentTime} / {activeReel.duration}</span>
                      </div>
                    </div>
                  </div>

                  <span style={{ fontSize: '12px', color: 'var(--muted, #aaa)', fontFamily: 'monospace', flexShrink: 0 }}>
                    {activeReel.number} / 0{shortReels.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Video Playlist Ribbon (Click any card to play it immediately) */}
            <div style={{ padding: '16px 20px', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--gold, #c6a46b)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Film size={14} /> Select Video Story
                </span>
                <span style={{ fontSize: '11px', color: 'var(--muted, #aaa)' }}>
                  Auto-advances on completion
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '6px', scrollbarWidth: 'none' }}>
                {shortReels.map((reel, idx) => {
                  const isCurrent = idx === activeReelIndex;
                  return (
                    <button
                      key={reel.id}
                      type="button"
                      onClick={() => setActiveReelIndex(idx)}
                      style={{
                        flex: '0 0 150px',
                        background: '#141414',
                        border: isCurrent ? '1.5px solid var(--gold, #c6a46b)' : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        padding: 0,
                        textAlign: 'left',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        opacity: isCurrent ? 1 : 0.65
                      }}
                    >
                      <div style={{ position: 'relative', width: '100%', height: '80px', overflow: 'hidden' }}>
                        <img 
                          src={reel.poster} 
                          alt={reel.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
                        <span style={{ position: 'absolute', top: '5px', left: '5px', background: 'rgba(0,0,0,0.7)', padding: '2px 5px', borderRadius: '4px', fontSize: '9px', color: '#fff', fontFamily: 'monospace' }}>
                          {reel.number}
                        </span>
                        <span style={{ position: 'absolute', bottom: '5px', right: '5px', background: 'rgba(0,0,0,0.7)', padding: '2px 5px', borderRadius: '4px', fontSize: '9px', color: 'var(--gold, #c6a46b)', fontFamily: 'monospace' }}>
                          {reel.duration}
                        </span>
                        {isCurrent && (
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--gold, #c6a46b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {isPlaying ? <Pause size={10} fill="#111" /> : <Play size={10} fill="#111" style={{ marginLeft: '1px' }} />}
                            </div>
                          </div>
                        )}
                      </div>
                      <div style={{ padding: '8px' }}>
                        <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: isCurrent ? 'var(--gold, #c6a46b)' : '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {reel.title}
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: '9px', color: 'var(--muted, #aaa)', textTransform: 'uppercase' }}>
                          {reel.category}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Fullscreen Cinema Modal */}
      {isCinemaMode && (
        <div 
          onClick={() => setIsCinemaMode(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{ width: '100%', maxWidth: '1000px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '16px', overflow: 'hidden' }}
          >
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000' }}>
              <video
                ref={modalVideoRef}
                src={activeReel.videoUrl}
                autoPlay
                playsInline
                muted={isMuted}
                controls
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111' }}>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ margin: 0, fontSize: '15px', color: '#fff' }}>{activeReel.title}</h3>
                <span style={{ fontSize: '12px', color: 'var(--gold, #c6a46b)' }}>{activeReel.location} • {activeReel.category}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsCinemaMode(false)}
                style={{ background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <EventPlanner />

      {/* 5. TESTIMONIALS (RESPONSIVE: DESKTOP GROUPS OF 3 / MOBILE SLIDER) */}
      <section className="testimonials-section" style={{ padding: '100px 10%', background: 'var(--bg-light)', textAlign: 'center', borderTop: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.p className="eyebrow" variants={fadeUp}>CLIENT LOVE</motion.p>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(40px, 5vw, 60px)', fontWeight: 400, margin: '0 0 50px 0' }}>
            <div style={{ overflow: 'hidden' }}><motion.div variants={maskReveal}>Words From</motion.div></div>
            <div style={{ overflow: 'hidden' }}><motion.div variants={maskReveal}><span>Our Clients</span></motion.div></div>
          </h2>
        </motion.div>

        {isMobile ? (
          /* MOBILE VIEW: SLIDER (1 at a time) */
          <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto', minHeight: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTestimonialSingle}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ 
                  background: 'rgba(255,255,255,0.02)', 
                  padding: '40px', 
                  borderRadius: '16px', 
                  border: '1px solid var(--border)', 
                  textAlign: 'center',
                  width: '100%',
                  position: 'absolute'
                }}
              >
                <div style={{ display: 'flex', gap: '5px', color: 'var(--gold)', justifyContent: 'center', marginBottom: '20px' }}>
                  {[...Array(currentMobileTestimonial.rating)].map((_, i) => <Star key={i} size={18} fill="var(--gold)" />)}
                </div>
                <p style={{ color: 'var(--text)', fontSize: '15px', lineHeight: '1.8', fontStyle: 'italic', marginBottom: '25px' }}>
                  "{content[currentMobileTestimonial.key]}"
                </p>
                <h4 style={{ fontFamily: 'var(--heading-font)', fontSize: '22px', color: 'var(--white)', margin: 0 }}>
                  {currentMobileTestimonial.name}
                </h4>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          /* DESKTOP VIEW: GRID OF 3 (Changes every 4s) */
          <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', minHeight: '300px' }}>
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTestimonialGroup}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', position: 'absolute', width: '100%' }}
              >
                {currentDesktopTestimonials.map((test) => (
                  <div key={test.name} style={{ background: 'rgba(255,255,255,0.02)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'left' }}>
                    <div style={{ display: 'flex', gap: '5px', color: 'var(--gold)', marginBottom: '20px' }}>
                      {[...Array(test.rating)].map((_, i) => <Star key={i} size={16} fill="var(--gold)" />)}
                    </div>
                    <p style={{ color: 'var(--text)', fontSize: '14px', lineHeight: '1.8', fontStyle: 'italic', marginBottom: '20px' }}>
                      "{content[test.key]}"
                    </p>
                    <h4 style={{ fontFamily: 'var(--heading-font)', fontSize: '20px', color: 'var(--white)', margin: 0 }}>{test.name}</h4>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
        
        {/* Navigation Dots (Optional, for visual feedback) */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px', zIndex: 10, position: 'relative' }}>
          {(isMobile ? testimonials : Array.from({ length: Math.ceil(testimonials.length / 3) })).map((_, index) => (
            <button
              key={index}
              onClick={() => isMobile ? setActiveTestimonialSingle(index) : setActiveTestimonialGroup(index)}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: (isMobile ? activeTestimonialSingle : activeTestimonialGroup) === index ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s',
                padding: 0
              }}
            />
          ))}
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <motion.section className="contact-section" style={{ padding: '120px 10%', background: 'var(--bg)', textAlign: 'center' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
        <motion.p className="eyebrow" variants={fadeUp}>LET'S CREATE SOMETHING TIMELESS</motion.p>
        <h2>
          <div style={{ overflow: 'hidden' }}><motion.div variants={maskReveal}>Your story deserves</motion.div></div>
          <div style={{ overflow: 'hidden' }}><motion.div variants={maskReveal}>to be <span>remembered.</span></motion.div></div>
        </h2>
        <motion.p className="contact-description" variants={fadeUp}>
          Have a celebration coming up? Let's talk about how we can turn your moments into lasting memories.
        </motion.p>
        <motion.div variants={fadeUp}>
          <Link to="/contact" className="primary-btn" style={{ marginTop: '38px', display: 'inline-flex' }}>
            Start A Conversation <ArrowUpRight size={18} />
          </Link>
        </motion.div>
      </motion.section>

    </motion.div>
  );
}