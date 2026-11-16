import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminChange() {
  const [content, setContent] = useState({
    heroTitle: 'Every Frame.\nA Timeless Story.',
    heroSub: "We don't just capture moments. We turn emotions, memories and beautiful stories into something that lasts forever.",
    storyTitle: 'Moments pass.\nStories stay forever.',
    storyText: 'At Photo In Motion, we believe every celebration has a story worth telling. Through thoughtful photography and cinematic filmmaking, we preserve the feelings behind every frame.',
    testimonial1: 'They captured the essence of our wedding perfectly.',
    testimonial2: 'The cinematic film they created for us is an absolute masterpiece.',
    testimonial3: 'Professional, unobtrusive, and incredibly talented.'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If not logged in, go to login
    if (localStorage.getItem('isAdmin') !== 'true') {
      navigate('/admin/login');
      return;
    }
    
    // Fetch existing content
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
        alert('Website content updated successfully!');
      } else {
        alert('Failed to save changes.');
      }
    } catch (err) {
      alert('Network error.');
    }
    setSaving(false);
  };

  if (loading) return <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '40px 10%', paddingTop: '120px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
        <div>
          <button onClick={() => navigate('/admin/dashboard')} style={{ background: 'none', border: 'none', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', marginBottom: '10px' }}>
            ← Back to Dashboard
          </button>
          <h1 style={{ fontFamily: 'var(--heading-font)', fontSize: '36px', color: 'var(--white)', margin: 0 }}>Edit Website Content</h1>
        </div>
        <button onClick={handleSave} disabled={saving} className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '800px' }}>
        <div>
          <label style={labelStyle}>Hero Title</label>
          <textarea value={content.heroTitle} onChange={(e) => setContent({...content, heroTitle: e.target.value})} style={textareaStyle} rows={2} />
        </div>
        <div>
          <label style={labelStyle}>Hero Description</label>
          <textarea value={content.heroSub} onChange={(e) => setContent({...content, heroSub: e.target.value})} style={textareaStyle} rows={3} />
        </div>
        <div>
          <label style={labelStyle}>Story Section Title</label>
          <textarea value={content.storyTitle} onChange={(e) => setContent({...content, storyTitle: e.target.value})} style={textareaStyle} rows={2} />
        </div>
        <div>
          <label style={labelStyle}>Story Section Description</label>
          <textarea value={content.storyText} onChange={(e) => setContent({...content, storyText: e.target.value})} style={textareaStyle} rows={4} />
        </div>
        <div>
          <label style={labelStyle}>Testimonial 1 (Ananya & Rahul)</label>
          <textarea value={content.testimonial1} onChange={(e) => setContent({...content, testimonial1: e.target.value})} style={textareaStyle} rows={2} />
        </div>
        <div>
          <label style={labelStyle}>Testimonial 2 (Sarah & James)</label>
          <textarea value={content.testimonial2} onChange={(e) => setContent({...content, testimonial2: e.target.value})} style={textareaStyle} rows={2} />
        </div>
        <div>
          <label style={labelStyle}>Testimonial 3 (Priya & Arjun)</label>
          <textarea value={content.testimonial3} onChange={(e) => setContent({...content, testimonial3: e.target.value})} style={textareaStyle} rows={2} />
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', color: 'var(--gold)', marginBottom: '10px', fontSize: '14px', letterSpacing: '1px' };
const textareaStyle = { width: '100%', padding: '15px', background: '#171717', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '15px', fontFamily: 'var(--body-font)', outline: 'none', resize: 'vertical' };