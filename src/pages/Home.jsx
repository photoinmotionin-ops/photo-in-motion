import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDown, Play, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import CinematicReveal from '../components/animations/CinematicReveal';
import CameraCapture from '../components/animations/CameraCapture';
import EventPlanner from '../components/animations/EventPlanner';

const maskReveal = { hidden: { y: "100%", rotate: 2 }, visible: { y: 0, rotate: 0, transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } } }
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } } }

const featuredWorks = [
  { number: '01', category: 'WEDDINGS', title: 'Forever Begins', key: 'img1' },
  { number: '02', category: 'CELEBRATIONS', title: 'Beautiful Together', key: 'img2' },
  { number: '03', category: 'CINEMATIC FILMS', title: 'Beyond The Frame', key: 'img3' },
]

const testimonials = [
  { name: 'Ananya & Rahul', rating: 5 },
  { name: 'Sarah & James', rating: 5 },
  { name: 'Priya & Arjun', rating: 5 },
]

export default function Home() {
  const [content, setContent] = useState({
    heroTitle: 'Every Frame.\nA Timeless Story.',
    heroSub: "We don't just capture moments. We turn emotions, memories and beautiful stories into something that lasts forever.",
    storyTitle: 'Moments pass.\nStories stay forever.',
    storyText: 'At Photo In Motion, we believe every celebration has a story worth telling. Through thoughtful photography and cinematic filmmaking, we preserve the feelings behind every frame.',
    testimonial1: 'They captured the essence of our wedding perfectly.',
    testimonial2: 'The cinematic film they created for us is an absolute masterpiece.',
    testimonial3: 'Professional, unobtrusive, and incredibly talented.',
    img1: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85',
    img2: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85',
    img3: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
    showreelImg: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80'
  });

  useEffect(() => {
    fetch('/api/enquiry?action=get_content')
      .then(res => res.json())
      .then(data => {
        if (Object.keys(data).length > 0) {
          setContent(data);
        }
      });
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      
      {/* 1. HERO SECTION */}
      <section className="hero" id="home">
        <div className="hero-overlay" />
        <motion.div className="hero-content" initial="hidden" animate="visible" variants={staggerContainer}>
          <div style={{ overflow: 'hidden' }}><motion.p className="eyebrow" variants={maskReveal}>WEDDING · EVENTS · CINEMATIC FILMS</motion.p></div>
          <h1 style={{ whiteSpace: 'pre-line' }}>
            <div style={{ overflow: 'hidden' }}><motion.div variants={maskReveal}>{content.heroTitle}</motion.div></div>
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

      <CameraCapture />
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
            <motion.article className="portfolio-card" key={item.number} style={{ backgroundImage: `url("${content[item.key]}")` }} variants={fadeUp} whileHover={{ y: -10, scale: 1.02, boxShadow: "0px 20px 40px rgba(0,0,0,0.4)" }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
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

      {/* 4. SHOWREEL */}
      <section className="showreel-section" style={{ padding: '120px 10%', background: 'var(--bg)', textAlign: 'center' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.p className="eyebrow" variants={fadeUp}>THE CINEMATIC EXPERIENCE</motion.p>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(48px, 6vw, 78px)', fontWeight: 400, margin: '0 0 50px 0' }}>
            <div style={{ overflow: 'hidden' }}><motion.div variants={maskReveal}>Watch Our</motion.div></div>
            <div style={{ overflow: 'hidden' }}><motion.div variants={maskReveal}><span>Showreel</span></motion.div></div>
          </h2>
          <motion.div variants={fadeUp} style={{ position: 'relative', width: '100%', maxWidth: '1000px', margin: '0 auto', aspectRatio: '16/9', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', cursor: 'pointer' }} whileHover={{ scale: 1.01 }}>
            <img src={content.showreelImg} alt="Showreel" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div whileHover={{ scale: 1.1 }} style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111', boxShadow: '0 0 30px rgba(198, 164, 107, 0.4)' }}>
                <Play size={32} fill="#111" style={{ marginLeft: '5px' }} />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <EventPlanner />

      {/* 5. TESTIMONIALS */}
      <section className="testimonials-section" style={{ padding: '100px 10%', background: 'var(--bg-light)', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.p className="eyebrow" variants={fadeUp}>CLIENT LOVE</motion.p>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(40px, 5vw, 60px)', fontWeight: 400, margin: '0 0 50px 0' }}>
            <div style={{ overflow: 'hidden' }}><motion.div variants={maskReveal}>Words From</motion.div></div>
            <div style={{ overflow: 'hidden' }}><motion.div variants={maskReveal}><span>Our Clients</span></motion.div></div>
          </h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          {testimonials.map((test, index) => (
            <motion.div key={test.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.2 }} style={{ background: 'rgba(255,255,255,0.02)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'left' }}>
              <div style={{ display: 'flex', gap: '5px', color: 'var(--gold)', marginBottom: '20px' }}>
                {[...Array(test.rating)].map((_, i) => <Star key={i} size={16} fill="var(--gold)" />)}
              </div>
              <p style={{ color: 'var(--text)', fontSize: '14px', lineHeight: '1.8', fontStyle: 'italic', marginBottom: '20px' }}>
                "{content[`testimonial${index + 1}`]}"
              </p>
              <h4 style={{ fontFamily: 'var(--heading-font)', fontSize: '20px', color: 'var(--white)', margin: 0 }}>{test.name}</h4>
            </motion.div>
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
  )
}