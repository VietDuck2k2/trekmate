import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TripGroup = ({
   title,
   icon,
   trips,
   emptyMessage,
   defaultExpanded = true,
   TripCard
}) => {
   const [isExpanded, setIsExpanded] = useState(defaultExpanded);

   return (
      <div style={{ marginBottom: '30px' }}>
         {/* Group Header */}
         <div
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
               backgroundColor: '#f8f9fa',
               padding: '15px 20px',
               borderRadius: '8px',
               cursor: 'pointer',
               display: 'flex',
               justifyContent: 'space-between',
               alignItems: 'center',
               border: '1px solid #e9ecef',
               marginBottom: isExpanded ? '15px' : '0'
            }}
         >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
               <span style={{ fontSize: '20px' }}>{icon}</span>
               <h3 style={{ margin: '0', color: '#333' }}>{title}</h3>
               <span style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  minWidth: '20px',
                  textAlign: 'center'
               }}>
                  {trips.length}
               </span>
            </div>
            <div style={{
               transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
               transition: 'transform 0.2s ease',
               fontSize: '18px',
               color: '#6c757d'
            }}>
               ▼
            </div>
         </div>

         {/* Group Content */}
         {isExpanded && (
            <div>
               {trips.length === 0 ? (
                  <div style={{
                     textAlign: 'center',
                     padding: '40px 20px',
                     color: '#6c757d',
                     backgroundColor: '#f8f9fa',
                     borderRadius: '8px',
                     border: '1px solid #e9ecef'
                  }}>
                     <p style={{ margin: '0', fontSize: '16px' }}>{emptyMessage}</p>
                  </div>
               ) : (
                  <div style={{
                     display: 'grid',
                     gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                     gap: '20px'
                  }}>
                     {trips.map(trip => (
                        <TripCard key={trip._id} trip={trip} />
                     ))}
                  </div>
               )}
            </div>
         )}
      </div>
   );
};

export default TripGroup;