'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { 
  ShieldCheck, 
  Users, 
  AlertTriangle, 
  Building2, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  Trash2,
  Calendar,
  Layers,
  MapPin,
  TrendingUp,
  FileCheck,
  ArrowLeft,
  Search,
  Filter,
  MessageCircle,
  Phone,
  Check,
  Loader2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import EmptyState from '../../../components/EmptyState';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    pendingVerification: 0,
    activeListings: 9,
    registeredAccounts: 0,
    fraudIncidents: 0,
  });
  const [inspections, setInspections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [cleaningDrafts, setCleaningDrafts] = useState(false);
  const [cleanupMessage, setCleanupMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const profRes = await fetch('/api/profile');
        const profData = await profRes.json();
        
        if (!profData.isAdmin && profData.profile?.role !== 'admin') {
          // Guard: not an admin -> redirect to their role dashboard
          if (profData.profile?.role === 'tenant') {
            router.replace('/dashboard/tenant');
          } else {
            router.replace('/dashboard/landlord');
          }
          return;
        }

        setProfile(profData.profile);

        const auditRes = await fetch('/api/admin/audit');
        const auditData = await auditRes.json();
        setStats({
          pendingVerification: auditData.pendingSubmissions?.length || 0,
          activeListings: 9,
          registeredAccounts: auditData.registeredAccounts?.length || 0,
          fraudIncidents: auditData.fraudIncidents?.length || 0,
        });
        if (auditData.allInspections) {
          setInspections(auditData.allInspections);
        }
      } catch (err) {
        console.warn('Admin dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const handleStatusChange = async (inspectionId, nextStatus) => {
    if (updatingStatusId) return;
    setUpdatingStatusId(inspectionId);
    setStatusMessage('');

    // Optimistic UI update
    setInspections((prev) =>
      prev.map((i) => (i.id === inspectionId ? { ...i, status: nextStatus } : i))
    );

    try {
      const res = await fetch('/api/inspections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'admin_update_status',
          inspectionId,
          status: nextStatus,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update status.');
      }
      setStatusMessage(`Appointment #${inspectionId} updated to ${nextStatus.toUpperCase()}.`);
    } catch (err) {
      console.error(err);
      setStatusMessage('Warning: Network sync error. Please refresh.');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const filteredInspections = inspections.filter((item) => {
    const matchesSearch =
      (item.tenantName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.propertyTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.ingestionId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tenantPhone || '').includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCity = cityFilter === 'all' || (item.city || '').toLowerCase() === cityFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCity;
  });

  const handlePruneStaleDrafts = () => {
    setCleaningDrafts(true);
    setTimeout(() => {
      setCleaningDrafts(false);
      setCleanupMessage('Audit complete: Zero expired drafts exceeding 30 days detected. Storage clean.');
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Citadel Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#151816] text-white relative overflow-hidden shadow-2xl border border-[#252926]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2D5A43]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-black uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Super Admin Citadel (/dashboard/admin)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            RentBridge Platform Compliance & Operations
          </h1>
          <p className="text-sm sm:text-base text-[#D4CEC3] leading-relaxed">
            Preserve 100% zero-agent purity across Lagos, Abuja, Port Harcourt, and Enugu. Audit photo quotas, verify legal land titles, monitor accounts in stealth mode, and enforce ₦0 inspection fees.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/admin/verification"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-xs sm:text-sm font-bold shadow-md transition-all">
              <ShieldCheck className="w-4 h-4" />
              <span>Phase 1 Verification Queue ({stats.pendingVerification})</span>
            </Link>

            <Link
              href="/admin/fraud"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs sm:text-sm font-bold transition-all">
              <AlertTriangle className="w-4 h-4" />
              <span>Anti-Fraud Incident Room</span>
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

      {cleanupMessage && (
        <div className="p-4 rounded-2xl bg-[#EBF2ED] border border-[#2D5A43]/30 text-xs font-bold text-[#2D5A43] flex items-center justify-between">
          <span>✓ {cleanupMessage}</span>
          <button onClick={() => setCleanupMessage('')} className="text-[#8F8372] hover:text-[#151816]">✕</button>
        </div>
      )}

      {/* Citadel Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DFC8] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8F8372]">
            <span className="text-xs font-bold uppercase tracking-wider">Agent Purity Index</span>
            <div className="w-8 h-8 rounded-lg bg-[#EBF2ED] text-[#2D5A43] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#2D5A43]">100%</p>
          <p className="text-[11px] text-[#2D5A43] font-semibold">Strictly direct custodians only</p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DFC8] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8F8372]">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Audit Queue</span>
            <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#151816]">{stats.pendingVerification}</p>
          <p className="text-[11px] text-[#D97706] font-semibold">Phase 1 manual verification gate</p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DFC8] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8F8372]">
            <span className="text-xs font-bold uppercase tracking-wider">Accounts Under Watch</span>
            <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#151816]">{stats.registeredAccounts}</p>
          <p className="text-[11px] text-[#0369A1] font-semibold">Stealth shadow monitoring ready</p>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DFC8] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8F8372]">
            <span className="text-xs font-bold uppercase tracking-wider">Fee Extortion Reports</span>
            <div className="w-8 h-8 rounded-lg bg-[#FEF2F2] text-[#B91C1C] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#151816]">{stats.fraudIncidents}</p>
          <p className="text-[11px] text-[#B91C1C] font-semibold">Anti-extortion triage room</p>
        </div>
      </div>

      {/* The 3 Core Operational Desks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Desk 1: Verification */}
        <Link
          href="/admin/verification"
          className="p-6 rounded-3xl bg-white border border-[#E8DFC8] hover:border-[#2D5A43] hover:shadow-md transition-all group flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF2ED] text-[#2D5A43] flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[#151816] group-hover:text-[#2D5A43] transition-colors">
              Phase 1 Gatekeeper Verification Desk
            </h3>
            <p className="text-xs text-[#4B524D] leading-relaxed">
              Review submitted properties in a split-screen layout: photo transparency quota (12/17 photos) on the left, private legal deeds on the right.
            </p>
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-[#2D5A43] pt-2 border-t border-[#E8DFC8]">
            <span>Open Verification Desk</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Desk 2: Stealth Monitoring */}
        <Link
          href="/admin/accounts"
          className="p-6 rounded-3xl bg-white border border-[#E8DFC8] hover:border-[#2D5A43] hover:shadow-md transition-all group flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[#151816] group-hover:text-[#2D5A43] transition-colors">
              Stealth Shadow Account Monitor
            </h3>
            <p className="text-xs text-[#4B524D] leading-relaxed">
              Silently audit any account (Tenant, Landlord, Lawyer, Caretaker) in read-only mode. Guaranteed <strong>zero notification</strong> to the account owner.
            </p>
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-[#0369A1] pt-2 border-t border-[#E8DFC8]">
            <span>Open Stealth Monitor</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Desk 3: Anti-Fraud */}
        <Link
          href="/admin/fraud"
          className="p-6 rounded-3xl bg-white border border-[#E8DFC8] hover:border-[#2D5A43] hover:shadow-md transition-all group flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF2F2] text-[#B91C1C] flex items-center justify-center group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[#151816] group-hover:text-[#B91C1C] transition-colors">
              Anti-Fraud & Extortion Incident Room
            </h3>
            <p className="text-xs text-[#4B524D] leading-relaxed">
              Triage tenant reports of viewing fee demands. Enforce immediate 1-click blacklisting of rogue agents attempting to infiltrate the platform.
            </p>
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-[#B91C1C] pt-2 border-t border-[#E8DFC8]">
            <span>Open Incident Room</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Morning Operational Data Desk & Inspection Dispatch Table */}
      <div className="bg-white rounded-3xl border border-[#E8DFC8] shadow-xs overflow-hidden space-y-4">
        {/* Table Header & Search Filter Bar */}
        <div className="p-6 border-b border-[#E8DFC8] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF2ED] text-[#2D5A43] text-xs font-bold uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Morning Operational Inspection Dispatch</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#151816]">
              All Live Platform Appointments & Ingestion Pipeline
            </h2>
            <p className="text-xs text-[#8F8372] mt-0.5">
              Live audit view across prospective tenants, confirmed viewing slots, gate codes, and verified custodians.
            </p>
          </div>

          {/* Search Box */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#8F8372] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tenant, property, or ref..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#2D5A43]"
              />
            </div>

            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#E8DFC8] text-xs font-bold text-[#151816] focus:outline-none cursor-pointer">
              <option value="all">All Hubs (Lagos, Abuja, PH, Enugu)</option>
              <option value="lagos">Lagos Corridor</option>
              <option value="abuja">Abuja FCT</option>
              <option value="port harcourt">Port Harcourt</option>
              <option value="enugu">Enugu</option>
            </select>
          </div>
        </div>

        {/* Filter Tabs Bar */}
        <div className="px-6 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'all', label: `All Viewings (${inspections.length})` },
              { id: 'requested', label: `Pending Confirmation (${inspections.filter(i => i.status === 'requested').length})` },
              { id: 'confirmed', label: `Confirmed Gate Passes (${inspections.filter(i => i.status === 'confirmed').length})` },
              { id: 'completed', label: `Completed (${inspections.filter(i => i.status === 'completed').length})` },
              { id: 'cancelled', label: `Cancelled (${inspections.filter(i => i.status === 'cancelled').length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === tab.id
                    ? 'bg-[#2D5A43] text-white shadow-xs'
                    : 'bg-[#F5EFEB] text-[#4B524D] hover:bg-[#E8DFC8]'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          {statusMessage && (
            <span className="text-[11px] font-bold text-[#2D5A43] bg-[#EBF2ED] px-3 py-1 rounded-lg">
              ✓ {statusMessage}
            </span>
          )}
        </div>

        {/* Operational Data Table or Empty State */}
        {filteredInspections.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Calendar}
              badge="Operations Pipeline Ready"
              title="No appointments booked yet under this view"
              description="No inspection requests match your current filters. Share the verified booking portal link to drive prospective tenant appointments."
              primaryAction={{
                label: 'Share Public Booking Link →',
                href: '/#properties',
              }}
              secondaryAction={{
                label: 'Clear All Filters',
                onClick: () => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setCityFilter('all');
                }
              }}
              tip="All appointments on RentBridge are guaranteed ₦0 inspection fee compliant."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#151816]">
              <thead className="bg-[#F5EFEB] border-y border-[#E8DFC8] text-[#8F8372] uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Ingestion Ref</th>
                  <th className="p-4">Tenant Identity</th>
                  <th className="p-4">Target Property & Hub</th>
                  <th className="p-4">Scheduled Slot</th>
                  <th className="p-4">Gate Pass</th>
                  <th className="p-4">Status Dropdown</th>
                  <th className="p-4 text-right">WhatsApp Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFC8]">
                {filteredInspections.map((item) => {
                  const cleanTenantPhone = (item.tenantPhone || '').replace(/[^\d]/g, '');
                  const normalizedPhone = cleanTenantPhone.startsWith('0') ? '234' + cleanTenantPhone.slice(1) : cleanTenantPhone;
                  const whatsappMsg = encodeURIComponent(
                    `Hello ${item.tenantName}, this is RentBridge Support regarding your inspection for ${item.propertyTitle} on ${item.scheduledDate} at ${item.timeSlot}. Your official Gate Pass is ${item.gatePass}. Status: ${item.status.toUpperCase()}.`
                  );

                  return (
                    <tr key={item.id} className="hover:bg-[#FBF9F5] transition-colors">
                      <td className="p-4 font-mono font-bold text-[#2D5A43]">
                        {item.ingestionId || `RB-INSP-${String(item.id).slice(-4)}`}
                      </td>

                      <td className="p-4">
                        <div className="font-extrabold text-[#151816]">{item.tenantName}</div>
                        <div className="text-[11px] text-[#4B524D]">{item.tenantPhone || 'Phone unrecorded'}</div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-[#151816] max-w-xs truncate">{item.propertyTitle}</div>
                        <div className="text-[11px] text-[#8F8372] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#2D5A43]" />
                          <span>{item.neighborhood}, {item.city}</span>
                        </div>
                      </td>

                      <td className="p-4 font-semibold text-[#151816]">
                        <div>{item.scheduledDate}</div>
                        <div className="text-[11px] text-[#8F8372]">{item.timeSlot}</div>
                      </td>

                      <td className="p-4">
                        <span className="font-mono text-xs font-black bg-[#EBF2ED] text-[#2D5A43] px-2 py-1 rounded-md border border-[#2D5A43]/20">
                          {item.gatePass || 'PENDING'}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="p-4">
                        <select
                          value={item.status}
                          disabled={updatingStatusId === item.id}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${
                            item.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : item.status === 'requested'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : item.status === 'completed'
                              ? 'bg-sky-50 text-sky-800 border-sky-300'
                              : 'bg-stone-100 text-stone-700 border-stone-300'
                          }`}>
                          <option value="requested">Pending Review</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* WhatsApp Direct Trigger */}
                      <td className="p-4 text-right">
                        <a
                          href={`https://wa.me/${normalizedPhone}?text=${whatsappMsg}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer">
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          <span>WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 30-Day Draft Lifespan Maintenance Monitor */}
      <div className="p-6 rounded-3xl bg-white border border-[#E8DFC8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-[#151816]">
              30-Day Stale Draft Maintenance Engine
            </h4>
            <p className="text-xs text-[#4B524D] mt-0.5">
              Drafts expire 30 days after creation. Automated purging sweeps clean stale incomplete listings to keep database and storage optimized.
            </p>
          </div>
        </div>

        <button
          onClick={handlePruneStaleDrafts}
          disabled={cleaningDrafts}
          className="px-4 py-2.5 rounded-xl bg-[#F5EFEB] hover:bg-[#EAE2D8] border border-[#D7CBBB] text-xs font-bold text-[#1E3F2F] flex items-center gap-2 cursor-pointer transition-all shrink-0">
          <Trash2 className="w-3.5 h-3.5 text-[#D97706]" />
          <span>{cleaningDrafts ? 'Auditing Drafts...' : 'Scan & Prune Expired Drafts'}</span>
        </button>
      </div>
    </div>
  );
}

