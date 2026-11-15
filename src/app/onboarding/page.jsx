'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  Sparkles, 
  Lock, 
  Loader2, 
  HelpCircle,
  LayoutDashboard
} from 'lucide-react';

const DEFAULT_N8N_FORM_URL = process.env.NEXT_PUBLIC_N8N_ONBOARDING_FORM_URL || 'https://prime-tech-hub.duckdns.org/form-test/b40e282e-fe38-483a-84b0-6e120508da81';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [iframeLoading, setIframeLoading] = useState(true);
  const [targetFormUrl, setTargetFormUrl] = useState(DEFAULT_N8N_FORM_URL);

  useEffect(() => {
    if (isLoaded && user) {
      try {
        const url = new URL(DEFAULT_N8N_FORM_URL);
        url.searchParams.set('userId', user.id || '');
        url.searchParams.set('email', user.primaryEmailAddress?.emailAddress || '');
        url.searchParams.set('name', user.fullName || user.firstName || '');
        setTargetFormUrl(url.toString());
      } catch (e) {
        setTargetFormUrl(DEFAULT_N8N_FORM_URL);
      }
    }
  }, [isLoaded, user]);

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

          {/* Skip / Return to Dashboard */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#F5EFEB] hover:bg-[#EAE2D8] text-[#1E3F2F] border border-[#D7CBBB] transition-all cursor-pointer">
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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
            <div className="flex items-center gap-3 opacity-60">
              <div className="w-8 h-8 rounded-full bg-[#F5EFEB] text-[#8F8372] font-bold text-xs flex items-center justify-center border border-[#D7CBBB]">
                3
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
        <div className="bg-white rounded-3xl border border-[#E8DFC8] shadow-sm overflow-hidden relative">
          
          {/* Top Utility Bar */}
          <div className="px-5 py-3.5 bg-[#F5EFEB] border-b border-[#E8DFC8] flex items-center justify-between text-xs text-[#4B524D]">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-[#2D5A43]" />
              <span className="font-semibold">Secure n8n Data Ingestion Gateway</span>
            </div>

            <a
              href={targetFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-[#2D5A43] hover:underline">
              <span>Open in Full Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Iframe Loading Spinner */}
          {iframeLoading && (
            <div className="h-96 flex flex-col items-center justify-center space-y-3 bg-[#FBF9F5]">
              <Loader2 className="w-8 h-8 animate-spin text-[#2D5A43]" />
              <p className="text-xs font-bold text-[#8F8372]">Connecting to Intake Form...</p>
            </div>
          )}

          {/* n8n Form Iframe */}
          <div className={`w-full transition-opacity duration-300 ${iframeLoading ? 'hidden' : 'block'}`}>
            <iframe
              src={targetFormUrl}
              title="RentBridge User Onboarding & Data Collection"
              onLoad={() => setIframeLoading(false)}
              className="w-full min-h-[680px] sm:min-h-[750px] border-0"
            />
          </div>

          {/* Bottom Action Footer */}
          <div className="p-4 sm:p-6 bg-[#FBF9F5] border-t border-[#E8DFC8] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#8F8372]">
              <ShieldCheck className="w-4 h-4 text-[#2D5A43] shrink-0" />
              <span>Submitted info is strictly used for direct custodian matching. 0% roadside agents.</span>
            </div>

            <button
              onClick={() => router.push('/dashboard')}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white font-extrabold text-xs sm:text-sm tracking-tight shadow-md flex items-center justify-center gap-2 transition-all">
              <span>Finished Form? Proceed to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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
