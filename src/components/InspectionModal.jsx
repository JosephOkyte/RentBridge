import React, { useState } from 'react';
import { X, Calendar, Clock, ShieldCheck, CheckCircle2, User, Phone, AlertCircle, Send } from 'lucide-react';
import { formatNaira } from '../utils/formatters';

export default function InspectionModal({ property, onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    preferredDate: '',
    preferredTime: '10:00 AM',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  if (!property) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
            <h3 className="text-lg font-bold text-[#151816] mt-0.5">Schedule a Direct Viewing</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F5EFEB] text-[#151816]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#EBF2ED] text-[#2D5A43] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-extrabold text-[#151816]">Inspection Booked Successfully!</h4>
            <p className="text-xs sm:text-sm text-[#4B524D] leading-relaxed">
              Your free viewing request for <strong className="text-[#151816]">{property.title}</strong> has been transmitted directly to <strong className="text-[#151816]">{property.lister.name}</strong> ({property.lister.roleBadge}).
            </p>

            <div className="p-4 rounded-xl bg-[#F5EFEB] border border-[#E2D7C8] text-xs text-left space-y-1.5">
              <p className="font-bold text-[#151816]">Next Step:</p>
              <p className="text-[#4B524D]">
                The verified lister will call you on <strong>{formData.phone}</strong> to confirm gate pass and estate entry for <strong>{formData.preferredDate || 'your selected date'}</strong>.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-[#2D5A43] text-white text-xs font-bold">
                Done & Return to Vacancies
              </button>
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
                className="w-full py-3 rounded-xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md">
                <Send className="w-4 h-4" />
                <span>Confirm Free Inspection</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}

