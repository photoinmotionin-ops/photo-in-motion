import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

const WEDDING_SUB_CATEGORIES = ['Engagement', 'Pre-Wedding', 'Mehendi & Haldi', 'Marriage', 'Reception'];

export default function PortfolioDetail() {
  const { id } = useParams(); 
  const [mainItem, setMainItem] = useState(null);
  const [weddingItems, setWeddingItems] = useState([]);
  const [activeTab, setActiveTab] = useState(WEDDING_SUB_CATEGORIES[0]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/enquiry?action=get_content')
      .then(res => res.json())
      .then(data => {
        if (data.portfolioItems) {
          const foundItem = data.portfolioItems.find(i => String(i.id) === String(id));
          
          if (foundItem) {
            setMainItem(foundItem);
            if (foundItem.category === 'Wedding') {
              const allWeddings = data.portfolioItems.filter(i => i.category === 'Wedding');
              setWeddingItems(allWeddings);
            }
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Auto-Switch Tabs
  useEffect(() => {
    if (mainItem?.category === 'Wedding') {
      const interval = setInterval(() => {
        setActiveTab(prevTab => {
          const currentIndex = WEDDING_SUB_CATEGORIES.indexOf(prevTab);
          const nextIndex = (currentIndex + 1) % WEDDING_SUB_CATEGORIES.length;
          return WEDDING_SUB_CATEGORIES[nextIndex];
        });
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [mainItem]);

  if (loading) return <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>Loading...</div>;
  
  if (!mainItem) return (
    <div style={{ color: 'white', padding: '100px', textAlign: 'center', minHeight: '100vh' }}>
      <h2>Event not found</h2>
      <Link to="/portfolio" className="primary-btn" style={{ marginTop: '20px' }}>Back to Portfolio</Link>
    </div>
  );

  const activeImages = weddingItems.filter(item => item.subCategory === activeTab).flatMap(item => item.galleryImages || []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: '100px' }}>
      <div style={{ padding: '20px 10%' }}>
        <button onClick={() => navigate('/portfolio')} style={{ background: 'transparent', border: 'none', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '16px', marginBottom: '30px' }}>
          <ArrowLeft size={20} /> Back to Portfolio
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', maxWidth: '1000px', margin: '0 auto' }}>
          
          <div style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <img src={mainItem.mainImage} alt={mainItem.category} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>

          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p className="eyebrow" style={{ color: 'var(--gold)' }}>{mainItem.category.toUpperCase()}</p>
            <h1 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(48px, 6vw, 78px)', color: 'var(--white)', margin: '0 0 20px' }}>
              {mainItem.category === 'Wedding' ? 'Wedding Stories' : mainItem.title}
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '16px', lineHeight: '1.8', maxWidth: '700px', margin: '0 auto 40px' }}>
              {mainItem.description}
            </p>
            <Link to={mainItem.link || '/contact'} className="primary-btn" style={{ padding: '15px 30px', fontSize: '14px' }}>
              Book This Type of Event <ArrowUpRight size={18} />
            </Link>
          </div>

          {mainItem.category === 'Wedding' && (
            <div style={{ marginTop: '40px' }}>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '40px', flexWrap: 'wrap' }}>
                {WEDDING_SUB_CATEGORIES.map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{ 
                      padding: '10px 20px', borderRadius: '20px', border: 'none',
                      background: activeTab === tab ? 'var(--gold)' : '#222', 
                      color: activeTab === tab ? '#000' : '#fff', 
                      cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '32px', color: 'var(--white)', textAlign: 'center', marginBottom: '30px' }}>
                  {activeTab} <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Moments</span>
                </h3>

                {activeImages.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                    {activeImages.map((img, index) => (
                      <div key={index} style={{ borderRadius: '8px', overflow: 'hidden' }}>
                        <img src={img} alt={`Gallery ${index}`} style={{ width: '100%', height: 'auto', display: 'block' }} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ textAlign: 'center', color: 'var(--muted)' }}>No photos added for this section yet.</p>
                )}
              </motion.div>
            </div>
          )}
          
          {mainItem.category !== 'Wedding' && mainItem.galleryImages && mainItem.galleryImages.length > 0 && (
            <div style={{ marginTop: '40px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                {mainItem.galleryImages.map((img, index) => (
                  <div key={index} style={{ borderRadius: '8px', overflow: 'hidden' }}>
                    <img src={img} alt={`Gallery ${index}`} style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}