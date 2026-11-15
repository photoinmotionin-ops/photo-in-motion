import { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight, Mail, Compass, Camera } from 'lucide-react'
import EnquiryForm from '../components/common/EnquiryForm'

// --- ANIMATION VARIANTS ---
const maskReveal = { hidden: { y: "100%", rotate: 2 }, visible: { y: 0, rotate: 0, transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } } }
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } } }

const steps = [
  { icon: Mail, title: '1. Enquire', desc: 'Tell us about your event and vision.' },
  { icon: Compass, title: '2. Consult', desc: 'We plan the perfect timeline together.' },
  { icon: Camera, title: '3. Capture', desc: 'We film your day, seamlessly.' },
]

export default function Contact() {
  const [enquiryOpen, setEnquiryOpen] = useState(false)

  // 3D Tilt Effect for the Envelope
  const cardRef = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg)' }}>
      <EnquiryForm isOpen={enquiryOpen} onClose={() => setEnquiryOpen(false)} />

      {/* 1. THE INVITATION (Interactive 3D Card) */}
      <section style={{ padding: '80px 10%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} style={{ textAlign: 'center', marginBottom: '50px' }}>
          <motion.p className="eyebrow" variants={fadeUp}>YOU ARE INVITED</motion.p>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(48px, 6vw, 78px)', fontWeight: 400, margin: 0 }}>
            <div style={{ overflow: 'hidden' }}><motion.div variants={maskReveal}>Let's Create</motion.div></div>
            <div style={{ overflow: 'hidden' }}><motion.div variants={maskReveal}><span>Magic Together</span></motion.div></div>
          </h2>
        </motion.div>

        {/* 3D Envelope Card */}
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ perspective: 1000, width: '100%', maxWidth: '600px' }}
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
        >
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onClick={() => setEnquiryOpen(true)}
            className="envelope-card"
          >
            <div style={{ transform: "translateZ(50px)", display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(198, 164, 107, 0.1)', border: '1px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={32} color="var(--gold)" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '32px', color: 'var(--white)', margin: '0 0 10px' }}>Open Your Invitation</h3>
                <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Click to start your booking enquiry.</p>
              </div>
              <button className="primary-btn" style={{ marginTop: '10px' }}>Start Your Enquiry <ArrowUpRight size={18} /></button>
            </div>
            {/* Envelope Flaps (Visual detail) */}
            <div className="envelope-flap top" />
            <div className="envelope-flap bottom" />
          </motion.div>
        </motion.div>
      </section>

      {/* 2. THE PROCESS (How it works) */}
      <section style={{ padding: '100px 10%', background: 'var(--bg-light)', textAlign: 'center' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} style={{ marginBottom: '60px' }}>
          <motion.p className="eyebrow" variants={fadeUp}>THE SEAMLESS PROCESS</motion.p>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(40px, 5vw, 60px)', fontWeight: 400, margin: 0 }}>
            <div style={{ overflow: 'hidden' }}><motion.div variants={maskReveal}>How We Work</motion.div></div>
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', maxWidth: '1000px', margin: '0 auto' }}>
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div key={step.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.2 }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--gold)' }}>
                  <Icon size={24} />
                </div>
                <h4 style={{ fontFamily: 'var(--heading-font)', fontSize: '24px', color: 'var(--white)', margin: '0 0 10px' }}>{step.title}</h4>
                <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: '1.6' }}>{step.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* 3. FINAL CTA */}
      <motion.section style={{ padding: '140px 10%', background: 'var(--bg)', textAlign: 'center', borderTop: '1px solid var(--border)' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
        <motion.p className="eyebrow" variants={fadeUp}>LET'S CREATE SOMETHING TIMELESS</motion.p>
        <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(48px, 6vw, 80px)', fontWeight: 400, margin: 0, lineHeight: 1.1 }}>
          <div style={{ overflow: 'hidden' }}><motion.div variants={maskReveal}>Your story deserves</motion.div></div>
          <div style={{ overflow: 'hidden' }}><motion.div variants={maskReveal}>to be <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>remembered.</span></motion.div></div>
        </h2>
        <motion.p variants={fadeUp} style={{ maxWidth: '600px', margin: '30px auto 0', color: 'var(--muted)', fontSize: '15px', lineHeight: '2' }}>
          Have a celebration coming up? Let's talk about how we can turn your moments into lasting memories.
        </motion.p>
        <motion.div variants={fadeUp}>
          <motion.button onClick={() => setEnquiryOpen(true)} className="primary-btn" whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(198, 164, 107, 0.3)" }} whileTap={{ scale: 0.95 }} style={{ marginTop: '40px', border: 'none', cursor: 'pointer' }}>
            Start A Conversation <ArrowUpRight size={18} />
          </motion.button>
        </motion.div>
      </motion.section>
    </motion.div>
  )
}