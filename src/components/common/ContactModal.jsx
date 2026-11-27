import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, MessageCircle } from 'lucide-react';

export default function ContactModal({ isOpen, onClose, config }) {
  const email = config?.contactEmail || 'photoinmotion.in@gmail.com';
  const displayPhone = config?.contactPhone || '+91-9692485219';
  const cleanPhone = displayPhone.replace(/\D/g, '');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 999 }}
          />
          <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, pointerEvents: 'none', padding: '20px' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{ pointerEvents: 'auto', background: '#171717', padding: '50px 40px', borderRadius: '24px', border: '1px solid rgba(198,164,107,0.25)', width: '100%', maxWidth: '500px', textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', position: 'relative' }}
            >
              <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#aaa39a', cursor: 'pointer' }}>
                <X size={24} />
              </button>
              <p className="eyebrow" style={{ marginBottom: '10px', color: 'var(--gold, #c6a46b)' }}>GET IN TOUCH</p>
              <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '40px', margin: '0 0 30px 0', color: 'var(--white)', fontWeight: 400 }}>Let's Talk</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <motion.a href={`mailto:${email}`} whileHover={{ scale: 1.02, backgroundColor: 'rgba(198, 164, 107, 0.1)' }} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '20px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--white)', textDecoration: 'none' }}>
                  <div style={{ background: 'rgba(198, 164, 107, 0.2)', padding: '10px', borderRadius: '50%', color: 'var(--gold, #c6a46b)' }}><Mail size={20} /></div>
                  <div style={{ textAlign: 'left' }}><div style={{ fontSize: '12px', color: 'var(--muted)', letterSpacing: '1px' }}>EMAIL US</div><div style={{ fontSize: '14px', fontWeight: '500' }}>{email}</div></div>
                </motion.a>
                <motion.a href={`https://wa.me/${cleanPhone}`} target="_blank" rel="noreferrer" whileHover={{ scale: 1.02, backgroundColor: 'rgba(37, 211, 102, 0.1)' }} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '20px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--white)', textDecoration: 'none' }}>
                  <div style={{ background: 'rgba(37, 211, 102, 0.2)', padding: '10px', borderRadius: '50%', color: '#25D366' }}><MessageCircle size={20} /></div>
                  <div style={{ textAlign: 'left' }}><div style={{ fontSize: '12px', color: 'var(--muted)', letterSpacing: '1px' }}>WHATSAPP</div><div style={{ fontSize: '14px', fontWeight: '500' }}>{displayPhone}</div></div>
                </motion.a>
                <motion.a href={`tel:${cleanPhone}`} whileHover={{ scale: 1.02, backgroundColor: 'rgba(198, 164, 107, 0.1)' }} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '20px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--white)', textDecoration: 'none' }}>
                  <div style={{ background: 'rgba(198, 164, 107, 0.2)', padding: '10px', borderRadius: '50%', color: 'var(--gold, #c6a46b)' }}><Phone size={20} /></div>
                  <div style={{ textAlign: 'left' }}><div style={{ fontSize: '12px', color: 'var(--muted)', letterSpacing: '1px' }}>CALL US</div><div style={{ fontSize: '14px', fontWeight: '500' }}>{displayPhone}</div></div>
                </motion.a>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
