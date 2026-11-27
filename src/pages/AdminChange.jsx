import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Save, ArrowLeft, Upload, Loader2, Plus, Trash2, Edit2,
  Image as ImageIcon, Film, Video, Aperture, Camera, MessageSquare,
  Sparkles, Layers, BookOpen, Clock, ShieldCheck, Mail, CheckCircle2,
  Palette, X, AlertTriangle, Zap, Link2, CheckCircle, MessageCircle, Share2
} from 'lucide-react';

const CLOUDINARY_CLOUD_NAME = 'kwqsty9w';
const CLOUDINARY_UPLOAD_PRESET = 'portfolio_upload';
const WEDDING_SUB_CATEGORIES = ['Engagement', 'Pre-Wedding', 'Mehendi & Haldi', 'Marriage', 'Reception'];

const MAX_IMAGE_SIZE_MB = 10;
const MAX_VIDEO_SIZE_MB = 80;

const defaultContent = {
  // 1. HOMEPAGE: HERO & INTRO STORY
  heroTitle: 'Every Frame.\nA Timeless Story.',
  heroSub: "We don't just capture moments. We turn emotions, memories and beautiful stories into something that lasts forever.",
  storyTitle: 'Moments pass.\nStories stay forever.',
  storyText: 'At Photo In Motion, we believe every celebration has a story worth telling. Through thoughtful photography and cinematic filmmaking, we preserve the feelings behind every frame.',

  // 2. HOMEPAGE: FEATURED WORKS (3 CARDS)
  featuredWorks: [
    { number: '01', category: 'WEDDINGS', title: 'Forever Begins', img: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85' },
    { number: '02', category: 'CELEBRATIONS', title: 'Beautiful Together', img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85' },
    { number: '03', category: 'CINEMATIC FILMS', title: 'Beyond The Frame', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85' }
  ],

  // 3. HOMEPAGE: CINEMATIC FILM STRIP (CinematicStrip)
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

  // 4. HOMEPAGE: 360° ORBIT GALLERY (CinematicReveal)
  orbitMoments: [
    { id: 1, tag: "ROYAL WEDDING", title: "Forever Begins at Sacred Dusk", focal: "85mm • f/1.4 • ISO 100", desc: "Vows whispered beneath temple archways as the golden hour blesses every vow.", url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85", img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85", thumb: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80" },
    { id: 2, tag: "CINEMATIC HALDI", title: "Golden Petals & Joyous Tears", focal: "50mm • f/1.2 • ISO 200", desc: "Unbridled laughter and flying marigold showers captured in slow-motion warmth.", url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85", img: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85", thumb: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=300&q=80" },
    { id: 3, tag: "PRE-WEDDING DAWN", title: "Whispers Across The Mist", focal: "35mm • f/1.8 • ISO 160", desc: "Quiet intimacy framed by serene waters, morning reflections, and timeless poetry.", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85", img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85", thumb: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=300&q=80" },
    { id: 4, tag: "GRAND CELEBRATION", title: "The Euphoria of Royal Baraat", focal: "24mm • f/2.0 • ISO 400", desc: "High energy, celebratory drums, and kaleidoscopic colors frozen at peak motion.", url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85", thumb: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=300&q=80" },
    { id: 5, tag: "STARLIT RECEPTION", title: "First Dance Under Chandeliers", focal: "105mm • f/2.8 • ISO 800", desc: "Chandelier glints, velvet suits, and the quiet universe of two lovers dancing alone.", url: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=85", img: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=85", thumb: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=300&q=80" },
    { id: 6, tag: "SOUL PORTRAIT", title: "Elegance in The Mirror", focal: "85mm • f/1.4 • ISO 100", desc: "The bridal veil catching soft natural window light in profound stillness.", url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85", img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85", thumb: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=300&q=80" }
  ],

  // 5. HOMEPAGE: SHOWREEL VIDEOS & POSTERS
  showreels: [
    { id: 'reel-1', number: '01', title: 'The Royal Wedding Saga', category: 'WEDDINGS', location: 'Udaivilas, Udaipur', duration: '0:10', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', poster: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85', synopsis: 'A grand royal union captured in 4K anamorphic richness with intimate emotional cadences.' },
    { id: 'reel-2', number: '02', title: 'Golden Sunset Vows', category: 'PRE-WEDDING', location: 'Pashan Lake, Pune', duration: '0:10', videoUrl: 'https://assets.codepen.io/6093409/river.mp4', poster: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85', synopsis: 'Golden hour silhouettes, mist over water, and vows etched before the crowd arrives.' },
    { id: 'reel-3', number: '03', title: 'Euphoria of the Sangeet', category: 'CELEBRATIONS', location: 'Grand Hyatt, Mumbai', duration: '0:10', videoUrl: 'https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4', poster: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85', synopsis: 'Explosive lighting, choreographies, and raw dance floor joy immortalized in cinematic 120fps.' },
    { id: 'reel-4', number: '04', title: 'Marigold Showers & Sacred Haldi', category: 'RITUALS', location: 'Heritage Haveli, Jaipur', duration: '0:05', videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', poster: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85', synopsis: 'Flying turmeric powder, uninhibited laughter, and sacred blessings from elders.' },
    { id: 'reel-5', number: '05', title: 'Midnight Waltz & First Dance', category: 'RECEPTIONS', location: 'Taj Falaknuma, Hyderabad', duration: '0:10', videoUrl: 'https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4', poster: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=85', synopsis: 'Sparklers illuminate the twilight as the couple takes their inaugural dance as one.' }
  ],

  // 6. HOMEPAGE: DIRECTOR'S VIEWFINDER (EventPlanner)
  viewfinderShots: [
    { id: 'shot-01', lens: '85mm f/1.4', category: 'BRIDAL PORTRAITURE', focalName: 'The Signature Bokeh', desc: 'Creamy optical depth with tack-sharp focus on the bridal veil and eye highlights.', shutter: '1/500s', aperture: 'f/1.4', iso: 'ISO 100', kelvin: '5600K Daylight', imgGraded: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85', imgRaw: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=25' },
    { id: 'shot-02', lens: '24mm f/2.8', category: 'ROYAL VENUE & MANDAP', focalName: 'Architectural Grandeur', desc: 'Capturing the monumental scale of grand chandeliers, palace pillars, and floral ceilings.', shutter: '1/250s', aperture: 'f/4.0', iso: 'ISO 400', kelvin: '3200K Tungsten', imgGraded: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85', imgRaw: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=25' },
    { id: 'shot-03', lens: '50mm f/1.2', category: 'UNSTAGED CANDIDS', focalName: 'Joyous Marigold Haldi', desc: 'Freeze-motion laughter and flying marigold petals with natural human field of view.', shutter: '1/800s', aperture: 'f/1.8', iso: 'ISO 200', kelvin: '5200K Warm Sunlight', imgGraded: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85', imgRaw: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=25' },
    { id: 'shot-04', lens: '135mm f/2.0', category: 'INTIMATE TELEPHOTO', focalName: 'Stolen Glance in the Mist', desc: 'Unobtrusive compression from afar, preserving tender moments without intruding.', shutter: '1/640s', aperture: 'f/2.0', iso: 'ISO 640', kelvin: '4800K Golden Dawn', imgGraded: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85', imgRaw: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=25' },
    { id: 'shot-05', lens: '35mm f/1.4', category: 'EVENING RECEPTION GALA', focalName: 'The First Dance', desc: 'Cinematic wide-aperture capture of starlit waltzes and ambient venue spotlights.', shutter: '1/200s', aperture: 'f/1.4', iso: 'ISO 800', kelvin: '3800K Ambiance', imgGraded: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=85', imgRaw: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=25' },
    { id: 'shot-06', lens: '85mm f/1.4', category: 'EDITORIAL PORTRAIT', focalName: 'Serenity & Grace', desc: 'Studio-quality natural window sidelight highlighting jewelry and embroidery details.', shutter: '1/320s', aperture: 'f/1.6', iso: 'ISO 160', kelvin: '5500K Studio', imgGraded: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85', imgRaw: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=25' }
  ],

  // 7. HOMEPAGE: TESTIMONIALS (6 ITEMS)
  testimonials: [
    { name: 'Ananya & Rahul', text: 'They captured the essence of our wedding perfectly.' },
    { name: 'Sarah & James', text: 'The cinematic film they created for us is an absolute masterpiece.' },
    { name: 'Priya & Arjun', text: 'Professional, unobtrusive, and incredibly talented.' },
    { name: 'Neha & Vikram', text: "Every frame was a work of art. We couldn't be happier." },
    { name: 'Riya & Karan', text: 'They turned our special day into a cinematic experience.' },
    { name: 'Simran & Aditya', text: 'The attention to detail was flawless. Highly recommended!' }
  ],

  // 8. OUR STORY PAGE (COMPLETE STORY & FOUNDER INFO)
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

  // 9. CONTACT & ENQUIRY FORM OPTIONS
  eventTypes: ['Wedding', 'Baby Shower', 'Post Wedding', 'Car Delivery', 'Others'],
  budgetRanges: ['Under ₹50,000', '₹50,000 - ₹1,00,000', '₹1,00,000 - ₹3,00,000', 'Above ₹3,00,000'],
  enquiryServices: ['Photography', 'Cinematography', 'Drone / Aerial Coverage', 'Luxury Album Printing'],
  enquirySuccessTitle: 'Enquiry Received',
  enquirySuccessDesc: 'Thank you! We will review your details and get back to you within 24 hours.',
  invitationEyebrow: 'YOU ARE INVITED',
  invitationHeading: "Let's Create Magic Together",
  invitationCardTitle: 'Open Your Invitation',
  invitationCardSub: 'Click to start your booking enquiry.',
  invitationBtnText: 'Start Your Enquiry',
  processEyebrow: 'THE SEAMLESS PROCESS',
  processHeading: 'How We Work',
  processSteps: [
    { title: '1. Enquire', desc: 'Tell us about your event and vision.' },
    { title: '2. Consult', desc: 'We plan the perfect timeline together.' },
    { title: '3. Capture', desc: 'We film your day, seamlessly.' }
  ],
  contactCtaEyebrow: "LET'S CREATE SOMETHING TIMELESS",
  contactCtaHeading: "Your story deserves to be remembered.",
  contactCtaDesc: "Have a celebration coming up? Let's talk about how we can turn your moments into lasting memories.",
  contactCtaBtn: 'Start A Conversation',

  // 10. FLOATING CONTROLS & SOCIAL REDIRECTS
  contactEmail: 'photoinmotion.in@gmail.com',
  contactPhone: '+91-9692485219',
  whatsappPhone: '9692485219',
  whatsappMessage: 'Hi Photo In Motion, I visited your website and would like to know more about your photography services.',
  instagramUrl: 'https://instagram.com/hdmunu',
  youtubeUrl: 'https://youtube.com',
  linkedinUrl: 'https://linkedin.com',

  // 11. MULTI-CLIENT PORTFOLIO
  portfolioItems: [],
  categories: ['Wedding', 'Birthday', 'Corporate']
};

export default function AdminChange() {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadAssetType, setUploadAssetType] = useState('Image');
  const [uploadTheme, setUploadTheme] = useState('gold');

  const [toasts, setToasts] = useState([]);
  const toastTimeoutRef = useRef({});

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    file: null,
    resourceType: 'image',
    fileSizeMB: 0,
    maxAllowedMB: 10,
    onConfirm: null,
    onCancel: null
  });

  // Tabs: 'home' | 'about' | 'contact' | 'portfolio' | 'social'
  const [activeTab, setActiveTab] = useState('home');
  const [homeSubTab, setHomeSubTab] = useState('hero');

  const [selectedCategory, setSelectedCategory] = useState('Wedding');
  const [editingClient, setEditingClient] = useState(null);

  const navigate = useNavigate();

  const showToast = (toastObj) => {
    const id = toastObj.id || Date.now().toString();
    setToasts(prev => {
      const existingIdx = prev.findIndex(t => t.id === id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], ...toastObj, id };
        return updated;
      }
      return [...prev, { ...toastObj, id }];
    });

    if (toastObj.type === 'success' || toastObj.type === 'error' || toastObj.type === 'info') {
      if (toastTimeoutRef.current[id]) clearTimeout(toastTimeoutRef.current[id]);
      toastTimeoutRef.current[id] = setTimeout(() => {
        removeToast(id);
      }, toastObj.duration || 4500);
    }
    return id;
  };

  const removeToast = (id) => {
    if (toastTimeoutRef.current[id]) clearTimeout(toastTimeoutRef.current[id]);
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      navigate('/admin/login');
      return;
    }

    fetch('/api/enquiry?action=get_content')
      .then(res => res.json())
      .then(resData => {
        if (resData && Object.keys(resData).length > 0) {
          const data = resData.content || resData.data || resData;
          const merged = {
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
            eventTypes: data.eventTypes || defaultContent.eventTypes,
            budgetRanges: data.budgetRanges || defaultContent.budgetRanges,
            enquiryServices: data.enquiryServices || defaultContent.enquiryServices,
            processSteps: data.processSteps || defaultContent.processSteps,
            portfolioItems: data.portfolioItems || [],
            categories: data.categories || defaultContent.categories
          };
          setContent(merged);
          try {
            localStorage.setItem('site_content_cache', JSON.stringify(merged));
          } catch (e) {}
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
        try {
          localStorage.setItem('site_content_cache', JSON.stringify(content));
          localStorage.setItem('pim_portfolio_cache', JSON.stringify({
            portfolioItems: content.portfolioItems || [],
            categories: content.categories || ['Wedding', 'Birthday', 'Corporate']
          }));
        } catch (e) {
          console.warn('Could not cache content to localStorage:', e);
        }

        showToast({
          type: 'success',
          title: 'Changes Saved Successfully',
          message: 'All website content, animations & form configurations updated!',
          duration: 4000
        });
      } else {
        const err = await res.json();
        showToast({
          type: 'error',
          title: 'Save Failed',
          message: err.message || 'Could not persist changes to server.',
          duration: 5000
        });
      }
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Network Error',
        message: 'Could not connect to the backend server.',
        duration: 5000
      });
    }
    setSaving(false);
  };

  const detectVideoDuration = (fileOrUrl) => {
    return new Promise((resolve) => {
      try {
        const video = document.createElement('video');
        video.preload = 'metadata';
        const src = typeof fileOrUrl === 'string' ? fileOrUrl : URL.createObjectURL(fileOrUrl);
        video.src = src;

        video.onloadedmetadata = () => {
          if (typeof fileOrUrl !== 'string') URL.revokeObjectURL(src);
          const totalSec = Math.round(video.duration);
          if (isNaN(totalSec) || totalSec <= 0) return resolve(null);
          const mins = Math.floor(totalSec / 60);
          const secs = totalSec % 60;
          resolve(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
        };

        video.onerror = () => {
          if (typeof fileOrUrl !== 'string') URL.revokeObjectURL(src);
          resolve(null);
        };
      } catch (e) {
        resolve(null);
      }
    });
  };

  const compressImageInternally = (file, maxWidth = 2560, quality = 0.88) => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) return resolve(file);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) return resolve(file);
              const compressedFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, "") + ".jpg",
                { type: 'image/jpeg', lastModified: Date.now() }
              );
              resolve(compressedFile);
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    });
  };

  const executeCloudinaryUpload = (file, resourceType = 'image') => {
    return new Promise((resolve) => {
      if (!file) return resolve(null);

      const fileSizeMB = (file.size / (1024 * 1024));
      const typeLabel = resourceType === 'video' ? '4K Video' : 'Photo';
      const toastId = `upload-${Date.now()}`;

      setUploading(true);
      setUploadProgress(0);
      setUploadFileName(file.name);
      setUploadAssetType(typeLabel);

      showToast({
        id: toastId,
        type: 'uploading',
        title: `Uploading ${typeLabel}...`,
        fileName: file.name,
        fileSize: `${fileSizeMB.toFixed(2)} MB`,
        progress: 0,
        message: 'Streaming asset to Cloudinary CDN...'
      });

      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.min(99, Math.round((event.loaded / event.total) * 100));
          setUploadProgress(percent);

          showToast({
            id: toastId,
            type: 'uploading',
            title: `Uploading ${typeLabel} (${percent}%)`,
            fileName: file.name,
            fileSize: `${fileSizeMB.toFixed(2)} MB`,
            progress: percent,
            message: `${percent}% uploaded • ${(event.loaded / (1024 * 1024)).toFixed(1)} of ${fileSizeMB.toFixed(1)} MB`
          });
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            setUploadProgress(100);

            showToast({
              id: toastId,
              type: 'success',
              title: 'Upload Complete! (100%)',
              fileName: file.name,
              fileSize: `${fileSizeMB.toFixed(2)} MB`,
              progress: 100,
              message: `"${file.name}" uploaded & CDN optimized.`,
              duration: 4500
            });

            setTimeout(() => {
              setUploading(false);
              setUploadProgress(0);
              resolve(data.secure_url);
            }, 300);
          } catch (e) {
            setUploading(false);
            showToast({
              id: toastId,
              type: 'error',
              title: 'Upload Parsing Error',
              message: 'Failed to parse response payload from Cloudinary.',
              duration: 5000
            });
            resolve(null);
          }
        } else {
          setUploading(false);
          let errDetail = `Status code ${xhr.status}`;
          try {
            const errData = JSON.parse(xhr.responseText);
            if (errData.error?.message) errDetail = errData.error.message;
          } catch (e) {}

          showToast({
            id: toastId,
            type: 'error',
            title: 'Upload Failed',
            message: `Cloudinary error: ${errDetail}`,
            duration: 6000
          });
          resolve(null);
        }
      };

      xhr.onerror = () => {
        setUploading(false);
        showToast({
          id: toastId,
          type: 'error',
          title: 'Network Error During Upload',
          message: 'Connection was interrupted. Please check connection and retry.',
          duration: 6000
        });
        resolve(null);
      };

      const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;
      xhr.open('POST', endpoint, true);
      xhr.send(formData);
    });
  };

  const uploadToCloudinary = (file, resourceType = 'image') => {
    return new Promise((resolve) => {
      if (!file) return resolve(null);

      const fileSizeMB = file.size / (1024 * 1024);
      const maxAllowedMB = resourceType === 'video' ? MAX_VIDEO_SIZE_MB : MAX_IMAGE_SIZE_MB;

      if (fileSizeMB > maxAllowedMB) {
        setConfirmModal({
          isOpen: true,
          file,
          resourceType,
          fileSizeMB: parseFloat(fileSizeMB.toFixed(1)),
          maxAllowedMB,
          onConfirm: async () => {
            setConfirmModal(prev => ({ ...prev, isOpen: false }));

            if (resourceType === 'image') {
              showToast({
                type: 'info',
                title: 'Compressing Image Internally...',
                message: `Downscaling "${file.name}" to 4K web resolution without clarity loss...`,
                duration: 4000
              });

              const compressed = await compressImageInternally(file);
              const compressedSizeMB = (compressed.size / (1024 * 1024)).toFixed(1);

              showToast({
                type: 'success',
                title: 'Optimization Complete',
                message: `Internally reduced from ${fileSizeMB.toFixed(1)} MB to ${compressedSizeMB} MB with perfect visual clarity.`,
                duration: 4000
              });

              const url = await executeCloudinaryUpload(compressed, resourceType);
              resolve(url);
            } else {
              showToast({
                type: 'info',
                title: 'Adaptive Video Streaming',
                message: `Uploading 4K video (${fileSizeMB.toFixed(1)} MB) with Cloudinary adaptive bitrate compression.`,
                duration: 4000
              });

              const url = await executeCloudinaryUpload(file, resourceType);
              resolve(url);
            }
          },
          onCancel: () => {
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
            resolve(null);
          }
        });
      } else {
        executeCloudinaryUpload(file, resourceType).then(resolve);
      }
    });
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
    const url = await uploadToCloudinary(file, 'image');
    if (url) {
      setContent(prev => ({ ...prev, [stateKey]: url }));
    }
    e.target.value = '';
  };

  const handleItemMediaUpload = async (e, arrayKey, index, field, resourceType = 'image') => {
    const file = e.target.files[0];
    if (!file) return;

    if (resourceType === 'video') {
      const detectedDuration = await detectVideoDuration(file);
      if (detectedDuration) {
        updateArrayItem(arrayKey, index, 'duration', detectedDuration);
      }
    }

    const url = await uploadToCloudinary(file, resourceType);
    if (url) {
      updateArrayItem(arrayKey, index, field, url);
    }
    e.target.value = '';
  };

  // Helper for Orbit Moments so url, img, image, thumb are always in sync
  const handleOrbitPhotoUpload = async (file, idx) => {
    if (!file) return;
    const url = await uploadToCloudinary(file, 'image');
    if (url) {
      setContent(prev => {
        const updated = [...prev.orbitMoments];
        updated[idx] = {
          ...updated[idx],
          url,
          img: url,
          image: url,
          thumb: url
        };
        return { ...prev, orbitMoments: updated };
      });
    }
  };

  const handleShowreelUrlChange = async (url, idx) => {
    updateArrayItem('showreels', idx, 'videoUrl', url);
    if (!url || !url.trim()) return;

    const trimmed = url.trim();
    const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([a-zA-Z0-9_-]{11})/);
    if (ytMatch && ytMatch[1]) {
      const videoId = ytMatch[1];
      const ytThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      updateArrayItem('showreels', idx, 'poster', ytThumbnail);

      showToast({
        type: 'success',
        title: 'YouTube Video Detected',
        message: 'Auto-fetched HD YouTube thumbnail for video poster and linked stream.',
        duration: 4000
      });
      return;
    }

    const detectedDuration = await detectVideoDuration(trimmed);
    if (detectedDuration) {
      updateArrayItem('showreels', idx, 'duration', detectedDuration);
      showToast({
        type: 'info',
        title: 'Real Video Duration Detected',
        message: `Video length auto-calculated as ${detectedDuration}.`,
        duration: 3500
      });
    }
  };

  // Handler for deleting an entire category with confirmation
  const handleDeleteCategory = (catToDelete) => {
    if (content.categories.length <= 1) {
      alert("At least one category must remain.");
      return;
    }

    if (window.confirm(`Are you sure you want to delete the "${catToDelete}" category?`)) {
      const remainingCats = content.categories.filter(c => c !== catToDelete);
      setContent(prev => ({
        ...prev,
        categories: remainingCats,
        portfolioItems: prev.portfolioItems.filter(item => item.category !== catToDelete)
      }));

      if (selectedCategory === catToDelete) {
        setSelectedCategory(remainingCats[0]);
      }

      showToast({
        type: 'info',
        title: 'Category Deleted',
        message: `Category "${catToDelete}" has been removed.`,
        duration: 3500
      });
    }
  };

  if (loading) return <div style={{ color: '#fff', padding: '100px', textAlign: 'center' }}>Loading Admin Panel...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', paddingBottom: '120px' }}>

      {/* OVERSIZED FILE CONFIRMATION MODAL */}
      {confirmModal.isOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(14px)',
          zIndex: 999999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #181510, #0d0b08)',
            border: '1px solid rgba(198, 164, 107, 0.45)',
            boxShadow: '0 0 50px rgba(198, 164, 107, 0.25)',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '480px',
            width: '100%',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              background: 'rgba(198, 164, 107, 0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', color: 'var(--gold, #c6a46b)'
            }}>
              <Zap size={28} />
            </div>

            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', color: 'var(--gold, #c6a46b)', textTransform: 'uppercase' }}>
              Smart Internal Optimization
            </span>

            <h3 style={{ margin: '8px 0 10px', fontSize: '20px', color: '#fff', fontFamily: 'var(--heading-font, serif)' }}>
              File Size Above {confirmModal.maxAllowedMB} MB
            </h3>

            <p style={{ fontSize: '13px', color: '#ccc', lineHeight: 1.5, margin: '0 0 16px' }}>
              <strong style={{ color: '#fff' }}>"{confirmModal.file?.name}"</strong> is{' '}
              <span style={{ color: 'var(--gold, #c6a46b)', fontWeight: 700 }}>{confirmModal.fileSizeMB} MB</span>.
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={confirmModal.onCancel}
                style={{
                  padding: '10px 20px', borderRadius: '30px',
                  background: 'rgba(255,255,255,0.06)', color: '#aaa',
                  border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
                  fontWeight: 600, fontSize: '13px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmModal.onConfirm}
                style={{
                  padding: '10px 24px', borderRadius: '30px',
                  background: 'var(--gold, #c6a46b)', color: '#000',
                  border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontSize: '13px',
                  boxShadow: '0 4px 14px rgba(198, 164, 107, 0.4)'
                }}
              >
                Yes, Optimize & Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOASTS */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 99999, display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '420px', width: 'calc(100% - 48px)', pointerEvents: 'none' }}>
        {toasts.map(t => {
          const isUploading = t.type === 'uploading';
          const isSuccess = t.type === 'success';
          const isError = t.type === 'error';
          return (
            <div key={t.id} style={{
              pointerEvents: 'auto',
              background: isError ? 'rgba(24, 10, 10, 0.95)' : isSuccess ? 'rgba(10, 22, 14, 0.95)' : 'rgba(18, 16, 12, 0.95)',
              border: isError ? '1px solid rgba(239, 68, 68, 0.5)' : isSuccess ? '1px solid rgba(34, 197, 94, 0.5)' : '1px solid rgba(198, 164, 107, 0.45)',
              borderRadius: '14px', padding: '16px', color: '#fff'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: isError ? '#f87171' : isSuccess ? '#4ade80' : 'var(--gold, #c6a46b)' }}>{t.title}</span>
                <button onClick={() => removeToast(t.id)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><X size={14} /></button>
              </div>
              {t.message && <div style={{ fontSize: '12px', color: '#aaa' }}>{t.message}</div>}
            </div>
          );
        })}
      </div>

      {/* TOP BAR */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        background: 'rgba(10, 10, 10, 0.95)', backdropFilter: 'blur(12px)',
        zIndex: 100, padding: '16px 4%',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => navigate('/admin/dashboard')}
            style={{ background: 'none', border: 'none', color: 'var(--gold, #c6a46b)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}
          >
            <ArrowLeft size={18} /> Dashboard
          </button>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
          <span style={{ fontSize: '13px', color: '#888' }}>Photo In Motion Studio</span>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || uploading}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 22px', borderRadius: '30px',
            background: 'var(--gold, #c6a46b)', color: '#000',
            fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer',
            opacity: saving || uploading ? 0.6 : 1,
            boxShadow: '0 4px 14px rgba(198, 164, 107, 0.3)'
          }}
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Saving Everything...' : 'Save All Changes'}
        </button>
      </div>

      {/* PRIMARY PAGE NAVIGATION TABS */}
      <div style={{ paddingTop: '80px', background: '#111', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: '65px', zIndex: 90 }}>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '12px 4%', scrollbarWidth: 'none' }}>
          {[
            { id: 'home', label: '🏠 Home Page', sub: 'Hero, Showreels, Orbit, Viewfinder, Strip', icon: Sparkles },
            { id: 'about', label: '📖 About Page (Our Story)', sub: 'Heritage, Founder Munu, Milestones', icon: BookOpen },
            { id: 'contact', label: '✉️ Contact & Enquiry', sub: 'Invitation, Process, Event Types, Budget', icon: Mail },
            { id: 'portfolio', label: '📁 Portfolio Works', sub: 'Client galleries & categories', icon: Layers },
            { id: 'social', label: '💬 Modals & Social', sub: "Let's Talk, WhatsApp, Follow Us links", icon: Share2 }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                  padding: '10px 18px', borderRadius: '12px',
                  border: isActive ? '1px solid var(--gold, #c6a46b)' : '1px solid rgba(255,255,255,0.06)',
                  background: isActive ? 'rgba(198, 164, 107, 0.12)' : 'rgba(255,255,255,0.03)',
                  color: isActive ? 'var(--gold, #c6a46b)' : '#aaa',
                  cursor: 'pointer', whiteSpace: 'nowrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: 700, color: isActive ? '#fff' : '#ccc' }}>
                  <Icon size={16} color={isActive ? 'var(--gold, #c6a46b)' : '#888'} />
                  <span>{tab.label}</span>
                </div>
                <span style={{ fontSize: '11px', color: isActive ? 'var(--gold, #c6a46b)' : '#666', marginTop: '2px' }}>
                  {tab.sub}
                </span>
              </button>
            );
          })}
        </div>

        {/* SUB-TABS FOR HOME */}
        {activeTab === 'home' && (
          <div style={{ background: '#0d0d0d', borderTop: '1px solid rgba(255,255,255,0.04)', padding: '10px 4%', display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {[
              { id: 'hero', label: 'Hero & Intro', icon: Sparkles },
              { id: 'reels', label: '5 Living Showreels', icon: Video },
              { id: 'orbit', label: '360° Orbit Moments (6)', icon: Aperture },
              { id: 'viewfinder', label: "Director's Viewfinder (6)", icon: Camera },
              { id: 'strip', label: 'Cinematic Film Strip (10)', icon: Film },
              { id: 'featured', label: 'Featured 3 Stories', icon: ImageIcon },
              { id: 'testimonials', label: 'Testimonials (6)', icon: MessageSquare }
            ].map(sub => {
              const SubIcon = sub.icon;
              const isSubActive = homeSubTab === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setHomeSubTab(sub.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '6px 14px', borderRadius: '20px',
                    fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    background: isSubActive ? 'var(--gold, #c6a46b)' : 'rgba(255,255,255,0.04)',
                    color: isSubActive ? '#000' : '#aaa',
                    border: isSubActive ? '1px solid var(--gold, #c6a46b)' : '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <SubIcon size={13} />
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ padding: '40px 4%', maxWidth: '1200px', margin: '0 auto' }}>

        {/* 1. HOME TAB */}
        {activeTab === 'home' && (
          <div>
            {homeSubTab === 'hero' && (
              <div style={boxCardStyle}>
                <h3 style={sectionHeadingStyle}><Sparkles size={18} color="var(--gold, #c6a46b)" /> Hero Headlines</h3>
                <label style={labelStyle}>Hero Main Headline</label>
                <textarea value={content.heroTitle} onChange={(e) => setContent(p => ({ ...p, heroTitle: e.target.value }))} style={{ ...inputStyle, height: '70px' }} />
                <label style={labelStyle}>Hero Subheading</label>
                <textarea value={content.heroSub} onChange={(e) => setContent(p => ({ ...p, heroSub: e.target.value }))} style={{ ...inputStyle, height: '80px' }} />
              </div>
            )}

            {/* 360° ORBIT APERTURE MOMENTS */}
            {homeSubTab === 'orbit' && (
              <div>
                <SectionHeader tag="ORBIT ENGINE" title="6 Orbit Satellite Moments" sub="Upload photos. Changes reflect immediately on the Home page." />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
                  {content.orbitMoments.map((m, idx) => (
                    <div key={m.id || idx} style={boxCardStyle}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gold, #c6a46b)' }}>ORBIT SATELLITE #{idx + 1}</span>
                        <span style={{ fontSize: '10px', color: '#999', background: '#1c1c1c', padding: '2px 6px', borderRadius: '4px' }}>{m.tag}</span>
                      </div>

                      <div style={{ position: 'relative', width: '100%', height: '170px', borderRadius: '8px', overflow: 'hidden', background: '#000', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <img src={m.url || m.img} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>

                      <label style={{ ...uploadButtonStyle, width: '100%', marginBottom: '14px' }}>
                        <Upload size={13} /> Upload High-Res Moment Photo
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleOrbitPhotoUpload(e.target.files[0], idx)} />
                      </label>

                      <label style={miniLabelStyle}>Moment Tag</label>
                      <input value={m.tag} onChange={(e) => updateArrayItem('orbitMoments', idx, 'tag', e.target.value)} style={inputStyle} />
                      <label style={miniLabelStyle}>Moment Title</label>
                      <input value={m.title} onChange={(e) => updateArrayItem('orbitMoments', idx, 'title', e.target.value)} style={inputStyle} />
                      <label style={miniLabelStyle}>Camera Telemetry</label>
                      <input value={m.focal} onChange={(e) => updateArrayItem('orbitMoments', idx, 'focal', e.target.value)} style={inputStyle} />
                      <label style={miniLabelStyle}>Description</label>
                      <textarea value={m.desc} onChange={(e) => updateArrayItem('orbitMoments', idx, 'desc', e.target.value)} style={{ ...inputStyle, height: '60px' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SHOWREELS */}
            {homeSubTab === 'reels' && (
              <div>
                <SectionHeader tag="SHOWREEL PLAYER" title="5 Living Portfolio Showreels" sub="Manage video URLs, posters, and durations." />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
                  {content.showreels.map((reel, idx) => (
                    <div key={reel.id || idx} style={boxCardStyle}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gold, #c6a46b)' }}>REEL #{reel.number}</span>
                      <div style={{ position: 'relative', width: '100%', height: '160px', borderRadius: '8px', overflow: 'hidden', background: '#000', margin: '10px 0' }}>
                        <img src={reel.poster} alt={reel.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                        <label style={{ ...uploadButtonStyle, flex: 1, fontSize: '11px' }}>
                          <Upload size={12} /> Poster
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleItemMediaUpload(e, 'showreels', idx, 'poster', 'image')} />
                        </label>
                        <label style={{ ...uploadButtonStyle, flex: 1, fontSize: '11px', background: '#222', color: '#fff', border: '1px solid #444' }}>
                          <Video size={12} /> Video
                          <input type="file" accept="video/*" style={{ display: 'none' }} onChange={(e) => handleItemMediaUpload(e, 'showreels', idx, 'videoUrl', 'video')} />
                        </label>
                      </div>
                      <label style={miniLabelStyle}>Title</label>
                      <input value={reel.title} onChange={(e) => updateArrayItem('showreels', idx, 'title', e.target.value)} style={inputStyle} />
                      <label style={miniLabelStyle}>Video URL (Cloudinary / YouTube / MP4)</label>
                      <input value={reel.videoUrl} onChange={(e) => handleShowreelUrlChange(e.target.value, idx)} style={inputStyle} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. PORTFOLIO TAB WITH CATEGORY DELETE */}
        {activeTab === 'portfolio' && (
          <div>
            <SectionHeader tag="PORTFOLIO DATABASE" title="Client Portfolios & Categories" sub="Add, edit, or delete categories and client portfolios." />

            {/* Category Navigation Pills with DELETE (X) Buttons */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '35px', flexWrap: 'wrap' }}>
              {content.categories.map(cat => (
                <div
                  key={cat}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    borderRadius: '30px',
                    background: selectedCategory === cat ? 'var(--gold, #c6a46b)' : '#222',
                    padding: '2px 4px 2px 16px',
                    border: '1px solid ' + (selectedCategory === cat ? 'var(--gold, #c6a46b)' : '#333')
                  }}
                >
                  <button
                    onClick={() => { setSelectedCategory(cat); setEditingClient(null); }}
                    style={{
                      background: 'none', border: 'none',
                      color: selectedCategory === cat ? '#000' : '#fff',
                      cursor: 'pointer', fontWeight: 700, fontSize: '13.5px', padding: '8px 6px 8px 0'
                    }}
                  >
                    {cat}
                  </button>

                  {/* CATEGORY DELETE BUTTON */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat); }}
                    style={{
                      background: selectedCategory === cat ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.08)',
                      border: 'none',
                      color: selectedCategory === cat ? '#900' : '#ff6666',
                      borderRadius: '50%',
                      width: '22px', height: '22px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', marginLeft: '6px'
                    }}
                    title={`Delete category "${cat}"`}
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                onClick={() => {
                  const newCat = prompt("Enter new category name:");
                  if (newCat && !content.categories.includes(newCat)) {
                    setContent(prev => ({ ...prev, categories: [...prev.categories, newCat] }));
                    setSelectedCategory(newCat);
                  }
                }}
                style={{ padding: '8px 18px', borderRadius: '30px', border: '2px dashed var(--gold, #c6a46b)', background: 'transparent', color: 'var(--gold, #c6a46b)', cursor: 'pointer', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <Plus size={15} /> Add Category
              </button>
            </div>

            {/* CLIENT ALBUMS */}
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
                          if (window.confirm("Delete this client event?")) {
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

                <label style={labelStyle}>Cover Image</label>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
                  {editingClient.mainImage && <img src={editingClient.mainImage} alt="Cover" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />}
                  <label style={uploadButtonStyle}>
                    <Upload size={14} /> Upload Cover
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const url = await uploadToCloudinary(file, 'image');
                      if (url) setEditingClient(prev => ({ ...prev, mainImage: url }));
                      e.target.value = '';
                    }} />
                  </label>
                </div>

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

        {/* 3. DEDICATED SOCIAL & MODALS TAB */}
        {activeTab === 'social' && (
          <div>
            <SectionHeader tag="CONTACT & FLOATING CONTROLS" title="Let's Talk, WhatsApp & Follow Us Settings" sub="Control all phone numbers, email addresses, and social media redirect URLs." />

            <div style={boxCardStyle}>
              <h3 style={sectionHeadingStyle}><Mail size={18} color="var(--gold, #c6a46b)" /> 1. 'Let's Talk' Modal Contact Details</h3>
              <label style={labelStyle}>Email Address (For Email Us button)</label>
              <input value={content.contactEmail} onChange={(e) => setContent(p => ({ ...p, contactEmail: e.target.value }))} style={inputStyle} />

              <label style={labelStyle}>Display Phone & Call Us Number</label>
              <input value={content.contactPhone} onChange={(e) => setContent(p => ({ ...p, contactPhone: e.target.value }))} style={inputStyle} />
            </div>

            <div style={boxCardStyle}>
              <h3 style={sectionHeadingStyle}><MessageCircle size={18} color="#25D366" /> 2. Floating WhatsApp Button</h3>
              <label style={labelStyle}>WhatsApp Phone Number (with Country Code, no + or spaces)</label>
              <input value={content.whatsappPhone} placeholder="e.g. 919692485219" onChange={(e) => setContent(p => ({ ...p, whatsappPhone: e.target.value }))} style={inputStyle} />

              <label style={labelStyle}>Pre-filled WhatsApp Message</label>
              <textarea value={content.whatsappMessage} onChange={(e) => setContent(p => ({ ...p, whatsappMessage: e.target.value }))} style={{ ...inputStyle, height: '70px' }} />
            </div>

            <div style={boxCardStyle}>
              <h3 style={sectionHeadingStyle}><Share2 size={18} color="var(--gold, #c6a46b)" /> 3. Floating 'Follow Us' Social Links</h3>
              <label style={labelStyle}>Instagram Profile URL</label>
              <input value={content.instagramUrl} placeholder="https://instagram.com/yourhandle" onChange={(e) => setContent(p => ({ ...p, instagramUrl: e.target.value }))} style={inputStyle} />

              <label style={labelStyle}>YouTube Channel URL</label>
              <input value={content.youtubeUrl} placeholder="https://youtube.com/@yourchannel" onChange={(e) => setContent(p => ({ ...p, youtubeUrl: e.target.value }))} style={inputStyle} />

              <label style={labelStyle}>LinkedIn Company / Profile URL</label>
              <input value={content.linkedinUrl} placeholder="https://linkedin.com/in/yourhandle" onChange={(e) => setContent(p => ({ ...p, linkedinUrl: e.target.value }))} style={inputStyle} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function SectionHeader({ tag, title, sub }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '35px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 14px', borderRadius: '999px', background: 'rgba(198, 164, 107, 0.08)', border: '1px solid rgba(198, 164, 107, 0.25)', color: 'var(--gold, #c6a46b)', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
        <Sparkles size={12} /> {tag}
      </div>
      <h2 style={{ fontFamily: 'var(--heading-font, serif)', fontSize: 'clamp(26px, 3.5vw, 40px)', color: '#fff', margin: '0 0 6px 0', fontWeight: 400 }}>{title}</h2>
      <p style={{ color: '#888', fontSize: '13px', margin: 0, maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto' }}>{sub}</p>
    </div>
  );
}

const boxCardStyle = { background: '#131313', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '14px', padding: '24px', marginBottom: '24px', display: 'flex', flexDirection: 'column' };
const sectionHeadingStyle = { fontFamily: 'var(--heading-font, serif)', fontSize: '18px', color: '#fff', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' };
const labelStyle = { display: 'block', color: 'var(--gold, #c6a46b)', marginBottom: '6px', fontSize: '12.5px', fontWeight: 600, letterSpacing: '0.8px', marginTop: '14px' };
const miniLabelStyle = { display: 'block', color: '#888', fontSize: '10.5px', letterSpacing: '0.5px', marginBottom: '4px', marginTop: '8px', textTransform: 'uppercase', fontWeight: 600 };
const inputStyle = { width: '100%', padding: '10px 12px', background: '#090909', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
const uploadButtonStyle = { padding: '9px 14px', background: 'var(--gold, #c6a46b)', color: '#000', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', border: 'none' };
