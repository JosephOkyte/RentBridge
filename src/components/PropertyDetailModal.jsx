import React, { useState } from 'react';
import { X, ShieldCheck, MapPin, BedDouble, Bath, Maximize2, Calendar, Phone, CheckCircle, ExternalLink, AlertTriangle, ArrowRight, DollarSign } from 'lucide-react';
import { formatNaira, calculateTraditionalCosts } from '../utils/formatters';

export default function PropertyDetailModal({ property, onClose, onBookInspection }) {
  if (!property) return null;

  const savings = calculateTraditionalCosts(property.priceYearly);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-[#FBF9F5] w-full max-w-4xl rounded-3xl shadow-2xl border border-[#E2D7C8] overflow-hidden relative max-h-[92vh] flex flex-col">
        
        {/* Sticky Modal Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#E8DFC8] flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1E3F2F] text-[#8AE0B3] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              {property.lister.roleBadge}
            </span>
            <span className="text-xs text-[#8F8372] hidden sm:inline font-semibold">
              {property.cityName} • {property.neighborhood}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F5EFEB] text-[#151816] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-8">
          
          {/* Main Visual Banner */}
          <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96 w-full shadow-md">
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="px-2.5 py-1 rounded-md bg-[#2D5A43] text-xs font-bold uppercase tracking-wider">
                {property.propertyKind}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-1 text-white leading-tight">
                {property.title}
              </h2>
              <p className="text-xs sm:text-sm text-white/90 flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4 text-[#8AE0B3]" />
                {property.address}
              </p>
            </div>
          </div>

          {/* Quick Specs Pill Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {property.bedrooms > 0 && (
              <div className="p-3 bg-white rounded-xl border border-[#E8DFC8] text-center">
                <p className="text-xs text-[#8F8372] font-semibold">Bedrooms</p>
                <p className="text-base font-extrabold text-[#151816]">{property.bedrooms} En-suite</p>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="p-3 bg-white rounded-xl border border-[#E8DFC8] text-center">
                <p className="text-xs text-[#8F8372] font-semibold">Bathrooms</p>
                <p className="text-base font-extrabold text-[#151816]">{property.bathrooms} Baths</p>
              </div>
            )}
            <div className="p-3 bg-white rounded-xl border border-[#E8DFC8] text-center">
              <p className="text-xs text-[#8F8372] font-semibold">Total Area</p>
              <p className="text-base font-extrabold text-[#151816]">{property.size}</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#E8DFC8] text-center">
              <p className="text-xs text-[#8F8372] font-semibold">Middleman Commission</p>
              <p className="text-base font-extrabold text-[#2D5A43]">₦0 (Zero)</p>
            </div>
          </div>

          {/* Payment Terms & Pricing Structure */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2D7C8] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8DFC8] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#151816]">Rent Payment Schedule</h3>
                <p className="text-xs text-[#4B524D]">Direct annual lease agreement:</p>
              </div>

              <span className="px-3.5 py-1.5 rounded-xl bg-[#EBF2ED] text-[#2D5A43] border border-[#8AE0B3]/50 text-xs font-bold self-start sm:self-auto">
                Annual Lease Terms Only
              </span>
            </div>

            {/* Cost Breakdown Table */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-1">
                <span className="text-[#4B524D]">
                  Annual Rent Due:
                </span>
                <span className="text-xl font-extrabold text-[#151816]">
                  {formatNaira(property.priceYearly)}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-[#E8DFC8]/60">
                <span className="text-[#4B524D]">Caution Deposit (100% Refundable):</span>
                <span className="font-semibold text-[#151816]">{formatNaira(property.cautionDeposit)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-[#E8DFC8]/60">
                <span className="text-[#4B524D]">Service Charge / Estate Maintenance:</span>
                <span className="font-semibold text-[#151816]">{formatNaira(property.serviceCharge)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-[#E8DFC8]/60 text-[#2D5A43]">
                <span className="font-bold">Traditional Agent Fee (10%):</span>
                <span className="font-extrabold">₦0 (WAIVED DIRECT)</span>
              </div>
            </div>

            {/* Savings Callout Banner */}
            <div className="p-3.5 bg-[#EBF2ED] rounded-xl border border-[#8AE0B3]/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#2D5A43]" />
                <span className="font-bold text-[#1E3F2F]">
                  You save over {formatNaira(savings.totalSaved)} in unnecessary agent & legal markups!
                </span>
              </div>
              <span className="bg-[#2D5A43] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Direct Deal
              </span>
            </div>
          </div>

          {/* Description & Amenities */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#151816]">Property Overview</h3>
            <p className="text-sm text-[#4B524D] leading-relaxed">
              {property.description}
            </p>

            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8F8372] mb-3">Key Amenities & Standards</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {property.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-medium text-[#252926] bg-white p-2.5 rounded-xl border border-[#E8DFC8]">
                    <CheckCircle className="w-4 h-4 text-[#2D5A43] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Verified Lister Profile Card */}
          <div className="p-6 rounded-2xl bg-[#F5EFEB] border border-[#E2D7C8] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8F8372] uppercase tracking-wider">Direct Lister Verification Credentials</span>
              <span className="text-xs text-[#2D5A43] font-bold bg-[#EBF2ED] px-2.5 py-0.5 rounded-full border border-[#2D5A43]/20">
                {property.lister.verifiedDate}
              </span>
            </div>

            <div className="flex items-start gap-4 bg-white p-4 rounded-xl border border-[#E8DFC8]">
              <div className="w-12 h-12 rounded-xl bg-[#2D5A43] text-white flex items-center justify-center font-bold text-lg shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-[#151816]">{property.lister.name}</h4>
                  <span className="text-[10px] font-bold bg-[#1E3F2F] text-[#8AE0B3] px-2 py-0.5 rounded">
                    {property.lister.roleBadge}
                  </span>
                </div>
                <p className="text-xs text-[#4B524D]">{property.lister.verificationDetails}</p>
                <p className="text-[11px] text-[#2D5A43] font-semibold">
                  Zero Agent Wahala Policy: Verified direct key-holder with no intermediary markup.
                </p>
              </div>
            </div>

            {/* Zero inspection fee warning */}
            <div className="text-[11px] text-[#4B524D] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0" />
              <span>
                <strong>Zero Inspection Fee Guarantee:</strong> It is strictly forbidden for anyone on RentBridge to ask for viewing or transport money.
              </span>
            </div>
          </div>

        </div>

        {/* Modal Sticky Footer Actions */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#E8DFC8] flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 z-10">
          <div>
            <p className="text-xs text-[#8F8372]">Direct Price:</p>
            <p className="text-2xl font-black text-[#151816]">
              {formatNaira(property.priceYearly)}
              <span className="text-xs font-normal text-[#4B524D] ml-1">
                / year
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={`https://wa.me/${property.lister.whatsapp}?text=Hello%20${encodeURIComponent(property.lister.name)},%20I%20am%20interested%20in%20inspecting%20the%20${encodeURIComponent(property.title)}%20listed%20on%20RentBridge.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-4 py-3 rounded-xl bg-[#F5EFEB] hover:bg-[#E8DFC8] text-[#1E3F2F] text-xs font-bold flex items-center justify-center gap-2 border border-[#D7CBBB]">
              <Phone className="w-4 h-4 text-[#2D5A43]" />
              <span>Direct WhatsApp</span>
            </a>

            <button
              onClick={() => {
                onClose();
                onBookInspection(property);
              }}
              className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md">
              <Calendar className="w-4 h-4" />
              <span>Book Free Inspection</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

