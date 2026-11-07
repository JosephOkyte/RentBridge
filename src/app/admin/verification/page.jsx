'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Eye, 
  Camera, 
  FileText, 
  Phone, 
  Mail, 
  ExternalLink,
  MapPin,
  Clock,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { formatNaira } from '../../../utils/formatters';

export default function VerificationDeskPage() {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [feedbackNotes, setFeedbackNotes] = useState('');

  useEffect(() => {
    fetch('/api/admin/audit')
      .then((res) => res.json())
      .then((data) => {
        if (data.pendingSubmissions) {
          setSubmissions(data.pendingSubmissions);
          if (data.pendingSubmissions.length > 0) {
            setSelectedSubmission(data.pendingSubmissions[0]);
          }
        }
      })
      .catch(console.error);
  }, []);

  const handleApprove = async () => {
    if (!selectedSubmission) return;
    setActionLoading(true);
    setActionMessage('');

    try {
      const res = await fetch('/api/admin/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve',
          propertyId: selectedSubmission.id,
          propertyTitle: selectedSubmission.title,
          listerEmail: selectedSubmission.listerEmail,
          listerName: selectedSubmission.listerName,
          city: selectedSubmission.city,
        }),
      });
      const data = await res.json();
      setActionMessage(data.message);
      // Remove approved item from pending queue
      setSubmissions((prev) => prev.filter((p) => p.id !== selectedSubmission.id));
      setSelectedSubmission(submissions[1] || null);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestRevision = async (e) => {
    e.preventDefault();
    if (!selectedSubmission) return;
    setActionLoading(true);

    try {
      const res = await fetch('/api/admin/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request_revision',
          propertyId: selectedSubmission.id,
          propertyTitle: selectedSubmission.title,
          listerEmail: selectedSubmission.listerEmail,
          listerName: selectedSubmission.listerName,
          feedbackNotes,
        }),
      });
      const data = await res.json();
      setActionMessage(data.message);
      setRevisionModalOpen(false);
      setSubmissions((prev) => prev.filter((p) => p.id !== selectedSubmission.id));
      setSelectedSubmission(submissions[1] || null);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title & Phase 1 Protocol */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF2ED] text-[#2D5A43] text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Phase 1 Manual Gatekeeper Protocol</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#151816]">
            Split-Screen Verification Desk
          </h1>
          <p className="text-xs sm:text-sm text-[#8F8372]">
            Zero automatic publishing: Every listing must be human-audited for street road visibility and deed authenticity before appearing publicly.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-[#8F8372] block">Pending Reviews:</span>
          <span className="text-2xl font-black text-[#2D5A43]">{submissions.length} Listings</span>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-[#EBF2ED] border border-[#2D5A43] text-xs font-bold text-[#1E3F2F] flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#2D5A43] shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {selectedSubmission ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (7 cols): Property Specs & Transparency Photos */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8DFC8] p-6 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F8372]">
                  Submitted Property #{selectedSubmission.id}
                </span>
                <h3 className="text-xl font-black text-[#151816] mt-0.5">
                  {selectedSubmission.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-[#4B524D] mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#2D5A43]" />
                  <span>{selectedSubmission.address}</span>
                </div>
              </div>

              <span className="px-3 py-1 rounded-xl bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] text-xs font-extrabold">
                Pending Audit
              </span>
            </div>

            {/* Price & Annual Terms */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F5EFEB] border border-[#E2D7C8] text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8F8372] block">Annual Rent</span>
                <span className="text-sm sm:text-base font-black text-[#2D5A43]">
                  {formatNaira(selectedSubmission.annualRent)}
                </span>
              </div>
              <div className="border-x border-[#E2D7C8]">
                <span className="text-[10px] uppercase font-bold text-[#8F8372] block">Caution Deposit</span>
                <span className="text-xs sm:text-sm font-bold text-[#151816]">
                  {formatNaira(selectedSubmission.cautionDeposit)}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8F8372] block">Agency Fee</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#2D5A43]">₦0 (Zero)</span>
              </div>
            </div>

            {/* Mandatory Street & Entrance Transparency Photos */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#151816] flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#2D5A43]" />
                  <span>Street & Entrance Transparency Check ({selectedSubmission.photoCount} Photos Attached)</span>
                </h4>
                <span className="text-[11px] font-bold text-[#2D5A43]">
                  ✓ Quota Met (Min {selectedSubmission.minRequiredPhotos})
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {selectedSubmission.photos.map((photo, idx) => (
                  <div key={idx} className="rounded-2xl border border-[#E8DFC8] overflow-hidden bg-[#FBF9F5]">
                    <img src={photo.url} alt={photo.tag} className="w-full h-28 object-cover" />
                    <div className="p-2 bg-white text-[10px] font-bold text-[#151816] truncate">
                      {photo.tag}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Legal Document Audit & Custodian Verification */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E8DFC8] p-6 space-y-6 shadow-xs">
            <h3 className="text-base font-black text-[#151816] border-b border-[#E8DFC8] pb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#2D5A43]" />
              <span>Title & Custodian Audit Vault</span>
            </h3>

            {/* Lister Identity Card */}
            <div className="p-4 rounded-2xl bg-[#F5EFEB] border border-[#E2D7C8] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#8F8372]">Custody Relationship</span>
                <span className="text-xs font-extrabold text-[#2D5A43] capitalize bg-[#EBF2ED] px-2 py-0.5 rounded">
                  {selectedSubmission.listerRole}
                </span>
              </div>
              <p className="text-sm font-black text-[#151816]">{selectedSubmission.listerName}</p>
              
              <div className="space-y-1 text-xs text-[#4B524D] pt-1">
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#2D5A43]" />
                  <a href={`tel:${selectedSubmission.listerPhone}`} className="hover:underline font-semibold">
                    {selectedSubmission.listerPhone}
                  </a>
                  <span className="text-[10px] text-[#8F8372]">(Call for 1-min confirmation)</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#2D5A43]" />
                  <span>{selectedSubmission.listerEmail}</span>
                </p>
              </div>
            </div>

            {/* Submitted Legal Documents */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8F8372] block">
                Submitted Ownership Proof
              </span>
              <div className="p-4 rounded-2xl bg-[#EBF2ED]/60 border border-[#2D5A43]/20 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#2D5A43] shrink-0" />
                  <div>
                    <p className="text-xs font-extrabold text-[#151816]">{selectedSubmission.idDocumentType}</p>
                    <p className="text-[11px] font-mono text-[#2D5A43]">{selectedSubmission.idNumber}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={selectedSubmission.deedDocumentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D5A43] hover:underline">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Inspect Full Scanned Deed Document (PDF)</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Gatekeeper Decision Action Bar */}
            <div className="pt-4 border-t border-[#E8DFC8] space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8F8372] block">
                Verification Action
              </span>

              <button
                type="button"
                disabled={actionLoading}
                onClick={handleApprove}
                className="w-full py-3.5 rounded-xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>100% Verify & Publish Live to Map</span>
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setRevisionModalOpen(true)}
                className="w-full py-3 rounded-xl bg-white hover:bg-[#FEF2F2] border border-[#FCA5A5] text-[#B91C1C] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4" />
                <span>Request Revisions (e.g. Clearer Street Photos)</span>
              </button>
            </div>
          </div>

        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E8DFC8] space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#EBF2ED] text-[#2D5A43] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-[#151816]">Verification Queue Cleared</h3>
          <p className="text-xs text-[#8F8372]">All submitted properties across Lagos, Abuja, Port Harcourt, and Enugu have been audited.</p>
        </div>
      )}

      {/* Revision Feedback Modal */}
      {revisionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#E2D7C8] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#151816]">Request Listing Revisions</h3>
              <button onClick={() => setRevisionModalOpen(false)} className="text-xs text-[#8F8372]">Cancel</button>
            </div>

            <p className="text-xs text-[#4B524D]">
              This feedback will be sent directly to <strong>{selectedSubmission?.listerEmail}</strong> and the listing will be held in draft until corrected.
            </p>

            <form onSubmit={handleRequestRevision} className="space-y-4">
              <textarea
                required
                rows={4}
                value={feedbackNotes}
                onChange={(e) => setFeedbackNotes(e.target.value)}
                placeholder="e.g. Please upload a clearer shot of the street access road and compound gate..."
                className="w-full p-3 rounded-xl bg-[#FBF9F5] border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#2D5A43]"
              />

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-3 rounded-xl bg-[#2D5A43] text-white text-xs font-bold shadow-md cursor-pointer">
                Send Revisions Request via Resend
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

