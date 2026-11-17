import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Portfolio() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/enquiry?action=get_content')
      .then(res => res.json())
      .then(data => {
        if (data.portfolioGallery) {
          setGallery(data.portfolioGallery);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>Loading Gallery...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ paddingTop: '120px', minHeight: '100vh', background: 'var(--bg)' }}>
      
      <section style={{ padding: '40px 10% 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p className="eyebrow">A COLLECTION OF MEMORIES</p>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(48px, 6vw, 78px)', fontWeight: 400, margin: 0 }}>
            The Full <span>Gallery</span>
          </h2>
        </div>

        {/* MASONRY GRID */}
        <div style={{ columnCount: 3, columnGap: '20px', width: '100%' }}>
          {gallery.map((img, index) => (
            <div key={index} style={{ breakInside: 'avoid', marginBottom: '20px', borderRadius: '8px', overflow: 'hidden' }}>
              <img src={img} alt={`Gallery ${index}`} style={{ width: '100%', display: 'block', transition: 'transform 0.3s' }} />
            </div>
          ))}
        </div>
        
        {gallery.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--muted)' }}>No images in the gallery yet. Add some in the Admin Panel!</p>
        )}
      </section>
    </motion.div>
  );
}