import { useEffect, useState } from 'react';
import { bookingsAPI } from '../api/api';
import BookingList from '../components/BookingList';

export default function HistoryPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setLoading(true);
    bookingsAPI
      .getAll()
      .then((res) => setBookings(res.data))
      .catch(() => setError('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  async function handleEdit(id, data) {
    await bookingsAPI.update(id, data);
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, ...data, display_name: data.booked_by_name } : b));
    setSuccessMsg('Booking updated successfully.');
    setTimeout(() => setSuccessMsg(''), 3000);
  }

  async function handleCancel(id) {
    try {
      await bookingsAPI.cancel(id);
      setSuccessMsg('Booking cancelled successfully.');
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)));
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel booking.');
    }
  }

  const confirmed = bookings.filter((b) => b.status === 'confirmed').length;
  const cancelled = bookings.filter((b) => b.status === 'cancelled').length;

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>Booking History</h1>
        <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '4px' }}>View and manage all booking records</p>
      </div>

      {/* Summary pills */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <Pill label="Total" value={bookings.length} color="#6366f1" />
        <Pill label="Confirmed" value={confirmed} color="#10b981" />
        <Pill label="Cancelled" value={cancelled} color="#ef4444" />
      </div>

      {successMsg && (
        <div style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 16px', marginBottom: '16px', fontSize: '0.88rem', fontWeight: '500' }}>
          ✓ {successMsg}
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '60px 20px', color: '#94a3b8' }}>
          <span style={{ fontSize: '1.5rem' }}>⏳</span>
          <p>Loading bookings…</p>
        </div>
      )}

      {error && (
        <div style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 16px', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
          <BookingList bookings={bookings} onCancel={handleCancel} onEdit={handleEdit} />
        </div>
      )}
    </div>
  );
}

function Pill({ label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid #f1f5f9', borderRadius: '10px', padding: '10px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
      <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>{label}</span>
      <span style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>{value}</span>
    </div>
  );
}
