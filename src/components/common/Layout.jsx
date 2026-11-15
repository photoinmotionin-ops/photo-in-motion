import './../../App.css' // <-- THIS IS THE MISSING LINK
//import { useState } from 'react'
//import { motion } from 'framer-motion'
// ... rest of your imports
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import ContactModal from './ContactModal'
import EnquiryForm from './EnquiryForm'
import WhatsAppButton from './WhatsAppButton'


const navigation = [
  { label: 'Home', link: '/' },
  { label: 'Our Story', link: '/story' },
  { label: 'Portfolio', link: '/portfolio' },
  { label: 'Services', link: '/services' },
  { label: 'Contact', link: '/contact' },
]

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [enquiryOpen, setEnquiryOpen] = useState(false)
  const location = useLocation()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
      <EnquiryForm isOpen={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
      <WhatsAppButton />

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
                style={{ color: location.pathname === item.link ? 'var(--gold)' : 'inherit' }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="nav-actions">
            <button onClick={() => setContactModalOpen(true)} className="nav-cta" style={{ background: 'none', border: 'none' }}>
              Let's Talk <ArrowUpRight size={16} />
            </button>
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
  )
}