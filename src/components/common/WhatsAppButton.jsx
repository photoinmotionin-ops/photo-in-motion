import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  const message = encodeURIComponent("Hi Photo In Motion, I visited your website and would like to know more about your photography services.");
  
  return (
    <motion.a
      href={`https://wa.me/1234567890?text=${message}`}
      target="_blank"
      rel="noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1, rotate: 10 }}
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        background: '#25D366', // Official WhatsApp Green
        color: 'white',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
        zIndex: 9999
      }}
    >
      <MessageCircle size={32} />
    </motion.a>
  );
}