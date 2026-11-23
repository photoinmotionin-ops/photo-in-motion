import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  Film, 
  Video, 
  Camera, 
  PhoneCall, 
  Sparkles, 
  Calendar, 
  Radio, 
  Sliders, 
  Maximize2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Event shoot categories handled by the shoot director
const eventShootRoll = [
  {
    id: 1,
    roll: "ROLL #01 · 50MM",
    type: "ROYAL WEDDINGS",
    title: "Vows in Golden Sunlight",
    specs: "4K RAW · RED Komodo 6K · 24fps",
    badge: "Full Day Ceremony",
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85",
    tagline: "Drone aerials + 3-Camera Cinema Crew"
  },
  {
    id: 2,
    roll: "ROLL #02 · 85MM",
    type: "PRE-WEDDING CINEMA",
    title: "Misty Sunrise by the Lake",
    specs: "Sony FX3 · 85mm f/1.4 · S-Cinetone",
    badge: "Destination Shoot",
    img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=85",
    tagline: "Slow-motion poetry & intimate portraits"
  },
  {
    id: 3,
    roll: "ROLL #03 · 24MM",
    type: "SANGEET & LIVE STAGE",
    title: "Electric Beats & Fireworks",
    specs: "120 FPS High-Speed · Gimbal Steadicam",
    badge: "Night Event Rig",
    img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=85",
    tagline: "Dynamic stage lighting & crowd euphoria"
  },
  {
    id: 4,
    roll: "ROLL #04 · 35MM",
    type: "EMOTIONAL HALDI",
    title: "Showers of Marigold & Joy",
    specs: "Natural Light · 1/500s Freeze Motion",
    badge: "Candid Emotion",
    img: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=85",
    tagline: "Unstaged tears and laughter"
  },
  {
    id: 5,
    roll: "ROLL #05 · 105MM",
    type: "LUXURY RECEPTION",
    title: "Starlit Gala & First Dance",
    specs: "Dual Operator · 32-bit Float Audio",
    badge: "Black-Tie Evening",
    img: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=900&q=85",
    tagline: "Cinematic mood lighting & grand entrances"
  },
  {
    id: 6,
    roll: "ROLL #06 · 50MM",
    type: "CELEBRITY & EVENTS",
    title: "Fashion & Gala Red Carpet",
    specs: "Continuous Studio Lighting · 8K Stills",
    badge: "Editorial Master",
    img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=85",
    tagline: "Sharp editorial grade & crisp delivery"
  }
];

