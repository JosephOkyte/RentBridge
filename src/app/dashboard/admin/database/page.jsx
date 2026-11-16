'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { 
  ShieldCheck, 
  Database, 
  Users, 
  Building2, 
  KeyRound, 
  Scale, 
  Home, 
  Phone, 
  Copy, 
  Check, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  ArrowLeft, 
  Calendar, 
  FileText, 
  X, 
  AlertCircle,
  Loader2,
  Clock,
  Sparkles,
  Lock
} from 'lucide-react';

const ROLE_BADGES = {
  landlord: { label: 'Landlord', bg: 'bg-emerald-50 text-emerald-800 border-emerald-300', dot: 'bg-emerald-600', icon: Building2 },
  caretaker: { label: 'Caretaker', bg: 'bg-indigo-50 text-indigo-800 border-indigo-300', dot: 'bg-indigo-600', icon: KeyRound },
  lawyer: { label: 'Lawyer', bg: 'bg-amber-50 text-amber-800 border-amber-300', dot: 'bg-amber-600', icon: Scale },
  lawyers: { label: 'Lawyer', bg: 'bg-amber-50 text-amber-800 border-amber-300', dot: 'bg-amber-600', icon: Scale },
  tenant: { label: 'Tenant', bg: 'bg-sky-50 text-sky-800 border-sky-300', dot: 'bg-sky-600', icon: Home },
  tenants: { label: 'Tenant', bg: 'bg-sky-50 text-sky-800 border-sky-300', dot: 'bg-sky-600', icon: Home },
};

function getBadge(category) {
  const key = (category || '').toLowerCase();
  return ROLE_BADGES[key] || {
    label: category || 'General',
    bg: 'bg-stone-50 text-stone-800 border-stone-300',
    dot: 'bg-stone-500',
    icon: Users
  };
}

