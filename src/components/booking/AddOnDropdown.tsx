import React from 'react';

const addons = [
  "Beach BBQ", "BBQ Additional Guest", "Snorkel Gear", "Hol Chan Fee",
  "Adult T-Shirt", "Youth T-Shirt", "XXL T-Shirt", 
  "Standard Snapback", "Leather Snapback"
];

const AddOnDropdown: React.FC = () => {
  return (
    <div style={{ 
      width: '100%', 
      backgroundColor: '#001d3d', 
      borderRadius: '12px', 
      border: '1px solid rgba(197, 160, 89, 0.4)',
      padding: '15px'
    }}>
      <h3 style={{ 
        color: '#c5a059', 
        fontSize: '11px', 
        textTransform: 'uppercase', 
        marginBottom: '10px', 
        letterSpacing: '1px',
        fontWeight: 'bold'
      }}>
        Adventure Add-Ons
      </h3>
      <div style={{ 
        maxHeight: '280px', 
        overflowY: 'auto', 
        paddingRight: '8px'
      }}>
        {addons.map((item) => (
          <div key={item} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '10px 0',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
          }}>
            <span style={{ color: '#fff', fontSize: '13px' }}>{item}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button style={{ 
                width: '26px', 
                height: '26px', 
                borderRadius: '4px', 
                border: '1px solid #c5a059', 
                background: 'rgba(197, 160, 89, 0.1)', 
                color: '#c5a059', 
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>-</button>
              <span style={{ color: '#fff', fontSize: '14px', minWidth: '20px', textAlign: 'center' }}>0</span>
              <button style={{ 
                width: '26px', 
                height: '26px', 
                borderRadius: '4px', 
                border: '1px solid #c5a059', 
                background: 'rgba(197, 160, 89, 0.1)', 
                color: '#c5a059', 
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddOnDropdown;
