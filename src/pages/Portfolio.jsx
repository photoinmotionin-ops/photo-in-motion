import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Camera } from 'lucide-react';

export default function Portfolio() {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [categories, setCategories] = useState(['Wedding', 'Birthday', 'Corporate']);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetch('/api/enquiry?action=get_content')
      .then(res => res.json())
      .then(data => {
        if (data.portfolioItems) {
          setPortfolioItems(data.portfolioItems);
        }
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [activeCategory]);

  const filteredItems = activeCategory === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  const itemsPerPage = isMobile ? 3 : 6;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  
  const currentItems = filteredItems.slice(
    currentPage * itemsPerPage, 
    (currentPage + 1) * itemsPerPage
  );

  useEffect(() => {
    if (totalPages <= 1) return;
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalPages, activeCategory]);

  if (loading) {
    return (
      <div style={{ color: 'white', padding: '100px', textAlign: 'center', minHeight: '100vh', background: 'var(--bg)' }}>
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
          Loading Gallery...
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ paddingTop: '120px', minHeight: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      
      <section style={{ padding: '0 5% 80px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p className="eyebrow">A COLLECTION OF MEMORIES</p>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(48px, 6vw, 78px)', fontWeight: 400, margin: 0 }}>
            Our <span>Portfolio</span>
          </h2>
        </div>

        {/* DYNAMIC CATEGORY FILTERS */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '40px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveCategory('All')}
            style={{ 
              background: 'transparent', border: '1px solid ' + (activeCategory === 'All' ? 'var(--gold)' : 'rgba(255,255,255,0.1)'), 
              color: activeCategory === 'All' ? 'var(--gold)' : 'var(--muted)', 
              fontSize: '14px', cursor: 'pointer', padding: '8px 20px', borderRadius: '20px',
              transition: 'all 0.3s'
            }}
          >
            All
          </button>
          
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{ 
                background: 'transparent', border: '1px solid ' + (activeCategory === cat ? 'var(--gold)' : 'rgba(255,255,255,0.1)'), 
                color: activeCategory === cat ? 'var(--gold)' : 'var(--muted)', 
                fontSize: '14px', cursor: 'pointer', padding: '8px 20px', borderRadius: '20px',
                transition: 'all 0.3s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* MAIN GRID OR EMPTY STATE */}
        <div style={{ position: 'relative', minHeight: isMobile ? '600px' : '750px', maxWidth: '1400px', margin: '0 auto' }}>
          
          {filteredItems.length === 0 ? (
            
            /* THE COMING SOON EMPTY STATE */
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                minHeight: '400px',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.02)',
                border: '1px dashed var(--gold)',
                borderRadius: '16px',
                padding: '40px'
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(198, 164, 107, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold)',
                  marginBottom: '20px'
                }}
              >
                <Camera size={40} strokeWidth={1.5} />
              </motion.div>
              
              <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '32px', color: 'var(--white)', margin: '0 0 10px' }}>
                Coming Soon
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '15px', maxWidth: '400px', lineHeight: '1.8' }}>
                We are currently curating our finest {activeCategory !== 'All' ? activeCategory : ''} moments for this collection. Please check back soon!
              </p>
            </motion.div>

          ) : (
            
            /* THE ACTUAL PORTFOLIO GRID */
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
                  gap: '20px',
                  width: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
              >
                {currentItems.map((item) => (
                  <Link to={`/portfolio/${item.id}`} key={item.id} style={{ textDecoration: 'none' }}>
                    <motion.div 
                      whileHover="hover"
                      style={{ 
                        borderRadius: '12px', 
                        overflow: 'hidden', 
                        position: 'relative', 
                        cursor: 'pointer',
                        aspectRatio: '4/3',
                        background: '#111'
                      }}
                    >
                      <motion.img 
                        src={item.mainImage} 
                        alt={item.title} 
                        variants={{ hover: { scale: 1.08 } }}
                        transition={{ duration: 0.4 }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.8 }} 
                      />
                      
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent 60%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '25px' }}>
                        
                        <motion.div 
                          variants={{ hover: { opacity: 1 } }}
                          initial={{ opacity: 0 }}
                          style={{ position: 'absolute', inset: '10px', border: '1px solid var(--gold)', borderRadius: '8px', pointerEvents: 'none' }}
                        />

                        <p style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 5px' }}>
                          {item.category}
                        </p>
                        <h3 style={{ color: 'var(--white)', fontFamily: 'var(--heading-font)', fontSize: '26px', margin: '0 0 10px' }}>
                          {item.title}
                        </h3>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--gold)', marginTop: '10px', fontSize: '12px', fontWeight: 600 }}>
                          Explore Story <ArrowUpRight size={14} />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </motion.div>
            </AnimatePresence>

          )}
        </div>

        {/* Pagination Dots (Only show if items exist) */}
        {filteredItems.length > 0 && totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '40px', position: 'relative', zIndex: 10 }}>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: currentPage === idx ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  padding: 0
                }}
              />
            ))}
          </div>
        )}
      </section>
    </motion.div>
  );
}