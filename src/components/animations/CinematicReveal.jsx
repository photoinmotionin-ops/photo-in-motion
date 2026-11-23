import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CinematicReveal.css';

// Arrays of images to cycle through
const mainImages = [
  'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'
];

const sideImagesLeft = [
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=400&q=80'
];

const sideImagesRight = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=400&q=80'
];

const CinematicReveal = () => {
  const [mainIndex, setMainIndex] = useState(0);
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(0);

  // Auto-cycle the images
  useEffect(() => {
    const interval = setInterval(() => {
      setMainIndex((prev) => (prev + 1) % mainImages.length);
      setLeftIndex((prev) => (prev + 1) % sideImagesLeft.length);
      setRightIndex((prev) => (prev + 1) % sideImagesRight.length);
    }, 3000); // Changes every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="cinematic-reveal-container">
      
      {/* Background Glow & Particles */}
      <div className="cinematic-glow"></div>
      <div className="particles">
        {[...Array(15)].map((_, i) => (
          <motion.div 
            key={i}
            className="particle"
            animate={{ 
              y: [0, -100, 0], 
              opacity: [0, 0.5, 0],
              scale: [1, 1.5, 1]
            }}
            transition={{ 
              duration: Math.random() * 5 + 5, 
              repeat: Infinity, 
              delay: Math.random() * 5 
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      <div className="animation-stage">
        
        {/* The Rotating Rings */}
        <motion.div 
          className="rotating-ring outer"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="rotating-ring inner"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        {/* Side Images (Floating) */}
        <motion.div 
          className="side-image-wrapper left"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <AnimatePresence mode="wait">
            <motion.img 
              key={leftIndex}
              src={sideImagesLeft[leftIndex]} 
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>
        </motion.div>

        <motion.div 
          className="side-image-wrapper right"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <AnimatePresence mode="wait">
            <motion.img 
              key={rightIndex}
              src={sideImagesRight[rightIndex]} 
              initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: -10 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>
        </motion.div>

        {/* Main Central Image (Changing) */}
        <div className="main-image-wrapper">
          <AnimatePresence mode="wait">
            <motion.img 
              key={mainIndex}
              src={mainImages[mainIndex]} 
              className="main-image" 
              initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              transition={{ duration: 0.8 }}
            />
          </AnimatePresence>
        </div>
      </div>

      <motion.div 
        className="reveal-content"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <h2>Capturing <span>Eternity</span></h2>
        <p>Every frame tells a story. Every moment is a timeless memory.</p>
      </motion.div>
    </section>
  );
};

export default CinematicReveal;