import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Mail, Phone, Calendar, MapPin, DollarSign, Clock, Edit, Trash2, MessageCircle, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper to format date nicely
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function AdminDashboard() {
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('All'); // 'All', 'Today', 'Yesterday'
  const [deleteId, setDeleteId] = useState(null); // For Modal
  
  const navigate = useNavigate();
  const adminName = localStorage.getItem('adminName');

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      navigate('/admin/login');
      return;
    }

    const cachedData = localStorage.getItem('enquiriesCache');
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      setEnquiries(parsed);
      setFilteredEnquiries(parsed);
      setLoading(false);
    }

    fetch('/api/enquiry?action=get_enquiries')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEnquiries(data);
          setFilteredEnquiries(data);
          localStorage.setItem('enquiriesCache', JSON.stringify(data));
        }
        setLoading(false);
      });
  }, [navigate]);

  // Handle Filtering Logic
  useEffect(() => {
    if (filterDate === 'All') {
      setFilteredEnquiries(enquiries);
    } else {
      const filtered = enquiries.filter(enq => {
        const createdDate = new Date(enq.createdAt);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (filterDate === 'Today') return createdDate.toDateString() === today.toDateString();
        if (filterDate === 'Yesterday') return createdDate.toDateString() === yesterday.toDateString();
        
        // For specific dates
        if (filterDate === createdDate.toISOString().split('T')[0]) return true;
        return false;
      });
      setFilteredEnquiries(filtered);
    }
  }, [filterDate, enquiries]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminName');
    navigate('/admin/login');
  };

  const confirmDelete = () => {
    // Here you would call your API to delete from MongoDB
    // For now, we just remove it from local state to show the UI working
    const updated = enquiries.filter(e => e._id !== deleteId);
    setEnquiries(updated);
    setFilteredEnquiries(updated);
    localStorage.setItem('enquiriesCache', JSON.stringify(updated));
    
    // alert(`Enquiry deleted! API call needed to remove from DB.`);
    setDeleteId(null);
  };

  const handleReply = (phone) => {
    window.open(`https://wa.me/${phone}`, '_blank');
  };

  if (loading) return <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>Loading Enquiries...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '40px 5%', paddingTop: '120px' }}>
      
      {/* DELETE MODAL */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteId(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 999 }} />
            <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, pointerEvents: 'none' }}>
              <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} style={{ pointerEvents: 'auto', background: '#171717', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255, 77, 77, 0.1)', color: '#ff4d4d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <AlertTriangle size={30} />
                </div>
                <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '28px', color: 'var(--white)', margin: '0 0 10px' }}>Delete Enquiry?</h3>
                <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '30px' }}>Are you sure you want to delete this enquiry? This action cannot be undone.</p>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--white)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                  <button onClick={confirmDelete} style={{ flex: 1, padding: '12px', background: '#ff4d4d', border: 'none', color: 'var(--white)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Yes, Delete</button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* HEADER */}
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

      {/* FILTER & COUNT */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '20px' }}>
        <h2 style={{ color: 'var(--white)', fontFamily: 'var(--heading-font)', fontSize: '24px', margin: 0 }}>Total Enquiries: {filteredEnquiries.length}</h2>
        
        {/* DATE FILTER DROPDOWN */}
        <div className="custom-select-wrapper" style={{ width: '250px' }}>
          <select 
            value={filterDate} 
            onChange={(e) => setFilterDate(e.target.value)}
            className="custom-select"
            style={{ width: '100%', padding: '12px', background: '#171717', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--white)', fontSize: '14px', outline: 'none', cursor: 'pointer', appearance: 'none' }}
          >
            <option value="All">All Dates</option>
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
            {/* Option to pick a specific date */}
            <option value={new Date().toISOString().split('T')[0]}>Specific Date (Today)</option>
          </select>
        </div>
      </div>

      {/* ENQUIRIES GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {filteredEnquiries.map((enq) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            key={enq._id}
            style={{ background: '#171717', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', display: 'flex', flexDirection: 'column' }}
          >
            
            {/* HEADER: Created Date & Icon */}
            <div style={{ position: 'absolute', top: '20px', right: '20px', textAlign: 'right' }}>
              <span style={{ display: 'block', color: 'var(--gold)', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Created: {formatDate(enq.createdAt)}
              </span>
              <Clock size={16} color="var(--muted)" style={{ marginTop: '5px', marginLeft: 'auto' }} />
            </div>

            <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '26px', color: 'var(--gold)', margin: '0 0 20px' }}>{enq.name}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text)', fontSize: '14px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Mail size={16} color="var(--muted)" /> {enq.email}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Phone size={16} color="var(--muted)" /> {enq.phone}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Calendar size={16} color="var(--muted)" /> {enq.eventDate} ({enq.eventType})</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><MapPin size={16} color="var(--muted)" /> {enq.location || 'N/A'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><DollarSign size={16} color="var(--muted)" /> Budget: {enq.budget}</div>
            </div>

            {(enq.otherDescription || enq.requirements) && (
              <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', fontSize: '13px', color: 'var(--muted)', fontStyle: 'italic', borderLeft: '2px solid var(--gold)' }}>
                "{enq.otherDescription || enq.requirements}"
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '25px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
              <button onClick={() => handleReply(enq.phone)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(37, 211, 102, 0.1)', color: '#25D366', border: '1px solid rgba(37, 211, 102, 0.3)', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                <MessageCircle size={16} /> Reply
              </button>
              <button onClick={() => setDeleteId(enq._id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 0, 0, 0.1)', color: '#ff4d4d', border: '1px solid rgba(255, 0, 0, 0.3)', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer' }} title="Delete Enquiry">
                <Trash2 size={16} />
              </button>
            </div>

          </motion.div>
        ))}
      </div>
    </div>
  );
}