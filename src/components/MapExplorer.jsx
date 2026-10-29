import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, ShieldCheck, Eye, ExternalLink, Calendar, CheckCircle2, Navigation, Layers } from 'lucide-react';
import { CITIES, PROPERTIES } from '../data/properties';
import { formatNaira, formatNairaCompact } from '../utils/formatters';

// Component to handle smooth fly-to animations when user changes city
function MapViewHandler({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && map) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapExplorer({ 
  selectedCity, 
  setSelectedCity, 
  onSelectProperty 
}) {
  const [mapCategory, setMapCategory] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Active City center coordinates
  const activeCityObj = CITIES.find(c => c.id === selectedCity && c.id !== 'all') || CITIES[1]; // default to Lagos
  const mapCenter = activeCityObj.center;
  const mapZoom = activeCityObj.zoom;

  // Filter properties for map
  const filteredProperties = PROPERTIES.filter(p => {
    const cityMatch = selectedCity === 'all' || p.city === selectedCity;
    const catMatch = mapCategory === 'all' || p.type === mapCategory;
    return cityMatch && catMatch;
  });

  // Custom Leaflet Price Pin Maker
  const createCustomPriceIcon = (price, isSelected) => {
    return L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div style="
          background-color: ${isSelected ? '#151816' : '#2D5A43'};
          color: #FBF9F5;
          padding: 4px 8px;
          border-radius: 9999px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
          font-size: 11px;
          white-space: nowrap;
          border: 2px solid #ffffff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          gap: 4px;
          transform: translate(-50%, -50%);
          cursor: pointer;
        ">
          <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#8AE0B3;"></span>
          ${price}
        </div>
      `,
      iconSize: [80, 30],
      iconAnchor: [40, 15]
    });
  };

  return (
    <section id="map-explorer" className="py-16 bg-[#FBF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF2ED] text-[#2D5A43] border border-[#2D5A43]/20 text-xs font-bold uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4" />
              <span>Interactive Google Map Discovery</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#151816] tracking-tight">
              Locate Vacant Spaces in Your Target Neighborhood
            </h2>
            <p className="text-sm sm:text-base text-[#4B524D] mt-1">
              Explore verified listings across Lagos, Abuja, Port Harcourt, and Enugu. Pinpointed with exact or proximate estate coordinates.
            </p>
          </div>

          {/* Annual Pricing Badge */}
          <div className="flex items-center gap-2 bg-[#F5EFEB] px-3.5 py-2 rounded-2xl border border-[#E8DFC8] self-start md:self-auto text-xs font-bold text-[#1E3F2F]">
            <Calendar className="w-4 h-4 text-[#2D5A43]" />
            <span>Direct Annual Rent Pricing</span>
          </div>
        </div>

        {/* City & Category Filter Bar */}
        <div className="bg-white p-3 rounded-2xl border border-[#E8DFC8] shadow-sm mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* City Jump Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-xs font-bold text-[#4B524D] mr-1 shrink-0">Jump to:</span>
            {CITIES.filter(c => c.id !== 'all').map((city) => (
              <button
                key={city.id}
                onClick={() => setSelectedCity(city.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer ${
                  selectedCity === city.id
                    ? 'bg-[#1E3F2F] text-white shadow-sm'
                    : 'bg-[#F5EFEB] text-[#252926] hover:bg-[#E8DFC8]'
                }`}>
                <Navigation className="w-3 h-3 text-[#8AE0B3]" />
                {city.name}
              </button>
            ))}
          </div>

          {/* Space Type Filter */}
          <div className="flex items-center justify-between sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8DFC8]/60">
            <span className="text-xs font-bold text-[#4B524D] shrink-0">Type:</span>
            <div className="flex items-center bg-[#F5EFEB] p-1 rounded-xl overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: 'All' },
                { id: 'residential', label: 'Residential' },
                { id: 'commercial', label: 'Shops' },
                { id: 'industrial', label: 'Warehouses' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setMapCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 active:scale-95 cursor-pointer ${
                    mapCategory === cat.id
                      ? 'bg-[#2D5A43] text-white shadow-sm'
                      : 'text-[#3F4641] hover:text-[#151816]'
                  }`}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Map Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Leaflet / Google Map */}
          <div className="lg:col-span-8 bg-white p-2 rounded-2xl sm:rounded-3xl border border-[#E2D7C8] shadow-lg overflow-hidden h-[390px] sm:h-[520px] relative">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              scrollWheelZoom={false}
              className="h-full w-full rounded-2xl">
              
              <MapViewHandler center={mapCenter} zoom={mapZoom} />

              {/* CartoDB Positron clean map layer */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />

              {/* Map Markers */}
              {filteredProperties.map((prop) => {
                const priceFormatted = formatNairaCompact(prop.priceYearly);
                const isSelected = selectedProperty?.id === prop.id;

                return (
                  <Marker
                    key={prop.id}
                    position={prop.coordinates}
                    icon={createCustomPriceIcon(priceFormatted, isSelected)}
                    eventHandlers={{
                      click: () => setSelectedProperty(prop),
                    }}>
                    <Popup className="custom-popup">
                      <div className="p-1 space-y-2 text-[#151816] max-w-xs font-['Plus_Jakarta_Sans',sans-serif]">
                        <img 
                          src={prop.image} 
                          alt={prop.title}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#2D5A43]">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{prop.lister.roleBadge}</span>
                        </div>
                        <h4 className="font-bold text-xs text-[#151816] leading-snug line-clamp-2">{prop.title}</h4>
                        <p className="text-[11px] text-[#4B524D]">{prop.neighborhood}</p>
                        <div className="flex items-baseline justify-between pt-1 border-t border-gray-200">
                          <span className="font-extrabold text-sm text-[#1E3F2F]">
                            {priceFormatted}
                            <span className="text-[10px] font-normal text-gray-500">
                              /yr
                            </span>
                          </span>
                          <button
                            onClick={() => onSelectProperty(prop)}
                            className="px-2 py-1 rounded bg-[#2D5A43] text-white text-[10px] font-bold">
                            View Vacancy
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>

            {/* Map Legend Floating Pill */}
            <div className="absolute bottom-6 left-6 z-[400] bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-[#E8DFC8] text-xs space-y-1 hidden sm:block">
              <p className="font-bold text-[#151816] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2D5A43]"></span>
                Verified Nigerian Listings ({filteredProperties.length} on Map)
              </p>
              <p className="text-[11px] text-[#4B524D]">Click any pin to inspect rent & ownership credentials</p>
            </div>
          </div>

          {/* Right Column: Selected Property Quick Preview */}
          <div className="lg:col-span-4">
            {selectedProperty ? (
              <div className="bg-white p-5 rounded-3xl border border-[#E2D7C8] shadow-lg space-y-4">
                <div className="relative h-44 rounded-2xl overflow-hidden">
                  <img
                    src={selectedProperty.image}
                    alt={selectedProperty.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#1E3F2F] text-[#8AE0B3] shadow-md flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {selectedProperty.lister.roleBadge}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-[#8F8372] uppercase tracking-wider">
                    {selectedProperty.cityName} • {selectedProperty.neighborhood}
                  </span>
                  <h3 className="text-base font-extrabold text-[#151816] mt-0.5 leading-snug">
                    {selectedProperty.title}
                  </h3>
                </div>

                {/* Price Display */}
                <div className="p-3.5 rounded-xl bg-[#F5EFEB] border border-[#E2D7C8] space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#4B524D]">Direct Pricing:</span>
                    <span className="font-bold text-[#2D5A43]">
                      Standard Annual Rent
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black text-[#151816]">
                        {formatNaira(selectedProperty.priceYearly)}
                      </span>
                      <span className="text-xs text-[#4B524D] ml-1">
                        / year
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#EBF2ED] text-[#2D5A43] text-[10px] font-bold">
                      ₦0 Agent Fee
                    </span>
                  </div>
                </div>

                {/* Lister Info */}
                <div className="text-xs space-y-1.5 border-t border-[#E8DFC8] pt-3">
                  <p className="text-[#8F8372] font-semibold">Direct Legal Lister:</p>
                  <p className="font-bold text-[#151816]">{selectedProperty.lister.name}</p>
                  <p className="text-[11px] text-[#4B524D]">{selectedProperty.lister.verificationDetails}</p>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => onSelectProperty(selectedProperty)}
                    className="w-full py-2.5 rounded-xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md">
                    <Eye className="w-4 h-4" />
                    <span>View Full Vacancy Specs</span>
                  </button>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedProperty.coordinates[0]},${selectedProperty.coordinates[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 rounded-xl bg-[#F5EFEB] hover:bg-[#E8DFC8] text-[#1E3F2F] text-xs font-bold flex items-center justify-center gap-1.5 border border-[#D7CBBB]">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Directions in Google Maps</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl border border-[#E2D7C8] shadow-sm text-center flex flex-col items-center justify-center h-full min-h-[300px] space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#F5EFEB] flex items-center justify-center text-[#2D5A43]">
                  <MapPin className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-base text-[#151816]">Select a Map Pin</h4>
                <p className="text-xs text-[#4B524D] max-w-xs leading-relaxed">
                  Click any price pin on the Google map to preview verified vacancy details, lister credentials, and direct inspection booking.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setSelectedProperty(filteredProperties[0])}
                    className="px-4 py-2 rounded-xl bg-[#2D5A43] text-white text-xs font-bold">
                    Preview Featured Space
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}

