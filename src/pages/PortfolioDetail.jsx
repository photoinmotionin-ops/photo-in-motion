import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

export default function PortfolioDetail() {
  const { id } = useParams(); // Get ID from URL
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/enquiry?action=get_content')
      .then(res => res.json())
      .then(data => {
        if (data.portfolioItems) {
          const foundItem = data.portfolioItems.find(i => i.id === id);
          setItem(foundItem);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>Loading...</div>;

  if (!item) return (
    <div style={{ color: 'white', padding: '100px', textAlign: 'center', minHeight: '100vh' }}>
      <h2>Image not found</h2>
      <Link to="/portfolio" className="primary-btn" style={{ marginTop: '20px' }}>Back to Portfolio</Link>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: '100px' }}>
      
      <div style={{ padding: '20px 10%' }}>
        <button onClick={() => navigate('/portfolio')} style={{ background: 'transparent', border: 'none', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '16px', marginBottom: '30px' }}>
          <ArrowLeft size={20} /> Back to Portfolio
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* Main Image */}
          <div style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <img src={item.image} alt={item.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>

          {/* Event Details */}
          <div style={{ textAlign: 'center' }}>
            <p className="eyebrow" style={{ color: 'var(--gold)' }}>{item.category.toUpperCase()}</p>
            <h1 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(48px, 6vw, 78px)', color: 'var(--white)', margin: '0 0 20px' }}>
              {item.title}
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '16px', lineHeight: '1.8', maxWidth: '700px', margin: '0 auto 40px' }}>
              {item.description}
            </p>
            
            <Link to={item.link || '/contact'} className="primary-btn" style={{ padding: '15px 30px', fontSize: '14px' }}>
              Book This Type of Event <ArrowUpRight size={18} />
            </Link>
          </div>

        </div>
      </div>
    </motion.div>
  );
}