import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { facilitiesAPI, bookingsAPI } from '../api/api';

export default function BookingPage() {
  const { facilityId } = useParams();

  const [facilities, setFacilities] = useState([]);
  const [form, setForm] = useState({
    facility_id: facilityId || '',
    booked_by_name: '',
    purpose: '',
    date: '',
    start_time: '',
    end_time: '',
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    facilitiesAPI.getAll().then((res) => setFacilities(res.data));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.facility_id || !form.booked_by_name || !form.purpose || !form.date || !form.start_time || !form.end_time) {
      setMessage({ text: 'Please fill in all fields.', type: 'error' });
      return;
    }
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      await bookingsAPI.create(form);
      setMessage({ text: 'Booking created successfully!', type: 'success' });
      setForm((f) => ({ ...f, booked_by_name: '', purpose: '', start_time: '', end_time: '' }));
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Failed to create booking.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>Book a Facility</h1>
        <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '4px' }}>Select a facility, pick a date and time slot, then confirm your booking</p>
      </div>

      <div style={{ maxWidth: '520px' }}>
        <div style={card}>
          <h2 style={cardTitle}>📅 Booking Details</h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FF label="Facility">
              <select value={form.facility_id} onChange={(e) => setForm({ ...form, facility_id: e.target.value })} style={inputStyle} required>
                <option value="">Select a facility…</option>
                {facilities.map((f) => (
                  <option key={f.id} value={f.id}>{f.name} — {f.location}</option>
                ))}
              </select>
            </FF>

            <FF label="Name">
              <input
                type="text"
                value={form.booked_by_name}
                onChange={(e) => setForm({ ...form, booked_by_name: e.target.value })}
                placeholder="Enter full name…"
                style={inputStyle}
                required
              />
            </FF>

            <FF label="Purpose">
              <input
                type="text"
                value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                placeholder="e.g. Lab session, Lecture, Meeting…"
                style={inputStyle}
                required
              />
            </FF>

            <FF label="Date">
              <input type="date" value={form.date} min={new Date().toISOString().split('T')[0]} onChange={(e) => setForm({ ...form, date: e.target.value })} style={inputStyle} required />
            </FF>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <FF label="Start Time">
                <input type="time" value={form.start_time} step="1800" onChange={(e) => setForm({ ...form, start_time: e.target.value })} style={inputStyle} required />
              </FF>
              <FF label="End Time">
                <input type="time" value={form.end_time} step="1800" onChange={(e) => setForm({ ...form, end_time: e.target.value })} style={inputStyle} required />
              </FF>
            </div>

            {form.start_time && form.end_time && (
              <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '10px 14px', fontSize: '0.85rem', color: '#0369a1' }}>
                ⏰ Selected: <strong>{form.start_time}</strong> – <strong>{form.end_time}</strong>
              </div>
            )}

            {message.text && (
              <div style={{
                padding: '10px 14px', borderRadius: '8px', fontSize: '0.88rem', fontWeight: '500',
                background: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
                border: '1px solid ' + (message.type === 'success' ? '#bbf7d0' : '#fecaca'),
                color: message.type === 'success' ? '#166534' : '#991b1b',
              }}>
                {message.type === 'success' ? '✓ ' : '✕ '}{message.text}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              background: loading ? '#a5b4fc' : '#6366f1',
              color: '#fff', border: 'none', borderRadius: '8px',
              padding: '12px', fontWeight: '700', fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px',
            }}>
              {loading ? 'Creating…' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function FF({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>{label}</label>
      {children}
    </div>
  );
}

const card = { background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '24px', border: '1px solid #f1f5f9' };
const cardTitle = { fontSize: '1rem', fontWeight: '700', color: '#1e293b', marginBottom: '20px' };
const inputStyle = { padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.88rem', background: '#f8fafc', color: '#1e293b', outline: 'none', width: '100%', boxSizing: 'border-box' };
