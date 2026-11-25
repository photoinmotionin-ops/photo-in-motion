import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Camera, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

// FAST IMAGE OPTIMIZER: Compresses Cloudinary & Unsplash images on the fly to load in milliseconds
const getFastImageUrl = (url, width = 600) => {
  if (!url) return 'https://via.placeholder.com/600x450';
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_limit/`);
  }
  if (url.includes('unsplash.com')) {
    return `${url}&w=${width}&auto=format&q=75`;
  }
  return url;
};

// SKELETON PLACEHOLDER COMPONENT (Renders immediately while loading so there is ZERO blank wait)
const SkeletonCard = () => (
  <div style={{ borderRadius: '12px', overflow: 'hidden', aspectRatio: '4/3', background: '#181818', position: 'relative' }}>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)', animation: 'shimmer 1.5s infinite' }} />
    <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px' }}>
      <div style={{ width: '60px', height: '10px', background: '#252525', borderRadius: '4px', marginBottom: '8px' }} />
      <div style={{ width: '160px', height: '18px', background: '#252525', borderRadius: '4px' }} />
    </div>
  </div>
);

export default function Portfolio() {
  // STALE-WHILE-REVALIDATE: Initialize directly from instant cache if user visited before
  const cachedData = (() => {
    try {
      const stored = localStorage.getItem('pim_portfolio_cache');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  const [portfolioItems, setPortfolioItems] = useState(cachedData?.portfolioItems || []);
  const [categories, setCategories] = useState(cachedData?.categories || ['Wedding', 'Birthday', 'Corporate']);
  const [loading, setLoading] = useState(!cachedData);
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Touch Swipe coordinates
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Responsive device check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Instant fast fetch with background revalidation & LocalStorage cache
  useEffect(() => {
    let isMounted = true;
    fetch('/api/enquiry?action=get_content')
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        if (data.portfolioItems) {
          setPortfolioItems(data.portfolioItems);
        }
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
        setLoading(false);
        // Cache instantly in localStorage for 0ms load next time
        try {
          localStorage.setItem('pim_portfolio_cache', JSON.stringify({
            portfolioItems: data.portfolioItems || [],
            categories: data.categories || ['Wedding', 'Birthday', 'Corporate']
          }));
        } catch (_) {}
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(0);
  }, [activeCategory]);

  const filteredItems = activeCategory === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  // Items per page: 3 on mobile (no vertical endless scroll), 6 on desktop
  const itemsPerPage = isMobile ? 3 : 6;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  
  const currentItems = filteredItems.slice(
    currentPage * itemsPerPage, 
    (currentPage + 1) * itemsPerPage
  );

  // Pre-load next page's images into browser cache so transitions feel instantaneous
  useEffect(() => {
    if (totalPages > 1) {
      const nextPage = (currentPage + 1) % totalPages;
      const nextPageItems = filteredItems.slice(nextPage * itemsPerPage, (nextPage + 1) * itemsPerPage);
      nextPageItems.forEach(item => {
        if (item.mainImage) {
          const img = new Image();
          img.src = getFastImageUrl(item.mainImage, 600);
        }
      });
    }
  }, [currentPage, totalPages, filteredItems, itemsPerPage]);

  // Timely Auto-changing with hover/touch pause
  useEffect(() => {
    if (totalPages <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 5500);
    return () => clearInterval(interval);
  }, [totalPages, activeCategory, isPaused]);

  // Touch Swipe handlers for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50 && totalPages > 1) {
      // Swiped Left -> Next page
      setCurrentPage((prev) => (prev + 1) % totalPages);
    } else if (diff < -50 && totalPages > 1) {
      // Swiped Right -> Prev page
      setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg, #101010)', color: 'var(--white, #f4efe6)' }}
    >
      <section style={{ padding: '20px 5% 80px', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* TITLE SECTION */}
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '30px', background: 'rgba(198, 164, 107, 0.1)', border: '1px solid rgba(198, 164, 107, 0.3)', color: 'var(--gold, #c6a46b)', fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
            <Sparkles size={13} /> A COLLECTION OF MEMORIES
          </div>
          <h1 style={{ fontFamily: 'var(--heading-font, serif)', fontSize: 'clamp(42px, 6vw, 76px)', fontWeight: 400, margin: 0, lineHeight: 1.05 }}>
            Our <span>Portfolio</span>
          </h1>
        </div>

        {/* DYNAMIC CATEGORY FILTERS */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '35px', flexWrap: 'wrap', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
          <button 
            onClick={() => setActiveCategory('All')}
            style={{ 
              background: activeCategory === 'All' ? 'var(--gold, #c6a46b)' : 'transparent', 
              border: '1px solid ' + (activeCategory === 'All' ? 'var(--gold, #c6a46b)' : 'rgba(255,255,255,0.12)'), 
              color: activeCategory === 'All' ? '#111' : 'var(--muted, #aaa)', 
              fontSize: '13px', 
              fontWeight: 600, 
              cursor: 'pointer', 
              padding: '7px 20px', 
              borderRadius: '25px',
              transition: 'all 0.25s'
            }}
          >
            All ({portfolioItems.length})
          </button>
          
          {categories.map(cat => {
            const count = portfolioItems.filter(i => i.category === cat).length;
            const isActive = activeCategory === cat;
            return (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{ 
                  background: isActive ? 'var(--gold, #c6a46b)' : 'transparent', 
                  border: '1px solid ' + (isActive ? 'var(--gold, #c6a46b)' : 'rgba(255,255,255,0.12)'), 
                  color: isActive ? '#111' : 'var(--muted, #aaa)', 
                  fontSize: '13px', 
                  fontWeight: 600, 
                  cursor: 'pointer', 
                  padding: '7px 18px', 
                  borderRadius: '25px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.25s'
                }}
              >
                {cat} {count > 0 && <span style={{ opacity: 0.7, fontSize: '11px' }}>({count})</span>}
              </button>
            );
          })}
        </div>

        {/* MAIN DISPLAY AREA */}
        <div 
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ position: 'relative', width: '100%', minHeight: isMobile ? '450px' : '520px' }}
        >
          {loading ? (
            /* INSTANT SKELETON GRID WHILE DATA INITIALIZES */
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '20px', width: '100%' }}>
              {Array.from({ length: itemsPerPage }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            /* COMING SOON EMPTY STATE */
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '360px',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.02)',
                border: '1px dashed var(--gold, #c6a46b)',
                borderRadius: '16px',
                padding: '40px 20px'
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.08, 1], rotate: [0, 4, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: 'rgba(198, 164, 107, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold, #c6a46b)',
                  marginBottom: '16px'
                }}
              >
                <Camera size={34} strokeWidth={1.5} />
              </motion.div>
              
              <h3 style={{ fontFamily: 'var(--heading-font, serif)', fontSize: '28px', color: 'var(--white, #f4efe6)', margin: '0 0 8px' }}>
                Coming Soon
              </h3>
              <p style={{ color: 'var(--muted, #aaa)', fontSize: '14px', maxWidth: '400px', lineHeight: '1.7', margin: 0 }}>
                We are currently curating our finest {activeCategory !== 'All' ? activeCategory : ''} moments for this collection. Please check back soon!
              </p>
            </motion.div>
          ) : (
            /* TIME-CYCLE ANIMATED GRID (AVOIDS LONG SCROLL) */
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCategory}-${currentPage}`}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
                  gap: '20px',
                  width: '100%'
                }}
              >
                {currentItems.map((item) => (
                  <Link to={`/portfolio/${item.id}`} key={item.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <motion.div 
                      whileHover={{ y: -6 }}
                      style={{ 
                        borderRadius: '14px', 
                        overflow: 'hidden', 
                        position: 'relative', 
                        cursor: 'pointer',
                        aspectRatio: '4/3',
                        background: '#121212',
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                      }}
                    >
                      {/* High-speed optimized image with decoding & lazy loading */}
                      <img 
                        src={getFastImageUrl(item.mainImage, 600)} 
                        alt={item.title} 
                        loading="lazy"
                        decoding="async"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.88, transition: 'transform 0.5s ease' }} 
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                      
                      {/* Gradient Vignette & Text Overlay */}
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px' }}>
                        
                        <span style={{ color: 'var(--gold, #c6a46b)', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 4px', background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: '4px', alignSelf: 'flex-start' }}>
                          {item.category}
                        </span>
                        
                        <h3 style={{ color: 'var(--white, #f4efe6)', fontFamily: 'var(--heading-font, serif)', fontSize: '22px', margin: '0 0 6px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.title}
                        </h3>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--gold, #c6a46b)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                          Explore Album <ArrowUpRight size={13} />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* SLICK NAVIGATION CONTROLS (PAGINATION DOTS + NEXT/PREV ARROWS) */}
        {filteredItems.length > 0 && totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '35px', padding: '0 10px' }}>
            
            {/* Prev Arrow */}
            <button
              onClick={() => setCurrentPage(prev => (prev - 1 + totalPages) % totalPages)}
              style={{ background: '#181818', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
              title="Previous Page"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Pagination Dots with Active Pulse Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  style={{
                    width: currentPage === idx ? '22px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: currentPage === idx ? 'var(--gold, #c6a46b)' : 'rgba(255,255,255,0.2)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    padding: 0
                  }}
                  title={`Page ${idx + 1}`}
                />
              ))}
            </div>

            {/* Next Arrow */}
            <button
              onClick={() => setCurrentPage(prev => (prev + 1) % totalPages)}
              style={{ background: '#181818', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
              title="Next Page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Mobile Swipe Hint */}
        {isMobile && totalPages > 1 && (
          <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--muted, #aaa)', marginTop: '12px' }}>
            ← Swipe to view more stories →
          </p>
        )}

      </section>
    </motion.div>
  );
}
