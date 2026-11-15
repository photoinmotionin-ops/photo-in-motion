import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Camera, Focus } from 'lucide-react';

export default function CameraCapture() {
  const ref = useRef(null);
  // Removed once: true so it re-animates every time you scroll to it
  const isInView = useInView(ref, { margin: "-20%" });
  
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  // Typewriter effect logic
  const text = "Every detail, perfectly focused.";
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    if (isInView) {
      let i = 0;
      const timer = setInterval(() => {
        setDisplayText(text.slice(0, i));
        i++;
        if (i > text.length) clearInterval(timer);
      }, 50);
      return () => clearInterval(timer);
    } else {
      setDisplayText(""); // Reset text when out of view
    }
  }, [isInView]);

  return (
    <section ref={ref} style={{ height: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
      
      {/* Flash Effect */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? [0, 1, 0] : 0 }}
        transition={{ duration: 0.8, delay: 1.5, times: [0, 0.2, 1] }}
        style={{ position: 'absolute', inset: 0, background: 'white', zIndex: 50, pointerEvents: 'none' }}
      />

      <div style={{ position: 'relative', width: '300px', height: '300px', borderRadius: '50%', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        <motion.div
          initial={{ scale: 2, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : { scale: 2, opacity: 0 }}
          transition={{ duration: 1, type: "spring" }}
          style={{ position: 'absolute', inset: -20, zIndex: 10 }}
        >
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(198, 164, 107, 0.5)' }} />
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(198, 164, 107, 0.5)' }} />
          <Focus size={40} color="var(--gold)" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
          style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', position: 'relative', display: 'flex', flexWrap: 'wrap' }}
        >
          <motion.img style={{ y: y1, width: '50%', height: '100%', objectFit: 'cover' }} src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80" />
          <motion.img style={{ y: y2, width: '50%', height: '100%', objectFit: 'cover' }} src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80" />
        </motion.div>

        <motion.div
          animate={isInView ? { rotate: 360 } : {}}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', inset: -40, border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '50%' }}
        />
      </div>

      {/* Typewriter Text */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 1, delay: 2 }}
        style={{ textAlign: 'center', marginTop: '100px' }}
      >
        <Camera size={24} color="var(--gold)" style={{ margin: '0 auto 10px' }} />
        <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '32px', color: 'var(--white)', margin: 0 }}>
          Capturing the Moment
        </h3>
        <p style={{ color: 'var(--muted)', fontSize: '15px', marginTop: '10px', height: '24px' }}>
          {displayText}
          <motion.span 
            animate={{ opacity: [0, 1, 0] }} 
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{ display: 'inline-block', width: '2px', height: '15px', background: 'var(--gold)', marginLeft: '4px' }}
          />
        </p>
      </motion.div>

    </section>
  )
}