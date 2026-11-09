'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { 
  Building2, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  AlertCircle,
  TrendingUp,
  MapPin,
  Lock,
  ArrowLeft,
  Search,
  MessageCircle,
  Phone
} from 'lucide-react';
import { formatNaira } from '../../../utils/formatters';

export default function TenantDashboardPage() {
  const router = useRouter();
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const profRes = await fetch('/api/profile');
        const profData = await profRes.json();
        if (profData.profile) {
          setProfile(profData.profile);
          // Guard: if user is not tenant or admin, redirect to landlord
          if (['landlord', 'lawyer', 'caretaker'].includes(profData.profile.role)) {
            router.replace('/dashboard/landlord');
            return;
          }
        }

        const inspRes = await fetch('/api/inspections?view=tenant');
        const inspData = await inspRes.json();
        if (inspData.inspections) {
          setInspections(inspData.inspections);
        }
      } catch (err) {
        console.warn('Tenant dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const confirmedInspections = inspections.filter((i) => i.status === 'confirmed');
  const pendingInspections = inspections.filter((i) => i.status === 'requested');
  const estimatedSavings = 1400000; // Average ₦1.4M saved in agency cuts

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Tenant Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#1E3F2F] text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#8AE0B3]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#8AE0B3] text-xs font-bold uppercase tracking-wider border border-white/10">
            <ShieldCheck className="w-4 h-4" />
            <span>Dedicated Tenant Sanctuary (/dashboard/tenant)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            Welcome, {user?.firstName || 'Verified Tenant'}
          </h1>
          <p className="text-sm sm:text-base text-[#E2D7C8] leading-relaxed">
            Connect directly with verified property owners and accredited legal custodians. Every inspection viewing is guaranteed 100% free with ₦0 middleman charges.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/#properties"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8AE0B3] hover:bg-white text-[#151816] text-xs sm:text-sm font-bold shadow-md transition-all">
              <Building2 className="w-4 h-4" />
              <span>Browse Direct Homes</span>
            </Link>

            <Link
              href="/dashboard/inspections"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 transition-all">
              <Calendar className="w-4 h-4 text-[#8AE0B3]" />
              <span>My Booked Inspections ({inspections.length})</span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 transition-all">
              <ArrowLeft className="w-4 h-4 text-[#8AE0B3]" />
              <span>Back to Marketplace</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Tenant Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Middleman Savings */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DFC8] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8F8372]">
            <span className="text-xs font-bold uppercase tracking-wider">Agency Fees Saved</span>
            <div className="w-8 h-8 rounded-lg bg-[#EBF2ED] text-[#2D5A43] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#151816]">
            {formatNaira(estimatedSavings)}
          </p>
          <p className="text-[11px] text-[#2D5A43] font-semibold flex items-center gap-1">
            <span>● 0% middleman cut guaranteed</span>
          </p>
        </div>

        {/* Metric 2: Confirmed Inspections */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DFC8] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8F8372]">
            <span className="text-xs font-bold uppercase tracking-wider">Confirmed Viewings</span>
            <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#151816]">
            {confirmedInspections.length}
          </p>
          <p className="text-[11px] text-[#0369A1] font-semibold">
            Direct phone & WhatsApp revealed
          </p>
        </div>

        {/* Metric 3: Pending Confirmation */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DFC8] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8F8372]">
            <span className="text-xs font-bold uppercase tracking-wider">Awaiting Confirmation</span>
            <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#151816]">
            {pendingInspections.length}
          </p>
          <p className="text-[11px] text-[#D97706] font-semibold">
            Landlord reviewing scheduled slot
          </p>
        </div>
      </div>

      {/* Anti-Extortion Shield Banner */}
      <div className="p-5 rounded-2xl bg-[#EBF2ED] border border-[#2D5A43]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D5A43] text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-[#151816]">
              RentBridge ₦0 Viewing Fee Protection
            </h4>
            <p className="text-xs text-[#4B524D] mt-0.5">
              If any landlord, lawyer, or caretaker requests an "inspection fee", "fuel fee", or "gate registration fee", report it immediately.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/inspections"
          className="px-4 py-2 rounded-xl bg-white border border-[#2D5A43]/30 text-xs font-bold text-[#2D5A43] hover:bg-[#2D5A43] hover:text-white transition-all shrink-0">
          View Inspection Desk
        </Link>
      </div>

      {/* Booked Inspections Feed */}
      <div className="bg-white rounded-3xl border border-[#E8DFC8] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#E8DFC8] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-[#151816]">
              Your Scheduled Viewings
            </h2>
            <p className="text-xs text-[#8F8372] mt-0.5">
              Direct physical inspections with verified property custodians.
            </p>
          </div>
          <Link
            href="/dashboard/inspections"
            className="text-xs font-bold text-[#2D5A43] hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {inspections.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F5EFEB] text-[#8F8372] flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-[#151816]">No inspections scheduled yet</p>
            <p className="text-xs text-[#8F8372] max-w-sm mx-auto">
              Browse verified vacancies across Lagos, Abuja, Port Harcourt, and Enugu to book your first free viewing.
            </p>
            <div className="pt-2">
              <Link
                href="/#properties"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2D5A43] text-white text-xs font-bold hover:bg-[#1E3F2F] transition-all">
                <Search className="w-4 h-4" />
                <span>Explore Available Properties</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[#E8DFC8]">
            {inspections.slice(0, 3).map((insp) => (
              <div key={insp.id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FBF9F5] transition-all">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      insp.status === 'confirmed' 
                        ? 'bg-[#EBF2ED] text-[#2D5A43]' 
                        : 'bg-[#FEF3C7] text-[#D97706]'
                    }`}>
                      {insp.status === 'confirmed' ? '✓ Confirmed Slot' : '⏳ Awaiting Landlord Confirmation'}
                    </span>
                    <span className="text-xs font-bold text-[#8F8372]">
                      {insp.scheduledDate || insp.scheduled_at} • {insp.timeSlot || insp.time_slot}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#151816]">
                    {insp.propertyTitle || insp.property_title}
                  </h3>
                  <p className="text-xs text-[#4B524D]">
                    Custodian: <strong>{insp.listerName || insp.lister_name}</strong>
                  </p>
                </div>

                <Link
                  href="/dashboard/inspections"
                  className="px-4 py-2 rounded-xl border border-[#E8DFC8] bg-white hover:bg-[#F5EFEB] text-xs font-bold text-[#151816] transition-all shrink-0 text-center">
                  Manage Viewing
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