export default function CinematicStrip() {
  const containerRef = useRef(null);
  const [selectedFrame, setSelectedFrame] = useState(eventShootRoll[0]);
  const [timecode, setTimecode] = useState("01:24:18:09");

  // Scroll parallax animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });
  const xLeft = useTransform(smoothProgress, [0, 1], ["0%", "-35%"]);

  // Live Director Timecode Generator
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const ms = String(Math.floor(now.getMilliseconds() / 30)).padStart(2, '0');
      setTimecode(`${h}:${m}:${s}:${ms}`);
    }, 45);
    return () => clearInterval(timer);
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full py-24 bg-[#060606] text-white overflow-hidden border-y border-[#c6a46b]/20"
      style={{ fontFamily: 'var(--body-font, sans-serif)' }}
    >
      {/* Ambient Film Light Leaks in Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#c6a46b]/10 via-[#c6a46b]/5 to-transparent blur-[120px] pointer-events-none" />

      {/* 1. DIRECTOR'S LIVE SHOOT HUD (HEADER STATUS BAR) */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0f0e0d]/90 border border-[#c6a46b]/30 backdrop-blur-md shadow-2xl">
          
          {/* Left: Live Recording Status */}
          <div className="flex items-center gap-3">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600" />
            </span>
            <span className="font-mono text-xs font-bold tracking-widest text-red-500 uppercase">
              LIVE SHOOT PRODUCTION
            </span>
            <span className="hidden sm:inline-block text-[#c6a46b]/40 font-mono text-xs">|</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-neutral-300 font-mono">
              <Radio className="w-3.5 h-3.5 text-[#c6a46b]" />
              <span>ON-LOCATION CINEMA CREW</span>
            </span>
          </div>

          {/* Center: Camera Timecode Clock */}
          <div className="font-mono text-xs text-[#c6a46b] bg-black/60 px-3 py-1.5 rounded-md border border-[#c6a46b]/30 tracking-widest">
            TC <span className="text-white font-bold">{timecode}</span> · 24.000 FPS
          </div>

          {/* Right: Quick Call to Book Shoot */}
          <div className="flex items-center gap-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#c6a46b] to-[#b38600] text-black text-xs font-bold hover:brightness-110 transition-transform active:scale-95 shadow-lg shadow-[#c6a46b]/20"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Book Event Shoot</span>
            </Link>
          </div>
        </div>

        {/* Section Heading */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#c6a46b]/10 border border-[#c6a46b]/25 text-[#c6a46b] text-xs font-semibold uppercase tracking-widest mb-3">
            <Film className="w-3.5 h-3.5" />
            <span>35MM CINEMATIC FILM ROLL</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-normal text-[#f4efe6]" style={{ fontFamily: 'var(--heading-font, "Cinzel", serif)' }}>
            Every Celebration, <span className="italic text-[#c6a46b]">Filmed Like Cinema</span>
          </h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-400 mt-3">
            From pre-wedding sunrises to royal sangeet nights. We carry cinema-grade cameras, drone rigs, and master prime lenses right to your venue.
          </p>
        </div>
      </div>

      {/* 2. HORIZONTAL 35MM CONTINUOUS FILM STRIP WITH SPROCKETS */}
      <div className="relative w-full overflow-hidden my-6">
        
        {/* Top Kodak 35mm Sprocket Strip */}
        <div className="w-full flex justify-between px-4 py-2 bg-[#0a0a0a] border-y border-[#c6a46b]/25">
          <div className="flex gap-4 overflow-hidden w-full opacity-60">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="flex items-center gap-2 shrink-0">
                <span className="w-4 h-2.5 rounded-sm bg-neutral-800 border border-neutral-700 block" />
                <span className="text-[9px] font-mono text-[#c6a46b]/60">KODAK 5219 · {i * 4 + 10}</span>
              </div>
            ))}
          </div>
        </div>

        {/* The Moving Ribbon of Shoot Cards */}
        <motion.div 
          style={{ x: xLeft }}
          className="flex gap-6 py-6 px-8 cursor-grab active:cursor-grabbing w-max"
        >
          {eventShootRoll.concat(eventShootRoll).map((frame, index) => {
            const isSelected = selectedFrame.id === frame.id;

            return (
              <div
                key={`${frame.id}-${index}`}
                onClick={() => setSelectedFrame(frame)}
                className={`relative group shrink-0 w-[290px] sm:w-[360px] rounded-2xl overflow-hidden bg-[#111] border transition-all duration-500 ${
                  isSelected 
                    ? 'border-[#c6a46b] shadow-[0_0_35px_rgba(198,164,107,0.35)] scale-[1.02]' 
                    : 'border-white/10 hover:border-[#c6a46b]/60 hover:scale-[1.01]'
                }`}
              >
                {/* Photo with Zoom on Hover */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img 
                    src={frame.img} 
                    alt={frame.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider bg-black/80 backdrop-blur-md text-[#c6a46b] border border-[#c6a46b]/30">
                    {frame.type}
                  </span>

                  {/* Production Gear Badge */}
                  <span className="absolute bottom-3 right-3 text-[10px] font-mono text-neutral-300 bg-black/70 px-2 py-0.5 rounded border border-white/10">
                    {frame.specs.split('·')[0]}
                  </span>
                </div>

                {/* Shoot Details Info */}
                <div className="p-4 bg-[#0d0c0b]">
                  <div className="flex items-center justify-between text-xs text-[#c6a46b] font-mono mb-1">
                    <span>{frame.roll}</span>
                    <span className="text-white/40">{frame.badge}</span>
                  </div>
                  <h4 className="text-base font-semibold text-white group-hover:text-[#c6a46b] transition-colors truncate">
                    {frame.title}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-1">
                    {frame.tagline}
                  </p>
                </div>

                {/* Interactive Click Indicator */}
                <div className="px-4 py-2 bg-black/80 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400">
                  <span className="flex items-center gap-1.5 text-[#c6a46b]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Click to inspect setup</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Bottom Kodak 35mm Sprocket Strip */}
        <div className="w-full flex justify-between px-4 py-2 bg-[#0a0a0a] border-y border-[#c6a46b]/25">
          <div className="flex gap-4 overflow-hidden w-full opacity-60">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="flex items-center gap-2 shrink-0">
                <span className="w-4 h-2.5 rounded-sm bg-neutral-800 border border-neutral-700 block" />
                <span className="text-[9px] font-mono text-neutral-400">SAFETY FILM · 4K DCI</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. SELECTED SHOOT MONITOR & CALL DISPATCH MODAL */}
      <div className="max-w-5xl mx-auto px-6 mt-12">
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#141310] via-[#0c0b0a] to-black border border-[#c6a46b]/30 shadow-2xl relative overflow-hidden">
          
          <div className="absolute inset-0 bg-[radial-gradient(#c6a46b_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left: Selected Frame Monitor Viewport */}
            <div className="md:col-span-6 relative rounded-2xl overflow-hidden border border-[#c6a46b]/40 shadow-2xl group">
              <img 
                src={selectedFrame.img} 
                alt={selectedFrame.title} 
                className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Director Viewfinder Overlays */}
              <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/60">
                <div className="flex justify-between items-center text-xs font-mono text-amber-300">
                  <span className="bg-red-600/90 text-white font-bold px-2 py-0.5 rounded text-[10px]">
                    ● REC
                  </span>
                  <span>{selectedFrame.specs}</span>
                </div>
                
                {/* Center Framing Reticle */}
                <div className="self-center w-12 h-12 border border-white/40 border-dashed rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#c6a46b] rounded-full" />
                </div>

                <div className="flex justify-between items-end text-xs font-mono text-white/80">
                  <div>
                    <span className="text-[#c6a46b] font-bold block">{selectedFrame.type}</span>
                    <span>SHUTTER: 1/50 · ISO 400</span>
                  </div>
                  <span className="text-[10px] bg-black/80 px-2 py-1 rounded border border-white/10">
                    BATTERY: 98%
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Event Shoot Pitch & Direct Booking Buttons */}
            <div className="md:col-span-6 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-xs font-mono text-[#c6a46b] mb-2 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Selected Event Production Package</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-2" style={{ fontFamily: 'var(--heading-font, "Cinzel", serif)' }}>
                {selectedFrame.title}
              </h3>

              <p className="text-sm text-neutral-300 leading-relaxed mb-4">
                We handle the complete visual storytelling for your events. Whether it's a 3-day destination royal wedding, an intimate outdoor ceremony, or an energetic celebration night, our team ensures every tear and cheer is preserved forever.
              </p>

              {/* Equipment & Crew Checklist */}
              <div className="grid grid-cols-2 gap-2 text-xs text-neutral-300 mb-6 bg-black/40 p-3 rounded-xl border border-white/10 font-mono">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c6a46b]" />
                  <span>Dual 4K Cinema Cameras</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c6a46b]" />
                  <span>Licensed Drone 4K Pilot</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c6a46b]" />
                  <span>Fast Same-Week Teaser</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c6a46b]" />
                  <span>Color Graded Master Film</span>
                </div>
              </div>

              {/* Action Buttons for Direct Call / WhatsApp */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/contact"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-[#c6a46b] to-[#b38600] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-[#c6a46b]/20 flex items-center gap-2 transition-transform active:scale-95"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Check Shoot Dates & Rates</span>
                </Link>

                <a
                  href="https://wa.me/?text=Hi%20Photo%20In%20Motion%2C%20I%20would%20like%20to%20inquire%20about%20a%20photoshoot%20and%20videoshoot%20for%20my%20upcoming%20event."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-full bg-white/5 border border-white/20 text-white font-semibold text-xs hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <Video className="w-4 h-4 text-[#c6a46b]" />
                  <span>WhatsApp Inquiries</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}
