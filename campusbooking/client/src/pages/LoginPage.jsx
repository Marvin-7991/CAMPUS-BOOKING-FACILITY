import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/facilities');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={page}>
      {/* Left panel */}
      <div style={leftPanel}>
        <div style={brandWrap}>
          <div style={logoBox}>CB</div>
          <div>
            <div style={{ color: '#fff', fontWeight: '700', fontSize: '1.3rem' }}>Campus Booking</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', marginTop: '2px', letterSpacing: '0.5px' }}>FACILITY MANAGEMENT SYSTEM</div>
          </div>
        </div>
        <div style={{ marginTop: 'auto', paddingBottom: '48px' }}>
          <h2 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: '700', lineHeight: 1.3, marginBottom: '12px' }}>
            Book campus facilities<br />with ease
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Reserve lecture halls, computer labs, and seminar rooms — all in one place.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div style={rightPanel}>
        <div style={formCard}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>Welcome back</h1>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '28px' }}>Sign in to your account to continue</p>

          {error && (
            <div style={errorBox}><span>✕</span> {error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Email address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@ug.edu.gh" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder="••••••••" style={inputStyle} />
            </div>

            <button type="submit" disabled={loading} style={btnStyle}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem', color: '#64748b' }}>
            Don&apos;t have an account?{' '}
            <Link to="/register" style={{ color: '#6366f1', fontWeight: '600' }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const page = { display: 'flex', minHeight: '100vh' };
const leftPanel = { width: '420px', minHeight: '100vh', background: 'linear-gradient(160deg,#1e293b 0%,#312e81 100%)', padding: '36px 40px', display: 'flex', flexDirection: 'column', flexShrink: 0 };
const brandWrap = { display: 'flex', alignItems: 'center', gap: '12px' };
const logoBox = { width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '0.95rem' };
const rightPanel = { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#f1f5f9' };
const formCard = { background: '#fff', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' };
const errorBox = { display: 'flex', alignItems: 'center', gap: '8px', background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '0.88rem', fontWeight: '500' };
const labelStyle = { display: 'block', marginBottom: '6px', fontSize: '0.82rem', fontWeight: '600', color: '#475569' };
const inputStyle = { width: '100%', padding: '10px 13px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', background: '#f8fafc', color: '#1e293b', outline: 'none', boxSizing: 'border-box' };
const btnStyle = { width: '100%', padding: '11px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', marginTop: '4px' };
