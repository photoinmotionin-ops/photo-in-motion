import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, X, ExternalLink } from 'lucide-react';

// Built-in SVGs to guarantee zero missing export build errors in Vite / Vercel
const InstagramIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const YoutubeIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9 10 15" fill={color} />
  </svg>
);

const LinkedinIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

export default function FollowUsButton({ config }) {
  const [isOpen, setIsOpen] = useState(false);

  const instagramUrl = config?.instagramUrl || 'https://instagram.com/hdmunu';
  const youtubeUrl = config?.youtubeUrl || 'https://youtube.com';
  const linkedinUrl = config?.linkedinUrl || 'https://linkedin.com';

  const socialLinks = [
    {
      name: 'Instagram',
      url: instagramUrl,
      icon: InstagramIcon,
      color: '#E1306C',
      hoverBg: 'rgba(225, 48, 108, 0.15)'
    },
    {
      name: 'YouTube',
      url: youtubeUrl,
      icon: YoutubeIcon,
      color: '#FF0000',
      hoverBg: 'rgba(255, 0, 0, 0.15)'
    },
    {
      name: 'LinkedIn',
      url: linkedinUrl,
      icon: LinkedinIcon,
      color: '#0A66C2',
      hoverBg: 'rgba(10, 102, 194, 0.15)'
    }
  ];

  return (
    <div style={{ position: 'fixed', bottom: '105px', right: '30px', zIndex: 9998 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              bottom: '70px',
              right: '0',
              background: 'rgba(16, 16, 16, 0.96)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(198, 164, 107, 0.35)',
              borderRadius: '16px',
              padding: '12px',
              minWidth: '200px',
              boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px 6px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gold, #c6a46b)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Follow Us
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: '#777', cursor: 'pointer', padding: 0 }}
              >
                <X size={14} />
              </button>
            </div>

            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 500,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = item.hoverBg;
                    e.currentTarget.style.borderColor = item.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={16} color={item.color} />
                    </div>
                    <span>{item.name}</span>
                  </div>
                  <ExternalLink size={12} color="#888" />
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1f1b14, #0a0a0a)',
          border: '1.5px solid var(--gold, #c6a46b)',
          color: 'var(--gold, #c6a46b)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
          padding: 0
        }}
        title="Follow Us on Social Media"
      >
        <Share2 size={20} />
        <span style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.5px', marginTop: '2px', textTransform: 'uppercase' }}>
          Follow
        </span>
      </motion.button>
    </div>
  );
}
