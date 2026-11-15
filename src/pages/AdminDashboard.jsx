import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Mail, Phone, Calendar, MapPin, DollarSign, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

   useEffect(() => {
    const fetchEnquiries = async () => {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        navigate('/admin/login');
        return;
      }

      try {
        const res = await fetch('/api/get-enquiries', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        // If the token is invalid or expired, force a logout
        if (res.status === 401) {
          localStorage.removeItem('adminToken');
          alert("Your session expired. Please log in again.");
          navigate('/admin/login');
          return;
        }

        if (res.ok) {
          const data = await res.json();
          setEnquiries(data);
        } else {
          const errData = await res.json();
          alert(`Failed to load data: ${errData.message}`);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        alert("Network error. Check your connection.");
      }
      setLoading(false);
    };

    fetchEnquiries();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  if (loading) return <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>Loading Enquiries...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '40px 5%', paddingTop: '120px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--heading-font)', fontSize: '36px', color: 'var(--white)', margin: 0 }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--muted)', margin: '5px 0 0' }}>Manage your client enquiries</p>
        </div>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', color: 'var(--white)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: '#171717', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ color: 'var(--muted)', margin: '0 0 10px', fontSize: '14px' }}>Total Enquiries</p>
          <h3 style={{ color: 'var(--white)', margin: 0, fontSize: '32px', fontFamily: 'var(--heading-font)' }}>{enquiries.length}</h3>
        </div>
      </div>

      {enquiries.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>No enquiries yet. Share your website to get started!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {enquiries.map((enq) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
              key={enq._id} 
              style={{ background: '#171717', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}
            >
              <div style={{ position: 'absolute', top: '20px', right: '20px', color: 'var(--gold)' }}>
                <Clock size={20} />
              </div>
              
              <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '26px', color: 'var(--gold)', margin: '0 0 20px' }}>{enq.name}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text)', fontSize: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Mail size={16} color="var(--muted)"/> {enq.email}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Phone size={16} color="var(--muted)"/> {enq.phone}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Calendar size={16} color="var(--muted)"/> {enq.eventDate} ({enq.eventType})</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><MapPin size={16} color="var(--muted)"/> {enq.location}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><DollarSign size={16} color="var(--muted)"/> Budget: {enq.budget}</div>
              </div>

              {enq.requirements && (
                <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', fontSize: '13px', color: 'var(--muted)', fontStyle: 'italic', borderLeft: '2px solid var(--gold)' }}>
                  "{enq.requirements}"
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}