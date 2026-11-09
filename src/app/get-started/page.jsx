'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { 
  Building2, 
  KeyRound, 
  Home, 
  Scale, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Lock,
  Sparkles,
  Camera,
  Check
} from 'lucide-react';

function GetStartedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();

  const initialIntent = searchParams?.get('intent') || '';
  const initialRole = searchParams?.get('role') || '';

  const [selectedRole, setSelectedRole] = useState(
    ['tenant', 'landlord', 'caretaker', 'lawyer'].includes(initialRole) 
      ? initialRole 
      : (initialIntent === 'list' ? 'landlord' : null)
  );
  const [committing, setCommitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 4 Distinct Personas configuration
  const roles = [
    {
      id: 'tenant',
      title: 'Prospective Tenant',
      badge: 'Renter Sanctuary',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: KeyRound,
      iconBg: 'bg-[#E0F2FE] text-[#0369A1]',
      cardBorder: 'hover:border-[#0369A1]',
      selectedBorder: 'border-2 border-[#0369A1] ring-4 ring-[#0369A1]/10 bg-sky-50/40',
      buttonBg: 'bg-[#0369A1] hover:bg-[#075985]',
      subtitle: 'Searching for verified direct apartments or commercial spaces.',
      highlights: [
        'Strictly ₦0 inspection fees & 0% middleman commission',
        'Direct connection with verified deed owners & caretakers',
        '1-Click anti-extortion reporting protection'
      ],
      notice: 'Zero agency fees across Lagos, Abuja, Port Harcourt & Enugu.',
      destinationUrl: '/dashboard/tenant'
    },
    {
      id: 'landlord',
      title: 'Property Landlord',
      badge: 'Title Holder (Owner)',
      badgeClass: 'bg-[#EBF2ED] text-[#2D5A43] border-[#2D5A43]/30',
      icon: Building2,
      iconBg: 'bg-[#EBF2ED] text-[#2D5A43]',
      cardBorder: 'hover:border-[#2D5A43]',
      selectedBorder: 'border-2 border-[#2D5A43] ring-4 ring-[#2D5A43]/10 bg-[#EBF2ED]/30',
      buttonBg: 'bg-[#2D5A43] hover:bg-[#1E3F2F]',
      subtitle: 'Direct legal deed holder or beneficial property owner.',
      highlights: [
        '100% rental income retention — zero agent cut deducted',
        'Confirm or reschedule tenant viewing slots directly',
        'Phase 1 Gatekeeper review ensures verified tenant caliber'
      ],
      notice: 'Proof of title (C of O, Governor Consent, or Deed) required when staging listings.',
      destinationUrl: '/dashboard/landlord'
    },
    {
      id: 'caretaker',
      title: 'Resident Caretaker',
      badge: 'On-Site Custodian',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: Home,
      iconBg: 'bg-amber-100 text-amber-800',
      cardBorder: 'hover:border-amber-600',
      selectedBorder: 'border-2 border-amber-600 ring-4 ring-amber-600/10 bg-amber-50/30',
      buttonBg: 'bg-amber-700 hover:bg-amber-800',
      subtitle: 'Accredited resident custodian or on-site facility manager.',
      highlights: [
        'Dispatch and conduct on-ground physical inspections',
        'Stage drafts & fulfill 12/17 photo quotas for the property',
        'Direct phone & WhatsApp viewing coordination'
      ],
      notice: 'Owner authorization letter or facility mandate required. Freelance street agents strictly prohibited.',
      destinationUrl: '/dashboard/landlord'
    },
    {
      id: 'lawyer',
      title: 'Legal Counsel / Lawyer',
      badge: 'Power of Attorney',
      badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      icon: Scale,
      iconBg: 'bg-indigo-100 text-indigo-800',
      cardBorder: 'hover:border-indigo-600',
      selectedBorder: 'border-2 border-indigo-600 ring-4 ring-indigo-600/10 bg-indigo-50/30',
      buttonBg: 'bg-indigo-700 hover:bg-indigo-800',
      subtitle: 'Retained estate solicitor or legal administrator.',
      highlights: [
        'Manage property portfolios with legal Power of Attorney',
        'Prepare covenants, legal receipts, and formal agreements',
        'Verified Legal Counsel trust seal displayed on all listings'
      ],
      notice: 'Bar practicing certification & owner retainership required. Middlemen impersonating counsel will be prosecuted.',
      destinationUrl: '/dashboard/landlord'
    }
  ];

  // Action: Commit and proceed to Clerk Sign-up or direct dashboard
  const handleProceed = async (roleId) => {
    setCommitting(true);
    setErrorMsg('');

    // Persist choice in client cookie & storage for Clerk signup / callback
    if (typeof window !== 'undefined') {
      document.cookie = `rentbridge_intended_role=${roleId}; path=/; max-age=86400; SameSite=Lax`;
      localStorage.setItem('rentbridge_role', roleId);
    }

    // If user is ALREADY signed into Clerk, save the profile role directly
    if (isLoaded && user) {
      try {
        const res = await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: roleId }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to assign role.');
        }

        if (roleId === 'tenant') {
          router.replace('/dashboard/tenant');
        } else {
          router.replace('/dashboard/landlord');
        }
        return;
      } catch (err) {
        setErrorMsg(err.message);
        setCommitting(false);
        return;
      }
    }

    // Otherwise, route to Clerk Sign-Up with role metadata in query
    router.push(`/sign-up?role=${roleId}`);
  };

  const isListerIntent = initialIntent === 'list';

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#151816] flex flex-col justify-between">
      {/* Top Navigation */}
      <header className="border-b border-[#E8DFC8] bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#2D5A43] flex items-center justify-center text-white font-black text-lg shadow-sm">
              RB
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-[#151816] tracking-tight">
                Rent<span className="text-[#2D5A43]">Bridge</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] text-[#8F8372] ml-2 font-semibold">
                Nigeria's Direct Rental Marketplace
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#E8DFC8] bg-white text-xs font-bold text-[#4B524D] hover:bg-[#F5EFEB] hover:text-[#151816] transition-all">
            <ArrowLeft className="w-4 h-4 text-[#2D5A43]" />
            <span>Return to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Role Commitment Workspace */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Header Block */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF2ED] text-[#2D5A43] border border-[#2D5A43]/20 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#2D5A43]" />
            <span>Step 1 of 2: Identity & Persona Declaration</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#151816]">
            {isListerIntent 
              ? 'Select Your Property Custodian Role' 
              : 'Select Your RentBridge Identity'}
          </h1>
          <p className="text-sm sm:text-base text-[#4B524D] max-w-2xl mx-auto leading-relaxed">
            To guarantee 100% zero-agent purity and eradicate middleman extortion across Lagos, Abuja, Port Harcourt, and Enugu, every account is strictly locked to its designated role.
          </p>

          {isListerIntent && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold max-w-xl mx-auto flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
              <span>You selected "List Property". Please choose your direct capacity below:</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold max-w-xl mx-auto flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* 4 Persona Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            const isDimmed = isListerIntent && role.id === 'tenant';

            return (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`flex flex-col justify-between p-6 rounded-3xl bg-white border transition-all cursor-pointer relative shadow-sm hover:shadow-md ${
                  isSelected 
                    ? role.selectedBorder 
                    : `border-[#E8DFC8] ${role.cardBorder}`
                } ${isDimmed ? 'opacity-50 hover:opacity-100' : ''}`}>
                
                {/* Active Checkmark Pill */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#2D5A43] text-white flex items-center justify-center shadow-sm">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                <div className="space-y-4">
                  {/* Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${role.iconBg} flex items-center justify-center font-bold shadow-xs`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <div>
                    <span className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${role.badgeClass} mb-2`}>
                      {role.badge}
                    </span>
                    <h2 className="text-xl font-black text-[#151816] tracking-tight">
                      {role.title}
                    </h2>
                    <p className="text-xs text-[#4B524D] mt-1 leading-relaxed">
                      {role.subtitle}
                    </p>
                  </div>

                  {/* Highlights List */}
                  <ul className="space-y-2 pt-2 border-t border-[#E8DFC8]/60">
                    {role.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#151816]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2D5A43] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Legal Safeguard / Notice */}
                  <div className="p-3 rounded-xl bg-[#F5EFEB] border border-[#E8DFC8] text-[11px] text-[#8F8372] leading-tight">
                    <span className="font-bold text-[#151816] block mb-0.5">Verification Mandate:</span>
                    {role.notice}
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="pt-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProceed(role.id);
                    }}
                    disabled={committing}
                    className={`w-full py-3 px-4 rounded-xl text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${role.buttonBg}`}>
                    <span>{committing && selectedRole === role.id ? 'Connecting...' : `Join as ${role.title.replace('Prospective ', '').replace('Property ', '')}`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Anti-Agent Warning Banner */}
        <div className="p-6 rounded-3xl bg-[#151816] text-white border border-[#252926] max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-black text-white">Strict Middleman Exclusion Policy</h4>
              <p className="text-xs text-[#D4CEC3] leading-relaxed">
                RentBridge does not support street agents or informal solicitors. A landlord or lawyer who also wishes to rent must create a separate tenant account with a distinct email.
              </p>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <span className="text-[10px] text-[#8AE0B3] font-bold block uppercase tracking-wider">
              100% Zero-Agent Guarantee
            </span>
            <span className="text-xs text-white/80">Lagos • Abuja • PH • Enugu</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8DFC8] py-6 bg-white/50 text-center text-xs text-[#8F8372]">
        <p>© 2026 RentBridge Nigeria. All rights reserved. Zero Middleman Commission Marketplace.</p>
      </footer>
    </div>
  );
}

export default function GetStartedRoleSelectionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FBF9F5] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#2D5A43] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-[#8F8372]">Loading identity selector...</p>
      </div>
    }>
      <GetStartedContent />
    </Suspense>
  );
}
