// components/OrderMaps.tsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Marker ikonkasini to‘g‘rilash (Leaflet uchun bu kerak)
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface OrderMapsProps {
  isPremiumUser: boolean;
}

const OrderMaps: React.FC<OrderMapsProps> = ({ isPremiumUser }) => {
  const router = useNavigate();

  const handleClick = () => {
    if (!isPremiumUser) {
      router('/pricing');
    }
  };

  return (
    <>

    <div className='flex px-5 py-4 bg-[#ffffff] rounded-t-lg shadow-lg'>
      <h2 className="text-[18px] font-sans">Buyurtmalar xaritasi</h2>
    </div>

      <div
        className="relative w-full max-w-2xl aspect-[16/9] rounded-b-xl overflow-hidden shadow-lg mx-auto border z-0 bg-white"
        style={{
          width: '100%',
          maxWidth: '1300px',
          height: '500px',
        }}
      >
        <div
          className={`w-full h-full transition-all duration-300 ${!isPremiumUser ? 'filter blur-sm brightness-75 cursor-pointer' : ''
            }`}
          onClick={handleClick}
        >
          <MapContainer
            center={[41.2995, 69.2401]}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              url="https://api.maptiler.com/maps/outdoor-v2/256/{z}/{x}/{y}.png?key=WQByuMQOk8QE4KhZgJnh"
              attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>'
            />

            <Marker position={[41.2995, 69.2401]}>
              <Popup>Toshkent</Popup>
            </Marker>
          </MapContainer>
        </div>

        {!isPremiumUser && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 bg-black/40"
            onClick={handleClick}
          >
            <h3 className="text-xl font-semibold">Order Maps – Premium funksiyasi</h3>
            <p className="mt-2 mb-4 text-sm">Buyurtmalar xaritasini to‘liq ko‘rish uchun obuna bo‘ling</p>
            <button className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-100">
              Pricing sahifasiga o‘tish
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderMaps;
