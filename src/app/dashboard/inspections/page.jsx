'use client';

import React, { useState, useEffect } from 'react';
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
  ExternalLink,
  MessageCircle,
  CalendarCheck,
  CalendarClock,
  User,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export default function InspectionsPage() {
  const [profile, setProfile] = useState(null);
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Extortion Modal
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [complaintText, setComplaintText] = useState('');
  const [reportSent, setReportSent] = useState(false);

  // Suggest Alternate Time Modal (For Lister)
  const [alternateModalOpen, setAlternateModalOpen] = useState(false);
  const [alternateDate, setAlternateDate] = useState('');
  const [alternateTimeSlot, setAlternateTimeSlot] = useState('11:00 AM');
  const [alternateNotes, setAlternateNotes] = useState('');
  const [processingAction, setProcessingAction] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  const loadData = async () => {
    try {
      const profRes = await fetch('/api/profile');
      const profData = await profRes.json();
      if (profData.profile) {
        setProfile(profData.profile);
      }

      const isListerRole = ['landlord', 'lawyer', 'caretaker'].includes(profData.profile?.role);
      const queryParam = isListerRole ? '?view=lister' : '?view=tenant';

      const inspRes = await fetch(`/api/inspections${queryParam}`);
      const inspData = await inspRes.json();
      if (inspData.inspections) {
        setInspections(inspData.inspections);
      }
    } catch (err) {
      console.error('Error fetching inspections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const isLister = ['landlord', 'lawyer', 'caretaker'].includes(profile?.role);

  // Lister: Confirm Slot
  const handleConfirmSlot = async (item) => {
    setProcessingAction(true);
    setActionSuccessMsg('');
    try {
      const res = await fetch('/api/inspections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inspectionId: item.id,
          action: 'confirm_slot',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionSuccessMsg(data.message || 'Viewing slot confirmed!');
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingAction(false);
    }
  };

  // Lister: Open Alternate Modal
  const handleOpenAlternateModal = (item) => {
    setSelectedInspection(item);
    setAlternateDate(item.scheduledDate || item.scheduled_at || '');
    setAlternateTimeSlot(item.timeSlot || item.time_slot || '11:00 AM');
    setAlternateNotes('');
    setAlternateModalOpen(true);
  };

  // Lister: Submit Alternate Time
  const handleSubmitAlternate = async (e) => {
    e.preventDefault();
    setProcessingAction(true);
    try {
      const res = await fetch('/api/inspections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inspectionId: selectedInspection.id,
          action: 'suggest_alternate',
          alternateDate,
          alternateTimeSlot,
          reportNotes: alternateNotes,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionSuccessMsg(data.message || 'Alternate time proposed!');
        setAlternateModalOpen(false);
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingAction(false);
    }
  };

  // Tenant: Accept Alternate Time
  const handleAcceptAlternate = async (item) => {
    setProcessingAction(true);
    try {
      const res = await fetch('/api/inspections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inspectionId: item.id,
          action: 'accept_alternate',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionSuccessMsg(data.message || 'Alternate time accepted!');
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingAction(false);
    }
  };

  // Tenant: Open Report Extortion
  const handleOpenReport = (item) => {
    setSelectedInspection(item);
    setComplaintText('');
    setReportSent(false);
    setReportModalOpen(true);
  };

  // Tenant: Submit Report
  const handleSubmitReport = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/inspections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'report_extortion',
          inspectionId: selectedInspection.id,
          propertyTitle: selectedInspection.propertyTitle || selectedInspection.property_title,
          listerName: selectedInspection.listerName || selectedInspection.lister_name,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={isLister ? '/dashboard/landlord' : '/dashboard/tenant'}
            className="p-2.5 rounded-xl bg-white border border-[#E8DFC8] text-[#4B524D] hover:bg-[#F5EFEB] hover:text-[#151816] transition-all shrink-0 shadow-xs"
            title="Return to Dashboard">
            <ArrowLeft className="w-4 h-4 text-[#2D5A43]" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#151816]">
              {isLister ? 'Inspection Dispatch Desk' : 'Physical Inspection Viewings'}
            </h1>
            <p className="text-xs sm:text-sm text-[#8F8372] mt-0.5">
              {isLister 
                ? 'Confirm slots or propose alternate viewing times with prospective tenants. Strictly ₦0 fees.'
                : 'Direct physical viewings with verified custodians. Strictly ₦0 viewing fee guarantee.'}
            </p>
          </div>
        </div>

        <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold self-start sm:self-auto ${
          isLister 
            ? 'bg-[#EBF2ED] text-[#2D5A43] border border-[#2D5A43]/20' 
            : 'bg-[#E0F2FE] text-[#0369A1] border border-[#0369A1]/20'
        }`}>
          {isLister ? 'Custodian Inspection Dispatcher' : 'Tenant Inspection Sanctuary'}
        </span>
      </div>

      {actionSuccessMsg && (
        <div className="p-4 rounded-2xl bg-[#EBF2ED] border border-[#2D5A43]/30 text-xs font-bold text-[#2D5A43] flex items-center justify-between">
          <span>✓ {actionSuccessMsg}</span>
          <button onClick={() => setActionSuccessMsg('')} className="text-[#8F8372] hover:text-[#151816]">✕</button>
        </div>
      )}

      {/* Safety Notice */}
      <div className="p-4 rounded-2xl bg-[#EBF2ED] border border-[#2D5A43]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2D5A43] text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#1E3F2F]">100% Free Inspection Guarantee</h4>
            <p className="text-[11px] text-[#2D5A43]">
              {isLister 
                ? 'As a verified RentBridge custodian, you agree never to charge or solicit inspection or registration fees.'
                : 'Never give transport money or viewing fees to anyone. All inspections on RentBridge are strictly ₦0.'}
            </p>
          </div>
        </div>
      </div>

      {/* Inspections List */}
      <div className="space-y-4">
        {inspections.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#E8DFC8] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F5EFEB] text-[#8F8372] flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-[#151816]">No inspections recorded</p>
            <p className="text-xs text-[#8F8372] max-w-sm mx-auto">
              {isLister 
                ? 'Incoming booking requests from tenants will show up here for you to confirm or reschedule.'
                : 'Browse our verified properties across Lagos, Abuja, Port Harcourt, and Enugu to schedule a free inspection.'}
            </p>
          </div>
        ) : (
          inspections.map((item) => {
            const hasAlternateProposed = (item.notes || '').includes('alternate time');
            const isConfirmed = item.status === 'confirmed';
            const isRequested = item.status === 'requested';

            return (
              <div
                key={item.id}
                className="p-5 sm:p-6 bg-white rounded-3xl border border-[#E8DFC8] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-[#2D5A43]/40 transition-all">
                
                {/* Left Side: Property & Booking Info */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      isConfirmed 
                        ? 'bg-[#EBF2ED] text-[#2D5A43]' 
                        : hasAlternateProposed 
                        ? 'bg-[#FEF3C7] text-[#D97706]' 
                        : 'bg-[#F3F4F6] text-[#4B524D]'
                    }`}>
                      {isConfirmed 
                        ? '✓ Confirmed Slot' 
                        : hasAlternateProposed 
                        ? '⚡ Alternate Time Proposed' 
                        : '⏳ Awaiting Confirmation'}
                    </span>
                    <span className="text-xs text-[#8F8372]">ID: {item.id}</span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#151816]">
                      {item.propertyTitle || item.property_title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#4B524D] mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#2D5A43] shrink-0" />
                      <span>{item.propertyNeighborhood || item.neighborhood || 'Direct Hub'}, {item.propertyCity || item.city || 'Nigeria'}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#151816]">
                    <div className="flex items-center gap-1.5 bg-[#F5EFEB] px-3 py-1.5 rounded-xl border border-[#E2D7C8]">
                      <Calendar className="w-3.5 h-3.5 text-[#2D5A43]" />
                      <span>{item.scheduledDate || item.scheduled_at}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#F5EFEB] px-3 py-1.5 rounded-xl border border-[#E2D7C8]">
                      <Clock className="w-3.5 h-3.5 text-[#2D5A43]" />
                      <span>{item.timeSlot || item.time_slot}</span>
                    </div>
                  </div>

                  {/* Notes / Alternate proposal prompt */}
                  {item.notes && (
                    <div className="text-xs p-3 rounded-xl bg-[#F5EFEB] border border-[#E8DFC8] text-[#4B524D]">
                      <p className="font-bold text-[#1E3F2F]">Booking Note:</p>
                      <p className="mt-0.5">{item.notes}</p>
                    </div>
                  )}

                  {/* Tenant: If Landlord proposed alternate time */}
                  {!isLister && hasAlternateProposed && !isConfirmed && (
                    <div className="p-3.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] space-y-2">
                      <p className="text-xs font-bold text-[#92400E]">
                        The custodian has proposed an alternate viewing time. Would you like to lock this in?
                      </p>
                      <button
                        onClick={() => handleAcceptAlternate(item)}
                        disabled={processingAction}
                        className="px-4 py-2 rounded-xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-xs font-bold cursor-pointer transition-all">
                        Accept Alternate Viewing Time
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Side: Role-Specific Action Card */}
                {/* 1. LISTER CONTROLS */}
                {isLister && (
                  <div className="p-4 rounded-2xl bg-[#F5EFEB] border border-[#E2D7C8] space-y-3 lg:w-80 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white ring-2 ring-[#0369A1]/30 overflow-hidden flex items-center justify-center shrink-0">
                        {item.tenantAvatar || item.tenant_avatar ? (
                          <img src={item.tenantAvatar || item.tenant_avatar} alt="Tenant" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-[#0369A1]" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-[10px] uppercase font-bold text-[#8F8372] block">Prospective Tenant</span>
                        <p className="text-xs font-extrabold text-[#151816] truncate">{item.tenantName || item.tenant_name}</p>
                        <p className="text-[11px] text-[#4B524D]">{item.tenantPhone || item.tenant_phone}</p>
                      </div>
                    </div>

                    {isRequested ? (
                      <div className="space-y-2">
                        <button
                          onClick={() => handleConfirmSlot(item)}
                          disabled={processingAction}
                          className="w-full py-2.5 rounded-xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirm Slot</span>
                        </button>

                        <button
                          onClick={() => handleOpenAlternateModal(item)}
                          disabled={processingAction}
                          className="w-full py-2 rounded-xl bg-white hover:bg-[#FBF9F5] border border-[#E8DFC8] text-[#151816] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                          <CalendarClock className="w-3.5 h-3.5 text-[#D97706]" />
                          <span>Suggest Alternate Time</span>
                        </button>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-[#EBF2ED] text-center text-xs font-bold text-[#2D5A43]">
                        ✓ Slot Confirmed
                      </div>
                    )}
                  </div>
                )}

                {/* 2. TENANT CONTROLS */}
                {!isLister && (
                  <div className="p-4 rounded-2xl bg-[#F5EFEB] border border-[#E2D7C8] space-y-3 lg:w-80 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white ring-2 ring-[#2D5A43]/30 overflow-hidden flex items-center justify-center shrink-0">
                        {item.listerAvatar || item.lister_avatar ? (
                          <img src={item.listerAvatar || item.lister_avatar} alt="Custodian" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-[#2D5A43]" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-[10px] uppercase font-bold text-[#8F8372] block">Verified Custodian</span>
                        <p className="text-xs font-extrabold text-[#151816] truncate">{item.listerName || item.lister_name}</p>
                        <p className="text-[11px] text-[#4B524D]">{item.listerPhone || item.lister_phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${item.listerWhatsapp || item.lister_whatsapp}?text=Hello%20${encodeURIComponent(item.listerName || item.lister_name)},%20I%20am%20calling%20regarding%20my%20confirmed%20free%20inspection%20for%20${encodeURIComponent(item.propertyTitle || item.property_title)}%20via%20RentBridge.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 rounded-xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-xs font-bold text-center flex items-center justify-center gap-1 shadow-xs">
                        <MessageCircle className="w-3 h-3" />
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
                )}

              </div>
            );
          })
        )}
      </div>

      {/* Suggest Alternate Time Modal (For Lister) */}
      {alternateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#E2D7C8] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#2D5A43]">
                <CalendarClock className="w-4 h-4" />
                <span>Suggest Alternate Inspection Slot</span>
              </div>
              <button
                type="button"
                onClick={() => setAlternateModalOpen(false)}
                className="text-xs text-[#8F8372] hover:text-[#151816]">
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmitAlternate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#151816] mb-1">
                  Proposed Alternate Date:
                </label>
                <input
                  type="date"
                  required
                  value={alternateDate}
                  onChange={(e) => setAlternateDate(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#FBF9F5] border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#2D5A43]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#151816] mb-1">
                  Proposed Time Slot:
                </label>
                <select
                  value={alternateTimeSlot}
                  onChange={(e) => setAlternateTimeSlot(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#FBF9F5] border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#2D5A43]">
                  <option value="09:00 AM">09:00 AM (Morning)</option>
                  <option value="11:00 AM">11:00 AM (Mid-Day)</option>
                  <option value="02:00 PM">02:00 PM (Afternoon)</option>
                  <option value="04:30 PM">04:30 PM (Late Afternoon)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#151816] mb-1">
                  Reason / Message for Tenant (Optional):
                </label>
                <textarea
                  rows={3}
                  value={alternateNotes}
                  onChange={(e) => setAlternateNotes(e.target.value)}
                  placeholder="e.g. The compound caretaker is only available on Saturday afternoon..."
                  className="w-full p-3 rounded-xl bg-[#FBF9F5] border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#2D5A43]"
                />
              </div>

              <button
                type="submit"
                disabled={processingAction}
                className="w-full py-3 rounded-xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-xs font-bold shadow-md cursor-pointer transition-all">
                Send Alternate Proposal to Tenant
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Extortion Reporting Modal (For Tenant) */}
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
                  Thank you for protecting Nigeria's direct rental community. Our compliance team will audit the custodian immediately. If fee extortion is verified, the listing will be frozen and the phone number blacklisted.
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
                    <span>Report Viewing Fee Solicitation</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="text-xs text-[#8F8372] hover:text-[#151816]">
                    Cancel
                  </button>
                </div>

                <div className="text-xs text-[#4B524D] bg-[#FEF2F2] p-3 rounded-xl border border-[#FCA5A5]">
                  Did <strong>{selectedInspection?.listerName || selectedInspection?.lister_name}</strong> ask you for inspection transport money, "gate pass fees", or agent registration charges?
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
