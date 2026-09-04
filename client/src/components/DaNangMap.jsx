import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { Layers, MapPin, Building2, Compass, Navigation, Maximize2 } from 'lucide-react';

// Modern SVG Marker Generator with Radar Pulse Effect
const createCustomMarker = (isHotel) => {
  const color = isHotel ? '#0d9488' : '#e11d48'; // Teal for Hotels, Rose/Red for Destinations
  const iconSvg = isHotel
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>`;

  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
        <span style="position: absolute; width: 36px; height: 36px; border-radius: 9999px; background-color: ${color}; opacity: 0.35;" class="animate-pulse-glow"></span>
        <div style="width: 32px; height: 32px; border-radius: 9999px; background-color: ${color}; border: 2.5px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 10;">
          ${iconSvg}
        </div>
        <div style="position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid ${color};"></div>
      </div>
    `,
    iconSize: [38, 42],
    iconAnchor: [19, 42],
    popupAnchor: [0, -42]
  });
};

const hotelPin = createCustomMarker(true);
const destPin = createCustomMarker(false);

// Auto Fit Bounds & Invalidate Size Component
function MapBoundsUpdater({ items, center, zoom }) {
  const map = useMap();

  useEffect(() => {
    // Force Leaflet recalculate container size to avoid grey empty tiles
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    if (!items || items.length === 0) {
      if (center) map.setView(center, zoom || 12);
      return () => clearTimeout(timer);
    }

    const validPositions = items
      .filter(it => it?.location?.lat && it?.location?.lng)
      .map(it => [it.location.lat, it.location.lng]);

    if (validPositions.length === 1) {
      map.setView(validPositions[0], zoom || 14, { animate: true });
    } else if (validPositions.length > 1) {
      const bounds = L.latLngBounds(validPositions);
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 15 });
    } else if (center) {
      map.setView(center, zoom || 12);
    }

    return () => clearTimeout(timer);
  }, [items, center, zoom, map]);

  return null;
}

export default function DaNangMap({ 
  items = [], 
  type = 'all', 
  center = [16.0648, 108.23], 
  zoom = 12,
  height = '440px',
  title = ''
}) {
  // Tile Layer: 'street' (Google Maps Street) or 'satellite' (Google Maps Hybrid Satellite)
  const [layerType, setLayerType] = useState('street');

  const tileLayers = {
    street: {
      url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps'
    },
    satellite: {
      url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Earth & Imagery'
    }
  };

  return (
    <div className="w-full rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 z-0 relative group" style={{ height }}>
      
      {/* Map Header / Layer Switcher Controls */}
      <div className="absolute top-3 right-3 z-[400] flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-md border border-slate-200">
        <button
          type="button"
          onClick={() => setLayerType('street')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            layerType === 'street'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" /> Bản đồ phố
        </button>
        <button
          type="button"
          onClick={() => setLayerType('satellite')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            layerType === 'satellite'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> Vệ tinh
        </button>
      </div>

      {/* Legend Tag */}
      <div className="absolute bottom-3 left-3 z-[400] flex items-center gap-3 bg-white/90 backdrop-blur-md px-3 py-2 rounded-2xl shadow-md border border-slate-200 text-xs font-bold">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-teal-600 inline-block"></span>
          <span className="text-slate-700">Khách sạn / Homestay</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-600 inline-block"></span>
          <span className="text-slate-700">Điểm tham quan</span>
        </div>
      </div>

      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          key={layerType}
          attribution={tileLayers[layerType].attribution}
          url={tileLayers[layerType].url}
          subdomains={tileLayers[layerType].subdomains}
          maxZoom={20}
        />

        <MapBoundsUpdater items={items} center={center} zoom={zoom} />

        {items.map((item) => {
          if (!item.location || !item.location.lat || !item.location.lng) return null;
          const isHotel = Boolean(item.starRating || item.type === 'hotel' || item.type === 'homestay' || item.type === 'resort');

          return (
            <Marker
              key={item._id}
              position={[item.location.lat, item.location.lng]}
              icon={isHotel ? hotelPin : destPin}
            >
              <Popup>
                <div className="p-0 max-w-[240px] overflow-hidden">
                  <div className="relative h-28 w-full overflow-hidden">
                    <img 
                      src={item.coverImage} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase text-white backdrop-blur-md"
                      style={{ backgroundColor: isHotel ? 'rgba(13, 148, 136, 0.9)' : 'rgba(225, 29, 72, 0.9)' }}
                    >
                      {isHotel ? (item.type || 'Khách sạn') : (item.category || 'Điểm đến')}
                    </div>
                  </div>

                  <div className="p-3 space-y-2">
                    <h4 className="font-black text-xs text-slate-900 leading-snug line-clamp-2">{item.name}</h4>
                    <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {item.address}
                    </p>
                    
                    {isHotel ? (
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <div>
                          <span className="text-[9px] text-slate-400 block font-medium">Chỉ từ</span>
                          <span className="text-xs font-black text-teal-600">
                            {item.minPrice ? `${item.minPrice.toLocaleString('vi-VN')} ₫` : 'Xem giá'}
                          </span>
                        </div>
                        <Link 
                          to={`/hotels/${item._id}`}
                          className="text-[11px] font-bold text-white bg-teal-600 px-3 py-1.5 rounded-xl hover:bg-teal-700 transition-colors shadow-sm"
                        >
                          Đặt phòng
                        </Link>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <div>
                          <span className="text-[9px] text-slate-400 block font-medium">Vé tham quan</span>
                          <span className="text-[11px] font-black text-rose-600 truncate max-w-[100px] block">
                            {item.ticketPrice || 'Miễn phí'}
                          </span>
                        </div>
                        <Link 
                          to={`/destinations/${item.slug || item._id}`}
                          className="text-[11px] font-bold text-white bg-rose-600 px-3 py-1.5 rounded-xl hover:bg-rose-700 transition-colors shadow-sm"
                        >
                          Cẩm nang
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

