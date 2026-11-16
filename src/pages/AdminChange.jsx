import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Upload } from 'lucide-react';

export default function AdminChange() {
  const [content, setContent] = useState({
    heroTitle: 'Every Frame.\nA Timeless Story.',
    heroSub: "We don't just capture moments. We turn emotions, memories and beautiful stories into something that lasts forever.",
    storyTitle: 'Moments pass.\nStories stay forever.',
    storyText: 'At Photo In Motion, we believe every celebration has a story worth telling. Through thoughtful photography and cinematic filmmaking, we preserve the feelings behind every frame.',
    testimonial1: 'They captured the essence of our wedding perfectly.',
    testimonial2: 'The cinematic film they created for us is an absolute masterpiece.',
    testimonial3: 'Professional, unobtrusive, and incredibly talented.',
    img1: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85',
    img2: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85',
    img3: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
    showreelImg: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      navigate('/admin/login');
      return;
    }
    fetch('/api/enquiry?action=get_content')
      .then(res => res.json())
      .then(data => {
        if (Object.keys(data).length > 0) {
          setContent(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [navigate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_content', content })
      });
      
      if (res.ok) {
        alert('Website content and images updated successfully!');
      } else {
        alert('Failed to save changes.');
      }
    } catch (err) {
      alert('Network error.');
    }
    setSaving(false);
  };

  const handleChange = (key, value) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  // NEW FUNCTION: Convert local file to Base64
  const handleImageUpload = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Update the state with the Base64 string
        handleChange(key, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: '100px' }}>
      
      {/* FLOATING HEADER */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 100, padding: '20px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={() => navigate('/admin/dashboard')} style={{ background: 'none', border: 'none', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        <button onClick={handleSave} disabled={saving} className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {saving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
        </button>
      </div>

      {/* WYSIWYG EDITOR */}
      <div style={{ paddingTop: '120px' }}>
        
        {/* HERO SECTION */}
        <section className="hero" style={{ minHeight: 'auto', paddingBottom: '50px' }}>
          <div className="hero-overlay" />
          <div className="hero-content" style={{ zIndex: 10, position: 'relative' }}>
            <p className="eyebrow">WEDDING · EVENTS · CINEMATIC FILMS</p>
            <textarea 
              value={content.heroTitle} 
              onChange={(e) => handleChange('heroTitle', e.target.value)} 
              style={{ ...heroTitleStyle, fontFamily: 'var(--heading-font)', fontSize: 'clamp(65px, 8vw, 112px)', color: 'var(--white)' }} 
              rows={2}
            />
            <textarea 
              value={content.heroSub} 
              onChange={(e) => handleChange('heroSub', e.target.value)} 
              style={{ ...heroDescStyle, color: 'var(--text)' }} 
              rows={3}
            />
          </div>
        </section>

        {/* INTRODUCTION */}
        <section className="intro-section" style={{ padding: '100px 10%' }}>
          <p className="eyebrow">MORE THAN JUST PHOTOGRAPHY</p>
          <textarea 
            value={content.storyTitle} 
            onChange={(e) => handleChange('storyTitle', e.target.value)} 
            style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(48px, 6vw, 78px)', color: 'var(--white)', textAlign: 'center', width: '100%', marginBottom: '20px' }} 
            rows={2}
          />
          <textarea 
            value={content.storyText} 
            onChange={(e) => handleChange('storyText', e.target.value)} 
            style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--muted)', textAlign: 'center', fontSize: '15px', lineHeight: '2', display: 'block', width: '100%' }} 
            rows={4}
          />
        </section>

        {/* PORTFOLIO IMAGES */}
        <section className="portfolio-section" style={{ padding: '100px 10%', background: 'var(--bg-light)' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <p className="eyebrow">A COLLECTION OF MEMORIES</p>
            <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(48px, 6vw, 78px)', fontWeight: 400, margin: 0 }}>Selected <span>Stories</span></h2>
          </div>
          
          <div className="portfolio-grid">
            {[
              { key: 'img1', number: '01', title: 'Forever Begins' },
              { key: 'img2', number: '02', title: 'Beautiful Together' },
              { key: 'img3', number: '03', title: 'Beyond The Frame' }
            ].map((item) => (
              <div key={item.key} className="portfolio-card" style={{ backgroundImage: `url("${content[item.key]}")`, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                
                {/* IMAGE UPLOADER OVERLAY */}
                <div style={{ background: 'rgba(0,0,0,0.85)', padding: '20px', borderRadius: '8px', border: '1px solid var(--gold)', textAlign: 'center' }}>
                  <p style={{ color: 'var(--white)', marginBottom: '10px', fontSize: '14px' }}>Replace Image {item.number}</p>
                  
                  {/* File Input */}
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--gold)', color: '#000', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                    <Upload size={16} /> Upload from Computer
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={(e) => handleImageUpload(e, item.key)} 
                    />
                  </label>
                  
                  <p style={{ color: 'var(--muted)', fontSize: '11px', marginTop: '10px' }}>Or paste URL below</p>
                  <input 
                    type="text" 
                    value={content[item.key].startsWith('data:image') ? 'Local Image Uploaded' : content[item.key]} 
                    onChange={(e) => handleChange(item.key, e.target.value)} 
                    style={{ width: '100%', padding: '8px', background: '#111', border: '1px solid #333', color: '#fff', borderRadius: '4px', marginTop: '5px', fontSize: '12px' }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SHOWREEL IMAGE */}
        <section className="showreel-section" style={{ padding: '100px 10%', background: 'var(--bg)', textAlign: 'center' }}>
           <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p className="eyebrow">THE CINEMATIC EXPERIENCE</p>
            <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(48px, 6vw, 78px)', fontWeight: 400, margin: 0 }}>Watch Our <span>Showreel</span></h2>
          </div>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
               <img src={content.showreelImg} alt="Showreel" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '8px', marginTop: '20px', textAlign: 'center' }}>
              
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--gold)', color: '#000', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                <Upload size={16} /> Upload Showreel Background
                <input 
                  type="file" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={(e) => handleImageUpload(e, 'showreelImg')} 
                />
              </label>

            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="testimonials-section" style={{ padding: '100px 10%', background: 'var(--bg-light)', borderTop: '1px solid var(--border)' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <p className="eyebrow">CLIENT LOVE</p>
            <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(40px, 5vw, 60px)', fontWeight: 400, margin: 0 }}>Words From <span>Our Clients</span></h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            {['testimonial1', 'testimonial2', 'testimonial3'].map((key, index) => (
              <div key={key} style={{ background: 'rgba(255,255,255,0.02)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <textarea 
                  value={content[key]} 
                  onChange={(e) => handleChange(key, e.target.value)} 
                  style={{ width: '100%', background: 'transparent', border: '1px dashed rgba(255,255,255,0.3)', color: 'var(--text)', fontSize: '14px', lineHeight: '1.8', fontStyle: 'italic', resize: 'vertical' }} 
                  rows={4}
                />
                <h4 style={{ fontFamily: 'var(--heading-font)', fontSize: '20px', color: 'var(--white)', marginTop: '20px' }}>
                  {index === 0 ? 'Ananya & Rahul' : index === 1 ? 'Sarah & James' : 'Priya & Arjun'}
                </h4>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

const heroTitleStyle = {
  width: '100%',
  background: 'transparent',
  border: '1px dashed rgba(255,255,255,0.3)',
  padding: '10px',
  marginBottom: '20px',
  lineHeight: '0.98',
  letterSpacing: '-3px',
  resize: 'vertical'
};

const heroDescStyle = {
  maxWidth: '460px',
  lineHeight: '1.9',
  fontSize: '13px',
  padding: '10px',
  resize: 'vertical',
  background: 'transparent',
  border: '1px dashed rgba(255,255,255,0.3)',
  width: '100%'
};