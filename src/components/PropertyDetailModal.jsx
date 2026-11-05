'use client';

import React, { useState } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { X, ShieldCheck, MapPin, BedDouble, Bath, Maximize2, Calendar, Phone, CheckCircle, ExternalLink, AlertTriangle, ArrowRight, DollarSign, Lock } from 'lucide-react';
import { formatNaira, calculateTraditionalCosts } from '../utils/formatters';

export default function PropertyDetailModal({ property, onClose, onBookInspection }) {
  const { isSignedIn } = useUser();
  if (!property) return null;

  const savings = calculateTraditionalCosts(property.priceYearly);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-[#FBF9F5] w-full max-w-4xl rounded-3xl shadow-2xl border border-[#E2D7C8] overflow-hidden relative max-h-[92vh] flex flex-col">
        
        {/* Sticky Modal Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#E8DFC8] flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-[#EBF2ED] text-[#2D5A43] text-xs font-bold uppercase tracking-wider">
              {property.propertyKind}
            </span>
            <span className="text-xs font-semibold text-[#8F8372]">
              ID: {property.id}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F5EFEB] hover:bg-[#E8DFC8] text-[#151816] flex items-center justify-center transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Main Visual */}
          <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden shadow-inner">
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-[#E8DFC8] shadow-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2D5A43]" />
              <span className="text-xs font-extrabold text-[#151816]">
                {property.lister.roleBadge}
              </span>
            </div>
          </div>

          {/* Title & Location */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#151816]">
              {property.title}
            </h2>
            <div className="flex items-center gap-2 text-sm text-[#4B524D]">
              <MapPin className="w-4 h-4 text-[#2D5A43] shrink-0" />
              <span>{property.address}</span>
            </div>
          </div>

          {/* Quick Property Metrics */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F5EFEB] border border-[#E8DFC8] text-center">
            <div>
              <p className="text-[11px] font-bold text-[#8F8372] uppercase tracking-wider">Bedrooms</p>
              <p className="text-lg font-black text-[#151816] mt-0.5">{property.bedrooms || 'Studio/Open'}</p>
            </div>
            <div className="border-x border-[#E2D7C8]">
              <p className="text-[11px] font-bold text-[#8F8372] uppercase tracking-wider">Bathrooms</p>
              <p className="text-lg font-black text-[#151816] mt-0.5">{property.bathrooms || 'En-suite'}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#8F8372] uppercase tracking-wider">Total Area</p>
              <p className="text-lg font-black text-[#151816] mt-0.5">{property.size}</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-sm text-[#151816] uppercase tracking-wider">Direct Description</h3>
            <p className="text-sm text-[#4B524D] leading-relaxed bg-white p-4 rounded-2xl border border-[#E8DFC8]">
              {property.description}
            </p>
          </div>

          {/* Amenities & Verification Checklist */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-sm text-[#151816] uppercase tracking-wider">Verified Property Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {property.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] text-xs font-semibold text-[#151816]">
                  <CheckCircle className="w-4 h-4 text-[#2D5A43] shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rent Breakdown & Savings Highlight */}
          <div className="p-5 rounded-2xl bg-[#EBF2ED] border border-[#2D5A43]/20 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#2D5A43] uppercase tracking-wider">Transparent Annual Terms</span>
                <p className="text-2xl font-black text-[#151816]">
                  {formatNaira(property.priceYearly)}
                  <span className="text-xs font-normal text-[#4B524D] ml-1">/ year</span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#2D5A43] uppercase tracking-wider">Zero Agency Markup</span>
                <p className="text-lg font-extrabold text-[#2D5A43]">
                  Save ~{formatNaira(savings.totalSaved)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-[#2D5A43]/20 text-xs text-[#333]">
              <div className="bg-white/80 p-2.5 rounded-lg border border-[#2D5A43]/10">
                <span className="text-[#8F8372] block text-[10px]">Caution Deposit:</span>
                <span className="font-bold text-[#151816]">{formatNaira(property.cautionDeposit)}</span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-lg border border-[#2D5A43]/10">
                <span className="text-[#8F8372] block text-[10px]">Service Charge:</span>
                <span className="font-bold text-[#151816]">{formatNaira(property.serviceCharge)}</span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-lg border border-[#2D5A43]/10">
                <span className="text-[#8F8372] block text-[10px]">Agency / Legal Fee:</span>
                <span className="font-bold text-[#2D5A43]">₦0 (Zero)</span>
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

        {/* Modal Sticky Footer Actions with Clerk Auth Gate */}
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
            {isSignedIn ? (
              <>
                <a
                  href={`https://wa.me/${property.lister.whatsapp}?text=Hello%20${encodeURIComponent(property.lister.name)},%20I%20am%20interested%20in%20inspecting%20the%20${encodeURIComponent(property.title)}%20listed%20on%20RentBridge.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial px-4 py-3 rounded-xl bg-[#F5EFEB] hover:bg-[#E8DFC8] text-[#1E3F2F] text-xs font-bold flex items-center justify-center gap-2 border border-[#D7CBBB]">
                  <Phone className="w-4 h-4 text-[#2D5A43]" />
                  <span>Direct WhatsApp ({property.lister.phone})</span>
                </a>

                <button
                  onClick={() => {
                    onClose();
                    onBookInspection(property);
                  }}
                  className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer">
                  <Calendar className="w-4 h-4" />
                  <span>Book Free Inspection</span>
                </button>
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="flex-1 sm:flex-initial px-4 py-3 rounded-xl bg-[#F5EFEB] hover:bg-[#E8DFC8] text-[#1E3F2F] text-xs font-bold flex items-center justify-center gap-2 border border-[#D7CBBB] cursor-pointer">
                    <Lock className="w-4 h-4 text-[#2D5A43]" />
                    <span>Sign In to Reveal Contact</span>
                  </button>
                </SignInButton>

                <SignInButton mode="modal">
                  <button className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer">
                    <Calendar className="w-4 h-4" />
                    <span>Sign In to Book Inspection</span>
                  </button>
                </SignInButton>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
