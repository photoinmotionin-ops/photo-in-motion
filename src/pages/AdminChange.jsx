import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Upload, Loader2, Plus, Trash2, Edit2 } from 'lucide-react';

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
  const [editingClient, setEditingClient] = useState(null);

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
        alert('Website content updated successfully!');
      } else {
        const errData = await res.json();
        alert(`Failed to save: ${errData.message || 'Unknown error'}`);
      }
    } catch (err) {
      alert('Network error. The images might be too large to save. Try uploading smaller images.');
    }
    setSaving(false);
  };

  const handleChange = (key, value) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  // --- MULTI-CLIENT PORTFOLIO LOGIC ---

  const handleCreateClient = () => {
    const newClient = {
      id: Date.now().toString(),
      category: selectedCategory,
      title: 'New Client Event',
      description: 'Description...',
      mainImage: '',
      link: '/contact',
      subCategories: {
        'Engagement': [],
        'Pre-Wedding': [],
        'Mehendi & Haldi': [],
        'Marriage': [],
        'Reception': []
      }
    };
    setContent(prev => ({
      ...prev,
      portfolioItems: [...prev.portfolioItems, newClient]
    }));
    setEditingClient(newClient);
  };

  const handleUpdateClient = (key, value) => {
    setEditingClient(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveClient = () => {
    setContent(prev => ({
      ...prev,
      portfolioItems: prev.portfolioItems.map(item => 
        item.id === editingClient.id ? editingClient : item
      )
    }));
    setEditingClient(null);
  };

  const handleDeleteClient = (id) => {
    if (window.confirm("Are you sure you want to delete this client's portfolio?")) {
      setContent(prev => ({
        ...prev,
        portfolioItems: prev.portfolioItems.filter(item => item.id !== id)
      }));
    }
  };

  // UPDATED UPLOAD FUNCTION WITH SIZE LIMIT AND COMPRESSION
  const uploadToCloudinary = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    // This transformation forces the image to compress and resize if it's too large
    formData.append('transformation', 'q_auto:good,f_auto,w_1200');

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to upload image');
      }

      return data.secure_url;
    } catch (error) {
      alert(error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadToCloudinary(file);
    if (url) handleUpdateClient('mainImage', url);
  };

  const handleGalleryUpload = async (e, subCategory) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadToCloudinary(file);
    if (url) {
      setEditingClient(prev => ({
        ...prev,
        subCategories: {
          ...prev.subCategories,
          [subCategory]: [...prev.subCategories[subCategory], url]
        }
      }));
    }
  };

  const removeGalleryImage = (subCategory, indexToRemove) => {
    setEditingClient(prev => ({
      ...prev,
      subCategories: {
        ...prev.subCategories,
        [subCategory]: prev.subCategories[subCategory].filter((_, i) => i !== indexToRemove)
      }
    }));
  };

  const filteredClients = content.portfolioItems.filter(item => item.category === selectedCategory);

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
        
        {/* HOME CONTENT EDITOR */}
        <section style={{ padding: '50px 10%', background: 'var(--bg)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '32px', color: 'var(--white)', marginBottom: '30px' }}>Edit Homepage Content</h2>
            
            <label style={labelStyle}>Hero Title</label>
            <textarea value={content.heroTitle} onChange={(e) => handleChange('heroTitle', e.target.value)} style={{ ...inputStyle, height: '80px' }} />

            <label style={labelStyle}>Hero Description</label>
            <textarea value={content.heroSub} onChange={(e) => handleChange('heroSub', e.target.value)} style={{ ...inputStyle, height: '80px' }} />

            <label style={labelStyle}>Story Section Title</label>
            <textarea value={content.storyTitle} onChange={(e) => handleChange('storyTitle', e.target.value)} style={{ ...inputStyle, height: '80px' }} />

            <label style={labelStyle}>Story Section Description</label>
            <textarea value={content.storyText} onChange={(e) => handleChange('storyText', e.target.value)} style={{ ...inputStyle, height: '100px' }} />

            <label style={labelStyle}>Testimonial 1</label>
            <textarea value={content.testimonial1} onChange={(e) => handleChange('testimonial1', e.target.value)} style={{ ...inputStyle, height: '60px' }} />
            
            <label style={labelStyle}>Testimonial 2</label>
            <textarea value={content.testimonial2} onChange={(e) => handleChange('testimonial2', e.target.value)} style={{ ...inputStyle, height: '60px' }} />

            <label style={labelStyle}>Testimonial 3</label>
            <textarea value={content.testimonial3} onChange={(e) => handleChange('testimonial3', e.target.value)} style={{ ...inputStyle, height: '60px' }} />
          </div>
        </section>

        {/* MULTI-CLIENT PORTFOLIO MANAGER */}
        <section style={{ padding: '100px 10%', background: 'var(--bg-light)' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p className="eyebrow">MANAGE EVENTS</p>
            <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(48px, 6vw, 78px)', fontWeight: 400, margin: 0 }}>Portfolio <span>Manager</span></h2>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '50px' }}>
            {MAIN_CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => { setSelectedCategory(cat); setEditingClient(null); }}
                style={{ padding: '15px 30px', borderRadius: '30px', border: 'none', background: selectedCategory === cat ? 'var(--gold)' : '#222', color: selectedCategory === cat ? '#000' : '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* LIST OF CLIENTS */}
          {!editingClient && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
              {filteredClients.map(client => (
                <div key={client.id} style={{ background: '#111', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333' }}>
                  <img src={client.mainImage || 'https://via.placeholder.com/300'} alt={client.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                  <div style={{ padding: '20px' }}>
                    <h4 style={{ color: 'var(--white)', margin: '0 0 10px' }}>{client.title}</h4>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => setEditingClient(client)} style={{ flex: 1, padding: '10px', background: 'var(--gold)', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}><Edit2 size={16} /> Edit Client</button>
                      <button onClick={() => handleDeleteClient(client.id)} style={{ padding: '10px', background: 'rgba(255,0,0,0.2)', color: 'red', border: '1px solid red', borderRadius: '4px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={handleCreateClient}
                style={{ background: 'rgba(255,255,255,0.05)', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', cursor: 'pointer', color: 'var(--gold)' }}
              >
                <Plus size={40} style={{ marginBottom: '10px' }} />
                <span>Add New {selectedCategory} Client</span>
              </button>
            </div>
          )}

          {/* EDIT CLIENT FORM */}
          {editingClient && (
            <div style={{ maxWidth: '800px', margin: '0 auto', background: '#111', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <button onClick={() => setEditingClient(null)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', marginBottom: '20px' }}>← Back to List</button>
              <h3 style={{ color: 'var(--white)', fontFamily: 'var(--heading-font)', fontSize: '32px', marginBottom: '30px' }}>Editing Client: {editingClient.title}</h3>

              <label style={labelStyle}>Event Title</label>
              <input value={editingClient.title} onChange={(e) => handleUpdateClient('title', e.target.value)} style={inputStyle} />

              <label style={labelStyle}>Description</label>
              <textarea value={editingClient.description} onChange={(e) => handleUpdateClient('description', e.target.value)} style={{ ...inputStyle, height: '100px' }} />

              <label style={labelStyle}>Main Poster (Portfolio Grid)</label>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '30px' }}>
                {editingClient.mainImage && <img src={editingClient.mainImage} alt="Main" style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />}
                <label style={{ padding: '15px 25px', background: 'var(--gold)', color: '#000', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>
                  {uploading ? 'Uploading...' : 'Upload Cover Image'}
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleMainImageUpload} />
                </label>
              </div>

              <label style={labelStyle}>Gallery Images by Sub-Category</label>
              {WEDDING_SUB_CATEGORIES.map(subCat => (
                <div key={subCat} style={{ marginBottom: '20px', background: '#1a1a1a', padding: '20px', borderRadius: '8px' }}>
                  <h4 style={{ color: 'var(--gold)', marginBottom: '15px' }}>{subCat}</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {(editingClient.subCategories?.[subCat] || []).map((img, idx) => (
                      <div key={idx} style={{ position: 'relative', width: '100px', height: '100px' }}>
                        <img src={img} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                        <button onClick={() => removeGalleryImage(subCat, idx)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: '#fff', border: 'none', borderRadius: '50%', padding: '4px 8px', cursor: 'pointer', fontSize: '10px' }}>X</button>
                      </div>
                    ))}
                    <label style={{ width: '100px', height: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '2px dashed var(--gold)', borderRadius: '8px', cursor: 'pointer', color: 'var(--gold)' }}>
                      <Plus size={24} />
                      <span style={{ fontSize: '10px', marginTop: '5px' }}>Add Photo</span>
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleGalleryUpload(e, subCat)} />
                    </label>
                  </div>
                </div>
              ))}

              <button onClick={handleSaveClient} className="primary-btn" style={{ width: '100%', marginTop: '20px', padding: '15px' }}>Save This Client</button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', color: 'var(--gold)', marginBottom: '10px', fontSize: '14px', letterSpacing: '1px', marginTop: '20px' };
const inputStyle = { width: '100%', padding: '15px', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '15px', fontFamily: 'var(--body-font)', outline: 'none' };