'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  Search, 
  Filter, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  Lock, 
  PlusCircle, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  Share2, 
  Check, 
  HelpCircle,
  Home,
  Tag,
  Loader2
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EmptyState from '../../components/EmptyState';
import PostRequestModal from '../../components/PostRequestModal';
import ProposePropertyModal from '../../components/ProposePropertyModal';
import { formatNaira } from '../../utils/formatters';
import { PROPERTIES } from '../../data/properties';

const CITIES = [
  { id: 'all', name: 'All Hubs' },
  { id: 'lagos', name: 'Lagos' },
  { id: 'abuja', name: 'Abuja' },
  { id: 'ph', name: 'Port Harcourt' },
  { id: 'enugu', name: 'Enugu' },
];

const PROPERTY_TYPES = [
  { id: 'all', label: 'All Property Types' },
  { id: 'mini_flat', label: 'Mini-Flat / Self-Contain' },
  { id: '2_bed_apartment', label: '2-Bed Apartments' },
  { id: '3_bed_apartment', label: '3-Bed Luxury Flats' },
  { id: '3_bed_duplex', label: '3-Bed Duplex / Terraces' },
  { id: 'commercial_office', label: 'Commercial & Offices' },
];

function RequestsContent() {
  const searchParams = useSearchParams();
  const ticketParam = searchParams?.get('ticket');

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState(ticketParam || '');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [proposeTargetRequest, setProposeTargetRequest] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Load requests from API
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCity !== 'all') params.append('city', selectedCity);
      if (selectedType !== 'all') params.append('propertyType', selectedType);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/requests?${params.toString()}`);
      const data = await res.json();
      if (data.requests) {
        setRequests(data.requests);
      }
    } catch (err) {
      console.warn('Failed to load requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [selectedCity, selectedType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRequests();
  };

  const handleCopyTicket = (ticketId) => {
    const url = `${window.location.origin}/requests?ticket=${ticketId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(ticketId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // KPI calculations
  const totalRequests = requests.length;
  const avgMaxBudget = totalRequests > 0 
    ? Math.round(requests.reduce((acc, curr) => acc + (Number(curr.maxBudget) || 0), 0) / totalRequests)
    : 4500000;

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#151816]">
      <Navbar onOpenListModal={() => {}} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 w-full">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#8F8372]">
          <Link href="/" className="hover:text-[#2D5A43] flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span className="text-[#151816]">Wanted Seeker Matchboard</span>
        </div>

        {/* Hero Header */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#1E3F2F] text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#8AE0B3]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#8AE0B3] text-xs font-bold uppercase tracking-wider border border-white/10">
              <Sparkles className="w-4 h-4" />
              <span>Reverse Marketplace & Anti-Agent Shield</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              The Wanted Seeker Matchboard
            </h1>

            <p className="text-sm sm:text-base text-[#E2D7C8] leading-relaxed">
              Don&apos;t waste weeks scrolling through roadside agent duplicates. Post your exact housing requirements with <strong>100% masked contact info</strong>. Verified landlords and authorized legal custodians pitch matching homes directly to you with <strong>₦0 agent fees</strong>.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#8AE0B3] hover:bg-[#72cca1] text-[#151816] font-black text-xs sm:text-sm tracking-tight shadow-lg shadow-[#8AE0B3]/25 transition-all cursor-pointer">
                <PlusCircle className="w-4 h-4 text-[#151816]" />
                <span>Post a Housing Request (100% Free)</span>
              </button>

              <Link
                href="/dashboard/landlord"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/15 transition-all">
                <Building2 className="w-4 h-4 text-[#8AE0B3]" />
                <span>I&apos;m a Landlord: Match My Vacancies</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#8AE0B3]" />
              </Link>
            </div>
          </div>
        </div>

        {/* Live Market KPI Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8DFC8] shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8F8372]">
              <Tag className="w-4 h-4 text-[#2D5A43]" />
              <span>Active Seeker Demands</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#151816] mt-1.5">
              {totalRequests}
            </div>
            <p className="text-[11px] text-[#4B524D] mt-1">Live requests awaiting direct owner match</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8DFC8] shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8F8372]">
              <DollarSign className="w-4 h-4 text-[#2D5A43]" />
              <span>Average Seeker Budget</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#2D5A43] mt-1.5">
              {formatNaira(avgMaxBudget)}
            </div>
            <p className="text-[11px] text-[#4B524D] mt-1">Ready-to-pay annual rent budget</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8DFC8] shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8F8372]">
              <Clock className="w-4 h-4 text-[#2D5A43]" />
              <span>Average Match Velocity</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#151816] mt-1.5">
              &lt; 48 Hours
            </div>
            <p className="text-[11px] text-[#4B524D] mt-1">From ticket post to verified inspection pass</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8DFC8] shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8F8372]">
              <ShieldCheck className="w-4 h-4 text-[#2D5A43]" />
              <span>Middleman Commission</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#2D5A43] mt-1.5">
              ₦0 (Zero)
            </div>
            <p className="text-[11px] text-[#4B524D] mt-1">Pure direct custodian handshake guaranteed</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-5 rounded-3xl bg-white border border-[#E8DFC8] shadow-xs space-y-4">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* City Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar">
              {CITIES.map((city) => (
                <button
                  key={city.id}
                  onClick={() => setSelectedCity(city.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    selectedCity === city.id
                      ? 'bg-[#2D5A43] text-white shadow-xs'
                      : 'bg-[#F5EFEB] text-[#4B524D] hover:bg-[#EAE2D8]'
                  }`}>
                  {city.name}
                </button>
              ))}
            </div>

            {/* Property Type Dropdown */}
            <div className="w-full md:w-64">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7CBBB] bg-[#FBF9F5] text-xs font-semibold text-[#151816] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]">
                {PROPERTY_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Keyword Search */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-72">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#8F8372] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search ticket, area, or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#D7CBBB] bg-[#FBF9F5] text-[#151816] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-[#2D5A43] text-white text-xs font-bold hover:bg-[#1E3F2F] cursor-pointer transition-all">
                Find
              </button>
            </form>

          </div>

        </div>

        {/* Requests Feed Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#2D5A43] mx-auto" />
            <p className="text-xs font-bold text-[#8F8372]">Scanning live seeker demands across Nigeria...</p>
          </div>
        ) : requests.length === 0 ? (
          <EmptyState
            badge="Wanted Board Active"
            title="No Matching Seeker Requests Found"
            description="There are currently no active housing requests matching this specific filter. Be the first tenant to submit your requirements!"
            primaryAction={{
              label: "Post a Housing Request →",
              onClick: () => setIsPostModalOpen(true),
            }}
            secondaryAction={{
              label: "Reset All Filters",
              onClick: () => {
                setSelectedCity('all');
                setSelectedType('all');
                setSearchQuery('');
              },
            }}
            securityTip="RentBridge shields tenant phone numbers and guarantees ₦0 viewing fees on every proposal."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {requests.map((req) => (
              <div
                key={req.id || req.ticketId}
                className="rounded-3xl bg-white border border-[#E8DFC8] p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                
                {/* Card Top: Ticket Header & Badges */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-[#2D5A43] bg-[#EBF2ED] px-2.5 py-1 rounded-lg border border-[#8AE0B3]/40">
                      {req.ticketId}
                    </span>

                    <button
                      onClick={() => handleCopyTicket(req.ticketId)}
                      title="Copy Request Link"
                      className="p-1.5 rounded-lg text-[#8F8372] hover:text-[#151816] hover:bg-[#F5EFEB] transition-colors cursor-pointer">
                      {copiedId === req.ticketId ? (
                        <Check className="w-4 h-4 text-[#2D5A43]" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Seeker Info & Privacy Shield */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-[#151816]">
                        {req.seekerName}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2D5A43] bg-[#EBF2ED] px-1.5 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3 text-[#2D5A43]" />
                        Verified Seeker
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[#8F8372] mt-1">
                      <Lock className="w-3 h-3 text-[#2D5A43]" />
                      <span>{req.seekerPhoneMasked || '+234 ••• ••• •••• (Shielded)'}</span>
                    </div>
                  </div>

                  {/* Property Demand & Target Hub */}
                  <div className="p-3 rounded-2xl bg-[#F5EFEB] border border-[#E8DFC8] space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-[#151816]">
                      <Building2 className="w-3.5 h-3.5 text-[#2D5A43]" />
                      <span>{req.propertyTypeLabel || 'Apartment / Flat'}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[#4B524D]">
                      <MapPin className="w-3.5 h-3.5 text-[#2D5A43]" />
                      <span className="capitalize font-semibold">{req.cityName || req.city}:</span>
                      <span>{req.preferredLocations?.slice(0, 3).join(', ')}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[#4B524D]">
                      <Clock className="w-3.5 h-3.5 text-[#2D5A43]" />
                      <span>Timeline: <strong>{req.moveInTimelineLabel || 'Within 14 Days'}</strong></span>
                    </div>
                  </div>

                  {/* Budget Bracket */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F8372] block">
                      Target Budget:
                    </span>
                    <div className="text-lg font-black text-[#2D5A43]">
                      {formatNaira(req.minBudget)} – {formatNaira(req.maxBudget)}
                      <span className="text-xs font-semibold text-[#8F8372]"> / year</span>
                    </div>
                  </div>

                  {/* Must-Haves Tags */}
                  {req.mustHaves && req.mustHaves.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {req.mustHaves.map((item) => (
                        <span
                          key={item}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F5EFEB] text-[#1E3F2F] border border-[#D7CBBB]">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Seeker Bio */}
                  {req.seekerBio && (
                    <p className="text-xs text-[#4B524D] italic line-clamp-2 bg-[#FBF9F5] p-2.5 rounded-xl border border-[#E8DFC8]/60">
                      &ldquo;{req.seekerBio}&rdquo;
                    </p>
                  )}
                </div>

                {/* Card Action */}
                <div className="pt-3 border-t border-[#E8DFC8]">
                  <button
                    onClick={() => setProposeTargetRequest(req)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Propose My Verified Property →</span>
                  </button>
                  <p className="text-[10px] text-center text-[#8F8372] mt-1.5">
                    {req.proposalsCount || 0} direct proposals received so far
                  </p>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>

      {/* Post Request Modal */}
      <PostRequestModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSuccess={() => {
          fetchRequests();
        }}
      />

      {/* Propose Property Modal */}
      <ProposePropertyModal
        isOpen={Boolean(proposeTargetRequest)}
        onClose={() => setProposeTargetRequest(null)}
        request={proposeTargetRequest}
        myProperties={PROPERTIES}
        onSuccess={() => {
          fetchRequests();
        }}
      />

      <Footer />
    </div>
  );
}

export default function RequestsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FBF9F5]">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#2D5A43] mx-auto" />
          <p className="text-xs font-bold text-[#8F8372]">Loading Seeker Matchboard...</p>
        </div>
      </div>
    }>
      <RequestsContent />
    </Suspense>
  );
}

