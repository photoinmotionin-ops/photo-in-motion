import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Camera, Award, ShieldCheck, MapPin, Sparkles, CheckCircle2, ArrowRight
} from 'lucide-react';

// Built-in YouTube SVG
const YoutubeIcon = ({ size = 20, color = "currentColor" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9 10 15" fill={color} />
  </svg>
);

const maskReveal = { 
  hidden: { y: "100%", rotate: 2 }, 
  visible: { y: 0, rotate: 0, transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } } 
};

const fadeUp = { 
  hidden: { opacity: 0, y: 40 }, 
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } 
};

const staggerContainer = { 
  hidden: { opacity: 0 }, 
  visible: { opacity: 1, transition: { staggerChildren: 0.16, delayChildren: 0.1 } } 
};

// Default Milestones (Icons mapped per index)
const milestoneIcons = [Camera, ShieldCheck, YoutubeIcon, Award];

const defaultMilestones = [
  {
    year: '2005',
    tag: 'THE HUMBLE GENESIS',
    title: 'One Man, One Camera in Kendrapara',
    desc: 'Founded by Munu as a solo visionary in Kendrapara. Driven by an uncompromising passion for raw human emotion and the craft of visual storytelling.'
  },
  {
    year: '2012',
    tag: 'HIGH-PROFILE TRUST',
    title: 'State Dignitaries & VIP Events',
    desc: 'Entrusted with documenting high-security, prestigious events for Members of Legislative Assembly (MLAs) and Deputy Chief Ministers (Deputy CMs).'
  },
  {
    year: '2018',
    tag: 'MEDIA EVOLUTION',
    title: 'Fashion, Shorts & Digital Productions',
    desc: 'Expanded into commercial fashion portfolios, high-engagement short-form cinema, and viral YouTube film productions with modern 4K optics.'
  },
  {
    year: 'Present',
    tag: 'CINEMATIC BENCHMARK',
    title: 'Photo In Motion Studio',
    desc: 'Over two decades of celebrated heritage. A premiere destination across India for luxury wedding films, VIP events, and cinematic portraits.'
  }
];

const defaultStats = [
  { number: '2005', label: 'Est. in Kendrapara', sub: '20+ Years Heritage' },
  { number: 'VIPs', label: 'MLAs & Deputy CMs', sub: 'Trusted at Highest Level' },
  { number: 'Digital', label: 'Models & YouTube', sub: 'Modern Shorts & Viral Media' },
  { number: '1000+', label: 'Stories Captured', sub: 'Timeless Legacies' }
];

const defaultArenas = [
  { title: 'VIP & Dignitary Coverage', desc: 'Extensive hands-on experience filming MLAs, Deputy Chief Ministers, and corporate dignitaries with utmost discretion and cinematic speed.' },
  { title: 'Fashion & Model Portfolios', desc: 'High-end magazine style portraiture, editorial lighting setups, and agency-grade model portfolios crafted to turn heads.' },
  { title: 'Shorts & YouTube Productions', desc: 'Modern vertical short cinema, Reels, and 4K YouTube storytelling tailored with rhythmic pacing and cinematic sound design.' }
];

