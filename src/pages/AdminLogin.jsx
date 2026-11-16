import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';

export default function AdminLogin() {
  const [view, setView] = useState('login'); // 'login' | 'forgot' | 'reset'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', username, password })
    });
    const data = await res.json();
    
    if (res.ok) {
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminName', data.username);
      navigate('/admin/dashboard');
    } else {
      setError(data.message);
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const res = await fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'request_otp', username })
    });
    const data = await res.json();
    
    if (res.ok) {
      setMessage('OTP sent to your email!');
      setView('reset');
    } else {
      setError(data.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const res = await fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reset_password', username, otp, newPassword })
    });
    const data = await res.json();
    
    if (res.ok) {
      setMessage('Password reset successfully! You can login now.');
      setView('login');
      setOtp('');
      setNewPassword('');
      setPassword('');
    } else {
      setError(data.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
      <div style={{ background: '#171717', padding: '50px 40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--gold)' }}>
          {view === 'login' ? <Lock size={40} style={{ margin: '0 auto' }} /> : <Mail size={40} style={{ margin: '0 auto' }} />}
        </div>
        
        <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '32px', color: 'var(--white)', textAlign: 'center', marginBottom: '20px' }}>
          {view === 'login' ? 'Admin Login' : view === 'forgot' ? 'Forgot Password' : 'Reset Password'}
        </h2>

        {message && <p style={{ color: '#4dff88', textAlign: 'center', fontSize: '14px', marginBottom: '15px' }}>{message}</p>}
        {error && <p style={{ color: '#ff4d4d', textAlign: 'center', fontSize: '14px', marginBottom: '15px' }}>{error}</p>}

        {view === 'login' && (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="text" placeholder="Username (Manas / Haldhar)" value={username} onChange={(e) => setUsername(e.target.value)} required style={inputStyle} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
            <button type="submit" className="primary-btn" style={{ width: '100%', justifyContent: 'center' }}>Login</button>
            <button type="button" onClick={() => setView('forgot')} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '13px' }}>Forgot Password?</button>
          </form>
        )}

        {view === 'forgot' && (
          <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="text" placeholder="Enter Username (Manas / Haldhar)" value={username} onChange={(e) => setUsername(e.target.value)} required style={inputStyle} />
            <button type="submit" className="primary-btn" style={{ width: '100%', justifyContent: 'center' }}>Send OTP</button>
            <button type="button" onClick={() => setView('login')} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '13px' }}>Back to Login</button>
          </form>
        )}

        {view === 'reset' && (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="text" placeholder="Enter OTP from Email" value={otp} onChange={(e) => setOtp(e.target.value)} required style={inputStyle} />
            <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={inputStyle} />
            <button type="submit" className="primary-btn" style={{ width: '100%', justifyContent: 'center' }}>Reset Password</button>
          </form>
        )}
      </div>
    </div>
  );
}

const inputStyle = { padding: '15px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' };