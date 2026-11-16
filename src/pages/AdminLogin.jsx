import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
      <div style={{ background: '#171717', padding: '50px 40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ margin: '0 auto 20px', color: 'var(--gold)' }}><Lock size={40} /></div>
        <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '36px', color: 'var(--white)', margin: '0 0 30px' }}>Admin Access</h2>
        
        <button 
          onClick={() => navigate('/admin/dashboard')} 
          className="primary-btn" 
          style={{ width: '100%', justifyContent: 'center' }}
        >
          View Dashboard
        </button>
      </div>
    </div>
  );
}