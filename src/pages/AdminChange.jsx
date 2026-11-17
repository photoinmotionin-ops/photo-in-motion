import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Upload, Loader2, Plus, Trash2 } from 'lucide-react';

// ==========================================
// REPLACE THESE WITH YOUR CLOUDINARY DETAILS
// ==========================================
const CLOUDINARY_CLOUD_NAME = 'kwqsty9w'; // Your Cloud Name
const CLOUDINARY_UPLOAD_PRESET = 'portfolio_upload'; // Your Unsigned Preset Name
// ==========================================

export default function AdminChange() {
  const defaultContent = {
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
    showreelImg: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80',
    portfolioGallery: [] // Array for unlimited images
  };

  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
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
          setContent({ ...defaultContent, ...data, portfolioGallery: data.portfolioGallery || [] });
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
        alert('Website content updated successfully!');
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

  // Upload single image to Cloudinary
  const handleImageUpload = async (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      if (data.secure_url) {
        handleChange(key, data.secure_url);
      } else {
        alert('Failed to upload image.');
      }
    } catch (error) {
      alert('Error uploading image.');
    } finally {
      setUploading(false);
    }
  };

  // Upload multiple images to Gallery
  const handleGalleryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      if (data.secure_url) {
        setContent(prev => ({
          ...prev,
          portfolioGallery: [...prev.portfolioGallery, data.secure_url]
        }));
      }
    } catch (error) {
      alert('Error uploading image.');
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (indexToRemove) => {
    setContent(prev => ({
      ...prev,
      portfolioGallery: prev.portfolioGallery.filter((_, index) => index !== indexToRemove)
    }));
  };

  if (loading) return <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: '100px' }}>
      
      {/* FLOATING HEADER */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 100, padding: '20px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={() => navigate('/admin/dashboard')} style={{ background: 'none', border: 'none', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        <button onClick={handleSave} disabled={saving || uploading} className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: saving || uploading ? 0.5 : 1 }}>
          {saving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
        </button>
      </div>

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
              
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: uploading ? 'gray' : 'var(--gold)', color: '#000', padding: '10px 15px', borderRadius: '4px', cursor: uploading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                {uploading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={16} />} 
                {uploading ? 'Uploading...' : 'Upload Showreel Background'}
                <input 
                  type="file" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={(e) => handleImageUpload(e, 'showreelImg')} 
                  disabled={uploading}
                />
              </label>

            </div>
          </div>
        </section>

        {/* DYNAMIC PORTFOLIO GALLERY */}
        <section style={{ padding: '100px 10%', background: 'var(--bg-light)' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <p className="eyebrow">MANAGE PORTFOLIO</p>
            <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(48px, 6vw, 78px)', fontWeight: 400, margin: 0 }}>Add Unlimited <span>Images</span></h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {content.portfolioGallery.map((imgUrl, index) => (
              <div key={index} style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden' }}>
                <img src={imgUrl} alt={`Gallery ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button 
                  onClick={() => removeGalleryImage(index)}
                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,0,0,0.8)', color: '#fff', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '8px', cursor: uploading ? 'not-allowed' : 'pointer', aspectRatio: '1/1' }}>
              {uploading ? <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--gold)' }} /> : <Plus size={32} style={{ color: 'var(--gold)', marginBottom: '10px' }} />}
              <span style={{ color: 'var(--gold)', fontSize: '14px' }}>{uploading ? 'Uploading...' : 'Add New Image'}</span>
              <input 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={handleGalleryUpload} 
                disabled={uploading}
              />
            </label>
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
                  value={content[key] || ''} 
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

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

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