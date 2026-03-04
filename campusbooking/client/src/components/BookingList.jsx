import { useState } from 'react';

const statusConfig = {
  confirmed: { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0', dot: '#22c55e', label: 'Confirmed' },
  cancelled: { bg: '#fef2f2', color: '#991b1b', border: '#fecaca', dot: '#ef4444', label: 'Cancelled' },
  pending:   { bg: '#fffbeb', color: '#92400e', border: '#fde68a', dot: '#f59e0b', label: 'Pending'   },
};

const filterColumns = [
  { value: 'id',       label: 'ID' },
  { value: 'facility', label: 'Facility' },
  { value: 'name',     label: 'Booked By' },
  { value: 'purpose',  label: 'Purpose' },
  { value: 'date',     label: 'Date' },
  { value: 'time',     label: 'Time' },
  { value: 'status',   label: 'Status' },
];

export default function BookingList({ bookings, onCancel, onEdit }) {
  const [confirmingBooking, setConfirmingBooking] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [filterBy, setFilterBy] = useState('facility');
  const [filterValue, setFilterValue] = useState('');

  if (!bookings || bookings.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '50px 20px', color: '#94a3b8' }}>
        <span style={{ fontSize: '2rem' }}>📋</span>
        <p style={{ fontSize: '0.9rem' }}>No bookings found.</p>
      </div>
    );
  }

  function openEdit(b) {
    setEditingBooking(b);
    setEditError('');
    setEditForm({
      booked_by_name: b.booked_by_name || b.user_name || '',
      purpose: b.purpose || '',
      date: b.date?.substring(0, 10) || '',
      start_time: b.start_time?.substring(0, 5) || '',
      end_time: b.end_time?.substring(0, 5) || '',
    });
  }

  async function handleEditSave() {
    if (!editForm.booked_by_name || !editForm.date || !editForm.start_time || !editForm.end_time) {
      setEditError('Name, date, start time and end time are required.');
      return;
    }
    setEditSaving(true);
    setEditError('');
    try {
      await onEdit(editingBooking.id, editForm);
      setEditingBooking(null);
    } catch (err) {
      setEditError(err.response?.data?.error || 'Failed to save changes.');
    } finally {
      setEditSaving(false);
    }
  }

  const filtered = bookings.filter((b) => {
    if (!filterValue.trim()) return true;
    const v = filterValue.toLowerCase();
    const displayName = b.display_name || b.booked_by_name || b.user_name || '';
    const dateStr = new Date(b.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = `${b.start_time?.substring(0, 5)} – ${b.end_time?.substring(0, 5)}`;
    switch (filterBy) {
      case 'id':       return String(b.id).includes(v);
      case 'facility': return b.facility_name?.toLowerCase().includes(v);
      case 'name':     return displayName.toLowerCase().includes(v);
      case 'purpose':  return (b.purpose || '').toLowerCase().includes(v);
      case 'date':     return dateStr.toLowerCase().includes(v);
      case 'time':     return timeStr.toLowerCase().includes(v);
      case 'status':   return b.status?.toLowerCase().includes(v);
      default:         return true;
    }
  });

  const hasActions = onCancel || onEdit;

  function handleConfirmCancel() {
    onCancel(confirmingBooking.id);
    setConfirmingBooking(null);
  }

  return (
    <>
      {/* Cancel confirmation modal */}
      {confirmingBooking && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setConfirmingBooking(null)}
        >
          <div style={{ background: '#fff', borderRadius: '14px', padding: '28px 28px 24px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>🚫</div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>Cancel Booking</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>This action cannot be undone</div>
              </div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', fontSize: '0.85rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <ModalRow label="Facility" value={confirmingBooking.facility_name} />
              <ModalRow label="Booked By" value={confirmingBooking.display_name || confirmingBooking.booked_by_name || confirmingBooking.user_name} />
              {confirmingBooking.purpose && <ModalRow label="Purpose" value={confirmingBooking.purpose} />}
              <ModalRow label="Date" value={new Date(confirmingBooking.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} />
              <ModalRow label="Time" value={`${confirmingBooking.start_time?.substring(0, 5)} – ${confirmingBooking.end_time?.substring(0, 5)}`} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setConfirmingBooking(null)}
                style={{ flex: 1, padding: '10px', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
              >Keep Booking</button>
              <button onClick={handleConfirmCancel}
                style={{ flex: 1, padding: '10px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#b91c1c'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#dc2626'}
              >Yes, Cancel Booking</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editingBooking && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setEditingBooking(null)}
        >
          <div style={{ background: '#fff', borderRadius: '14px', padding: '28px 28px 24px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>✏️</div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>Edit Booking</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>{editingBooking.facility_name} · #{editingBooking.id}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <EF label="Name">
                <input type="text" value={editForm.booked_by_name} onChange={(e) => setEditForm({ ...editForm, booked_by_name: e.target.value })} style={modalInput} placeholder="Full name…" />
              </EF>
              <EF label="Purpose">
                <input type="text" value={editForm.purpose} onChange={(e) => setEditForm({ ...editForm, purpose: e.target.value })} style={modalInput} placeholder="e.g. Lab session, Lecture…" />
              </EF>
              <EF label="Date">
                <input type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} style={modalInput} />
              </EF>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <EF label="Start Time">
                  <input type="time" value={editForm.start_time} step="1800" onChange={(e) => setEditForm({ ...editForm, start_time: e.target.value })} style={modalInput} />
                </EF>
                <EF label="End Time">
                  <input type="time" value={editForm.end_time} step="1800" onChange={(e) => setEditForm({ ...editForm, end_time: e.target.value })} style={modalInput} />
                </EF>
              </div>
            </div>
            {editError && (
              <div style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: '8px', padding: '9px 14px', fontSize: '0.83rem', marginTop: '14px' }}>
                {editError}
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setEditingBooking(null)}
                style={{ flex: 1, padding: '10px', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
              >Discard</button>
              <button onClick={handleEditSave} disabled={editSaving}
                style={{ flex: 1, padding: '10px', background: editSaving ? '#a5b4fc' : '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.88rem', fontWeight: '600', cursor: editSaving ? 'not-allowed' : 'pointer' }}
                onMouseEnter={(e) => { if (!editSaving) e.currentTarget.style.background = '#4f46e5'; }}
                onMouseLeave={(e) => { if (!editSaving) e.currentTarget.style.background = '#6366f1'; }}
              >{editSaving ? 'Saving…' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderBottom: '1px solid #f1f5f9', background: '#fafafa' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569', whiteSpace: 'nowrap' }}>Filter by:</span>
        <select
          value={filterBy}
          onChange={(e) => { setFilterBy(e.target.value); setFilterValue(''); }}
          style={filterSelectStyle}
        >
          {filterColumns.map((col) => (
            <option key={col.value} value={col.value}>{col.label}</option>
          ))}
        </select>
        {filterBy === 'status' ? (
          <select value={filterValue} onChange={(e) => setFilterValue(e.target.value)} style={{ ...filterSelectStyle, maxWidth: '160px' }}>
            <option value="">All</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        ) : (
          <input
            type={filterBy === 'date' ? 'text' : 'text'}
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder={filterBy === 'date' ? 'e.g. Jan 2025' : `Search ${filterColumns.find(c => c.value === filterBy)?.label}…`}
            style={{ ...filterInputStyle, maxWidth: '240px' }}
          />
        )}
        {filterValue && (
          <button onClick={() => setFilterValue('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '0.82rem', padding: '2px 6px', fontWeight: '600' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
          >✕ Clear</button>
        )}
        {filterValue && (
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginLeft: 'auto' }}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={th}>ID</th>
              <th style={th}>Facility</th>
              <th style={th}>Booked By</th>
              <th style={th}>Purpose</th>
              <th style={th}>Date</th>
              <th style={th}>Time</th>
              <th style={th}>Status</th>
              {hasActions && <th style={th}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={hasActions ? 8 : 7} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem' }}>
                  No bookings match the current filter.
                </td>
              </tr>
            ) : (
              filtered.map((b) => {
                const sc = statusConfig[b.status] || statusConfig.pending;
                const displayName = b.display_name || b.booked_by_name || b.user_name || '—';
                const initials = displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
                return (
                  <tr key={b.id} style={{ borderBottom: '1px solid #f8fafc' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                    onMouseLeave={(e) => e.currentTarget.style.background = ''}
                  >
                    <td style={td}>
                      <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: '5px', padding: '2px 7px', fontSize: '0.78rem', fontWeight: '600' }}>#{b.id}</span>
                    </td>
                    <td style={{ ...td, fontWeight: '600', color: '#1e293b' }}>{b.facility_name}</td>
                    <td style={td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <div style={{ width:'24px',height:'24px',borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'0.65rem',fontWeight:'700',flexShrink:0 }}>
                          {initials}
                        </div>
                        {displayName}
                      </div>
                    </td>
                    <td style={{ ...td, color: '#64748b', fontStyle: b.purpose ? 'normal' : 'italic' }}>
                      {b.purpose || '—'}
                    </td>
                    <td style={td}>{new Date(b.date).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}</td>
                    <td style={td}>
                      <span style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '2px 8px', fontSize: '0.82rem', fontWeight: '600', color: '#475569' }}>
                        {b.start_time?.substring(0,5)} – {b.end_time?.substring(0,5)}
                      </span>
                    </td>
                    <td style={td}>
                      <span style={{ background: sc.bg, color: sc.color, border: '1px solid ' + sc.border, borderRadius: '20px', padding: '3px 10px', fontWeight: '600', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: sc.dot, display: 'inline-block' }} />
                        {sc.label}
                      </span>
                    </td>
                    {hasActions && (
                      <td style={{ ...td, whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {onEdit && b.status !== 'cancelled' && (
                            <button onClick={() => openEdit(b)}
                              style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '4px 12px', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer' }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#dbeafe'}
                              onMouseLeave={(e) => e.currentTarget.style.background = '#eff6ff'}
                            >Edit</button>
                          )}
                          {onCancel && b.status !== 'cancelled' && (
                            <button onClick={() => setConfirmingBooking(b)}
                              style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', padding: '4px 12px', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer' }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
                              onMouseLeave={(e) => e.currentTarget.style.background = '#fef2f2'}
                            >Cancel</button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function EF({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#475569' }}>{label}</label>
      {children}
    </div>
  );
}

function ModalRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
      <span style={{ color: '#94a3b8', fontWeight: '500' }}>{label}</span>
      <span style={{ color: '#1e293b', fontWeight: '600', textAlign: 'right' }}>{value}</span>
    </div>
  );
}

const th = { padding: '10px 14px', textAlign: 'left', fontWeight: '600', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.6px', color: '#64748b' };
const td = { padding: '12px 14px', color: '#475569', fontSize: '0.875rem' };
const filterInputStyle = { padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: '7px', fontSize: '0.83rem', background: '#fff', color: '#1e293b', outline: 'none', boxSizing: 'border-box' };
const filterSelectStyle = { padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: '7px', fontSize: '0.83rem', background: '#fff', color: '#1e293b', outline: 'none', maxWidth: '140px' };
const modalInput = { padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.88rem', background: '#f8fafc', color: '#1e293b', outline: 'none', width: '100%', boxSizing: 'border-box' };
