import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

// Expanded portfolio data to show a real gallery
const portfolioItems = [
  { number: '01', category: 'WEDDINGS', title: 'Forever Begins', image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85' },
  { number: '02', category: 'CELEBRATIONS', title: 'Beautiful Together', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85' },
  { number: '03', category: 'CINEMATIC FILMS', title: 'Beyond The Frame', image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85' },
  { number: '04', category: 'PRE-WEDDING', title: 'The Journey', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85' },
  { number: '05', category: 'EVENTS', title: 'Milestones', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=85' },
  { number: '06', category: 'PORTRAITS', title: 'Faces of Joy', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85' },
]

// Animation variants
const maskReveal = { hidden: { y: "100%", rotate: 2 }, visible: { y: 0, rotate: 0, transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } } }
const fadeUp = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }

export default function Portfolio() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ paddingTop: '120px', minHeight: '100vh', background: 'var(--bg)' }}>
      
      <section style={{ padding: '40px 10% 100px' }}>
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} style={{ textAlign: 'center', marginBottom: '60px' }}>
          <motion.p className="eyebrow" variants={fadeUp}>A COLLECTION OF MEMORIES</motion.p>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(48px, 6vw, 78px)', fontWeight: 400, margin: 0 }}>
            <div style={{ overflow: 'hidden' }}><motion.div variants={maskReveal}>Selected</motion.div></div>
            <div style={{ overflow: 'hidden' }}><motion.div variants={maskReveal}><span>Stories</span></motion.div></div>
          </h2>
          <motion.p variants={fadeUp} style={{ color: 'var(--muted)', maxWidth: '600px', margin: '20px auto 0', fontSize: '15px', lineHeight: '1.8' }}>
            Explore our curated gallery of timeless moments. From grand celebrations to intimate portraits, every frame is a masterpiece.
          </motion.p>
        </motion.div>

        {/* Cinematic Masonry Grid */}
        <motion.div 
          className="portfolio-gallery-grid"
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer}
        >
          {portfolioItems.map((item, index) => (
            <motion.div 
              key={item.number} 
              className="portfolio-gallery-item"
              variants={fadeUp}
            >
              <Link to="/contact" style={{ display: 'block', height: '100%', width: '100%', position: 'relative', overflow: 'hidden', borderRadius: '4px' }}>
                
                {/* Image with slow zoom on hover */}
                <motion.img 
                  src={item.image} 
                  alt={item.title} 
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                
                {/* Dark Gradient Overlay */}
                <div className="portfolio-gallery-overlay" />

                {/* Text Content sliding up on hover */}
                <div className="portfolio-gallery-content">
                  <span style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '2px', fontWeight: 600 }}>{item.number} / {item.category}</span>
                  <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '32px', fontWeight: 400, color: 'var(--white)', margin: '10px 0 0 0' }}>{item.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px', color: 'var(--gold)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    View Story <ArrowUpRight size={16} />
                  </div>
                </div>

                {/* Gold Border Outline on Hover */}
                <div className="portfolio-gallery-border" />

              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </motion.div>
  )
}