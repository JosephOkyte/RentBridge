'use client';

import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  KeyRound, 
  Loader2, 
  AlertTriangle,
  Lock,
  ExternalLink
} from 'lucide-react';
import { formatNaira } from '../utils/formatters';
import { validateRequired, validatePositiveAmount } from '../utils/validation';

export default function ProposePropertyModal({ 
  isOpen, 
  onClose, 
  request, 
  myProperties = [], 
  onSuccess 
}) {
  const [selectedPropertyId, setSelectedPropertyId] = useState(
    myProperties.length > 0 ? myProperties[0].id : 'custom'
  );
  const [customTitle, setCustomTitle] = useState('');
  const [customPrice, setCustomPrice] = useState(request?.maxBudget || '4500000');
  const [message, setMessage] = useState('');
  const [offerGatePass, setOfferGatePass] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedProposal, setSubmittedProposal] = useState(null);

  if (!isOpen || !request) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Double-Submission Lock Guard
    if (loading) return;
    setErrorMessage('');

    let propTitle = '';
    let propPrice = 0;
    let propCity = request.city;

    // 2. Client-Side Input Validation (Before Network Request)
    if (selectedPropertyId === 'custom' || myProperties.length === 0) {
      const titleCheck = validateRequired(customTitle, 'Property title or unit description', 3);
      if (!titleCheck.valid) {
        setErrorMessage(titleCheck.error);
        return;
      }
      const priceCheck = validatePositiveAmount(customPrice, 'Annual Rent Price', 50000);
      if (!priceCheck.valid) {
        setErrorMessage(priceCheck.error);
        return;
      }
      propTitle = customTitle.trim();
      propPrice = Number(customPrice);
    } else {
      const match = myProperties.find(p => p.id === selectedPropertyId);
      if (match) {
        propTitle = match.title;
        propPrice = match.priceYearly || 0;
        propCity = match.city || request.city;
      }
    }

    // 3. Double-Submission Lock State Activation
    setLoading(true);

    // 4. Try/Catch Error Resilience
    try {
      const payload = {
        requestId: request.id,
        ticketId: request.ticketId,
        propertyId: selectedPropertyId,
        propertyTitle: propTitle,
        propertyCity: propCity,
        propertyPrice: propPrice,
        message: message.trim() || `I have a verified ${request.propertyTypeLabel || 'property'} ready for inspection.`,
        inspectionPassOffered: offerGatePass,
      };

      const res = await fetch('/api/requests/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit property proposal to RentBridge database.');
      }

      // 5. Success Confirmation Flow
      setSubmittedProposal(data.proposal);
      if (onSuccess) onSuccess(data.proposal);
    } catch (err) {
      console.error('[RentBridge Proposal Submit Error]:', err);
      setErrorMessage(err.message || 'Something went wrong submitting your proposal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#151816]/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E8DFC8] overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#1E3F2F] text-white flex items-center justify-between border-b border-[#2D5A43]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#8AE0B3] border border-white/10">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight text-white">
                Propose Verified Property
              </h3>
              <p className="text-xs text-[#E2D7C8]">
                To Seeker: <strong className="text-white">{request.seekerName}</strong> ({request.ticketId})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#E2D7C8] hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {submittedProposal ? (
            /* Confirmation View */
            <div className="space-y-5 py-4 text-center animate-fadeIn">
              <div className="w-14 h-14 rounded-2xl bg-[#EBF2ED] text-[#2D5A43] flex items-center justify-center mx-auto border border-[#8AE0B3]/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-black text-[#151816]">Proposal Transmitted!</h4>
                <p className="text-xs text-[#4B524D] mt-1 max-w-xs mx-auto">
                  {request.seekerName} has been notified. When they confirm, an inspection appointment will be booked directly to your dashboard.
                </p>
              </div>

              {submittedProposal.gatePassCode && (
                <div className="p-4 rounded-2xl bg-[#F5EFEB] border border-[#E8DFC8] max-w-xs mx-auto text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F8372] block">
                    Pre-Approved Gate Pass Code:
                  </span>
                  <div className="font-mono text-base font-black text-[#2D5A43] mt-0.5">
                    {submittedProposal.gatePassCode}
                  </div>
                  <p className="text-[11px] text-[#4B524D] mt-1">
                    ₦0 viewing fee guarantee attached. The tenant can present this pass at your compound gate.
                  </p>
                </div>
              )}

              <button
                onClick={() => {
                  setSubmittedProposal(null);
                  onClose();
                }}
                className="w-full py-3 rounded-xl bg-[#2D5A43] text-white font-bold text-xs hover:bg-[#1E3F2F] transition-all cursor-pointer">
                Close & Return to Matchboard
              </button>
            </div>
          ) : (
            /* Submission Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Seeker Requirement Summary */}
              <div className="p-3.5 rounded-2xl bg-[#F5EFEB] border border-[#E8DFC8] space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#8F8372]">Demand:</span>
                  <strong className="text-[#151816] font-bold">{request.propertyTypeLabel}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8F8372]">Budget:</span>
                  <strong className="text-[#2D5A43] font-bold">
                    {formatNaira(request.minBudget)} - {formatNaira(request.maxBudget)}/yr
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8F8372]">Locations:</span>
                  <span className="text-[#151816] font-medium">
                    {request.preferredLocations?.join(', ')}
                  </span>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Property Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#151816] mb-1">
                  Select Your Verified Property to Propose *
                </label>
                {myProperties.length > 0 ? (
                  <select
                    value={selectedPropertyId}
                    onChange={(e) => setSelectedPropertyId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#D7CBBB] bg-[#FBF9F5] text-xs font-medium text-[#151816] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]">
                    {myProperties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({formatNaira(p.priceYearly)}/yr)
                      </option>
                    ))}
                    <option value="custom">+ Propose unlisted upcoming vacancy...</option>
                  </select>
                ) : (
                  <div className="text-xs text-[#8F8372] p-2 bg-[#F5EFEB] rounded-xl border border-[#E8DFC8]">
                    No listed properties in active queue. You can propose an upcoming vacancy directly below:
                  </div>
                )}
              </div>

              {(selectedPropertyId === 'custom' || myProperties.length === 0) && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#151816] mb-1">
                      Property Title / Unit Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2-Bedroom Serviced Flat, Lekki Phase 1"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#D7CBBB] bg-[#FBF9F5] focus:ring-1 focus:ring-[#2D5A43]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#151816] mb-1">
                      Annual Rent Price (₦) *
                    </label>
                    <input
                      type="number"
                      step="100000"
                      required
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#D7CBBB] bg-[#FBF9F5] focus:ring-1 focus:ring-[#2D5A43]"
                    />
                  </div>
                </div>
              )}

              {/* Message to Seeker */}
              <div>
                <label className="block text-xs font-semibold text-[#151816] mb-1">
                  Personal Message to Seeker:
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Hello, I have a flood-free, serviced unit with dedicated prepaid meter ready for inspection this weekend."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D7CBBB] bg-[#FBF9F5] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
                />
              </div>

              {/* Offer Instant Gate Pass */}
              <div className="p-3 rounded-xl bg-[#EBF2ED] border border-[#8AE0B3]/40">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={offerGatePass}
                    onChange={(e) => setOfferGatePass(e.target.checked)}
                    className="mt-0.5 rounded border-[#D7CBBB] text-[#2D5A43] focus:ring-[#2D5A43]"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-[#1E3F2F] flex items-center gap-1">
                      <KeyRound className="w-3.5 h-3.5 text-[#2D5A43]" />
                      Attach Pre-Approved ₦0 Compound Gate Pass
                    </span>
                    <p className="text-[11px] text-[#4B524D] mt-0.5">
                      Generates a verified gate pass code allowing the tenant to view the compound immediately without roadside agent friction.
                    </p>
                  </div>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white font-extrabold text-xs tracking-tight shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-60">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#8AE0B3]" />
                      <span>Transmitting Proposal to Database...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Verified Proposal (₦0 Commission)</span>
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

