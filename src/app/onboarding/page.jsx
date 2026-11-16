'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  ExternalLink, 
  Sparkles, 
  Loader2,
  AlertTriangle,
  CheckCircle2,
  ArrowUp
} from 'lucide-react';

const ONBOARDING_FORM_URL = process.env.NEXT_PUBLIC_N8N_ONBOARDING_FORM_URL || 'https://prime-tech-hub.duckdns.org/form/b40e282e-fe38-483a-84b0-6e120508da81';

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();

  const queryRole = searchParams?.get('role') || '';
  const [iframeLoading, setIframeLoading] = useState(true);
  const [targetFormUrl, setTargetFormUrl] = useState(ONBOARDING_FORM_URL);
  
  // Submission verification states
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showUnsubmittedWarning, setShowUnsubmittedWarning] = useState(false);
  const loadCountRef = useRef(0);
  const formCardRef = useRef(null);

  // Check persistent storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('rentbridge_form_submitted');
      if (stored === 'true') {
        setIsSubmitted(true);
      }
    }
  }, []);

  // Pre-fill user data into the form URL
  useEffect(() => {
    try {
      const url = new URL(ONBOARDING_FORM_URL);
      if (isLoaded && user) {
        url.searchParams.set('userId', user.id || '');
        url.searchParams.set('email', user.primaryEmailAddress?.emailAddress || '');
        url.searchParams.set('name', user.fullName || user.firstName || '');
      }
      if (queryRole) {
        url.searchParams.set('role', queryRole);
      }
      setTargetFormUrl(url.toString());
    } catch (e) {
      setTargetFormUrl(ONBOARDING_FORM_URL);
    }
    setIframeLoading(true);
  }, [isLoaded, user, queryRole]);

  // Listen for n8n iframe postMessages indicating submission or navigation
  useEffect(() => {
    const handleMessage = (event) => {
      try {
        const data = event.data;
        // n8n sends postMessages like { type: 'n8n-form-navigate' | 'n8n-form-redirect', url: ... }
        if (data && (data.type === 'n8n-form-redirect' || data.type === 'n8n-form-navigate' || data.formSubmitted)) {
          setIsSubmitted(true);
          setShowUnsubmittedWarning(false);
          if (typeof window !== 'undefined') {
            localStorage.setItem('rentbridge_form_submitted', 'true');
          }
        }
      } catch (err) {
        // Ignore cross-origin errors
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Handle iframe load events: 1st load is form display; 2nd load is submission completion
  const handleIframeLoad = () => {
    setIframeLoading(false);
    loadCountRef.current += 1;
    if (loadCountRef.current > 1) {
      setIsSubmitted(true);
      setShowUnsubmittedWarning(false);
      if (typeof window !== 'undefined') {
        localStorage.setItem('rentbridge_form_submitted', 'true');
      }
    }
  };

  const handleProceedClick = () => {
    if (!isSubmitted) {
      setShowUnsubmittedWarning(true);
      // Smoothly scroll up to the form to direct the user's attention
      formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // If submitted, proceed directly to role-specific dashboard
    if (queryRole === 'tenant') {
      router.push('/dashboard/tenant');
    } else if (['landlord', 'caretaker', 'lawyer'].includes(queryRole)) {
      router.push('/dashboard/landlord');
    } else {
      router.push('/dashboard');
    }
  };

  const handleManualSubmissionToggle = (checked) => {
    setIsSubmitted(checked);
    if (checked) {
      setShowUnsubmittedWarning(false);
      if (typeof window !== 'undefined') {
        localStorage.setItem('rentbridge_form_submitted', 'true');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#151816] flex flex-col justify-between">
      
      {/* Top Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-[#E8DFC8] sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#2D5A43] flex items-center justify-center text-white shadow-md shadow-[#2D5A43]/20">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 13V11C3 7.68629 5.68629 5 9 5H15C18.3137 5 21 7.68629 21 11V13M3 13H21M3 13V19M21 13V19M8 13V19M16 13V19" />
              </svg>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#151816]">
                Rent<span className="text-[#2D5A43]">Bridge</span>
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#EBF2ED] text-[#2D5A43] border border-[#2D5A43]/20 ml-1.5">
                Onboarding
              </span>
            </div>
          </Link>

          {/* Mandatory Step Indicator */}
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8F8372]">
            <ShieldCheck className="w-4 h-4 text-[#2D5A43]" />
            <span className="hidden sm:inline">Mandatory Account Setup</span>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full flex-1 space-y-6">
        
        {/* Onboarding Stepper */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8DFC8] p-4 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Step 1 */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#EBF2ED] text-[#2D5A43] font-bold text-xs flex items-center justify-center border border-[#8AE0B3]">
                ✓
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F8372] block">Step 1</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#151816]">Account Verified</span>
              </div>
            </div>

            <div className="hidden sm:block flex-1 h-0.5 bg-[#E8DFC8] mx-2"></div>

            {/* Step 2 (Active) */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#2D5A43] text-white font-bold text-xs flex items-center justify-center shadow-sm">
                2
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D5A43] block">Step 2 (Current)</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#151816]">Housing Profile & Intake</span>
              </div>
            </div>

            <div className="hidden sm:block flex-1 h-0.5 bg-[#E8DFC8] mx-2"></div>

            {/* Step 3 */}
            <div className={`flex items-center gap-3 transition-opacity ${isSubmitted ? 'opacity-100' : 'opacity-60'}`}>
              <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center border ${
                isSubmitted 
                  ? 'bg-[#EBF2ED] text-[#2D5A43] border-[#8AE0B3]' 
                  : 'bg-[#F5EFEB] text-[#8F8372] border-[#D7CBBB]'
              }`}>
                {isSubmitted ? '✓' : '3'}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F8372] block">Step 3</span>
                <span className="text-xs sm:text-sm font-semibold text-[#8F8372]">Dashboard & Free Passes</span>
              </div>
            </div>

          </div>
        </div>

        {/* Intro Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1E3F2F] text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#8AE0B3]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#8AE0B3] text-xs font-bold uppercase tracking-wider border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Direct Match Setup</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome to RentBridge, {user?.firstName || 'Chief'}!
            </h1>

            <p className="text-xs sm:text-sm text-[#E2D7C8] leading-relaxed">
              Please complete your initial housing intake below. This data configures your tenant preferences, verified custodian alerts, and pre-approved ₦0 physical viewing gate passes across <strong>Lagos, Abuja, Port Harcourt,</strong> and <strong>Enugu</strong>.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div ref={formCardRef} className="bg-white rounded-3xl border border-[#E8DFC8] shadow-sm overflow-hidden relative">
          
          {/* Top Utility Bar */}
          <div className="px-5 py-3.5 bg-[#F5EFEB] border-b border-[#E8DFC8] flex items-center justify-between text-xs text-[#4B524D]">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#2D5A43]" />
              <span className="font-bold text-[#1E3F2F] tracking-tight text-xs sm:text-sm">RentBridge Onboarding Form</span>
            </div>

            <a
              href={targetFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#D7CBBB] font-bold text-[#2D5A43] hover:bg-[#EBF2ED] transition-all text-xs shadow-xs">
              <span>Open in Full Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Iframe Loading Spinner */}
          {iframeLoading && (
            <div className="h-96 flex flex-col items-center justify-center space-y-3 bg-[#FBF9F5]">
              <Loader2 className="w-8 h-8 animate-spin text-[#2D5A43]" />
              <p className="text-xs font-bold text-[#8F8372]">Loading Onboarding Form...</p>
            </div>
          )}

          {/* Onboarding Form Iframe */}
          <div className={`w-full transition-opacity duration-300 ${iframeLoading ? 'hidden' : 'block'}`}>
            <iframe
              key={targetFormUrl}
              src={targetFormUrl}
              title="RentBridge Onboarding Form"
              onLoad={handleIframeLoad}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-top-navigation-by-user-activation"
              allow="clipboard-write"
              className="w-full min-h-[720px] sm:min-h-[820px] border-0"
            />
          </div>

          {/* Bottom Action Footer with Submission Enforcement & Notification */}
          <div className="p-4 sm:p-6 bg-[#FBF9F5] border-t border-[#E8DFC8] space-y-4">
            
            {/* Warning Notification if user clicks proceed without submitting */}
            {showUnsubmittedWarning && !isSubmitted && (
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-amber-950">
                      Form Submission Required
                    </h4>
                    <p className="text-xs text-amber-900 leading-relaxed mt-0.5">
                      You must complete and submit your onboarding registration above before proceeding to the dashboard. Please scroll through the form and click the green <strong>"Submit"</strong> button.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-sm transition-colors">
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Scroll to Form</span>
                </button>
              </div>
            )}

            {/* Success Notification once submitted */}
            {isSubmitted && (
              <div className="p-3.5 rounded-2xl bg-[#EBF2ED] border border-[#8AE0B3] text-[#1E3F2F] flex items-center gap-2.5 text-xs font-bold shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-[#2D5A43] shrink-0" />
                <span>Onboarding Form submitted successfully! You are ready to access your personalized dashboard.</span>
              </div>
            )}

            {/* Action Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              
              {/* Checkbox verification confirmation */}
              <label className="flex items-center gap-2.5 text-xs text-[#4B524D] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isSubmitted}
                  onChange={(e) => handleManualSubmissionToggle(e.target.checked)}
                  className="w-4 h-4 rounded border-[#D7CBBB] text-[#2D5A43] focus:ring-[#2D5A43] accent-[#2D5A43] cursor-pointer"
                />
                <span className="font-medium">
                  I have filled and submitted the onboarding form above
                </span>
              </label>

              {/* Proceed to Dashboard Button (Guarded) */}
              <button
                type="button"
                onClick={handleProceedClick}
                className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-extrabold text-xs sm:text-sm tracking-tight shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isSubmitted
                    ? 'bg-[#2D5A43] hover:bg-[#1E3F2F] text-white shadow-emerald-900/20'
                    : 'bg-[#2D5A43] hover:bg-[#1E3F2F] text-white opacity-95'
                }`}>
                <span>{isSubmitted ? 'Proceed to Dashboard' : 'Finished Form? Proceed to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

            {/* Disclaimer */}
            <div className="flex items-center gap-2 text-[11px] text-[#8F8372] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A43] shrink-0" />
              <span>Submitted info is strictly used for direct custodian matching. 0% roadside agents.</span>
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-[#E8DFC8] text-center text-xs text-[#8F8372]">
        <p>© {new Date().getFullYear()} RentBridge Nigeria Ltd. ₦0 Viewing Fees • Verified Custodians Only.</p>
      </footer>

    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FBF9F5] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#2D5A43]" />
        <p className="text-xs font-bold text-[#8F8372]">Loading onboarding portal...</p>
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}