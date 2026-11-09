'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  KeyRound, 
  Scale, 
  Layers, 
  Lock,
  Sparkles,
  Clock
} from 'lucide-react';

export default function DashboardIndexRouter() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectingRole, setSelectingRole] = useState(false);
  const [savingRole, setSavingRole] = useState(false);
  const [roleError, setRoleError] = useState('');

  useEffect(() => {
    async function evaluateRoute() {
      if (!isLoaded) return;
      if (!user) {
        router.replace('/sign-in');
        return;
      }

      try {
        const res = await fetch('/api/profile');
        const data = await res.json();

        if (data.profile) {
          const role = data.profile.role;
          if (data.isAdmin || role === 'admin') {
            router.replace('/dashboard/admin');
            return;
          }
          if (['landlord', 'lawyer', 'caretaker'].includes(role)) {
            router.replace('/dashboard/landlord');
            return;
          }
          // Default to tenant dashboard
          router.replace('/dashboard/tenant');
          return;
        }

        // Check if admin by clerk metadata or email domain
        const email = user.primaryEmailAddress?.emailAddress;
        if (user.publicMetadata?.role === 'admin' || email?.endsWith('@rentbridge.ng') || email === 'josephokyte@gmail.com') {
          router.replace('/dashboard/admin');
          return;
        }

        // No profile found: show role onboarding modal
        setSelectingRole(true);
      } catch (err) {
        console.warn('Dashboard routing check error:', err);
        setSelectingRole(true);
      } finally {
        setLoading(false);
      }
    }

    evaluateRoute();
  }, [user, isLoaded, router]);

  // Handle Initial Role Commitment (Permanent & Locked)
  const handleLockRole = async (chosenRole) => {
    setSavingRole(true);
    setRoleError('');
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: chosenRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize account role.');
      }

      // Redirect immediately to the dedicated dashboard URL
      if (chosenRole === 'tenant') {
        router.replace('/dashboard/tenant');
      } else {
        router.replace('/dashboard/landlord');
      }
    } catch (err) {
      setRoleError(err.message);
      setSavingRole(false);
    }
  };

  if (loading || (!selectingRole && !roleError)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#2D5A43] border-t-transparent animate-spin"></div>
        <div className="text-center space-y-1">
          <p className="text-sm font-bold text-[#151816]">Routing to your dedicated dashboard...</p>
          <p className="text-xs text-[#8F8372]">Direct Nigerian real estate with ₦0 middleman extortion</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 animate-fadeIn">
      {/* Role Declaration Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#2D5A43] shadow-xl space-y-6">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF2ED] text-[#2D5A43] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Strict Anti-Middleman Protocol</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#151816]">
            Select Your Dedicated Experience
          </h1>
          <p className="text-sm text-[#4B524D] leading-relaxed">
            To eliminate street agent impersonation and guarantee zero inspection fee extortion across Nigeria, RentBridge enforces a strict single-role policy. Once committed, your account URL and permissions are permanent.
          </p>
        </div>

        {roleError && (
          <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200">
            {roleError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Option A: Tenant Portal */}
          <button
            onClick={() => handleLockRole('tenant')}
            disabled={savingRole}
            className="p-6 rounded-2xl border-2 border-[#E8DFC8] hover:border-[#2D5A43] hover:bg-[#F5EFEB] text-left transition-all group cursor-pointer relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center font-bold mb-4 group-hover:scale-105 transition-transform">
              <KeyRound className="w-6 h-6" />
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0369A1] bg-sky-100 px-2 py-0.5 rounded-md mb-2">
              <span>/dashboard/tenant</span>
            </div>
            <h3 className="text-lg font-black text-[#151816] group-hover:text-[#2D5A43]">
              I am a Prospective Tenant
            </h3>
            <p className="text-xs text-[#4B524D] mt-2 leading-relaxed">
              Find verified direct residential & commercial properties in Lagos, Abuja, Port Harcourt & Enugu. Enjoy guaranteed ₦0 inspection fees and 0% agent commission.
            </p>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-black text-[#2D5A43]">
              <span>Proceed to Tenant Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Option B: Landlord / Custodian Suite */}
          <button
            onClick={() => handleLockRole('landlord')}
            disabled={savingRole}
            className="p-6 rounded-2xl border-2 border-[#E8DFC8] hover:border-[#2D5A43] hover:bg-[#F5EFEB] text-left transition-all group cursor-pointer relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-[#EBF2ED] text-[#2D5A43] flex items-center justify-center font-bold mb-4 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2D5A43] bg-emerald-100 px-2 py-0.5 rounded-md mb-2">
              <span>/dashboard/landlord</span>
            </div>
            <h3 className="text-lg font-black text-[#151816] group-hover:text-[#2D5A43]">
              I am a Property Custodian
            </h3>
            <p className="text-xs text-[#4B524D] mt-2 leading-relaxed">
              Direct Landlords, verified Estate Lawyers, and accredited Caretakers. Stage listings with 30-day drafts, meet photo quotas, and dispatch viewings directly to tenants.
            </p>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-black text-[#2D5A43]">
              <span>Proceed to Custodian Suite</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* Anti-Agent Lock Notice */}
        <div className="p-4 rounded-2xl bg-[#F5EFEB] border border-[#E2D7C8] flex items-start gap-3 text-xs text-[#4B524D]">
          <Lock className="w-4 h-4 text-[#2D5A43] shrink-0 mt-0.5" />
          <p>
            <strong className="text-[#151816]">RentBridge Separation Policy:</strong> A landlord who wants to rent a home must register using a separate tenant email. Similarly, tenants cannot list properties. This eliminates middleman disguise and maintains 100% marketplace integrity.
          </p>
        </div>
      </div>
    </div>
  );
}
