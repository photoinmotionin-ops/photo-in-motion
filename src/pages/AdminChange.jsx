import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Upload, Loader2, Plus, Trash2, Edit2 } from 'lucide-react';

const CLOUDINARY_CLOUD_NAME = 'kwqsty9w';
const CLOUDINARY_UPLOAD_PRESET = 'portfolio_upload';

const CATEGORIES = ['Wedding', 'Birthday', 'Corporate', 'Pre-Wedding', 'Engagement'];

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
    portfolioItems: []
  };

  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [editingItem, setEditingItem] = useState(null);

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
          setContent({ ...defaultContent, ...data, portfolioItems: data.portfolioItems || [] });
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
        alert('Website updated successfully!');
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

  // --- PORTFOLIO MANAGEMENT LOGIC ---
  
  const handleAddNewItem = () => {
    const newItem = {
      id: Date.now().toString(),
      category: selectedCategory,
      title: 'New Event Title',
      description: 'Enter description here...',
      mainImage: '', // Main Poster
      galleryImages: [], // Array for related photos
      link: '/contact'
    };
    setContent(prev => ({
      ...prev,
      portfolioItems: [...prev.portfolioItems, newItem]
    }));
    setEditingItem(newItem);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  const handleUpdateItem = (key, value) => {
    setEditingItem(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveEdit = () => {
    setContent(prev => ({
      ...prev,
      portfolioItems: prev.portfolioItems.map(item => 
        item.id === editingItem.id ? editingItem : item
      )
    }));
    setEditingItem(null);
  };

  const handleRemoveItem = (id) => {
    if (window.confirm("Are you sure you want to delete this portfolio item?")) {
      setContent(prev => ({
        ...prev,
        portfolioItems: prev.portfolioItems.filter(item => item.id !== id)
      }));
    }
  };

  // Upload Main Poster
  const handleMainImageUpload = async (e) => {
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
      if (data.secure_url) handleUpdateItem('mainImage', data.secure_url);
    } catch (error) {
      alert('Error uploading image.');
    } finally {
      setUploading(false);
    }
  };

  // Upload to Gallery
  const handleGalleryImageUpload = async (e) => {
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
        setEditingItem(prev => ({
          ...prev,
          galleryImages: [...(prev.galleryImages || []), data.secure_url]
        }));
      }
    } catch (error) {
      alert('Error uploading image.');
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (indexToRemove) => {
    setEditingItem(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, index) => index !== indexToRemove)
    }));
  };

  const filteredItems = content.portfolioItems.filter(item => item.category === selectedCategory);

  if (loading) return <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: '100px' }}>
      
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', zIndex: 100, padding: '20px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={() => navigate('/admin/dashboard')} style={{ background: 'none', border: 'none', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        <button onClick={handleSave} disabled={saving || uploading} className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: saving || uploading ? 0.5 : 1 }}>
          {saving ? 'Saving...' : <><Save size={18} /> Save All Changes</>}
        </button>
      </div>

      <div style={{ paddingTop: '120px' }}>
        
        {/* ... Keep Hero and Intro sections identical ... */}
        <section className="hero" style={{ minHeight: 'auto', paddingBottom: '50px' }}>
          <div className="hero-overlay" />
          <div className="hero-content" style={{ zIndex: 10, position: 'relative' }}>
            <p className="eyebrow">WEDDING · EVENTS · CINEMATIC FILMS</p>
            <textarea value={content.heroTitle} onChange={(e) => handleChange('heroTitle', e.target.value)} style={{ ...heroTitleStyle, fontFamily: 'var(--heading-font)', fontSize: 'clamp(65px, 8vw, 112px)', color: 'var(--white)' }} rows={2} />
            <textarea value={content.heroSub} onChange={(e) => handleChange('heroSub', e.target.value)} style={{ ...heroDescStyle, color: 'var(--text)' }} rows={3} />
          </div>
        </section>

        <section className="intro-section" style={{ padding: '100px 10%' }}>
          <p className="eyebrow">MORE THAN JUST PHOTOGRAPHY</p>
          <textarea value={content.storyTitle} onChange={(e) => handleChange('storyTitle', e.target.value)} style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(48px, 6vw, 78px)', color: 'var(--white)', textAlign: 'center', width: '100%', marginBottom: '20px' }} rows={2} />
          <textarea value={content.storyText} onChange={(e) => handleChange('storyText', e.target.value)} style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--muted)', textAlign: 'center', fontSize: '15px', lineHeight: '2', display: 'block', width: '100%' }} rows={4} />
        </section>

        {/* --- PORTFOLIO MANAGER --- */}
        <section style={{ padding: '100px 10%', background: 'var(--bg-light)' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <p className="eyebrow">MANAGE EVENTS</p>
            <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(48px, 6vw, 78px)', fontWeight: 400, margin: 0 }}>Portfolio <span>Manager</span></h2>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '40px', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => { setSelectedCategory(cat); setEditingItem(null); }}
                style={{ padding: '10px 20px', borderRadius: '20px', border: 'none', background: selectedCategory === cat ? 'var(--gold)' : '#222', color: selectedCategory === cat ? '#000' : '#fff', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {filteredItems.map(item => (
              <div key={item.id} style={{ background: '#111', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333' }}>
                <img src={item.mainImage || 'https://via.placeholder.com/300'} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                <div style={{ padding: '20px' }}>
                  <h4 style={{ color: 'var(--white)', margin: '0 0 10px' }}>{item.title}</h4>
                  <p style={{ color: '#888', fontSize: '12px', marginBottom: '15px' }}>{item.category}</p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleEditItem(item)} style={{ flex: 1, padding: '10px', background: 'var(--gold)', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}><Edit2 size={16} /> Edit Event</button>
                    <button onClick={() => handleRemoveItem(item.id)} style={{ padding: '10px', background: 'rgba(255,0,0,0.2)', color: 'red', border: '1px solid red', borderRadius: '4px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
            
            <button 
              onClick={handleAddNewItem}
              style={{ background: 'rgba(255,255,255,0.05)', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', cursor: 'pointer', color: 'var(--gold)' }}
            >
              <Plus size={40} style={{ marginBottom: '10px' }} />
              <span>Add New {selectedCategory} Event</span>
            </button>
          </div>
        </section>

        {/* EDIT MODAL OVERLAY */}
        {editingItem && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: '#1a1a1a', padding: '40px', borderRadius: '16px', border: '1px solid var(--gold)', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
              <h3 style={{ color: 'var(--white)', marginBottom: '20px' }}>Edit Event: {editingItem.title}</h3>
              
              <label style={labelStyle}>Event Title</label>
              <input value={editingItem.title} onChange={(e) => handleUpdateItem('title', e.target.value)} style={inputStyle} />

              <label style={labelStyle}>Description</label>
              <textarea value={editingItem.description} onChange={(e) => handleUpdateItem('description', e.target.value)} style={{ ...inputStyle, height: '100px' }} />

              {/* MAIN POSTER */}
              <label style={labelStyle}>Main Poster (Cover)</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
                {editingItem.mainImage && <img src={editingItem.mainImage} alt="Main" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />}
                <label style={{ padding: '10px 15px', background: 'var(--gold)', color: '#000', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>
                  {uploading ? 'Uploading...' : 'Upload Cover Image'}
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleMainImageUpload} />
                </label>
              </div>

              {/* RELATED PHOTOS GALLERY */}
              <label style={labelStyle}>Related Photos (Gallery)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                {(editingItem.galleryImages || []).map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', width: '80px', height: '80px' }}>
                    <img src={img} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                    <button onClick={() => removeGalleryImage(idx)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: '#fff', border: 'none', borderRadius: '50%', padding: '2px 6px', cursor: 'pointer', fontSize: '10px' }}>X</button>
                  </div>
                ))}
                <label style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.1)', border: '1px dashed var(--gold)', borderRadius: '8px', cursor: 'pointer', color: 'var(--gold)' }}>
                  <Plus size={24} />
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleGalleryImageUpload} />
                </label>
              </div>

              <label style={labelStyle}>Redirect Link (For "Book This Event" button)</label>
              <input value={editingItem.link} onChange={(e) => handleUpdateItem('link', e.target.value)} style={inputStyle} placeholder="/contact" />

              <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                <button onClick={handleSaveEdit} className="primary-btn" style={{ flex: 1 }}>Save Changes</button>
                <button onClick={() => setEditingItem(null)} style={{ flex: 1, background: 'transparent', border: '1px solid #fff', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Inline styles
const labelStyle = { display: 'block', color: 'var(--gold)', marginBottom: '10px', fontSize: '14px', letterSpacing: '1px', marginTop: '20px' };
const inputStyle = { width: '100%', padding: '15px', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '15px', fontFamily: 'var(--body-font)', outline: 'none' };
const heroTitleStyle = { width: '100%', background: 'transparent', border: '1px dashed rgba(255,255,255,0.3)', padding: '10px', marginBottom: '20px', lineHeight: '0.98', letterSpacing: '-3px', resize: 'vertical' };
const heroDescStyle = { maxWidth: '460px', lineHeight: '1.9', fontSize: '13px', padding: '10px', resize: 'vertical', background: 'transparent', border: '1px dashed rgba(255,255,255,0.3)', width: '100%' };