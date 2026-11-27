import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import ContactModal from './ContactModal';
import EnquiryForm from './EnquiryForm';
import WhatsAppButton from './WhatsAppButton';
import FollowUsButton from './FollowUsButton';

const navigation = [
  { label: 'Home', link: '/' },
  { label: 'Our Story', link: '/story' },
  { label: 'Portfolio', link: '/portfolio' },
  { label: 'Services', link: '/services' },
  { label: 'Contact', link: '/contact' },
];

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [siteConfig, setSiteConfig] = useState(() => {
    try {
      const cached = localStorage.getItem('site_content_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        return parsed.content || parsed.data || parsed;
      }
    } catch (_) {}
    return null;
  });

  const location = useLocation();

  useEffect(() => {
    fetch('/api/enquiry?action=get_content')
      .then(res => res.json())
      .then(data => {
        if (data) {
          const config = data.content || data.data || data;
          setSiteConfig(config);
          try {
            localStorage.setItem('site_content_cache', JSON.stringify(config));
          } catch (_) {}
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ContactModal 
        isOpen={contactModalOpen} 
        onClose={() => setContactModalOpen(false)} 
        config={siteConfig}
      />
      
      <EnquiryForm isOpen={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
      
      {/* Floating Action Controls */}
      <WhatsAppButton config={siteConfig} />
      <FollowUsButton config={siteConfig} />

      {/* NAVBAR */}
      <motion.nav className="navbar" initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, ease: "easeOut" }}>
        <div className="navbar-inner">
          <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>PHOTO <span>IN</span> MOTION</Link>
          
          <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
            {navigation.map((item) => (
              <Link 
                key={item.label} 
                to={item.link} 
                onClick={() => setMenuOpen(false)}
                style={{ color: location.pathname === item.link ? 'var(--gold, #c6a46b)' : 'inherit' }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="nav-actions">
            {/* BULLETPROOF LET'S TALK BUTTON: Stays illuminated and never blacks out on hover */}
            <motion.button 
              type="button"
              onClick={() => setContactModalOpen(true)}
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: 'var(--gold, #c6a46b)', 
                color: '#000',
                boxShadow: '0 0 20px rgba(198, 164, 107, 0.45)'
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 20px',
                borderRadius: '30px',
                background: 'rgba(198, 164, 107, 0.1)',
                border: '1px solid var(--gold, #c6a46b)',
                color: 'var(--gold, #c6a46b)',
                fontWeight: 600,
                fontSize: '12px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                cursor: 'pointer'
              }}
            >
              Let's Talk <ArrowUpRight size={15} />
            </motion.button>

            <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={25} /> : <Menu size={25} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* PAGE CONTENT */}
      <main style={{ flex: 1, paddingTop: '100px' }}>
        {children}
      </main>

      {/* FOOTER */}
      <footer>
        <Link to="/" className="footer-logo">PHOTO IN MOTION</Link>
        <p>Every Frame. A Timeless Story.</p>
        <div className="footer-links">
          <Link to="/story">Our Story</Link>
          <Link to="/portfolio">Portfolio</Link>
          <Link to="/services">Services</Link>
          <button onClick={() => setContactModalOpen(true)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 'inherit' }}>Contact</button>
        </div>
        <span>© {new Date().getFullYear()} Photo In Motion. All rights reserved.</span>
      </footer>
    </div>
  );
}
