import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Portfolio() {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetch('/api/enquiry?action=get_content')
      .then(res => res.json())
      .then(data => {
        if (data.portfolioItems) {
          setPortfolioItems(data.portfolioItems);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>Loading Gallery...</div>;

  const categories = ['All', ...new Set(portfolioItems.map(item => item.category))];
  const filteredItems = activeCategory === 'All' ? portfolioItems : portfolioItems.filter(item => item.category === activeCategory);

  // Group Logic: Only show ONE card per category. 
  // For Wedding, we specifically look for the 'Marriage' sub-category to use as the main cover.
  const uniqueCards = filteredItems.reduce((acc, current) => {
    if (current.category === 'Wedding' && current.subCategory === 'Marriage') {
      acc.push(current);
    } else if (current.category !== 'Wedding' && !acc.find(item => item.category === current.category)) {
      acc.push(current);
    }
    return acc;
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ paddingTop: '120px', minHeight: '100vh', background: 'var(--bg)' }}>
      <section style={{ padding: '40px 10% 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p className="eyebrow">A COLLECTION OF MEMORIES</p>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(48px, 6vw, 78px)', fontWeight: 400, margin: 0 }}>
            Our <span>Portfolio</span>
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '50px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{ 
                background: 'transparent', border: 'none', color: activeCategory === cat ? 'var(--gold)' : 'var(--muted)', 
                fontSize: '16px', cursor: 'pointer', paddingBottom: '5px', 
                borderBottom: activeCategory === cat ? '2px solid var(--gold)' : '2px solid transparent' 
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {uniqueCards.map((item) => (
            <div key={item.category} style={{ borderRadius: '8px', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}>
              <Link to={`/portfolio/${item.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                <img src={item.mainImage} alt={item.category} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px' }}>
                  <p style={{ color: 'var(--gold)', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 5px' }}>{item.category}</p>
                  <h3 style={{ color: 'var(--white)', fontFamily: 'var(--heading-font)', fontSize: '28px', margin: 0 }}>{item.category === 'Wedding' ? 'Wedding Stories' : item.title}</h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}