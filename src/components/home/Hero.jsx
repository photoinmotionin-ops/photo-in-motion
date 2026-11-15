import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
import { useRef } from 'react';

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section className="hero" id="home" ref={ref} style={{ background: '#101010', padding: 0 }}>
      
      {/* Background Video */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-by-the-lake-39856-large.mp4" type="video/mp4" />
        </video>
      </div>

      <motion.div className="hero-overlay" style={{ y, opacity }} />

      <div className="hero-content" style={{ padding: '150px 10% 110px' }}>
        <div style={{ overflow: 'hidden' }}>
          <motion.p 
            className="eyebrow"
            initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
          >
            PREMIUM PHOTOGRAPHY & FILMS
          </motion.p>
        </div>
        
        <h1 style={{ lineHeight: 1.1 }}>
          We Don't Just <br />
          Capture Moments. <br />
          <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>We Make Them Timeless.</span>
        </h1>

        <motion.div 
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1 }}
        >
          <a href="#portfolio" className="primary-btn">Explore Our Work <ArrowUpRight size={18} /></a>
          <a href="#contact" className="secondary-btn">Book Your Experience</a>
        </motion.div>
      </div>

      <div className="hero-bottom">
        <span>BASED IN INDIA · AVAILABLE WORLDWIDE</span>
        <a href="#story">SCROLL TO EXPLORE <ArrowDown size={15} /></a>
        <span>EST. WITH PASSION</span>
      </div>
    </section>
  );
}