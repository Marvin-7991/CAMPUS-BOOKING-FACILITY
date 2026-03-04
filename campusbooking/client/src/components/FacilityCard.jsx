import { useNavigate } from 'react-router-dom';

export default function FacilityCard({ facility }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '14px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        border: '1px solid #f1f5f9',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s, transform 0.2s',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Coloured top strip */}
      <div style={{ height: '6px', background: 'linear-gradient(90deg,#6366f1,#8b5cf6)' }} />

      <div style={{ padding: '20px' }}>
        {/* Badge */}
        <span style={{ background:'#f0f0ff',color:'#6366f1',borderRadius:'20px',padding:'2px 10px',fontSize:'0.72rem',fontWeight:'700',letterSpacing:'0.3px' }}>
          Facility #{facility.id}
        </span>

        {/* Name */}
        <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1e293b', marginTop: '12px', marginBottom: '10px' }}>
          {facility.name}
        </h3>

        {/* Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem', color: '#64748b' }}>
            <span>📍</span>
            <span>{facility.location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#64748b' }}>
            <span>👥</span>
            <span>{facility.capacity} people capacity</span>
          </div>
        </div>

        <button
          onClick={() => navigate(`/book/${facility.id}`)}
          style={{
            width: '100%',
            padding: '10px',
            background: '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '0.88rem',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#4f46e5')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#6366f1')}
        >
          Book This Facility
        </button>
      </div>
    </div>
  );
}