export default function AdminDatabasePage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');
  
  const [data, setData] = useState({
    stats: {
      total: 0,
      landlordsCount: 0,
      caretakersCount: 0,
      lawyersCount: 0,
      tenantsCount: 0,
      todayCount: 0,
      lastSynced: null
    },
    sheets: {
      all: [],
      landlord: [],
      caretaker: [],
      lawyers: [],
      tenants: []
    },
    sheetUrl: 'https://docs.google.com/spreadsheets/d/1hMl2nUdVWctK5jIrr55FOlSwpsqKbE94aeTaC8zV0pE/edit?usp=sharing'
  });

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [selectedNoteUser, setSelectedNoteUser] = useState(null);

  // Authentication & Access Control Verification
  useEffect(() => {
    async function verifyAdminAndLoad() {
      try {
        const profRes = await fetch('/api/profile');
        const profData = await profRes.json();
        
        if (!profData.isAdmin && profData.profile?.role !== 'admin') {
          // Bounce non-admins to their user dashboard
          if (profData.profile?.role === 'tenant') {
            router.replace('/dashboard/tenant');
          } else {
            router.replace('/dashboard/landlord');
          }
          return;
        }

        await fetchDatabaseData();
      } catch (err) {
        console.error('Admin verification error:', err);
        setError('Failed to verify admin credentials. Please reload.');
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded) {
      verifyAdminAndLoad();
    }
  }, [isLoaded, router]);

  async function fetchDatabaseData() {
    setSyncing(true);
    setError('');
    try {
      const res = await fetch('/api/admin/onboarded-users');
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching onboarded users:', err);
      setError('Unable to sync live data from Google Sheets. Showing cached data if available.');
    } finally {
      setSyncing(false);
    }
  }

  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Determine current dataset based on active tab
  const currentSheetList = (() => {
    if (activeTab === 'all') return data.sheets.all || [];
    if (activeTab === 'landlord') return data.sheets.landlord || [];
    if (activeTab === 'caretaker') return data.sheets.caretaker || [];
    if (activeTab === 'lawyers') return data.sheets.lawyers || [];
    if (activeTab === 'tenants') return data.sheets.tenants || [];
    return data.sheets.all || [];
  })();

  // Filter based on search query
  const filteredUsers = currentSheetList.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (item.fullName || '').toLowerCase().includes(q) ||
      (item.email || '').toLowerCase().includes(q) ||
      (item.phoneRaw || '').includes(q) ||
      (item.category || '').toLowerCase().includes(q) ||
      (item.note || '').toLowerCase().includes(q)
    );
  });

  const formatLastSyncedTime = (isoString) => {
    if (!isoString) return 'Just now';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return 'Just now';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#2D5A43]" />
        <p className="text-xs font-bold text-[#8F8372]">Connecting to Google Sheets Ingestion Database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      
      {/* Citadel Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#151816] text-white relative overflow-hidden shadow-2xl border border-[#252926]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2D5A43]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/dashboard/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors">
              <ArrowLeft className="w-3.5 h-3.5 text-[#8AE0B3]" />
              <span>Back to Admin Citadel</span>
            </Link>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black uppercase tracking-wider">
              <Database className="w-3.5 h-3.5" />
              <span>Live Ingestion Pipeline</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-black uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              <span>Restricted Ops View</span>
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Onboarded Users Intake Database
            </h1>
            <p className="text-xs sm:text-sm text-[#D4CEC3] leading-relaxed mt-1 max-w-3xl">
              Centralized monitoring repository pulling direct real-time onboarding intakes from Google Sheets across Landlords, Caretakers, Lawyers, and Tenants. Enforces instant outreach and verified ₦0 fee compliance.
            </p>
          </div>

          {/* Top Actions Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={fetchDatabaseData}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing...' : 'Sync with Google Sheet'}</span>
            </button>

            <a
              href={data.sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 transition-all">
              <ExternalLink className="w-4 h-4 text-[#8AE0B3]" />
              <span>Open in Google Sheets ↗</span>
            </a>

            <div className="flex items-center gap-1.5 text-xs text-[#8AE0B3] bg-white/5 px-3 py-2 rounded-xl border border-white/10">
              <Clock className="w-3.5 h-3.5" />
              <span>Last synced: {formatLastSyncedTime(data.stats.lastSynced)}</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs font-bold text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-amber-700 hover:text-amber-950 font-bold">✕</button>
        </div>
      )}

      {/* Aggregate KPI Stats Cards across the 4 sheets */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Total Users */}
        <div className="p-4 rounded-2xl bg-white border border-[#E8DFC8] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#8F8372]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Intakes</span>
            <Users className="w-3.5 h-3.5 text-[#2D5A43]" />
          </div>
          <p className="text-2xl font-black text-[#151816]">{data.stats.total}</p>
          <p className="text-[10px] text-[#2D5A43] font-semibold">All 4 Sheets Combined</p>
        </div>

        {/* Landlords */}
        <div className="p-4 rounded-2xl bg-white border border-[#E8DFC8] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#8F8372]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Landlords</span>
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700">{data.stats.landlordsCount}</p>
          <p className="text-[10px] text-stone-500 font-semibold">Direct Owners</p>
        </div>

        {/* Caretakers */}
        <div className="p-4 rounded-2xl bg-white border border-[#E8DFC8] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#8F8372]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Caretakers</span>
            <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-indigo-700">{data.stats.caretakersCount}</p>
          <p className="text-[10px] text-stone-500 font-semibold">Key Custodians</p>
        </div>

        {/* Lawyers */}
        <div className="p-4 rounded-2xl bg-white border border-[#E8DFC8] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#8F8372]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Lawyers</span>
            <Scale className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-700">{data.stats.lawyersCount}</p>
          <p className="text-[10px] text-stone-500 font-semibold">Legal Deed Reps</p>
        </div>

        {/* Tenants */}
        <div className="p-4 rounded-2xl bg-white border border-[#E8DFC8] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#8F8372]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Tenants</span>
            <Home className="w-3.5 h-3.5 text-sky-600" />
          </div>
          <p className="text-2xl font-black text-sky-700">{data.stats.tenantsCount}</p>
          <p className="text-[10px] text-stone-500 font-semibold">Direct Renters</p>
        </div>

        {/* Today's Intake */}
        <div className="p-4 rounded-2xl bg-white border border-[#E8DFC8] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#8F8372]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Today's Intake</span>
            <Sparkles className="w-3.5 h-3.5 text-[#2D5A43]" />
          </div>
          <p className="text-2xl font-black text-[#151816]">{data.stats.todayCount}</p>
          <p className="text-[10px] text-emerald-600 font-semibold">Past 24 Hours</p>
        </div>

      </div>

      {/* Main Database Table Container */}
      <div className="bg-white rounded-3xl border border-[#E8DFC8] shadow-xs overflow-hidden">
        
        {/* Table Controls Bar: Tabs & Search */}
        <div className="p-5 sm:p-6 border-b border-[#E8DFC8] space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Sheet Role Tabs Switcher */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All Submissions', count: data.stats.total, icon: Database },
                { id: 'landlord', label: 'Landlords', count: data.stats.landlordsCount, icon: Building2 },
                { id: 'caretaker', label: 'Caretakers', count: data.stats.caretakersCount, icon: KeyRound },
                { id: 'lawyers', label: 'Lawyers', count: data.stats.lawyersCount, icon: Scale },
                { id: 'tenants', label: 'Tenants', count: data.stats.tenantsCount, icon: Home },
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#2D5A43] text-white shadow-sm'
                        : 'bg-[#FBF9F5] text-[#4B524D] hover:bg-[#E8DFC8]/40 border border-[#E8DFC8]'
                    }`}>
                    <TabIcon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isActive ? 'bg-white/20 text-white' : 'bg-black/5 text-[#8F8372]'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input Box */}
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-[#8F8372] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, email, phone, note..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#FBF9F5] border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#2D5A43] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>
        </div>

        {/* The Users Table */}
        <div className="overflow-x-auto">
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FBF9F5] text-[#8F8372] flex items-center justify-center mx-auto border border-[#E8DFC8]">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#151816]">No matching onboarded records found</h3>
              <p className="text-xs text-[#8F8372] max-w-sm mx-auto">
                {searchQuery 
                  ? `No entries match "${searchQuery}" in this sheet. Clear search or check other tabs.`
                  : 'No submissions recorded in this sheet tab yet.'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#2D5A43] text-white text-xs font-bold cursor-pointer">
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FBF9F5] border-b border-[#E8DFC8] text-[11px] font-bold text-[#8F8372] uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Timestamp</th>
                  <th className="py-3.5 px-4">User Identity</th>
                  <th className="py-3.5 px-4">Sheet / Category</th>
                  <th className="py-3.5 px-4">Direct Contact & Outreach</th>
                  <th className="py-3.5 px-4">Intake Notes</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFC8]/60 text-xs">
                {filteredUsers.map((item) => {
                  const badge = getBadge(item.category || item.sheetSource);
                  const BadgeIcon = badge.icon;
                  const hasPhone = Boolean(item.phoneDial);

                  return (
                    <tr key={item.id} className="hover:bg-[#FBF9F5]/70 transition-colors">
                      
                      {/* Timestamp */}
                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-[#151816] font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-[#8F8372]" />
                          <span>{item.timestampDisplay}</span>
                        </div>
                      </td>

                      {/* User Identity */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#EBF2ED] text-[#2D5A43] font-bold text-xs flex items-center justify-center shrink-0 border border-[#2D5A43]/20">
                            {item.fullName?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-extrabold text-[#151816] tracking-tight text-xs sm:text-sm">
                              {item.fullName}
                            </p>
                            <p className="text-[11px] text-[#8F8372]">
                              {item.email || 'No email provided'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Sheet / Category Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                          <BadgeIcon className="w-3 h-3" />
                          <span>{badge.label}</span>
                        </span>
                      </td>

                      {/* Direct Contact & Outreach (Phone Call + Copy) */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#151816] text-xs">
                              {item.phoneFormatted}
                            </span>
                            
                            {hasPhone && (
                              <button
                                type="button"
                                onClick={() => handleCopy(item.phoneRaw || item.phoneDial, `phone-${item.id}`)}
                                title="Copy Phone Number"
                                className="p-1 rounded hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer">
                                {copiedId === `phone-${item.id}` ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            )}
                          </div>

                          {/* 1-Click Call Button */}
                          {hasPhone ? (
                            <a
                              href={`tel:${item.phoneDial}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-[11px] font-bold shadow-xs transition-colors">
                              <Phone className="w-3 h-3" />
                              <span>Call Client</span>
                            </a>
                          ) : (
                            <span className="text-[11px] text-stone-400 italic">No phone available</span>
                          )}
                        </div>
                      </td>

                      {/* Intake Notes (Truncated Preview) */}
                      <td className="py-4 px-4 max-w-xs">
                        {item.note ? (
                          <div>
                            <p className="line-clamp-2 text-stone-700 text-[11px] leading-relaxed">
                              {item.note}
                            </p>
                            <button
                              type="button"
                              onClick={() => setSelectedNoteUser(item)}
                              className="text-[11px] font-bold text-[#2D5A43] hover:underline mt-0.5 inline-block cursor-pointer">
                              View full note →
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-stone-400 italic">None specified</span>
                        )}
                      </td>

                      {/* Quick Actions (Copy Email, View Details) */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.email && (
                            <button
                              type="button"
                              onClick={() => handleCopy(item.email, `email-${item.id}`)}
                              title="Copy Email Address"
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-semibold border border-stone-200 transition-colors cursor-pointer">
                              {copiedId === `email-${item.id}` ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Email</span>
                                </>
                              )}
                            </button>
                          )}

                          {item.note && (
                            <button
                              type="button"
                              onClick={() => setSelectedNoteUser(item)}
                              title="Open Full Details"
                              className="p-1.5 rounded-lg bg-[#EBF2ED] text-[#2D5A43] hover:bg-[#2D5A43] hover:text-white transition-colors cursor-pointer">
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Summary Bar */}
        <div className="p-4 bg-[#FBF9F5] border-t border-[#E8DFC8] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8F8372] gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2D5A43]" />
            <span>Direct custodian data synced from Google Sheet ID: <code className="font-mono text-[10px] bg-stone-200 px-1 py-0.5 rounded">1hMl2n...</code></span>
          </div>
          <div>
            Showing <strong className="text-[#151816]">{filteredUsers.length}</strong> of <strong className="text-[#151816]">{currentSheetList.length}</strong> records
          </div>
        </div>

      </div>

      {/* Note Details Drawer / Modal */}
      {selectedNoteUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#E8DFC8] space-y-4 animate-in zoom-in-95 duration-150 relative">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border mb-1.5 bg-[#EBF2ED] text-[#2D5A43] border-[#2D5A43]/20">
                  <Database className="w-3 h-3" />
                  <span>Onboarding Intake Profile</span>
                </div>
                <h3 className="text-lg font-black text-[#151816]">
                  {selectedNoteUser.fullName}
                </h3>
                <p className="text-xs text-[#8F8372]">
                  Registered as <strong>{selectedNoteUser.category}</strong> • {selectedNoteUser.timestampDisplay}
                </p>
              </div>

              <button
                onClick={() => setSelectedNoteUser(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Contact Card */}
            <div className="p-3.5 rounded-2xl bg-[#FBF9F5] border border-[#E8DFC8] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#8F8372] font-semibold">Phone:</span>
                <span className="font-mono font-bold text-[#151816]">{selectedNoteUser.phoneFormatted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8F8372] font-semibold">Email:</span>
                <span className="font-semibold text-[#151816]">{selectedNoteUser.email || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8F8372] font-semibold">Source Sheet:</span>
                <span className="font-bold text-[#2D5A43]">{selectedNoteUser.sheetSource}</span>
              </div>
            </div>

            {/* Note Content */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-[#151816] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#2D5A43]" />
                <span>Intake Note & Preferences:</span>
              </h4>
              <div className="p-4 rounded-2xl bg-[#F5EFEB] border border-[#E8DFC8] text-xs text-[#151816] leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap font-medium">
                {selectedNoteUser.note || 'No notes provided by user.'}
              </div>
            </div>

            {/* Outreach Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E8DFC8]">
              {selectedNoteUser.phoneDial && (
                <a
                  href={`tel:${selectedNoteUser.phoneDial}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-xs font-bold shadow-sm transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {selectedNoteUser.phoneFormatted}</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => setSelectedNoteUser(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer">
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
