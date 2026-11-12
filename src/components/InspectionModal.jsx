'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { 
  X, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  User, 
  Phone, 
  AlertCircle, 
  Send, 
  Loader2,
  MessageCircle,
  Printer,
  Download,
  FileCheck,
  Check,
  ArrowRight
} from 'lucide-react';
import { formatNaira } from '../utils/formatters';
import { validateNigerianPhone, validateEmail, validateRequired } from '../utils/validation';

export default function InspectionModal({ property, onClose }) {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    preferredDate: '',
    preferredTime: '10:00 AM',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || user.firstName || prev.fullName,
        email: user.primaryEmailAddress?.emailAddress || prev.email,
        phone: user.primaryPhoneNumber?.phoneNumber || prev.phone,
      }));
    }
  }, [user]);

  if (!property) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Double-Submission Lock Guard
    if (loading) return;

    // 2. Client-Side Input Validation (Before Network Request)
    setErrorMessage('');

    const nameCheck = validateRequired(formData.fullName, 'Full Name', 2);
    if (!nameCheck.valid) {
      setErrorMessage(nameCheck.error);
      return;
    }

    const phoneCheck = validateNigerianPhone(formData.phone);
    if (!phoneCheck.valid) {
      setErrorMessage(phoneCheck.error);
      return;
    }

    const emailCheck = validateEmail(formData.email);
    if (!emailCheck.valid) {
      setErrorMessage(emailCheck.error);
      return;
    }

    if (!formData.preferredDate) {
      setErrorMessage('Please select a preferred viewing date.');
      return;
    }

    const selectedDateObj = new Date(formData.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDateObj < today) {
      setErrorMessage('Please select a current or future date for the physical inspection.');
      return;
    }

    // 3. Double-Submission Lock State Activation
    setLoading(true);

    // 4. Try/Catch Error Resilience
    try {
      const res = await fetch('/api/inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.id,
          propertyTitle: property.title,
          listerName: property.lister?.name || 'Direct Custodian',
          listerPhone: property.lister?.phone || '',
          listerEmail: property.lister?.email || 'custodian@rentbridge.ng',
          scheduledDate: formData.preferredDate,
          timeSlot: formData.preferredTime,
          notes: formData.notes?.trim() || '',
          phone: phoneCheck.normalized,
          email: formData.email.trim(),
          fullName: formData.fullName.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inspection request to RentBridge database.');
      }

      // 5. Success Confirmation Flow with Ingestion ID and Gate Pass
      const refId = data.inspection?.id 
        ? `RB-INSP-${String(data.inspection.id).slice(-5).toUpperCase()}` 
        : `RB-INSP-${Math.floor(10000 + Math.random() * 90000)}`;
      const gatePass = data.inspection?.pass_code || `PASS-${Math.floor(100000 + Math.random() * 900000)}`;

      setSubmissionData({
        refId,
        gatePass,
        date: formData.preferredDate,
        time: formData.preferredTime,
        tenantName: formData.fullName.trim(),
        tenantPhone: phoneCheck.normalized,
        listerName: property.lister?.name || 'Property Custodian',
        listerPhone: property.lister?.phone || '',
        propertyTitle: property.title,
        neighborhood: property.neighborhood || property.cityName,
      });

      setSubmitted(true);
    } catch (err) {
      console.error('[RentBridge Inspection Submit Error]:', err);
      setErrorMessage(
        err.message || 'A network error occurred while securing your viewing slot. Please check your connection and try again.'
      );
    } finally {
      // Unlock button in all scenarios
      setLoading(false);
    }
  };

  const handlePrintSlip = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const cleanListerPhone = submissionData?.listerPhone 
    ? submissionData.listerPhone.replace(/[^\d]/g, '') 
    : (property.lister?.phone || '2348000000000').replace(/[^\d]/g, '');
  const normalizedListerPhone = cleanListerPhone.startsWith('0') 
    ? '234' + cleanListerPhone.slice(1) 
    : cleanListerPhone;

  const whatsappMessage = encodeURIComponent(
    `Hello ${submissionData?.listerName || property.lister?.name || 'Custodian'}, I just booked a direct viewing on RentBridge for "${property.title}".\n\n` +
    `• Booking Ref: ${submissionData?.refId || 'RB-INSP-PENDING'}\n` +
    `• Compound Gate Pass: ${submissionData?.gatePass || 'PASS-VERIFIED'}\n` +
    `• Scheduled Time: ${submissionData?.date || formData.preferredDate} at ${submissionData?.time || formData.preferredTime}\n` +
    `• Tenant: ${formData.fullName} (${formData.phone})\n\n` +
    `Please confirm receipt and compound gate clearance.`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#FBF9F5] w-full max-w-lg rounded-3xl shadow-2xl border border-[#E2D7C8] overflow-hidden relative">
        
        {/* Header */}
        <div className="p-5 bg-white border-b border-[#E8DFC8] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#2D5A43]">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Free Property Inspection</span>
            </div>
            <h3 className="text-lg font-bold text-[#151816] mt-0.5">
              {submitted ? 'Viewing Confirmed & Gate Pass Issued' : 'Schedule a Direct Viewing'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F5EFEB] text-[#151816] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 sm:p-8 text-center space-y-5 animate-fadeIn">
            {/* Success Icon & Ingestion Badge */}
            <div className="space-y-2">
              <div className="w-16 h-16 rounded-full bg-[#EBF2ED] text-[#2D5A43] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151816] text-[#8AE0B3] text-[11px] font-mono font-bold uppercase tracking-wider">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Ingestion ID: {submissionData?.refId}</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-[#151816]">
                Inspection Secured & Transmitted
              </h4>
              <p className="text-xs text-[#4B524D] leading-relaxed max-w-md mx-auto">
                Your viewing request has been stamped directly to our database and transmitted to <strong>{property.lister.name}</strong> ({property.lister.roleBadge}).
              </p>
            </div>

            {/* Official Estate Pass Card */}
            <div className="p-4 rounded-2xl bg-white border-2 border-dashed border-[#2D5A43]/40 text-left space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-2.5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8F8372] block">Compound Gate Pass Code</span>
                  <span className="text-xl font-black font-mono text-[#2D5A43] tracking-wider">
                    {submissionData?.gatePass}
                  </span>
                </div>
                <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-lg bg-[#EBF2ED] text-[#2D5A43] border border-[#2D5A43]/30">
                  ₦0 Fee Certified
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-[#8F8372] uppercase font-bold block">Viewing Slot</span>
                  <span className="font-bold text-[#151816]">
                    {submissionData?.date} ({submissionData?.time})
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8F8372] uppercase font-bold block">Verified Lister</span>
                  <span className="font-bold text-[#151816] truncate block">
                    {property.lister.name}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-[#4B524D] bg-[#F5EFEB] p-2.5 rounded-xl border border-[#E8DFC8]">
                <strong>Estate Security Protocol:</strong> Present this pass code at the gate barrier. Do not pay any viewing or registration charges.
              </div>
            </div>

            {/* Action Buttons: WhatsApp Direct, PDF Download & Exit */}
            <div className="space-y-2.5 pt-1">
              <a
                href={`https://wa.me/${normalizedListerPhone}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer">
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Open Direct WhatsApp Chat with Custodian</span>
              </a>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handlePrintSlip}
                  className="py-3 px-3 rounded-xl bg-white hover:bg-[#F5EFEB] border border-[#E8DFC8] text-[#151816] text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all">
                  <Printer className="w-3.5 h-3.5 text-[#2D5A43]" />
                  <span>Print Pass (PDF)</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-3 rounded-xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all">
                  <span>Done & Return</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Quick Property Context */}
            <div className="p-3 bg-white rounded-xl border border-[#E8DFC8] flex items-center gap-3">
              <img
                src={property.image}
                alt={property.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="text-xs">
                <p className="font-bold text-[#151816] line-clamp-1">{property.title}</p>
                <p className="text-[#8F8372]">{property.neighborhood}, {property.cityName}</p>
                <p className="text-[#2D5A43] font-bold">Direct from {property.lister.roleBadge}</p>
              </div>
            </div>

            {/* Zero inspection fee notice */}
            <div className="p-3 rounded-xl bg-[#EBF2ED] border border-[#8AE0B3]/60 text-xs text-[#1E3F2F] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2D5A43] shrink-0" />
              <span><strong>Policy Reminder:</strong> You pay ₦0 inspection fees. Never give money to anyone on site.</span>
            </div>

            {/* Contact Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#151816] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chinedu Okafor"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8DFC8] text-xs text-[#151816] focus:outline-none focus:border-[#2D5A43]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#151816] mb-1">WhatsApp / Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="0803 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8DFC8] text-xs text-[#151816] focus:outline-none focus:border-[#2D5A43]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#151816] mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="chinedu@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8DFC8] text-xs text-[#151816] focus:outline-none focus:border-[#2D5A43]"
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#151816] mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8DFC8] text-xs text-[#151816] focus:outline-none focus:border-[#2D5A43]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#151816] mb-1">Preferred Time</label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8DFC8] text-xs text-[#151816] focus:outline-none focus:border-[#2D5A43]">
                    <option value="10:00 AM">10:00 AM Morning</option>
                    <option value="12:00 PM">12:00 PM Noon</option>
                    <option value="02:00 PM">02:00 PM Afternoon</option>
                    <option value="04:30 PM">04:30 PM Evening</option>
                  </select>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Lease Term Notice */}
              <div className="p-3 rounded-xl bg-[#F5EFEB] border border-[#E8DFC8] text-xs flex items-center justify-between">
                <span className="text-[#4B524D]">Agreed Lease Term:</span>
                <span className="font-bold text-[#2D5A43]">Direct Annual Lease</span>
              </div>

            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#2D5A43] hover:bg-[#1E3F2F] disabled:bg-[#8F8372] disabled:cursor-not-allowed text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#8AE0B3]" />
                    <span>Transmitting to Database...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Confirm Free Inspection</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}

