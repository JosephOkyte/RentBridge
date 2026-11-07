'use client';

import React from 'react';
import Link from 'next/link';
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
  Layers
} from 'lucide-react';
import { formatNaira } from '../../utils/formatters';

export default function DashboardOverviewPage() {
  const { user } = useUser();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#1E3F2F] text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#8AE0B3]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#8AE0B3] text-xs font-bold uppercase tracking-wider border border-white/10">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero Agent Wahala Portal</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            Welcome, {user?.firstName || 'Property Custodian'}
          </h1>
          <p className="text-sm sm:text-base text-[#E2D7C8] leading-relaxed">
            Manage your verified listings, continue photo uploads on your drafts, and review free physical inspection requests with zero middleman interference.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/properties/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2D5A43] hover:bg-[#151816] text-white text-xs sm:text-sm font-bold shadow-md transition-all">
              <PlusCircle className="w-4 h-4" />
              <span>Add / Draft Property</span>
            </Link>

            <Link
              href="/dashboard/inspections"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 transition-all">
              <Calendar className="w-4 h-4 text-[#8AE0B3]" />
              <span>View Inspections</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DFC8] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8F8372]">
            <span className="text-xs font-bold uppercase tracking-wider">Active Listings</span>
            <div className="w-8 h-8 rounded-lg bg-[#EBF2ED] text-[#2D5A43] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#151816]">1</p>
          <p className="text-[11px] text-[#2D5A43] font-semibold flex items-center gap-1">
            <span>● 100% Verified & Live on Map</span>
          </p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DFC8] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8F8372]">
            <span className="text-xs font-bold uppercase tracking-wider">Saved Drafts</span>
            <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#151816]">1</p>
          <p className="text-[11px] text-[#D97706] font-semibold">
            <span>4 more photos needed for quota</span>
          </p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DFC8] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8F8372]">
            <span className="text-xs font-bold uppercase tracking-wider">Upcoming Inspections</span>
            <div className="w-8 h-8 rounded-lg bg-[#EBF2ED] text-[#2D5A43] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#151816]">1</p>
          <p className="text-[11px] text-[#2D5A43] font-semibold">
            <span>Guaranteed ₦0 viewing fee</span>
          </p>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DFC8] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8F8372]">
            <span className="text-xs font-bold uppercase tracking-wider">Agent Commission</span>
            <div className="w-8 h-8 rounded-lg bg-[#EBF2ED] text-[#2D5A43] flex items-center justify-center font-bold text-xs">
              0%
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#2D5A43]">₦0</p>
          <p className="text-[11px] text-[#8F8372]">
            <span>Middlemen completely bypassed</span>
          </p>
        </div>
      </div>

      {/* In-Progress Draft Action Alert */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8DFC8] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                Draft In Progress
              </span>
              <span className="text-xs text-[#8F8372]">Last updated yesterday</span>
            </div>
            <h3 className="text-lg font-bold text-[#151816]">
              Contemporary 3-Bedroom Terrace Duplex (Lekki Phase 1)
            </h3>
            <p className="text-xs text-[#4B524D]">
              Photo Quota Status: <strong>8 of 12 required photos uploaded</strong>. Capture street length and gate entrance before submitting for Phase 1 verification.
            </p>
          </div>

          <Link
            href="/dashboard/properties/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2D5A43] text-white text-xs font-bold hover:bg-[#1E3F2F] shrink-0">
            <Camera className="w-4 h-4" />
            <span>Resume Photo Upload</span>
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[#8F8372]">Verification Readiness</span>
            <span className="text-[#2D5A43]">67% (8/12 Photos)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#F5EFEB] overflow-hidden">
            <div className="h-full bg-[#2D5A43] rounded-full transition-all" style={{ width: '67%' }}></div>
          </div>
        </div>
      </div>

      {/* Quick Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Lister Direct Protocol */}
        <div className="p-6 rounded-3xl bg-[#F5EFEB] border border-[#E2D7C8] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D5A43] text-white flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="text-base font-extrabold text-[#151816]">Direct Custodian Standards</h4>
          <p className="text-xs text-[#4B524D] leading-relaxed">
            Only Title Owners, resident Caretakers with signed custody authority, and retained Legal Custodians (Lawyers) are permitted to list on RentBridge. Street relay agents are barred.
          </p>
          <Link
            href="/dashboard/properties"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D5A43] hover:underline pt-1">
            <span>Manage All My Properties</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 2: 100% Free Viewings Guarantee */}
        <div className="p-6 rounded-3xl bg-[#F5EFEB] border border-[#E2D7C8] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D5A43] text-white flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-base font-extrabold text-[#151816]">Zero Inspection Fee Enforcement</h4>
          <p className="text-xs text-[#4B524D] leading-relaxed">
            Any report of inspection transport money, "gate viewing fees", or illegal registration fees leads to an immediate listing freeze and permanent phone blacklisting.
          </p>
          <Link
            href="/dashboard/inspections"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D5A43] hover:underline pt-1">
            <span>Review Scheduled Inspections</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

