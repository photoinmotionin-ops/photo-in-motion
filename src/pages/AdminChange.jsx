import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Upload, Loader2, Plus, Trash2 } from 'lucide-react';

const CLOUDINARY_CLOUD_NAME = 'kwqsty9w';
const CLOUDINARY_UPLOAD_PRESET = 'portfolio_upload';

const MAIN_CATEGORIES = ['Wedding', 'Birthday', 'Corporate'];
const WEDDING_SUB_CATEGORIES = ['Engagement', 'Pre-Wedding', 'Mehendi & Haldi', 'Marriage', 'Reception'];

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
  
  const [selectedCategory, setSelectedCategory] = useState(MAIN_CATEGORIES[0]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(WEDDING_SUB_CATEGORIES[0]);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = () => {
    fetch('/api/enquiry?action=get_content')
      .then(res => res.json())
      .then(data => {
        if (Object.keys(data).length > 0) {
          setContent({ ...defaultContent, ...data, portfolioItems: data.portfolioItems || [] });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

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
        // RESET THE FIELDS AFTER SAVE
        setContent(defaultContent);
        fetchData(); // Re-fetch to ensure fresh state
      } else {
        alert('Failed to save changes.');
      }
    } catch (err) {
      alert('Network error.');
    }
    setSaving(false);
  };

  const getActiveItem = () => {
    return content.portfolioItems.find(
      item => item.category === selectedCategory && 
      (selectedCategory === 'Wedding' ? item.subCategory === selectedSubCategory : true)
    );
  };

  const updateActiveItem = (updates) => {
    setContent(prev => {
      const existingItemIndex = prev.portfolioItems.findIndex(
        item => item.category === selectedCategory && 
        (selectedCategory === 'Wedding' ? item.subCategory === selectedSubCategory : true)
      );

      let newItems = [...prev.portfolioItems];

      if (existingItemIndex >= 0) {
        newItems[existingItemIndex] = { ...newItems[existingItemIndex], ...updates };
      } else {
        newItems.push({
          id: Date.now().toString(),
          category: selectedCategory,
          subCategory: selectedCategory === 'Wedding' ? selectedSubCategory : '',
          title: '',
          description: '',
          mainImage: '',
          galleryImages: [],
          link: '/contact',
          ...updates
        });
      }
      return { ...prev, portfolioItems: newItems };
    });
  };

  const currentItem = getActiveItem();

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
      if (data.secure_url) updateActiveItem({ mainImage: data.secure_url });
    } finally {
      setUploading(false);
    }
  };

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
        const currentImages = currentItem?.galleryImages || [];
        updateActiveItem({ galleryImages: [...currentImages, data.secure_url] });
      }
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (indexToRemove) => {
    if (!currentItem) return;
    const newImages = currentItem.galleryImages.filter((_, index) => index !== indexToRemove);
    updateActiveItem({ galleryImages: newImages });
  };

  if (loading) return <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: '100px' }}>
      
      {/* HEADER */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', zIndex: 100, padding: '20px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={() => navigate('/admin/dashboard')} style={{ background: 'none', border: 'none', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        <button onClick={handleSave} disabled={saving || uploading} className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: saving || uploading ? 0.5 : 1 }}>
          {saving ? 'Saving...' : <><Save size={18} /> Save All Changes</>}
        </button>
      </div>

      <div style={{ paddingTop: '120px' }}>
        <section style={{ padding: '50px 10%', background: 'var(--bg-light)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p className="eyebrow">MANAGE EVENTS</p>
            <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(48px, 6vw, 78px)', fontWeight: 400, margin: 0 }}>Portfolio <span>Manager</span></h2>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '30px' }}>
            {MAIN_CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => { setSelectedCategory(cat); setSelectedSubCategory(WEDDING_SUB_CATEGORIES[0]); }}
                style={{ padding: '15px 30px', borderRadius: '30px', border: 'none', background: selectedCategory === cat ? 'var(--gold)' : '#222', color: selectedCategory === cat ? '#000' : '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {selectedCategory === 'Wedding' && (
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '50px', flexWrap: 'wrap' }}>
              {WEDDING_SUB_CATEGORIES.map(sub => (
                <button 
                  key={sub}
                  onClick={() => setSelectedSubCategory(sub)}
                  style={{ padding: '10px 20px', borderRadius: '20px', border: `1px solid ${selectedSubCategory === sub ? 'var(--gold)' : '#444'}`, background: selectedSubCategory === sub ? 'rgba(198, 164, 107, 0.2)' : 'transparent', color: selectedSubCategory === sub ? 'var(--gold)' : '#888', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}

          <div style={{ maxWidth: '800px', margin: '0 auto', background: '#111', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)' }}>
            
            <h3 style={{ color: 'var(--white)', fontFamily: 'var(--heading-font)', fontSize: '32px', marginBottom: '30px' }}>
              Editing: {selectedCategory} {selectedCategory === 'Wedding' ? `- ${selectedSubCategory}` : ''}
            </h3>

            <label style={labelStyle}>Event Title</label>
            <input value={currentItem?.title || ''} onChange={(e) => updateActiveItem({ title: e.target.value })} style={inputStyle} placeholder="Enter title here..." />

            <label style={labelStyle}>Description</label>
            <textarea value={currentItem?.description || ''} onChange={(e) => updateActiveItem({ description: e.target.value })} style={{ ...inputStyle, height: '100px' }} placeholder="Enter description here..." />

            <label style={labelStyle}>Main Poster (This will show on the Portfolio Grid)</label>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '30px' }}>
              {currentItem?.mainImage ? (
                <img src={currentItem.mainImage} alt="Main" style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
              ) : (
                <div style={{ width: '150px', height: '150px', background: '#222', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>No Image</div>
              )}
              <label style={{ padding: '15px 25px', background: 'var(--gold)', color: '#000', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>
                {uploading ? 'Uploading...' : 'Upload Cover Image'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleMainImageUpload} />
              </label>
            </div>

            <label style={labelStyle}>Related Photos (Gallery for this section)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '30px' }}>
              {(currentItem?.galleryImages || []).map((img, idx) => (
                <div key={idx} style={{ position: 'relative', width: '100px', height: '100px' }}>
                  <img src={img} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                  <button onClick={() => removeGalleryImage(idx)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: '#fff', border: 'none', borderRadius: '50%', padding: '4px 8px', cursor: 'pointer', fontSize: '10px' }}>X</button>
                </div>
              ))}
              
              <label style={{ width: '100px', height: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '2px dashed var(--gold)', borderRadius: '8px', cursor: 'pointer', color: 'var(--gold)' }}>
                <Plus size={24} />
                <span style={{ fontSize: '10px', marginTop: '5px' }}>Add Photo</span>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleGalleryImageUpload} />
              </label>
            </div>

            <label style={labelStyle}>Redirect Link (For "Book This Event" button)</label>
            <input value={currentItem?.link || ''} onChange={(e) => updateActiveItem({ link: e.target.value })} style={inputStyle} placeholder="/contact" />

          </div>
        </section>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', color: 'var(--gold)', marginBottom: '10px', fontSize: '14px', letterSpacing: '1px', marginTop: '20px' };
const inputStyle = { width: '100%', padding: '15px', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '15px', fontFamily: 'var(--body-font)', outline: 'none' };