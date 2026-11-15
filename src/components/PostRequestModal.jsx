'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  X, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Lock, 
  Check, 
  Share2, 
  ExternalLink,
  Loader2,
  DollarSign,
  Tag
} from 'lucide-react';
import { formatNaira } from '../utils/formatters';

const POPULAR_LOCATIONS = {
  lagos: ['Lekki Phase 1', 'Admiralty Way', 'Ikate Elegushi', 'Chevron Drive', 'Victoria Island', 'Yaba / Mainland', 'Ikeja GRA'],
  abuja: ['Wuse 2', 'Maitama Axis', 'Gwarinpa Estate', 'Jabi Lake', 'Guzape', 'Asokoro'],
  ph: ['Old GRA', 'GRA Phase 2', 'Peter Odili Road', 'Trans-Amadi', 'Ada George'],
  enugu: ['Independence Layout', 'New Haven', 'Golf Estate', 'GRA Enugu'],
};

const PROPERTY_TYPES = [
  { id: 'mini_flat', label: 'Self-Contain / Mini-Flat (1 Bed)' },
  { id: '2_bed_apartment', label: '2-Bedroom Serviced Flat' },
  { id: '3_bed_apartment', label: '3-Bedroom Luxury Apartment' },
  { id: '3_bed_duplex', label: '3-Bedroom Terrace / Duplex' },
  { id: '4_bed_duplex', label: '4-Bedroom Semi/Detached Duplex' },
  { id: 'commercial_office', label: 'Commercial Office / Plaza Space' },
];

const MUST_HAVE_OPTIONS = [
  'Flood-Free Access Road',
  'Dedicated Smart Prepaid Metre',
  'Central Estate Gen (12h-24h)',
  'Inverter / Solar System in Place',
  'Industrial Water Treatment Plant',
  'Gated Estate Security Gate',
  'Ample 2+ Car Parking',
  'Direct Owner / SAN Custody Only',
];

