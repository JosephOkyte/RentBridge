import React, { useState } from 'react';
import { ShieldCheck, MapPin, BedDouble, Bath, Maximize2, Calendar, Phone, ArrowUpRight, CheckCircle2, UserCheck, Scale, KeyRound, Filter } from 'lucide-react';
import { CITIES, CATEGORIES, LISTER_TYPES, PROPERTIES } from '../data/properties';
import { formatNaira, formatNairaCompact } from '../utils/formatters';

export default function PropertyList({ 
  selectedCity, 
  setSelectedCity, 
  selectedCategory, 
  setSelectedCategory,
  onSelectProperty,
  onBookInspection
}) {
  const [selectedListerType, setSelectedListerType] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  // Filter properties
  const filtered = PROPERTIES.filter((p) => {
    const cityMatch = selectedCity === 'all' || p.city === selectedCity;
    const catMatch = selectedCategory === 'all' || p.type === selectedCategory;
    const listerMatch = selectedListerType === 'all' || p.lister.type === selectedListerType;
    return cityMatch && catMatch && listerMatch;
  });

  // Sort properties
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'low') return a.priceYearly - b.priceYearly;
    if (sortBy === 'high') return b.priceYearly - a.priceYearly;
    return 0;
  });

  return (
    <section id="properties" className="py-20 bg-[#F5EFEB]/50 border-t border-[#E8DFC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF2ED] text-[#2D5A43] border border-[#2D5A43]/20 text-xs font-bold uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Direct Real Estate Feed</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#151816] tracking-tight">
              Available Houses, Shops & Warehouses
            </h2>
            <p className="text-sm sm:text-base text-[#4B524D] mt-1">
              Listings across Lagos, Abuja, Port Harcourt, and Enugu. Strictly verified landlords and legal custodians.
            </p>
          </div>

          {/* Direct Annual Transparency Badge */}
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-[#E2D7C8] shadow-sm self-start md:self-auto text-xs font-bold text-[#1E3F2F]">
            <Calendar className="w-4 h-4 text-[#2D5A43]" />
            <span>Annual Lease Terms Only</span>
          </div>
        </div>

        {/* Filter Navigation Bar (Responsive on Mobile) */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E8DFC8] shadow-sm mb-8 space-y-4">
          
          {/* Category Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto py-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 active:scale-95 cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#2D5A43] text-white shadow-sm'
                      : 'bg-[#F5EFEB] text-[#3F4641] hover:bg-[#E8DFC8]'
                  }`}>
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs w-full sm:w-auto justify-between sm:justify-start pt-1 sm:pt-0 border-t sm:border-t-0 border-[#E8DFC8]/60">
              <span className="text-[#8F8372] font-semibold">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#F5EFEB] border border-[#E8DFC8] rounded-xl px-3 py-1.5 font-bold text-[#151816] focus:outline-none cursor-pointer">
                <option value="featured">Featured First</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Sub Filters: Lister Type & Active City Indicator */}
          <div className="pt-3 border-t border-[#E8DFC8]/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto py-0.5">
              <span className="font-bold text-[#8F8372] flex items-center gap-1 shrink-0 mr-1">
                <Filter className="w-3.5 h-3.5 text-[#2D5A43]" /> Role:
              </span>
              {LISTER_TYPES.map((lt) => (
                <button
                  key={lt.id}
                  onClick={() => setSelectedListerType(lt.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 active:scale-95 cursor-pointer whitespace-nowrap ${
                    selectedListerType === lt.id
                      ? 'bg-[#1E3F2F] text-white font-bold'
                      : 'bg-[#FBF9F5] text-[#4B524D] hover:bg-[#E8DFC8]'
                  }`}>
                  {lt.label}
                </button>
              ))}
            </div>

            <div className="text-[#8F8372] font-semibold hidden sm:block">
              Showing <strong className="text-[#151816]">{sorted.length}</strong> verified vacancies
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {sorted.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sorted.map((property) => {
              // Lister Badge Icon
              const ListerIcon = 
                property.lister.type === 'landlord' ? UserCheck :
                property.lister.type === 'caretaker' ? KeyRound : Scale;

              return (
                <div
                  key={property.id}
                  className="bg-white rounded-3xl border border-[#E2D7C8] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
                  
                  {/* Property Image & Badges */}
                  <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1E3F2F]/90 text-[#8AE0B3] backdrop-blur-md flex items-center gap-1.5 shadow-md">
                        <ListerIcon className="w-3.5 h-3.5" />
                        {property.lister.roleBadge}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-white/95 text-[#151816] backdrop-blur-md shadow-sm">
                        {property.cityName}
                      </span>
                    </div>

                    {/* Bottom overlay: Neighborhood */}
                    <div className="absolute bottom-3 left-3 right-3 text-white flex items-center gap-1 text-xs font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-[#8AE0B3] shrink-0" />
                      <span className="truncate">{property.neighborhood}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    
                    <div>
                      {/* Property Type Pill & Title */}
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#8F8372]">
                        {property.propertyKind}
                      </span>
                      <h3 
                        onClick={() => onSelectProperty(property)}
                        className="text-lg font-extrabold text-[#151816] hover:text-[#2D5A43] cursor-pointer transition-colors leading-snug mt-0.5 line-clamp-1">
                        {property.title}
                      </h3>

                      {/* Specs (Bed, Bath, Sqm) */}
                      <div className="flex items-center gap-4 text-xs text-[#4B524D] mt-3 pb-3 border-b border-[#E8DFC8]">
                        {property.bedrooms > 0 && (
                          <div className="flex items-center gap-1.5">
                            <BedDouble className="w-4 h-4 text-[#2D5A43]" />
                            <span>{property.bedrooms} Bed</span>
                          </div>
                        )}
                        {property.bathrooms > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Bath className="w-4 h-4 text-[#2D5A43]" />
                            <span>{property.bathrooms} Bath</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Maximize2 className="w-4 h-4 text-[#2D5A43]" />
                          <span>{property.size}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing Block (Strictly Annual) */}
                    <div className="p-3.5 rounded-2xl bg-[#F5EFEB] border border-[#E2D7C8] space-y-1">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-xl font-black text-[#151816]">
                            {formatNaira(property.priceYearly)}
                          </span>
                          <span className="text-xs text-[#4B524D] ml-1">
                            / year
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-[#EBF2ED] text-[#2D5A43] font-extrabold text-[10px]">
                          ₦0 Agent Fee
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8F8372]">
                        Direct annual lease • ₦0 viewing charges
                      </p>
                    </div>

                    {/* Lister Verification Credential */}
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-[#151816] flex items-center justify-between">
                        <span>{property.lister.name}</span>
                        <span className="text-[10px] text-[#2D5A43] font-semibold">Direct Lister</span>
                      </p>
                      <p className="text-[11px] text-[#4B524D] line-clamp-1">{property.lister.verificationDetails}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onBookInspection(property)}
                        className="py-2.5 px-3 rounded-xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm">
                        <span>Free Inspection</span>
                      </button>

                      <button
                        onClick={() => onSelectProperty(property)}
                        className="py-2.5 px-3 rounded-xl bg-[#F5EFEB] hover:bg-[#E8DFC8] text-[#1E3F2F] text-xs font-bold flex items-center justify-center gap-1 transition-all border border-[#D7CBBB]">
                        <span>Full Specs</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E8DFC8] p-8 space-y-3">
            <p className="text-lg font-bold text-[#151816]">No properties found matching these filters</p>
            <p className="text-xs text-[#4B524D]">Try switching cities or selecting "All Categories".</p>
            <button
              onClick={() => { setSelectedCity('all'); setSelectedCategory('all'); setSelectedListerType('all'); }}
              className="px-4 py-2 rounded-xl bg-[#2D5A43] text-white text-xs font-bold">
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

