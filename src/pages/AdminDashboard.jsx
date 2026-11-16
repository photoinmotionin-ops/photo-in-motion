import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Calendar, MapPin, DollarSign, LogOut } from 'lucide-react';

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

    fetch('/api/enquiry')
      .then((res) => res.json())
      .then((data) => {
        setEnquiries(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
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
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', color: 'var(--white)', borderRadius: '8px', cursor: 'pointer' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      <h2 style={{ color: 'var(--white)', fontFamily: 'var(--heading-font)', fontSize: '24px', marginBottom: '20px' }}>Total Enquiries: {enquiries.length}</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {enquiries.map((enq) => (
          <div key={enq._id} style={{ background: '#171717', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '26px', color: 'var(--gold)', margin: '0 0 20px' }}>{enq.name}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text)', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Mail size={16} /> {enq.email}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Phone size={16} /> {enq.phone}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Calendar size={16} /> {enq.eventDate} ({enq.eventType})</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><MapPin size={16} /> {enq.location || 'N/A'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><DollarSign size={16} /> {enq.budget}</div>
            </div>
            {enq.requirements && (
              <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', fontSize: '13px', color: 'var(--muted)', fontStyle: 'italic' }}>
                "{enq.requirements}"
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}