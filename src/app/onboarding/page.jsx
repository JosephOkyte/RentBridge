'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import {
  Building2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  User,
  Mail,
  Phone,
  FileText,
  Send,
  ExternalLink
} from 'lucide-react';
import { validateRequired, validateEmail, validateNigerianPhone } from '../../utils/validation';

const ROLE_TO_CATEGORY = {
  landlord: 'Landlord',
  caretaker: 'Caretaker',
  lawyer: 'Lawyer',
  tenant: 'Tenant',
};

const CATEGORIES = [
  { value: 'Tenant', label: 'Tenant (Looking for Verified Space)' },
  { value: 'Landlord', label: 'Landlord (Property Owner / Title Holder)' },
  { value: 'Caretaker', label: 'Resident Caretaker (Authorized Custodian)' },
  { value: 'Lawyer', label: 'Legal Counsel / Estate Solicitor' },
];

const EXTERNAL_N8N_FORM_URL =
  process.env.NEXT_PUBLIC_N8N_ONBOARDING_FORM_URL ||
  'https://prime-tech-hub.duckdns.org/form/b40e282e-fe38-483a-84b0-6e120508da81';

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();

  const queryRole = (searchParams?.get('role') || '').toLowerCase();
  const formCardRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    category: ROLE_TO_CATEGORY[queryRole] || 'Tenant',
    note: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRole, setSubmittedRole] = useState(queryRole || 'tenant');

  // Pre-fill from Clerk user & query params
  useEffect(() => {
    if (isLoaded && user) {
      setFormData((prev) => ({
        ...prev,
        firstName: prev.firstName || user.firstName || '',
        lastName: prev.lastName || user.lastName || '',
        email: prev.email || user.primaryEmailAddress?.emailAddress || '',
        phone: prev.phone || user.primaryPhoneNumber?.phoneNumber || '',
        category: ROLE_TO_CATEGORY[queryRole] || prev.category || 'Tenant',
      }));
    } else if (queryRole && ROLE_TO_CATEGORY[queryRole]) {
      setFormData((prev) => ({
        ...prev,
        category: ROLE_TO_CATEGORY[queryRole],
      }));
    }
  }, [isLoaded, user, queryRole]);

  // Check persistent storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('rentbridge_form_submitted');
      if (stored === 'true') {
        setIsSubmitted(true);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Double-Submission Lock Guard
    if (submitting) return;
    setErrorMessage('');

    // 2. Client-Side Validation
    const firstCheck = validateRequired(formData.firstName, 'First Name', 2);
    if (!firstCheck.valid) {
      setErrorMessage(firstCheck.error);
      return;
    }

    const lastCheck = validateRequired(formData.lastName, 'Last Name', 2);
    if (!lastCheck.valid) {
      setErrorMessage(lastCheck.error);
      return;
    }

    const emailCheck = validateEmail(formData.email);
    if (!emailCheck.valid) {
      setErrorMessage(emailCheck.error);
      return;
    }

    const phoneCheck = validateNigerianPhone(formData.phone);
    if (!phoneCheck.valid) {
      setErrorMessage(phoneCheck.error);
      return;
    }

    if (!formData.category) {
      setErrorMessage('Please select your account category.');
      return;
    }

    // 3. Activate Lock
    setSubmitting(true);

    // 4. Try/Catch Error Resilience
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: phoneCheck.normalized,
          category: formData.category,
          note: formData.note.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit onboarding registration.');
      }

      // 5. Success Confirmation Flow
      setIsSubmitted(true);
      setSubmittedRole(data.role || queryRole || formData.category.toLowerCase());
      if (typeof window !== 'undefined') {
        localStorage.setItem('rentbridge_form_submitted', 'true');
      }
    } catch (err) {
      console.error('[RentBridge Onboarding Submit Error]:', err);
      setErrorMessage(
        err.message || 'A network error occurred while saving your onboarding details. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleProceedClick = () => {
    const targetRole = submittedRole || queryRole || formData.category.toLowerCase();
    if (targetRole === 'tenant') {
      router.push('/dashboard/tenant');
    } else if (['landlord', 'caretaker', 'lawyer'].includes(targetRole)) {
      router.push('/dashboard/landlord');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#151816] flex flex-col justify-between">
      {/* Top Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-[#E8DFC8] sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#2D5A43] flex items-center justify-center text-white shadow-md shadow-[#2D5A43]/20">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 13V11C3 7.68629 5.68629 5 9 5H15C18.3137 5 21 7.68629 21 11V13M3 13H21M3 13V19M21 13V19M8 13V19M16 13V19" />
              </svg>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black tracking-tight text-[#151816]">
                Rent<span className="text-[#2D5A43]">Bridge</span>
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#EBF2ED] text-[#2D5A43] border border-[#2D5A43]/20 ml-1.5">
                Onboarding
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1.5 text-xs font-bold text-[#2D5A43] bg-[#EBF2ED] px-3 py-1 rounded-full border border-[#8AE0B3]/40">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A43]" />
            <span>Step 2 of 3</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex-1 space-y-5">
        {/* Compact Onboarding Stepper */}
        <div className="bg-white rounded-2xl border border-[#E8DFC8] px-4 py-3 shadow-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#EBF2ED] text-[#2D5A43] font-bold text-[10px] flex items-center justify-center border border-[#8AE0B3]">
                ✓
              </div>
              <span className="text-xs font-bold text-[#151816]">Account Verified</span>
            </div>

            <div className="flex-1 h-0.5 bg-[#E8DFC8] mx-2"></div>

            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-full font-bold text-[10px] flex items-center justify-center shadow-xs ${isSubmitted ? 'bg-[#EBF2ED] text-[#2D5A43] border border-[#8AE0B3]' : 'bg-[#2D5A43] text-white'
                }`}>
                {isSubmitted ? '✓' : '2'}
              </div>
              <span className="text-xs font-extrabold text-[#2D5A43]">Housing Profile & Intake</span>
            </div>

            <div className="flex-1 h-0.5 bg-[#E8DFC8] mx-2"></div>

            <div className={`flex items-center gap-2 transition-opacity ${isSubmitted ? 'opacity-100' : 'opacity-50'}`}>
              <div className={`w-5 h-5 rounded-full font-bold text-[10px] flex items-center justify-center border ${isSubmitted
                  ? 'bg-[#EBF2ED] text-[#2D5A43] border-[#8AE0B3]'
                  : 'bg-[#F5EFEB] text-[#8F8372] border-[#D7CBBB]'
                }`}>
                {isSubmitted ? '✓' : '3'}
              </div>
              <span className="text-xs font-semibold text-[#8F8372] hidden xs:inline">Dashboard & Free Passes</span>
            </div>
          </div>
        </div>

        {/* Welcome Header Banner */}
        <div className="px-5 py-3.5 rounded-2xl bg-[#1E3F2F] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8AE0B3] shrink-0" />
            <p className="text-xs sm:text-sm font-bold text-white">
              Welcome, {user?.firstName || formData.firstName || 'Chief'}! Complete your intake below to unlock pre-approved ₦0 viewing passes.
            </p>
          </div>
          <span className="text-[10px] text-[#8AE0B3] font-semibold uppercase tracking-wider shrink-0 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
            Lagos • Abuja • PH • Enugu
          </span>
        </div>

        {/* Native Hardened Onboarding Form Card */}
        <div ref={formCardRef} className="bg-white rounded-3xl border border-[#E8DFC8] shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-[#F5EFEB] border-b border-[#E8DFC8] flex items-center justify-between text-xs text-[#4B524D]">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#2D5A43]" />
              <span className="font-bold text-[#1E3F2F] tracking-tight text-sm">RentBridge Onboarding Registration</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#2D5A43]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Synced to Verified Database</span>
            </div>
          </div>

          {isSubmitted ? (
            <div className="p-8 sm:p-10 text-center space-y-5 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#EBF2ED] text-[#2D5A43] flex items-center justify-center mx-auto border border-[#8AE0B3]/50">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-2xl font-black text-[#151816]">Onboarding Registration Complete!</h2>
                <p className="text-xs sm:text-sm text-[#4B524D] max-w-md mx-auto leading-relaxed">
                  Your profile has been verified and synced to our direct custodian network. You are ready to access your dashboard with <strong>₦0 viewing fees</strong>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleProceedClick}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white font-extrabold text-sm shadow-lg shadow-[#2D5A43]/20 flex items-center justify-center gap-2 cursor-pointer transition-all">
                  <span>Proceed to Your Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-[#F5EFEB] hover:bg-[#EAE2D8] text-[#1E3F2F] font-bold text-xs border border-[#D7CBBB] cursor-pointer transition-all">
                  Edit Registration Info
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2.5 animate-shake">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#151816] mb-1.5">
                    First Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#8F8372] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chinedu"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D7CBBB] bg-[#FBF9F5] text-xs sm:text-sm font-medium text-[#151816] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#151816] mb-1.5">
                    Last Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#8F8372] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Okafor"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D7CBBB] bg-[#FBF9F5] text-xs sm:text-sm font-medium text-[#151816] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#151816] mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8F8372] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D7CBBB] bg-[#FBF9F5] text-xs sm:text-sm font-medium text-[#151816] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#151816] mb-1.5">
                    Nigerian Phone Number (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#8F8372] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0803 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D7CBBB] bg-[#FBF9F5] text-xs sm:text-sm font-medium text-[#151816] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#151816] mb-1.5">
                  Account Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#D7CBBB] bg-[#FBF9F5] text-xs sm:text-sm font-bold text-[#151816] focus:outline-none focus:ring-2 focus:ring-[#2D5A43] cursor-pointer">
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#151816] mb-1.5">
                  Note (Optional)
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-[#8F8372] absolute left-3.5 top-3.5" />
                  <textarea
                    rows={3}
                    placeholder="e.g. Looking for a flood-free 2-bedroom apartment in Lekki Phase 1 with prepaid meter..."
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D7CBBB] bg-[#FBF9F5] text-xs sm:text-sm text-[#151816] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#2D5A43] hover:bg-[#1E3F2F] disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-sm tracking-tight shadow-lg shadow-[#2D5A43]/20 flex items-center justify-center gap-2 cursor-pointer transition-all">
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#8AE0B3]" />
                      <span>Transmitting to Database...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration & Unlock Dashboard</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#8F8372] pt-1">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A43] shrink-0" />
                    <span>Submitted info is strictly used for direct custodian matching. 0% roadside agents.</span>
                  </div>
                  <a
                    href={EXTERNAL_N8N_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#2D5A43] font-semibold hover:underline shrink-0">
                    <span>Direct n8n Form</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-[#E8DFC8] text-center text-xs text-[#8F8372]">
        <p>© {new Date().getFullYear()} RentBridge Nigeria Ltd. ₦0 Viewing Fees • Verified Custodians Only.</p>
      </footer>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FBF9F5] flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#2D5A43]" />
          <p className="text-xs font-bold text-[#8F8372]">Loading onboarding portal...</p>
        </div>
      }>
      <OnboardingContent />
    </Suspense>
  );
}
