import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, ArrowLeft, Upload, Loader2, Plus, Trash2, Edit2, 
  Image as ImageIcon, Film, Video, Aperture, Camera, MessageSquare, 
  Sparkles, Layers, BookOpen, Clock, ShieldCheck
} from 'lucide-react';

const CLOUDINARY_CLOUD_NAME = 'kwqsty9w';
const CLOUDINARY_UPLOAD_PRESET = 'portfolio_upload';
const WEDDING_SUB_CATEGORIES = ['Engagement', 'Pre-Wedding', 'Mehendi & Haldi', 'Marriage', 'Reception'];

export default function AdminChange() {
  const defaultContent = {
    // ----------------------------------------------------
    // 1. HOME: HERO & INTRO
    // ----------------------------------------------------
    heroTitle: 'Every Frame.\nA Timeless Story.',
    heroSub: "We don't just capture moments. We turn emotions, memories and beautiful stories into something that lasts forever.",
    storyTitle: 'Moments pass.\nStories stay forever.',
    storyText: 'At Photo In Motion, we believe every celebration has a story worth telling. Through thoughtful photography and cinematic filmmaking, we preserve the feelings behind every frame.',
    
    // ----------------------------------------------------
    // 2. HOME: FEATURED WORKS (3 CARDS)
    // ----------------------------------------------------
    featuredWorks: [
      { number: '01', category: 'WEDDINGS', title: 'Forever Begins', img: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85' },
      { number: '02', category: 'CELEBRATIONS', title: 'Beautiful Together', img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85' },
      { number: '03', category: 'CINEMATIC FILMS', title: 'Beyond The Frame', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85' }
    ],

    // ----------------------------------------------------
    // 3. HOME: CINEMATIC FILM STRIP
    // ----------------------------------------------------
    stripTopWorks: [
      { id: 't1', title: 'Forever Begins', category: 'WEDDINGS', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85' },
      { id: 't2', title: 'Golden Sunset Vows', category: 'PRE-WEDDING', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=85' },
      { id: 't3', title: 'The Royal Baraat', category: 'CELEBRATIONS', img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=85' },
      { id: 't4', title: 'Aura of Serenity', category: 'PORTRAITURE', img: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=85' },
      { id: 't5', title: 'Moments in Harmony', category: 'CINEMATIC', img: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=85' }
    ],
    stripBottomWorks: [
      { id: 'b1', title: 'Marigold Showers', category: 'HALDI RITUALS', img: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=85' },
      { id: 'b2', title: 'Starlit First Dance', category: 'RECEPTIONS', img: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=900&q=85' },
      { id: 'b3', title: 'Whispers of Eternity', category: 'DESTINATION', img: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=900&q=85' },
      { id: 'b4', title: 'The Sacred Knot', category: 'RITUALS', img: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=85' },
      { id: 'b5', title: 'Chasing the Horizon', category: 'PRE-WEDDING', img: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=900&q=85' }
    ],

    // ----------------------------------------------------
    // 4. HOME: 360° ORBIT GALLERY (CinematicReveal)
    // ----------------------------------------------------
    orbitMoments: [
      { id: 1, tag: "ROYAL WEDDING", title: "Forever Begins at Sacred Dusk", focal: "85mm • f/1.4 • ISO 100", desc: "Vows whispered beneath temple archways as the golden hour blesses every vow.", url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85", thumb: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80" },
      { id: 2, tag: "CINEMATIC HALDI", title: "Golden Petals & Joyous Tears", focal: "50mm • f/1.2 • ISO 200", desc: "Unbridled laughter and flying marigold showers captured in slow-motion warmth.", url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85", thumb: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=300&q=80" },
      { id: 3, tag: "PRE-WEDDING DAWN", title: "Whispers Across The Mist", focal: "35mm • f/1.8 • ISO 160", desc: "Quiet intimacy framed by serene waters, morning reflections, and timeless poetry.", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85", thumb: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=300&q=80" },
      { id: 4, tag: "GRAND CELEBRATION", title: "The Euphoria of Royal Baraat", focal: "24mm • f/2.0 • ISO 400", desc: "High energy, celebratory drums, and kaleidoscopic colors frozen at peak motion.", url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85", thumb: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=300&q=80" },
      { id: 5, tag: "STARLIT RECEPTION", title: "First Dance Under Chandeliers", focal: "105mm • f/2.8 • ISO 800", desc: "Chandelier glints, velvet suits, and the quiet universe of two lovers dancing alone.", url: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=85", thumb: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=300&q=80" },
      { id: 6, tag: "SOUL PORTRAIT", title: "Elegance in The Mirror", focal: "85mm • f/1.4 • ISO 100", desc: "The bridal veil catching soft natural window light in profound stillness.", url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85", thumb: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=300&q=80" }
    ],

    // ----------------------------------------------------
    // 5. HOME: SHOWREEL VIDEOS
    // ----------------------------------------------------
    showreels: [
      { id: 'reel-1', number: '01', title: 'The Royal Wedding Saga', category: 'WEDDINGS', location: 'Udaivilas, Udaipur', duration: '0:10', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', poster: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85', synopsis: 'A grand royal union captured in 4K anamorphic richness with intimate emotional cadences.' },
      { id: 'reel-2', number: '02', title: 'Golden Sunset Vows', category: 'PRE-WEDDING', location: 'Pashan Lake, Pune', duration: '0:10', videoUrl: 'https://assets.codepen.io/6093409/river.mp4', poster: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85', synopsis: 'Golden hour silhouettes, mist over water, and vows etched before the crowd arrives.' },
      { id: 'reel-3', number: '03', title: 'Euphoria of the Sangeet', category: 'CELEBRATIONS', location: 'Grand Hyatt, Mumbai', duration: '0:10', videoUrl: 'https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4', poster: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85', synopsis: 'Explosive lighting, choreographies, and raw dance floor joy immortalized in cinematic 120fps.' },
      { id: 'reel-4', number: '04', title: 'Marigold Showers & Sacred Haldi', category: 'RITUALS', location: 'Heritage Haveli, Jaipur', duration: '0:05', videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', poster: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85', synopsis: 'Flying turmeric powder, uninhibited laughter, and sacred blessings from elders.' },
      { id: 'reel-5', number: '05', title: 'Midnight Waltz & First Dance', category: 'RECEPTIONS', location: 'Taj Falaknuma, Hyderabad', duration: '0:10', videoUrl: 'https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4', poster: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=85', synopsis: 'Sparklers illuminate the twilight as the couple takes their inaugural dance as one.' }
    ],

    // ----------------------------------------------------
    // 6. HOME: DIRECTOR'S VIEWFINDER (EventPlanner)
    // ----------------------------------------------------
    viewfinderShots: [
      { id: 'shot-01', lens: '85mm f/1.4', category: 'BRIDAL PORTRAITURE', focalName: 'The Signature Bokeh', desc: 'Creamy optical depth with tack-sharp focus on the bridal veil and eye highlights.', shutter: '1/500s', aperture: 'f/1.4', iso: 'ISO 100', kelvin: '5600K Daylight', imgGraded: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85', imgRaw: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=25' },
      { id: 'shot-02', lens: '24mm f/2.8', category: 'ROYAL VENUE & MANDAP', focalName: 'Architectural Grandeur', desc: 'Capturing the monumental scale of grand chandeliers, palace pillars, and floral ceilings.', shutter: '1/250s', aperture: 'f/4.0', iso: 'ISO 400', kelvin: '3200K Tungsten', imgGraded: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85', imgRaw: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=25' },
      { id: 'shot-03', lens: '50mm f/1.2', category: 'UNSTAGED CANDIDS', focalName: 'Joyous Marigold Haldi', desc: 'Freeze-motion laughter and flying marigold petals with natural human field of view.', shutter: '1/800s', aperture: 'f/1.8', iso: 'ISO 200', kelvin: '5200K Warm Sunlight', imgGraded: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85', imgRaw: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=25' },
      { id: 'shot-04', lens: '135mm f/2.0', category: 'INTIMATE TELEPHOTO', focalName: 'Stolen Glance in the Mist', desc: 'Unobtrusive compression from afar, preserving tender moments without intruding.', shutter: '1/640s', aperture: 'f/2.0', iso: 'ISO 640', kelvin: '4800K Golden Dawn', imgGraded: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85', imgRaw: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=25' },
      { id: 'shot-05', lens: '35mm f/1.4', category: 'EVENING RECEPTION GALA', focalName: 'The First Dance', desc: 'Cinematic wide-aperture capture of starlit waltzes and ambient venue spotlights.', shutter: '1/200s', aperture: 'f/1.4', iso: 'ISO 800', kelvin: '3800K Ambiance', imgGraded: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=85', imgRaw: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=25' },
      { id: 'shot-06', lens: '85mm f/1.4', category: 'EDITORIAL PORTRAIT', focalName: 'Serenity & Grace', desc: 'Studio-quality natural window sidelight highlighting jewelry and embroidery details.', shutter: '1/320s', aperture: 'f/1.6', iso: 'ISO 160', kelvin: '5500K Studio', imgGraded: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85', imgRaw: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=25' }
    ],

    // ----------------------------------------------------
    // 7. HOME: TESTIMONIALS (6 items)
    // ----------------------------------------------------
    testimonials: [
      { name: 'Ananya & Rahul', text: 'They captured the essence of our wedding perfectly.' },
      { name: 'Sarah & James', text: 'The cinematic film they created for us is an absolute masterpiece.' },
      { name: 'Priya & Arjun', text: 'Professional, unobtrusive, and incredibly talented.' },
      { name: 'Neha & Vikram', text: "Every frame was a work of art. We couldn't be happier." },
      { name: 'Riya & Karan', text: 'They turned our special day into a cinematic experience.' },
      { name: 'Simran & Aditya', text: 'The attention to detail was flawless. Highly recommended!' }
    ],

    // ----------------------------------------------------
    // 8. OUR STORY PAGE (NEW COMPLETE SETTINGS)
    // ----------------------------------------------------
    storyHeroEyebrow: 'THE LEGACY SINCE 2005',
    storyHeroHeading: 'Moments pass.\nStories stay forever.',
    storyHeroParagraph: 'At Photo In Motion Studio, our story is etched in patience, passion, and two decades of relentless craftsmanship. From our beginnings in Kendrapara to documenting state leaders, fashion icons, and royal weddings, we preserve the heartbeat behind every frame.',
    
    storyStats: [
      { number: '2005', label: 'Est. in Kendrapara', sub: '20+ Years Heritage' },
      { number: 'VIPs', label: 'MLAs & Deputy CMs', sub: 'Trusted at Highest Level' },
      { number: 'Digital', label: 'Models & YouTube', sub: 'Modern Shorts & Viral Media' },
      { number: '1000+', label: 'Stories Captured', sub: 'Timeless Legacies' }
    ],

    storyFounderImg: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
    storyFounderName: 'Munu',
    storyFounderRole: 'Visionary Filmmaker & Founder, Photo In Motion',
    storyFounderOrigin: 'Kendrapara, Odisha · Since 2005',
    storyOriginHeading: "From One Person's Vision to a Cinematic Powerhouse",
    storyOriginP1: "In 2005, in the historic town of Kendrapara, Photo In Motion began with just one person — Munu. With a single camera and an unwavering obsession with natural lighting and unposed emotional depth, every frame was treated as sacred art.",
    storyOriginP2: "What started as local wedding memories quickly evolved into a trusted production brand. As word spread, our lens captured high-profile state leaders — including MLAs and Deputy Chief Ministers — commanding the highest discretion, speed, and cinematic poise.",
    
    storyMilestones: [
      { year: '2005', tag: 'THE HUMBLE GENESIS', title: 'One Man, One Camera in Kendrapara', desc: 'Founded by Munu as a solo visionary in Kendrapara. Driven by an uncompromising passion for raw human emotion and the craft of visual storytelling.' },
      { year: '2012', tag: 'HIGH-PROFILE TRUST', title: 'State Dignitaries & VIP Events', desc: 'Entrusted with documenting high-security, prestigious events for Members of Legislative Assembly (MLAs) and Deputy Chief Ministers (Deputy CMs).' },
      { year: '2018', tag: 'MEDIA EVOLUTION', title: 'Fashion, Shorts & Digital Productions', desc: 'Expanded into commercial fashion portfolios, high-engagement short-form cinema, and viral YouTube film productions with modern 4K optics.' },
      { year: 'Present', tag: 'CINEMATIC BENCHMARK', title: 'Photo In Motion Studio', desc: 'Over two decades of celebrated heritage. A premiere destination across India for luxury wedding films, VIP events, and cinematic portraits.' }
    ],

    storyArenas: [
      { title: 'VIP & Dignitary Coverage', desc: 'Extensive hands-on experience filming MLAs, Deputy Chief Ministers, and corporate dignitaries with utmost discretion and cinematic speed.' },
      { title: 'Fashion & Model Portfolios', desc: 'High-end magazine style portraiture, editorial lighting setups, and agency-grade model portfolios crafted to turn heads.' },
      { title: 'Shorts & YouTube Productions', desc: 'Modern vertical short cinema, Reels, and 4K YouTube storytelling tailored with rhythmic pacing and cinematic sound design.' }
    ],

    // ----------------------------------------------------
    // 9. PORTFOLIO & CATEGORIES
    // ----------------------------------------------------
    portfolioItems: [],
    categories: ['Wedding', 'Birthday', 'Corporate'],
    eventTypes: ['Wedding', 'Baby Shower', 'Post Wedding', 'Car Delivery', 'Others']
  };

  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('storyPage'); // Default to story page tab

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
          setContent(prev => ({
            ...defaultContent,
            ...data,
            featuredWorks: data.featuredWorks || defaultContent.featuredWorks,
            stripTopWorks: data.stripTopWorks || defaultContent.stripTopWorks,
            stripBottomWorks: data.stripBottomWorks || defaultContent.stripBottomWorks,
            orbitMoments: data.orbitMoments || defaultContent.orbitMoments,
            showreels: data.showreels || defaultContent.showreels,
            viewfinderShots: data.viewfinderShots || defaultContent.viewfinderShots,
            testimonials: data.testimonials || defaultContent.testimonials,
            storyStats: data.storyStats || defaultContent.storyStats,
            storyMilestones: data.storyMilestones || defaultContent.storyMilestones,
            storyArenas: data.storyArenas || defaultContent.storyArenas,
            portfolioItems: data.portfolioItems || [],
            categories: data.categories || defaultContent.categories,
            eventTypes: data.eventTypes || defaultContent.eventTypes
          }));
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
        alert('All changes saved successfully!');
      } else {
        const err = await res.json();
        alert(`Failed to save: ${err.message || 'Unknown error'}`);
      }
    } catch (err) {
      alert('Network error while saving changes.');
    }
    setSaving(false);
  };

  const uploadToCloudinary = async (file, resourceType = 'image') => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;
      const res = await fetch(endpoint, { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Upload failed');
      return data.secure_url;
    } catch (error) {
      alert(error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const updateArrayItem = (arrayKey, index, field, value) => {
    setContent(prev => {
      const updated = [...prev[arrayKey]];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, [arrayKey]: updated };
    });
  };

  const handleSingleImageUpload = async (e, stateKey) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadToCloudinary(file);
    if (url) {
      setContent(prev => ({ ...prev, [stateKey]: url }));
    }
  };

  if (loading) return <div style={{ color: '#fff', padding: '100px', textAlign: 'center' }}>Loading Admin Panel...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', paddingBottom: '120px' }}>
      
      {/* 1. TOP HEADER */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        background: 'rgba(10, 10, 10, 0.95)', backdropFilter: 'blur(12px)',
        zIndex: 100, padding: '16px 4%',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <button 
          onClick={() => navigate('/admin/dashboard')} 
          style={{ background: 'none', border: 'none', color: 'var(--gold, #c6a46b)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}
        >
          <ArrowLeft size={18} /> Dashboard
        </button>

        <h3 style={{ margin: 0, fontFamily: 'var(--heading-font, serif)', fontSize: '18px', color: '#fff' }}>
          Site Customizer & Story Manager
        </h3>

        <button 
          onClick={handleSave} 
          disabled={saving || uploading} 
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 22px', borderRadius: '30px',
            background: 'var(--gold, #c6a46b)', color: '#000',
            fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer',
            opacity: saving || uploading ? 0.6 : 1
          }}
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div style={{ paddingTop: '80px', background: '#111', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: '65px', zIndex: 90 }}>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '12px 4%', scrollbarWidth: 'none' }}>
          {[
            { id: 'storyPage', label: '📖 Our Story Page (Complete)', icon: BookOpen },
            { id: 'reels', label: 'Living Showreels (Videos)', icon: Video },
            { id: 'orbit', label: '360° Orbit (Moments)', icon: Aperture },
            { id: 'viewfinder', label: "Director's Viewfinder", icon: Camera },
            { id: 'strip', label: 'Cinematic Film Strip', icon: Film },
            { id: 'featured', label: 'Featured 3 Stories', icon: ImageIcon },
            { id: 'hero', label: 'Homepage Content', icon: Sparkles },
            { id: 'testimonials', label: 'Testimonials (6)', icon: MessageSquare },
            { id: 'portfolio', label: 'Portfolio Events', icon: Layers }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '9px 18px', borderRadius: '20px',
                  border: isActive ? '1px solid var(--gold, #c6a46b)' : '1px solid rgba(255,255,255,0.06)',
                  background: isActive ? 'var(--gold, #c6a46b)' : 'rgba(255,255,255,0.03)',
                  color: isActive ? '#000' : '#aaa',
                  cursor: 'pointer', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. CONTENT PANELS */}
      <div style={{ padding: '40px 4%', maxWidth: '1200px', margin: '0 auto' }}>

        {/* ======================================================== */}
        {/* NEW TAB: OUR STORY PAGE MANAGER                          */}
        {/* ======================================================== */}
        {activeTab === 'storyPage' && (
          <div>
            <SectionHeader 
              tag="PAGE EDITOR" 
              title="Our Story & Founder's Journey" 
              sub="Customise every heading, narrative paragraph, founder portrait, timeline milestones, and stats."
            />

            {/* A. STORY HERO & STATS */}
            <div style={boxCardStyle}>
              <h3 style={sectionHeadingStyle}><Sparkles size={18} color="var(--gold, #c6a46b)" /> 1. Story Hero Header & Stats</h3>
              
              <label style={labelStyle}>Eyebrow Badge</label>
              <input value={content.storyHeroEyebrow} onChange={(e) => setContent(p => ({ ...p, storyHeroEyebrow: e.target.value }))} style={inputStyle} />

              <label style={labelStyle}>Hero Heading</label>
              <textarea value={content.storyHeroHeading} onChange={(e) => setContent(p => ({ ...p, storyHeroHeading: e.target.value }))} style={{ ...inputStyle, height: '70px' }} />

              <label style={labelStyle}>Hero Paragraph Description</label>
              <textarea value={content.storyHeroParagraph} onChange={(e) => setContent(p => ({ ...p, storyHeroParagraph: e.target.value }))} style={{ ...inputStyle, height: '90px' }} />

              <h4 style={{ color: 'var(--gold, #c6a46b)', fontSize: '14px', margin: '20px 0 10px' }}>4 Experience Stats Cards</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                {content.storyStats.map((stat, idx) => (
                  <div key={idx} style={{ background: '#181818', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <label style={miniLabelStyle}>Stat #{idx + 1} Number / Value</label>
                    <input value={stat.number} onChange={(e) => updateArrayItem('storyStats', idx, 'number', e.target.value)} style={inputStyle} />

                    <label style={miniLabelStyle}>Label</label>
                    <input value={stat.label} onChange={(e) => updateArrayItem('storyStats', idx, 'label', e.target.value)} style={inputStyle} />

                    <label style={miniLabelStyle}>Sub-label</label>
                    <input value={stat.sub} onChange={(e) => updateArrayItem('storyStats', idx, 'sub', e.target.value)} style={inputStyle} />
                  </div>
                ))}
              </div>
            </div>

            {/* B. THE FOUNDER'S JOURNEY (MUNU & KENDRAPARA) */}
            <div style={boxCardStyle}>
              <h3 style={sectionHeadingStyle}><Camera size={18} color="var(--gold, #c6a46b)" /> 2. Founder & Kendrapara Origin</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>Founder Showcase Image</label>
                  <div style={{ position: 'relative', width: '100%', height: '240px', borderRadius: '12px', overflow: 'hidden', background: '#000', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <img src={content.storyFounderImg} alt="Founder" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <label style={{ ...uploadButtonStyle, width: '100%' }}>
                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={14} />} Upload Founder Photo
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleSingleImageUpload(e, 'storyFounderImg')} />
                  </label>
                </div>

                <div>
                  <label style={labelStyle}>Founder Name</label>
                  <input value={content.storyFounderName} onChange={(e) => setContent(p => ({ ...p, storyFounderName: e.target.value }))} style={inputStyle} />

                  <label style={labelStyle}>Founder Role / Title</label>
                  <input value={content.storyFounderRole} onChange={(e) => setContent(p => ({ ...p, storyFounderRole: e.target.value }))} style={inputStyle} />

                  <label style={labelStyle}>Origin Location Tag</label>
                  <input value={content.storyFounderOrigin} onChange={(e) => setContent(p => ({ ...p, storyFounderOrigin: e.target.value }))} style={inputStyle} />

                  <label style={labelStyle}>Section Heading</label>
                  <input value={content.storyOriginHeading} onChange={(e) => setContent(p => ({ ...p, storyOriginHeading: e.target.value }))} style={inputStyle} />
                </div>
              </div>

              <label style={labelStyle}>Story Narrative (Paragraph 1)</label>
              <textarea value={content.storyOriginP1} onChange={(e) => setContent(p => ({ ...p, storyOriginP1: e.target.value }))} style={{ ...inputStyle, height: '90px' }} />

              <label style={labelStyle}>Story Narrative (Paragraph 2 - State VIPs, MLAs)</label>
              <textarea value={content.storyOriginP2} onChange={(e) => setContent(p => ({ ...p, storyOriginP2: e.target.value }))} style={{ ...inputStyle, height: '90px' }} />
            </div>

            {/* C. 20-YEAR TIMELINE MILESTONES (ALL 4) */}
            <div style={boxCardStyle}>
              <h3 style={sectionHeadingStyle}><Clock size={18} color="var(--gold, #c6a46b)" /> 3. Creative Milestones Timeline (4 Eras)</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                {content.storyMilestones.map((item, idx) => (
                  <div key={idx} style={{ background: '#181818', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <label style={miniLabelStyle}>Year / Period</label>
                    <input value={item.year} onChange={(e) => updateArrayItem('storyMilestones', idx, 'year', e.target.value)} style={inputStyle} />

                    <label style={miniLabelStyle}>Tag Badge</label>
                    <input value={item.tag} onChange={(e) => updateArrayItem('storyMilestones', idx, 'tag', e.target.value)} style={inputStyle} />

                    <label style={miniLabelStyle}>Milestone Title</label>
                    <input value={item.title} onChange={(e) => updateArrayItem('storyMilestones', idx, 'title', e.target.value)} style={inputStyle} />

                    <label style={miniLabelStyle}>Description</label>
                    <textarea value={item.desc} onChange={(e) => updateArrayItem('storyMilestones', idx, 'desc', e.target.value)} style={{ ...inputStyle, height: '90px' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* D. VERSATILITY ARENAS (VIPs, FASHION, YOUTUBE) */}
            <div style={boxCardStyle}>
              <h3 style={sectionHeadingStyle}><ShieldCheck size={18} color="var(--gold, #c6a46b)" /> 4. Versatility & Expertise Arenas (3 Cards)</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                {content.storyArenas.map((arena, idx) => (
                  <div key={idx} style={{ background: '#181818', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <label style={miniLabelStyle}>Arena #{idx + 1} Title</label>
                    <input value={arena.title} onChange={(e) => updateArrayItem('storyArenas', idx, 'title', e.target.value)} style={inputStyle} />

                    <label style={miniLabelStyle}>Arena Description</label>
                    <textarea value={arena.desc} onChange={(e) => updateArrayItem('storyArenas', idx, 'desc', e.target.value)} style={{ ...inputStyle, height: '90px' }} />
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: LIVING SHOWREELS (VIDEOS & POSTERS)                  */}
        {/* ======================================================== */}
        {activeTab === 'reels' && (
          <div>
            <SectionHeader 
              tag="VIDEO PLAYER ANIMATION" 
              title="Living Portfolio Showreel Videos" 
              sub="Manage the 5 video clips, poster thumbnails, location badges, and duration timers for the interactive player."
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
              {content.showreels.map((reel, idx) => (
                <div key={reel.id || idx} style={boxCardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gold, #c6a46b)', letterSpacing: '1px' }}>
                      REEL 0{idx + 1}
                    </span>
                    <span style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace' }}>
                      {reel.duration}
                    </span>
                  </div>

                  <div style={{ position: 'relative', width: '100%', height: '180px', borderRadius: '10px', overflow: 'hidden', background: '#000', marginBottom: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <img src={reel.poster} alt={reel.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', bottom: '8px', left: '8px', padding: '3px 8px', borderRadius: '4px', background: 'rgba(0,0,0,0.7)', fontSize: '10px', color: '#fff', textTransform: 'uppercase' }}>
                      {reel.category}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                    <label style={uploadButtonStyle}>
                      <Upload size={14} /> Upload Poster
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const url = await uploadToCloudinary(file, 'image');
                        if (url) updateArrayItem('showreels', idx, 'poster', url);
                      }} />
                    </label>

                    <label style={{ ...uploadButtonStyle, background: '#222', color: '#fff', border: '1px solid #444' }}>
                      <Video size={14} /> Upload MP4 Video
                      <input type="file" accept="video/mp4,video/webm" style={{ display: 'none' }} onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const url = await uploadToCloudinary(file, 'video');
                        if (url) updateArrayItem('showreels', idx, 'videoUrl', url);
                      }} />
                    </label>
                  </div>

                  <label style={miniLabelStyle}>Direct Video MP4 URL</label>
                  <input value={reel.videoUrl} onChange={(e) => updateArrayItem('showreels', idx, 'videoUrl', e.target.value)} placeholder="https://...mp4" style={inputStyle} />

                  <label style={miniLabelStyle}>Reel Title</label>
                  <input value={reel.title} onChange={(e) => updateArrayItem('showreels', idx, 'title', e.target.value)} style={inputStyle} />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={miniLabelStyle}>Category</label>
                      <input value={reel.category} onChange={(e) => updateArrayItem('showreels', idx, 'category', e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label style={miniLabelStyle}>Location</label>
                      <input value={reel.location} onChange={(e) => updateArrayItem('showreels', idx, 'location', e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label style={miniLabelStyle}>Duration</label>
                      <input value={reel.duration} onChange={(e) => updateArrayItem('showreels', idx, 'duration', e.target.value)} style={inputStyle} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: 360° ORBIT APERTURE                                 */}
        {/* ======================================================== */}
        {activeTab === 'orbit' && (
          <div>
            <SectionHeader 
              tag="GSAP 360° ORBIT" 
              title="Constellation of Timeless Moments" 
              sub="Manage the 6 revolving satellite nodes and the master center aperture iris photos."
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
              {content.orbitMoments.map((moment, idx) => (
                <div key={moment.id || idx} style={boxCardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gold, #c6a46b)' }}>
                      MOMENT 0{idx + 1}
                    </span>
                    <span style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace' }}>
                      {moment.focal}
                    </span>
                  </div>

                  <div style={{ position: 'relative', width: '100%', height: '170px', borderRadius: '10px', overflow: 'hidden', background: '#000', marginBottom: '14px' }}>
                    <img src={moment.url} alt={moment.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  <label style={{ ...uploadButtonStyle, width: '100%', marginBottom: '14px' }}>
                    <Upload size={14} /> Upload Frame Image
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const url = await uploadToCloudinary(file);
                      if (url) {
                        updateArrayItem('orbitMoments', idx, 'url', url);
                        updateArrayItem('orbitMoments', idx, 'thumb', url);
                      }
                    }} />
                  </label>

                  <label style={miniLabelStyle}>Tag / Header</label>
                  <input value={moment.tag} onChange={(e) => updateArrayItem('orbitMoments', idx, 'tag', e.target.value)} style={inputStyle} />

                  <label style={miniLabelStyle}>Story Title</label>
                  <input value={moment.title} onChange={(e) => updateArrayItem('orbitMoments', idx, 'title', e.target.value)} style={inputStyle} />

                  <label style={miniLabelStyle}>Technical Lens / Focal Spec</label>
                  <input value={moment.focal} onChange={(e) => updateArrayItem('orbitMoments', idx, 'focal', e.target.value)} style={inputStyle} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: DIRECTOR'S VIEWFINDER                               */}
        {/* ======================================================== */}
        {activeTab === 'viewfinder' && (
          <div>
            <SectionHeader 
              tag="REAL-TIME CAMERA ENGINE" 
              title="Through The Director's Viewfinder" 
              sub="Manage the 6 shots, their 35mm Graded vs RAW sensor photos, focal names, shutter speeds, and f-stop apertures."
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
              {content.viewfinderShots.map((shot, idx) => (
                <div key={shot.id || idx} style={boxCardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gold, #c6a46b)' }}>
                      LENS #{idx + 1} · {shot.lens}
                    </span>
                    <span style={{ fontSize: '10px', color: '#22c55e', fontFamily: 'monospace' }}>
                      IRIS {shot.aperture}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--gold, #c6a46b)', display: 'block', marginBottom: '4px' }}>Graded 35mm</span>
                      <div style={{ height: '110px', borderRadius: '8px', overflow: 'hidden', background: '#000' }}>
                        <img src={shot.imgGraded} alt="Graded" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <label style={{ ...uploadButtonStyle, width: '100%', marginTop: '6px', fontSize: '11px', padding: '6px' }}>
                        <Upload size={12} /> Change Graded
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const url = await uploadToCloudinary(file);
                          if (url) updateArrayItem('viewfinderShots', idx, 'imgGraded', url);
                        }} />
                      </label>
                    </div>

                    <div>
                      <span style={{ fontSize: '10px', color: '#888', display: 'block', marginBottom: '4px' }}>RAW Sensor</span>
                      <div style={{ height: '110px', borderRadius: '8px', overflow: 'hidden', background: '#000' }}>
                        <img src={shot.imgRaw} alt="RAW" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(60%)' }} />
                      </div>
                      <label style={{ ...uploadButtonStyle, width: '100%', marginTop: '6px', fontSize: '11px', padding: '6px', background: '#222', color: '#fff', border: '1px solid #444' }}>
                        <Upload size={12} /> Change RAW
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const url = await uploadToCloudinary(file);
                          if (url) updateArrayItem('viewfinderShots', idx, 'imgRaw', url);
                        }} />
                      </label>
                    </div>
                  </div>

                  <label style={miniLabelStyle}>Focal & Shot Name</label>
                  <input value={shot.focalName} onChange={(e) => updateArrayItem('viewfinderShots', idx, 'focalName', e.target.value)} style={inputStyle} />

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                    <div>
                      <label style={miniLabelStyle}>Shutter</label>
                      <input value={shot.shutter} onChange={(e) => updateArrayItem('viewfinderShots', idx, 'shutter', e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label style={miniLabelStyle}>Aperture</label>
                      <input value={shot.aperture} onChange={(e) => updateArrayItem('viewfinderShots', idx, 'aperture', e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label style={miniLabelStyle}>ISO</label>
                      <input value={shot.iso} onChange={(e) => updateArrayItem('viewfinderShots', idx, 'iso', e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label style={miniLabelStyle}>Kelvin</label>
                      <input value={shot.kelvin} onChange={(e) => updateArrayItem('viewfinderShots', idx, 'kelvin', e.target.value)} style={inputStyle} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: CINEMATIC FILM STRIP                                */}
        {/* ======================================================== */}
        {activeTab === 'strip' && (
          <div>
            <SectionHeader 
              tag="DUAL-TRACK RIBBON" 
              title="Cinematic Parallax Film Strip" 
              sub="Manage the scrolling 35mm film cells across the top row (glides left) and bottom row (glides right)."
            />

            <h4 style={{ color: 'var(--gold, #c6a46b)', fontSize: '16px', margin: '20px 0 14px' }}>Top Row (Gliding Left)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '35px' }}>
              {content.stripTopWorks.map((work, idx) => (
                <div key={work.id || idx} style={boxCardStyle}>
                  <div style={{ position: 'relative', height: '140px', borderRadius: '8px', overflow: 'hidden', background: '#000', marginBottom: '10px' }}>
                    <img src={work.img} alt={work.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <label style={{ ...uploadButtonStyle, width: '100%', marginBottom: '10px' }}>
                    <Upload size={13} /> Change Photo
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const url = await uploadToCloudinary(file);
                      if (url) updateArrayItem('stripTopWorks', idx, 'img', url);
                    }} />
                  </label>
                  <input value={work.title} onChange={(e) => updateArrayItem('stripTopWorks', idx, 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, marginBottom: '6px' }} />
                  <input value={work.category} onChange={(e) => updateArrayItem('stripTopWorks', idx, 'category', e.target.value)} placeholder="Category" style={inputStyle} />
                </div>
              ))}
            </div>

            <h4 style={{ color: 'var(--gold, #c6a46b)', fontSize: '16px', margin: '20px 0 14px' }}>Bottom Row (Gliding Right)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {content.stripBottomWorks.map((work, idx) => (
                <div key={work.id || idx} style={boxCardStyle}>
                  <div style={{ position: 'relative', height: '140px', borderRadius: '8px', overflow: 'hidden', background: '#000', marginBottom: '10px' }}>
                    <img src={work.img} alt={work.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <label style={{ ...uploadButtonStyle, width: '100%', marginBottom: '10px' }}>
                    <Upload size={13} /> Change Photo
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const url = await uploadToCloudinary(file);
                      if (url) updateArrayItem('stripBottomWorks', idx, 'img', url);
                    }} />
                  </label>
                  <input value={work.title} onChange={(e) => updateArrayItem('stripBottomWorks', idx, 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, marginBottom: '6px' }} />
                  <input value={work.category} onChange={(e) => updateArrayItem('stripBottomWorks', idx, 'category', e.target.value)} placeholder="Category" style={inputStyle} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: FEATURED 3 STORIES                                  */}
        {/* ======================================================== */}
        {activeTab === 'featured' && (
          <div>
            <SectionHeader 
              tag="SELECTED STORIES" 
              title="Featured Works Grid (3 Cards)" 
              sub="The 3 primary showcase cards placed on the homepage."
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {content.featuredWorks.map((item, idx) => (
                <div key={idx} style={boxCardStyle}>
                  <div style={{ position: 'relative', height: '200px', borderRadius: '10px', overflow: 'hidden', background: '#000', marginBottom: '14px' }}>
                    <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <label style={{ ...uploadButtonStyle, width: '100%', marginBottom: '14px' }}>
                    <Upload size={14} /> Upload Card Photo
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const url = await uploadToCloudinary(file);
                      if (url) updateArrayItem('featuredWorks', idx, 'img', url);
                    }} />
                  </label>
                  <label style={miniLabelStyle}>Card Title</label>
                  <input value={item.title} onChange={(e) => updateArrayItem('featuredWorks', idx, 'title', e.target.value)} style={inputStyle} />
                  <label style={miniLabelStyle}>Category</label>
                  <input value={item.category} onChange={(e) => updateArrayItem('featuredWorks', idx, 'category', e.target.value)} style={inputStyle} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: HOMEPAGE CONTENT                                    */}
        {/* ======================================================== */}
        {activeTab === 'hero' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <SectionHeader 
              tag="HEADER & INTRODUCTION" 
              title="Homepage Titles & Intro Story" 
              sub="Edit the opening typography and philosophy statement of Photo In Motion."
            />

            <div style={boxCardStyle}>
              <label style={labelStyle}>Hero Title (Use \n for line breaks)</label>
              <textarea value={content.heroTitle} onChange={(e) => setContent(p => ({ ...p, heroTitle: e.target.value }))} style={{ ...inputStyle, height: '80px' }} />

              <label style={labelStyle}>Hero Subtitle</label>
              <textarea value={content.heroSub} onChange={(e) => setContent(p => ({ ...p, heroSub: e.target.value }))} style={{ ...inputStyle, height: '80px' }} />

              <label style={labelStyle}>Story Section Heading</label>
              <textarea value={content.storyTitle} onChange={(e) => setContent(p => ({ ...p, storyTitle: e.target.value }))} style={{ ...inputStyle, height: '80px' }} />

              <label style={labelStyle}>Story Section Description</label>
              <textarea value={content.storyText} onChange={(e) => setContent(p => ({ ...p, storyText: e.target.value }))} style={{ ...inputStyle, height: '110px' }} />
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: TESTIMONIALS (6 ITEMS)                              */}
        {/* ======================================================== */}
        {activeTab === 'testimonials' && (
          <div>
            <SectionHeader 
              tag="CLIENT LOVE" 
              title="Client Testimonials (All 6)" 
              sub="Desktop rotates them 3-at-a-time every 4s; mobile slides through them 1-by-1."
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {content.testimonials.map((test, idx) => (
                <div key={idx} style={boxCardStyle}>
                  <span style={{ fontSize: '11px', color: 'var(--gold, #c6a46b)', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                    TESTIMONIAL #{idx + 1}
                  </span>
                  <label style={miniLabelStyle}>Client Couple / Individual</label>
                  <input value={test.name} onChange={(e) => updateArrayItem('testimonials', idx, 'name', e.target.value)} style={inputStyle} />
                  <label style={miniLabelStyle}>Testimonial Quote</label>
                  <textarea value={test.text} onChange={(e) => updateArrayItem('testimonials', idx, 'text', e.target.value)} style={{ ...inputStyle, height: '80px' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: PORTFOLIO & CATEGORIES                              */}
        {/* ======================================================== */}
        {activeTab === 'portfolio' && (
          <div>
            <SectionHeader 
              tag="PORTFOLIO DATABASE" 
              title="Client Portfolios & Categories" 
              sub="Add, edit, and organize client wedding & celebration photo albums."
            />

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '35px', flexWrap: 'wrap' }}>
              {content.categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setEditingClient(null); }}
                  style={{
                    padding: '10px 22px', borderRadius: '30px', border: 'none',
                    background: selectedCategory === cat ? 'var(--gold, #c6a46b)' : '#222',
                    color: selectedCategory === cat ? '#000' : '#fff',
                    cursor: 'pointer', fontWeight: 700, fontSize: '14px'
                  }}
                >
                  {cat}
                </button>
              ))}
              <button
                onClick={() => {
                  const newCat = prompt("Enter new category name:");
                  if (newCat && !content.categories.includes(newCat)) {
                    setContent(prev => ({ ...prev, categories: [...prev.categories, newCat] }));
                    setSelectedCategory(newCat);
                  }
                }}
                style={{ padding: '10px 20px', borderRadius: '30px', border: '2px dashed var(--gold, #c6a46b)', background: 'transparent', color: 'var(--gold, #c6a46b)', cursor: 'pointer', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <Plus size={16} /> Add Category
              </button>
            </div>

            {!editingClient ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {(content.portfolioItems || []).filter(item => item.category === selectedCategory).map(client => (
                  <div key={client.id} style={{ background: '#161616', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333' }}>
                    <img src={client.mainImage || 'https://via.placeholder.com/300'} alt={client.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                    <div style={{ padding: '18px' }}>
                      <h4 style={{ color: '#fff', margin: '0 0 10px', fontSize: '16px' }}>{client.title}</h4>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setEditingClient(client)} style={{ flex: 1, padding: '8px', background: 'var(--gold, #c6a46b)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontWeight: 600, fontSize: '13px' }}><Edit2 size={14} /> Edit</button>
                        <button onClick={() => {
                          if (window.confirm("Delete this portfolio?")) {
                            setContent(prev => ({ ...prev, portfolioItems: prev.portfolioItems.filter(i => i.id !== client.id) }));
                          }
                        }} style={{ padding: '8px 12px', background: 'rgba(255,0,0,0.2)', color: 'red', border: '1px solid red', borderRadius: '4px', cursor: 'pointer' }}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => {
                    const newClient = {
                      id: Date.now().toString(),
                      category: selectedCategory,
                      title: 'New Client Event',
                      description: 'Description...',
                      mainImage: '',
                      link: '/contact',
                      subCategories: selectedCategory === 'Wedding' ? { 'Engagement': [], 'Pre-Wedding': [], 'Mehendi & Haldi': [], 'Marriage': [], 'Reception': [] } : {}
                    };
                    setContent(prev => ({ ...prev, portfolioItems: [...prev.portfolioItems, newClient] }));
                    setEditingClient(newClient);
                  }}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '250px', cursor: 'pointer', color: 'var(--gold, #c6a46b)' }}
                >
                  <Plus size={36} style={{ marginBottom: '8px' }} />
                  <span>Add New {selectedCategory} Client</span>
                </button>
              </div>
            ) : (
              <div style={{ maxWidth: '800px', margin: '0 auto', background: '#161616', padding: '35px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <button onClick={() => setEditingClient(null)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', marginBottom: '18px' }}>← Back to List</button>
                <h3 style={{ color: '#fff', fontSize: '24px', margin: '0 0 20px' }}>Editing: {editingClient.title}</h3>

                <label style={labelStyle}>Event Title</label>
                <input value={editingClient.title} onChange={(e) => setEditingClient(prev => ({ ...prev, title: e.target.value }))} style={inputStyle} />

                <label style={labelStyle}>Description</label>
                <textarea value={editingClient.description} onChange={(e) => setEditingClient(prev => ({ ...prev, description: e.target.value }))} style={{ ...inputStyle, height: '80px' }} />

                <label style={labelStyle}>Cover Poster Image</label>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
                  {editingClient.mainImage && <img src={editingClient.mainImage} alt="Cover" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />}
                  <label style={uploadButtonStyle}>
                    <Upload size={14} /> Upload Cover
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const url = await uploadToCloudinary(file);
                      if (url) setEditingClient(prev => ({ ...prev, mainImage: url }));
                    }} />
                  </label>
                </div>

                {selectedCategory === 'Wedding' ? (
                  WEDDING_SUB_CATEGORIES.map(subCat => (
                    <div key={subCat} style={{ background: '#101010', padding: '16px', borderRadius: '8px', marginBottom: '14px' }}>
                      <h5 style={{ color: 'var(--gold, #c6a46b)', margin: '0 0 10px 0' }}>{subCat}</h5>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {(editingClient.subCategories?.[subCat] || []).map((img, i) => (
                          <div key={i} style={{ position: 'relative', width: '80px', height: '80px' }}>
                            <img src={img} alt="Thumb" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                            <button onClick={() => setEditingClient(prev => ({
                              ...prev,
                              subCategories: { ...prev.subCategories, [subCat]: prev.subCategories[subCat].filter((_, idx) => idx !== i) }
                            }))} style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'red', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '9px', cursor: 'pointer' }}>✕</button>
                          </div>
                        ))}
                        <label style={{ width: '80px', height: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--gold, #c6a46b)', borderRadius: '6px', cursor: 'pointer', color: 'var(--gold, #c6a46b)' }}>
                          <Plus size={18} />
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const url = await uploadToCloudinary(file);
                            if (url) {
                              setEditingClient(prev => ({
                                ...prev,
                                subCategories: { ...prev.subCategories, [subCat]: [...(prev.subCategories?.[subCat] || []), url] }
                              }));
                            }
                          }} />
                        </label>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ background: '#101010', padding: '16px', borderRadius: '8px', marginBottom: '14px' }}>
                    <h5 style={{ color: 'var(--gold, #c6a46b)', margin: '0 0 10px 0' }}>Gallery Photos</h5>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {(editingClient.subCategories?.['General'] || []).map((img, i) => (
                        <div key={i} style={{ position: 'relative', width: '80px', height: '80px' }}>
                          <img src={img} alt="Thumb" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                          <button onClick={() => setEditingClient(prev => ({
                            ...prev,
                            subCategories: { ...prev.subCategories, General: prev.subCategories.General.filter((_, idx) => idx !== i) }
                          }))} style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'red', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '9px', cursor: 'pointer' }}>✕</button>
                        </div>
                      ))}
                      <label style={{ width: '80px', height: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--gold, #c6a46b)', borderRadius: '6px', cursor: 'pointer', color: 'var(--gold, #c6a46b)' }}>
                        <Plus size={18} />
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const url = await uploadToCloudinary(file);
                          if (url) {
                            setEditingClient(prev => ({
                              ...prev,
                              subCategories: { ...prev.subCategories, General: [...(prev.subCategories?.General || []), url] }
                            }));
                          }
                        }} />
                      </label>
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => {
                    setContent(prev => ({
                      ...prev,
                      portfolioItems: prev.portfolioItems.map(i => i.id === editingClient.id ? editingClient : i)
                    }));
                    setEditingClient(null);
                  }}
                  style={{ width: '100%', padding: '12px', background: 'var(--gold, #c6a46b)', color: '#000', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer', marginTop: '16px' }}
                >
                  Save This Client Event
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

// Helpers & Styles
function SectionHeader({ tag, title, sub }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '35px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 14px', borderRadius: '999px', background: 'rgba(198, 164, 107, 0.08)', border: '1px solid rgba(198, 164, 107, 0.25)', color: 'var(--gold, #c6a46b)', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
        <Sparkles size={12} /> {tag}
      </div>
      <h2 style={{ fontFamily: 'var(--heading-font, serif)', fontSize: 'clamp(26px, 3.5vw, 40px)', color: '#fff', margin: '0 0 6px 0', fontWeight: 400 }}>
        {title}
      </h2>
      <p style={{ color: '#888', fontSize: '13px', margin: 0, maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto' }}>
        {sub}
      </p>
    </div>
  );
}

const boxCardStyle = {
  background: '#131313',
  border: '1px solid rgba(255, 255, 255, 0.07)',
  borderRadius: '14px',
  padding: '24px',
  marginBottom: '24px',
  display: 'flex',
  flexDirection: 'column'
};

const sectionHeadingStyle = {
  fontFamily: 'var(--heading-font, serif)',
  fontSize: '18px',
  color: '#fff',
  margin: '0 0 16px 0',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const labelStyle = { 
  display: 'block', 
  color: 'var(--gold, #c6a46b)', 
  marginBottom: '6px', 
  fontSize: '12.5px', 
  fontWeight: 600, 
  letterSpacing: '0.8px', 
  marginTop: '14px' 
};

const miniLabelStyle = {
  display: 'block',
  color: '#888',
  fontSize: '10.5px',
  letterSpacing: '0.5px',
  marginBottom: '4px',
  marginTop: '8px',
  textTransform: 'uppercase',
  fontWeight: 600
};

const inputStyle = { 
  width: '100%', 
  padding: '10px 12px', 
  background: '#090909', 
  border: '1px solid rgba(255, 255, 255, 0.1)', 
  borderRadius: '6px', 
  color: '#fff', 
  fontSize: '13px', 
  fontFamily: 'inherit', 
  outline: 'none',
  boxSizing: 'border-box'
};

const uploadButtonStyle = {
  padding: '9px 14px',
  background: 'var(--gold, #c6a46b)',
  color: '#000',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 700,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px'
};
