import { motion } from 'framer-motion'
import { Camera, Video, Heart, Sparkles, Compass, PenTool, Aperture, MonitorPlay, Send } from 'lucide-react'

const services = [
  { icon: Camera, title: 'Photography', description: 'Beautifully composed photographs that preserve the emotions and details of your special moments.' },
  { icon: Video, title: 'Cinematography', description: 'Cinematic storytelling that transforms your celebrations into films you can relive forever.' },
  { icon: Heart, title: 'Wedding Stories', description: 'From intimate ceremonies to grand celebrations, we capture every chapter of your wedding.' },
  { icon: Sparkles, title: 'Special Events', description: 'Creative photography and films for birthdays, engagements, corporate events and more.' },
]

const processSteps = [
  { icon: Compass, title: '1. Discover', desc: 'Understand the client\'s event and expectations.' },
  { icon: PenTool, title: '2. Plan', desc: 'Discuss creative ideas and requirements.' },
  { icon: Aperture, title: '3. Capture', desc: 'Photograph and film every important moment.' },
  { icon: MonitorPlay, title: '4. Create', desc: 'Edit, color-grade and produce the final memories.' },
  { icon: Send, title: '5. Deliver', desc: 'Share the finished photographs and films.' },
]

const maskReveal = { hidden: { y: "100%", rotate: 2 }, visible: { y: 0, rotate: 0, transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } } }
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }

export default function Services() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg)' }}>
      
      {/* SERVICES */}
      <section className="services-section" style={{ padding: '100px 10%' }}>
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} style={{ textAlign: 'center' }}>
          <motion.p className="eyebrow" variants={fadeUp}>WHAT WE CREATE</motion.p>
          <h2>
            <div style={{ overflow: 'hidden' }}><motion.div variants={maskReveal}>Our Creative</motion.div></div>
            <div style={{ overflow: 'hidden' }}><motion.div variants={maskReveal}><span>Services</span></motion.div></div>
          </h2>
          <motion.p className="services-intro" variants={fadeUp}>
            Every occasion deserves a unique perspective. We bring creativity, emotion and attention to detail to every project.
          </motion.p>
        </motion.div>
        <motion.div className="services-grid" initial="hidden" animate="visible" variants={staggerContainer}>
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.article className="service-card" key={service.title} variants={fadeUp} whileHover={{ y: -8, borderColor: "var(--gold)", backgroundColor: "rgba(198, 164, 107, 0.05)" }}>
                <motion.div whileHover={{ rotate: 15, scale: 1.2 }} transition={{ type: "spring", stiffness: 300 }} style={{ display: 'inline-block' }}>
                  <Icon size={30} strokeWidth={1.3} />
                </motion.div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </motion.article>
            )
          })}
        </motion.div>
      </section>

      {/* CREATIVE PROCESS */}
      <section className="process-section" style={{ padding: '120px 10%', background: 'var(--bg-light)', textAlign: 'center' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.p className="eyebrow" variants={fadeUp}>HOW WE WORK</motion.p>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(48px, 6vw, 78px)', fontWeight: 400, margin: '0 0 50px 0' }}>
            <div style={{ overflow: 'hidden' }}><motion.div variants={maskReveal}>Our Creative</motion.div></div>
            <div style={{ overflow: 'hidden' }}><motion.div variants={maskReveal}><span>Process</span></motion.div></div>
          </h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          {processSteps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div key={step.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.15 }} style={{ position: 'relative' }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(198, 164, 107, 0.1)', border: '1px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', color: 'var(--gold)' }}>
                  <Icon size={28} />
                </div>
                <h4 style={{ fontFamily: 'var(--heading-font)', fontSize: '24px', margin: '0 0 10px 0', color: 'var(--white)' }}>{step.title}</h4>
                <p style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: '1.6' }}>{step.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>
    </motion.div>
  )
}