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
      formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          
          {/* Logo */}
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

          {/* Mandatory Step Indicator */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#2D5A43] bg-[#EBF2ED] px-3 py-1 rounded-full border border-[#8AE0B3]/40">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A43]" />
            <span>Mandatory Step 2 of 3</span>
          </div>

        </div>
      </header>

      {/* Main Container - Compact and optimized for viewport visibility */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 w-full flex-1 space-y-4">
        
        {/* Compact Onboarding Stepper */}
        <div className="bg-white rounded-2xl border border-[#E8DFC8] px-4 py-2.5 shadow-xs">
          <div className="flex items-center justify-between gap-2">
            
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#EBF2ED] text-[#2D5A43] font-bold text-[10px] flex items-center justify-center border border-[#8AE0B3]">
                ✓
              </div>
              <span className="text-xs font-bold text-[#151816]">Account Verified</span>
            </div>

            <div className="flex-1 h-0.5 bg-[#E8DFC8] mx-2"></div>

            {/* Step 2 (Active) */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#2D5A43] text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
                2
              </div>
              <span className="text-xs font-extrabold text-[#2D5A43]">Housing Profile & Intake</span>
            </div>

            <div className="flex-1 h-0.5 bg-[#E8DFC8] mx-2"></div>

            {/* Step 3 */}
            <div className={`flex items-center gap-2 transition-opacity ${isSubmitted ? 'opacity-100' : 'opacity-50'}`}>
              <div className={`w-5 h-5 rounded-full font-bold text-[10px] flex items-center justify-center border ${
                isSubmitted 
                  ? 'bg-[#EBF2ED] text-[#2D5A43] border-[#8AE0B3]' 
                  : 'bg-[#F5EFEB] text-[#8F8372] border-[#D7CBBB]'
              }`}>
                {isSubmitted ? '✓' : '3'}
              </div>
              <span className="text-xs font-semibold text-[#8F8372] hidden xs:inline">Dashboard & Free Passes</span>
            </div>

          </div>
        </div>

        {/* Compact Welcome Header Banner */}
        <div className="px-4 py-2.5 rounded-2xl bg-[#1E3F2F] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#8AE0B3] shrink-0" />
            <p className="text-xs font-bold text-white">
              Welcome, {user?.firstName || 'Chief'}! Complete your intake below to unlock pre-approved ₦0 viewing passes.
            </p>
          </div>
          <span className="text-[10px] text-[#8AE0B3] font-semibold uppercase tracking-wider shrink-0 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
            Lagos • Abuja • PH • Enugu
          </span>
        </div>

        {/* Form Container - Sized so the form & Submit button are clearly in view */}
        <div ref={formCardRef} className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8DFC8] shadow-sm overflow-hidden relative">
          
          {/* Top Utility Bar (Without Open in Full Page Link) */}
          <div className="px-5 py-3 bg-[#F5EFEB] border-b border-[#E8DFC8] flex items-center justify-between text-xs text-[#4B524D]">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#2D5A43]" />
              <span className="font-bold text-[#1E3F2F] tracking-tight text-xs sm:text-sm">RentBridge Onboarding Form</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#2D5A43]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Fill fields & click Submit below</span>
            </div>
          </div>

          {/* Iframe Loading Spinner */}
          {iframeLoading && (
            <div className="h-96 flex flex-col items-center justify-center space-y-3 bg-[#FBF9F5]">
              <Loader2 className="w-8 h-8 animate-spin text-[#2D5A43]" />
              <p className="text-xs font-bold text-[#8F8372]">Loading Onboarding Form...</p>
            </div>
          )}

          {/* Onboarding Form Iframe - Resized to 980px-1050px so Submit button is fully visible without internal scrolling */}
          <div className={`w-full transition-opacity duration-300 ${iframeLoading ? 'hidden' : 'block'}`}>
            <iframe
              key={targetFormUrl}
              src={targetFormUrl}
              title="RentBridge Onboarding Form"
              onLoad={handleIframeLoad}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-top-navigation-by-user-activation"
              allow="clipboard-write"
              className="w-full h-[980px] sm:h-[1050px] border-0"
            />
          </div>

          {/* Bottom Action Footer with Submission Enforcement & Notification */}
          <div className="p-4 sm:p-5 bg-[#FBF9F5] border-t border-[#E8DFC8] space-y-3">
            
            {/* Warning Notification if user clicks proceed without submitting */}
            {showUnsubmittedWarning && !isSubmitted && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-400 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-start sm:items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs sm:text-sm text-amber-950">
                      Form Submission Required
                    </h4>
                    <p className="text-xs text-amber-900 leading-relaxed">
                      You must complete and submit your onboarding registration above before proceeding to the dashboard. Please scroll to the form and click the green <strong>"Submit"</strong> button.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-sm transition-colors">
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Scroll to Form</span>
                </button>
              </div>
            )}

            {/* Success Notification once submitted */}
            {isSubmitted && (
              <div className="p-3 rounded-2xl bg-[#EBF2ED] border border-[#8AE0B3] text-[#1E3F2F] flex items-center gap-2.5 text-xs font-bold shadow-xs">
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
            <div className="flex items-center gap-2 text-[11px] text-[#8F8372]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A43] shrink-0" />
              <span>Submitted info is strictly used for direct custodian matching. 0% roadside agents.</span>
            </div>

          </div>

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