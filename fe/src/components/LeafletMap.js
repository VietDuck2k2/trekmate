import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/**
 * LeafletMap - Interactive map with address search autocomplete
 * @param {Object}   center      - { lat, lng } - initial center of the map
 * @param {Object}   markerPos   - { lat, lng } | null - current marker position
 * @param {Function} onMapClick  - (lat, lng) => void - called when user clicks on map or selects suggestion
 * @param {string}   height      - CSS height string, default '300px'
 * @param {boolean}  readOnly    - if true, disable click + search
 * @param {string}   placeholder - Placeholder text for search box
 */
const LeafletMap = ({
   center = { lat: 10.762622, lng: 106.660172 },
   markerPos = null,
   onMapClick = null,
   height = '300px',
   readOnly = false,
   placeholder = 'Tìm kiếm địa chỉ...',
}) => {
   const mapRef = useRef(null);
   const mapInstanceRef = useRef(null);
   const markerRef = useRef(null);

   const [query, setQuery] = useState('');
   const [suggestions, setSuggestions] = useState([]);
   const [loadingSuggestions, setLoadingSuggestions] = useState(false);
   const debounceRef = useRef(null);

   // Initialize map
   useEffect(() => {
      if (mapInstanceRef.current) return;

      const map = L.map(mapRef.current, {
         center: [center.lat, center.lng],
         zoom: 11,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
         maxZoom: 19,
      }).addTo(map);

      if (!readOnly && onMapClick) {
         map.on('click', (e) => {
            onMapClick(e.latlng.lat, e.latlng.lng);
         });
      }

      mapInstanceRef.current = map;

      return () => {
         map.remove();
         mapInstanceRef.current = null;
         markerRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   // Update marker position when markerPos changes
   useEffect(() => {
      const map = mapInstanceRef.current;
      if (!map) return;

      if (markerPos) {
         if (markerRef.current) {
            markerRef.current.setLatLng([markerPos.lat, markerPos.lng]);
         } else {
            markerRef.current = L.marker([markerPos.lat, markerPos.lng]).addTo(map);
         }
         map.setView([markerPos.lat, markerPos.lng], 14);
      } else {
         if (markerRef.current) {
            markerRef.current.remove();
            markerRef.current = null;
         }
      }
   }, [markerPos]);

   // Fetch suggestions from Nominatim with debounce
   const fetchSuggestions = useCallback((value) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (!value || value.trim().length < 3) {
         setSuggestions([]);
         return;
      }

      debounceRef.current = setTimeout(async () => {
         setLoadingSuggestions(true);
         try {
            const res = await fetch(
               `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5&addressdetails=1&accept-language=vi`,
               { headers: { 'Accept-Language': 'vi' } }
            );
            const data = await res.json();
            setSuggestions(data);
         } catch {
            setSuggestions([]);
         } finally {
            setLoadingSuggestions(false);
         }
      }, 400);
   }, []);

   const handleQueryChange = (e) => {
      const value = e.target.value;
      setQuery(value);
      fetchSuggestions(value);
   };

   const handleSelectSuggestion = (suggestion) => {
      const lat = parseFloat(suggestion.lat);
      const lng = parseFloat(suggestion.lon);
      setQuery(suggestion.display_name);
      setSuggestions([]);
      if (onMapClick) onMapClick(lat, lng);
   };

   const handleKeyDown = async (e) => {
      if (e.key === 'Enter' && query.trim().length >= 3) {
         e.preventDefault();
         fetchSuggestions.cancel?.();
         setLoadingSuggestions(true);
         try {
            const res = await fetch(
               `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
            );
            const data = await res.json();
            if (data[0]) handleSelectSuggestion(data[0]);
         } catch { /* ignore */ } finally {
            setLoadingSuggestions(false);
         }
      }
   };

   return (
      <div style={{ position: 'relative' }}>
         {/* Address Search Box */}
         {!readOnly && (
            <div style={{ position: 'relative', marginBottom: '8px' }}>
               <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span className="material-icons-round" style={{
                     position: 'absolute', left: '12px', color: '#94a3b8', fontSize: '18px', zIndex: 1
                  }}>search</span>
                  <input
                     type="text"
                     value={query}
                     onChange={handleQueryChange}
                     onKeyDown={handleKeyDown}
                     placeholder={placeholder}
                     style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        borderRadius: '10px',
                        border: '1.5px solid #e2e8f0',
                        background: '#f8fafc',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                     }}
                     onFocus={e => e.target.style.borderColor = '#10b981'}
                     onBlur={e => {
                        e.target.style.borderColor = '#e2e8f0';
                        // Delay closing to allow click on suggestion
                        setTimeout(() => setSuggestions([]), 200);
                     }}
                  />
                  {loadingSuggestions && (
                     <span className="material-icons-round" style={{
                        position: 'absolute', right: '12px', color: '#10b981', fontSize: '18px', animation: 'spin 1s linear infinite'
                     }}>sync</span>
                  )}
               </div>

               {/* Suggestions Dropdown */}
               {suggestions.length > 0 && (
                  <div style={{
                     position: 'absolute',
                     top: '100%',
                     left: 0,
                     right: 0,
                     background: 'white',
                     border: '1px solid #e2e8f0',
                     borderRadius: '10px',
                     boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                     zIndex: 9999,
                     overflow: 'hidden',
                     marginTop: '4px',
                  }}>
                     {suggestions.map((s, idx) => (
                        <div
                           key={idx}
                           onMouseDown={() => handleSelectSuggestion(s)}
                           style={{
                              padding: '10px 14px',
                              cursor: 'pointer',
                              borderBottom: idx < suggestions.length - 1 ? '1px solid #f1f5f9' : 'none',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '8px',
                              transition: 'background 0.15s',
                           }}
                           onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                           onMouseLeave={e => e.currentTarget.style.background = 'white'}
                        >
                           <span className="material-icons-round" style={{ fontSize: '16px', color: '#10b981', marginTop: '2px', flexShrink: 0 }}>place</span>
                           <div>
                              <div style={{ fontSize: '13px', color: '#1e293b', fontWeight: 500, lineHeight: '1.4' }}>
                                 {s.display_name.split(',').slice(0, 2).join(',')}
                              </div>
                              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                                 {s.display_name.split(',').slice(2).join(',').trim()}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         )}

         {/* Map */}
         <div
            ref={mapRef}
            style={{
               width: '100%',
               height,
               borderRadius: '0.75rem',
               zIndex: 0,
            }}
         />

         {/* Helper text */}
         {!readOnly && (
            <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', textAlign: 'center' }}>
               Tìm kiếm địa chỉ hoặc click trực tiếp trên bản đồ để chọn vị trí
            </p>
         )}
      </div>
   );
};

export default LeafletMap;
