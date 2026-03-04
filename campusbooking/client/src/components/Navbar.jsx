import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const sidebar = {
  width: '240px',
  minHeight: '100vh',
  background: '#1e293b',
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 100,
  boxShadow: '2px 0 12px rgba(0,0,0,0.15)',
};

const brand = {
  padding: '24px 20px 20px',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
};

const brandName = {
  color: '#fff',
  fontWeight: '700',
  fontSize: '1.15rem',
  letterSpacing: '0.3px',
};

const brandSub = {
  color: '#94a3b8',
  fontSize: '0.72rem',
  marginTop: '2px',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
};

const navSection = {
  padding: '16px 12px 8px',
};

const sectionLabel = {
  color: '#fff',
  fontSize: '0.68rem',
  fontWeight: '700',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  padding: '0 8px',
  marginBottom: '6px',
};

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '9px 12px',
        borderRadius: '8px',
        marginBottom: '2px',
        fontSize: '0.88rem',
        fontWeight: isActive ? '600' : '400',
        color: '#fff',
        background: isActive ? 'rgba(99,102,241,0.18)' : 'transparent',
        borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
        transition: 'all 0.15s',
      })}
      onMouseEnter={(e) => {
        if (!e.currentTarget.classList.contains('active')) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
          e.currentTarget.style.color = '#e2e8f0';
        }
      }}
      onMouseLeave={(e) => {
        if (!e.currentTarget.style.borderLeft.includes('6366f1')) {
          e.currentTarget.style.background = '';
          e.currentTarget.style.color = '';
        }
      }}
    >
      <span style={{ fontSize: '1rem', width: '18px', textAlign: 'center' }}>{icon}</span>
      {label}
    </NavLink>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <aside style={sidebar}>
      {/* Brand */}
      <div style={brand}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '8px',
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', color: '#fff', fontWeight: '700',
          }}>
            CB
          </div>
          <div>
            <div style={brandName}>Campus Booking</div>
            <div style={brandSub}>Facility Management</div>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        <div style={navSection}>
          <div style={sectionLabel}>Main</div>
          <NavItem to="/facilities" icon="🏛️" label="Facilities" />
          <NavItem to="/book" icon="📅" label="Book Facility" />
          <NavItem to="/history" icon="📋" label="Booking History" />
        </div>

        {user?.role === 'admin' && (
          <div style={navSection}>
            <div style={sectionLabel}>Management</div>
            <NavItem to="/admin" icon="⚙️" label="Admin Panel" />
          </div>
        )}
      </div>

      {/* User profile at bottom */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%',
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: '700', fontSize: '0.8rem', flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ color: '#e2e8f0', fontSize: '0.85rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </div>
            <div style={{ color: '#fff', fontSize: '0.72rem' }}>
              {user?.role === 'admin' ? 'Administrator' : 'User'}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '8px',
            background: 'rgba(239,68,68,0.12)',
            color: '#fca5a5',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '7px',
            fontSize: '0.82rem',
            fontWeight: '600',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.22)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
