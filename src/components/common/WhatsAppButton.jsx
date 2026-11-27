import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WhatsAppButton({ config }) {
  const phone = (config?.whatsappPhone || '9692485219').replace(/\D/g, '');
  const message = encodeURIComponent(config?.whatsappMessage || "Hi Photo In Motion, I visited your website and would like to know more about your photography services.");
  
  return (
    <motion.a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1, rotate: 8 }}
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        background: '#25D366',
        color: 'white',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
        zIndex: 9999
      }}
      title="Chat on WhatsApp"
    >
      <MessageCircle size={30} />
    </motion.a>
  );
}
