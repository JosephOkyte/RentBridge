'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { 
  Building2, 
  Calendar, 
  PlusCircle, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  AlertCircle,
  Eye,
  Camera,
  Layers,
  Sparkles,
  Phone,
  MessageCircle,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Scale,
  KeyRound,
  FileCheck,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { formatNaira } from '../../../utils/formatters';

export default function LandlordDashboardPage() {
  const router = useRouter();
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [properties, setProperties] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const profRes = await fetch('/api/profile');
        const profData = await profRes.json();
        if (profData.profile) {
          setProfile(profData.profile);
          // Guard: if user is strictly a tenant, redirect to tenant dashboard
          if (profData.profile.role === 'tenant') {
            router.replace('/dashboard/tenant');
            return;
          }
        }

        const propRes = await fetch('/api/properties?filter=my_listings');
        const propData = await propRes.json();
        if (propData.properties) {
          setProperties(propData.properties);
        }

        const inspRes = await fetch('/api/inspections?view=lister');
        const inspData = await inspRes.json();
        if (inspData.inspections) {
          setInspections(inspData.inspections);
        }
      } catch (err) {
        console.warn('Landlord dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const activeListings = properties.filter((p) => p.status === 'active');
  const draftListings = properties.filter((p) => p.status === 'draft');
  const pendingAudits = properties.filter((p) => p.status === 'pending_audit');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Lister Welcome Hero */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#1E3F2F] text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#8AE0B3]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#8AE0B3] text-xs font-bold uppercase tracking-wider border border-white/10">
            <Building2 className="w-4 h-4" />
            <span>Dedicated Custodian Suite (/dashboard/landlord)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            Welcome, {user?.firstName || 'Property Custodian'}
          </h1>
          <p className="text-sm sm:text-base text-[#E2D7C8] leading-relaxed">
            Manage your verified listings, continue photo uploads on your 30-day drafts, and confirm prospective tenant viewing slots with zero middleman interference.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/properties/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2D5A43] hover:bg-[#151816] text-white text-xs sm:text-sm font-bold shadow-md transition-all">
              <PlusCircle className="w-4 h-4" />
              <span>Stage / Draft Property</span>
            </Link>

            <Link
              href="/dashboard/inspections"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 transition-all">
              <Calendar className="w-4 h-4 text-[#8AE0B3]" />
              <span>Inspection Dispatcher ({inspections.length})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Lister Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Live */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DFC8] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8F8372]">
            <span className="text-xs font-bold uppercase tracking-wider">Live & Verified</span>
            <div className="w-8 h-8 rounded-lg bg-[#EBF2ED] text-[#2D5A43] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#151816]">
            {activeListings.length}
          </p>
          <p className="text-[11px] text-[#2D5A43] font-semibold">
            Visible on public map
          </p>
        </div>

        {/* Metric 2: Staged Drafts (30-day lifespan) */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DFC8] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8F8372]">
            <span className="text-xs font-bold uppercase tracking-wider">Staged Drafts</span>
            <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#151816]">
            {draftListings.length}
          </p>
          <p className="text-[11px] text-[#D97706] font-semibold">
            30-day draft countdown active
          </p>
        </div>

        {/* Metric 3: Under Phase 1 Audit */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DFC8] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8F8372]">
            <span className="text-xs font-bold uppercase tracking-wider">Verification Queue</span>
            <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#151816]">
            {pendingAudits.length}
          </p>
          <p className="text-[11px] text-[#0369A1] font-semibold">
            Under Gatekeeper review
          </p>
        </div>

        {/* Metric 4: Incoming Inspections */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DFC8] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8F8372]">
            <span className="text-xs font-bold uppercase tracking-wider">Inspection Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-[#EBF2ED] text-[#2D5A43] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#151816]">
            {inspections.length}
          </p>
          <p className="text-[11px] text-[#2D5A43] font-semibold">
            Pending slot confirmations
          </p>
        </div>
      </div>

      {/* 30-Day Draft Expiry Spotlight */}
      {draftListings.length > 0 && (
        <div className="p-5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#D97706] text-white flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-black text-[#92400E]">
              You have {draftListings.length} incomplete draft listing(s)
            </h4>
            <p className="text-xs text-[#B45309] mt-0.5">
              Drafts expire 30 days after creation. Upload your remaining photos (12 residential / 17 commercial) to submit for Phase 1 verification and go live.
            </p>
          </div>
          <Link
            href="/dashboard/properties"
            className="px-4 py-2 rounded-xl bg-[#D97706] text-white text-xs font-bold hover:bg-[#B45309] transition-all shrink-0">
            Resume Drafts
          </Link>
        </div>
      )}

      {/* Recent Inspections Table */}
      <div className="bg-white rounded-3xl border border-[#E8DFC8] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#E8DFC8] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-[#151816]">
              Recent Inspection Inquiries
            </h2>
            <p className="text-xs text-[#8F8372] mt-0.5">
              Confirm incoming viewing slots or suggest alternate times.
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
              When prospective tenants request a viewing on your active properties, their slot requests will appear here.
            </p>
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
                      {insp.status === 'confirmed' ? '✓ Confirmed Slot' : '⏳ Awaiting Confirmation'}
                    </span>
                    <span className="text-xs font-bold text-[#8F8372]">
                      {insp.scheduledDate || insp.scheduled_at} • {insp.timeSlot || insp.time_slot}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#151816]">
                    {insp.propertyTitle || insp.property_title}
                  </h3>
                  <p className="text-xs text-[#4B524D]">
                    Prospective Tenant: <strong>{insp.tenantName || insp.tenant_name}</strong> ({insp.tenantPhone || insp.tenant_phone})
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
