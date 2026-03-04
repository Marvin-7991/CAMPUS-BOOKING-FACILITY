import { useEffect, useState } from 'react';
import { facilitiesAPI, usersAPI, bookingsAPI } from '../api/api';
import BookingList from '../components/BookingList';

export default function AdminPage() {
  const [tab, setTab] = useState('facilities');
  const [facilities, setFacilities] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [facilityForm, setFacilityForm] = useState({ name: '', location: '', capacity: '' });
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'user' });
  const [editingFacility, setEditingFacility] = useState(null);
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    const [fRes, uRes, bRes] = await Promise.all([
      facilitiesAPI.getAll(), usersAPI.getAll(), bookingsAPI.getAll(),
    ]);
    setFacilities(fRes.data);
    setUsers(uRes.data);
    setBookings(bRes.data);
  }

  function showMsg(text, type = 'success') {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  }

  async function handleFacilitySubmit(e) {
    e.preventDefault();
    try {
      if (editingFacility) {
        await facilitiesAPI.update(editingFacility.id, facilityForm);
        showMsg('Facility updated!');
        setEditingFacility(null);
      } else {
        await facilitiesAPI.create(facilityForm);
        showMsg('Facility created!');
      }
      setFacilityForm({ name: '', location: '', capacity: '' });
      const res = await facilitiesAPI.getAll();
      setFacilities(res.data);
    } catch (err) {
      showMsg(err.response?.data?.error || 'Error saving facility', 'error');
    }
  }

  async function handleDeleteFacility(id) {
    if (!window.confirm('Delete this facility? All related bookings will be removed.')) return;
    try {
      await facilitiesAPI.delete(id);
      showMsg('Facility deleted');
      setFacilities((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      showMsg(err.response?.data?.error || 'Error deleting facility', 'error');
    }
  }

  async function handleUserSubmit(e) {
    e.preventDefault();
    try {
      await usersAPI.create(userForm);
      showMsg('User created!');
      setUserForm({ name: '', email: '', role: 'user' });
      const res = await usersAPI.getAll();
      setUsers(res.data);
    } catch (err) {
      showMsg(err.response?.data?.error || 'Error creating user', 'error');
    }
  }

  async function handleCancelBooking(id) {
    try {
      await bookingsAPI.cancel(id);
      showMsg('Booking cancelled');
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)));
    } catch (err) {
      showMsg(err.response?.data?.error || 'Error cancelling booking', 'error');
    }
  }

  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
  const tabs = ['facilities', 'users', 'bookings'];
  const tabIcons = { facilities: '🏛️', users: '👥', bookings: '📋' };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={pageTitle}>Admin Dashboard</h1>
        <p style={pageSub}>Manage facilities, users, and bookings</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '18px', marginBottom: '28px' }}>
        <StatCard label="Total Users" value={users.length} icon="👥" color="#6366f1" />
        <StatCard label="Total Facilities" value={facilities.length} icon="🏛️" color="#0ea5e9" />
        <StatCard label="Total Bookings" value={bookings.length} icon="📅" color="#f59e0b" />
        <StatCard label="Active Bookings" value={confirmedBookings} icon="✅" color="#10b981" sub={pendingBookings + ' pending'} />
      </div>

      {msg.text && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '12px 16px', borderRadius: '10px', marginBottom: '20px',
          background: msg.type === 'success' ? '#f0fdf4' : '#fef2f2',
          border: '1px solid ' + (msg.type === 'success' ? '#bbf7d0' : '#fecaca'),
          color: msg.type === 'success' ? '#166534' : '#991b1b',
          fontWeight: '500', fontSize: '0.9rem',
        }}>
          <span>{msg.type === 'success' ? '✓' : '✕'}</span>
          {msg.text}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0', marginBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '10px 22px', border: 'none', background: 'transparent',
            fontWeight: tab === t ? '700' : '500', fontSize: '0.88rem',
            color: tab === t ? '#6366f1' : '#64748b',
            borderBottom: tab === t ? '2px solid #6366f1' : '2px solid transparent',
            cursor: 'pointer', textTransform: 'capitalize',
            display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '-1px',
          }}>
            {tabIcons[t]} {t}
          </button>
        ))}
      </div>

      {tab === 'facilities' && (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px', alignItems: 'start' }}>
          <div style={card}>
            <h2 style={cardTitle}>{editingFacility ? '✏️ Edit Facility' : '+ Add Facility'}</h2>
            <form onSubmit={handleFacilitySubmit} style={formGrid}>
              <FF label="Name"><input value={facilityForm.name} onChange={(e) => setFacilityForm({ ...facilityForm, name: e.target.value })} style={inputStyle} required placeholder="e.g. Lecture Hall A" /></FF>
              <FF label="Location"><input value={facilityForm.location} onChange={(e) => setFacilityForm({ ...facilityForm, location: e.target.value })} style={inputStyle} required placeholder="e.g. Block A, Floor 2" /></FF>
              <FF label="Capacity"><input type="number" min="1" value={facilityForm.capacity} onChange={(e) => setFacilityForm({ ...facilityForm, capacity: e.target.value })} style={inputStyle} required placeholder="e.g. 120" /></FF>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button type="submit" style={btnPrimary}>{editingFacility ? 'Update' : 'Add Facility'}</button>
                {editingFacility && (
                  <button type="button" onClick={() => { setEditingFacility(null); setFacilityForm({ name: '', location: '', capacity: '' }); }} style={btnSecondary}>Cancel</button>
                )}
              </div>
            </form>
          </div>
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={cardTitle}>All Facilities</h2>
              <span style={countBadge}>{facilities.length} total</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead><tr style={theadRow}><th style={th}>ID</th><th style={th}>Name</th><th style={th}>Location</th><th style={th}>Capacity</th><th style={th}>Actions</th></tr></thead>
                <tbody>
                  {facilities.map((f) => (
                    <tr key={f.id} style={trStyle}>
                      <td style={td}><span style={idBadge}>#{f.id}</span></td>
                      <td style={{ ...td, fontWeight: '600', color: '#1e293b' }}>{f.name}</td>
                      <td style={td}>{f.location}</td>
                      <td style={td}>{f.capacity}</td>
                      <td style={td}>
                        <button onClick={() => { setEditingFacility(f); setFacilityForm({ name: f.name, location: f.location, capacity: f.capacity }); }} style={{ ...btnTiny, background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}>Edit</button>
                        {' '}
                        <button onClick={() => handleDeleteFacility(f.id)} style={{ ...btnTiny, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px', alignItems: 'start' }}>
          <div style={card}>
            <h2 style={cardTitle}>+ Add User</h2>
            <form onSubmit={handleUserSubmit} style={formGrid}>
              <FF label="Full Name"><input value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} style={inputStyle} required placeholder="e.g. Kwame Asante" /></FF>
              <FF label="Email"><input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} style={inputStyle} required placeholder="user@ug.edu.gh" /></FF>
              <FF label="Role">
                <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })} style={inputStyle}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </FF>
              <button type="submit" style={{ ...btnPrimary, marginTop: '4px' }}>Add User</button>
            </form>
          </div>
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={cardTitle}>All Users</h2>
              <span style={countBadge}>{users.length} total</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead><tr style={theadRow}><th style={th}>ID</th><th style={th}>Name</th><th style={th}>Email</th><th style={th}>Role</th></tr></thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={trStyle}>
                      <td style={td}><span style={idBadge}>#{u.id}</span></td>
                      <td style={{ ...td, fontWeight: '600', color: '#1e293b' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width:'28px',height:'28px',borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'0.7rem',fontWeight:'700',flexShrink:0 }}>
                            {u.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0,2)}
                          </div>
                          {u.name}
                        </div>
                      </td>
                      <td style={td}>{u.email}</td>
                      <td style={td}>
                        <span style={{ background: u.role==='admin'?'#fef3c7':'#f0f9ff', color: u.role==='admin'?'#92400e':'#0369a1', borderRadius:'20px', padding:'3px 10px', fontWeight:'600', fontSize:'0.75rem', border:'1px solid '+(u.role==='admin'?'#fde68a':'#bae6fd') }}>
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'bookings' && (
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={cardTitle}>All Bookings</h2>
            <span style={countBadge}>{bookings.length} total</span>
          </div>
          <BookingList bookings={bookings} onCancel={handleCancelBooking} />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color, sub }) {
  return (
    <div style={{ background:'#fff', borderRadius:'12px', padding:'20px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', border:'1px solid #f1f5f9', display:'flex', alignItems:'center', gap:'14px' }}>
      <div style={{ width:'46px',height:'46px',borderRadius:'12px',background:color+'18',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',flexShrink:0 }}>{icon}</div>
      <div>
        <div style={{ fontSize:'0.75rem',color:'#64748b',fontWeight:'500',textTransform:'uppercase',letterSpacing:'0.5px' }}>{label}</div>
        <div style={{ fontSize:'1.6rem',fontWeight:'700',color:'#1e293b',lineHeight:1.2 }}>{value}</div>
        {sub && <div style={{ fontSize:'0.75rem',color:'#94a3b8',marginTop:'2px' }}>{sub}</div>}
      </div>
    </div>
  );
}

function FF({ label, children }) {
  return (
    <div style={{ display:'flex',flexDirection:'column',gap:'5px' }}>
      <label style={{ fontSize:'0.8rem',fontWeight:'600',color:'#475569' }}>{label}</label>
      {children}
    </div>
  );
}

const pageTitle = { fontSize:'1.5rem',fontWeight:'700',color:'#1e293b' };
const pageSub = { color:'#64748b',fontSize:'0.88rem',marginTop:'4px' };
const card = { background:'#fff',borderRadius:'12px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',padding:'22px',border:'1px solid #f1f5f9' };
const cardTitle = { fontSize:'1rem',fontWeight:'700',color:'#1e293b' };
const formGrid = { display:'flex',flexDirection:'column',gap:'14px' };
const inputStyle = { padding:'9px 12px',border:'1px solid #e2e8f0',borderRadius:'8px',fontSize:'0.88rem',background:'#f8fafc',color:'#1e293b',outline:'none' };
const btnPrimary = { background:'#6366f1',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 16px',fontWeight:'600',cursor:'pointer',fontSize:'0.88rem' };
const btnSecondary = { background:'#f1f5f9',color:'#475569',border:'1px solid #e2e8f0',borderRadius:'8px',padding:'10px 16px',fontWeight:'600',cursor:'pointer',fontSize:'0.88rem' };
const btnTiny = { border:'none',borderRadius:'6px',padding:'4px 10px',fontWeight:'600',cursor:'pointer',fontSize:'0.78rem' };
const tableStyle = { width:'100%',borderCollapse:'collapse',fontSize:'0.88rem' };
const theadRow = { background:'#f8fafc',borderBottom:'1px solid #e2e8f0' };
const trStyle = { borderBottom:'1px solid #f8fafc' };
const th = { padding:'10px 14px',textAlign:'left',fontWeight:'600',fontSize:'0.75rem',textTransform:'uppercase',letterSpacing:'0.6px',color:'#64748b' };
const td = { padding:'12px 14px',color:'#475569',fontSize:'0.88rem' };
const idBadge = { background:'#f1f5f9',color:'#64748b',borderRadius:'5px',padding:'2px 7px',fontSize:'0.78rem',fontWeight:'600' };
const countBadge = { background:'#f1f5f9',color:'#475569',borderRadius:'20px',padding:'3px 12px',fontSize:'0.78rem',fontWeight:'600' };
