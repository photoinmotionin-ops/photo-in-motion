import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Mail, Compass, Camera } from 'lucide-react';
import EnquiryForm from '../components/common/EnquiryForm';

const maskReveal = { hidden: { y: "100%", rotate: 2 }, visible: { y: 0, rotate: 0, transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } } };
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } };
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } } };

const stepIcons = [Mail, Compass, Camera];

const defaultSteps = [
  { title: '1. Enquire', desc: 'Tell us about your event and vision.' },
  { title: '2. Consult', desc: 'We plan the perfect timeline together.' },
  { title: '3. Capture', desc: 'We film your day, seamlessly.' },
];

export default function Contact() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const [contactData, setContactData] = useState({
    invitationEyebrow: 'YOU ARE INVITED',
    invitationHeading: "Let's Create Magic Together",
    invitationCardTitle: 'Open Your Invitation',
    invitationCardSub: 'Click to start your booking enquiry.',
    invitationBtnText: 'Start Your Enquiry',
    
    processEyebrow: 'THE SEAMLESS PROCESS',
    processHeading: 'How We Work',
    processSteps: defaultSteps,

    contactCtaEyebrow: "LET'S CREATE SOMETHING TIMELESS",
    contactCtaHeading: "Your story deserves to be remembered.",
    contactCtaDesc: "Have a celebration coming up? Let's talk about how we can turn your moments into lasting memories.",
    contactCtaBtn: 'Start A Conversation'
  });

  useEffect(() => {
    fetch('/api/enquiry?action=get_content')
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setContactData(prev => ({
            ...prev,
            invitationEyebrow: data.invitationEyebrow || prev.invitationEyebrow,
            invitationHeading: data.invitationHeading || prev.invitationHeading,
            invitationCardTitle: data.invitationCardTitle || prev.invitationCardTitle,
            invitationCardSub: data.invitationCardSub || prev.invitationCardSub,
            invitationBtnText: data.invitationBtnText || prev.invitationBtnText,
            processEyebrow: data.processEyebrow || prev.processEyebrow,
            processHeading: data.processHeading || prev.processHeading,
            processSteps: data.processSteps || prev.processSteps,
            contactCtaEyebrow: data.contactCtaEyebrow || prev.contactCtaEyebrow,
            contactCtaHeading: data.contactCtaHeading || prev.contactCtaHeading,
            contactCtaDesc: data.contactCtaDesc || prev.contactCtaDesc,
            contactCtaBtn: data.contactCtaBtn || prev.contactCtaBtn
          }));
        }
      })
      .catch(() => {});
  }, []);

  // 3D Tilt Effect
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    x.set((e.clientX - rect.left) / width - 0.5);
    y.set((e.clientY - rect.top) / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg, #0a0a0a)' }}>
      <EnquiryForm isOpen={enquiryOpen} onClose={() => setEnquiryOpen(false)} />

      {/* 1. THE INVITATION */}
      <section style={{ padding: '80px 10%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} style={{ textAlign: 'center', marginBottom: '50px' }}>
          <motion.p className="eyebrow" variants={fadeUp}>{contactData.invitationEyebrow}</motion.p>
          <h2 style={{ fontFamily: 'var(--heading-font, serif)', fontSize: 'clamp(48px, 6vw, 78px)', fontWeight: 400, margin: 0 }}>
            <div style={{ overflow: 'hidden' }}><motion.div variants={maskReveal}>{contactData.invitationHeading}</motion.div></div>
          </h2>
        </motion.div>

        {/* 3D Envelope Card */}
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ perspective: 1000, width: '100%', maxWidth: '600px' }}
          initial={{ opacity: 0, y: 50 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.8 }}
        >
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onClick={() => setEnquiryOpen(true)}
            className="envelope-card"
          >
            <div style={{ transform: "translateZ(50px)", display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(198, 164, 107, 0.1)', border: '1px solid var(--gold, #c6a46b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={32} color="var(--gold, #c6a46b)" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontFamily: 'var(--heading-font, serif)', fontSize: '32px', color: 'var(--white, #fff)', margin: '0 0 10px' }}>
                  {contactData.invitationCardTitle}
                </h3>
                <p style={{ color: 'var(--muted, #aaa)', fontSize: '14px' }}>
                  {contactData.invitationCardSub}
                </p>
              </div>
              <button className="primary-btn" style={{ marginTop: '10px' }}>
                {contactData.invitationBtnText} <ArrowUpRight size={18} />
              </button>
            </div>
            <div className="envelope-flap top" />
            <div className="envelope-flap bottom" />
          </motion.div>
        </motion.div>
      </section>

      {/* 2. THE PROCESS */}
      <section style={{ padding: '100px 10%', background: 'var(--bg-light, #141414)', textAlign: 'center' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} style={{ marginBottom: '60px' }}>
          <motion.p className="eyebrow" variants={fadeUp}>{contactData.processEyebrow}</motion.p>
          <h2 style={{ fontFamily: 'var(--heading-font, serif)', fontSize: 'clamp(40px, 5vw, 60px)', fontWeight: 400, margin: 0 }}>
            <div style={{ overflow: 'hidden' }}><motion.div variants={maskReveal}>{contactData.processHeading}</motion.div></div>
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', maxWidth: '1000px', margin: '0 auto' }}>
          {(contactData.processSteps || defaultSteps).map((step, index) => {
            const Icon = stepIcons[index] || Camera;
            return (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.2 }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border, rgba(255,255,255,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--gold, #c6a46b)' }}>
                  <Icon size={24} />
                </div>
                <h4 style={{ fontFamily: 'var(--heading-font, serif)', fontSize: '24px', color: 'var(--white, #fff)', margin: '0 0 10px' }}>{step.title}</h4>
                <p style={{ color: 'var(--muted, #aaa)', fontSize: '14px', lineHeight: '1.6' }}>{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. FINAL CTA */}
      <motion.section style={{ padding: '140px 10%', background: 'var(--bg, #0a0a0a)', textAlign: 'center', borderTop: '1px solid var(--border, rgba(255,255,255,0.08))' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
        <motion.p className="eyebrow" variants={fadeUp}>{contactData.contactCtaEyebrow}</motion.p>
        <h2 style={{ fontFamily: 'var(--heading-font, serif)', fontSize: 'clamp(48px, 6vw, 80px)', fontWeight: 400, margin: 0, lineHeight: 1.1 }}>
          <div style={{ overflow: 'hidden' }}><motion.div variants={maskReveal}>{contactData.contactCtaHeading}</motion.div></div>
        </h2>
        <motion.p variants={fadeUp} style={{ maxWidth: '600px', margin: '30px auto 0', color: 'var(--muted, #aaa)', fontSize: '15px', lineHeight: '2' }}>
          {contactData.contactCtaDesc}
        </motion.p>
        <motion.div variants={fadeUp}>
          <motion.button onClick={() => setEnquiryOpen(true)} className="primary-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ marginTop: '40px', border: 'none', cursor: 'pointer' }}>
            {contactData.contactCtaBtn} <ArrowUpRight size={18} />
          </motion.button>
        </motion.div>
      </motion.section>
    </motion.div>
  );
}