export default function PostRequestModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    seekerName: '',
    seekerPhone: '',
    seekerEmail: '',
    city: 'lagos',
    preferredLocations: ['Lekki Phase 1'],
    customLocation: '',
    propertyType: '2_bed_apartment',
    minBudget: '3500000',
    maxBudget: '5500000',
    moveInTimeline: 'within_14_days',
    mustHaves: ['Flood-Free Access Road', 'Dedicated Smart Prepaid Metre'],
    seekerBio: '',
    agreeAntiAgent: true,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleLocationToggle = (loc) => {
    setFormData((prev) => {
      const exists = prev.preferredLocations.includes(loc);
      const updated = exists 
        ? prev.preferredLocations.filter((l) => l !== loc)
        : [...prev.preferredLocations, loc];
      return { ...prev, preferredLocations: updated };
    });
  };

  const handleAddCustomLocation = (e) => {
    e.preventDefault();
    if (!formData.customLocation.trim()) return;
    if (!formData.preferredLocations.includes(formData.customLocation.trim())) {
      setFormData((prev) => ({
        ...prev,
        preferredLocations: [...prev.preferredLocations, prev.customLocation.trim()],
        customLocation: '',
      }));
    }
  };

  const handleMustHaveToggle = (item) => {
    setFormData((prev) => {
      const exists = prev.mustHaves.includes(item);
      const updated = exists 
        ? prev.mustHaves.filter((m) => m !== item)
        : [...prev.mustHaves, item];
      return { ...prev, mustHaves: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!formData.seekerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const cleanPhone = formData.seekerPhone.replace(/\s+/g, '');
    const phoneRegex = /^(\+?234|0)[789][01]\d{8}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setErrorMessage('Please enter a valid 11-digit Nigerian phone number (e.g. 0803 123 4567 or +234 803 123 4567).');
      return;
    }

    if (!formData.seekerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.seekerEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    const min = Number(formData.minBudget) || 0;
    const max = Number(formData.maxBudget) || 0;
    if (max <= 0 || max < min) {
      setErrorMessage('Maximum annual rent budget must be equal to or greater than minimum budget.');
      return;
    }

    if (!formData.agreeAntiAgent) {
      setErrorMessage('You must agree to direct custodian connection with ₦0 agent fees.');
      return;
    }

    setLoading(true);

    try {
      const propTypeObj = PROPERTY_TYPES.find((p) => p.id === formData.propertyType);
      const payload = {
        seekerName: formData.seekerName.trim(),
        seekerPhone: cleanPhone,
        seekerEmail: formData.seekerEmail.trim().toLowerCase(),
        city: formData.city,
        preferredLocations: formData.preferredLocations.length > 0 ? formData.preferredLocations : ['Flexible within hub'],
        propertyType: formData.propertyType,
        propertyTypeLabel: propTypeObj ? propTypeObj.label : 'Apartment / Flat',
        minBudget: min,
        maxBudget: max,
        moveInTimeline: formData.moveInTimeline,
        moveInTimelineLabel: formData.moveInTimeline === 'immediate' ? 'Immediate (<7 Days)' : formData.moveInTimeline === 'within_14_days' ? 'Within 14 Days' : 'Next Month',
        mustHaves: formData.mustHaves,
        seekerBio: formData.seekerBio.trim() || 'Verified prospective tenant looking for verified direct custodian connection.',
      };

      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit housing request.');
      }

      setSubmittedTicket(data.request);
      if (onSuccess) onSuccess(data.request);
    } catch (err) {
      console.error('Request submission error:', err);
      setErrorMessage(err.message || 'Something went wrong submitting your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTicket = () => {
    if (!submittedTicket) return;
    const url = `${window.location.origin}/requests?ticket=${submittedTicket.ticketId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#151816]/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E8DFC8] overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-[#1E3F2F] text-white flex items-center justify-between border-b border-[#2D5A43]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#8AE0B3] border border-white/10">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                  Post a Housing Request (Wanted Board)
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#8AE0B3]/20 text-[#8AE0B3] border border-[#8AE0B3]/30">
                  ₦0 Fee
                </span>
              </div>
              <p className="text-xs text-[#E2D7C8]">
                Verified landlords & caretakers will pitch matching homes directly to you.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#E2D7C8] hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          
          {submittedTicket ? (
            /* Post-Submit Confirmation View */
            <div className="space-y-6 py-4 animate-fadeIn text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#EBF2ED] text-[#2D5A43] flex items-center justify-center mx-auto border border-[#8AE0B3]/40 shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#EBF2ED] text-[#2D5A43] uppercase tracking-wider mb-2">
                  Request Published & Shielded
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#151816]">
                  Your Ticket is Live!
                </h2>
                <p className="text-sm text-[#4B524D] mt-1 max-w-md mx-auto">
                  We have notified verified property owners in <strong className="text-[#151816] capitalize">{submittedTicket.city}</strong> matching your criteria.
                </p>
              </div>

              {/* Certified Ticket Card */}
              <div className="p-5 rounded-2xl bg-[#F5EFEB] border border-[#E8DFC8] max-w-md mx-auto text-left space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC8]">
                  <span className="text-xs font-semibold text-[#8F8372]">Ticket Reference:</span>
                  <span className="font-mono text-base font-black text-[#2D5A43] bg-white px-2.5 py-1 rounded-lg border border-[#D7CBBB]">
                    {submittedTicket.ticketId}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#8F8372] block">Seeker:</span>
                    <strong className="text-[#151816] font-bold">{submittedTicket.seekerName}</strong>
                  </div>
                  <div>
                    <span className="text-[#8F8372] block">Privacy Shield:</span>
                    <span className="text-[#2D5A43] font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      {submittedTicket.seekerPhoneMasked}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8F8372] block">Target Hub:</span>
                    <strong className="text-[#151816] font-bold capitalize">{submittedTicket.city}</strong>
                  </div>
                  <div>
                    <span className="text-[#8F8372] block">Budget Bracket:</span>
                    <strong className="text-[#2D5A43] font-bold">
                      {formatNaira(submittedTicket.minBudget)} - {formatNaira(submittedTicket.maxBudget)}
                    </strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E8DFC8] flex items-center gap-2 text-[11px] text-[#4B524D]">
                  <ShieldCheck className="w-4 h-4 text-[#2D5A43] shrink-0" />
                  <span>Roadside agents cannot harvest your phone number. Only Phase 1 Verified Custodians can propose properties.</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleCopyTicket}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-[#F5EFEB] hover:bg-[#EAE2D8] text-[#1E3F2F] border border-[#D7CBBB] transition-all">
                  {copiedLink ? <Check className="w-4 h-4 text-[#2D5A43]" /> : <Share2 className="w-4 h-4 text-[#2D5A43]" />}
                  <span>{copiedLink ? 'Link Copied!' : 'Copy Direct Request Link'}</span>
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Hello! I just published a verified housing request on RentBridge [${submittedTicket.ticketId}] for ${submittedTicket.propertyTypeLabel} in ${submittedTicket.cityName} (Budget: ${formatNaira(submittedTicket.minBudget)} - ${formatNaira(submittedTicket.maxBudget)}/yr). Verified owners can propose with ₦0 agent fees: ${window.location.origin}/requests`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-[#25D366] hover:bg-[#20ba59] text-white shadow-md shadow-[#25D366]/20 transition-all">
                  <span>Share on WhatsApp</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setSubmittedTicket(null);
                    onClose();
                  }}
                  className="text-xs font-bold text-[#8F8372] hover:text-[#151816] underline">
                  Done & Return to Site
                </button>
              </div>
            </div>
          ) : (
            /* Submission Form View */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Privacy Notice Banner */}
              <div className="p-4 rounded-2xl bg-[#EBF2ED] border border-[#8AE0B3]/50 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#2D5A43] shrink-0 mt-0.5" />
                <div className="text-xs text-[#1E3F2F] leading-relaxed">
                  <strong>The Anti-Agent Privacy Guarantee:</strong> Unlike regular classified sites, your phone number and email are <strong>100% masked</strong>. Rogue roadside agents cannot scrape your contact. Only landlords and legal custodians who have verified proof of title can submit match proposals.
                </div>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-shake">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Section 1: Seeker Identity & Shielded Contact */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8F8372] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#2D5A43]" />
                  <span>1. Seeker Identity & Contact (Shielded)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#151816] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chinedu Okafor"
                      value={formData.seekerName}
                      onChange={(e) => setFormData({ ...formData, seekerName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7CBBB] bg-[#FBF9F5] text-xs font-medium text-[#151816] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#151816] mb-1">
                      Nigerian Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0803 123 4567"
                      value={formData.seekerPhone}
                      onChange={(e) => setFormData({ ...formData, seekerPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7CBBB] bg-[#FBF9F5] text-xs font-medium text-[#151816] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#151816] mb-1">
                      Email Address (For Landlord Match Alerts) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. chinedu@example.com"
                      value={formData.seekerEmail}
                      onChange={(e) => setFormData({ ...formData, seekerEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7CBBB] bg-[#FBF9F5] text-xs font-medium text-[#151816] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: City & Target Hubs */}
              <div className="space-y-3 pt-3 border-t border-[#E8DFC8]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8F8372] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#2D5A43]" />
                  <span>2. City & Target Neighborhoods</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'lagos', label: 'Lagos' },
                    { id: 'abuja', label: 'Abuja' },
                    { id: 'ph', label: 'Port Harcourt' },
                    { id: 'enugu', label: 'Enugu' },
                  ].map((city) => (
                    <button
                      type="button"
                      key={city.id}
                      onClick={() => setFormData({ ...formData, city: city.id, preferredLocations: POPULAR_LOCATIONS[city.id].slice(0, 2) })}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                        formData.city === city.id
                          ? 'bg-[#2D5A43] text-white border-[#2D5A43] shadow-sm'
                          : 'bg-[#F5EFEB] text-[#151816] border-[#D7CBBB] hover:border-[#2D5A43]'
                      }`}>
                      {city.label}
                    </button>
                  ))}
                </div>

                {/* Micro-neighborhood tags */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-[#151816] mb-1.5">
                    Select Preferred Neighborhoods in {formData.city.toUpperCase()}:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_LOCATIONS[formData.city]?.map((loc) => {
                      const isSelected = formData.preferredLocations.includes(loc);
                      return (
                        <button
                          type="button"
                          key={loc}
                          onClick={() => handleLocationToggle(loc)}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                            isSelected
                              ? 'bg-[#1E3F2F] text-white border-[#1E3F2F] font-bold'
                              : 'bg-white text-[#4B524D] border-[#D7CBBB] hover:border-[#2D5A43]'
                          }`}>
                          {isSelected ? '✓ ' : '+ '}
                          {loc}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Location input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Or type specific street / estate name..."
                    value={formData.customLocation}
                    onChange={(e) => setFormData({ ...formData, customLocation: e.target.value })}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-[#D7CBBB] bg-[#FBF9F5] focus:outline-none focus:ring-1 focus:ring-[#2D5A43]"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomLocation}
                    className="px-3 py-1.5 text-xs font-bold rounded-xl bg-[#F5EFEB] text-[#1E3F2F] border border-[#D7CBBB] hover:bg-[#EAE2D8]">
                    Add Area
                  </button>
                </div>
              </div>

              {/* Section 3: Property Type & Annual Budget Range */}
              <div className="space-y-3 pt-3 border-t border-[#E8DFC8]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8F8372] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#2D5A43]" />
                  <span>3. Property Type & Annual Rent Budget</span>
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-[#151816] mb-1">
                    Property Category *
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7CBBB] bg-[#FBF9F5] text-xs font-medium text-[#151816] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]">
                    {PROPERTY_TYPES.map((pt) => (
                      <option key={pt.id} value={pt.id}>
                        {pt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#151816] mb-1">
                      Min Annual Rent (₦) *
                    </label>
                    <input
                      type="number"
                      step="100000"
                      min="500000"
                      required
                      value={formData.minBudget}
                      onChange={(e) => setFormData({ ...formData, minBudget: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7CBBB] bg-[#FBF9F5] text-xs font-medium text-[#151816] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
                    />
                    <span className="text-[10px] text-[#8F8372] mt-0.5 block">
                      {formatNaira(formData.minBudget)}/yr
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#151816] mb-1">
                      Max Annual Rent (₦) *
                    </label>
                    <input
                      type="number"
                      step="100000"
                      min="500000"
                      required
                      value={formData.maxBudget}
                      onChange={(e) => setFormData({ ...formData, maxBudget: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7CBBB] bg-[#FBF9F5] text-xs font-medium text-[#151816] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
                    />
                    <span className="text-[10px] text-[#2D5A43] font-bold mt-0.5 block">
                      {formatNaira(formData.maxBudget)}/yr
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 4: Move-in Timeline & Naija Reality Must-Haves */}
              <div className="space-y-3 pt-3 border-t border-[#E8DFC8]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8F8372] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#2D5A43]" />
                  <span>4. Move-in Window & Naija Living Must-Haves</span>
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-[#151816] mb-1.5">
                    Target Move-in Urgency:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'immediate', label: 'Immediate (<7 Days)' },
                      { id: 'within_14_days', label: 'Within 14 Days' },
                      { id: 'next_month', label: 'Next Month' },
                      { id: 'flexible', label: 'Flexible' },
                    ].map((time) => (
                      <button
                        type="button"
                        key={time.id}
                        onClick={() => setFormData({ ...formData, moveInTimeline: time.id })}
                        className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                          formData.moveInTimeline === time.id
                            ? 'bg-[#1E3F2F] text-white border-[#1E3F2F]'
                            : 'bg-[#F5EFEB] text-[#4B524D] border-[#D7CBBB]'
                        }`}>
                        {time.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#151816] mb-1.5">
                    Must-Have Features (Tick all that apply):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {MUST_HAVE_OPTIONS.map((item) => {
                      const isChecked = formData.mustHaves.includes(item);
                      return (
                        <button
                          type="button"
                          key={item}
                          onClick={() => handleMustHaveToggle(item)}
                          className={`text-left text-xs p-2 rounded-xl border flex items-center gap-2 transition-all ${
                            isChecked
                              ? 'bg-[#EBF2ED] text-[#1E3F2F] border-[#8AE0B3] font-bold'
                              : 'bg-white text-[#4B524D] border-[#D7CBBB]'
                          }`}>
                          <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                            isChecked ? 'bg-[#2D5A43] text-white' : 'border border-[#D7CBBB]'
                          }`}>
                            {isChecked ? '✓' : ''}
                          </div>
                          <span>{item}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#151816] mb-1">
                    Seeker Profile Note (Helps Landlords Pick You):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Senior Software Engineer working remote. Solo occupant, looking for quiet environment with stable power."
                    value={formData.seekerBio}
                    onChange={(e) => setFormData({ ...formData, seekerBio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7CBBB] bg-[#FBF9F5] text-xs font-medium text-[#151816] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  />
                </div>
              </div>

              {/* Anti-Agent Agreement */}
              <div className="pt-3 border-t border-[#E8DFC8]">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeAntiAgent}
                    onChange={(e) => setFormData({ ...formData, agreeAntiAgent: e.target.checked })}
                    className="mt-0.5 rounded border-[#D7CBBB] text-[#2D5A43] focus:ring-[#2D5A43]"
                  />
                  <span className="text-xs text-[#4B524D] leading-tight">
                    I agree to deal direct with verified property owners or authorized legal custodians only. I understand that RentBridge charges <strong>₦0 agent fee</strong> and guarantees free inspections.
                  </span>
                </label>
              </div>

              {/* Submit CTA with Double-Submit Lock */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#2D5A43] hover:bg-[#1E3F2F] disabled:opacity-60 text-white font-black text-sm tracking-tight shadow-xl shadow-[#2D5A43]/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#8AE0B3]" />
                      <span>Transmitting Ticket to Landlords...</span>
                    </>
                  ) : (
                    <>
                      <span>Publish Request to Matchboard (100% Free)</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}

