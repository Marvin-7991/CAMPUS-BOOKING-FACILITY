import { useEffect, useState } from 'react';
import { facilitiesAPI } from '../api/api';
import FacilityCard from '../components/FacilityCard';

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    facilitiesAPI
      .getAll()
      .then((res) => setFacilities(res.data))
      .catch(() => setError('Failed to load facilities'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>Facilities</h1>
        <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '4px' }}>Browse available campus facilities and make a reservation</p>
      </div>

      {loading && (
        <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:'10px',padding:'60px 20px',color:'#94a3b8' }}>
          <span style={{ fontSize: '1.5rem' }}>⏳</span>
          <p>Loading facilities…</p>
        </div>
      )}

      {error && (
        <div style={{ background:'#fef2f2',color:'#991b1b',border:'1px solid #fecaca',borderRadius:'10px',padding:'12px 16px',marginBottom:'20px',fontSize:'0.9rem' }}>
          {error}
        </div>
      )}

      {!loading && !error && facilities.length === 0 && (
        <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:'10px',padding:'60px 20px',color:'#94a3b8' }}>
          <span style={{ fontSize: '2rem' }}>🏛️</span>
          <p>No facilities found.</p>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'20px' }}>
        {facilities.map((f) => (
          <FacilityCard key={f.id} facility={f} />
        ))}
      </div>
    </div>
  );
}
