import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, 
  Maximize2, X, Grid, SlidersHorizontal, Image as ImageIcon 
} from 'lucide-react';

const WEDDING_SUB_CATEGORIES = ['Engagement', 'Pre-Wedding', 'Mehendi & Haldi', 'Marriage', 'Reception'];

// FAST IMAGE OPTIMIZER: Compresses Cloudinary & Unsplash images on the fly to load in milliseconds
const getFastImageUrl = (url, width = 1000) => {
  if (!url) return 'https://via.placeholder.com/800x600';
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_limit/`);
  }
  if (url.includes('unsplash.com')) {
    return `${url}&w=${width}&auto=format&q=80`;
  }
  return url;
};

export default function PortfolioDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  // INSTANT LOAD FROM CACHE: Zero latency transition when coming from Portfolio
  const cachedClient = (() => {
    try {
      const stored = localStorage.getItem('pim_portfolio_cache');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.portfolioItems?.find(i => String(i.id) === String(id)) || null;
      }
      return null;
    } catch {
      return null;
    }
  })();

  const [client, setClient] = useState(cachedClient);
  const [activeTab, setActiveTab] = useState(WEDDING_SUB_CATEGORIES[0]);
  const [loading, setLoading] = useState(!cachedClient);
  
  // Interactive Slider State (avoids long scroll)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [detailViewMode, setDetailViewMode] = useState('carousel'); // 'carousel' or 'grid'

  // Touch Swipe coordinates for mobile
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Background fetch to ensure latest data is loaded
  useEffect(() => {
    let isMounted = true;
    fetch('/api/enquiry?action=get_content')
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        if (data.portfolioItems) {
          const found = data.portfolioItems.find(i => String(i.id) === String(id));
          if (found) setClient(found);
        }
        setLoading(false);
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [id]);

  // Reset photo index when switching tabs
  useEffect(() => {
    setSelectedPhotoIndex(0);
  }, [activeTab]);

  // Determine current active images
  const isWedding = client?.category?.toLowerCase() === 'wedding';
  const activeImages = isWedding
    ? (client?.subCategories?.[activeTab] || [])
    : (client?.subCategories ? Object.values(client.subCategories).flat() : []);

  const totalPhotos = activeImages.length;
  const currentPhoto = activeImages[selectedPhotoIndex] || activeImages[0];

  // Preload adjacent images so next/prev clicks are 100% instantaneous
  useEffect(() => {
    if (totalPhotos > 1) {
      const nextIdx = (selectedPhotoIndex + 1) % totalPhotos;
      const prevIdx = (selectedPhotoIndex - 1 + totalPhotos) % totalPhotos;
      [nextIdx, prevIdx].forEach(idx => {
        if (activeImages[idx]) {
          const img = new Image();
          img.src = getFastImageUrl(activeImages[idx], 1000);
        }
      });
    }
  }, [selectedPhotoIndex, totalPhotos, activeImages]);

  const nextPhoto = () => {
    if (totalPhotos > 0) setSelectedPhotoIndex((prev) => (prev + 1) % totalPhotos);
  };

  const prevPhoto = () => {
    if (totalPhotos > 0) setSelectedPhotoIndex((prev) => (prev - 1 + totalPhotos) % totalPhotos);
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 40) nextPhoto();
    else if (diff < -40) prevPhoto();
  };

  if (loading && !client) {
    return (
      <div style={{ color: 'var(--gold, #c6a46b)', padding: '150px 20px', textAlign: 'center', minHeight: '80vh', background: 'var(--bg, #101010)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid var(--gold, #c6a46b)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
        <p style={{ letterSpacing: '2px', fontSize: '13px', textTransform: 'uppercase' }}>Opening Gallery...</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div style={{ color: 'white', padding: '120px 20px', textAlign: 'center', minHeight: '70vh', background: 'var(--bg, #101010)' }}>
        <h2 style={{ fontFamily: 'var(--heading-font, serif)', fontSize: '32px', marginBottom: '16px' }}>Event Not Found</h2>
        <button onClick={() => navigate('/portfolio')} className="primary-btn">
          Back to Portfolio
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      style={{ minHeight: '100vh', background: 'var(--bg, #101010)', color: 'var(--white, #f4efe6)', paddingTop: '90px', paddingBottom: '80px' }}
    >
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 4%' }}>
        
        {/* Back Link */}
        <button 
          onClick={() => navigate('/portfolio')} 
          style={{ background: 'transparent', border: 'none', color: 'var(--gold, #c6a46b)', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, marginBottom: '24px' }}
        >
          <ArrowLeft size={18} /> Back to Portfolio
        </button>

        {/* HERO / CLIENT BANNER */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', alignItems: 'center', marginBottom: '40px', background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ width: '100%', aspectRatio: '16/10', borderRadius: '14px', overflow: 'hidden', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)' }}>
            <img 
              src={getFastImageUrl(client.mainImage, 800)} 
              alt={client.title} 
              loading="eager"
              decoding="async"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>

          <div>
            <span style={{ padding: '4px 10px', borderRadius: '4px', background: 'rgba(198, 164, 107, 0.15)', border: '1px solid rgba(198, 164, 107, 0.3)', color: 'var(--gold, #c6a46b)', fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              {client.category}
            </span>
            <h1 style={{ fontFamily: 'var(--heading-font, serif)', fontSize: 'clamp(30px, 4.5vw, 50px)', margin: '12px 0 10px', lineHeight: 1.1 }}>
              {client.title}
            </h1>
            <p style={{ color: 'var(--text, #d2cec8)', fontSize: '13px', lineHeight: 1.7, marginBottom: '25px', maxWidth: '500px' }}>
              {client.description || 'A timeless collection of frames immortalizing raw emotion and sacred rituals.'}
            </p>
            <Link to={client.link || '/contact'} className="primary-btn" style={{ padding: '12px 24px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Check Availability For Your Date <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        {/* SUB-CATEGORY SELECTOR FOR WEDDINGS */}
        {isWedding && (
          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
              
              {/* Horizontal Scrollable Tabs */}
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none', maxWidth: '100%' }}>
                {WEDDING_SUB_CATEGORIES.map(tab => {
                  const isActive = activeTab === tab;
                  const count = client.subCategories?.[tab]?.length || 0;
                  return (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{ 
                        padding: '8px 16px', 
                        borderRadius: '20px', 
                        border: isActive ? '1px solid var(--gold, #c6a46b)' : '1px solid rgba(255,255,255,0.1)',
                        background: isActive ? 'var(--gold, #c6a46b)' : 'rgba(255,255,255,0.03)', 
                        color: isActive ? '#000' : '#ccc', 
                        cursor: 'pointer', 
                        fontWeight: 600, 
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      {tab} <span style={{ opacity: 0.7, fontSize: '10px' }}>({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* View Mode Toggle: Interactive Carousel (Zero Scroll) vs Grid */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '8px' }}>
                <button
                  onClick={() => setDetailViewMode('carousel')}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '6px', border: 'none', background: detailViewMode === 'carousel' ? 'var(--gold, #c6a46b)' : 'transparent', color: detailViewMode === 'carousel' ? '#111' : '#aaa', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                >
                  <SlidersHorizontal size={13} /> Slider
                </button>
                <button
                  onClick={() => setDetailViewMode('grid')}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '6px', border: 'none', background: detailViewMode === 'grid' ? 'var(--gold, #c6a46b)' : 'transparent', color: detailViewMode === 'grid' ? '#111' : '#aaa', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                >
                  <Grid size={13} /> Grid
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* INTERACTIVE COMPACT SLIDER (NO LONG SCROLLING, FAST TOUCH) */}
        {/* ============================================================== */}
        {totalPhotos > 0 && detailViewMode === 'carousel' && (
          <div style={{ maxWidth: '980px', margin: '0 auto' }}>
            
            {/* Main Stage Image Viewer */}
            <div 
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ position: 'relative', width: '100%', aspectRatio: '16/10', maxHeight: '520px', background: '#050505', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentPhoto}
                  src={getFastImageUrl(currentPhoto, 1200)}
                  alt={`Moment ${selectedPhotoIndex + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  loading="eager"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </AnimatePresence>

              {/* Fullscreen Button */}
              <button
                onClick={() => setIsLightboxOpen(true)}
                style={{ position: 'absolute', top: '15px', right: '15px', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                title="Fullscreen Preview"
              >
                <Maximize2 size={16} />
              </button>

              {/* Prev / Next Arrows */}
              <button
                onClick={prevPhoto}
                style={{ position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextPhoto}
                style={{ position: 'absolute', top: '50%', right: '15px', transform: 'translateY(-50%)', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <ChevronRight size={20} />
              </button>

              {/* Bottom Counter */}
              <div style={{ position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', padding: '4px 14px', borderRadius: '20px', background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.15)', fontSize: '11px', fontFamily: 'monospace', color: 'var(--gold, #c6a46b)' }}>
                {selectedPhotoIndex + 1} / {totalPhotos}
              </div>
            </div>

            {/* Horizontal Mini Thumbnail Strip */}
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginTop: '16px', paddingBottom: '6px', scrollbarWidth: 'none' }}>
              {activeImages.map((img, idx) => {
                const isSelected = idx === selectedPhotoIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhotoIndex(idx)}
                    style={{
                      flex: '0 0 75px',
                      height: '52px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: isSelected ? '2px solid var(--gold, #c6a46b)' : '1px solid rgba(255,255,255,0.15)',
                      padding: 0,
                      cursor: 'pointer',
                      opacity: isSelected ? 1 : 0.5,
                      background: '#111'
                    }}
                  >
                    <img 
                      src={getFastImageUrl(img, 200)} 
                      alt={`thumb-${idx}`} 
                      loading="lazy"
                      decoding="async"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </button>
                );
              })}
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* COMPACT MASONRY / GRID VIEW */}
        {/* ============================================================== */}
        {totalPhotos > 0 && detailViewMode === 'grid' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {activeImages.map((img, index) => (
              <div 
                key={index} 
                onClick={() => { setSelectedPhotoIndex(index); setIsLightboxOpen(true); }}
                style={{ borderRadius: '10px', overflow: 'hidden', background: '#111', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', position: 'relative' }}
              >
                <img 
                  src={getFastImageUrl(img, 600)} 
                  alt={`Gallery ${index}`} 
                  style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} 
                  loading="lazy" 
                  decoding="async"
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {totalPhotos === 0 && (
          <div style={{ padding: '80px 20px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <ImageIcon size={36} color="var(--gold, #c6a46b)" style={{ opacity: 0.6, marginBottom: '12px' }} />
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted, #aaa)' }}>
              No photographs uploaded for this section yet.
            </p>
          </div>
        )}

      </div>

      {/* LIGHTBOX MODAL (FULLSCREEN) */}
      {isLightboxOpen && (
        <div 
          onClick={() => setIsLightboxOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.96)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          <button 
            onClick={() => setIsLightboxOpen(false)}
            style={{ position: 'absolute', top: '20px', right: '20px', width: '40px', height: '40px', borderRadius: '50%', background: '#222', border: '1px solid #444', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>

          <img 
            onClick={(e) => e.stopPropagation()}
            src={getFastImageUrl(currentPhoto, 1600)} 
            alt="Fullscreen view" 
            style={{ maxWidth: '95vw', maxHeight: '88vh', objectFit: 'contain', borderRadius: '8px' }} 
          />

          <button
            onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
            style={{ position: 'absolute', top: '50%', left: '20px', transform: 'translateY(-50%)', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: '1px solid #444', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <ChevronLeft size={26} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
            style={{ position: 'absolute', top: '50%', right: '20px', transform: 'translateY(-50%)', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: '1px solid #444', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <ChevronRight size={26} />
          </button>
        </div>
      )}
    </motion.div>
  );
}