export default function Story() {
  const [data, setData] = useState({
    storyHeroEyebrow: 'THE LEGACY SINCE 2005',
    storyHeroHeading: 'Moments pass.\nStories stay forever.',
    storyHeroParagraph: 'At Photo In Motion Studio, our story is etched in patience, passion, and two decades of relentless craftsmanship. From our beginnings in Kendrapara to documenting state leaders, fashion icons, and royal weddings, we preserve the heartbeat behind every frame.',
    storyStats: defaultStats,
    storyFounderImg: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
    storyFounderName: 'Munu',
    storyFounderRole: 'Visionary Filmmaker & Founder, Photo In Motion',
    storyFounderOrigin: 'Kendrapara, Odisha · Since 2005',
    storyOriginHeading: "From One Person's Vision to a Cinematic Powerhouse",
    storyOriginP1: "In 2005, in the historic town of Kendrapara, Photo In Motion began with just one person — Munu. With a single camera and an unwavering obsession with natural lighting and unposed emotional depth, every frame was treated as sacred art.",
    storyOriginP2: "What started as local wedding memories quickly evolved into a trusted production brand. As word spread, our lens captured high-profile state leaders — including MLAs and Deputy Chief Ministers — commanding the highest discretion, speed, and cinematic poise.",
    storyMilestones: defaultMilestones,
    storyArenas: defaultArenas
  });

  // Fetch admin saved data
  useEffect(() => {
    fetch('/api/enquiry?action=get_content')
      .then(res => res.json())
      .then(saved => {
        if (saved && Object.keys(saved).length > 0) {
          setData(prev => ({
            ...prev,
            storyHeroEyebrow: saved.storyHeroEyebrow || prev.storyHeroEyebrow,
            storyHeroHeading: saved.storyHeroHeading || prev.storyHeroHeading,
            storyHeroParagraph: saved.storyHeroParagraph || prev.storyHeroParagraph,
            storyStats: saved.storyStats || prev.storyStats,
            storyFounderImg: saved.storyFounderImg || prev.storyFounderImg,
            storyFounderName: saved.storyFounderName || prev.storyFounderName,
            storyFounderRole: saved.storyFounderRole || prev.storyFounderRole,
            storyFounderOrigin: saved.storyFounderOrigin || prev.storyFounderOrigin,
            storyOriginHeading: saved.storyOriginHeading || prev.storyOriginHeading,
            storyOriginP1: saved.storyOriginP1 || prev.storyOriginP1,
            storyOriginP2: saved.storyOriginP2 || prev.storyOriginP2,
            storyMilestones: saved.storyMilestones || prev.storyMilestones,
            storyArenas: saved.storyArenas || prev.storyArenas
          }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg, #101010)', color: 'var(--white, #f4efe6)' }}
    >
      
      {/* 1. HERO SECTION */}
      <motion.section 
        className="intro-section" 
        style={{ padding: '100px 10% 60px', textAlign: 'center' }} 
        initial="hidden" 
        animate="visible" 
        variants={staggerContainer}
      >
        <motion.p className="eyebrow" variants={fadeUp}>
          {data.storyHeroEyebrow}
        </motion.p>
        
        <h1 style={{ fontFamily: 'var(--heading-font, serif)', fontSize: 'clamp(46px, 6.5vw, 84px)', fontWeight: 400, margin: '15px 0 30px', lineHeight: 1.05, whiteSpace: 'pre-line' }}>
          <div style={{ overflow: 'hidden' }}>
            <motion.div variants={maskReveal}>
              {data.storyHeroHeading}
            </motion.div>
          </div>
        </h1>

        <motion.p 
          variants={fadeUp} 
          style={{ maxWidth: '820px', margin: '0 auto', fontSize: '15px', lineHeight: '2', color: 'var(--text, #d2cec8)' }}
        >
          {data.storyHeroParagraph}
        </motion.p>

        {/* Stats Strip */}
        <motion.div 
          variants={fadeUp}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            maxWidth: '1050px',
            margin: '60px auto 0',
            padding: '30px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border, rgba(255,255,255,0.1))',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}
        >
          {(data.storyStats || defaultStats).map((stat, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              style={{ textAlign: 'center', padding: '10px' }}
            >
              <h3 style={{ fontFamily: 'var(--heading-font, serif)', fontSize: '38px', color: 'var(--gold, #c6a46b)', margin: '0 0 5px 0', fontWeight: 600 }}>
                {stat.number}
              </h3>
              <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 600, color: '#fff' }}>
                {stat.label}
              </p>
              <span style={{ fontSize: '11px', color: 'var(--muted, #aaa)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {stat.sub}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* 2. THE FOUNDER'S JOURNEY (MUNU & KENDRAPARA) */}
      <section style={{ padding: '80px 10%', background: 'var(--bg-light, #171717)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '50px', alignItems: 'center' }}>
          
          {/* Visual Showcase Card */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ position: 'relative' }}
          >
            <div 
              style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                aspectRatio: '4/5',
                border: '1px solid rgba(198, 164, 107, 0.3)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
                background: '#0d0d0d'
              }}
            >
              <img 
                src={data.storyFounderImg} 
                alt={data.storyFounderName}
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} 
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
              
              <div style={{ position: 'absolute', bottom: '25px', left: '25px', right: '25px' }}>
                <span style={{ padding: '4px 10px', background: 'var(--gold, #c6a46b)', color: '#111', fontSize: '10px', fontWeight: 700, borderRadius: '4px', letterSpacing: '1px' }}>
                  THE FOUNDER
                </span>
                <h3 style={{ fontFamily: 'var(--heading-font, serif)', fontSize: '28px', color: '#fff', margin: '10px 0 4px' }}>
                  {data.storyFounderName}
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text, #d2cec8)' }}>
                  {data.storyFounderRole}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--gold, #c6a46b)', marginTop: '8px' }}>
                  <MapPin size={12} /> {data.storyFounderOrigin}
                </div>
              </div>
            </div>

            {/* Decorative Gold Accent Badge */}
            <motion.div 
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                border: '1px dashed var(--gold, #c6a46b)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(16, 16, 16, 0.8)',
                backdropFilter: 'blur(8px)',
                pointerEvents: 'none'
              }}
            >
              <Sparkles size={24} color="var(--gold, #c6a46b)" />
            </motion.div>
          </motion.div>

          {/* Story Narrative */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <p className="eyebrow" style={{ color: 'var(--gold, #c6a46b)' }}>HOW IT BEGAN</p>
            <h2 style={{ fontFamily: 'var(--heading-font, serif)', fontSize: 'clamp(36px, 4.5vw, 56px)', fontWeight: 400, margin: '10px 0 25px' }}>
              {data.storyOriginHeading}
            </h2>
            
            <p style={{ fontSize: '14px', lineHeight: '2', color: 'var(--text, #d2cec8)', marginBottom: '18px' }}>
              {data.storyOriginP1}
            </p>

            <p style={{ fontSize: '14px', lineHeight: '2', color: 'var(--muted, #aaa)', marginBottom: '28px' }}>
              {data.storyOriginP2}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', borderTop: '1px solid var(--border, rgba(255,255,255,0.1))', paddingTop: '20px' }}>
              <div>
                <h4 style={{ color: 'var(--gold, #c6a46b)', margin: '0 0 5px 0', fontSize: '16px' }}>10+ Years</h4>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted, #aaa)' }}>Continuous dedication to cinematic elegance.</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--gold, #c6a46b)', margin: '0 0 5px 0', fontSize: '16px' }}>Master Precision</h4>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted, #aaa)' }}>From intimate vows to VIP state coverage.</p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 3. INTERACTIVE TIMELINE / MILESTONES */}
      <section style={{ padding: '100px 10%', background: 'var(--bg, #101010)', textAlign: 'center' }}>
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }} 
          variants={staggerContainer}
        >
          <p className="eyebrow">OUR EVOLUTION</p>
          <h2 style={{ fontFamily: 'var(--heading-font, serif)', fontSize: 'clamp(38px, 5vw, 64px)', fontWeight: 400, margin: '10px 0 60px' }}>
            Two Decades of <span>Creative Milestones</span>
          </h2>
        </motion.div>

        {/* Timeline Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '25px', maxWidth: '1200px', margin: '0 auto', textAlign: 'left' }}>
          {(data.storyMilestones || defaultMilestones).map((item, index) => {
            const Icon = milestoneIcons[index] || Camera;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -8, borderColor: 'var(--gold, #c6a46b)' }}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border, rgba(255,255,255,0.08))',
                  borderRadius: '16px',
                  padding: '30px 24px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.35s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '24px', fontWeight: 700, color: 'var(--gold, #c6a46b)' }}>
                      {item.year}
                    </span>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(198, 164, 107, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={18} color="var(--gold, #c6a46b)" />
                    </div>
                  </div>

                  <span style={{ fontSize: '10px', letterSpacing: '1.5px', color: 'var(--gold, #c6a46b)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                    {item.tag}
                  </span>

                  <h3 style={{ fontFamily: 'var(--heading-font, serif)', fontSize: '22px', color: '#fff', margin: '0 0 12px 0', fontWeight: 500 }}>
                    {item.title}
                  </h3>

                  <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.8', color: 'var(--muted, #aaa)' }}>
                    {item.desc}
                  </p>
                </div>

                <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--gold, #c6a46b)' }}>
                  <CheckCircle2 size={13} /> Photo In Motion Standard
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. EXPERTISE & VERSATILITY */}
      <section style={{ padding: '90px 10%', background: 'var(--bg-light, #171717)', textAlign: 'center' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <p className="eyebrow">VERSATILITY & EXPERTISE</p>
          <h2 style={{ fontFamily: 'var(--heading-font, serif)', fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 400, margin: '10px 0 40px' }}>
            Trusted Across <span>Diverse Arenas</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '22px', textAlign: 'left' }}>
            {(data.storyArenas || defaultArenas).map((arena, idx) => {
              const Icon = idx === 0 ? ShieldCheck : idx === 1 ? Camera : YoutubeIcon;
              return (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -6 }}
                  style={{ background: 'rgba(255,255,255,0.02)', padding: '30px', borderRadius: '14px', border: '1px solid var(--border)' }}
                >
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(198, 164, 107, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                    <Icon size={22} color="var(--gold, #c6a46b)" />
                  </div>
                  <h3 style={{ fontSize: '20px', color: '#fff', margin: '0 0 10px 0', fontFamily: 'var(--heading-font)' }}>
                    {arena.title}
                  </h3>
                  <p style={{ fontSize: '13px', lineHeight: '1.8', color: 'var(--muted, #aaa)', margin: 0 }}>
                    {arena.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <motion.section 
        className="contact-section" 
        style={{ padding: '100px 10%', background: 'var(--bg, #101010)', textAlign: 'center' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.p className="eyebrow" variants={fadeUp}>BE PART OF OUR STORY</motion.p>
        <h2 style={{ fontFamily: 'var(--heading-font, serif)', fontSize: 'clamp(38px, 5vw, 68px)', fontWeight: 400, margin: '10px 0 20px' }}>
          Let’s Frame Your <span>Legacy Together</span>
        </h2>
        <motion.p variants={fadeUp} style={{ maxWidth: '620px', margin: '0 auto 35px', fontSize: '14px', lineHeight: '1.9', color: 'var(--muted, #aaa)' }}>
          Whether it’s a regal wedding, high-profile event, fashion portfolio, or cinematic film, Photo In Motion brings 20 years of mastery to your milestone.
        </motion.p>
        <motion.div variants={fadeUp}>
          <Link to="/contact" className="primary-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            Book Your Consultation <ArrowRight size={16} />
          </Link>
        </motion.div>
      </motion.section>

    </motion.div>
  );
}
