import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, ArrowLeft, Upload, Loader2, Plus, Trash2, Edit2, 
  Image as ImageIcon, Film, MessageSquare, Layout, Sparkles 
} from 'lucide-react';

const CLOUDINARY_CLOUD_NAME = 'kwqsty9w';
const CLOUDINARY_UPLOAD_PRESET = 'portfolio_upload';

const WEDDING_SUB_CATEGORIES = ['Engagement', 'Pre-Wedding', 'Mehendi & Haldi', 'Marriage', 'Reception'];

export default function AdminChange() {
  const defaultContent = {
    // Hero & Story
    heroTitle: 'Every Frame.\nA Timeless Story.',
    heroSub: "We don't just capture moments. We turn emotions, memories and beautiful stories into something that lasts forever.",
    storyTitle: 'Moments pass.\nStories stay forever.',
    storyText: 'At Photo In Motion, we believe every celebration has a story worth telling. Through thoughtful photography and cinematic filmmaking, we preserve the feelings behind every frame.',
    
    // Featured Works Images & Titles
    img1: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85',
    img1Title: 'Forever Begins',
    img1Category: 'WEDDINGS',
    img2: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85',
    img2Title: 'Beautiful Together',
    img2Category: 'CELEBRATIONS',
    img3: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
    img3Title: 'Beyond The Frame',
    img3Category: 'CINEMATIC FILMS',
    
    // Showreel Poster Image
    showreelImg: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80',
    
    // 6 Testimonials & Names
    testimonial1: 'They captured the essence of our wedding perfectly.',
    testimonial1Name: 'Ananya & Rahul',
    testimonial2: 'The cinematic film they created for us is an absolute masterpiece.',
    testimonial2Name: 'Sarah & James',
    testimonial3: 'Professional, unobtrusive, and incredibly talented.',
    testimonial3Name: 'Priya & Arjun',
    testimonial4: "Every frame was a work of art. We couldn't be happier.",
    testimonial4Name: 'Neha & Vikram',
    testimonial5: 'They turned our special day into a cinematic experience.',
    testimonial5Name: 'Riya & Karan',
    testimonial6: 'The attention to detail was flawless. Highly recommended!',
    testimonial6Name: 'Simran & Aditya',
    
    // Portfolio & Events
    portfolioItems: [],
    categories: ['Wedding', 'Birthday', 'Corporate'],
    eventTypes: ['Wedding', 'Baby Shower', 'Post Wedding', 'Car Delivery', 'Others']
  };

  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'portfolio' | 'events'
  
  const [selectedCategory, setSelectedCategory] = useState('Wedding');
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
        if (data && Object.keys(data).length > 0) {
          const safeCategories = data.categories && data.categories.length > 0 ? data.categories : defaultContent.categories;
          const safeEventTypes = data.eventTypes && data.eventTypes.length > 0 ? data.eventTypes : defaultContent.eventTypes;
          setContent({ 
            ...defaultContent, 
            ...data, 
            portfolioItems: data.portfolioItems || [], 
            categories: safeCategories, 
            eventTypes: safeEventTypes 
          });
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
      alert('Network error. The images might be too large to save.');
    }
    setSaving(false);
  };

  const handleChange = (key, value) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  const uploadToCloudinary = async (file) => {
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
      if (!res.ok) throw new Error(data.error?.message || 'Failed to upload image');
      return data.secure_url;
    } catch (error) {
      alert(error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Generic image upload for homepage images (img1, img2, img3, showreelImg)
  const handleHomeImageUpload = async (e, key) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadToCloudinary(file);
    if (url) handleChange(key, url);
  };

  // --- EVENT TYPE MANAGEMENT ---
  const handleAddEventType = () => {
    const newType = prompt("Enter new Event Type (e.g., Anniversary):");
    if (newType && !content.eventTypes.includes(newType)) {
      setContent(prev => {
        const typesWithoutOthers = prev.eventTypes.filter(t => t !== 'Others');
        const updatedTypes = [...typesWithoutOthers, newType];
        return {
          ...prev,
          eventTypes: [...updatedTypes, 'Others']
        };
      });
    }
  };

  const handleDeleteEventType = (typeToRemove) => {
    if (typeToRemove === 'Others') {
      alert("The 'Others' option cannot be deleted. It is a mandatory fallback.");
      return;
    }
    setContent(prev => ({
      ...prev,
      eventTypes: prev.eventTypes.filter(t => t !== typeToRemove)
    }));
  };

  // --- CATEGORY MANAGEMENT ---
  const handleAddCategory = () => {
    const newCat = prompt("Enter new category name (e.g., Car Inauguration):");
    if (newCat && !content.categories.includes(newCat)) {
      setContent(prev => ({
        ...prev,
        categories: [...prev.categories, newCat]
      }));
      setSelectedCategory(newCat);
    }
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
      subCategories: selectedCategory === 'Wedding' ? {
        'Engagement': [], 'Pre-Wedding': [], 'Mehendi & Haldi': [], 'Marriage': [], 'Reception': []
      } : {}
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
      if (selectedCategory === 'Wedding') {
        setEditingClient(prev => ({
          ...prev,
          subCategories: {
            ...prev.subCategories,
            [subCategory]: [...(prev.subCategories?.[subCategory] || []), url]
          }
        }));
      } else {
        setEditingClient(prev => ({
          ...prev,
          subCategories: {
            ...prev.subCategories,
            'General': [...(prev.subCategories?.General || []), url]
          }
        }));
      }
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
    <div style={{ minHeight: '100vh', background: 'var(--bg, #0a0a0a)', paddingBottom: '100px' }}>
      
      {/* FIXED HEADER */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(10px)', zIndex: 100, padding: '18px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={() => navigate('/admin/dashboard')} style={{ background: 'none', border: 'none', color: 'var(--gold, #c6a46b)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' }}>
          <ArrowLeft size={18} /> Dashboard
        </button>
        
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', background: '#161616', padding: '4px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <button 
            onClick={() => setActiveTab('home')} 
            style={{ padding: '8px 18px', borderRadius: '25px', border: 'none', background: activeTab === 'home' ? 'var(--gold, #c6a46b)' : 'transparent', color: activeTab === 'home' ? '#000' : '#aaa', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
          >
            Homepage Content & Media
          </button>
          <button 
            onClick={() => setActiveTab('portfolio')} 
            style={{ padding: '8px 18px', borderRadius: '25px', border: 'none', background: activeTab === 'portfolio' ? 'var(--gold, #c6a46b)' : 'transparent', color: activeTab === 'portfolio' ? '#000' : '#aaa', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
          >
            Portfolio Manager
          </button>
          <button 
            onClick={() => setActiveTab('events')} 
            style={{ padding: '8px 18px', borderRadius: '25px', border: 'none', background: activeTab === 'events' ? 'var(--gold, #c6a46b)' : 'transparent', color: activeTab === 'events' ? '#000' : '#aaa', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
          >
            Contact Event Types
          </button>
        </div>

        <button onClick={handleSave} disabled={saving || uploading} className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: saving || uploading ? 0.5 : 1 }}>
          {saving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
        </button>
      </div>

      <div style={{ paddingTop: '100px' }}>
        
        {/* ============================================================== */}
        {/* 1. HOMEPAGE CONTENT & IMAGES TAB                              */}
        {/* ============================================================== */}
        {activeTab === 'home' && (
          <section style={{ padding: '40px 10%', maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <p className="eyebrow" style={{ color: 'var(--gold, #c6a46b)', fontSize: '12px', letterSpacing: '2px' }}>HOMEPAGE CUSTOMIZER</p>
              <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(32px, 4vw, 48px)', color: '#fff', margin: 0 }}>
                Edit Content & <span>Images</span>
              </h2>
            </div>

            {/* A. HERO & STORY SECTION */}
            <div style={cardSectionStyle}>
              <h3 style={sectionHeadingStyle}><Sparkles size={20} color="var(--gold, #c6a46b)" /> Hero & Intro Story</h3>
              
              <label style={labelStyle}>Hero Title</label>
              <textarea value={content.heroTitle} onChange={(e) => handleChange('heroTitle', e.target.value)} style={{ ...inputStyle, height: '70px' }} />

              <label style={labelStyle}>Hero Subtitle</label>
              <textarea value={content.heroSub} onChange={(e) => handleChange('heroSub', e.target.value)} style={{ ...inputStyle, height: '70px' }} />

              <label style={labelStyle}>Story Section Title</label>
              <textarea value={content.storyTitle} onChange={(e) => handleChange('storyTitle', e.target.value)} style={{ ...inputStyle, height: '70px' }} />

              <label style={labelStyle}>Story Section Description</label>
              <textarea value={content.storyText} onChange={(e) => handleChange('storyText', e.target.value)} style={{ ...inputStyle, height: '90px' }} />
            </div>

            {/* B. FEATURED STORIES / SELECTED WORKS (3 CARDS WITH IMAGES) */}
            <div style={cardSectionStyle}>
              <h3 style={sectionHeadingStyle}><ImageIcon size={20} color="var(--gold, #c6a46b)" /> Selected Stories (3 Featured Works)</h3>
              <p style={{ color: 'var(--muted, #aaa)', fontSize: '13px', marginTop: '-10px', marginBottom: '25px' }}>
                These 3 cards are displayed under "Selected Stories" on the home page.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {[
                  { num: '01', imgKey: 'img1', titleKey: 'img1Title', catKey: 'img1Category', defaultLabel: 'Work #1' },
                  { num: '02', imgKey: 'img2', titleKey: 'img2Title', catKey: 'img2Category', defaultLabel: 'Work #2' },
                  { num: '03', imgKey: 'img3', titleKey: 'img3Title', catKey: 'img3Category', defaultLabel: 'Work #3' }
                ].map((item) => (
                  <div key={item.num} style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--gold, #c6a46b)' }}>CARD {item.num}</span>
                    </div>

                    {/* Image Preview */}
                    <div style={{ position: 'relative', width: '100%', height: '170px', borderRadius: '8px', overflow: 'hidden', background: '#000', marginBottom: '12px' }}>
                      <img 
                        src={content[item.imgKey] || 'https://via.placeholder.com/300x200'} 
                        alt={item.defaultLabel} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: 'var(--gold, #c6a46b)', color: '#000', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', marginBottom: '15px' }}>
                      {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={15} />}
                      Upload New Image
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleHomeImageUpload(e, item.imgKey)} />
                    </label>

                    <label style={miniLabelStyle}>Card Title</label>
                    <input 
                      value={content[item.titleKey] || ''} 
                      onChange={(e) => handleChange(item.titleKey, e.target.value)} 
                      style={{ ...inputStyle, padding: '10px', fontSize: '13px', marginBottom: '10px' }} 
                    />

                    <label style={miniLabelStyle}>Category Tag</label>
                    <input 
                      value={content[item.catKey] || ''} 
                      onChange={(e) => handleChange(item.catKey, e.target.value)} 
                      style={{ ...inputStyle, padding: '10px', fontSize: '13px' }} 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* C. SHOWREEL COVER POSTER */}
            <div style={cardSectionStyle}>
              <h3 style={sectionHeadingStyle}><Film size={20} color="var(--gold, #c6a46b)" /> Showreel Cover Poster</h3>
              <p style={{ color: 'var(--muted, #aaa)', fontSize: '13px', marginTop: '-10px', marginBottom: '20px' }}>
                Default placeholder poster image for the video player before reels start playing.
              </p>

              <div style={{ display: 'flex', gap: '25px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ width: '240px', height: '140px', borderRadius: '10px', overflow: 'hidden', background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <img src={content.showreelImg} alt="Showreel Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <label style={{ padding: '12px 20px', background: 'var(--gold, #c6a46b)', color: '#000', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                  Change Showreel Poster
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleHomeImageUpload(e, 'showreelImg')} />
                </label>
              </div>
            </div>

            {/* D. CLIENT TESTIMONIALS (ALL 6) */}
            <div style={cardSectionStyle}>
              <h3 style={sectionHeadingStyle}><MessageSquare size={20} color="var(--gold, #c6a46b)" /> Client Testimonials (All 6)</h3>
              <p style={{ color: 'var(--muted, #aaa)', fontSize: '13px', marginTop: '-10px', marginBottom: '25px' }}>
                Desktop shows 3 at a time (rotating in 2 groups), mobile slides through them 1 by 1.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <div key={num} style={{ background: '#161616', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--gold, #c6a46b)', fontWeight: 600 }}>Testimonial #{num}</span>
                    </div>
                    
                    <label style={miniLabelStyle}>Client Name</label>
                    <input 
                      value={content[`testimonial${num}Name`] || ''} 
                      onChange={(e) => handleChange(`testimonial${num}Name`, e.target.value)} 
                      style={{ ...inputStyle, padding: '10px', fontSize: '13px', marginBottom: '10px' }} 
                    />

                    <label style={miniLabelStyle}>Client Review / Quote</label>
                    <textarea 
                      value={content[`testimonial${num}`] || ''} 
                      onChange={(e) => handleChange(`testimonial${num}`, e.target.value)} 
                      style={{ ...inputStyle, height: '70px', padding: '10px', fontSize: '13px' }} 
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* 2. MULTI-CLIENT PORTFOLIO MANAGER TAB                         */}
        {/* ============================================================== */}
        {activeTab === 'portfolio' && (
          <section style={{ padding: '60px 8%', background: 'var(--bg-light, #111)' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <p className="eyebrow" style={{ color: 'var(--gold, #c6a46b)', fontSize: '12px', letterSpacing: '2px' }}>PORTFOLIO EVENTS</p>
              <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(36px, 5vw, 56px)', color: '#fff', margin: 0 }}>
                Portfolio <span>Manager</span>
              </h2>
            </div>

            {/* CATEGORY TABS */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '40px', flexWrap: 'wrap' }}>
              {content.categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setEditingClient(null); }}
                  style={{ padding: '12px 24px', borderRadius: '30px', border: 'none', background: selectedCategory === cat ? 'var(--gold, #c6a46b)' : '#222', color: selectedCategory === cat ? '#000' : '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}
                >
                  {cat}
                </button>
              ))}
              
              <button 
                onClick={handleAddCategory}
                style={{ padding: '12px 20px', borderRadius: '30px', border: '2px dashed var(--gold, #c6a46b)', background: 'transparent', color: 'var(--gold, #c6a46b)', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <Plus size={16} /> Add Category
              </button>
            </div>

            {!editingClient ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                {filteredClients.map(client => (
                  <div key={client.id} style={{ background: '#181818', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333' }}>
                    <img src={client.mainImage || 'https://via.placeholder.com/300'} alt={client.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                    <div style={{ padding: '20px' }}>
                      <h4 style={{ color: '#fff', margin: '0 0 10px' }}>{client.title}</h4>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => setEditingClient(client)} style={{ flex: 1, padding: '10px', background: 'var(--gold, #c6a46b)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontWeight: 600 }}><Edit2 size={16} /> Edit Client</button>
                        <button onClick={() => handleDeleteClient(client.id)} style={{ padding: '10px', background: 'rgba(255,0,0,0.2)', color: 'red', border: '1px solid red', borderRadius: '4px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={handleCreateClient}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '280px', cursor: 'pointer', color: 'var(--gold, #c6a46b)' }}
                >
                  <Plus size={36} style={{ marginBottom: '10px' }} />
                  <span style={{ fontWeight: 600 }}>Add New {selectedCategory} Client</span>
                </button>
              </div>
            ) : (
              <div style={{ maxWidth: '800px', margin: '0 auto', background: '#161616', padding: '40px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <button onClick={() => setEditingClient(null)} style={{ background: 'none', border: 'none', color: 'var(--muted, #aaa)', cursor: 'pointer', marginBottom: '20px' }}>← Back to List</button>
                <h3 style={{ color: '#fff', fontFamily: 'var(--heading-font)', fontSize: '28px', marginBottom: '25px' }}>Editing Client: {editingClient.title}</h3>

                <label style={labelStyle}>Event Title</label>
                <input value={editingClient.title} onChange={(e) => handleUpdateClient('title', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Description</label>
                <textarea value={editingClient.description} onChange={(e) => handleUpdateClient('description', e.target.value)} style={{ ...inputStyle, height: '90px' }} />

                <label style={labelStyle}>Main Poster (Cover)</label>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '30px' }}>
                  {editingClient.mainImage && <img src={editingClient.mainImage} alt="Main" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />}
                  <label style={{ padding: '12px 20px', background: 'var(--gold, #c6a46b)', color: '#000', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                    {uploading ? 'Uploading...' : 'Upload Cover Image'}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleMainImageUpload} />
                  </label>
                </div>

                {selectedCategory === 'Wedding' ? (
                  <>
                    <label style={labelStyle}>Gallery Images by Sub-Category</label>
                    {WEDDING_SUB_CATEGORIES.map(subCat => (
                      <div key={subCat} style={{ marginBottom: '20px', background: '#101010', padding: '20px', borderRadius: '8px' }}>
                        <h4 style={{ color: 'var(--gold, #c6a46b)', marginBottom: '15px' }}>{subCat}</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                          {(editingClient.subCategories?.[subCat] || []).map((img, idx) => (
                            <div key={idx} style={{ position: 'relative', width: '90px', height: '90px' }}>
                              <img src={img} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                              <button onClick={() => removeGalleryImage(subCat, idx)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: '#fff', border: 'none', borderRadius: '50%', padding: '4px 7px', cursor: 'pointer', fontSize: '10px' }}>✕</button>
                            </div>
                          ))}
                          <label style={{ width: '90px', height: '90px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '2px dashed var(--gold, #c6a46b)', borderRadius: '8px', cursor: 'pointer', color: 'var(--gold, #c6a46b)' }}>
                            <Plus size={20} />
                            <span style={{ fontSize: '10px', marginTop: '4px' }}>Add Photo</span>
                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleGalleryUpload(e, subCat)} />
                          </label>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <label style={labelStyle}>Gallery Images</label>
                    <div style={{ background: '#101010', padding: '20px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {(editingClient.subCategories?.['General'] || []).map((img, idx) => (
                          <div key={idx} style={{ position: 'relative', width: '90px', height: '90px' }}>
                            <img src={img} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                            <button onClick={() => removeGalleryImage('General', idx)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: '#fff', border: 'none', borderRadius: '50%', padding: '4px 7px', cursor: 'pointer', fontSize: '10px' }}>✕</button>
                          </div>
                        ))}
                        <label style={{ width: '90px', height: '90px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '2px dashed var(--gold, #c6a46b)', borderRadius: '8px', cursor: 'pointer', color: 'var(--gold, #c6a46b)' }}>
                          <Plus size={20} />
                          <span style={{ fontSize: '10px', marginTop: '4px' }}>Add Photo</span>
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleGalleryUpload(e, 'General')} />
                        </label>
                      </div>
                    </div>
                  </>
                )}

                <button onClick={handleSaveClient} className="primary-btn" style={{ width: '100%', marginTop: '25px', padding: '14px' }}>Save This Client</button>
              </div>
            )}
          </section>
        )}

        {/* ============================================================== */}
        {/* 3. CONTACT FORM EVENT TYPES TAB                               */}
        {/* ============================================================== */}
        {activeTab === 'events' && (
          <section style={{ padding: '60px 10%', maxWidth: '800px', margin: '0 auto' }}>
            <div style={cardSectionStyle}>
              <h3 style={sectionHeadingStyle}><Layout size={20} color="var(--gold, #c6a46b)" /> Contact Form Event Types</h3>
              <p style={{ color: 'var(--muted, #aaa)', fontSize: '13px', marginTop: '-10px', marginBottom: '20px' }}>
                Options displayed in the enquiry dropdown on the Contact page.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '25px' }}>
                {content.eventTypes.map(type => (
                  <div key={type} style={{ background: '#202020', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <span>{type}</span>
                    {type !== 'Others' && (
                      <button onClick={() => handleDeleteEventType(type)} style={{ background: 'none', border: 'none', color: '#ff5555', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button 
                onClick={handleAddEventType}
                style={{ background: 'transparent', border: '2px dashed var(--gold, #c6a46b)', color: 'var(--gold, #c6a46b)', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: '14px' }}
              >
                <Plus size={16} /> Add Event Type
              </button>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

const cardSectionStyle = {
  background: '#111',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '14px',
  padding: '30px',
  marginBottom: '30px'
};

const sectionHeadingStyle = {
  fontFamily: 'var(--heading-font)',
  fontSize: '22px',
  color: '#fff',
  margin: '0 0 20px 0',
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

const labelStyle = { 
  display: 'block', 
  color: 'var(--gold, #c6a46b)', 
  marginBottom: '8px', 
  fontSize: '13px', 
  fontWeight: 600,
  letterSpacing: '1px', 
  marginTop: '16px' 
};

const miniLabelStyle = {
  display: 'block',
  color: 'var(--muted, #aaa)',
  fontSize: '11px',
  letterSpacing: '0.5px',
  marginBottom: '5px',
  textTransform: 'uppercase'
};

const inputStyle = { 
  width: '100%', 
  padding: '12px 14px', 
  background: '#080808', 
  border: '1px solid rgba(255,255,255,0.12)', 
  borderRadius: '8px', 
  color: 'white', 
  fontSize: '14px', 
  fontFamily: 'var(--body-font)', 
  outline: 'none',
  boxSizing: 'border-box'
};
