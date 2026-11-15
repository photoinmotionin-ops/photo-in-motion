import { motion } from 'framer-motion'

const maskReveal = { hidden: { y: "100%", rotate: 2 }, visible: { y: 0, rotate: 0, transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } } }
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }

export default function Story() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg)' }}>
      <motion.section className="intro-section" style={{ padding: '120px 10%' }} initial="hidden" animate="visible" variants={staggerContainer}>
        <motion.p className="eyebrow" variants={fadeUp}>MORE THAN JUST PHOTOGRAPHY</motion.p>
        <h2>
          <div style={{ overflow: 'hidden' }}><motion.div variants={maskReveal}>Moments pass.</motion.div></div>
          <div style={{ overflow: 'hidden' }}><motion.div variants={maskReveal}><span>Stories stay forever.</span></motion.div></div>
        </h2>
        <motion.p variants={fadeUp} style={{ maxWidth: '800px', margin: '40px auto', fontSize: '16px', lineHeight: '2' }}>
          At Photo In Motion, we believe every celebration has a story worth telling. Through thoughtful photography and cinematic filmmaking, we preserve the feelings behind every frame. We don't just capture moments; we turn emotions, memories and beautiful stories into something that lasts forever.
        </motion.p>
      </motion.section>
    </motion.div>
  )
}