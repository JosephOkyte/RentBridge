'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Phone, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Send,
  ExternalLink
} from 'lucide-react';

export default function InspectionsPage() {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [complaintText, setComplaintText] = useState('');
  const [reportSent, setReportSent] = useState(false);

  const inspections = [
    {
      id: 'insp-1',
      propertyId: 'prop-1',
      propertyTitle: 'Luxury 4-Bedroom Semi-Detached Duplex',
      city: 'Lagos',
      neighborhood: 'Lekki Phase 1, Admiralty Way Axis',
      scheduledDate: 'Tuesday, 10 Nov 2026',
      timeSlot: '11:00 AM',
      status: 'confirmed',
      listerName: 'Engr. Dapo Alabi (Owner)',
      listerPhone: '+234 803 445 1928',
      listerWhatsapp: '2348034451928',
      roleBadge: 'Verified Landlord',
    },
  ];

  const handleOpenReport = (inspection) => {
    setSelectedInspection(inspection);
    setComplaintText('');
    setReportSent(false);
    setReportModalOpen(true);
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/inspections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'report_extortion',
          inspectionId: selectedInspection.id,
          propertyTitle: selectedInspection.propertyTitle,
          listerName: selectedInspection.listerName,
          reportNotes: complaintText,
        }),
      });
      setReportSent(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#151816]">
          Physical Inspection Viewings
        </h1>
        <p className="text-xs sm:text-sm text-[#8F8372] mt-0.5">
          Strictly ₦0 Viewing Fees Guaranteed • Direct key-holder inspections only.
        </p>
      </div>

      {/* Safety Guarantee Notice */}
      <div className="p-4 rounded-2xl bg-[#EBF2ED] border border-[#2D5A43]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2D5A43] text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#1E3F2F]">Zero Inspection Fee Guarantee</h4>
            <p className="text-[11px] text-[#2D5A43]">
              Never give transport money or viewing fees to anyone. All inspections on RentBridge are 100% free.
            </p>
          </div>
        </div>
      </div>

      {/* Inspections Feed */}
      <div className="space-y-4">
        {inspections.map((item) => (
          <div
            key={item.id}
            className="p-5 sm:p-6 bg-white rounded-3xl border border-[#E8DFC8] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Left: Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#EBF2ED] text-[#2D5A43] text-[11px] font-bold">
                  {item.status.toUpperCase()}
                </span>
                <span className="text-xs text-[#8F8372]">Booking ID: {item.id}</span>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-black text-[#151816]">
                  {item.propertyTitle}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-[#4B524D] mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#2D5A43] shrink-0" />
                  <span>{item.neighborhood}, {item.city}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#151816]">
                <div className="flex items-center gap-1.5 bg-[#F5EFEB] px-3 py-1.5 rounded-xl border border-[#E2D7C8]">
                  <Calendar className="w-3.5 h-3.5 text-[#2D5A43]" />
                  <span>{item.scheduledDate}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#F5EFEB] px-3 py-1.5 rounded-xl border border-[#E2D7C8]">
                  <Clock className="w-3.5 h-3.5 text-[#2D5A43]" />
                  <span>{item.timeSlot}</span>
                </div>
              </div>
            </div>

            {/* Right: Direct Lister Contact & Fraud Action */}
            <div className="p-4 rounded-2xl bg-[#F5EFEB] border border-[#E2D7C8] space-y-3 lg:w-80 shrink-0">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8F8372] block">Verified Custodian Contact</span>
                <p className="text-xs font-extrabold text-[#151816] mt-0.5">{item.listerName}</p>
                <p className="text-[11px] text-[#4B524D]">{item.listerPhone}</p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${item.listerWhatsapp}?text=Hello%20${encodeURIComponent(item.listerName)},%20I%20am%20calling%20regarding%20my%20confirmed%20free%20inspection%20for%20${encodeURIComponent(item.propertyTitle)}%20via%20RentBridge.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-xs font-bold text-center flex items-center justify-center gap-1 shadow-xs">
                  <Phone className="w-3 h-3" />
                  <span>Direct WhatsApp</span>
                </a>

                <button
                  onClick={() => handleOpenReport(item)}
                  className="py-2 px-3 rounded-xl bg-white hover:bg-[#FEF2F2] border border-[#FCA5A5] text-[#B91C1C] text-xs font-bold flex items-center gap-1 cursor-pointer">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Report</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Extortion Reporting Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#E2D7C8] space-y-4">
            {reportSent ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#FEF2F2] text-[#B91C1C] flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black text-[#151816]">Report Escalated to Compliance</h4>
                <p className="text-xs text-[#4B524D] leading-relaxed">
                  Thank you for protecting the Nigerian rental community. Our compliance team will audit the custodian communications immediately. If fee extortion is verified, the listing will be frozen and the phone number blacklisted.
                </p>
                <button
                  onClick={() => setReportModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-[#2D5A43] text-white text-xs font-bold">
                  Close & Return
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#B91C1C]">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Report Fee Solicitation</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="text-xs text-[#8F8372] hover:text-[#151816]">
                    Cancel
                  </button>
                </div>

                <div className="text-xs text-[#4B524D] bg-[#FEF2F2] p-3 rounded-xl border border-[#FCA5A5]">
                  Did <strong>{selectedInspection?.listerName}</strong> ask you for inspection transport money, "gate pass fees", or agent registration charges?
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#151816] mb-1">
                    Describe what happened (e.g. amount demanded, WhatsApp message):
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={complaintText}
                    onChange={(e) => setComplaintText(e.target.value)}
                    placeholder="e.g. He told me to transfer ₦5,000 for transport before he can bring the keys..."
                    className="w-full p-3 rounded-xl bg-[#FBF9F5] border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#2D5A43]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-bold shadow-md cursor-pointer">
                  Submit Immediate Anti-Fraud Report
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

