export default function AvailabilityGrid({ slots, selectedStart, selectedEnd, onSlotClick }) {
  if (!slots || slots.length === 0) return null;

  return (
    <div>
      {/* Legend */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <Legend color="#dcfce7" border="#86efac" dot="#22c55e" label="Available" />
        <Legend color="#fee2e2" border="#fca5a5" dot="#ef4444" label="Booked" />
        <Legend color="#e0e7ff" border="#a5b4fc" dot="#6366f1" label="Selected" />
      </div>

      {/* Slot grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(90px,1fr))', gap: '6px' }}>
        {slots.map((slot) => {
          const isSelected = slot.start >= selectedStart && slot.end <= selectedEnd && selectedStart && selectedEnd;
          let bg, color, border;

          if (!slot.available) {
            bg = '#fee2e2'; color = '#b91c1c'; border = '1px solid #fca5a5';
          } else if (isSelected) {
            bg = '#e0e7ff'; color = '#3730a3'; border = '1px solid #a5b4fc';
          } else {
            bg = '#dcfce7'; color = '#166534'; border = '1px solid #86efac';
          }

          return (
            <div
              key={slot.start}
              onClick={() => slot.available && onSlotClick && onSlotClick(slot)}
              style={{
                background: bg, color, border, borderRadius: '7px',
                padding: '7px 4px', fontSize: '0.76rem', fontWeight: '600',
                textAlign: 'center', cursor: slot.available ? 'pointer' : 'not-allowed',
                userSelect: 'none', transition: 'opacity 0.1s',
              }}
              onMouseEnter={(e) => { if (slot.available) e.currentTarget.style.opacity = '0.8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              {slot.start}
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '12px' }}>
        Click a slot to set start time, click another to extend to end time.
      </p>
    </div>
  );
}

function Legend({ color, border, dot, label }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: '#475569' }}>
      <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: color, border: '1px solid ' + border, display: 'inline-block', flexShrink: 0 }} />
      {label}
    </span>
  );
}
