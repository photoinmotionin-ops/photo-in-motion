import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Film } from 'lucide-react';

export default function CinematicStrip() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-20%" });

  // Parallax effect for the images
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <section ref={ref} style={{ height: '100vh', background: '#050505', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
      
      {/* The Film Strip Container */}
      <motion.div 
        initial={{ width: 0, opacity: 0 }}
        animate={isInView ? { width: '80%', opacity: 1 } : { width: 0, opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{ 
          position: 'relative', 
          height: '400px', 
          borderTop: '4px dashed rgba(198, 164, 107, 0.5)', 
          borderBottom: '4px dashed rgba(198, 164, 107, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        {/* Left Film Sprockets */}
        <div style={{ position: 'absolute', left: '10px', top: 0, bottom: 0, width: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', opacity: 0.5 }}>
           {[...Array(8)].map((_, i) => <div key={i} style={{ width: '100%', height: '12px', background: '#333', borderRadius: '2px' }} />)}
        </div>

        {/* Right Film Sprockets */}
        <div style={{ position: 'absolute', right: '10px', top: 0, bottom: 0, width: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', opacity: 0.5 }}>
           {[...Array(8)].map((_, i) => <div key={i} style={{ width: '100%', height: '12px', background: '#333', borderRadius: '2px' }} />)}
        </div>

        {/* The Images inside the strip */}
        <div style={{ width: '100%', height: '100%', display: 'flex', padding: '0 40px', gap: '20px' }}>
          <motion.div style={{ y: y1, flex: 1, height: '120%', overflow: 'hidden', borderRadius: '4px' }}>
            <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80" alt="Wedding" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>
          <motion.div style={{ y: y2, flex: 1, height: '120%', overflow: 'hidden', borderRadius: '4px' }}>
            <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80" alt="Cinematic" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>
        </div>

        {/* Light Sweep Effect */}
        <motion.div 
          initial={{ x: '-100%', opacity: 0 }}
          animate={isInView ? { x: '150%', opacity: 0.4 } : {}}
          transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
          style={{ position: 'absolute', top: 0, bottom: 0, width: '50%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)', zIndex: 10, transform: 'skewX(-20deg)' }}
        />
      </motion.div>

      {/* Text Below */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 1, delay: 1 }}
        style={{ textAlign: 'center', marginTop: '50px' }}
      >
        <Film size={24} color="var(--gold)" style={{ margin: '0 auto 10px' }} />
        <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '32px', color: 'var(--white)', margin: 0 }}>
          Every Frame Tells a Story
        </h3>
        <p style={{ color: 'var(--muted)', fontSize: '15px', marginTop: '10px' }}>
          Capturing the essence of your most precious moments.
        </p>
      </motion.div>

    </section>
  )
}