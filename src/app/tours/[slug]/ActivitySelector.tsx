import React from 'react';

const activities = ["Reef Fishing", "Spearfishing", "Lobster Hunt", "Conch Hunt", "Snorkeling", "Hol Chan Reserve", "Shark Ray Alley", "Coral Gardens", "Caye Caulker", "Beach BBQ"];

const ActivitySelector: React.FC = () => {
  return (
    <div style={{ width: '100%', maxWidth: '800px', backgroundColor: '#001d3d', padding: '16px', borderRadius: '16px', border: '1px solid rgba(197, 160, 89, 0.4)', marginTop: '15px' }}>
      <h3 style={{ color: '#c5a059', fontSize: '12px', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '2px', fontWeight: 'bold' }}>Custom Adventure Selection</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
        {activities.map((activity) => (
          <button key={activity} style={{ padding: '8px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(197, 160, 89, 0.2)', color: '#f1f1f1', borderRadius: '8px', textAlign: 'left', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', height: '44px', whiteSpace: 'normal', lineHeight: '1.1' }}>
            {activity}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActivitySelector;
