import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid password');
      }
    } catch (err) {
      setError('Something went wrong. Try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', padding: '20px' }}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} 
        style={{ background: '#171717', padding: '50px 40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}
      >
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(198, 164, 107, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--gold)' }}>
          <Lock size={30} />
        </div>
        <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '36px', color: 'var(--white)', margin: '0 0 30px' }}>Admin Login</h2>
        
        {error && <p style={{ color: '#ff4d4d', marginBottom: '20px', fontSize: '14px' }}>{error}</p>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input 
            type="password" placeholder="Enter Admin Password" value={password} onChange={(e) => setPassword(e.target.value)} required 
            style={{ padding: '15px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} 
          />
          <button type="submit" className="primary-btn" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Verifying...' : 'Login'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}