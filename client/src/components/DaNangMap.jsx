import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';

// Custom Map Pins
const hotelIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2933/2933777.png',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

const destIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854878.png',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

export default function DaNangMap({ 
  items = [], 
  type = 'all', // 'hotels' | 'destinations' | 'all'
  center = [16.0648, 108.23], 
  zoom = 12,
  height = '420px'
}) {
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-inner border border-slate-200 z-0 relative" style={{ height }}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {items.map((item) => {
          if (!item.location || !item.location.lat || !item.location.lng) return null;
          const isHotel = Boolean(item.starRating || item.type === 'hotel' || item.type === 'homestay' || item.type === 'resort');

          return (
            <Marker
              key={item._id}
              position={[item.location.lat, item.location.lng]}
              icon={isHotel ? hotelIcon : destIcon}
            >
              <Popup>
                <div className="p-1 max-w-[220px]">
                  <img 
                    src={item.coverImage} 
                    alt={item.name} 
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  <h4 className="font-bold text-xs text-slate-900 leading-tight mb-1">{item.name}</h4>
                  <p className="text-[11px] text-slate-500 mb-2 truncate">{item.address}</p>
                  
                  {isHotel ? (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-600">
                        {item.minPrice ? `${item.minPrice.toLocaleString('vi-VN')} ₫` : 'Xem giá'}
                      </span>
                      <Link 
                        to={`/hotels/${item._id}`}
                        className="text-[11px] font-semibold text-white bg-teal-600 px-2.5 py-1 rounded hover:bg-teal-700"
                      >
                        Đặt ngay
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-amber-600">
                        {item.ticketPrice || 'Miễn phí'}
                      </span>
                      <Link 
                        to={`/destinations/${item.slug || item._id}`}
                        className="text-[11px] font-semibold text-white bg-blue-600 px-2.5 py-1 rounded hover:bg-blue-700"
                      >
                        Cẩm nang
                      </Link>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
