import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Mail, Phone, Calendar, MapPin, DollarSign, Clock, Edit } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const adminName = localStorage.getItem('adminName');

    useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      navigate('/admin/login');
      return;
    }

    // Load instantly from cache
    const cachedData = localStorage.getItem('enquiriesCache');
    if (cachedData) {
      setEnquiries(JSON.parse(cachedData));
      setLoading(false);
    }

    // Fetch real data in the background
    fetch('/api/enquiry?action=get_enquiries')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEnquiries(data);
          localStorage.setItem('enquiriesCache', JSON.stringify(data));
        }
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminName');
    navigate('/admin/login');
  };

  if (loading) return <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>Loading Enquiries...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '40px 5%', paddingTop: '120px' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--heading-font)', fontSize: '36px', color: 'var(--white)', margin: 0 }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--muted)', margin: '5px 0 0' }}>Welcome back, <span style={{ color: 'var(--gold)' }}>{adminName}</span></p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => navigate('/admin_change')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--gold)', color: '#111', border: 'none', padding: '10px 20px', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer' }}>
            <Edit size={16} /> Edit Website Content
          </button>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', color: 'var(--white)', borderRadius: '8px', cursor: 'pointer' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <h2 style={{ color: 'var(--white)', fontFamily: 'var(--heading-font)', fontSize: '24px', marginBottom: '20px' }}>Total Enquiries: {enquiries.length}</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {enquiries.map((enq) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            key={enq._id}
            style={{ background: '#171717', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div style={{ position: 'absolute', top: '20px', right: '20px', color: 'var(--gold)' }}>
              <Clock size={20} />
            </div>
            <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '26px', color: 'var(--gold)', margin: '0 0 20px' }}>{enq.name}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text)', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Mail size={16} color="var(--muted)" /> {enq.email}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Phone size={16} color="var(--muted)" /> {enq.phone}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Calendar size={16} color="var(--muted)" /> {enq.eventDate} ({enq.eventType})</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><MapPin size={16} color="var(--muted)" /> {enq.location || 'N/A'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><DollarSign size={16} color="var(--muted)" /> Budget: {enq.budget}</div>
            </div>
            {enq.requirements && (
              <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', fontSize: '13px', color: 'var(--muted)', fontStyle: 'italic', borderLeft: '2px solid var(--gold)' }}>
                "{enq.requirements}"
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}